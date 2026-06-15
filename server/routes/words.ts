import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess } from "../lib/response.js";

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 同一函数实例内缓存 60 秒

function getCacheKey(
  language: string | undefined,
  level: string | undefined,
  limit: number | undefined,
  offset: number | undefined
): string {
  return `words:${language ?? "all"}:${level ?? "all"}:${limit ?? "all"}:${offset ?? 0}`;
}

const wordsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: { language?: string; level?: string; limit?: string; offset?: string };
  }>("/words", async (request, reply) => {
    const { language, level } = request.query;
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : undefined;
    const offset = request.query.offset ? parseInt(request.query.offset, 10) : undefined;

    const cacheKey = getCacheKey(language, level, limit, offset);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return sendSuccess(reply, cached.data);
    }

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (level) where.level = level;

    const words = await prisma.wordBank.findMany({
      where,
      orderBy: [{ vocabOrder: "asc" }, { word: "asc" }],
      select: {
        id: true,
        languageCode: true,
        level: true,
        word: true,
        translation: true,
        phonetic: true,
        exampleSentence: true,
      },
      take: limit,
      skip: offset,
    });

    const result = words.map((w) => ({
      id: w.id,
      language: w.languageCode,
      level: w.level,
      word: w.word,
      translation: w.translation,
      phonetic: w.phonetic,
      exampleSentence: w.exampleSentence,
    }));

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    // 单词数据变更不频繁，适合边缘缓存，可大幅减少冷启动和重复查询耗时
    reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return sendSuccess(reply, result);
  });
};

export default wordsRoutes;
