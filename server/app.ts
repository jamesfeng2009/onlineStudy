import fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
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
import aiConverseRoutes from "./routes/ai-converse.js";
import achievementsRoutes from "./routes/achievements.js";
import communityRoutes from "./routes/community.js";
import stripeRoutes from "./routes/stripe.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blog.js";
import seoRoutes from "./routes/seo.js";
import realConversationsRoutes from "./routes/real-conversations.js";
import dialogueSceneRoutes from "./routes/dialogue-scenes.js";
import jwtPlugin from "./lib/jwt.js";
import { prisma } from "./lib/prisma.js";
import { sendSuccess } from "./lib/response.js";
import { generateTraceId, pinoSerializers, extractUserId } from "./lib/logger.js";

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
    // 结构化日志：pino 内置，每条日志自动带 trace_id (reqId)
    logger: {
      level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV !== "production" ? "info" : "warn"),
      serializers: pinoSerializers,
    },
    // 为每个请求生成唯一 trace_id（16 位 UUID 前缀）
    genReqId: () => generateTraceId(),
    requestTimeout: 30000,
  });

  await app.register(fastifyCors, {
    origin: [FRONTEND_URL, /localhost:/, /127\.0\.0\.1:/, /\.vercel\.app$/],
    credentials: true,
  });

  // ── 全局速率限制（P1-1 反爬） ──
  // 分层策略（按端点敏感度区分阈值，各自独立计数桶）：
  //   1. 全局公开 API：每个 IP 100 次/分钟（博客、课程、词汇等读取接口）
  //   2. 登录/注册：每个 IP 10 次/分钟（防密码爆破，正常人 1-2 次足够）
  //   3. 学习写操作 record-*：每个 IP 30 次/分钟（人类答题极限约 30 题/分钟）
  //   4. AI 接口（ai-explain / ai-converse）：每个 IP 10 次/分钟（防刷 LLM 额度）
  //   5. 内容全量接口（P2-b）：每个账号 60 次/分钟
  //      （real-conversations / dialogue-scenes / quizzes / listening / speaking
  //        登录用户按 userId 计数，防"注册脚本号批量拉取核心语料"；
  //        匿名用户回退按 IP 计数，不影响 SEO 抓取与正常学习）
  //
  // 白名单：Health check、静态资源、robots/sitemap/rss 不限制。
  /** 内容类核心资产接口前缀（P2-b 按 userId 限流） */
  const CONTENT_API_PREFIXES = [
    "/api/real-conversations",
    "/api/dialogue-scenes",
    "/api/quizzes",
    "/api/listening",
    "/api/speaking",
  ];

  /** 限流类别：返回计数桶后缀与阈值，null 表示走全局默认 */
  const classifyRateLimit = (rawUrl: string): { bucket: string; max: number } | null => {
    const url = rawUrl.split("?")[0];
    if (url === "/api/auth/login" || url === "/api/auth/register") {
      return { bucket: ":auth", max: 10 };
    }
    if (url.startsWith("/api/progress/record")) {
      return { bucket: ":record", max: 30 };
    }
    if (url.startsWith("/api/ai-explain") || url.startsWith("/api/ai-converse")) {
      return { bucket: ":ai", max: 10 };
    }
    if (CONTENT_API_PREFIXES.some((p) => url.startsWith(p))) {
      return { bucket: ":content", max: 60 };
    }
    return null;
  };

  /** 同步解析 Authorization header 中的 JWT，返回 userId（无效/缺失返回 null）。
   *  仅用于限流分桶：伪造无效 token 会回退到 IP 桶，无法借此放大配额。 */
  const extractJwtUserId = (request: import("fastify").FastifyRequest): string | null => {
    const header = request.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return null;
    try {
      const payload = app.jwt.verify<{ userId?: string }>(header.slice(7));
      return payload?.userId ?? null;
    } catch {
      return null;
    }
  };

  await app.register(fastifyRateLimit, {
    max: async (request) => {
      const cls = classifyRateLimit(request.raw.url ?? "");
      return cls ? cls.max : 100;
    },
    timeWindow: "1 minute",
    // 按类别分桶计数（ip:auth / ip:record / ip:ai / u:userId:content / ip），互不干扰
    keyGenerator: (request) => {
      const cls = classifyRateLimit(request.raw.url ?? "");
      // P2-b：内容接口对登录用户按 userId 限流（防脚本号批量拉）
      if (cls?.bucket === ":content") {
        const uid = extractJwtUserId(request);
        if (uid) return `u:${uid}:content`;
      }
      return cls ? `${request.ip}${cls.bucket}` : request.ip;
    },
    errorResponseBuilder: (_request, context) => ({
      statusCode: 429,
      code: "RATE_LIMITED",
      message: `请求过于频繁，请 ${context.after} 秒后重试`,
      data: null,
    }),
    allowList: (request) => {
      const url = request.raw.url?.split("?")[0] ?? "";
      return (
        url === "/health" ||
        url === "/" ||
        url.startsWith("/assets/") ||
        url === "/robots.txt" ||
        url === "/sitemap.xml" ||
        url === "/rss.xml"
      );
    },
  });

  await app.register(fastifyJwt, { secret: SECRET });
  await app.register(jwtPlugin);

  app.decorate("bcrypt", {
    hash: (password: string) => bcrypt.hash(password, SALT_WORK_FACTOR),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash),
  });

  // ── 请求日志 hook ──
  // onRequest: 记录请求入口（method + url + trace_id）
  app.addHook("onRequest", async (request) => {
    request.log.info(
      { trace_id: request.id, method: request.method, url: request.url },
      "→ request",
    );
  });

  // onResponse: 记录请求出口（status + duration + trace_id + user_id）
  app.addHook("onResponse", async (request, reply) => {
    const durationMs = Math.round(reply.elapsedTime * 1000);
    request.log.info(
      {
        trace_id: request.id,
        user_id: extractUserId(request) ?? "-",
        method: request.method,
        url: request.url,
        status: reply.statusCode,
        duration_ms: durationMs,
      },
      "← response",
    );
  });

  // ── P2-a 反爬：API 响应统一声明 X-Robots-Tag: noindex ──
  // 配合 robots.txt 的 Disallow: /api/ 双保险：
  //   robots.txt 阻止合规爬虫抓取，X-Robots-Tag 确保已抓取的 API 响应
  //   不会进入搜索索引。排除 /api/seo/*（robots/sitemap/rss 本身就是
  //   给搜索引擎读取的文件，不能带 noindex）。对页面 SEO 零影响。
  app.addHook("onSend", async (request, reply) => {
    const url = request.raw.url?.split("?")[0] ?? "";
    if (url.startsWith("/api/") && !url.startsWith("/api/seo/")) {
      reply.header("X-Robots-Tag", "noindex, nofollow");
    }
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
    else if (status === 429) code = "RATE_LIMITED";

    app.log.error(
      {
        err,
        trace_id: request.id,
        user_id: extractUserId(request) ?? "-",
        method: request.method,
        url: request.url,
        status,
      },
      "request error",
    );
    reply.status(status).send({ code, message: err.message || "服务器内部错误", data: null });
  });

  // 兜底 404
  app.setNotFoundHandler((request, reply) => {
    request.log.warn(
      { trace_id: request.id, method: request.method, url: request.url },
      "route not found",
    );
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
    aiConverseRoutes,
    achievementsRoutes,
    communityRoutes,
    stripeRoutes,
    adminRoutes,
    blogRoutes,
    seoRoutes,
    realConversationsRoutes,
    dialogueSceneRoutes,
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
