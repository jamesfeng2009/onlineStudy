import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("quizzes");

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 同一函数实例内缓存 60 秒

function getCacheKey(
  language: string | undefined,
  level: string | undefined,
  nativeLanguage: string
): string {
  return `quizzes:${language ?? "all"}:${level ?? "all"}:${nativeLanguage}`;
}

function pickTranslation(
  translations: { baseLanguageCode: string; question: string; explain: string }[],
  nativeLanguage: string
): { question: string; explain: string } {
  const exact = translations.find((t) => t.baseLanguageCode === nativeLanguage);
  if (exact) return { question: exact.question, explain: exact.explain };
  const en = translations.find((t) => t.baseLanguageCode === "en");
  if (en) return { question: en.question, explain: en.explain };
  const any = translations[0];
  if (any) return { question: any.question, explain: any.explain };
  return { question: "", explain: "" };
}

const quizzesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: {
      language?: string;
      level?: string;
      nativeLanguage?: string;
    };
  }>("/quizzes", async (request, reply) => {
    const { language, level } = request.query;
    const nativeLanguage = request.query.nativeLanguage || "en";

    const cacheKey = getCacheKey(language, level, nativeLanguage);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return sendSuccess(reply, cached.data);
    }

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (level) where.level = level;

    const quizzes = await prisma.quiz.findMany({
      where,
      orderBy: [{ quizOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        languageCode: true,
        level: true,
        options: true,
        answer: true,
        quizOrder: true,
        translations: {
          select: {
            baseLanguageCode: true,
            question: true,
            explain: true,
          },
        },
      },
    });

    const result = quizzes.map((q) => {
      const { question, explain } = pickTranslation(q.translations, nativeLanguage);
      return {
        id: q.id,
        language: q.languageCode,
        level: q.level,
        question,
        options: q.options as string[],
        answer: q.answer,
        explain,
        quizOrder: q.quizOrder,
      };
    });

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    log.info(request, "quizzes fetched", { language, level, count: result.length });

    reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return sendSuccess(reply, result);
  });
};

export default quizzesRoutes;
