/**
 * 一次性迁移执行脚本：直接对 DB 执行 023_add_conversation_content/migration.sql。
 * 用 PrismaClient $executeRawUnsafe 逐条执行，比 prisma db execute 更可观测。
 *
 * Run with: DIRECT_URL 环境变量（直连 5432）
 *   pnpm tsx scripts/run-migration-023.ts
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      // DIRECT_URL (5432) 从本机 Prisma engine 连接失败，改用 pooler (6543)
      url: process.env.DATABASE_URL ?? process.env.DIRECT_URL,
    },
  },
});

async function main() {
  const sql = readFileSync("prisma/migrations/023_add_conversation_content/migration.sql", "utf-8");
  // 剥离所有 -- 注释（整行与行尾注释；注释内含分号会干扰切分。本迁移无字符串字面量，安全）
  const stripped = sql
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join("\n");
  const statements = stripped
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} statements...`);
  for (const stmt of statements) {
    const firstLine = stmt.split("\n").find((l) => l.trim() && !l.trim().startsWith("--")) ?? "";
    process.stdout.write(`  -> ${firstLine.slice(0, 80)} ... `);
    await prisma.$executeRawUnsafe(stmt);
    console.log("ok");
  }
  console.log("MIGRATION_OK");
}

main()
  .catch((e) => {
    console.error("MIGRATION_FAILED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
