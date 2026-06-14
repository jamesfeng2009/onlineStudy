import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { registerUserIdempotent } from "../lib/idempotency.js";
import { sendSuccess, sendError } from "../lib/response.js";

interface RegisterBody {
  email: string;
  password: string;
  username: string;
  language: string;
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
    if (!email || !password || !username || !language) {
      return sendError(reply, "BAD_REQUEST", "缺少必填字段");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 检查语言是否存在（带内存缓存）
    if (!(await isValidLanguage(language))) {
      return sendError(reply, "BAD_REQUEST", "无效的语言代码");
    }

    // 哈希密码
    const passwordHash = await fastify.bcrypt.hash(password);

    // 使用事务创建用户（幂等：如果邮箱已存在，返回现有用户）
    const result = await prisma.$transaction(async (tx) => {
      return registerUserIdempotent(tx, normalizedEmail, username.trim(), passwordHash, language);
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

    // 计算新的 streak（幂等：同一天多次登录 streak 不变）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const la = new Date(user.lastActive);
    la.setHours(0, 0, 0, 0);
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);

    let streak = user.streak;
    if (la.getTime() !== today.getTime()) {
      if (la.getTime() === yest.getTime()) {
        streak = user.streak + 1;
      } else {
        streak = 1;
      }
    }

    // 使用事务更新用户（幂等）
    const updated = await prisma.$transaction(async (tx) => {
      return tx.user.update({
        where: { id: user.id },
        data: { lastActive: new Date(), streak },
      });
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
          targetLanguage: user.targetLanguage,
          createdAt: user.createdAt.toISOString(),
          role: user.role,
          goalMinutesPerDay: user.goalMinutesPerDay,
        },
      });
    }
  );

  // ====== 更新用户信息（幂等） ======
  // 单表更新，天然幂等
  fastify.patch<{
    Body: { username?: string; avatar?: string; targetLanguage?: string; goalMinutesPerDay?: number };
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
      const { username, avatar, targetLanguage, goalMinutesPerDay } = request.body;
      const update: Record<string, unknown> = {};
      if (typeof username === "string" && username.trim().length > 0) update.username = username.trim();
      if (typeof avatar === "string") update.avatar = avatar;
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