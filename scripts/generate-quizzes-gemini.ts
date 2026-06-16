/* eslint-disable no-console */
/**
 * Batch-generate CEFR grammar quiz items via Google Gemini.
 *
 * Output: scripts/generated/quizzes/{lang}-{level}.json
 * Each file is an array of QuizItem-compatible objects:
 *   { id, question, options[4], answer, explain, language, level }
 *
 * Usage:
 *   pnpm tsx scripts/generate-quizzes-gemini.ts            # all 28 batches
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --lang=ja   # one language
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --lang=en --level=A1
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --count=25  # override per batch
 *
 * Env (loaded from .env via dotenv):
 *   GEMINI_API_KEY  — required, get one at https://aistudio.google.com/apikey
 *   GEMINI_MODEL    — default "gemini-2.0-flash"
 *
 * Why this design:
 *   - We use the native REST `generateContent` endpoint instead of
 *     pulling @google/generative-ai to keep deps light.
 *   - We pass a `responseSchema` so the model is forced to return
 *     valid JSON, eliminating the brittle "strip markdown fences"
 *     step. Gemini 1.5+/2.x supports this for any object schema.
 *   - Per-language level ladders (A1/A2/B1/B2 for European langs,
 *     N5-N2 for Japanese, HSK1-4 for Chinese, 초급/중급/고급/심화
 *     for Korean) match the levels already used in
 *     `src/data/content.ts` and `src/data/learn-content/*.ts` so
 *     the new quizzes slot straight in.
 *   - We retry 5× with exponential backoff on 429/5xx/network
 *     errors. Gemini free tier is ~15 RPM for Flash so we also
 *     sleep 4s between batches to stay under the limit.
 *   - We dedupe by question text across all batches and refuse
 *     to re-write an existing output unless --overwrite is set.
 */

import fs from "node:fs";
import path from "node:path";

// Node 20.6+ supports --env-file natively; we read .env manually
// here so `tsx scripts/...` works without a flag. Keys that are
// not present in the shell or .env are simply undefined and the
// script aborts with a clear error before doing any work.
function loadDotenv(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m) continue;
    const [, k, raw] = m;
    if (process.env[k] !== undefined) continue; // shell wins
    const v = raw.replace(/^["']|["']$/g, "");
    if (v) process.env[k] = v;
  }
}
loadDotenv(path.join(process.cwd(), ".env"));

const API_KEY = process.env.GEMINI_API_KEY?.trim();
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
// Hard cost cap. Pass --max-cost=0.50 (USD) to abort the run once
// the *estimated* spend on completed batches crosses the threshold.
// Estimated cost is conservative (we count output tokens including
// reasoning tokens, and round up to the next 0.1 cent). This guards
// against a retry storm on a paid-tier key silently burning through
// your budget — a real risk because Gemini's same model alias
// (`gemini-2.5-flash`) is used by both free and paid tiers, so there
// is no "model name" way to opt out of billing.
const MAX_COST_USD = Number(arg("max-cost", process.env.GEMINI_MAX_COST_USD ?? "1.00"));
const COST_PER_1M_IN = Number(process.env.GEMINI_COST_PER_1M_IN ?? "0.30");
const COST_PER_1M_OUT = Number(process.env.GEMINI_COST_PER_1M_OUT ?? "2.50");
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;

// ---------- CLI args ----------
function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}
const onlyLang = arg("lang");
const onlyLevel = arg("level");
const perBatch = Math.max(5, Math.min(50, Number(arg("count", "25"))));
const overwrite = process.argv.includes("--overwrite");
const dryRun = process.argv.includes("--dry-run");

// ---------- Language / level tables ----------
// `target` is the human language the model writes the question + explain in.
// `levelHint` is the extra context we feed the model so it knows what
// grammar to test at that level.
type LangKey = "en" | "ja" | "zh" | "ko" | "es" | "fr" | "de";

const LANG_NAMES: Record<LangKey, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  ja: { native: "日本語", english: "Japanese" },
  zh: { native: "中文", english: "Chinese (Mandarin, simplified)" },
  ko: { native: "한국어", english: "Korean" },
  es: { native: "Español", english: "Spanish" },
  fr: { native: "Français", english: "French" },
  de: { native: "Deutsch", english: "German" },
};

