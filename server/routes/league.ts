/**
 * P2-1: League 排行榜 API
 *
 * 设计要点：
 *   1. season 按周生成（ISO week），seasonKey 形如 "2026-W29"
 *   2. 用户首次访问 GET /league/me 或写进度时，若当周 standing 不存在
 *      则 lazy 创建；startingExp 锁定为该用户当前总 XP
 *   3. 排名（rankInDivision）即时计算：按 weekExp DESC 排序，按 division 分组
 *   4. 升降级由定时任务（后续实现）批量结算；本接口仅展示
 *
 * 路由：
 *   GET  /league/current-season               (no auth) 当前 season 信息
 *   GET  /league/standings?division=&limit=   (no auth) division 排行榜
 *   GET  /league/me                           (auth)    当前用户 standing + rank
 *   POST /league/me/sync                      (auth)    同步用户 XP 到 standing
 */

import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

// ============================================================
// 常量与工具
// ============================================================

const DIVISIONS = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "master",
] as const;
type Division = (typeof DIVISIONS)[number];

const DIVISION_META: Record<
  Division,
  { label: string; color: string; minExp: number; icon: string }
> = {
  bronze: { label: "青铜", color: "amber-700", minExp: 0, icon: "🥉" },
  silver: { label: "白银", color: "slate-400", minExp: 200, icon: "🥈" },
  gold: { label: "黄金", color: "amber-400", minExp: 500, icon: "🥇" },
  platinum: { label: "铂金", color: "sky-300", minExp: 1000, icon: "💎" },
  diamond: { label: "钻石", color: "violet-400", minExp: 2000, icon: "🔷" },
  master: { label: "大师", color: "rose-400", minExp: 4000, icon: "👑" },
};

function isDivision(v: unknown): v is Division {
  return typeof v === "string" && (DIVISIONS as readonly string[]).includes(v);
}

/** 根据 weekExp 选择 division：取 weekExp 所落入的最高 minExp */
function pickDivision(weekExp: number): Division {
  let result: Division = "bronze";
  for (const d of DIVISIONS) {
    if (weekExp >= DIVISION_META[d].minExp) result = d;
  }
  return result;
}

/**
 * 把 Date 转成 ISO week seasonKey，形如 "2026-W29"。
 * ISO 8601 规定：周以星期一开始，一年第一周须包含周四。
 */
function getIsoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Set to nearest Thursday: current date + 4 - current day, Monday=1..Sunday=7
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/** 计算 season 的开始（周一 00:00 UTC）与结束（下周一 00:00 UTC） */
function getSeasonRange(now: Date): { startsAt: Date; endsAt: Date; seasonKey: string } {
  const seasonKey = getIsoWeekKey(now);
  // Monday of this week
  const dayNum = now.getUTCDay() || 7;
  const startsAt = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (dayNum - 1))
  );
  const endsAt = new Date(startsAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  return { startsAt, endsAt, seasonKey };
}

