 
/**
 * Scan scripts/generated/listening/*.json and speaking/*.json,
 * emit two TypeScript modules:
 *   src/data/generated-listening.ts
 *   src/data/generated-speaking.ts
 *
 * Usage: pnpm tsx scripts/merge-listening-speaking.ts
 */
import fs from "node:fs";
import path from "node:path";

const LISTEN_SRC = path.join(process.cwd(), "scripts", "generated", "listening");
const SPEAK_SRC = path.join(process.cwd(), "scripts", "generated", "speaking");
const LISTEN_OUT = path.join(process.cwd(), "src", "data", "generated-listening.ts");
const SPEAK_OUT = path.join(process.cwd(), "src", "data", "generated-speaking.ts");

interface ListenItem {
  id: string;
  title: string;
  script: string;
  tokens?: string[];
  blanks: { index: number; answer: string }[];
  language: string;
  level: string;
}

interface SpeakItem {
  id: string;
  phrase: string;
  translation: string;
  phonetic: string;
  language: string;
  level: string;
}

function readJsonDir<T>(dir: string): { data: T[]; labels: string[] } {
  const data: T[] = [];
  const labels: string[] = [];
  if (!fs.existsSync(dir)) return { data, labels };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) {
        data.push(...arr);
        labels.push(`  // ${file}: ${arr.length} items`);
      }
    } catch {
      console.warn(`⚠ ${file}: parse error, skipped`);
    }
  }
  return { data, labels };
}

function dedupById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

/**
 * Normalize a listening item so its blanks ALWAYS match what the frontend
 * will render. The frontend splits `script` on a single space
 * (LearnPage.tsx: `L.script.split(' ')`), so:
 *   1. We re-split the script with the SAME rule.
 *   2. For each blank, if `index` is in range, we OVERRIDE `answer`
 *      with `tokens[index]`. This guarantees the input box's "correct"
 *      hint matches what the user sees, even if Gemini miscounted.
 *   3. If `index` is out of range (Gemini occasionally does this on
 *      scripts with trailing punctuation), we drop the blank.
 *   4. Drop the whole item if it has < 1 valid blank after repair.
 *
 * This catches the 78 mismatch errors validate-listening-speaking.ts
 * reported: Gemini's index is often off by 1-2 because it didn't
 * split the same way the frontend does.
 */
function normalizeListening(item: ListenItem): ListenItem | null {
  if (!item.script || !Array.isArray(item.blanks)) return null;
  const tokens = item.script.split(" ").filter((t) => t.length > 0);
  if (tokens.length === 0) return null;

  const seenIdx = new Set<number>();
  const fixedBlanks: { index: number; answer: string }[] = [];
  for (const b of item.blanks) {
    if (typeof b.index !== "number" || typeof b.answer !== "string") continue;
    if (b.index < 0 || b.index >= tokens.length) continue;
    if (seenIdx.has(b.index)) continue;
    seenIdx.add(b.index);
    fixedBlanks.push({ index: b.index, answer: tokens[b.index] });
  }
  if (fixedBlanks.length === 0) return null;

  // Re-join script with single spaces so the frontend's split(' ')
  // produces exactly the same tokens we used here. Also expose `tokens`
  // as a pre-tokenized array so CJK languages (zh/yue/ja) no longer
  // rely on the brittle string-split hack — frontend prefers `tokens`
  // when present and falls back to `script.split(" ")` for legacy data.
  const fixedScript = tokens.join(" ");
  return { ...item, script: fixedScript, tokens, blanks: fixedBlanks };
}

function groupByLang<T extends { language: string; level: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.language]) groups[item.language] = [];
    groups[item.language].push(item);
  }
  return groups;
}