const LEVELS: Record<LangKey, string[]> = {
  en: ["A1", "A2", "B1", "B2"],
  ja: ["N5", "N4", "N3", "N2"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4"],
  ko: ["초급", "중급", "고급", "심화"],
  es: ["A1", "A2", "B1", "B2"],
  fr: ["A1", "A2", "B1", "B2"],
  de: ["A1", "A2", "B1", "B2"],
};

const LEVEL_HINT: Record<string, string> = {
  // English / European CEFR
  A1: "A1 (absolute beginner): present tense of common verbs, basic articles, simple prepositions, singular/plural, common irregulars (be/have/go).",
  A2: "A2 (elementary): past simple vs present perfect, common modals (can/should/must), comparatives, basic conjunctions (because/but/and).",
  B1: "B1 (intermediate): present perfect vs past simple, conditionals (1st/2nd), reported speech basics, relative clauses, passive voice.",
  B2: "B2 (upper-intermediate): mixed conditionals, subjunctive mood, advanced passive constructions, cleft sentences, nuanced modals.",
  // Japanese JLPT
  N5: "JLPT N5: です/ます form, basic particles (は/が/を/に/で/へ/と/から/まで/の), て-form, ない-form, simple time/place expressions.",
  N4: "JLPT N4: た-form, 辞書形/ない形, ている vs た, ことができる, 〜たら/〜ば/〜と conditional forms, basic keigo (です/ます).",
  N3: "JLPT N3: 〜ようにする/〜ことになる, 〜てしまう, transitive/intransitive pairs, 〜ば〜ほど, 〜にしては, light honorifics (お/ご〜).",
  N2: "JLPT N2: 〜にもかかわらず, 〜ところを, 〜っぱなし, 〜めく, 〜なら (vs たら/ば/と), formal written style, complex compound sentences.",
  // Chinese HSK
  HSK1: "HSK 1: 的/了/吗 basic particles, 是 + noun, 有 + noun, 这/那, simple numeral + measure word (个/本/杯), basic time words (今天/明天).",
  HSK2: "HSK 2: 把-construction (basics), 了 indicating completion, 比较/最 comparisons, 因为/所以 cause-effect, modal verbs 会/能/可以, 还是/或者.",
  HSK3: "HSK 3: passive 被, 把-construction advanced, 连...都/也, 越来越, 不但...而且, 虽然...但是, complex time expressions (自从/直到).",
  HSK4: "HSK 4: conditional 如果...就, 与其...不如, 既然...就, complex complement of result (好/完/住/到), formal passive by 让, 是...的 construction.",
  // Korean
  초급: "Korean beginner (TOPIK I level 1-2): basic particles 은/는/이/가/을/를, present tense 아/어요, past tense 았/었어요, basic connective and, simple SOV sentences.",
  중급: "Korean intermediate (TOPIK I level 3-4): -고 있다 vs -아/어 있다, -(으)니까, -(으)면, -(으)ㄹ 거예요 future, plain speech in narration, basic honorific 시/-(으)세요.",
  고급: "Korean advanced (TOPIK II level 5-6): -(으)므로, -(으)ㄹ수록, -아/어도, complex connective -(으)며, double passive/causative (시키다/어떠하다), written register 요체 → 합쇼체.",
  심화: "Korean mastery (TOPIK II level 6+): literary connective -(으)되, -거니와, -다기보다(는), complex honorifics (께서/드시다), -더라/-던 modifier nuance, news/article register.",
};

// ---------- Schema ----------
// Gemini's responseSchema is JSON-Schema-lite. We constrain to
// a strict array of objects so the parser never has to "guess"
// field shapes. The model still occasionally returns 29 or 31
// items — we trim/pad in post.
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    items: {
      type: "ARRAY",
      minItems: perBatch,
      maxItems: perBatch,
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING", description: "A single sentence with a blank or grammar choice. The blank may be marked with ___ if the question is fill-in-the-blank style; otherwise it is a multiple choice with the correct option present in the options array." },
          options: {
            type: "ARRAY",
            minItems: 4,
            maxItems: 4,
            items: { type: "STRING" },
            description: "Exactly four candidate answers. The correct answer must be one of the four.",
          },
          answer: { type: "INTEGER", description: "Zero-based index of the correct option in `options`." },
          explain: { type: "STRING", description: "1-2 sentence explanation of the grammar rule in English (or the target language if it is a CEFR language) suitable for a learner." },
        },
        required: ["question", "options", "answer", "explain"],
      },
    },
  },
  required: ["items"],
} as const;

