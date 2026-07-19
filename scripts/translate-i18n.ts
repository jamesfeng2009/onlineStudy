/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * LLM-powered i18n translation pipeline.
 *
 * Translates src/locales/en/{translation,learn}.json into the 12 non-English
 * UI languages via chunked LLM calls (5–10KB per request), with automatic
 * structural/placeholder validation and resume-friendly chunk caching.
 *
 * Provider routing (user decision 2026-07):
 *   - th/ms/id/vi  → DashScope (Qwen2.5-72B, China-direct) — run LOCALLY
 *   - zh/ja/ko/yue/es/fr/de/it → Gemini — run via GitHub Actions
 *     (.github/workflows/translate-i18n.yml), because Gemini blocks CN IPs.
 *
 * Usage:
 *   pnpm tsx scripts/translate-i18n.ts --export-only          # chunk en source
 *   pnpm tsx scripts/translate-i18n.ts --lang=ms              # one language
 *   pnpm tsx scripts/translate-i18n.ts --provider=dashscope   # all SEA langs
 *   pnpm tsx scripts/translate-i18n.ts --provider=gemini      # all Gemini langs (GH)
 *   pnpm tsx scripts/translate-i18n.ts --lang=ms --chunk=translation:nav   # smoke test
 *   pnpm tsx scripts/translate-i18n.ts --lang=ms --merge-only # re-merge from chunks
 *   pnpm tsx scripts/translate-i18n.ts --lang=ms --overwrite  # ignore chunk cache
 *
 * Chunks live in scripts/generated/i18n-chunks/{lang}/{file}/{chunkId}.json
 * and are committed to git so local and CI runs share progress.
 *
 * Env (loaded from .env.local / .env):
 *   GEMINI_API_KEY / DASHSCOPE_API_KEY
 *   LLM_MODEL              — override batch model
 *   LLM_MAX_COST_USD       — abort above this est. spend (default 5.00)
 *   LLM_COST_PER_1M_IN / LLM_COST_PER_1M_OUT — cost accounting rates
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ---------- .env loader (same convention as generate-quizzes-gemini.ts) ----------
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

// ---------- CLI args ----------
function arg(name: string, def?: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=").slice(1).join("=") : def;
}
const EXPORT_ONLY = process.argv.includes("--export-only");
const MERGE_ONLY = process.argv.includes("--merge-only");
const OVERWRITE = process.argv.includes("--overwrite");
const DRY_RUN = process.argv.includes("--dry-run");
const REFINE = process.argv.includes("--refine");
const onlyLangs = arg("lang")?.split(",").map((s) => s.trim()).filter(Boolean);
const onlyProvider = arg("provider") as Provider | undefined;
const onlyFile = arg("file"); // "translation" | "learn"
const onlyChunk = arg("chunk"); // e.g. "translation:nav"
const CONCURRENCY = Math.max(1, Math.min(4, Number(arg("concurrency", "2"))));

// ---------- Provider router ----------
type Provider = "gemini" | "dashscope";

// User decision: SEA languages → DashScope locally; everything else → Gemini on GH Actions.
const PROVIDER_BY_LANG: Record<string, Provider> = {
  th: "dashscope",
  ms: "dashscope",
  id: "dashscope",
  vi: "dashscope",
  zh: "gemini",
  ja: "gemini",
  ko: "gemini",
  yue: "gemini",
  es: "gemini",
  fr: "gemini",
  de: "gemini",
  it: "gemini",
};

const TARGET_LANGS = Object.keys(PROVIDER_BY_LANG);

