import fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth";
import coursesRoutes from "./routes/courses";
import wordsRoutes from "./routes/words";
import progressRoutes from "./routes/progress";
import communityRoutes from "./routes/community";
import stripeRoutes from "./routes/stripe";

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
  app.get("/health", async () => ({ ok: true, uptime: process.uptime() }));
  app.get("/", async () => ({ message: "LinguaVerse API is running" }));

  await app.ready();
  return app;
}
