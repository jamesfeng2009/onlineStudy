/**
 * 用户成就解锁记录路由。
 *
 * - GET  /user/achievements           → 当前用户所有已解锁的 badge
 * - POST /user/achievements/:badgeKey/unlock → 解锁一个 badge（幂等）
 * - POST /user/achievements/mark-read  → 标记所有已解锁 badge 为已读
 *
 * badgeKey 对应 src/data/badges.ts 里的 Badge.id（如 "streak-3"）。
 */
import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

const achievementsRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 获取用户所有已解锁的成就 ======
  fastify.get(
    "/user/achievements",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const achievements = await prisma.userAchievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
      });

      request.log.info({ userId, count: achievements.length }, "achievements list");

      return sendSuccess(
        reply,
        achievements.map((a) => ({
          badgeKey: a.badgeKey,
          unlockedAt: a.unlockedAt,
          isRead: a.isRead,
        }))
      );
    }
  );

  // ====== 解锁一个成就（幂等） ======
  fastify.post<{
    Params: { badgeKey: string };
  }>(
    "/user/achievements/:badgeKey/unlock",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { badgeKey } = request.params;

      if (!badgeKey || badgeKey.length > 100) {
        return sendError(reply, "BAD_REQUEST", "Invalid badgeKey");
      }

      request.log.info({ userId, badgeKey }, "achievement unlock");

      // 幂等 upsert：如果已存在，不更新 unlockedAt（保留首次解锁时间）
      const achievement = await prisma.userAchievement.upsert({
        where: { userId_badgeKey: { userId, badgeKey } },
        update: {}, // 不更新任何字段（幂等）
        create: {
          userId,
          badgeKey,
          unlockedAt: new Date(),
          isRead: false,
        },
      });

      return sendSuccess(reply, {
        badgeKey: achievement.badgeKey,
        unlockedAt: achievement.unlockedAt,
        isRead: achievement.isRead,
      });
    }
  );

  // ====== 标记所有成就为已读 ======
  fastify.post(
    "/user/achievements/mark-read",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const result = await prisma.userAchievement.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      request.log.info({ userId, updated: result.count }, "achievements marked read");

      return sendSuccess(reply, { updated: result.count });
    }
  );
};

export default achievementsRoutes;
