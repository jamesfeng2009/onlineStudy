import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("dialogue-scenes");

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

async function isAuthenticated(request: { jwtVerify: () => Promise<unknown> }): Promise<boolean> {
  try {
    await request.jwtVerify();
    return true;
  } catch {
    return false;
  }
}

const dialogueSceneRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 分支对话场景（P1 反爬：匿名仅 2 条，登录全量） ======
  fastify.get<{
    Querystring: {
      language?: string;
    };
  }>("/dialogue-scenes", async (request, reply) => {
    const { language } = request.query;
    if (!language) {
      return sendSuccess(reply, { items: [], total: 0, preview: true });
    }

    const authed = await isAuthenticated(request);
    const cacheKey = `scene:${language}:${authed ? "full" : "preview"}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header(
        "Cache-Control",
        authed ? "private, max-age=300" : "public, s-maxage=3600, stale-while-revalidate=86400",
      );
      return sendSuccess(reply, cached.data);
    }

    const orderBy = [{ sceneOrder: "asc" as const }, { id: "asc" as const }];

    // 与前端原 getDialogueScenes 行为一致：目标语言无场景时回退英文
    let effectiveLang = language;
    let total = await prisma.dialogueScene.count({ where: { languageCode: effectiveLang } });
    if (total === 0 && language !== "en") {
      effectiveLang = "en";
      total = await prisma.dialogueScene.count({ where: { languageCode: "en" } });
    }
    const where = { languageCode: effectiveLang };

    const rows = authed
      ? await prisma.dialogueScene.findMany({ where, orderBy })
      : await prisma.dialogueScene.findMany({ where, orderBy, take: 2 });

    const result = {
      items: rows.map((s) => ({
        id: s.id,
        language: s.languageCode,
        level: s.level,
        scenario: s.scenario,
        title: s.title,
        opening: s.opening,
        turns: s.turns,
        startTurnId: s.startTurnId,
      })),
      total,
      preview: !authed,
    };

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    log.info(request, "dialogue-scenes fetched", {
      language,
      authed,
      count: rows.length,
      total,
    });

    reply.header(
      "Cache-Control",
      authed ? "private, max-age=300" : "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return sendSuccess(reply, result);
  });
};

export default dialogueSceneRoutes;