/** 找到（或创建）当前 active 的 season。幂等。 */
async function ensureCurrentSeason(now: Date) {
  const { startsAt, endsAt, seasonKey } = getSeasonRange(now);

  // 先查 active
  const existingActive = await prisma.leagueSeason.findFirst({
    where: { isActive: true },
  });
  if (existingActive && existingActive.seasonKey === seasonKey) {
    return existingActive;
  }
  // 如果存在同 seasonKey 的旧记录（可能 isActive=false），直接重新激活
  const existingByKey = await prisma.leagueSeason.findUnique({
    where: { seasonKey },
  });
  if (existingByKey) {
    // 取消所有 active，重新激活这一条
    await prisma.leagueSeason.updateMany({ where: { isActive: true }, data: { isActive: false } });
    const reactivated = await prisma.leagueSeason.update({
      where: { id: existingByKey.id },
      data: { isActive: true, startsAt, endsAt },
    });
    return reactivated;
  }
  // 否则创建新 season：先取消所有 active，再 insert
  await prisma.leagueSeason.updateMany({ where: { isActive: true }, data: { isActive: false } });
  const created = await prisma.leagueSeason.create({
    data: { seasonKey, startsAt, endsAt, isActive: true },
  });
  return created;
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30_000; // 30s 排行榜缓存

// ============================================================
// 路由实现
// ============================================================

const leagueRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 1. 当前 season 信息（无登录）======
  fastify.get("/league/current-season", async (request, reply) => {
    const season = await ensureCurrentSeason(new Date());
    const totalPlayers = await prisma.leagueStanding.count({
      where: { seasonId: season.id },
    });
    return sendSuccess(reply, {
      seasonKey: season.seasonKey,
      startsAt: season.startsAt,
      endsAt: season.endsAt,
      totalPlayers,
      divisions: DIVISIONS.map((d) => ({
        key: d,
        label: DIVISION_META[d].label,
        icon: DIVISION_META[d].icon,
        minExp: DIVISION_META[d].minExp,
      })),
    });
  });

  // ====== 2. division 排行榜（无登录）======
  fastify.get<{
    Querystring: { division?: string; limit?: string };
  }>("/league/standings", async (request, reply) => {
    const { division } = request.query;
    const limitRaw = request.query.limit;
    const limit = Math.max(1, Math.min(100, Number.parseInt(limitRaw ?? "50", 10) || 50));

    const season = await ensureCurrentSeason(new Date());

    const cacheKey = `league:standings:${season.id}:${division ?? "all"}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      reply.header("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
      return sendSuccess(reply, cached.data);
    }

    const where: { seasonId: string; division?: string } = { seasonId: season.id };
    if (isDivision(division)) where.division = division;

    const rows = await prisma.leagueStanding.findMany({
      where,
      orderBy: [{ weekExp: "desc" }, { updatedAt: "asc" }],
      take: limit,
      select: {
        id: true,
        userId: true,
        division: true,
        startingExp: true,
        currentExp: true,
        weekExp: true,
        bestDivision: true,
        updatedAt: true,
        user: { select: { username: true, avatar: true, level: true } },
      },
    });

    const result = rows.map((r, idx) => ({
      rank: idx + 1,
      userId: r.userId,
      username: r.user.username,
      avatar: r.user.avatar,
      level: r.user.level,
      division: r.division,
      weekExp: r.weekExp,
      currentExp: r.currentExp,
      startingExp: r.startingExp,
      bestDivision: r.bestDivision,
    }));

    const payload = {
      seasonKey: season.seasonKey,
      division: division ?? "all",
      entries: result,
    };
    cache.set(cacheKey, { data: payload, expiresAt: Date.now() + CACHE_TTL_MS });
    reply.header("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return sendSuccess(reply, payload);
  });

  // ====== 3. 当前用户 standing + rank（auth）======
  fastify.get("/league/me", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, avatar: true, level: true, exp: true },
    });
    if (!user) {
      return sendError(reply, "NOT_FOUND", "用户不存在");
    }

    const season = await ensureCurrentSeason(new Date());

    // Upsert standing：若不存在则用当前 exp 创建
    let standing = await prisma.leagueStanding.findUnique({
      where: { userId_seasonId: { userId, seasonId: season.id } },
    });

    if (!standing) {
      standing = await prisma.leagueStanding.create({
        data: {
          userId,
          seasonId: season.id,
          division: pickDivision(0),
          startingExp: user.exp,
          currentExp: user.exp,
          weekExp: 0,
          bestDivision: null,
        },
      });
    } else {
      // 同步 currentExp / weekExp（与用户实时 exp 对齐）
      const newWeekExp = Math.max(0, user.exp - standing.startingExp);
      const newDivision = pickDivision(newWeekExp);
      const shouldUpdate =
        standing.currentExp !== user.exp ||
        standing.weekExp !== newWeekExp ||
        standing.division !== newDivision;

      if (shouldUpdate) {
        const isPromotion = DIVISIONS.indexOf(newDivision) > DIVISIONS.indexOf(standing.division as Division);
        const isDemotion = DIVISIONS.indexOf(newDivision) < DIVISIONS.indexOf(standing.division as Division);
        const bestDivisionSoFar = standing.bestDivision
          ? (DIVISIONS.indexOf(standing.bestDivision as Division) >= DIVISIONS.indexOf(newDivision)
              ? standing.bestDivision
              : newDivision)
          : newDivision;

        standing = await prisma.leagueStanding.update({
          where: { id: standing.id },
          data: {
            currentExp: user.exp,
            weekExp: newWeekExp,
            division: newDivision,
            bestDivision: bestDivisionSoFar,
            ...(isPromotion ? { promotedAt: new Date() } : {}),
            ...(isDemotion ? { demotedAt: new Date() } : {}),
          },
        });
      }
    }

    // 计算 rank：在当前 division 内按 weekExp DESC 排序，找到自己位置
    const higherCount = await prisma.leagueStanding.count({
      where: {
        seasonId: season.id,
        division: standing.division,
        OR: [
          { weekExp: { gt: standing.weekExp } },
          {
            weekExp: standing.weekExp,
            updatedAt: { lt: standing.updatedAt },
          },
        ],
      },
    });
    const rankInDivision = higherCount + 1;
    const divisionSize = await prisma.leagueStanding.count({
      where: { seasonId: season.id, division: standing.division },
    });

    // 升降级提示（前端展示用）
    const divisionIdx = DIVISIONS.indexOf(standing.division as Division);
    const promoteThreshold = Math.max(1, Math.floor(divisionSize * 0.1));
    const demoteThreshold = Math.max(1, Math.floor(divisionSize * 0.1));
    const isPromotionZone = rankInDivision <= promoteThreshold && divisionIdx < DIVISIONS.length - 1;
    const isDemotionZone = rankInDivision > divisionSize - demoteThreshold && divisionIdx > 0;

    return sendSuccess(reply, {
      seasonKey: season.seasonKey,
      startsAt: season.startsAt,
      endsAt: season.endsAt,
      standing: {
        id: standing.id,
        division: standing.division,
        divisionLabel: DIVISION_META[standing.division as Division]?.label ?? standing.division,
        startingExp: standing.startingExp,
        currentExp: standing.currentExp,
        weekExp: standing.weekExp,
        bestDivision: standing.bestDivision,
        rankInDivision,
        divisionSize,
        isPromotionZone,
        isDemotionZone,
        promotedAt: standing.promotedAt,
        demotedAt: standing.demotedAt,
      },
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        exp: user.exp,
      },
    });
  });

  // ====== 4. 显式同步 XP（auth）—— 主动触发刷新 ======
  fastify.post("/league/me/sync", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, exp: true },
    });
    if (!user) {
      return sendError(reply, "NOT_FOUND", "用户不存在");
    }

    const season = await ensureCurrentSeason(new Date());

    const existing = await prisma.leagueStanding.findUnique({
      where: { userId_seasonId: { userId, seasonId: season.id } },
    });

    const weekExp = existing ? Math.max(0, user.exp - existing.startingExp) : 0;
    const division = pickDivision(weekExp);

    const saved = await prisma.leagueStanding.upsert({
      where: { userId_seasonId: { userId, seasonId: season.id } },
      create: {
        userId,
        seasonId: season.id,
        division,
        startingExp: user.exp,
        currentExp: user.exp,
        weekExp: 0,
      },
      update: {
        currentExp: user.exp,
        weekExp,
        division,
      },
    });

    request.log.info(
      { userId, seasonId: season.id, exp: user.exp, weekExp, division },
      "league/me/sync: saved"
    );

    return sendSuccess(reply, {
      id: saved.id,
      division: saved.division,
      startingExp: saved.startingExp,
      currentExp: saved.currentExp,
      weekExp: saved.weekExp,
      bestDivision: saved.bestDivision,
    });
  });
};

export default leagueRoutes;
