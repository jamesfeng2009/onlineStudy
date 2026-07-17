/* eslint-disable no-console */
/**
 * Scan scripts/generated/real-conversations/{lang}/{domain}.json and
 * emit a single TypeScript module at src/data/real-conversations.ts
 * that re-exports all conversations as a flat RealConversation[]
 * array. Run after translate-real-conversations-gemini.ts.
 *
 * Output is grouped into per-language const sub-arrays (each with an
 * explicit `: RealConversation[]` type annotation) and concatenated
 * via spread. This avoids TS2590 "union type too complex to represent"
 * when the total item count crosses ~1,000 entries.
 *
 * Usage:  pnpm tsx scripts/merge-real-conversations.ts
 */
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.join(
  process.cwd(),
  "scripts",
  "generated",
  "real-conversations",
);
const OUT_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "real-conversations.ts",
);

// Source JSON shape (Taskmaster-2 derived):
//   { conversation_id, domain, utterances: [{ index, speaker, text }] }
interface SourceConversation {
  conversation_id: string;
  domain: string;
  utterances: { index: number; speaker: string; text: string }[];
}
// Target shape matches src/types.ts RealConversation.
interface OutConversation {
  id: string;  // namespaced by language: `${lang}-${conversationId}`
  language: string;
  conversationId: string;
  domain: string;
  utterances: { index: number; speaker: "USER" | "ASSISTANT"; text: string }[];
}

const EXPECTED_LANGS = [
  "en", "es", "fr", "de", "it", "th",
  "yue", "zh", "ja", "ko",
  "vi", "ms", "id",
];

function toOutConv(src: SourceConversation, lang: string): OutConversation | null {
  if (!src || !src.conversation_id || !src.domain) return null;
  if (!Array.isArray(src.utterances)) return null;
  const utterances = src.utterances
    .filter(
      (u) =>
        u &&
        typeof u.text === "string" &&
        (u.speaker === "USER" || u.speaker === "ASSISTANT"),
    )
    .map((u) => ({
      index: typeof u.index === "number" ? u.index : 0,
      speaker: u.speaker as "USER" | "ASSISTANT",
      text: u.text,
    }));
  if (utterances.length === 0) return null;
  return {
    id: `${lang}-${src.conversation_id}`,
    language: lang,
    conversationId: src.conversation_id,
    domain: src.domain,
    utterances,
  };
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`✗ ${SRC_DIR} does not exist`);
    process.exit(1);
  }

  const byLang: Record<string, OutConversation[]> = {};
  const fileLabels: string[] = [];
  let skipped = 0;

  for (const lang of EXPECTED_LANGS) {
    const langDir = path.join(SRC_DIR, lang);
    if (!fs.existsSync(langDir)) continue;
    const files = fs
      .readdirSync(langDir)
      .filter((f) => f.endsWith(".json"))
      .sort();
    for (const file of files) {
      const fp = path.join(langDir, file);
      let data: SourceConversation[];
      try {
        data = JSON.parse(fs.readFileSync(fp, "utf-8"));
      } catch (e) {
        console.error(`✗ Failed to parse ${lang}/${file}:`, (e as Error).message);
        skipped++;
        continue;
      }
      if (!Array.isArray(data)) {
        console.warn(`⚠ ${lang}/${file}: not an array, skipped`);
        skipped++;
        continue;
      }
      const out: OutConversation[] = [];
      for (const conv of data) {
        const o = toOutConv(conv, lang);
        if (o) out.push(o);
        else skipped++;
      }
      if (out.length > 0) {
        byLang[lang] = (byLang[lang] ?? []).concat(out);
        fileLabels.push(
          `  // ${lang}/${file}: ${out.length} conversations, ${out.reduce((s, c) => s + c.utterances.length, 0)} utterances`,
        );
      }
    }
  }

  const langsPresent = Object.keys(byLang).sort();
  if (langsPresent.length === 0) {
    console.error("✗ No valid conversations to merge.");
    process.exit(1);
  }

  // Emit TypeScript. Each language gets its own `const xxx: RealConversation[]`
  // so TS doesn't construct a single 100,000-member union (TS2590).
  const lines: string[] = [
    "/**",
     " * AUTO-GENERATED — do not edit manually.",
     " * Source: scripts/generated/real-conversations/{lang}/{domain}.json",
     " * Regenerate: pnpm tsx scripts/merge-real-conversations.ts",
     " */",
    "import type { RealConversation } from \"../types\";",
    "",
    ...fileLabels,
    "",
  ];

  for (const lang of langsPresent) {
    const items = byLang[lang];
    lines.push(`const ${lang}: RealConversation[] = [  // ${items.length} conversations`);
    for (const c of items) {
      lines.push(
        `  { id: ${JSON.stringify(c.id)}, language: ${JSON.stringify(c.language)}, conversationId: ${JSON.stringify(c.conversationId)}, domain: ${JSON.stringify(c.domain)}, utterances: ${JSON.stringify(c.utterances)} },`,
      );
    }
    lines.push("];");
    lines.push("");
  }

  lines.push("export const REAL_CONVERSATIONS: RealConversation[] = [");
  for (const lang of langsPresent) {
    lines.push(`  ...${lang},`);
  }
  lines.push("];");
  lines.push("");

  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf-8");

  // Summary
  const totalConv = langsPresent.reduce((s, l) => s + byLang[l].length, 0);
  const totalUtts = langsPresent.reduce(
    (s, l) => s + byLang[l].reduce((s2, c) => s2 + c.utterances.length, 0),
    0,
  );
  console.log(`✓ Wrote ${OUT_FILE}`);
  console.log(`  Total: ${totalConv} conversations, ${totalUtts} utterances (${skipped} skipped)`);
  for (const lang of langsPresent) {
    const items = byLang[lang];
    const utts = items.reduce((s, c) => s + c.utterances.length, 0);
    const domains = new Set(items.map((c) => c.domain));
    console.log(
      `  ${lang}: ${items.length} conversations, ${utts} utterances, ${domains.size} domains (${[...domains].sort().join("/")})`,
    );
  }
}

main();
