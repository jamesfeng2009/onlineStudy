/* eslint-disable no-console */
/**
 * Translate real-conversations source data to target languages via Gemini.
 *
 * Samples ~N utterances per domain from source/{domain}.json (taking whole
 * conversations until the target is reached), translates every utterance's
 * `text` field via the Gemini API, and writes the result to
 * `{lang}/{domain}.json`.
 *
 * For `--lang=en` the script only samples (no API call).
 *
 * Usage:
 *   pnpm tsx scripts/translate-real-conversations-gemini.ts --lang=fr
 *   pnpm tsx scripts/translate-real-conversations-gemini.ts --lang=fr --domain=restaurant
 *   pnpm tsx scripts/translate-real-conversations-gemini.ts --lang=fr --overwrite
 *   pnpm tsx scripts/translate-real-conversations-gemini.ts --lang=fr --dry-run
 *   pnpm tsx scripts/translate-real-conversations-gemini.ts --lang=fr --sample=200
 *
 * Env (loaded from .env / .env.local):
 *   GEMINI_API_KEY  — required for non-English languages
 *   GEMINI_MODEL    — override model (default: gemini-2.5-flash)
 */

import fs from "node:fs";
import path from "node:path";

// ─── .env loading (matches generate-quizzes-gemini.ts) ───
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

// ─── CLI args ───
function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}

const langArg = arg("lang");
const domainArg = arg("domain");
const sampleSize = Number(arg("sample", "200"));
const overwrite = process.argv.includes("--overwrite");
const dryRun = process.argv.includes("--dry-run");

// ─── Constants ───
const DOMAINS = [
  "restaurant",
  "food-ordering",
  "movies",
  "hotels",
  "flights",
  "music",
  "sports",
];

const BASE_DIR = path.join(
  process.cwd(),
  "scripts",
  "generated",
  "real-conversations",
);
const SOURCE_DIR = path.join(BASE_DIR, "source");

const LANG_NAMES: Record<string, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  ja: { native: "日本語", english: "Japanese" },
  zh: { native: "中文", english: "Chinese (Mandarin, simplified)" },
  ko: { native: "한국어", english: "Korean" },
  es: { native: "Español", english: "Spanish" },
  fr: { native: "Français", english: "French" },
  de: { native: "Deutsch", english: "German" },
  it: { native: "Italiano", english: "Italian" },
  th: { native: "ภาษาไทย", english: "Thai" },
  yue: { native: "粵語", english: "Cantonese (traditional, Hong Kong)" },
  ms: { native: "Bahasa Melayu", english: "Malay" },
  id: { native: "Bahasa Indonesia", english: "Indonesian" },
  vi: { native: "Tiếng Việt", english: "Vietnamese" },
};

// ─── Gemini API ───
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

const RESPONSE_SCHEMA = {
  type: "OBJECT" as const,
  properties: {
    translations: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          id: {
            type: "STRING" as const,
            description:
              "Utterance ID in format 'conversation_id|index' — must match the input exactly",
          },
          text: { type: "STRING" as const, description: "The translated text" },
        },
        required: ["id", "text"],
      },
    },
  },
  required: ["translations"],
} as const;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Best-effort JSON repair for truncated Gemini responses. */
function repairJson(input: string): string {
  let s = input;
  const lastQuote = s.lastIndexOf('"');
  if (lastQuote === -1) return s;
  let inStr = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') inStr = !inStr;
  }
  if (inStr) s += '"';
  inStr = false;
  escape = false;
  let opens = 0;
  let closes = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inStr = !inStr;
      continue;
    }
    if (inStr) continue;
    if (ch === "{" || ch === "[") opens++;
    else if (ch === "}" || ch === "]") closes++;
  }
  while (closes < opens) {
    s += s.trimEnd().endsWith("[") ? "]" : "}";
    closes++;
  }
  return s;
}

interface Translation {
  id: string;
  text: string;
}

