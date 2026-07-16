/* eslint-disable no-console */
/**
 * Batch-generate CEFR/JLPT/HSK/TOPIK grammar quiz items via LLM.
 *
 * Output: scripts/generated/quizzes/{lang}-{level}.json
 * Each file is an array of QuizItem-compatible objects:
 *   { id, question, options[4], answer, explain, language, level }
 *
 * Usage:
 *   pnpm tsx scripts/generate-quizzes-gemini.ts            # all batches
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --lang=ja   # one language
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --lang=en --level=A1
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --count=25  # override per batch
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --provider=gemini    # GH Actions
 *   pnpm tsx scripts/generate-quizzes-gemini.ts --provider=dashscope # local CN
 *
 * Provider routing (P1, mirrors generate-listening-speaking-gemini.ts):
 *   - zh/ja/ko/yue → DashScope (Qwen2.5-72B, China-direct, better CJK)
 *   - en/es/fr/de/it/th/ms/id/vi → Gemini (run via GitHub Actions from CN)
 * Pass --provider=<name> to filter (GitHub Actions uses --provider=gemini
 * to skip DashScope languages whose key is absent on the runner).
 *
 * Env (loaded from .env / .env.local):
 *   GEMINI_API_KEY     — for en/es/fr/de/it/th/ms/id/vi
 *   DASHSCOPE_API_KEY  — for zh/ja/ko/yue
 *   OPENROUTER_API_KEY — alternative for any language
 *   DOUBAO_API_KEY     — alternative (Volcano Ark)
 *   LLM_MODEL          — override model name per provider
 *   LLM_COST_PER_1M_IN / LLM_COST_PER_1M_OUT — cost cap accounting
 *   LLM_MAX_COST_USD   — abort once est. spend crosses this (default 1.00)
 */

import fs from "node:fs";
import path from "node:path";

// Node 20.6+ supports --env-file natively; we read .env manually
// here so `tsx scripts/...` works without a flag. Precedence
// matches Vite / Next.js / SvelteKit convention:
//   shell  >  .env.local  >  .env
function loadDotenv(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m) continue;
    const [, k, raw] = m;
    if (process.env[k] !== undefined) continue; // already set (shell or earlier file)
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

// ─── Provider router (per-language, mirrors listening-speaking script) ───
type Provider = "gemini" | "openrouter" | "doubao" | "dashscope";

const PROVIDER_BY_LANG: Record<string, Provider> = {
  zh: "dashscope",   // Qwen2.5-72B via DashScope — better CJK
  ja: "dashscope",
  ko: "dashscope",
  yue: "dashscope",
  en: "gemini",
  es: "gemini",
  fr: "gemini",
  de: "gemini",
  it: "gemini",
  th: "gemini",
  ms: "gemini",
  id: "gemini",
  vi: "gemini",
};

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
    const envName: Record<Provider, string> = {
      gemini: "GEMINI_API_KEY",
      openrouter: "OPENROUTER_API_KEY",
      doubao: "DOUBAO_API_KEY",
      dashscope: "DASHSCOPE_API_KEY",
    };
    const keyUrl: Record<Provider, string> = {
      gemini: "https://aistudio.google.com/apikey",
      openrouter: "https://openrouter.ai/keys",
      doubao: "https://www.volcengine.com/product/ark",
      dashscope: "https://dashscope.console.aliyun.com/apiKey",
    };
    throw new Error(
      `${envName[provider]} is empty for provider "${provider}" (lang=${lang}). Get one at ${keyUrl[provider]}.`,
    );
  }
  const model = process.env.LLM_MODEL?.trim() || DEFAULT_MODEL[provider];
  const endpoint = ENDPOINTS[provider];
  return { provider, apiKey, model, endpoint };
}