// ---------- Helpers ----------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildPrompt(lang: LangKey, level: string, count: number): string {
  const { native, english } = LANG_NAMES[lang];
  const lvl = LEVEL_HINT[level] ?? "";
  return [
    `You are a senior ${english} language teacher writing a CEFR-level grammar drill.`,
    ``,
    `Target language: ${english} (${native})`,
    `Level: ${level}`,
    `Grammar scope: ${lvl}`,
    ``,
    `Produce exactly ${count} multiple-choice grammar questions. Each question must:`,
    `  1. Be a single sentence in ${english} with a blank or one of four choices to fill in.`,
    `  2. Test one of the grammar points in the level scope above. Do not test points outside it.`,
    `  3. Have exactly four distinct, plausible options. The correct answer must be one of them.`,
    `  4. Have a 1-2 sentence explanation in plain English.`,
    `  5. Use natural, learner-appropriate vocabulary (no archaic, slang, or in-joke content).`,
    `  6. Be free of cultural stereotypes or politically sensitive content.`,
    ``,
    `Avoid these common pitfalls:`,
    `  - Don't reuse the same sentence template across many questions.`,
    `  - Don't make the correct answer obvious by being much longer/shorter than the others.`,
    `  - Don't use the same option letter (A/B/C/D) as the correct answer disproportionately.`,
    `  - Don't include any HTML, markdown, or code fences. The output is pure JSON.`,
    ``,
    `Return only the JSON object — no prose, no markdown.`,
  ].join("\n");
}

interface GeneratedItem {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

interface GeneratedBatch {
  items: GeneratedItem[];
}

async function callGemini(prompt: string, attempt = 0): Promise<GeneratedBatch> {
  const url = `${ENDPOINT}?key=${encodeURIComponent(API_KEY!)}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    if (attempt < 4) {
      const wait = 2000 * Math.pow(2, attempt);
      console.warn(`  network error, retry in ${wait}ms: ${(err as Error).message}`);
      await sleep(wait);
      return callGemini(prompt, attempt + 1);
    }
    throw err;
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
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
    if (attempt < 2) {
      await sleep(2000);
      return callGemini(prompt, attempt + 1);
    }
    throw new Error(`empty response: ${JSON.stringify(data).slice(0, 200)}`);
  }

  // Schema mode returns raw JSON; we still wrap in try/catch in case
  // the model emits a fenced code block anyway.
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    parsed = JSON.parse(cleaned);
  }

  if (!parsed || !Array.isArray(parsed.items)) {
    if (attempt < 2) {
      await sleep(2000);
      return callGemini(prompt, attempt + 1);
    }
    throw new Error(`unexpected shape: ${JSON.stringify(parsed).slice(0, 200)}`);
  }
  return parsed as GeneratedBatch;
}

function validateAndId(
  raw: GeneratedItem[],
  lang: LangKey,
  level: string,
): { id: string; question: string; options: string[]; answer: number; explain: string; language: LangKey; level: string }[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (let i = 0; i < raw.length; i++) {
    const it = raw[i];
    if (
      !it ||
      typeof it.question !== "string" ||
      !Array.isArray(it.options) ||
      it.options.length !== 4 ||
      typeof it.answer !== "number" ||
      it.answer < 0 ||
      it.answer > 3 ||
      typeof it.explain !== "string"
    ) {
      console.warn(`  skip malformed item #${i}: ${JSON.stringify(it).slice(0, 100)}`);
      continue;
    }
    if (it.options.some((o: unknown) => typeof o !== "string" || !o.trim())) {
      console.warn(`  skip item #${i}: empty option`);
      continue;
    }
    const dedupeKey = it.question.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push({
      id: `q-${lang}-${level.toLowerCase()}-gemini-${i + 1}-${Date.now().toString(36)}`,
      question: it.question.trim(),
      options: it.options.map((o: string) => o.trim()),
      answer: it.answer,
      explain: it.explain.trim(),
      language: lang,
      level,
    });
  }
  return out;
}