async function callGemini(
  prompt: string,
  attempt = 0,
): Promise<Translation[]> {
  const MAX_ATTEMPTS = 4;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY!)}`;
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY!,
  };
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      topP: 0.95,
      maxOutputTokens: 24576,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  let res: Response;
  try {
    res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      const wait = 2000 * Math.pow(2, attempt);
      console.warn(`  network error, retry in ${wait}ms: ${(err as Error).message}`);
      await sleep(wait);
      return callGemini(prompt, attempt + 1);
    }
    throw err;
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt < MAX_ATTEMPTS) {
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`  HTTP ${res.status}, retry in ${wait}ms`);
      await sleep(wait);
      return callGemini(prompt, attempt + 1);
    }
    const text = await res.text();
    throw new Error(`Gemini ${res.status} after retries: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 400)}`);
  }

  const data: any = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    if (attempt < MAX_ATTEMPTS) {
      await sleep(2000);
      return callGemini(prompt, attempt + 1);
    }
    throw new Error(`empty response: ${JSON.stringify(data).slice(0, 200)}`);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    try {
      const cleaned = text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      parsed = JSON.parse(repairJson(cleaned));
    } catch (err) {
      if (attempt < MAX_ATTEMPTS) {
        const wait = 2000 * Math.pow(2, attempt);
        console.warn(`  json parse failed, retry in ${wait}ms`);
        await sleep(wait);
        return callGemini(prompt, attempt + 1);
      }
      throw new Error(
        `json parse failed: ${(err as Error).message} (text starts: ${text.slice(0, 80)}…)`,
      );
    }
  }

  if (!parsed || !Array.isArray(parsed.translations)) {
    if (attempt < MAX_ATTEMPTS) {
      await sleep(2000);
      return callGemini(prompt, attempt + 1);
    }
    throw new Error(`unexpected shape: ${JSON.stringify(parsed).slice(0, 200)}`);
  }

  return parsed.translations as Translation[];
}

// ─── Sampling ───
/**
 * Take conversations sequentially until we reach `target` utterances.
 * Deterministic — every language gets the same sample.
 */
function sampleConversations(data: any[], target: number): any[] {
  const sampled: any[] = [];
  let total = 0;
  for (const conv of data) {
    if (total >= target) break;
    sampled.push(conv);
    total += conv.utterances.length;
  }
  return sampled;
}

// ─── Prompt builder ───
function buildPrompt(
  utterances: { id: string; text: string; speaker: string }[],
  lang: string,
): string {
  const { native, english } = LANG_NAMES[lang];

  const langSpecific: string[] = [];
  if (lang === "yue") {
    langSpecific.push(
      `Script: traditional Chinese characters, Hong Kong Cantonese vocabulary (NOT Mandarin, NOT simplified).`,
      `Use Cantonese particles (嘅/咗/嗎/喎/㗎/啦) instead of Mandarin particles (的/了/吗/呢).`,
    );
  } else if (lang === "th") {
    langSpecific.push(`Script: Thai script only. Do not use romanization.`);
  } else if (lang === "vi") {
    langSpecific.push(`Script: Vietnamese with diacritics (Quốc Ngữ).`);
  } else if (lang === "ja") {
    langSpecific.push(
      `Use natural Japanese. ASSISTANT should use です/ます form; USER can use casual speech.`,
    );
  }

  const lines = utterances
    .map((u) => `[${u.id}|${u.speaker}] ${u.text}`)
    .join("\n");

  return [
    `You are a professional translator. Translate the following conversation utterances from English to ${english} (${native}).`,
    ``,
    `Rules:`,
    `1. Translate each utterance's text to ${english}.`,
    `2. Use natural, colloquial language appropriate for spoken conversation.`,
    `3. Preserve proper nouns (restaurant names, place names, brand names) — transliterate only if the target language's script requires it.`,
    `4. Maintain the tone and formality level of each utterance.`,
    `5. ASSISTANT utterances should sound like a helpful assistant; USER utterances should sound like a natural customer.`,
    `6. Do not add explanations, notes, or transliterations.`,
    ...(langSpecific.length ? ["", ...langSpecific] : []),
    ``,
    `Utterances to translate:`,
    lines,
    ``,
    `Return a JSON object with a "translations" array. Each item has "id" (matching the input exactly, including the "|SPEAKER" suffix if present) and "text" (the translation).`,
    `Every utterance must have exactly one translation in the output.`,
    `CRITICAL: preserve the exact id string from the input, do not remove or alter the "|SPEAKER" part.`,
  ].join("\n");
}

