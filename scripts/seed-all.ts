/**
 * 统一 seed 入口 —— 顺序执行 prisma/seed.ts + scripts/seed-listening-speaking.ts
 * + scripts/seed-lessons.ts。
 *
 * Run with:
 *   pnpm tsx scripts/seed-all.ts
 *
 * 这个脚本会依次：
 *   1) seed 基础数据（Language / Course / WordBank / Post）
 *   2) seed 题库数据（Listening / Speaking / Quiz + QuizTranslation）
 *   3) seed 课时层级（Unit / Lesson，从 courses 派生并填充 exerciseIds）
 *
 * 所有子脚本都用 prisma.upsert，所以重复运行安全（幂等）。
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
  run("Step 1/3: 基础数据（Language/Course/WordBank/Post）", "prisma/seed.ts");

  // 2) 题库数据：Listening / Speaking / Quiz + QuizTranslation
  run("Step 2/3: 题库数据（Listening/Speaking/Quiz）", "scripts/seed-listening-speaking.ts");

  // 3) P0-1 课时层级：Unit / Lesson（依赖前两步的 WordBank/Quiz/Listening/Speaking id）
  run("Step 3/3: 课时层级（Unit/Lesson）", "scripts/seed-lessons.ts");

  console.log("\n════════════════════════════════════════════");
  console.log("  ✅ 全部 seed 完成");
  console.log("════════════════════════════════════════════");
}

main();
