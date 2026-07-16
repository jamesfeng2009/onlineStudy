/* eslint-disable no-console */
/**
 * Generate listening fill-in-the-blank exercises and speaking phrases
 * via LLM (Gemini / OpenRouter / Doubao) for all 10 languages.
 *
 * Output:
 *   scripts/generated/listening/{lang}-{level}.json
 *   scripts/generated/speaking/{lang}-{level}.json
 *
 * Usage:
 *   # Default: Gemini
 *   pnpm tsx scripts/generate-listening-speaking-gemini.ts
 *   # Use OpenRouter (Qwen 2.5 72B, best multilingual price/quality)
 *   LLM_PROVIDER=openrouter pnpm tsx scripts/generate-listening-speaking-gemini.ts
 *   # Filter
 *   pnpm tsx scripts/generate-listening-speaking-gemini.ts --lang=ja
 *   pnpm tsx scripts/generate-listening-speaking-gemini.ts --type=listening
 *   pnpm tsx scripts/generate-listening-speaking-gemini.ts --count=10
 *
 * Env (loaded from .env / .env.local):
 *   GEMINI_API_KEY     — for en/es/fr/de/it/th (Gemini)
 *   DASHSCOPE_API_KEY  — for zh/ja/ko/yue (Qwen via DashScope,东亚语言更优)
 *   OPENROUTER_API_KEY — alternative (if LLM_PROVIDER=openrouter)
 *   DOUBAO_API_KEY     — alternative (if LLM_PROVIDER=doubao)
 *   LLM_MODEL          — override model name
 *   LLM_COST_PER_1M_IN / LLM_COST_PER_1M_OUT — cost cap accounting
 *   LLM_MAX_COST_USD   — abort once est. spend crosses this (default 1.00)
 *
 * Key: listening scripts MUST use spaces between words so that
 * script.split(" ") produces correct token indices for blanks.
 * For ja/zh, we insert spaces between words/phrases.
 */
import fs from "node:fs";
import path from "node:path";

// ─── .env loader ───
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

// ─── Provider router (per-language) ───
// P4-4: 东亚语言(zh/ja/ko/yue)走 Qwen(DashScope),其他走 Gemini
type Provider = "gemini" | "openrouter" | "doubao" | "dashscope";

const PROVIDER_BY_LANG: Record<string, Provider> = {
  zh: "dashscope",   // Qwen2.5-72B via DashScope
  ja: "dashscope",
  ko: "dashscope",
  yue: "dashscope",
  en: "gemini",
  es: "gemini",
  fr: "gemini",
  de: "gemini",
  it: "gemini",
  th: "gemini",
};

// Fallback provider (when lang not in PROVIDER_BY_LANG)
const FALLBACK_PROVIDER: Provider = (process.env.LLM_PROVIDER as Provider) || "gemini";

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-flash",
  openrouter: "qwen/qwen-2.5-72b-instruct",
  doubao: "doubao-seed-2.0-mini",
  dashscope: "qwen2.5-72b-instruct",
};

const ENDPOINTS: Record<Provider, { url: (m: string) => string; auth: (k: string) => Record<string, string> }> = {
  gemini: {
    url: (m) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,
    auth: (k) => ({ "x-goog-api-key": k }),
  },
  openrouter: {
    url: () => "https://openrouter.ai/api/v1/chat/completions",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
  },
  doubao: {
    url: () => "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
  },
  dashscope: {
    url: () => "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
  },
};

function getApiKey(provider: Provider): string | undefined {
  return ({
    gemini: process.env.GEMINI_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
    doubao: process.env.DOUBAO_API_KEY,
    dashscope: process.env.DASHSCOPE_API_KEY,
  }[provider])?.trim();
}

interface ProviderConfig {
  provider: Provider;
  apiKey: string;
  model: string;
  endpoint: typeof ENDPOINTS[Provider];
}

function getProviderForLang(lang: string): ProviderConfig {
  const provider = PROVIDER_BY_LANG[lang] ?? FALLBACK_PROVIDER;
  const apiKey = getApiKey(provider);
  if (!apiKey) {
    throw new Error(
      `API key not configured for provider "${provider}" (lang=${lang}). ` +
      `Set ${provider.toUpperCase()}_API_KEY in .env`
    );
  }
  const model = process.env.LLM_MODEL?.trim() || DEFAULT_MODEL[provider];
  const endpoint = ENDPOINTS[provider];
  return { provider, apiKey, model, endpoint };
}

