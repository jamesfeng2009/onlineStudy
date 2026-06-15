import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { registerUserIdempotent } from "../lib/idempotency.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { computeStreakFromLastActive } from "../lib/level.js";

interface RegisterBody {
  email: string;
  password: string;
  username: string;
  language: string;
  uiLanguage?: string;
  nativeLanguage?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// 内存缓存已知的语言 code，避免每次注册都查询 languages 表
const validLanguageCodes = new Set<string>();

async function isValidLanguage(code: string): Promise<boolean> {
  if (validLanguageCodes.has(code)) return true;
  const lang = await prisma.language.findUnique({ where: { code } });
  if (lang) {
    validLanguageCodes.add(code);
    return true;
  }
  return false;
}

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 注册（幂等 + 事务） ======
  // 使用 email unique constraint 保证幂等
  fastify.post<{ Body: RegisterBody }>("/auth/register", async (request, reply) => {
    const { email, password, username, language } = request.body;
    const uiLanguage = request.body.uiLanguage || "en";
    const nativeLanguage = request.body.nativeLanguage || "en";
    if (!email || !password || !username || !language) {
      return sendError(reply, "BAD_REQUEST", "缺少必填字段");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 语言校验与密码哈希互不依赖，并行执行
    const [isLanguageValid, passwordHash] = await Promise.all([
      isValidLanguage(language),
      fastify.bcrypt.hash(password),
    ]);
    if (!isLanguageValid) {
      return sendError(reply, "BAD_REQUEST", "无效的语言代码");
    }

    // 使用事务创建用户（幂等：如果邮箱已存在，返回现有用户）
    const result = await prisma.$transaction(async (tx) => {
      return registerUserIdempotent(tx, normalizedEmail, username.trim(), passwordHash, language, uiLanguage, nativeLanguage);
    });

    if (!result.isNew) {
      // 邮箱已存在，返回 409
      return sendError(reply, "CONFLICT", "该邮箱已注册");
    }

    const user = result.user;

    // 签发 JWT
    const token = fastify.jwt.sign(
      { userId: user.id, version: user.jwtVersion },
      { expiresIn: "7d" }
    );

    return sendSuccess(reply, {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        exp: user.exp,
        streak: user.streak,
        lastActive: user.lastActive.toISOString().slice(0, 10),
        uiLanguage: user.uiLanguage,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        createdAt: user.createdAt.toISOString(),
        role: user.role,
        goalMinutesPerDay: user.goalMinutesPerDay,
      },
    });
  });

  // ====== 登录（幂等 + 事务） ======
  // 登录操作天然幂等：每次登录都验证密码并更新 streak/lastActive
  fastify.post<{ Body: LoginBody }>("/auth/login", async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
      return sendError(reply, "BAD_REQUEST", "邮箱和密码不能为空");
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return sendError(reply, "UNAUTHORIZED", "邮箱或密码不正确");
    }

    const isMatch = await fastify.bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(reply, "UNAUTHORIZED", "邮箱或密码不正确");
    }

    // 计算新的 streak（幂等：同一天多次登录 streak 不变；按 Asia/Shanghai 日期判断）
    const { streak, lastActive } = computeStreakFromLastActive(user.lastActive, user.streak);

    // 单表 update 本身是原子的，无需事务
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastActive, streak },
    });

    const token = fastify.jwt.sign(
      { userId: updated.id, version: updated.jwtVersion },
      { expiresIn: "7d" }
    );

    return sendSuccess(reply, {
      token,
      user: {
        id: updated.id,
        email: updated.email,
        username: updated.username,
        avatar: updated.avatar,
        level: updated.level,
        exp: updated.exp,
        streak: updated.streak,
        lastActive: updated.lastActive.toISOString().slice(0, 10),
        uiLanguage: updated.uiLanguage,
        nativeLanguage: updated.nativeLanguage,
        targetLanguage: updated.targetLanguage,
        createdAt: updated.createdAt.toISOString(),
        role: updated.role,
        goalMinutesPerDay: updated.goalMinutesPerDay,
      },
    });
  });

  // ====== 获取当前用户（幂等） ======
  fastify.get(
    "/auth/me",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const payload = request.user;
      if (!payload || !payload.userId) {
        return sendError(reply, "UNAUTHORIZED", "Unauthorized");
      }
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        return sendError(reply, "UNAUTHORIZED", "User not found");
      }
      if (user.jwtVersion !== payload.version) {
        return sendError(reply, "UNAUTHORIZED", "Token expired");
      }
      return sendSuccess(reply, {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          exp: user.exp,
          streak: user.streak,
          lastActive: user.lastActive.toISOString().slice(0, 10),
          uiLanguage: user.uiLanguage,
          nativeLanguage: user.nativeLanguage,
          targetLanguage: user.targetLanguage,
          createdAt: user.createdAt.toISOString(),
          role: user.role,
          goalMinutesPerDay: user.goalMinutesPerDay,
        },
      });
    });

  // ====== 更新用户信息（幂等） ======
  // 单表更新，天然幂等
  fastify.patch<{
    Body: { username?: string; avatar?: string; uiLanguage?: string; nativeLanguage?: string; targetLanguage?: string; goalMinutesPerDay?: number };
  }>(
    "/auth/me",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      const payload = request.user;
      if (!payload || !payload.userId) {
        return sendError(reply, "UNAUTHORIZED", "Unauthorized");
      }
      const { username, avatar, uiLanguage, nativeLanguage, targetLanguage, goalMinutesPerDay } = request.body;
      const update: Record<string, unknown> = {};
      if (typeof username === "string" && username.trim().length > 0) update.username = username.trim();
      if (typeof avatar === "string") update.avatar = avatar;
      if (typeof uiLanguage === "string" && uiLanguage.trim().length > 0) update.uiLanguage = uiLanguage.trim();
      if (typeof nativeLanguage === "string" && nativeLanguage.trim().length > 0) update.nativeLanguage = nativeLanguage.trim();
      if (typeof targetLanguage === "string" && targetLanguage.trim().length > 0) update.targetLanguage = targetLanguage.trim();
      if (typeof goalMinutesPerDay === "number") update.goalMinutesPerDay = Math.max(0, Math.floor(goalMinutesPerDay));

      if (Object.keys(update).length === 0) {
        return sendError(reply, "BAD_REQUEST", "缺少可更新字段");
      }

      // 如果更新 targetLanguage，需要验证语言是否存在
      if (update.targetLanguage) {
        const lang = await prisma.language.findUnique({ where: { code: update.targetLanguage as string } });
        if (!lang) {
          return sendError(reply, "BAD_REQUEST", "无效的语言代码");
        }
      }

      const user = await prisma.user.update({ where: { id: payload.userId }, data: update });
      return sendSuccess(reply, {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          exp: user.exp,
          streak: user.streak,
          lastActive: user.lastActive.toISOString().slice(0, 10),
          uiLanguage: user.uiLanguage,
          nativeLanguage: user.nativeLanguage,
          targetLanguage: user.targetLanguage,
          createdAt: user.createdAt.toISOString(),
          role: user.role,
          goalMinutesPerDay: user.goalMinutesPerDay,
        },
      });
    }
  );

  // ====== 登出（幂等） ======
  // 登出操作天然幂等：清除本地 token 即可
  fastify.post("/auth/logout", async (request, reply) => {
    return sendSuccess(reply, { ok: true });
  });
};

export default authRoutes;