const LANG_NAMES: Record<string, { native: string; english: string; note?: string }> = {
  zh: { native: "简体中文", english: "Chinese (Simplified)" },
  ja: { native: "日本語", english: "Japanese" },
  ko: { native: "한국어", english: "Korean" },
  yue: {
    native: "粵語（繁體，香港）",
    english: "Cantonese (Traditional, Hong Kong)",
    note: "Use natural Hong Kong written Cantonese (唔係/喺/咗/嘅), Traditional characters only.",
  },
  es: { native: "Español", english: "Spanish" },
  fr: { native: "Français", english: "French" },
  de: { native: "Deutsch", english: "German" },
  it: { native: "Italiano", english: "Italian" },
  th: { native: "ภาษาไทย", english: "Thai" },
  ms: { native: "Bahasa Melayu", english: "Malay", note: "Use polite standard Malay (anda, not kamu)." },
  id: { native: "Bahasa Indonesia", english: "Indonesian", note: "Use polite standard Indonesian (Anda, not kamu)." },
  vi: { native: "Tiếng Việt", english: "Vietnamese", note: "Use bạn for 'you'. Preserve correct Unicode tone marks." },
};

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-flash",
  dashscope: "qwen2.5-72b-instruct",
};
const REFINE_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-pro",
  dashscope: "qwen-max-latest",
};