// Hard cost cap. Per-1M-token cost used by the cost cap. Defaults match
// Gemini 2.5 Flash; override LLM_COST_PER_1M_IN / LLM_COST_PER_1M_OUT
// for the provider you are using.
const MAX_COST_USD = Number(
  arg("max-cost", process.env.LLM_MAX_COST_USD ?? "1.00"),
);
const COST_PER_1M_IN = Number(process.env.LLM_COST_PER_1M_IN ?? "0.30");
const COST_PER_1M_OUT = Number(process.env.LLM_COST_PER_1M_OUT ?? "2.50");

const onlyLang = arg("lang");
const onlyLevel = arg("level");
// P1: filter by provider so GitHub Actions can run only gemini languages
// (en/es/fr/de/it/th/ms/id/vi) while DashScope languages (zh/ja/ko/yue)
// run locally. Values: "gemini" | "dashscope" | "openrouter" | "doubao" | undefined (all).
const onlyProvider = arg("provider") as Provider | undefined;
// Gemini-2.5-flash occasionally emits JSON with truncated strings when
// max_output_tokens squeezes the response. 25 items × ~270 output chars
// pushes the model close to the cap, so we default to 20 and let the
// caller raise it via --count.
const DEFAULT_PER_BATCH = 20;
const perBatch = Math.max(
  5,
  Math.min(50, Number(arg("count", String(DEFAULT_PER_BATCH)))),
);
const overwrite = process.argv.includes("--overwrite");
const dryRun = process.argv.includes("--dry-run");

// ---------- Language / level tables ----------
// `target` is the human language the model writes the question + explain in.
// `levelHint` is the extra context we feed the model so it knows what
// grammar to test at that level.
type LangKey = "en" | "ja" | "zh" | "ko" | "es" | "fr" | "de" | "it" | "th" | "yue" | "ms" | "id" | "vi";

