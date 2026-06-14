import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";

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

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: RegisterBody }>("/auth/register", async (request, reply) => {
    const { email, password, username, language } = request.body;
    if (!email || !password || !username || !language) {
      return reply.status(400).send({ error: "缺少必填字段" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return reply.status(409).send({ error: "该邮箱已注册" });
    }

    const lang = await prisma.language.findUnique({ where: { code: language } });
    if (!lang) {
      return reply.status(400).send({ error: "无效的语言代码" });
    }

    const passwordHash = await fastify.bcrypt.hash(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username,
        passwordHash,
        targetLanguage: language,
        level: 1,
        exp: 0,
        streak: 1,
        role: "user",
        goalMinutesPerDay: 30,
        jwtVersion: 1,
      },
    });

    const token = fastify.jwt.sign(
      { userId: user.id, version: user.jwtVersion },
      { expiresIn: "7d" }
    );

    return reply.status(201).send({
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

  fastify.post<{ Body: LoginBody }>("/auth/login", async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
      return reply.status(400).send({ error: "邮箱和密码不能为空" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return reply.status(401).send({ error: "邮箱或密码不正确" });
    }

    const isMatch = await fastify.bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return reply.status(401).send({ error: "邮箱或密码不正确" });
    }

    // bump streak / lastActive when logging in on new day
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

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date(), streak },
    });

    const token = fastify.jwt.sign(
      { userId: updated.id, version: updated.jwtVersion },
      { expiresIn: "7d" }
    );

    return reply.send({
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

  fastify.get(
    "/auth/me",
    {
      onRequest: [
        async (request, reply) => {
          await request.jwtVerify();
        },
      ],
    },
    async (request, reply) => {
      const payload = request.user as { userId: string; version: number };
      if (!payload || !payload.userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        return reply.status(401).send({ error: "User not found" });
      }
      if (user.jwtVersion !== payload.version) {
        return reply.status(401).send({ error: "Token expired" });
      }
      return reply.send({
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

  fastify.patch<{
    Body: { username?: string; avatar?: string; targetLanguage?: string; goalMinutesPerDay?: number };
  }>(
    "/auth/me",
    {
      onRequest: [
        async (request, reply) => {
          await request.jwtVerify();
        },
      ],
    },
    async (request, reply) => {
      const payload = request.user as { userId: string; version: number };
      if (!payload || !payload.userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      const { username, avatar, targetLanguage, goalMinutesPerDay } = request.body;
      const update: Record<string, unknown> = {};
      if (typeof username === "string" && username.trim().length > 0) update.username = username.trim();
      if (typeof avatar === "string") update.avatar = avatar;
      if (typeof targetLanguage === "string" && targetLanguage.trim().length > 0) update.targetLanguage = targetLanguage.trim();
      if (typeof goalMinutesPerDay === "number") update.goalMinutesPerDay = Math.max(0, Math.floor(goalMinutesPerDay));

      if (Object.keys(update).length === 0) {
        return reply.status(400).send({ error: "缺少可更新字段" });
      }

      const user = await prisma.user.update({ where: { id: payload.userId }, data: update });
      return reply.send({
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

  fastify.post("/auth/logout", async (request, reply) => {
    return reply.send({ ok: true });
  });
};

export default authRoutes;