const ENDPOINTS: Record<Provider, { url: (m: string) => string; auth: (k: string) => Record<string, string> }> = {
  gemini: {
    url: (m) => `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,
    auth: (k) => ({ "x-goog-api-key": k }),
  },
  dashscope: {
    url: () => "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
  },
};

interface ProviderConfig {
  provider: Provider;
  apiKey: string;
  model: string;
}

function getProviderForLang(lang: string, refine = false): ProviderConfig {
  const provider = PROVIDER_BY_LANG[lang];
  if (!provider) throw new Error(`no provider routed for lang "${lang}"`);
  const apiKey = (provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.DASHSCOPE_API_KEY)?.trim();
  if (!apiKey) {
    throw new Error(
      `${provider === "gemini" ? "GEMINI_API_KEY" : "DASHSCOPE_API_KEY"} is empty (lang=${lang}). ` +
        (provider === "gemini"
          ? "Run Gemini languages via .github/workflows/translate-i18n.yml instead."
          : "Add it to .env — https://dashscope.console.aliyun.com/apiKey"),
    );
  }
  const model = process.env.LLM_MODEL?.trim() || (refine ? REFINE_MODEL[provider] : DEFAULT_MODEL[provider]);
  return { provider, apiKey, model };
}

// ---------- Cost accounting ----------
const MAX_COST_USD = Number(arg("max-cost", process.env.LLM_MAX_COST_USD ?? "5.00"));
const COST_PER_1M_IN = Number(process.env.LLM_COST_PER_1M_IN ?? "0.30");
const COST_PER_1M_OUT = Number(process.env.LLM_COST_PER_1M_OUT ?? "2.50");
let spentIn = 0;
let spentOut = 0;
function addUsage(tokensIn: number, tokensOut: number) {
  spentIn += tokensIn;
  spentOut += tokensOut;
}
function spentUsd() {
  return (spentIn * COST_PER_1M_IN + spentOut * COST_PER_1M_OUT) / 1_000_000;
}

// ---------- Paths ----------
const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "locales");
const CHUNKS_DIR = path.join(ROOT, "scripts", "generated", "i18n-chunks");
const FILES = ["translation", "learn"] as const;
type FileKind = (typeof FILES)[number];

// ---------- Chunking ----------
const MAX_CHUNK_BYTES = 8 * 1024; // 8KB source per request (5–10KB guideline)

interface Chunk {
  id: string; // "translation:nav" or "learn:scenarioContent#3"
  file: FileKind;
  topKey: string;
  value: any; // subtree content of this chunk (object rooted under topKey)
  bytes: number;
}

function byteSize(v: any): number {
  return Buffer.byteLength(JSON.stringify(v), "utf-8");
}

/** Split one top-level subtree into chunk values, each ≤ MAX_CHUNK_BYTES. */
function splitSubtree(value: any, depth = 0): any[] {
  if (byteSize(value) <= MAX_CHUNK_BYTES || depth > 4 || value === null || typeof value !== "object" || Array.isArray(value)) {
    return [value];
  }
  // Greedy bin-pack entries; oversized single entries recurse one level deeper.
  const bins: any[] = [];
  let current: Record<string, any> = {};
  let currentBytes = 2; // {}
  for (const [k, v] of Object.entries(value)) {
    const entryBytes = byteSize({ [k]: v }) - 2; // approximate entry contribution
    if (entryBytes > MAX_CHUNK_BYTES) {
      if (Object.keys(current).length) {
        bins.push(current);
        current = {};
        currentBytes = 2;
      }
      for (const sub of splitSubtree(v, depth + 1)) bins.push({ [k]: sub });
      continue;
    }
    if (currentBytes + entryBytes > MAX_CHUNK_BYTES && Object.keys(current).length) {
      bins.push(current);
      current = {};
      currentBytes = 2;
    }
    current[k] = v;
    currentBytes += entryBytes;
  }
  if (Object.keys(current).length) bins.push(current);
  return bins;
}

/**
 * Split a language-keyed map so each chunk holds exactly ONE language key.
 * LLMs tend to drop/add language-code keys when several appear side by side
 * (they mistake them for content-language markers), so we never mix them.
 */
function splitPerKey(value: Record<string, any>): any[] {
  const out: any[] = [];
  for (const [k, v] of Object.entries(value)) {
    if (byteSize(v) > MAX_CHUNK_BYTES && isPlainObject(v)) {
      // Single language still too big: split deeper, keeping the
      // single-language wrapper around each part.
      for (const sub of splitSubtree(v)) out.push({ [k]: sub });
    } else {
      out.push({ [k]: v });
    }
  }
  return out;
}

/** Structural re-merge: `out` patched into `src` — keys added/removed by the
 *  model are silently corrected, placeholder/scalar checks still apply. */
function structuralMerge(src: any, out: any): any {
  if (isPlainObject(src)) {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(src)) {
      result[k] = k in (out ?? {}) ? structuralMerge(v, out[k]) : v;
    }
    return result;
  }
  if (Array.isArray(src)) {
    if (!Array.isArray(out)) return src;
    return src.map((v, i) => (i < out.length ? structuralMerge(v, out[i]) : v));
  }
  return out === undefined ? src : out;
}

function buildChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  // Language-keyed maps: one language per chunk (see splitPerKey).
  const PER_KEY: Record<string, string[]> = {
    learn: ["langPage", "vocabOverview", "scenarioContent"],
  };
  for (const file of FILES) {
    const src = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, "en", `${file}.json`), "utf-8"));
    for (const [topKey, value] of Object.entries(src)) {
      const parts = PER_KEY[file]?.includes(topKey)
        ? splitPerKey(value as Record<string, any>)
        : splitSubtree(value);
      parts.forEach((part, i) => {
        chunks.push({
          id: `${file}:${topKey}${parts.length > 1 ? `#${i}` : ""}`,
          file,
          topKey,
          value: part,
          bytes: byteSize(part),
        });
      });
    }
  }
  return chunks;
}

// ---------- Deep utils ----------
function isPlainObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Recursively merge `patch` into `base` (returns new object; arrays/scalars replaced). */
function deepMerge(base: any, patch: any): any {
  if (isPlainObject(base) && isPlainObject(patch)) {
    const out: Record<string, any> = { ...base };
    for (const [k, v] of Object.entries(patch)) out[k] = k in base ? deepMerge(base[k], v) : v;
    return out;
  }
  return patch === undefined ? base : patch;
}

function nfcDeep(node: any): any {
  if (typeof node === "string") return node.normalize("NFC");
  if (Array.isArray(node)) return node.map(nfcDeep);
  if (isPlainObject(node)) {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(node)) out[k] = nfcDeep(v);
    return out;
  }
  return node;
}

// ---------- Validation ----------
const PLACEHOLDER_RE = /\{\{[^}]+\}\}/g;

function placeholderMultiset(s: string): string {
  return (s.match(PLACEHOLDER_RE) ?? []).sort().join(" ");
}

interface ValidationError {
  path: string;
  message: string;
}

/** Compare translated chunk against source chunk: same shape, same placeholders, same numbers. */
function validateChunk(src: any, out: any, pathPrefix = ""): ValidationError[] {
  const errors: ValidationError[] = [];
  const at = (p: string) => (pathPrefix ? `${pathPrefix}.${p}` : p);

  if (typeof src === "string") {
    if (typeof out !== "string") {
      errors.push({ path: pathPrefix, message: `expected string, got ${typeof out}` });
      return errors;
    }
    const a = placeholderMultiset(src);
    const b = placeholderMultiset(out);
    if (a !== b) errors.push({ path: pathPrefix, message: `placeholders differ: src[${a}] vs out[${b}]` });
    if (src.trim().length > 0 && out.trim().length === 0)
      errors.push({ path: pathPrefix, message: "empty translation" });
    return errors;
  }
  if (typeof src === "number" || typeof src === "boolean" || src === null) {
    if (out !== src) errors.push({ path: pathPrefix, message: `scalar changed: ${src} → ${out}` });
    return errors;
  }
  if (Array.isArray(src)) {
    if (!Array.isArray(out) || out.length !== src.length) {
      errors.push({ path: pathPrefix, message: `array length differ: ${src.length} vs ${Array.isArray(out) ? out.length : "n/a"}` });
      return errors;
    }
    src.forEach((v, i) => errors.push(...validateChunk(v, out[i], `${pathPrefix}[${i}]`)));
    return errors;
  }
  if (isPlainObject(src)) {
    if (!isPlainObject(out)) {
      errors.push({ path: pathPrefix, message: `expected object, got ${Array.isArray(out) ? "array" : typeof out}` });
      return errors;
    }
    const srcKeys = Object.keys(src);
    const outKeys = new Set(Object.keys(out));
    for (const k of srcKeys) {
      if (!outKeys.has(k)) {
        errors.push({ path: at(k), message: "missing key" });
        continue;
      }
      errors.push(...validateChunk(src[k], out[k], at(k)));
    }
    for (const k of outKeys) {
      if (!srcKeys.includes(k)) errors.push({ path: at(k), message: "unexpected extra key" });
    }
    return errors;
  }
  return errors;
}

/** Heuristic: count string leaves still identical to English (informational only). */
function countUntranslated(src: any, out: any): number {
  if (typeof src === "string") {
    // Ignore short strings, brand names, pure punctuation/numbers.
    if (src.length < 24) return 0;
    return src === out ? 1 : 0;
  }
  if (Array.isArray(src)) return src.reduce((n, v, i) => n + countUntranslated(v, out?.[i]), 0);
  if (isPlainObject(src))
    return Object.keys(src).reduce((n, k) => n + countUntranslated(src[k], out?.[k]), 0);
  return 0;
}

// ---------- LLM call ----------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildSystemPrompt(lang: string): string {
  const info = LANG_NAMES[lang];
  const lines = [
    `You are a professional translator for LangOria, a language-learning web app.`,
    `Translate the JSON string VALUES in the user message from English into ${info.english} (${info.native}).`,
    ``,
    `Rules:`,
    `1. Output STRICT JSON only — same structure, same keys, same key order. No markdown fences, no commentary.`,
    `2. Translate only string values. Keep numbers, booleans and null unchanged. Keep arrays the same length.`,
    `3. Keep interpolation placeholders EXACTLY as-is, e.g. {{count}}, {{level}} — do not translate, reorder or reformat them.`,
    `4. Keep these untranslated: the brand name "LangOria", CEFR levels (A1–C2), JLPT levels (N5–N1), HSK levels, TOPIK levels, URLs, emoji.`,
    `5. Use natural, fluent, consistent UI language. For learning-content text, prefer "reading/learning" terminology over "playing/watching".`,
    `6. Do not add or remove keys. Do not merge or split array items.`,
    `7. Keys that are language codes (en, zh, ja, ko, es, fr, de, it, th, yue, ms, id, vi) or level codes (A1, N5, HSK1, TOPIK1, ...) are STRUCTURAL keys, not content. Keep every single one of them exactly as-is — translate the text UNDER them into ${info.native}, including text that describes another language.`,
  ];
  if (info.note) lines.push(`8. ${info.note}`);
  return lines.join("\n");
}

async function callLLM(
  cfg: ProviderConfig,
  systemPrompt: string,
  userPayload: string,
  attempt = 0,
): Promise<{ text: string; tokensIn: number; tokensOut: number }> {
  let url: string;
  let headers: Record<string, string>;
  let body: any;

  if (cfg.provider === "gemini") {
    url = `${ENDPOINTS.gemini.url(cfg.model)}?key=${encodeURIComponent(cfg.apiKey)}`;
    headers = { "Content-Type": "application/json", ...ENDPOINTS.gemini.auth(cfg.apiKey) };
    body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPayload }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      },
    };
  } else {
    url = ENDPOINTS.dashscope.url(cfg.model);
    headers = { "Content-Type": "application/json", ...ENDPOINTS.dashscope.auth(cfg.apiKey) };
    body = {
      model: cfg.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPayload },
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 16384,
      response_format: { type: "json_object" },
    };
  }

  let res: Response;
  try {
    res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  } catch (err) {
    if (attempt < 4) {
      const wait = 2000 * Math.pow(2, attempt);
      console.warn(`    network error, retry in ${wait}ms: ${(err as Error).message}`);
      await sleep(wait);
      return callLLM(cfg, systemPrompt, userPayload, attempt + 1);
    }
    throw err;
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`    HTTP ${res.status}, retry in ${wait}ms`);
      await sleep(wait);
      return callLLM(cfg, systemPrompt, userPayload, attempt + 1);
    }
    const text = await res.text();
    throw new Error(`${cfg.provider} ${res.status} after retries: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${cfg.provider} ${res.status}: ${text.slice(0, 400)}`);
  }

  const data: any = await res.json();
  let text: string | undefined;
  let tokensIn = 0;
  let tokensOut = 0;
  if (cfg.provider === "gemini") {
    text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    tokensIn = data?.usageMetadata?.promptTokenCount ?? 0;
    tokensOut = data?.usageMetadata?.candidatesTokenCount ?? 0;
  } else {
    text = data?.choices?.[0]?.message?.content;
    tokensIn = data?.usage?.prompt_tokens ?? 0;
    tokensOut = data?.usage?.completion_tokens ?? 0;
  }
  if (!text) {
    if (attempt < 2) {
      await sleep(2000);
      return callLLM(cfg, systemPrompt, userPayload, attempt + 1);
    }
    throw new Error(`empty response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  // Fallback token estimate when the provider omits usage.
  if (!tokensIn) tokensIn = Math.ceil((systemPrompt.length + userPayload.length) / 4);
  if (!tokensOut) tokensOut = Math.ceil(text.length / 4);
  return { text, tokensIn, tokensOut };
}

function parseJsonLoose(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(cleaned);
  }
}

