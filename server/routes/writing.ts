/**
 * P2-3: 写作模块（Writing Module）API
 *
 * 设计原则（与 reading 路由同构）：
 *   1. 公开题目接口免登录可读；提交需要 auth
 *   2. 题目本体与翻译分离；翻译按 baseLanguageCode fallback
 *   3. 每次提交保存为独立记录（不 upsert-by-best），保留全部作品历史
 *
 * 路由：
 *   GET  /writing?language=ja&level=N5&type=essay&nativeLanguage=en  (no auth) 列表
 *   GET  /writing/:id?nativeLanguage=en                              (no auth) 详情
 *   GET  /writing/progress?language=ja                               (auth)    用户提交历史
 *   POST /writing/:id/submit                                         (auth)    提交写作（含评分）
 *
 * 评分算法（简单本地版）：
 *   * lengthScore：在 [minWords, maxWords] 区间得 100；不足或超出按比例扣分
 *   * varietyScore：1 - (重复词数 / 总词数)，按比例映射到 0-100
 *   * keywordScore：命中的关键词数 / 关键词总数 * 100
 *   * score = round(lengthScore * 0.3 + varietyScore * 0.3 + keywordScore * 0.4)
 */

import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

// ============================================================
// 缓存
// ============================================================

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

// ============================================================
// 翻译 fallback（与 reading.ts pickPassageTranslation 同构）
// ============================================================

interface WritingTranslationRow {
  baseLanguageCode: string;
  title: string;
  prompt: string;
  tips: unknown;
  sampleAnswer: string | null;
}

function pickWritingTranslation(
  translations: WritingTranslationRow[],
  nativeLanguage: string
): { title: string; prompt: string; tips: string[]; sampleAnswer: string | null } {
  const exact = translations.find((t) => t.baseLanguageCode === nativeLanguage);
  if (exact) {
    return {
      title: exact.title,
      prompt: exact.prompt,
      tips: Array.isArray(exact.tips) ? (exact.tips as string[]) : [],
      sampleAnswer: exact.sampleAnswer,
    };
  }
  const en = translations.find((t) => t.baseLanguageCode === "en");
  if (en) {
    return {
      title: en.title,
      prompt: en.prompt,
      tips: Array.isArray(en.tips) ? (en.tips as string[]) : [],
      sampleAnswer: en.sampleAnswer,
    };
  }
  const any = translations[0];
  if (any) {
    return {
      title: any.title,
      prompt: any.prompt,
      tips: Array.isArray(any.tips) ? (any.tips as string[]) : [],
      sampleAnswer: any.sampleAnswer,
    };
  }
  return { title: "", prompt: "", tips: [], sampleAnswer: null };
}

// ============================================================
// 评分算法
// ============================================================

/** 简单分词：按空格 / 标点切分；对 CJK 字符按字符计数 */
function tokenize(text: string): { words: string[]; isCjk: boolean } {
  if (!text) return { words: [], isCjk: false };
  // 检测是否主要为 CJK（中文/日文/韩文）
  const cjkChars = (text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) ?? []).length;
  const isCjk = cjkChars > text.length * 0.3;

  if (isCjk) {
    // CJK：去除标点后按字符计数（去掉空格）
    const chars = text.replace(/[\s\p{P}]/gu, "").split("");
    return { words: chars, isCjk: true };
  }
  // 拉丁字母：按空格切分（去除标点）
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return { words, isCjk: false };
}

interface ScoreResult {
  wordCount: number;
  score: number;
  lengthScore: number;
  varietyScore: number;
  keywordScore: number;
  feedback: {
    lengthHint: string;
    varietyHint: string;
    keywordHint: string;
    matchedKeywords: string[];
    missedKeywords: string[];
    suggestions: string[];
  };
}