const LANG_NAMES: Record<LangKey, { native: string; english: string }> = {
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

// P1: full level ladder aligned with src/data/language-registry.ts and
// the listening-speaking script. Post-P0 migration:
//   - ko: TOPIK1/3/5/6 already exist (P0 migration); TOPIK2/4 are new.
//   - yue: A1/B1/B2 already exist (P0 migration); A2 is new.
const LEVELS: Record<LangKey, string[]> = {
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
  ms: ["A1", "A2", "B1", "B2", "C1", "C2"],
  id: ["A1", "A2", "B1", "B2", "C1", "C2"],
  vi: ["A1", "A2", "B1", "B2", "C1", "C2"],
};

// Level hints keyed by `${lang}:${level}` first, then bare `${level}`
// as fallback (so yue:A1 doesn't collide with the CEFR A1 hint).
const LEVEL_HINT: Record<string, string> = {
  // English / European / SEA CEFR (shared by en/es/fr/de/it/ms/id/vi/th)
  "A1": "A1 (absolute beginner): present tense of common verbs, basic articles, simple prepositions, singular/plural, common irregulars (be/have/go).",
  "A2": "A2 (elementary): past simple vs present perfect, common modals (can/should/must), comparatives, basic conjunctions (because/but/and).",
  "B1": "B1 (intermediate): present perfect vs past simple, conditionals (1st/2nd), reported speech basics, relative clauses, passive voice.",
  "B2": "B2 (upper-intermediate): mixed conditionals, subjunctive mood, advanced passive constructions, cleft sentences, nuanced modals.",
  "C1": "C1 (advanced): nuanced modality (would have/could have/might have), inversion for emphasis (Not only...but also, Rarely do...), formal register control, complex relativization, discourse markers (nevertheless, nonetheless, invariably), subtle presupposition.",
  "C2": "C2 (mastery): idiomatic phrases and rare collocations, register-perfect discourse (legal/academic/literary), subtle implicature and entailment, advanced rhetorical devices (chiasmus, litotes, hyperbaton), play with pragmatics and presupposition.",
  // Japanese JLPT
  "N5": "JLPT N5: です/ます form, basic particles (は/が/を/に/で/へ/と/から/まで/の), て-form, ない-form, simple time/place expressions.",
  "N4": "JLPT N4: た-form, 辞書形/ない形, ている vs た, ことができる, 〜たら/〜ば/〜と conditional forms, basic keigo (です/ます).",
  "N3": "JLPT N3: 〜ようにする/〜ことになる, 〜てしまう, transitive/intransitive pairs, 〜ば〜ほど, 〜にしては, light honorifics (お/ご〜).",
  "N2": "JLPT N2: 〜にもかかわらず, 〜ところを, 〜っぱなし, 〜めく, 〜なら (vs たら/ば/と), formal written style, complex compound sentences.",
  "N1": "JLPT N1: 〜ずにはいられない/〜ないではおかない, 〜とはいえ, 〜であれ〜であれ, 〜にしてみれば/〜にとっても, 〜たるもの, formal written discourse markers (換言すれば/然るに/率爾に), 文語残留 (〜つつある, 〜べし, 〜め), complex compound sentences with multiple subordinate clauses.",
  // Chinese HSK (HSK 7-9 are the 2021 accelerated version)
  "HSK1": "HSK 1: 的/了/吗 basic particles, 是 + noun, 有 + noun, 这/那, simple numeral + measure word (个/本/杯), basic time words (今天/明天).",
  "HSK2": "HSK 2: 把-construction (basics), 了 indicating completion, 比较/最 comparisons, 因为/所以 cause-effect, modal verbs 会/能/可以, 还是/或者.",
  "HSK3": "HSK 3: passive 被, 把-construction advanced, 连...都/也, 越来越, 不但...而且, 虽然...但是, complex time expressions (自从/直到).",
  "HSK4": "HSK 4: conditional 如果...就, 与其...不如, 既然...就, complex complement of result (好/完/住/到), formal passive by 让, 是...的 construction.",
  "HSK5": "HSK 5: 反而/况且/无论...都, 复杂结果补语 (成/在/给/到), 间接引语, 暗喻 (是...的 emphasis), 即使...也, 与其说...不如说, 复杂定语 (关于...的).",
  "HSK6": "HSK 6: 进而/从而/因而, 复杂定语从句 (如...的 + noun), 文言色彩 (之/其/于/以), 转折让步 (尽管...却/纵然...亦), 隐喻与成语 (4-char idioms in formal writing), 间接指令.",
  "HSK7": "HSK 7 (2021 accelerated): 学术性话题 (经济/社会/历史/文化论述), 正式书面语 register, 长复合句与多级修饰, 抽象词汇 (融合/折射/凸显/衍变), 论证连接词 (诚然/固然/反之/申言之).",
  "HSK8": "HSK 8: 复杂逻辑论述 (因果多层嵌套/对比论证/驳论修辞), 文言与书面语交替使用, 抽象概念表达 (悖论/张力/互文性/语境), 长定语与多层定语从句, 跨段落衔接词 (综上/进而/反之/质言之).",
  "HSK9": "HSK 9 (mastery): 文学/古汉语渗透 (之乎者也残留, 文白夹杂), 修辞手法 (排比/对偶/借代/反讽), 跨领域抽象表达, 极长复合句, 文化负载词 (典故/成语隐喻), 古今汉语切换与语体感.",
  // Korean TOPIK (post-P0 migration: TOPIK I = 1-2, TOPIK II = 3-6)
  "TOPIK1": "TOPIK 1 (beginner low): basic particles 은/는/이/가/을/를, present tense 아/어요, past tense 았/었어요, basic connective -고, simple SOV sentences, 이에요/예요.",
  "TOPIK2": "TOPIK 2 (beginner high): -(으)려고, -(으)면 conditional, -(으)ㄹ 거예요 future, -아/어서 sequence, -(으)ㄹ 수 있다/없다 (can/cannot), basic honorific -(으)세요.",
  "TOPIK3": "TOPIK 3 (intermediate low): -고 있다 vs -아/어 있다, -(으)니까 reason, -(으)면 conditional, -(으)ㄹ 거예요 future, plain speech in narration (-다/ㄴ다), basic honorific 시/-(으)세요, -(으)려고/-(으)러 purpose.",
  "TOPIK4": "TOPIK 4 (intermediate high): -(으)ㄴ/는지 embedded question, -다고/냐고 indirect speech, -아/어도 concession, -느라고 reason (with effort), -(으)ㄹ 뻔하다 (almost), -기 때문에, -(이)라서.",
  "TOPIK5": "TOPIK 5 (advanced low): -(으)므로 formal reason, -(으)ㄹ수록 proportional, -아/어도 strong concession, complex connective -(으)며, double passive/causative (시키다/어떠하다), written register 요체 → 합쇼체, -(으)려니와/-(으)렴.",
  "TOPIK6": "TOPIK 6 (mastery): literary connective -(으)되, -거니와, -다기보다(는), complex honorifics (께서/드시다/말씀), -더라/-던 modifier nuance, news/article register, 문어체 종결 (-(으)노라, -리라, -(으)리), proverbs and four-character idioms (사자성어).",
  // Cantonese (no official CEFR; A1/B1/B2 are lang-scoped to avoid colliding with CEFR hints above)
  "yue:A1": "Cantonese beginner (CEFR A1-equivalent): 喺/去/有 + place, 係 + noun (係學生), 唔 + verb negation, 嗰個/呢個 demonstratives, basic final particles (啦/㗎/喎), 咁 (then/so), numbers with 幾/點.",
  "yue:A2": "Cantonese elementary (CEFR A2-equivalent): 咗 perfective (食咗), 過 experiential (見過), 唔 + 唔 double negation, 咁 (so/then) as connective, 幾多 (how many), 點解 (why), 因為...所以.",
  "yue:B1": "Cantonese intermediate (CEFR B1-equivalent): 緊 progressive (食緊飯), 唔通...咩 rhetorical, 緊要/最緊要, 所以/因為 cause-effect, 仲 (still/yet), 先 (first/before), 先...再 (first...then).",
  "yue:B2": "Cantonese upper-intermediate (CEFR B2-equivalent): 落去/起上嚟 directional complements, 啲/啲嘢 partitive, 啲唔啲 contrastive, 咁...咁 (the more...the more), 連...都/都...連 focus, 唔止...仲 (not only...also), formal news Cantonese vs colloquial speech register shifts.",
};

function lookupLevelHint(lang: LangKey, level: string): string {
  return LEVEL_HINT[`${lang}:${level}`] ?? LEVEL_HINT[level] ?? "";
}

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
          question: { type: "STRING", description: "A single sentence in the target language with exactly one '___' placeholder marking the blank position. The sentence MUST contain '___' (three underscores). The correct answer must NOT appear elsewhere in the question text (no verb/word duplication when the answer is filled in)." },
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

// Best-effort JSON repair for responses that got truncated mid-string
// (Gemini-2.5-flash emits these on long outputs). Strategy:
//   1. close any open string with a quote
//   2. close any open object/array
// The result is allowed to have a trailing comma; the validator
// downstream drops any malformed item, so we keep going.
function repairJson(input: string): string {
  let s = input;
  // Strip a trailing partial "key": "val fragment if max_tokens cut us
  // inside a string. We scan from the end and look for the last
  // unterminated quote.
  const lastQuote = s.lastIndexOf('"');
  if (lastQuote === -1) return s;
  // count unescaped quotes from the start
  let inStr = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') inStr = !inStr;
  }
  if (inStr) s += '"';
  // count braces/brackets (ignoring those inside strings)
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

function buildPrompt(lang: LangKey, level: string, count: number): string {
  const { native, english } = LANG_NAMES[lang];
  const lvl = lookupLevelHint(lang, level);
  const langSpecific: string[] = [];
  if (lang === "yue") {
    langSpecific.push(
      `Script: traditional Chinese characters, Hong Kong Cantonese vocabulary (NOT Mandarin, NOT simplified).`,
      `Do not use Mandarin-only particles (的/了/吗/呢). Use Cantonese particles (嘅/咗/嗎/喎/㗎/啦).`,
    );
  } else if (lang === "th") {
    langSpecific.push(`Script: Thai script only. Do not use romanization or transliteration in the question or options.`);
  } else if (lang === "vi") {
    langSpecific.push(`Script: Vietnamese with diacritics (Quốc Ngữ). Do not use romanization without diacritics.`);
  }
  return [
    `You are a senior ${english} language teacher writing a CEFR-level grammar drill.`,
    ``,
    `Target language: ${english} (${native})`,
    `Level: ${level}`,
    `Grammar scope: ${lvl}`,
    ...(langSpecific.length ? ["", ...langSpecific] : []),
    ``,
    `Produce exactly ${count} multiple-choice grammar questions. Each question must:`,
    `  1. Be a single sentence in ${english} with EXACTLY ONE "___" (three underscores) placeholder marking the blank. The sentence MUST contain "___" — never write a complete sentence without a blank.`,
    `  2. Test one of the grammar points in the level scope above. Do not test points outside it.`,
    `  3. Have exactly four distinct, plausible options. The correct answer must be one of them.`,
    `  4. CRITICAL: The correct answer word/phrase must NOT appear elsewhere in the question. When the answer is filled into "___", the resulting sentence must be grammatically correct with NO duplicated verbs or particles. (e.g. if answer is "go", question "I ___ go to school" is WRONG because "go" appears twice; use "I ___ to school" instead.)`,
    `  5. Have a 1-2 sentence explanation in plain English.`,
    `  6. Use natural, learner-appropriate vocabulary (no archaic, slang, or in-joke content).`,
    `  7. Be free of cultural stereotypes or politically sensitive content.`,
    ``,
    `Avoid these common pitfalls:`,
    `  - Don't reuse the same sentence template across many questions.`,
    `  - Don't make the correct answer obvious by being much longer/shorter than the others.`,
    `  - Don't use the same option letter (A/B/C/D) as the correct answer disproportionately.`,
    `  - Don't include any HTML, markdown, or code fences. The output is pure JSON.`,
    `  - Don't write a complete sentence and put the answer in options without a "___" blank in the question.`,
    `  - Don't duplicate the answer verb/particle in the question text (e.g. "ไป___ไป" or "go___go" patterns are forbidden).`,
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

async function callGemini(
  cfg: ProviderConfig,
  prompt: string,
  attempt = 0,
): Promise<GeneratedBatch> {
  // Provider-specific request shape:
  //   gemini      → native generateContent with responseSchema
  //   openrouter  → OpenAI-compatible chat/completions, response_format json
  //   doubao      → OpenAI-compatible chat/completions (Ark)
  //   dashscope   → OpenAI-compatible chat/completions (DashScope)
  //
  // OpenRouter / Doubao / DashScope honor `response_format: {type: "json_object"}`
  // but cannot enforce the full Gemini responseSchema, so we rely on
  // the prompt to ask for the right shape and the parser to validate
  // it downstream.
  let url: string;
  let headers: Record<string, string>;
  let body: any;

  if (cfg.provider === "gemini") {
    url = `${cfg.endpoint.url(cfg.model)}?key=${encodeURIComponent(cfg.apiKey)}`;
    headers = { "Content-Type": "application/json", ...cfg.endpoint.auth(cfg.apiKey) };
    body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        // C1/C2 levels in denser scripts (es/id) can exceed 8192 tokens
        // for 20 items, causing mid-string truncation. 16384 matches
        // the dialogue-scenes generator and leaves headroom.
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    };
  } else {
    // OpenRouter / Doubao / DashScope (OpenAI-compatible chat/completions).
    // The system message carries the JSON schema in plain English
    // because these providers do not accept a structured schema the
    // way Gemini does.
    const sysMsg = [
      "You are a strict JSON generator. Output ONLY a JSON object —",
      "no prose, no markdown fences, no apologies. The JSON must match this shape:",
      "{",
      '  "items": [',
      "    {",
      '      "question": "string (a single sentence with a blank or grammar choice)"',
      '      "options": ["string", "string", "string", "string"],',
      '      "answer": 0,    // 0..3, index into options[]',
      '      "explain": "string (1-2 sentence grammar explanation)"',
      "    }",
      "  ]",
      "}",
    ].join("\n");
    url = cfg.endpoint.url(cfg.model);
    headers = { "Content-Type": "application/json", ...cfg.endpoint.auth(cfg.apiKey) };
    body = {
      model: cfg.model,
      messages: [
        { role: "system", content: sysMsg },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
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
      console.warn(`  network error, retry in ${wait}ms: ${(err as Error).message}`);
      await sleep(wait);
      return callGemini(cfg, prompt, attempt + 1);
    }
    throw err;
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`  HTTP ${res.status}, retry in ${wait}ms`);
      await sleep(wait);
      return callGemini(cfg, prompt, attempt + 1);
    }
    const text = await res.text();
    throw new Error(`${cfg.provider} ${res.status} after retries: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${cfg.provider} ${res.status}: ${text.slice(0, 400)}`);
  }

  const data: any = await res.json();
  // Gemini nests under candidates[0].content.parts[0].text; the
  // OpenAI-compatible shape returns choices[0].message.content.
  let text: string | undefined;
  if (cfg.provider === "gemini") {
    text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  } else {
    text = data?.choices?.[0]?.message?.content;
  }
  if (!text) {
    if (attempt < 2) {
      await sleep(2000);
      return callGemini(cfg, prompt, attempt + 1);
    }
    throw new Error(`empty response: ${JSON.stringify(data).slice(0, 200)}`);
  }

  // response_format=json_object guarantees raw JSON. We still strip
  // accidental code fences in case the model wrapped the output,
  // and try to repair the response if max_output_tokens truncated
  // a string mid-way (Gemini-2.5-flash does this occasionally).
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

  if (!parsed || !Array.isArray(parsed.items)) {
    if (attempt < 2) {
      await sleep(2000);
      return callGemini(cfg, prompt, attempt + 1);
    }
    throw new Error(`unexpected shape: ${JSON.stringify(parsed).slice(0, 200)}`);
  }
  return parsed as GeneratedBatch;
}

function validateAndId(
  raw: GeneratedItem[],
  lang: LangKey,
  level: string,
  provider: Provider,
): { id: string; question: string; options: string[]; answer: number; explain: string; language: LangKey; level: string }[] {
  const seen = new Set<string>();
  const out: any[] = [];
  let dropped = 0;
  for (let i = 0; i < raw.length; i++) {
    const it = raw[i];
    const label = `#${i} "${(it?.question ?? "").slice(0, 40)}…"`;

    // Structural checks (already there).
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
      console.warn(`  skip malformed ${label}: ${JSON.stringify(it).slice(0, 100)}`);
      dropped++;
      continue;
    }
    if (it.options.some((o: unknown) => typeof o !== "string" || !o.trim())) {
      console.warn(`  skip ${label}: empty option`);
      dropped++;
      continue;
    }

    const q = it.question.trim();
    const opts = it.options.map((o: string) => o.trim());
    const ans = opts[it.answer];

    // Duplicate options (case-insensitive) — confuses learners.
    const lowerOpts = opts.map((o) => o.toLowerCase());
    if (new Set(lowerOpts).size !== lowerOpts.length) {
      console.warn(`  skip ${label}: duplicate options ${JSON.stringify(opts)}`);
      dropped++;
      continue;
    }

    // Answer-duplication: correct answer appears elsewhere in the question
    // (e.g. "Wenn ich reicher wäre, würde ich ___" with answer "wäre").
    // Filling the blank would repeat a token already in the sentence.
    // Use substring check (matches validate-quizzes.ts behaviour) so it
    // also catches duplicates in spaceless scripts (Thai/CJK/日本語).
    // Skip short answers (≤3 chars) to avoid false positives on common
    // function particles (是, は, à, der, etc.) that legitimately recur.
    if (ans.length > 3) {
      const qNoBlank = q.replace(/_+/g, " ").toLowerCase();
      if (qNoBlank.includes(ans.toLowerCase())) {
        console.warn(`  skip ${label}: answer "${ans}" appears elsewhere in question`);
        dropped++;
        continue;
      }
    }

    // Multi-blank: exactly one "___" expected; if there are 2+, learners
    // can't tell which blank to fill.
    const blankCount = (q.match(/_{2,}/g) || []).length;
    if (blankCount !== 1) {
      console.warn(`  skip ${label}: has ${blankCount} blanks, expected 1`);
      dropped++;
      continue;
    }

    const dedupeKey = q.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(dedupeKey)) {
      console.warn(`  skip ${label}: duplicate question`);
      dropped++;
      continue;
    }
    seen.add(dedupeKey);
    out.push({
      id: `q-${lang}-${level.toLowerCase()}-${provider}-${i + 1}-${Date.now().toString(36)}`,
      question: q,
      options: opts,
      answer: it.answer,
      explain: it.explain.trim(),
      language: lang,
      level,
    });
  }
  if (dropped > 0) {
    console.warn(`  ⚠ ${lang}/${level}: dropped ${dropped} of ${raw.length} items for failing quality gates`);
  }
  return out;
}