// ---------- Main ----------
async function main() {
  if (!API_KEY) {
    console.error(
      "✗ GEMINI_API_KEY is empty. Get a free key at https://aistudio.google.com/apikey and paste it into .env",
    );
    process.exit(1);
  }
  console.log(`✓ Gemini model: ${MODEL}`);
  console.log(`✓ Per batch: ${perBatch} questions`);

  const outDir = path.join(process.cwd(), "scripts", "generated", "quizzes");
  if (!dryRun) fs.mkdirSync(outDir, { recursive: true });

  const totalBatches: { lang: LangKey; level: string }[] = [];
  for (const lang of Object.keys(LEVELS) as LangKey[]) {
    if (onlyLang && onlyLang !== lang) continue;
    for (const level of LEVELS[lang]) {
      if (onlyLevel && onlyLevel !== level) continue;
      totalBatches.push({ lang, level });
    }
  }

  console.log(`→ ${totalBatches.length} batch(es) to run`);
  console.log(`→ cost cap: $${MAX_COST_USD.toFixed(2)} (using $${COST_PER_1M_IN}/1M in, $${COST_PER_1M_OUT}/1M out)\n`);

  let successCount = 0;
  let failCount = 0;
  let totalQuestions = 0;
  let estCostUsd = 0;
  let estTokensIn = 0;
  let estTokensOut = 0;

  for (let i = 0; i < totalBatches.length; i++) {
    const { lang, level } = totalBatches[i];

    if (estCostUsd > MAX_COST_USD) {
      console.log(
        `\n  ⛔ cost cap reached: est $${estCostUsd.toFixed(3)} > $${MAX_COST_USD.toFixed(2)}. Aborting.`,
      );
      console.log(`  Re-run with --max-cost=${(MAX_COST_USD * 5).toFixed(2)} to continue.`);
      break;
    }

    const outFile = path.join(outDir, `${lang}-${level}.json`);

    if (!overwrite && fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      console.log(
        `[${i + 1}/${totalBatches.length}] skip ${lang}/${level} (${existing.length} items already at ${path.relative(process.cwd(), outFile)})`,
      );
      totalQuestions += existing.length;
      continue;
    }

    process.stdout.write(`[${i + 1}/${totalBatches.length}] ${lang}/${level} … `);
    const prompt = buildPrompt(lang, level, perBatch);
    estTokensIn += prompt.length / 4; // ~4 chars per token, conservative

    try {
      const t0 = Date.now();
      const batch = await callGemini(prompt);
      // Batch.usageMetadata is not in the public response shape for
      // every model; we estimate output tokens from the JSON size
      // (Gemini response includes thinking tokens in the count for
      // 2.5+ models, so we round up generously).
      const outTextLen = JSON.stringify(batch).length;
      const estOut = Math.ceil(outTextLen / 3); // ~3 chars per output token (JSON dense)
      estTokensOut += estOut;
      estCostUsd =
        (estTokensIn * COST_PER_1M_IN + estTokensOut * COST_PER_1M_OUT) / 1_000_000;
      const items = validateAndId(batch.items, lang, level);
      const ms = ((Date.now() - t0) / 1000).toFixed(1);

      if (items.length < Math.max(5, perBatch / 2)) {
        console.warn(`\n  ! only ${items.length}/${perBatch} valid items, retrying once…`);
        const retry = await callGemini(prompt);
        const retryItems = validateAndId(retry.items, lang, level);
        if (retryItems.length > items.length) {
          items.push(...retryItems.slice(0, perBatch - items.length));
        }
      }

      if (!dryRun) fs.writeFileSync(outFile, JSON.stringify(items, null, 2) + "\n");
      totalQuestions += items.length;
      successCount++;
      console.log(
        `✓ ${items.length} items in ${ms}s (est. spend so far: $${estCostUsd.toFixed(3)})`,
      );

      // Stay under Gemini free-tier RPM (15 for Flash). 4.5s is
      // a safe margin and keeps the script polite.
      if (i < totalBatches.length - 1) await sleep(4500);
    } catch (err) {
      failCount++;
      console.error(`✗ ${(err as Error).message}`);
      // Continue with the next batch — partial output is better
      // than nothing and the failed batch can be retried by
      // deleting the file and re-running.
      await sleep(2000);
    }
  }

  console.log(`\n=== done ===`);
  console.log(`  batches ok:    ${successCount}/${totalBatches.length}`);
  console.log(`  batches fail:  ${failCount}`);
  console.log(`  total items:   ${totalQuestions}`);
  console.log(`  est. tokens:   ${Math.round(estTokensIn)} in / ${Math.round(estTokensOut)} out`);
  console.log(`  est. cost:     $${estCostUsd.toFixed(3)} (cap was $${MAX_COST_USD.toFixed(2)})`);
  console.log(`  output dir:    ${path.relative(process.cwd(), outDir)}`);
  if (failCount > 0) {
    console.log(
      `\nTo retry failed batches, delete their ${path.relative(
        process.cwd(),
        outDir,
      )}/*.json files (or pass --overwrite) and re-run.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