// ---------- Chunk cache ----------
function chunkPath(lang: string, chunk: Chunk): string {
  const safeId = chunk.id.replace(/[:#]/g, "__");
  return path.join(CHUNKS_DIR, lang, chunk.file, `${safeId}.json`);
}

function loadCachedChunk(lang: string, chunk: Chunk): any | undefined {
  const p = chunkPath(lang, chunk);
  if (!fs.existsSync(p)) return undefined;
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf-8"));
    const errors = validateChunk(chunk.value, data);
    if (errors.length) {
      console.warn(`    cached chunk invalid (${errors.length} errors), will re-translate`);
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}

function saveChunk(lang: string, chunk: Chunk, data: any) {
  const p = chunkPath(lang, chunk);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// ---------- Translate one chunk (with validation retries) ----------
async function translateChunk(lang: string, chunk: Chunk, refine: boolean): Promise<{ data: any; untranslated: number }> {
  const cfg = getProviderForLang(lang, refine);
  const systemPrompt = buildSystemPrompt(lang);
  let userPayload = JSON.stringify(chunk.value);
  let lastErrors: ValidationError[] = [];

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      const hint = lastErrors
        .slice(0, 10)
        .map((e) => `- ${e.path}: ${e.message}`)
        .join("\n");
      userPayload =
        `Your previous output failed validation:\n${hint}\n\n` +
        `Fix ALL issues and output the complete corrected JSON for the SAME source:\n` +
        JSON.stringify(chunk.value);
    }
    if (DRY_RUN) return { data: chunk.value, untranslated: 0 };

    const { text, tokensIn, tokensOut } = await callLLM(cfg, systemPrompt, userPayload);
    addUsage(tokensIn, tokensOut);

    let parsed: any;
    try {
      parsed = parseJsonLoose(text);
    } catch (err) {
      lastErrors = [{ path: "(root)", message: `json parse failed: ${(err as Error).message}` }];
      console.warn(`    parse failed (attempt ${attempt + 1}/3)`);
      continue;
    }

    // Structural re-merge first: silently corrects keys the model added or
    // dropped, then validate what actually matters (placeholders, scalars,
    // empty strings, array content).
    const merged = structuralMerge(chunk.value, parsed);
    const errors = validateChunk(chunk.value, merged);
    if (errors.length === 0) {
      const untranslated = countUntranslated(chunk.value, merged);
      return { data: merged, untranslated };
    }
    lastErrors = errors;
    console.warn(`    validation failed (attempt ${attempt + 1}/3): ${errors.length} errors, e.g. ${errors[0].path}: ${errors[0].message}`);
  }
  throw new Error(`chunk ${chunk.id} failed after 3 attempts (${lastErrors.length} validation errors)`);
}

// ---------- Merge ----------
function mergeLanguage(lang: string, chunks: Chunk[]): { written: string[]; missing: string[] } {
  const written: string[] = [];
  const missing: string[] = [];

  for (const file of FILES) {
    const srcPath = path.join(LOCALES_DIR, "en", `${file}.json`);
    const src = JSON.parse(fs.readFileSync(srcPath, "utf-8"));

    // Layer 1: existing target-locale file as fallback (preserves prior work
    // when a chunk is missing/failed).
    const targetPath = path.join(LOCALES_DIR, lang, `${file}.json`);
    let merged = src;
    if (fs.existsSync(targetPath)) {
      try {
        merged = deepMerge(src, JSON.parse(fs.readFileSync(targetPath, "utf-8")));
      } catch {
        /* keep en base */
      }
    }

    // Layer 2: translated chunks.
    for (const chunk of chunks.filter((c) => c.file === file)) {
      const p = chunkPath(lang, chunk);
      if (!fs.existsSync(p)) {
        missing.push(chunk.id);
        continue;
      }
      const data = JSON.parse(fs.readFileSync(p, "utf-8"));
      merged = deepMerge(merged, { [chunk.topKey]: data });
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(nfcDeep(merged), null, 2) + "\n", "utf-8");
    written.push(targetPath);
  }
  return { written, missing };
}

// ---------- Manifest ----------
function writeManifest(chunks: Chunk[]) {
  const enT = fs.readFileSync(path.join(LOCALES_DIR, "en", "translation.json"));
  const enL = fs.readFileSync(path.join(LOCALES_DIR, "en", "learn.json"));
  const sourceHash = crypto.createHash("sha256").update(enT).update(enL).digest("hex").slice(0, 16);
  fs.mkdirSync(CHUNKS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(CHUNKS_DIR, "manifest.json"),
    JSON.stringify(
      {
        sourceHash,
        generatedAt: new Date().toISOString(),
        maxChunkBytes: MAX_CHUNK_BYTES,
        chunks: chunks.map((c) => ({ id: c.id, file: c.file, topKey: c.topKey, bytes: c.bytes })),
      },
      null,
      2,
    ) + "\n",
    "utf-8",
  );
}

// ---------- Main ----------
async function runPool<T>(items: T[], worker: (item: T) => Promise<void>, concurrency: number) {
  let idx = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (idx < items.length) {
      const item = items[idx++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function main() {
  const chunks = buildChunks();
  writeManifest(chunks);

  const totalBytes = chunks.reduce((n, c) => n + c.bytes, 0);
  console.log(`[translate-i18n] ${chunks.length} chunks, ${(totalBytes / 1024).toFixed(1)}KB source`);
  if (EXPORT_ONLY) {
    for (const c of chunks) console.log(`  ${c.id.padEnd(40)} ${(c.bytes / 1024).toFixed(1)}KB`);
    console.log("[translate-i18n] export-only done");
    return;
  }

  let langs = TARGET_LANGS.filter((l) => !onlyLangs || onlyLangs.includes(l));
  if (onlyProvider) langs = langs.filter((l) => PROVIDER_BY_LANG[l] === onlyProvider);
  if (langs.length === 0) throw new Error("no languages selected");

  let selectedChunks = chunks.filter(
    (c) => (!onlyFile || c.file === onlyFile) && (!onlyChunk || c.id === onlyChunk),
  );
  if (selectedChunks.length === 0) throw new Error("no chunks selected");

  console.log(`[translate-i18n] langs: ${langs.join(", ")} | chunks/lang: ${selectedChunks.length} | concurrency: ${CONCURRENCY}`);
  if (REFINE) console.log(`[translate-i18n] refine mode — models: ${langs.map((l) => `${l}=${getProviderForLang(l, true).model}`).join(", ")}`);

  for (const lang of langs) {
    if (spentUsd() > MAX_COST_USD) {
      console.warn(`[translate-i18n] cost cap $${MAX_COST_USD} reached ($${spentUsd().toFixed(3)}), stopping`);
      break;
    }
    const cfg = getProviderForLang(lang); // throws early if key missing
    console.log(`\n[${lang}] provider=${cfg.provider} model=${REFINE ? getProviderForLang(lang, true).model : cfg.model}`);

    let done = 0;
    let cached = 0;
    let failed = 0;
    let untranslatedTotal = 0;
    const failures: string[] = [];

    await runPool(
      selectedChunks,
      async (chunk) => {
        if (!OVERWRITE && !REFINE) {
          const hit = loadCachedChunk(lang, chunk);
          if (hit !== undefined) {
            cached++;
            done++;
            return;
          }
        }
        try {
          const { data, untranslated } = await translateChunk(lang, chunk, REFINE);
          saveChunk(lang, chunk, data);
          untranslatedTotal += untranslated;
          done++;
          if (done % 10 === 0 || done === selectedChunks.length) {
            console.log(`  [${lang}] ${done}/${selectedChunks.length} chunks (cached ${cached}) ~$${spentUsd().toFixed(3)}`);
          }
        } catch (err) {
          failed++;
          failures.push(chunk.id);
          console.error(`  ✗ [${lang}] ${chunk.id}: ${(err as Error).message}`);
        }
      },
      CONCURRENCY,
    );

    console.log(`[${lang}] translated ${done - cached}, cached ${cached}, failed ${failed}` +
      (untranslatedTotal ? ` | ⚠ ${untranslatedTotal} string(s) look untranslated` : ""));
    if (failures.length) console.log(`[${lang}] failed chunks: ${failures.join(", ")}`);

    if (!DRY_RUN) {
      const { written, missing } = mergeLanguage(lang, chunks);
      for (const w of written) console.log(`  wrote ${path.relative(ROOT, w)}`);
      if (missing.length) console.warn(`  ⚠ ${missing.length} chunk(s) missing → fell back to existing/en: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""}`);
    }
  }

  console.log(`\n[translate-i18n] done. tokens in=${spentIn} out=${spentOut} est.cost=$${spentUsd().toFixed(3)}`);
}

main().catch((err) => {
  console.error("[translate-i18n] failed:", err);
  process.exit(1);
});
