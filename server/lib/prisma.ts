import { Prisma, PrismaClient } from "./prisma-generated/client/index.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// 在 Serverless 环境（包括 Vercel）中缓存 Prisma Client，避免每次冷启动都重建连接
// globalThis 在同一函数实例的多次调用间保持存活
globalForPrisma.prisma = prisma;

// 导出 Prisma 事务客户端类型（用于事务回调）
export type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export { Prisma };
