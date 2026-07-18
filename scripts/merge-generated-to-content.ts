 
/**
 * Scan scripts/generated/quizzes/*.json and emit a single TypeScript
 * module at src/data/generated-quizzes.ts that re-exports all quizzes
 * as a flat QuizItem[] array. Run after generate-quizzes-gemini.ts.
 *
 * Usage:  pnpm tsx scripts/merge-generated-to-content.ts
 */
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.join(process.cwd(), "scripts", "generated", "quizzes");
const OUT_FILE = path.join(process.cwd(), "src", "data", "generated-quizzes.ts");

interface QuizJson {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  language: string;
  level: string;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`✗ ${SRC_DIR} does not exist`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error(`✗ No .json files found in ${SRC_DIR}`);
    process.exit(1);
  }

  const allQuizzes: QuizJson[] = [];
  const fileLabels: string[] = [];

  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    let data: QuizJson[];
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error(`✗ Failed to parse ${file}:`, e);
      continue;
    }
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`⚠ ${file}: empty or not an array, skipped`);
      continue;
    }
    allQuizzes.push(...data);
    fileLabels.push(`  // ${file}: ${data.length} items`);
  }

  // Deduplicate by id (keep first occurrence)
  const seen = new Set<string>();
  const deduped = allQuizzes.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  // Group by language for readability
  const byLang: Record<string, QuizJson[]> = {};
  for (const q of deduped) {
    if (!byLang[q.language]) byLang[q.language] = [];
    byLang[q.language].push(q);
  }

  // Emit TypeScript
  // 拆成 per-language 子数组(每个独立 `: QuizItem[]` 注解)再 concat,
  // 避免 1500+ 项字面量 union 触发 TS2590 "union type too complex to represent"。
  const langOrder = Object.keys(byLang).sort();
  const lines: string[] = [
    "/**",
     " * AUTO-GENERATED — do not edit manually.",
     " * Source: scripts/generated/quizzes/*.json",
     " * Regenerate: pnpm tsx scripts/merge-generated-to-content.ts",
     " */",
    "import type { QuizItem } from \"../types\";",
    "",
    ...fileLabels,
    "",
  ];

  // 每个 language 一个独立 const 声明(类型注解 + ≤~200 items,安全)
  for (const lang of langOrder) {
    const items = byLang[lang];
    lines.push(`const ${lang}: QuizItem[] = [  // ${items.length} items`);
    // Rewrite volatile ids (e.g. "q-en-a1-gemini-1-mr60t6zm") into
    // stable ones ("q-en-A1-001") so the SRS / mistake-log subsystem
    // can track cards across regenerations. Sort by original id first
    // so the assignment is deterministic across runs.
    const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));
    const seenLevelCount: Record<string, number> = {};
    for (const q of sorted) {
      const lvl = q.level ?? "?";
      seenLevelCount[lvl] = (seenLevelCount[lvl] ?? 0) + 1;
      const n = String(seenLevelCount[lvl]).padStart(3, "0");
      const stableId = `q-${lang}-${lvl}-${n}`;
      lines.push(
        `  { id: ${JSON.stringify(stableId)}, question: ${JSON.stringify(q.question)}, options: ${JSON.stringify(q.options)}, answer: ${q.answer}, explain: ${JSON.stringify(q.explain)}, language: ${JSON.stringify(q.language)}, level: ${JSON.stringify(q.level)} },`
      );
    }
    lines.push("];");
    lines.push("");
  }

  // 最终 export 用 spread concat,不再有 1500-项字面量 union
  lines.push("export const GENERATED_QUIZZES: QuizItem[] = [");
  for (const lang of langOrder) {
    lines.push(`  ...${lang},`);
  }
  lines.push("];");
  lines.push("");

  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf-8");

  // Summary
  console.log(`✓ Wrote ${OUT_FILE}`);
  console.log(`  Total quizzes: ${deduped.length}`);
  for (const [lang, items] of Object.entries(byLang)) {
    const levels: Record<string, number> = {};
    for (const q of items) {
      levels[q.level] = (levels[q.level] ?? 0) + 1;
    }
    const levelStr = Object.entries(levels)
      .map(([k, v]) => `${k}:${v}`)
      .join(", ");
    console.log(`  ${lang}: ${items.length} items (${levelStr})`);
  }
}

main();