const MAX_COST_USD = Number(process.env.LLM_MAX_COST_USD ?? "1.00");
const COST_PER_1M_IN = Number(process.env.LLM_COST_PER_1M_IN ?? "0.30");
const COST_PER_1M_OUT = Number(process.env.LLM_COST_PER_1M_OUT ?? "2.50");

// ─── CLI args ───
function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}
const onlyLang = arg("lang");
const onlyType = arg("type"); // "listening" | "speaking" | undefined (both)
const perBatch = Math.max(3, Math.min(20, Number(arg("count", "5"))));
const overwrite = process.argv.includes("--overwrite");
const dryRun = process.argv.includes("--dry-run");

// ─── Language / level tables ───
type LangKey = "en" | "ja" | "zh" | "ko" | "es" | "fr" | "de" | "it" | "th" | "yue";
const LANGS: LangKey[] = ["en", "ja", "zh", "ko", "es", "fr", "de", "it", "th", "yue"];

const LEVELS: Record<LangKey, string[]> = {
  // P4-1: 扩展到完整等级体系,与 src/data/languages.ts 对齐
  en: ["A1", "A2", "B1", "B2", "C1", "C2"],
  ja: ["N5", "N4", "N3", "N2", "N1"],
  zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
  ko: ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"],
  es: ["A1", "A2", "B1", "B2", "C1", "C2"],
  fr: ["A1", "A2", "B1", "B2", "C1", "C2"],
  de: ["A1", "A2", "B1", "B2", "C1", "C2"],
  it: ["A1", "A2", "B1", "B2", "C1", "C2"],
  th: ["A1", "A2", "B1", "B2", "C1"],
  yue: ["A1", "A2", "B1", "B2"],
};

const LANG_NATIVE: Record<LangKey, string> = {
  en: "English",
  ja: "Japanese",
  zh: "Chinese (Mandarin, simplified)",
  ko: "Korean",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  th: "Thai",
  yue: "Cantonese (traditional, Hong Kong)",
};

// Per-language extra rules appended to the prompt.
function langRules(lang: LangKey): string {
  if (lang === "yue") {
    return [
      "Script: traditional Chinese characters, Hong Kong Cantonese vocabulary (NOT Mandarin, NOT simplified).",
      "Do NOT use Mandarin-only particles (的/了/吗/呢). Use Cantonese particles (嘅/咗/嗎/喎/㗎/啦).",
      "Translation must be in Mandarin Chinese (simplified) so a Mandarin speaker can compare meaning.",
    ].join("\n");
  }
  if (lang === "th") {
    return "Script: Thai script only. Do not use romanization or transliteration in phrase or script.";
  }
  return "";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Best-effort JSON repair (see generate-quizzes-gemini.ts for details).
function repairJson(input: string): string {
  let s = input;
  const lastQuote = s.lastIndexOf('"');
  if (lastQuote === -1) return s;
  let inStr = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') inStr = !inStr;
  }
  if (inStr) s += '"';
  inStr = false;
  escape = false;
  let opens = 0;
  let closes = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
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

// Unified LLM caller. Gemini uses native generateContent + responseSchema;
// OpenRouter/Doubao/DashScope use OpenAI-compatible chat/completions + response_format.
async function callLLM(prompt: string, schema: object, lang: string, attempt = 0): Promise<any> {
  const { provider, apiKey, model, endpoint } = getProviderForLang(lang);

  let url: string;
  let headers: Record<string, string>;
  let body: any;

  if (provider === "gemini") {
    url = `${endpoint.url(model)}?key=${encodeURIComponent(apiKey)}`;
    headers = { "Content-Type": "application/json", ...endpoint.auth(apiKey) };
    body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    };
  } else {
    // openrouter / doubao / dashscope: OpenAI-compatible chat/completions
    const sysMsg = "You are a strict JSON generator. Output ONLY a JSON array — no prose, no markdown fences, no apologies. Match the schema requested in the user message.";
    url = endpoint.url(model);
    headers = { "Content-Type": "application/json", ...endpoint.auth(apiKey) };
    body = {
      model,
      messages: [
        { role: "system", content: sysMsg },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    };
  }

  let res: Response;
  try {
    res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  } catch (err) {
    if (attempt < 4) {
      const wait = 2000 * Math.pow(2, attempt);
      console.warn(`  [${provider}] network error, retry in ${wait}ms: ${(err as Error).message}`);
      await sleep(wait);
      return callLLM(prompt, schema, lang, attempt + 1);
    }
    throw err;
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`  [${provider}] HTTP ${res.status}, retry in ${wait}ms`);
      await sleep(wait);
      return callLLM(prompt, schema, lang, attempt + 1);
    }
    const text = await res.text();
    throw new Error(`${provider} ${res.status} after retries: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${provider} ${res.status}: ${text.slice(0, 400)}`);
  }

  const data: any = await res.json();
  let text: string | undefined;
  if (provider === "gemini") {
    text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } else {
    text = data?.choices?.[0]?.message?.content;
  }
  if (!text) {
    if (attempt < 2) {
      await sleep(2000);
      return callLLM(prompt, schema, lang, attempt + 1);
    }
    throw new Error(`empty response from ${provider}: ${JSON.stringify(data).slice(0, 200)}`);
  }

  // Clean + parse
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
      throw new Error(
        `json parse failed: ${(err as Error).message} (text starts: ${text.slice(0, 80)}…)`,
      );
    }
  }

  // OpenRouter/Doubao/DashScope return an object (response_format=json_object)
  // but our prompt asked for an array. Unwrap if the model wrapped it.
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.items)) return parsed.items;
  if (Array.isArray(parsed.data)) return parsed.data;
  if (Array.isArray(parsed.exercises)) return parsed.exercises;
  if (Array.isArray(parsed.phrases)) return parsed.phrases;
  return parsed;
}

