/* eslint-disable no-console */
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
    } catch (e) {
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
      lines.push(
        `  { id: ${JSON.stringify(item.id)}, title: ${JSON.stringify(item.title)}, script: ${JSON.stringify(item.script)}, blanks: [${blanksStr}], language: ${JSON.stringify(item.language)}, level: ${JSON.stringify(item.level)} },`
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
  const listenDedup = dedupById(listenRaw.data);
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
