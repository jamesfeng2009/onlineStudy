import fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth.js";
import oauthRoutes from "./routes/oauth.js";
import coursesRoutes from "./routes/courses.js";
import wordsRoutes from "./routes/words.js";
import quizzesRoutes from "./routes/quizzes.js";
import listeningRoutes from "./routes/listening.js";
import speakingRoutes from "./routes/speaking.js";
import progressRoutes from "./routes/progress.js";
import userReviewsRoutes from "./routes/user-reviews.js";
import courseProgressRoutes from "./routes/course-progress.js";
import lessonsRoutes from "./routes/lessons.js";
import placementRoutes from "./routes/placement.js";
import readingRoutes from "./routes/reading.js";
import leagueRoutes from "./routes/league.js";
import cefrRoutes from "./routes/cefr-self-assessment.js";
import writingRoutes from "./routes/writing.js";
import aiExplainRoutes from "./routes/ai-explain.js";
import achievementsRoutes from "./routes/achievements.js";
import communityRoutes from "./routes/community.js";
import stripeRoutes from "./routes/stripe.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blog.js";
import seoRoutes from "./routes/seo.js";
import jwtPlugin from "./lib/jwt.js";
import { prisma } from "./lib/prisma.js";
import { sendSuccess } from "./lib/response.js";

declare module "fastify" {
  interface FastifyInstance {
    bcrypt: {
      hash(password: string): Promise<string>;
      compare(password: string, hash: string): Promise<boolean>;
    };
    authenticate(request: import("fastify").FastifyRequest, reply: import("fastify").FastifyReply): Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: string; version: number };
    user: { userId: string; version: number };
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 16) {
  throw new Error("JWT_SECRET must be set in env and at least 16 chars. Refusing to boot with weak/dev secret.");
}
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const SALT_WORK_FACTOR = 12;

// 将已经校验过的 secret 赋给常量，避免 TS 报 "string | undefined"
const SECRET: string = JWT_SECRET;

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: process.env.NODE_ENV !== "production" ? { level: "info" } : { level: "warn" },
    requestTimeout: 30000,
  });

  await app.register(fastifyCors, {
    origin: [FRONTEND_URL, /localhost:/, /127\.0\.0\.1:/, /\.vercel\.app$/],
    credentials: true,
  });

  await app.register(fastifyJwt, { secret: SECRET });
  await app.register(jwtPlugin);

  app.decorate("bcrypt", {
    hash: (password: string) => bcrypt.hash(password, SALT_WORK_FACTOR),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash),
  });

  // 全局错误处理：统一返回 { code, message, data }
  app.setErrorHandler((error, request, reply) => {
    const err = error as Error & { statusCode?: number };
    const status = err.statusCode ?? 500;
    let code: import("./lib/response.js").ApiCode = "INTERNAL_ERROR";
    if (status === 400) code = "BAD_REQUEST";
    else if (status === 401) code = "UNAUTHORIZED";
    else if (status === 403) code = "FORBIDDEN";
    else if (status === 404) code = "NOT_FOUND";
    else if (status === 409) code = "CONFLICT";

    app.log.warn({ err, path: request.url }, "request error");
    reply.status(status).send({ code, message: err.message || "服务器内部错误", data: null });
  });

  // 兜底 404
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ code: "NOT_FOUND", message: "接口不存在", data: null });
  });

  // Register API routes under /api/
  const apiRoutes: Array<typeof authRoutes> = [
    authRoutes,
    oauthRoutes,
    coursesRoutes,
    wordsRoutes,
    quizzesRoutes,
    listeningRoutes,
    speakingRoutes,
    progressRoutes,
    userReviewsRoutes,
    courseProgressRoutes,
    lessonsRoutes,
    placementRoutes,
    readingRoutes,
    leagueRoutes,
    cefrRoutes,
    writingRoutes,
    aiExplainRoutes,
    achievementsRoutes,
    communityRoutes,
    stripeRoutes,
    adminRoutes,
    blogRoutes,
    seoRoutes,
  ];

  for (const route of apiRoutes) {
    await app.register(async (instance) => {
      await instance.register(route, { prefix: "/" });
    }, { prefix: "/api" });
  }

  // Health check
  app.get("/health", async (_request, reply) => sendSuccess(reply, { ok: true, uptime: process.uptime() }, "API is healthy"));
  app.get("/", async (_request, reply) => sendSuccess(reply, { message: "LangOria API is running" }));

  await app.ready();

  // 预热数据库连接，减少首次 API 请求的握手耗时
  try {
    await prisma.$connect();
  } catch (err) {
    app.log.error({ err }, "failed to pre-connect to database");
  }

  return app;
}
