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
import { tokenize, computeScore } from "../lib/writing-score.js";
import type { ScoreResult } from "../lib/writing-score.js";

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
