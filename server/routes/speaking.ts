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
  level: string | undefined
): string {
  return `speaking:${language ?? "all"}:${level ?? "all"}`;
}

const speakingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: {
      language?: string;
      level?: string;
    };
  }>("/speaking", async (request, reply) => {
    const { language, level } = request.query;

    const cacheKey = getCacheKey(language, level);
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return sendSuccess(reply, cached.data);
    }

    const where: Record<string, unknown> = {};
    if (language) where.languageCode = language;
    if (level) where.level = level;

    const items = await prisma.speaking.findMany({
      where,
      orderBy: [{ speakOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        languageCode: true,
        level: true,
        phrase: true,
        translation: true,
        phonetic: true,
        speakOrder: true,
      },
    });

    const result = items.map((s) => ({
      id: s.id,
      language: s.languageCode,
      level: s.level,
      phrase: s.phrase,
      translation: s.translation,
      phonetic: s.phonetic,
      speakOrder: s.speakOrder,
    }));

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    reply.header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return sendSuccess(reply, result);
  });
};

export default speakingRoutes;