// ─── Main ───
async function main() {
  if (!langArg) {
    console.error("Error: --lang=<code> is required");
    process.exit(1);
  }

  const langInfo = LANG_NAMES[langArg];
  if (!langInfo) {
    console.error(
      `Error: unknown language "${langArg}". Supported: ${Object.keys(LANG_NAMES).join(", ")}`,
    );
    process.exit(1);
  }

  console.log(`✓ Language: ${langArg} (${langInfo.english})`);
  console.log(`✓ Sample size: ${sampleSize} utterances per domain`);
  console.log(`✓ Overwrite: ${overwrite}`);
  console.log(`✓ Dry run: ${dryRun}`);
  console.log("");

  if (langArg !== "en") {
    if (!GEMINI_API_KEY) {
      console.error(
        "Error: GEMINI_API_KEY is empty. Get one at https://aistudio.google.com/apikey",
      );
      process.exit(1);
    }
    console.log(`✓ Model: ${GEMINI_MODEL}`);
  }

  // Stats
  let totalTranslated = 0;
  let totalMissing = 0;
  let successDomains = 0;
  let failDomains = 0;
  let estTokensIn = 0;
  let estTokensOut = 0;

  const BATCH_SIZE = 50;

  for (const dom of DOMAINS) {
    if (domainArg && domainArg !== dom) continue;

    const srcPath = path.join(SOURCE_DIR, `${dom}.json`);
    const outPath = path.join(BASE_DIR, langArg, `${dom}.json`);

    // Skip existing (unless --overwrite)
    if (!overwrite && fs.existsSync(outPath)) {
      const existing = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      const existingUtts = existing.reduce(
        (s: number, d: any) => s + d.utterances.length,
        0,
      );
      console.log(
        `[skip] ${langArg}/${dom} (${existingUtts} utterances already exist)`,
      );
      totalTranslated += existingUtts;
      successDomains++;
      continue;
    }

    // Read source
    const data = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
    const sampled = sampleConversations(data, sampleSize);
    const totalUtts = sampled.reduce(
      (s: number, d: any) => s + d.utterances.length,
      0,
    );
    console.log(
      `[${langArg}/${dom}] ${sampled.length} conversations, ${totalUtts} utterances`,
    );

    // For en: just sample and write (no API call)
    if (langArg === "en") {
      if (!dryRun) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(sampled, null, 2) + "\n");
      }
      totalTranslated += totalUtts;
      successDomains++;
      console.log(`  ✓ written (en, no translation needed)`);
      continue;
    }

    // Build flat utterance list for translation
    const utterances: { id: string; text: string; speaker: string }[] = [];
    for (const conv of sampled) {
      for (const utt of conv.utterances) {
        utterances.push({
          id: `${conv.conversation_id}|${utt.index}`,
          text: utt.text,
          speaker: utt.speaker,
        });
      }
    }

    // Translate in batches
    const translationMap = new Map<string, string>();
    const numBatches = Math.ceil(utterances.length / BATCH_SIZE);

    for (let b = 0; b < numBatches; b++) {
      const batch = utterances.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
      const prompt = buildPrompt(batch, langArg);
      estTokensIn += prompt.length / 4;

      process.stdout.write(
        `  batch ${b + 1}/${numBatches} (${batch.length} utts)… `,
      );

      try {
        const t0 = Date.now();
        const translations = await callGemini(prompt);
        const ms = ((Date.now() - t0) / 1000).toFixed(1);

        for (const tr of translations) {
          // Normalize id: LLM sometimes appends "|SPEAKER" to the id.
          // Strip everything after the second "|" to recover the original key.
          const id = tr.id.split("|").slice(0, 2).join("|");
          translationMap.set(id, tr.text);
        }

        const outTextLen = JSON.stringify(translations).length;
        estTokensOut += outTextLen / 3;

        console.log(`✓ ${translations.length} translations in ${ms}s`);
      } catch (err) {
        console.error(`✗ ${(err as Error).message}`);
        failDomains++;
        // Continue with next batch — partial output is better than nothing
      }

      // Rate limit (stay under Gemini free-tier 15 RPM)
      if (b < numBatches - 1) await sleep(4500);
    }

    // Map translations back into conversation structure
    let missing = 0;
    for (const conv of sampled) {
      for (const utt of conv.utterances) {
        const id = `${conv.conversation_id}|${utt.index}`;
        const translated = translationMap.get(id);
        if (translated) {
          utt.text = translated;
        } else {
          missing++;
        }
      }
    }

    if (missing > 0) {
      console.warn(`  ⚠ ${missing}/${totalUtts} translations missing (kept English)`);
      totalMissing += missing;
    }

    // Write output
    if (!dryRun) {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(sampled, null, 2) + "\n");
    }

    totalTranslated += totalUtts - missing;
    if (failDomains === 0 || missing < totalUtts) successDomains++;
    console.log(
      `  ✓ ${langArg}/${dom}: ${totalUtts - missing}/${totalUtts} translated`,
    );

    // Rate limit between domains
    await sleep(2000);
  }

  // Summary
  const estCost = (estTokensIn * 0.30 + estTokensOut * 2.50) / 1_000_000;
  console.log(`\n=== done ===`);
  console.log(`  domains ok:    ${successDomains}/${DOMAINS.length}`);
  console.log(`  domains fail:  ${failDomains}`);
  console.log(`  translated:    ${totalTranslated} utterances`);
  console.log(`  missing:       ${totalMissing} utterances`);
  console.log(
    `  est. tokens:   ${Math.round(estTokensIn)} in / ${Math.round(estTokensOut)} out`,
  );
  console.log(`  est. cost:     $${estCost.toFixed(3)}`);
  console.log(`  output dir:    ${path.relative(process.cwd(), BASE_DIR)}/${langArg}/`);

  if (failDomains > 0 && successDomains === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
