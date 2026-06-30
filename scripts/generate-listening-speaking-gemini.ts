/* eslint-disable no-console */
/**
 * Generate listening fill-in-the-blank exercises and speaking phrases
 * via Google Gemini for en/zh/ja.
 *
 * Output:
 *   scripts/generated/listening/{lang}-{level}.json
 *   scripts/generated/speaking/{lang}-{level}.json
 *
 * Usage:
 *   LLM_MODEL=gemini-2.5-flash pnpm tsx scripts/generate-listening-speaking-gemini.ts
 *   LLM_MODEL=gemini-2.5-flash pnpm tsx scripts/generate-listening-speaking-gemini.ts --lang=ja
 *   LLM_MODEL=gemini-2.5-flash pnpm tsx scripts/generate-listening-speaking-gemini.ts --type=listening
 *
 * Key: listening scripts MUST use spaces between words so that
 * script.split(" ") produces correct token indices for blanks.
 * For ja/zh, we insert spaces between words/phrases.
 */
import fs from "node:fs";
import path from "node:path";

function loadDotenv(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m) continue;
    const [, k, raw] = m;
    if (process.env[k] !== undefined) continue;
    const v = raw.replace(/^["']|["']$/g, "");
    if (v) process.env[k] = v;
  }
}
loadDotenv(path.join(process.cwd(), ".env.local"));
loadDotenv(path.join(process.cwd(), ".env"));

const API_KEY = process.env.GEMINI_API_KEY?.trim();
const MODEL = process.env.LLM_MODEL?.trim() || "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;

function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}
const onlyLang = arg("lang");
const onlyType = arg("type"); // "listening" | "speaking" | undefined (both)
const perBatch = Math.max(3, Math.min(20, Number(arg("count", "5"))));

type LangKey = "en" | "ja" | "zh";
const LANGS: LangKey[] = ["en", "ja", "zh"];

const LEVELS: Record<LangKey, string[]> = {
  en: ["A1", "A2", "B1"],
  ja: ["N5", "N4", "N3"],
  zh: ["HSK1", "HSK2", "HSK3"],
};

const LANG_NATIVE: Record<LangKey, string> = {
  en: "English",
  ja: "Japanese",
  zh: "Chinese (Mandarin, simplified)",
};

async function callGemini(prompt: string, schema: object): Promise<any> {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY! },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`gemini ${res.status}: ${text}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("empty response from gemini");
  return JSON.parse(text);
}

// ── Listening generator ──
async function generateListening(lang: LangKey, level: string, count: number) {
  const native = LANG_NATIVE[lang];
  const spaceNote = lang === "en"
    ? "Use normal English spacing."
    : `CRITICAL: Insert a space between every word/phrase in the script so that script.split(' ') produces correct tokens. For example: ${lang === "ja" ? "私 は 毎日 朝 7時 に 起きます" : "我 每天 早上 七点 起床"}`;

  const prompt = `Generate ${count} listening exercises for ${native} learners at level ${level}.
Each exercise has:
- title: a short title (in ${native})
- script: a 10-15 word paragraph in ${native}. ${spaceNote}
- blanks: array of exactly 3 objects with {index, answer} where index is the 0-based position of the word in script.split(' ') and answer is the word at that position (case-sensitive, no punctuation).
- level: "${level}"

Rules:
- The script should be natural and educational.
- Blank out content words (nouns, verbs, adjectives), not function words.
- The answer must exactly match the word in the script (including capitalization).
- Return a JSON array of ${count} objects.`;

  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        title: { type: "string" },
        script: { type: "string" },
        blanks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              index: { type: "integer" },
              answer: { type: "string" },
            },
            required: ["index", "answer"],
          },
        },
        level: { type: "string" },
      },
      required: ["title", "script", "blanks", "level"],
    },
  };

  return callGemini(prompt, schema);
}

// ── Speaking generator ──
async function generateSpeaking(lang: LangKey, level: string, count: number) {
  const native = LANG_NATIVE[lang];
  const prompt = `Generate ${count} speaking practice phrases for ${native} learners at level ${level}.
Each phrase has:
- phrase: a natural conversational phrase in ${native}
- translation: Chinese translation of the phrase
- phonetic: IPA phonetic transcription (for en) or romaji/pinyin (for ja/zh), or empty string
- level: "${level}"

Rules:
- Phrases should be commonly used in daily life.
- Vary the topics: greetings, ordering food, asking directions, shopping, etc.
- Return a JSON array of ${count} objects.`;

  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        phrase: { type: "string" },
        translation: { type: "string" },
        phonetic: { type: "string" },
        level: { type: "string" },
      },
      required: ["phrase", "translation", "phonetic", "level"],
    },
  };

  return callGemini(prompt, schema);
}

// ── Main ──
async function main() {
  if (!API_KEY) {
    console.error("✗ GEMINI_API_KEY not set");
    process.exit(1);
  }

  const listenDir = path.join(process.cwd(), "scripts", "generated", "listening");
  const speakDir = path.join(process.cwd(), "scripts", "generated", "speaking");
  if (!onlyType || onlyType === "listening") fs.mkdirSync(listenDir, { recursive: true });
  if (!onlyType || onlyType === "speaking") fs.mkdirSync(speakDir, { recursive: true });

  const batches: { type: "listening" | "speaking"; lang: LangKey; level: string }[] = [];
  for (const lang of LANGS) {
    if (onlyLang && onlyLang !== lang) continue;
    for (const level of LEVELS[lang]) {
      if (!onlyType || onlyType === "listening") batches.push({ type: "listening", lang, level });
      if (!onlyType || onlyType === "speaking") batches.push({ type: "speaking", lang, level });
    }
  }

  console.log(`✓ provider: gemini  model: ${MODEL}`);
  console.log(`✓ Per batch: ${perBatch} items`);
  console.log(`→ ${batches.length} batch(es) to run\n`);

  let ok = 0;
  let fail = 0;
  let totalItems = 0;

  for (let i = 0; i < batches.length; i++) {
    const { type, lang, level } = batches[i];
    const dir = type === "listening" ? listenDir : speakDir;
    const outFile = path.join(dir, `${lang}-${level}.json`);

    console.log(`[${i + 1}/${batches.length}] ${type}/${lang}/${level} …`);

    try {
      const data = type === "listening"
        ? await generateListening(lang, level, perBatch)
        : await generateSpeaking(lang, level, perBatch);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("empty or non-array response");
      }

      // Add ids and language field
      const withMeta = data.map((item: any, idx: number) => ({
        ...item,
        id: `${type === "listening" ? "l" : "s"}-${lang}-${level.toLowerCase()}-gemini-${idx + 1}`,
        language: lang,
      }));

      fs.writeFileSync(outFile, JSON.stringify(withMeta, null, 2), "utf-8");
      console.log(`  ✓ ${withMeta.length} items → ${path.relative(process.cwd(), outFile)}`);
      ok++;
      totalItems += withMeta.length;
    } catch (e: any) {
      console.log(`  ✗ ${e.message}`);
      fail++;
    }

    // Rate limit: sleep 3s between batches
    if (i < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\n=== done ===`);
  console.log(`  batches ok:   ${ok}/${batches.length}`);
  console.log(`  batches fail: ${fail}`);
  console.log(`  total items:  ${totalItems}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
