import fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth.js";
import coursesRoutes from "./routes/courses.js";
import wordsRoutes from "./routes/words.js";
import progressRoutes from "./routes/progress.js";
import communityRoutes from "./routes/community.js";
import stripeRoutes from "./routes/stripe.js";
import { sendSuccess } from "./lib/response.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const SALT_WORK_FACTOR = 10;

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: process.env.NODE_ENV !== "production" ? { level: "info" } : { level: "warn" },
    requestTimeout: 30000,
  });

  await app.register(fastifyCors, {
    origin: [FRONTEND_URL, /localhost:/, /127\.0\.0\.1:/, /\.vercel\.app$/],
    credentials: true,
  });

  await app.register(fastifyJwt, { secret: JWT_SECRET });

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
    coursesRoutes,
    wordsRoutes,
    progressRoutes,
    communityRoutes,
    stripeRoutes,
  ];

  for (const route of apiRoutes) {
    await app.register(async (instance) => {
      await instance.register(route, { prefix: "/" });
    }, { prefix: "/api" });
  }

  // Health check
  app.get("/health", async (_request, reply) => sendSuccess(reply, { ok: true, uptime: process.uptime() }, "API is healthy"));
  app.get("/", async (_request, reply) => sendSuccess(reply, { message: "LinguaVerse API is running" }));

  await app.ready();
  return app;
}