function computeScore(
  content: string,
  opts: { minWords: number; maxWords: number; keywords: string[]; isCjkHint?: boolean }
): ScoreResult {
  const { words, isCjk } = tokenize(content);
  const wordCount = words.length;
  const { minWords, maxWords, keywords } = opts;

  // ===== lengthScore =====
  let lengthScore: number;
  let lengthHint: string;
  if (wordCount < minWords) {
    // 不足下限：按比例扣分
    lengthScore = Math.round((wordCount / minWords) * 100);
    lengthHint = `字数偏少（${wordCount} / 推荐 ${minWords}-${maxWords}），可补充更多细节或例证`;
  } else if (wordCount > maxWords * 1.5) {
    // 超出 1.5 倍上限：扣分
    const excess = wordCount - maxWords;
    lengthScore = Math.max(40, 100 - Math.floor(excess / maxWords) * 20);
    lengthHint = `字数偏多（${wordCount} / 推荐 ${minWords}-${maxWords}），可适当精简`;
  } else {
    lengthScore = 100;
    lengthHint = `字数合适（${wordCount} 字，推荐 ${minWords}-${maxWords}）`;
  }

  // ===== varietyScore：1 - 重复率 =====
  let varietyScore: number;
  let varietyHint: string;
  if (wordCount === 0) {
    varietyScore = 0;
    varietyHint = "尚未提交内容";
  } else {
    const freq = new Map<string, number>();
    for (const w of words) {
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
    const uniqueCount = freq.size;
    const repeatCount = wordCount - uniqueCount;
    const repeatRate = repeatCount / wordCount;
    varietyScore = Math.round((1 - Math.min(repeatRate, 1)) * 100);
    if (varietyScore >= 80) {
      varietyHint = `词汇多样（${uniqueCount} 个不同词 / 共 ${wordCount} 词）`;
    } else if (varietyScore >= 60) {
      varietyHint = `词汇较为多样（${uniqueCount} 个不同词），可尝试用同义替换重复词`;
    } else {
      varietyHint = `词汇重复较多（${uniqueCount} 个不同词 / 共 ${wordCount} 词），建议替换高频重复词`;
    }
  }

  // ===== keywordScore =====
  let keywordScore: number;
  let keywordHint: string;
  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];
  if (keywords.length === 0) {
    keywordScore = 100; // 无关键词要求时满分
    keywordHint = "本题未设置关键词要求";
  } else {
    const lower = content.toLowerCase();
    for (const kw of keywords) {
      const k = kw.toLowerCase();
      if (lower.includes(k)) matchedKeywords.push(kw);
      else missedKeywords.push(kw);
    }
    keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100);
    if (matchedKeywords.length === keywords.length) {
      keywordHint = `命中全部 ${keywords.length} 个关键词`;
    } else if (matchedKeywords.length > 0) {
      keywordHint = `命中 ${matchedKeywords.length} / ${keywords.length} 个关键词，缺失：${missedKeywords.join(", ")}`;
    } else {
      keywordHint = `未命中任何关键词（${keywords.length} 个期望词），建议围绕主题展开`;
    }
  }

  // ===== 综合评分 =====
  const score = Math.round(lengthScore * 0.3 + varietyScore * 0.3 + keywordScore * 0.4);

  // ===== 综合建议 =====
  const suggestions: string[] = [];
  if (lengthScore < 80) suggestions.push(lengthHint);
  if (varietyScore < 80) suggestions.push(varietyHint);
  if (keywordScore < 80) suggestions.push(keywordHint);
  if (isCjk) {
    suggestions.push("中文/日文/韩文写作：注意标点与段落分隔，避免一逗到底");
  }
  if (suggestions.length === 0) {
    suggestions.push("整体表现良好，继续保持！");
  }

  return {
    wordCount,
    score,
    lengthScore,
    varietyScore,
    keywordScore,
    feedback: {
      lengthHint,
      varietyHint,
      keywordHint,
      matchedKeywords,
      missedKeywords,
      suggestions,
    },
  };
}

// ============================================================
// 路由
// ============================================================

const writingRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 1. 列表：按 language + level + type 过滤（无登录）======
  fastify.get<{
    Querystring: { language?: string; level?: string; type?: string; nativeLanguage?: string };
  }>("/writing", async (request, reply) => {
    const { language, level, type, nativeLanguage = "en" } = request.query;

    const cacheKey = `writing:list:${language ?? "all"}:${level ?? "all"}:${type ?? "all"}:${nativeLanguage}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return sendSuccess(reply, cached.data);
    }

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (level) where.level = level;
    if (type) where.type = type;

    const prompts = await prisma.writingPrompt.findMany({
      where,
      orderBy: [{ writeOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        languageCode: true,
        level: true,
        type: true,
        title: true,
        minWords: true,
        maxWords: true,
        estMinutes: true,
        writeOrder: true,
        translations: {
          where: { OR: [{ baseLanguageCode: nativeLanguage }, { baseLanguageCode: "en" }] },
          select: { baseLanguageCode: true, title: true, prompt: true, tips: true, sampleAnswer: true },
        },
      },
    });

    const result = prompts.map((p) => {
      const t = pickWritingTranslation(p.translations, nativeLanguage);
      return {
        id: p.id,
        language: p.languageCode,
        level: p.level,
        type: p.type,
        title: t.title || p.title,
        prompt: t.prompt,
        tips: t.tips,
        minWords: p.minWords,
        maxWords: p.maxWords,
        estMinutes: p.estMinutes,
      };
    });

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return sendSuccess(reply, result);
  });

  // ====== 2. 详情：取单条 prompt（无登录）======
  fastify.get<{
    Params: { id: string };
    Querystring: { nativeLanguage?: string };
  }>("/writing/:id", async (request, reply) => {
    const { id } = request.params;
    const nativeLanguage = request.query.nativeLanguage || "en";

    const cacheKey = `writing:detail:${id}:${nativeLanguage}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
      return sendSuccess(reply, cached.data);
    }

    const prompt = await prisma.writingPrompt.findUnique({
      where: { id },
      select: {
        id: true,
        languageCode: true,
        level: true,
        type: true,
        title: true,
        prompt: true,
        tips: true,
        minWords: true,
        maxWords: true,
        estMinutes: true,
        sampleAnswer: true,
        keywords: true,
        writeOrder: true,
        translations: {
          where: { OR: [{ baseLanguageCode: nativeLanguage }, { baseLanguageCode: "en" }] },
          select: { baseLanguageCode: true, title: true, prompt: true, tips: true, sampleAnswer: true },
        },
      },
    });

    if (!prompt) {
      return sendError(reply, "NOT_FOUND", "该写作题目不存在");
    }

    const t = pickWritingTranslation(prompt.translations, nativeLanguage);
    const result = {
      id: prompt.id,
      language: prompt.languageCode,
      level: prompt.level,
      type: prompt.type,
      title: t.title || prompt.title,
      prompt: t.prompt || prompt.prompt,
      tips: t.tips.length > 0 ? t.tips : (Array.isArray(prompt.tips) ? (prompt.tips as string[]) : []),
      minWords: prompt.minWords,
      maxWords: prompt.maxWords,
      estMinutes: prompt.estMinutes,
      sampleAnswer: t.sampleAnswer ?? prompt.sampleAnswer ?? null,
      keywords: Array.isArray(prompt.keywords) ? (prompt.keywords as string[]) : [],
      nativeLanguage,
    };

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    reply.header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    return sendSuccess(reply, result);
  });

  // ====== 3. 用户提交历史（auth）======
  fastify.get<{
    Querystring: { language?: string };
  }>("/writing/progress", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { language } = request.query;

    const submissions = await prisma.userWritingSubmission.findMany({
      where: {
        userId,
        ...(language ? { prompt: { languageCode: language } } : {}),
      },
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        writingId: true,
        content: true,
        wordCount: true,
        score: true,
        lengthScore: true,
        varietyScore: true,
        keywordScore: true,
        feedback: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        prompt: {
          select: { id: true, title: true, level: true, type: true, languageCode: true },
        },
      },
    });

    return sendSuccess(
      reply,
      submissions.map((s) => ({
        id: s.id,
        writingId: s.writingId,
        content: s.content,
        wordCount: s.wordCount,
        score: s.score,
        lengthScore: s.lengthScore,
        varietyScore: s.varietyScore,
        keywordScore: s.keywordScore,
        feedback: s.feedback,
        status: s.status,
        submittedAt: s.submittedAt,
        reviewedAt: s.reviewedAt,
        prompt: s.prompt,
      }))
    );
  });

  // ====== 4. 提交写作（auth，含评分）======
  fastify.post<{
    Params: { id: string };
    Body: { content?: string };
  }>("/writing/:id/submit", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { id: writingId } = request.params;
    const body = request.body ?? ({} as typeof request.body);
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!content) {
      return sendError(reply, "BAD_REQUEST", "内容不能为空");
    }
    if (content.length > 10_000) {
      return sendError(reply, "BAD_REQUEST", "内容过长（上限 10000 字符）");
    }

    const prompt = await prisma.writingPrompt.findUnique({
      where: { id: writingId },
      select: { id: true, minWords: true, maxWords: true, keywords: true },
    });
    if (!prompt) {
      return sendError(reply, "NOT_FOUND", "该写作题目不存在");
    }

    const keywords = Array.isArray(prompt.keywords) ? (prompt.keywords as string[]) : [];
    const scoreResult = computeScore(content, {
      minWords: prompt.minWords,
      maxWords: prompt.maxWords,
      keywords,
    });

    const submission = await prisma.userWritingSubmission.create({
      data: {
        userId,
        writingId,
        content,
        wordCount: scoreResult.wordCount,
        score: scoreResult.score,
        lengthScore: scoreResult.lengthScore,
        varietyScore: scoreResult.varietyScore,
        keywordScore: scoreResult.keywordScore,
        feedback: scoreResult.feedback as unknown as object,
        status: "submitted",
        reviewedAt: new Date(),
      },
    });

    request.log.info(
      { userId, writingId, wordCount: scoreResult.wordCount, score: scoreResult.score },
      "writing/submit: saved"
    );

    return sendSuccess(reply, {
      id: submission.id,
      writingId: submission.writingId,
      wordCount: submission.wordCount,
      score: submission.score,
      lengthScore: submission.lengthScore,
      varietyScore: submission.varietyScore,
      keywordScore: submission.keywordScore,
      feedback: submission.feedback,
      status: submission.status,
      submittedAt: submission.submittedAt,
    });
  });
};

export default writingRoutes;
