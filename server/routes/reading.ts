/**
 * P1-2: 阅读模块（Reading Module）
 *
 * 设计原则：
 *   1. 与 listening/speaking 路由同构，公开内容接口免登录可读
 *   2. 题目（questions）和词汇注释（glossary）以 JSONB 存于 ReadingPassage，
 *      避免对每题做 join；本地化策略：题目 JSON 自带 translations 字段
 *   3. ReadingTranslation 仅翻译 title + summary（用于卡片预览），不翻译题目
 *   4. 进度记录 upsert，重做时取最佳正确率
 *
 * 路由：
 *   GET  /reading?language=ja&level=N5&nativeLanguage=en     (no auth) 列表
 *   GET  /reading/:id?nativeLanguage=en                      (no auth) 详情
 *   GET  /reading/progress?language=ja                       (auth)    该语言进度
 *   POST /reading/:id/progress                                (auth)    提交作答
 */

import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("reading");

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

/** Pick the best (title, summary) translation for the user's native language. */
function pickPassageTranslation(
  translations: { baseLanguageCode: string; title: string; summary: string }[],
  nativeLanguage: string
): { title: string; summary: string } {
  const exact = translations.find((t) => t.baseLanguageCode === nativeLanguage);
  if (exact) return { title: exact.title, summary: exact.summary };
  const en = translations.find((t) => t.baseLanguageCode === "en");
  if (en) return { title: en.title, summary: en.summary };
  const any = translations[0];
  if (any) return { title: any.title, summary: any.summary };
  return { title: "", summary: "" };
}

interface ComprehensionResult {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

const readingRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 1. 列表：按 language + level 过滤（无登录）======
  fastify.get<{
    Querystring: { language?: string; level?: string; nativeLanguage?: string };
  }>("/reading", async (request, reply) => {
    const { language, level, nativeLanguage = "en" } = request.query;

    const cacheKey = `reading:list:${language ?? "all"}:${level ?? "all"}:${nativeLanguage}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return sendSuccess(reply, cached.data);
    }

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (level) where.level = level;

    const passages = await prisma.readingPassage.findMany({
      where,
      orderBy: [{ readOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        languageCode: true,
        level: true,
        title: true,
        wordCount: true,
        estMinutes: true,
        source: true,
        readOrder: true,
        translations: {
          where: { OR: [{ baseLanguageCode: nativeLanguage }, { baseLanguageCode: "en" }] },
          select: { baseLanguageCode: true, title: true, summary: true },
        },
      },
    });

    const result = passages.map((p) => {
      const t = pickPassageTranslation(p.translations, nativeLanguage);
      return {
        id: p.id,
        language: p.languageCode,
        level: p.level,
        title: t.title || p.title,
        summary: t.summary,
        wordCount: p.wordCount,
        estMinutes: p.estMinutes,
        source: p.source,
      };
    });

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return sendSuccess(reply, result);
  });

  // ====== 2. 详情：取单篇 passage（无登录）======
  fastify.get<{
    Params: { id: string };
    Querystring: { nativeLanguage?: string };
  }>("/reading/:id", async (request, reply) => {
    const { id } = request.params;
    const nativeLanguage = request.query.nativeLanguage || "en";

    const cacheKey = `reading:detail:${id}:${nativeLanguage}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
      return sendSuccess(reply, cached.data);
    }

    const passage = await prisma.readingPassage.findUnique({
      where: { id },
      select: {
        id: true,
        languageCode: true,
        level: true,
        title: true,
        body: true,
        glossary: true,
        questions: true,
        wordCount: true,
        estMinutes: true,
        source: true,
        translations: {
          where: { OR: [{ baseLanguageCode: nativeLanguage }, { baseLanguageCode: "en" }] },
          select: { baseLanguageCode: true, title: true, summary: true },
        },
      },
    });

    if (!passage) {
      return sendError(reply, "NOT_FOUND", "该阅读材料不存在");
    }

    log.info(request, "reading passage fetched", { language: passage.languageCode, level: passage.level, passageId: id });

    const t = pickPassageTranslation(passage.translations, nativeLanguage);
    const result = {
      id: passage.id,
      language: passage.languageCode,
      level: passage.level,
      title: t.title || passage.title,
      summary: t.summary,
      body: passage.body,
      glossary: passage.glossary,
      questions: passage.questions,
      wordCount: passage.wordCount,
      estMinutes: passage.estMinutes,
      source: passage.source,
      nativeLanguage,
    };

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
    reply.header("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    return sendSuccess(reply, result);
  });

  // ====== 3. 用户进度列表（auth）======
  fastify.get<{
    Querystring: { language?: string };
  }>("/reading/progress", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { language } = request.query;

    const progress = await prisma.userReadingProgress.findMany({
      where: {
        userId,
        ...(language ? { passage: { languageCode: language } } : {}),
      },
      select: {
        readingId: true,
        status: true,
        correctCount: true,
        totalQuestions: true,
        bestAccuracy: true,
        attemptCount: true,
        completedAt: true,
        lastPracticedAt: true,
      },
    });

    return sendSuccess(reply, progress);
  });

  // ====== 4. 提交作答（auth）======
  fastify.post<{
    Params: { id: string };
    Body: {
      results?: ComprehensionResult[];
      totalQuestions?: number;
      correctCount?: number;
    };
  }>("/reading/:id/progress", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { id: readingId } = request.params;
    const body = request.body ?? ({} as typeof request.body);

    const results = Array.isArray(body.results) ? body.results : [];
    const totalQuestions = typeof body.totalQuestions === "number" ? body.totalQuestions : results.length;
    const correctCount =
      typeof body.correctCount === "number"
        ? body.correctCount
        : results.filter((r) => r.correct).length;

    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isCompleted = accuracy >= 60; // 与 speaking 模块一致：60% 视为完成

    // 取当前最佳记录，决定 bestAccuracy / attemptCount
    const existing = await prisma.userReadingProgress.findUnique({
      where: { userId_readingId: { userId, readingId } },
      select: { bestAccuracy: true, attemptCount: true, completedAt: true },
    });

    const bestAccuracy = existing ? Math.max(existing.bestAccuracy, accuracy) : accuracy;
    const attemptCount = existing ? existing.attemptCount + 1 : 1;

    const saved = await prisma.userReadingProgress.upsert({
      where: { userId_readingId: { userId, readingId } },
      create: {
        userId,
        readingId,
        status: isCompleted ? "completed" : "in_progress",
        comprehensionResults: results as unknown as object,
        correctCount,
        totalQuestions,
        bestAccuracy,
        attemptCount,
        completedAt: isCompleted ? new Date() : null,
        lastPracticedAt: new Date(),
      },
      update: {
        status: isCompleted ? "completed" : "in_progress",
        comprehensionResults: results as unknown as object,
        correctCount,
        totalQuestions,
        bestAccuracy,
        attemptCount,
        completedAt: isCompleted ? new Date() : existing?.completedAt ?? null,
        lastPracticedAt: new Date(),
      },
    });

    request.log.info(
      { userId, readingId, correctCount, totalQuestions, accuracy, isCompleted },
      "reading/progress: saved"
    );

    log.info(request, "reading answer submitted", { passageId: readingId, correct: correctCount });

    return sendSuccess(reply, saved);
  });
};

export default readingRoutes;
