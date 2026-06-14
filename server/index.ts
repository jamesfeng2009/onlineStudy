import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth";
import coursesRoutes from "./routes/courses";
import wordsRoutes from "./routes/words";
import progressRoutes from "./routes/progress";
import communityRoutes from "./routes/community";
import stripeRoutes from "./routes/stripe";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = Number(process.env.PORT ?? 3001);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const SALT_WORK_FACTOR = 10;

async function build() {
  const app = fastify({
    logger: process.env.NODE_ENV !== "production" ? { level: "info" } : { level: "warn" },
    requestTimeout: 30000,
  });

  await app.register(fastifyCors, {
    origin: [FRONTEND_URL, /localhost:/, /127\.0\.0\.1:/],
    credentials: true,
  });

  await app.register(fastifyJwt, {
    secret: JWT_SECRET,
  });

  // Expose bcrypt helpers to routes through a decorator
  app.decorate("bcrypt", {
    hash: (password: string) => bcrypt.hash(password, SALT_WORK_FACTOR),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash),
  });

  // Auth routes
  await app.register(async (instance) => {
    await instance.register(authRoutes, { prefix: "/" });
  }, { prefix: "/api" });

  // Courses
  await app.register(async (instance) => {
    await instance.register(coursesRoutes, { prefix: "/" });
  }, { prefix: "/api" });

  // Words
  await app.register(async (instance) => {
    await instance.register(wordsRoutes, { prefix: "/" });
  }, { prefix: "/api" });

  // Progress
  await app.register(async (instance) => {
    await instance.register(progressRoutes, { prefix: "/" });
  }, { prefix: "/api" });

  // Community
  await app.register(async (instance) => {
    await instance.register(communityRoutes, { prefix: "/" });
  }, { prefix: "/api" });

  // Stripe
  await app.register(async (instance) => {
    await instance.register(stripeRoutes, { prefix: "/" });
  }, { prefix: "/api" });

  // Health check
  app.get("/health", async () => {
    return { ok: true, uptime: process.uptime() };
  });

  app.get("/", async () => {
    return { message: "LinguaVerse API is running" };
  });

  return app;
}

async function main() {
  const app = await build();

  try {
    await app.listen({ host: HOST, port: PORT });
    console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down...`);
    await app.close();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main();