// ── Listening generator ──
async function generateListening(lang: LangKey, level: string, count: number) {
  const native = LANG_NATIVE[lang];
  const spaceNote = lang === "en"
    ? "Use normal English spacing."
    : `CRITICAL: Insert a space between every word/phrase in the script so that script.split(' ') produces correct tokens. For example: ${lang === "ja" ? "私 は 毎日 朝 7時 に 起きます" : lang === "th" ? "ฉัน ไป ตลาด ทุก เช้า" : lang === "yue" ? "我 想 去 香港" : "我 每天 早上 七点 起床"}`;

  const rules = langRules(lang);
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
${rules ? `- ${rules.replace(/\n/g, "\n- ")}\n` : ""}- Return a JSON array of ${count} objects. The top-level JSON value MUST be an array.`;

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

  const data = await callLLM(prompt, schema, lang);
  return Array.isArray(data) ? data : [];
}

// ── Speaking generator ──
async function generateSpeaking(lang: LangKey, level: string, count: number) {
  const native = LANG_NATIVE[lang];
  const rules = langRules(lang);
  const prompt = `Generate ${count} speaking practice phrases for ${native} learners at level ${level}.
Each phrase has:
- phrase: a natural conversational phrase in ${native}
- translation: Chinese translation of the phrase
- phonetic: IPA phonetic transcription (for en) or romaji/pinyin (for ja/zh), or empty string
- level: "${level}"

Rules:
- Phrases should be commonly used in daily life.
- Vary the topics: greetings, ordering food, asking directions, shopping, etc.
${rules ? `- ${rules.replace(/\n/g, "\n- ")}\n` : ""}- Return a JSON array of ${count} objects. The top-level JSON value MUST be an array.`;

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

  const data = await callLLM(prompt, schema, lang);
  return Array.isArray(data) ? data : [];
}

// ── Main ──
async function main() {
  // P4-4: 检查所有需要用到的 provider 的 API key
  const keyUrl: Record<Provider, string> = {
    gemini: "https://aistudio.google.com/apikey",
    openrouter: "https://openrouter.ai/keys",
    doubao: "https://www.volcengine.com/product/ark",
    dashscope: "https://dashscope.console.aliyun.com/apiKey",
  };
  const envName: Record<Provider, string> = {
    gemini: "GEMINI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    doubao: "DOUBAO_API_KEY",
    dashscope: "DASHSCOPE_API_KEY",
  };

  // 确定本次运行涉及哪些语言,检查对应 provider 的 key
  const langsToRun = onlyLang ? [onlyLang as LangKey] : LANGS;
  const providersNeeded = new Set<Provider>();
  for (const lang of langsToRun) {
    providersNeeded.add(PROVIDER_BY_LANG[lang] ?? FALLBACK_PROVIDER);
  }
  for (const p of providersNeeded) {
    if (!getApiKey(p)) {
      console.error(
        `✗ ${envName[p]} is empty (needed for provider "${p}"). Get one at ${keyUrl[p]} and paste it into .env.`,
      );
      process.exit(1);
    }
  }

  console.log(`✓ Per batch: ${perBatch} items`);
  console.log(`✓ Providers: ${[...providersNeeded].map((p) => `${p}(${DEFAULT_MODEL[p]})`).join(", ")}`);
  console.log(`→ cost cap: $${MAX_COST_USD.toFixed(2)} (using $${COST_PER_1M_IN}/1M in, $${COST_PER_1M_OUT}/1M out)\n`);

  const listenDir = path.join(process.cwd(), "scripts", "generated", "listening");
  const speakDir = path.join(process.cwd(), "scripts", "generated", "speaking");
  if (!dryRun && (!onlyType || onlyType === "listening")) fs.mkdirSync(listenDir, { recursive: true });
  if (!dryRun && (!onlyType || onlyType === "speaking")) fs.mkdirSync(speakDir, { recursive: true });

  const batches: { type: "listening" | "speaking"; lang: LangKey; level: string }[] = [];
  for (const lang of LANGS) {
    if (onlyLang && onlyLang !== lang) continue;
    for (const level of LEVELS[lang]) {
      if (!onlyType || onlyType === "listening") batches.push({ type: "listening", lang, level });
      if (!onlyType || onlyType === "speaking") batches.push({ type: "speaking", lang, level });
    }
  }

  console.log(`→ ${batches.length} batch(es) to run\n`);

  let ok = 0;
  let fail = 0;
  let totalItems = 0;
  let estCostUsd = 0;
  let estTokensIn = 0;
  let estTokensOut = 0;

  for (let i = 0; i < batches.length; i++) {
    const { type, lang, level } = batches[i];

    if (estCostUsd > MAX_COST_USD) {
      console.log(`\n  ⛔ cost cap reached: est $${estCostUsd.toFixed(3)} > $${MAX_COST_USD.toFixed(2)}. Aborting.`);
      console.log(`  Re-run with LLM_MAX_COST_USD=${(MAX_COST_USD * 5).toFixed(2)} to continue.`);
      break;
    }

    const dir = type === "listening" ? listenDir : speakDir;
    const outFile = path.join(dir, `${lang}-${level}.json`);

    if (!overwrite && fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      console.log(`[${i + 1}/${batches.length}] skip ${type}/${lang}/${level} (${existing.length} items already at ${path.relative(process.cwd(), outFile)})`);
      totalItems += existing.length;
      continue;
    }

    process.stdout.write(`[${i + 1}/${batches.length}] ${type}/${lang}/${level} … `);

    try {
      const t0 = Date.now();
      const data = type === "listening"
        ? await generateListening(lang, level, perBatch)
        : await generateSpeaking(lang, level, perBatch);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("empty or non-array response");
      }

      // Add ids and language field
      const withMeta = data.map((item: any, idx: number) => ({
        ...item,
        id: `${type === "listening" ? "l" : "s"}-${lang}-${level.toLowerCase()}-gemini-${idx + 1}-${Date.now().toString(36)}`,
        language: lang,
      }));

      // cost accounting
      const outTextLen = JSON.stringify(withMeta).length;
      estTokensIn += 400; // ~400 input tokens per prompt (rough)
      estTokensOut += Math.ceil(outTextLen / 3);
      estCostUsd = (estTokensIn * COST_PER_1M_IN + estTokensOut * COST_PER_1M_OUT) / 1_000_000;

      if (!dryRun) fs.writeFileSync(outFile, JSON.stringify(withMeta, null, 2), "utf-8");
      const ms = ((Date.now() - t0) / 1000).toFixed(1);
      totalItems += withMeta.length;
      ok++;
      console.log(`✓ ${withMeta.length} items in ${ms}s (est. $${estCostUsd.toFixed(3)})`);

      // Polite delay (Gemini free-tier: 15 RPM for Flash, DashScope more lenient)
      const batchProvider = PROVIDER_BY_LANG[batch.lang] ?? FALLBACK_PROVIDER;
      if (i < batches.length - 1) await sleep(batchProvider === "gemini" ? 4500 : 1000);
    } catch (e: any) {
      console.error(`✗ ${e.message}`);
      fail++;
      await sleep(2000);
    }
  }

  console.log(`\n=== done ===`);
  console.log(`  batches ok:   ${ok}/${batches.length}`);
  console.log(`  batches fail: ${fail}`);
  console.log(`  total items:  ${totalItems}`);
  console.log(`  est. tokens:  ${Math.round(estTokensIn)} in / ${Math.round(estTokensOut)} out`);
  console.log(`  est. cost:    $${estCostUsd.toFixed(3)} (cap was $${MAX_COST_USD.toFixed(2)})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
