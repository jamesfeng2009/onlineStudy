import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("real-conversations");

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 同一函数实例内缓存 60 秒

/** 可选鉴权：有合法 token 则视为登录，无/失效 token 按匿名处理（不抛 401） */
async function isAuthenticated(request: { jwtVerify: () => Promise<unknown> }): Promise<boolean> {
  try {
    await request.jwtVerify();
    return true;
  } catch {
    return false;
  }
}

const realConversationsRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 真实对话语料（P1 反爬：匿名仅每个 domain 第 1 条样例，登录全量） ======
  fastify.get<{
    Querystring: {
      language?: string;
      domain?: string;
    };
  }>("/real-conversations", async (request, reply) => {
    const { language, domain } = request.query;
    if (!language) {
      return sendSuccess(reply, { items: [], total: 0, preview: true });
    }

    const authed = await isAuthenticated(request);
    const cacheKey = `realconv:${language}:${domain ?? "all"}:${authed ? "full" : "preview"}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header(
        "Cache-Control",
        authed ? "private, max-age=300" : "public, s-maxage=3600, stale-while-revalidate=86400",
      );
      return sendSuccess(reply, cached.data);
    }

    const where: Record<string, unknown> = { languageCode: language };
    if (domain) where.domain = domain;
    const orderBy = [{ convOrder: "asc" as const }, { id: "asc" as const }];

    // 总量（用于前端"登录解锁全部 N 条"提示），轻量 count
    const total = await prisma.realConversation.count({ where });

    let rows;
    if (authed) {
      rows = await prisma.realConversation.findMany({ where, orderBy });
    } else if (domain) {
      // 匿名 + 指定 domain：仅第 1 条样例
      rows = await prisma.realConversation.findMany({ where, orderBy, take: 1 });
    } else {
      // 匿名 + 未指定 domain：每个 domain 的第 1 条样例
      const metas = await prisma.realConversation.findMany({
        where,
        orderBy,
        select: { id: true, domain: true },
      });
      const firstIds = [...new Map(metas.map((m) => [m.domain, m.id])).values()];
      rows = await prisma.realConversation.findMany({
        where: { id: { in: firstIds } },
        orderBy,
      });
    }

    const result = {
      items: rows.map((c) => ({
        id: c.id,
        language: c.languageCode,
        conversationId: c.conversationId,
        domain: c.domain,
        utterances: c.utterances,
      })),
      total,
      preview: !authed,
    };

    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });

    log.info(request, "real-conversations fetched", {
      language,
      domain,
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

export default realConversationsRoutes;