// ---------- Main ----------
async function main() {
  console.log(`✓ Per batch: ${perBatch} questions`);
  if (onlyProvider) console.log(`✓ Provider filter: ${onlyProvider}`);

  const outDir = path.join(process.cwd(), "scripts", "generated", "quizzes");
  if (!dryRun) fs.mkdirSync(outDir, { recursive: true });

  // Build batch list, applying --lang / --level / --provider filters.
  const totalBatches: { lang: LangKey; level: string }[] = [];
  for (const lang of Object.keys(LEVELS) as LangKey[]) {
    if (onlyLang && onlyLang !== lang) continue;
    // --provider filter: skip languages whose routed provider doesn't
    // match. This lets GitHub Actions run with --provider=gemini and
    // skip zh/ja/ko/yue (which need DASHSCOPE_API_KEY only available
    // locally).
    if (onlyProvider) {
      const langProvider = PROVIDER_BY_LANG[lang] ?? FALLBACK_PROVIDER;
      if (langProvider !== onlyProvider) continue;
    }
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

    // Resolve provider per-language (throws if key is missing).
    let cfg: ProviderConfig;
    try {
      cfg = getProviderForLang(lang);
    } catch (err) {
      failCount++;
      console.error(`✗ ${(err as Error).message}`);
      await sleep(2000);
      continue;
    }
    console.log(`[${cfg.provider}/${cfg.model}] `);

    try {
      const t0 = Date.now();
      const batch = await callGemini(cfg, prompt);
      // Batch.usageMetadata is not in the public response shape for
      // every model; we estimate output tokens from the JSON size
      // (Gemini response includes thinking tokens in the count for
      // 2.5+ models, so we round up generously).
      const outTextLen = JSON.stringify(batch).length;
      const estOut = Math.ceil(outTextLen / 3); // ~3 chars per output token (JSON dense)
      estTokensOut += estOut;
      estCostUsd =
        (estTokensIn * COST_PER_1M_IN + estTokensOut * COST_PER_1M_OUT) / 1_000_000;
      const items = validateAndId(batch.items, lang, level, cfg.provider);
      const ms = ((Date.now() - t0) / 1000).toFixed(1);

      if (items.length < Math.max(5, perBatch / 2)) {
        console.warn(`\n  ! only ${items.length}/${perBatch} valid items, retrying once…`);
        const retry = await callGemini(cfg, prompt);
        // Re-run validation with the existing dedupe keys so retry
        // items that duplicate the first batch are dropped too.
        // We do this by re-validating the combined raw list with a
        // fresh dedupe set, then taking only the new ones.
        const retryAll = validateAndId([...batch.items, ...retry.items], lang, level, cfg.provider);
        // Keep only items beyond the first batch's count (the retry's contribution)
        const retryItems = retryAll.slice(items.length);
        if (retryItems.length > 0) {
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
  if (failCount > 0 && successCount === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
