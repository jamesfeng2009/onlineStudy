/* eslint-disable no-console */
/**
 * P0 consistency fix: migrate ko/yue quiz level names to the new
 * registry-defined naming, so quizzes align with language-registry.ts
 * (which ko → TOPIK1-6, yue → A1-B2).
 *
 * Mirrors the level mapping already used by:
 *   - scripts/migrate-ko-levels.ts (KO_LEVEL_MAP)
 *   - src/lib/level-utils.ts (yue fallback map)
 *
 * What this script does:
 *   1. Rename scripts/generated/quizzes/ko-{초급|중급|고급|심화}.json
 *      to ko-{TOPIK1|TOPIK3|TOPIK5|TOPIK6}.json
 *   2. Rename scripts/generated/quizzes/yue-{初级|中级|高级}.json
 *      to yue-{A1|B1|B2}.json
 *   3. Inside each file, rewrite every item's `id` and `level` fields
 *      to use the new level name.
 *   4. Print a summary of renamed files + migrated items.
 *
 * Idempotent: if a target file already exists (already migrated),
 * the source file is removed and the script moves on.
 *
 * After running this, re-run:
 *   pnpm tsx scripts/merge-generated-to-content.ts
 *   pnpm tsx scripts/seed-listening-speaking.ts  (for Quiz upsert)
 *
 * Mapping sources (authoritative):
 *   ko:  scripts/migrate-ko-levels.ts:29-34  KO_LEVEL_MAP
 *   yue: src/lib/level-utils.ts:70-72        (初级→A1, 中级→B1, 高级→B2)
 */
import fs from "node:fs";
import path from "node:path";

const QUIZ_DIR = path.join(process.cwd(), "scripts", "generated", "quizzes");

// ko: 초급 → TOPIK1, 중급 → TOPIK3, 고급 → TOPIK5, 심화 → TOPIK6
// (跳过 TOPIK2/4:旧中级=CEFR B1=TOPIK3,旧高级=CEFR C1=TOPIK5)
const KO_MAP: Record<string, string> = {
  초급: "TOPIK1",
  중급: "TOPIK3",
  고급: "TOPIK5",
  심화: "TOPIK6",
};

// yue: 初级 → A1, 中级 → B1, 高级 → B2
// (跳过 A2:旧中级=CEFR B1,旧高级对应 yue 体系最高级 B2)
const YUE_MAP: Record<string, string> = {
  初级: "A1",
  中级: "B1",
  高级: "B2",
};

interface QuizItem {
  id: string;
  level: string;
  [k: string]: unknown;
}

function migrateLang(
  lang: "ko" | "yue",
  levelMap: Record<string, string>,
): { files: number; items: number } {
  let files = 0;
  let items = 0;
  for (const [oldLevel, newLevel] of Object.entries(levelMap)) {
    const oldFile = path.join(QUIZ_DIR, `${lang}-${oldLevel}.json`);
    const newFile = path.join(QUIZ_DIR, `${lang}-${newLevel}.json`);
    if (!fs.existsSync(oldFile)) {
      // Already migrated or never existed.
      continue;
    }
    const raw = fs.readFileSync(oldFile, "utf-8");
    const arr: QuizItem[] = JSON.parse(raw);
    // Rewrite id + level in each item.
    for (const item of arr) {
      // id pattern: q-{lang}-{oldLevel}-gemini-N-xxxx  →  q-{lang}-{newLevel}-...
      item.id = item.id.replace(
        new RegExp(`(^|-)${lang}-${oldLevel}(-|$)`),
        `$1${lang}-${newLevel}$2`,
      );
      // Also catch the bare level token in id (older format q-ko-초급-1-xxx).
      item.id = item.id.replace(
        new RegExp(`q-${lang}-${oldLevel}-`),
        `q-${lang}-${newLevel}-`,
      );
      item.level = newLevel;
      items++;
    }
    // If target already exists (e.g. from a fresh Gemini run), merge by
    // preferring the existing file and just dropping the old one.
    if (fs.existsSync(newFile)) {
      console.warn(
        `  ⚠ ${lang}-${newLevel}.json already exists; dropping old ${lang}-${oldLevel}.json without overwrite.`,
      );
    } else {
      fs.writeFileSync(newFile, JSON.stringify(arr, null, 2) + "\n");
      files++;
      console.log(`  ✓ ${lang}-${oldLevel}.json → ${lang}-${newLevel}.json (${arr.length} items)`);
    }
    fs.unlinkSync(oldFile);
  }
  return { files, items };
}

console.log("P0-1: migrating ko quiz levels (초/중/고/심 → TOPIK)...");
const ko = migrateLang("ko", KO_MAP);
console.log(`  → ${ko.files} files renamed, ${ko.items} items migrated.\n`);

console.log("P0-2: migrating yue quiz levels (初/中/高 → A1/B1/B2)...");
const yue = migrateLang("yue", YUE_MAP);
console.log(`  → ${yue.files} files renamed, ${yue.items} items migrated.\n`);

console.log("Done. Next: re-run merge-generated-to-content.ts + seed.");
