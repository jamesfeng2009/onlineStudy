/**
 * 统一 seed 入口 —— 顺序执行 prisma/seed.ts + scripts/seed-listening-speaking.ts。
 *
 * Run with:
 *   pnpm tsx scripts/seed-all.ts
 *
 * 这个脚本会依次：
 *   1) seed 基础数据（Language / Course / WordBank / Post）
 *   2) seed 题库数据（Listening / Speaking / Quiz + QuizTranslation）
 *
 * 两个子脚本都用 prisma.upsert，所以重复运行安全（幂等）。
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function run(label: string, scriptPath: string): void {
  console.log(`\n========== ${label} ==========`);
  console.log(`> pnpm tsx ${scriptPath}\n`);
  try {
    execSync(`pnpm tsx ${scriptPath}`, {
      stdio: "inherit",
      cwd: root,
    });
  } catch (err) {
    console.error(`\n✘ ${label} failed:`, (err as Error).message);
    process.exit(1);
  }
  console.log(`\n✓ ${label} done.`);
}

function main(): void {
  console.log("════════════════════════════════════════════");
  console.log("  LangOria 统一 Seed 入口");
  console.log("════════════════════════════════════════════\n");

  // 1) 基础数据：Language / Course / WordBank / Post
  run("Step 1/2: 基础数据（Language/Course/WordBank/Post）", "prisma/seed.ts");

  // 2) 题库数据：Listening / Speaking / Quiz + QuizTranslation
  run("Step 2/2: 题库数据（Listening/Speaking/Quiz）", "scripts/seed-listening-speaking.ts");

  console.log("\n════════════════════════════════════════════");
  console.log("  ✅ 全部 seed 完成");
  console.log("════════════════════════════════════════════");
}

main();
