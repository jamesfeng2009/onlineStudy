 
/**
 * P0-4: migrate ko learn-content levels from CEFR (A1/A2/B1) to TOPIK
 * (TOPIK1/TOPIK2/TOPIK3), so ko.ts aligns with language-registry.ts.
 *
 * Mapping (from src/lib/level-utils.ts):
 *   A1 → TOPIK1   (CEFR A1 == TOPIK 1)
 *   A2 → TOPIK2   (CEFR A2 == TOPIK 2)
 *   B1 → TOPIK3   (CEFR B1 == TOPIK 3)
 *
 * Only touches src/data/learn-content/ko.ts. Idempotent: running twice
 * is safe because the regex only matches "A1"/"A2"/"B1" inside the
 * "level": "..." field, not "TOPIK1" etc.
 */
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "learn-content",
  "ko.ts",
);

if (!fs.existsSync(FILE)) {
  console.error(`✗ ${FILE} not found`);
  process.exit(1);
}

const MAP: Record<string, string> = {
  A1: "TOPIK1",
  A2: "TOPIK2",
  B1: "TOPIK3",
};

let src = fs.readFileSync(FILE, "utf-8");
let count = 0;

for (const [oldLvl, newLvl] of Object.entries(MAP)) {
  // Match "level": "A1" etc. (with optional single/double quotes, spaces).
  const re = new RegExp(`"level":\\s*"${oldLvl}"`, "g");
  const matches = src.match(re) || [];
  if (matches.length > 0) {
    src = src.replace(re, `"level": "${newLvl}"`);
    count += matches.length;
    console.log(`  ✓ ${oldLvl} → ${newLvl}: ${matches.length} items`);
  }
}

fs.writeFileSync(FILE, src);
console.log(`\nDone. ${count} level fields rewritten in ko.ts.`);