// ── Listening ──
function emitListening(items: ListenItem[], labels: string[]): string {
  const byLang = groupByLang(items);
  const lines: string[] = [
    "/**",
     " * AUTO-GENERATED listening exercises — do not edit manually.",
     " * Source: scripts/generated/listening/*.json",
     " * Regenerate: pnpm tsx scripts/merge-listening-speaking.ts",
     " */",
    "import type { ListeningItem } from \"../types\";",
    "",
    ...labels,
    "",
    "export const GENERATED_LISTENING: ListeningItem[] = [",
  ];
  for (const [lang, langItems] of Object.entries(byLang)) {
    lines.push(`  // ── ${lang} (${langItems.length} items) ──`);
    for (const item of langItems) {
      const blanksStr = item.blanks
        .map((b) => `{ index: ${b.index}, answer: ${JSON.stringify(b.answer)} }`)
        .join(", ");
      const tokensStr = item.tokens
        ? `, tokens: [${item.tokens.map((t) => JSON.stringify(t)).join(", ")}]`
        : "";
      lines.push(
        `  { id: ${JSON.stringify(item.id)}, title: ${JSON.stringify(item.title)}, script: ${JSON.stringify(item.script)}${tokensStr}, blanks: [${blanksStr}], language: ${JSON.stringify(item.language)}, level: ${JSON.stringify(item.level)} },`
      );
    }
  }
  lines.push("];");
  lines.push("");
  return lines.join("\n");
}

// ── Speaking ──
function emitSpeaking(items: SpeakItem[], labels: string[]): string {
  const byLang = groupByLang(items);
  const lines: string[] = [
    "/**",
     " * AUTO-GENERATED speaking phrases — do not edit manually.",
     " * Source: scripts/generated/speaking/*.json",
     " * Regenerate: pnpm tsx scripts/merge-listening-speaking.ts",
     " */",
    "import type { SpeakingPhrase } from \"../types\";",
    "",
    ...labels,
    "",
    "export const GENERATED_SPEAKING: SpeakingPhrase[] = [",
  ];
  for (const [lang, langItems] of Object.entries(byLang)) {
    lines.push(`  // ── ${lang} (${langItems.length} items) ──`);
    for (const item of langItems) {
      lines.push(
        `  { id: ${JSON.stringify(item.id)}, phrase: ${JSON.stringify(item.phrase)}, translation: ${JSON.stringify(item.translation)}, phonetic: ${JSON.stringify(item.phonetic || "")}, language: ${JSON.stringify(item.language)}, level: ${JSON.stringify(item.level)} },`
      );
    }
  }
  lines.push("];");
  lines.push("");
  return lines.join("\n");
}

// ── Main ──
function main() {
  // Listening
  const listenRaw = readJsonDir<ListenItem>(LISTEN_SRC);
  // Normalize each item so blank indices/answers match what the frontend
  // will render. Drop items that can't be repaired (no valid blanks).
  const listenNormalized: ListenItem[] = [];
  let listenDropped = 0;
  for (const item of listenRaw.data) {
    const fixed = normalizeListening(item);
    if (fixed) listenNormalized.push(fixed);
    else listenDropped++;
  }
  if (listenDropped > 0) {
    console.warn(`⚠ dropped ${listenDropped} listening items that couldn't be repaired`);
  }
  const listenDedup = dedupById(listenNormalized);
  if (listenDedup.length > 0) {
    fs.writeFileSync(LISTEN_OUT, emitListening(listenDedup, listenRaw.labels), "utf-8");
    console.log(`✓ Wrote ${LISTEN_OUT}`);
    console.log(`  Total listening: ${listenDedup.length}`);
    for (const [lang, items] of Object.entries(groupByLang(listenDedup))) {
      const levels: Record<string, number> = {};
      for (const q of items) levels[q.level] = (levels[q.level] ?? 0) + 1;
      console.log(`  ${lang}: ${items.length} (${Object.entries(levels).map(([k, v]) => `${k}:${v}`).join(", ")})`);
    }
  } else {
    console.log("⚠ No listening items found");
  }

  console.log("");

  // Speaking
  const speakRaw = readJsonDir<SpeakItem>(SPEAK_SRC);
  const speakDedup = dedupById(speakRaw.data);
  if (speakDedup.length > 0) {
    fs.writeFileSync(SPEAK_OUT, emitSpeaking(speakDedup, speakRaw.labels), "utf-8");
    console.log(`✓ Wrote ${SPEAK_OUT}`);
    console.log(`  Total speaking: ${speakDedup.length}`);
    for (const [lang, items] of Object.entries(groupByLang(speakDedup))) {
      const levels: Record<string, number> = {};
      for (const q of items) levels[q.level] = (levels[q.level] ?? 0) + 1;
      console.log(`  ${lang}: ${items.length} (${Object.entries(levels).map(([k, v]) => `${k}:${v}`).join(", ")})`);
    }
  } else {
    console.log("⚠ No speaking items found");
  }
}

main();
