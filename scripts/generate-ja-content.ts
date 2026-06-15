import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import { tatoeba } from "./lib/tatoeba.js";

const OUT_DIR = path.join(process.cwd(), "generated");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const JMDICT_PATH = path.join(process.cwd(), "scripts", "cache", "JMdict_e");

interface JmdictEntry {
  ent_seq: string | string[];
  k_ele?: { keb: string | string[]; ke_pri?: string | string[] } | { keb: string | string[]; ke_pri?: string | string[] }[];
  r_ele?: { reb: string | string[]; re_pri?: string | string[] } | { reb: string | string[]; re_pri?: string[] }[];
  sense?: {
    pos?: string | string[];
    gloss?: string | string[] | { "#text": string } | { "#text": string }[];
    misc?: string | string[];
  } | {
    pos?: string | string[];
    gloss?: string | string[] | { "#text": string } | { "#text": string }[];
    misc?: string | string[];
  }[];
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function parseGloss(gloss: string | string[] | { "#text": string } | { "#text": string }[] | undefined): string {
  if (!gloss) return "";
  if (typeof gloss === "string") return gloss;
  if (Array.isArray(gloss)) {
    const first = gloss[0];
    return typeof first === "string" ? first : first?.["#text"] ?? "";
  }
  return gloss["#text"] ?? "";
}

function hasPri(entry: JmdictEntry): boolean {
  const k = asArray(entry.k_ele).some((e) => asArray(e.ke_pri).length > 0);
  const r = asArray(entry.r_ele).some((e) => asArray(e.re_pri).length > 0);
  return k || r;
}

function estimateLevel(entry: JmdictEntry): string {
  const pris = [
    ...asArray(entry.k_ele).flatMap((e) => asArray(e.ke_pri)),
    ...asArray(entry.r_ele).flatMap((e) => asArray(e.re_pri)),
  ];
  if (pris.some((p) => String(p).includes("ichi1") || String(p).includes("spec1"))) return "N5";
  if (pris.some((p) => String(p).includes("ichi2") || String(p).includes("spec2"))) return "N4";
  if (pris.some((p) => String(p).includes("news1") || String(p).includes("nf01"))) return "N3";
  if (pris.some((p) => String(p).includes("news2") || String(p).includes("nf02"))) return "N3";
  return "N4";
}

async function generate() {
  if (!fs.existsSync(JMDICT_PATH)) {
    throw new Error(`JMdict not found at ${JMDICT_PATH}. Run: curl -L -o scripts/cache/JMdict_e.gz http://www.edrdg.org/pub/Nihongo/JMdict_e.gz && gunzip scripts/cache/JMdict_e.gz`);
  }

  console.log("Parsing JMdict...");
  const xml = fs.readFileSync(JMDICT_PATH, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
  const parsed = parser.parse(xml) as { JMdict: { entry: JmdictEntry[] } };
  const entries = asArray(parsed.JMdict.entry).filter(hasPri).slice(0, 500);

  const wordItems: Record<string, unknown>[] = [];
  const quizItems: Record<string, unknown>[] = [];

  for (const entry of entries) {
    const kanji = firstString(asArray(entry.k_ele)[0]?.keb) || firstString(asArray(entry.r_ele)[0]?.reb);
    const reading = firstString(asArray(entry.r_ele)[0]?.reb) || kanji;
    if (!kanji) continue;

    const sense = asArray(entry.sense)[0];
    const meaning = parseGloss(sense?.gloss);
    const _pos = asArray(sense?.pos)[0] || "";
    const level = estimateLevel(entry);

    const example = tatoeba.findExample(kanji, "jpn") || tatoeba.findExample(reading, "jpn") || "";

    wordItems.push({
      id: `gen-ja-${entry.ent_seq}`,
      word: kanji,
      translation: meaning || reading,
      phonetic: reading,
      example,
      language: "ja",
      level,
    });

    if (meaning && quizItems.length < 200) {
      const distractors = entries
        .filter((e) => e.ent_seq !== entry.ent_seq)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((e) => parseGloss(asArray(e.sense)[0]?.gloss))
        .filter(Boolean);
      const options = [meaning, ...distractors];
      while (options.length < 4) options.push("—");
      const shuffled = options.slice(0, 4).sort(() => 0.5 - Math.random());
      quizItems.push({
        id: `gen-ja-q-${entry.ent_seq}`,
        languageCode: "ja",
        level,
        question: `「${kanji}」の意味は？`,
        options: shuffled,
        answer: shuffled.indexOf(meaning),
        explain: `「${kanji}」（${reading}）の意味：${meaning}`,
      });
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "ja-words.json"), JSON.stringify(wordItems, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "ja-quizzes.json"), JSON.stringify(quizItems, null, 2));

  console.log(`Generated ${wordItems.length} Japanese words and ${quizItems.length} quizzes.`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
