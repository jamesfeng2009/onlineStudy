/* eslint-disable @typescript-eslint/no-explicit-any */
 
/**
 * Batch-generate multi-turn dialogue scenes via Google Gemini.
 *
 * Output: scripts/generated/dialogues/{lang}-{scenario}.json
 * Each file is a single DialogueScene-shaped object:
 *   { id, language, level, scenario, title, opening, startTurnId, turns }
 *   where turns is a Record<turnId, DialogueTurn>.
 *
 * Usage:
 *   pnpm tsx scripts/generate-dialogue-scenes-gemini.ts
 *   pnpm tsx scripts/generate-dialogue-scenes-gemini.ts --lang=en
 *   pnpm tsx scripts/generate-dialogue-scenes-gemini.ts --scenario=hotel
 *
 * Env:
 *   GEMINI_API_KEY     — for en/es/fr/de/it/th (Gemini)
 *   DASHSCOPE_API_KEY  — for zh/ja/ko/yue (Qwen via DashScope)
 *   GEMINI_MODEL       — default "gemini-2.0-flash"
 *
 * The 4-defense filter (id 唯一 / turn id 引用合法 / 关键词非空 /
 * startTurnId 存在) is applied AFTER generation, in
 * `validate-dialogue-scenes.ts`. This script just generates raw
 * scenes; merging into the final DialogueScene[] happens in
 * `merge-dialogue-scenes.ts`.
 */
import fs from "node:fs";
import path from "node:path";

// Minimal env loading (no provider router — keep this script small).
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

// ─── Provider router (per-language, P4-4) ───
type Provider = "gemini" | "dashscope";
const PROVIDER_BY_LANG: Record<string, Provider> = {
  zh: "dashscope", ja: "dashscope", ko: "dashscope", yue: "dashscope",
  en: "gemini", es: "gemini", fr: "gemini", de: "gemini", it: "gemini", th: "gemini",
  vi: "gemini", ms: "gemini", id: "gemini",
};
const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-flash",
  dashscope: "qwen2.5-72b-instruct",
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

function getApiKey(provider: Provider): string | undefined {
  return ({
    gemini: process.env.GEMINI_API_KEY,
    dashscope: process.env.DASHSCOPE_API_KEY,
  }[provider])?.trim();
}

function getProviderForLang(lang: string) {
  const provider = PROVIDER_BY_LANG[lang] ?? "gemini";
  const apiKey = getApiKey(provider);
  if (!apiKey) {
    const envName = provider === "gemini" ? "GEMINI_API_KEY" : "DASHSCOPE_API_KEY";
    console.error(`✗ ${envName} is empty (needed for provider "${provider}", lang=${lang}).`);
    process.exit(1);
  }
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL[provider];
  return { provider, apiKey, model, endpoint: ENDPOINTS[provider] };
}

// ---- CLI args ----
const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);
const ONLY_LANG = argv.lang as string | undefined;
const ONLY_SCENARIO = argv.scenario as string | undefined;
// 支持 --level=A1,A2 过滤(逗号分隔,大小写不敏感)
const ONLY_LEVEL = argv.level as string | undefined;
// P4-5: filter by provider so GitHub Actions can run only gemini languages
// (en/es/fr/de/it/th) while DashScope languages (zh/ja/ko/yue) run locally.
const ONLY_PROVIDER = argv.provider as Provider | undefined;

// ---- Generation plan: per (language, scenario, level) one scene. ----
// 扩展到 13 语言 × 14 场景 × 多 level。levels 对齐 language-registry。
type LangKey = "en" | "zh" | "ja" | "ko" | "es" | "fr" | "de" | "it" | "th" | "yue" | "vi" | "ms" | "id";

const LANG_META: Record<LangKey, { native: string; english: string; levels: string[] }> = {
  en:  { native: "English",                          english: "English",    levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  zh:  { native: "Chinese (Simplified)",             english: "Chinese",    levels: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"] },
  ja:  { native: "Japanese",                          english: "Japanese",   levels: ["N5", "N4", "N3", "N2", "N1"] },
  ko:  { native: "Korean",                            english: "Korean",     levels: ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"] },
  es:  { native: "Spanish",                           english: "Spanish",    levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  fr:  { native: "French",                             english: "French",     levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  de:  { native: "German",                             english: "German",     levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  it:  { native: "Italian",                            english: "Italian",    levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  th:  { native: "Thai",                               english: "Thai",       levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  yue: { native: "Cantonese (Traditional, Hong Kong)", english: "Cantonese",  levels: ["A1", "A2", "B1", "B2"] },
  vi:  { native: "Vietnamese",                         english: "Vietnamese", levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  ms:  { native: "Malay",                              english: "Malay",      levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  id:  { native: "Indonesian",                         english: "Indonesian", levels: ["A1", "A2", "B1", "B2", "C1", "C2"] },
};

// 14 个场景覆盖生活/工作/旅行/服务/医疗等高频对话域
const SCENARIOS: { id: string; title: string; description: string }[] = [
  { id: "hotel", title: "Hotel check-in", description: "Checking into a hotel — providing name, ID, payment, room preference, breakfast." },
  { id: "phone-call", title: "Phone call", description: "Making or receiving a phone call — identifying yourself, asking who's calling, leaving a message." },
  { id: "interview", title: "Job interview (basic)", description: "A short interview — talking about yourself, your experience, your strengths and weaknesses." },
  { id: "transport", title: "Public transport", description: "Taking a bus/train — buying ticket, asking about stops, transfers, delays." },
  { id: "shopping-clothes", title: "Shopping (clothes)", description: "Buying clothes — asking for size, color, trying on, paying, returning/exchanging." },
  { id: "small-talk", title: "Small talk", description: "Casual small talk at a party or work — hobbies, weekend, family, movies, food." },
  { id: "restaurant", title: "Restaurant", description: "Ordering food at a restaurant — menu, recommendations, dietary restrictions, paying the bill, tipping." },
  { id: "airport", title: "Airport", description: "At the airport — check-in, security, gate, boarding pass, lost luggage, flight delays." },
  { id: "doctor", title: "Doctor visit", description: "Visiting a doctor — describing symptoms, pain, duration, allergies, prescriptions, follow-up." },
  { id: "bank", title: "Bank", description: "At the bank — opening an account, exchanging money, ATM issues, transfer, PIN reset." },
  { id: "post-office", title: "Post office", description: "At the post office — sending a parcel, stamps, registered mail, tracking, customs form." },
  { id: "taxi", title: "Taxi", description: "Taking a taxi — telling destination, fare, route, traffic, payment, change, luggage." },
  { id: "directions", title: "Asking directions", description: "Asking for directions on the street — landmarks, turns, distance, transport, nearby places." },
  { id: "weather", title: "Weather chat", description: "Talking about the weather — forecast, seasons, temperature, rain, plans affected by weather." },
];

function plan(): { lang: LangKey; scenario: typeof SCENARIOS[number]; level: string }[] {
  const out: { lang: LangKey; scenario: typeof SCENARIOS[number]; level: string }[] = [];
  const langs = (Object.keys(LANG_META) as LangKey[])
    .filter((l) => !ONLY_LANG || l === ONLY_LANG)
    // P4-5: 按 provider 过滤
    .filter((l) => !ONLY_PROVIDER || PROVIDER_BY_LANG[l] === ONLY_PROVIDER);
  // ONLY_SCENARIO 支持逗号分隔
  const scenarioFilter = ONLY_SCENARIO ? ONLY_SCENARIO.split(",").map((s) => s.trim()) : null;
  // ONLY_LEVEL 支持逗号分隔
  const levelFilter = ONLY_LEVEL ? ONLY_LEVEL.split(",").map((l) => l.trim().toLowerCase()) : null;
  for (const lang of langs) {
    for (const sc of SCENARIOS) {
      if (scenarioFilter && !scenarioFilter.includes(sc.id)) continue;
      for (const level of LANG_META[lang].levels) {
        if (levelFilter && !levelFilter.includes(level.toLowerCase())) continue;
        out.push({ lang, scenario: sc, level });
      }
    }
  }
  return out;
}

// ---- JSON Schema: strict DialogueScene shape ----
const _RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    id: { type: "STRING", description: "Lowercase id like 'dlg-en-hotel-a1' (lang + scenario + level, all lowercase)." },
    language: { type: "STRING", description: "The language code (en/zh/ja/ko/es/fr/de/it/th/yue/vi/ms/id)." },
    level: { type: "STRING", description: "CEFR/HSK/JLPT level string like 'A1', 'HSK3', 'N2', 'TOPIK4'." },
    scenario: { type: "STRING", description: "Short scenario slug like 'hotel' or 'restaurant'." },
    title: { type: "STRING", description: "Human-readable title in the target language (e.g. '酒店入住')." },
    opening: { type: "STRING", description: "The first line the NPC says to start the conversation." },
    startTurnId: { type: "STRING", description: "Id of the first turn (must exist as a key in `turns`)." },
    turns: {
      type: "OBJECT",
      description: "Map from turn id to DialogueTurn.",
      additionalProperties: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          prompt: { type: "STRING", description: "What the NPC says (in the target language)." },
          promptTranslation: { type: "STRING", description: "English translation of `prompt`." },
          branches: {
            type: "ARRAY",
            minItems: 1,
            items: {
              type: "OBJECT",
              properties: {
                keywords: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "Lowercased substrings to match in the user's reply. Can be empty (always-match wildcard).",
                },
                nextTurnId: { type: "STRING" },
              },
              required: ["keywords", "nextTurnId"],
            },
          },
          fallbackBranchId: { type: "STRING", description: "Branch to use when no keyword matches (usually loops back to this same turn or a 'please-repeat' turn)." },
          isTerminal: { type: "BOOLEAN", description: "True if this turn ends the conversation." },
        },
        required: ["id", "prompt", "branches", "fallbackBranchId"],
      },
    },
  },
  required: ["id", "language", "level", "scenario", "title", "opening", "startTurnId", "turns"],
} as const;

// level 描述:告诉 LLM 等级对应的语言复杂度
function levelDescriptor(level: string): string {
  const lvl = level.toLowerCase();
  if (lvl.startsWith("a1")) return "absolute beginner — extremely simple vocabulary, short sentences, present tense only, basic greetings and numbers";
  if (lvl.startsWith("a2")) return "elementary — simple everyday vocabulary, some past/future tense, polite forms, common phrases for shopping/travel";
  if (lvl.startsWith("b1")) return "intermediate — broader vocabulary, narrative past tense, opinions and explanations, can handle travel situations fully";
  if (lvl.startsWith("b2")) return "upper-intermediate — fluent everyday conversation, abstract topics, hypothesis, news, professional context";
  if (lvl.startsWith("c1")) return "advanced — nuanced vocabulary, idioms, complex sentences, formal/informal register, debate, professional discussion";
  if (lvl.startsWith("c2")) return "mastery — native-like fluency, idiomatic expressions, cultural references, register shifts, complex arguments";
  if (lvl.startsWith("n5")) return "JLPT N5 — basic Japanese, ~800 words, simple polite (desu/masu), everyday greetings";
  if (lvl.startsWith("n4")) return "JLPT N4 — elementary Japanese, ~1500 words, casual/polite forms, daily life conversation";
  if (lvl.startsWith("n3")) return "JLPT N3 — intermediate, ~3000 words, mixed registers, can handle general conversation";
  if (lvl.startsWith("n2")) return "JLPT N2 — upper-intermediate, ~6000 words, news/abstract topics, keigo";
  if (lvl.startsWith("n1")) return "JLPT N1 — advanced, ~10000 words, idioms, formal business, nuanced debate";
  if (lvl.startsWith("hsk1")) return "HSK 1 — absolute beginner, ~150 words, basic greetings and self-introduction";
  if (lvl.startsWith("hsk2")) return "HSK 2 — elementary, ~300 words, simple daily topics";
  if (lvl.startsWith("hsk3")) return "HSK 3 — pre-intermediate, ~600 words, everyday life, travel";
  if (lvl.startsWith("hsk4")) return "HSK 4 — intermediate, ~1200 words, work/study topics, opinions";
  if (lvl.startsWith("hsk5")) return "HSK 5 — upper-intermediate, ~2500 words, news, abstract topics";
  if (lvl.startsWith("hsk6")) return "HSK 6 — advanced, ~5000 words, idiomatic, formal register";
  if (lvl.startsWith("topik1") || lvl.startsWith("topik2")) return "TOPIK 1-2 — beginner, basic greetings and simple daily life";
  if (lvl.startsWith("topik3")) return "TOPIK 3 — intermediate, daily life and routine topics";
  if (lvl.startsWith("topik4")) return "TOPIK 4 — upper-intermediate, social/abstract topics";
  if (lvl.startsWith("topik5")) return "TOPIK 5 — advanced, professional context, news";
  if (lvl.startsWith("topik6")) return "TOPIK 6 — mastery, idiomatic, formal debate";
  return level;
}

function buildPrompt(lang: LangKey, scenario: typeof SCENARIOS[number], level: string): string {
  const meta = LANG_META[lang];
  const lvlDesc = levelDescriptor(level);
  return `You are authoring a multi-turn conversation scene for a language-learning app.

Language: ${meta.english} (${meta.native})
Level: ${level} — ${lvlDesc}
Scenario: ${scenario.title} — ${scenario.description}

Design a small directed graph of 4-8 turns. Each turn is one NPC line + matching branches. Vocabulary and grammar MUST match the target level: do NOT use words/grammar far above or below the level. At lower levels keep sentences short and use only present tense / polite forms; at higher levels use idioms, complex sentences, and register shifts.

HARD RULES (output rejected otherwise):
1. All NPC prompts MUST be in ${meta.native} (target language), not English. Translation fields go in 'promptTranslation'.
2. Each turn MUST have 2-4 branches, each with 1-4 keywords (lowercase, no spaces inside one keyword).
3. ONE terminal turn with "isTerminal": true and empty branches. Its prompt says goodbye.
4. ONE fallback turn (usually a "please repeat" or "sorry?" line). Non-terminal turns should reference it in fallbackBranchId.
5. startTurnId MUST exist as a key in 'turns'.
6. All branch.nextTurnId values MUST exist as keys in 'turns'.
7. The opening line and at least 2 follow-up turns must include romanization or pinyin/furigana INSIDE the promptTranslation field (e.g. "Ni hao — Hello"). Do NOT add a separate "romanization" field — only use the fields shown in the JSON structure below.
8. Every branch MUST have non-empty keywords (no wildcards except the LAST branch of a turn, which can use [""] to mean "anything else" — but only as the last resort).
9. Conversation should reach the terminal in 3-5 user replies (not too long).
10. Include cultural-natural phrases native speakers actually use (e.g. "能説慢啲嗎？" for Cantonese, "もう一度お願いします" for Japanese).
11. Keywords should be in the TARGET language (lowercased), not English — they match the learner's reply in the target language.

Output ONLY the JSON object — no markdown fences, no commentary.

JSON structure (follow exactly):
{
  "id": "dlg-${lang}-${scenario.id}-${level.toLowerCase()}",
  "language": "${lang}",
  "level": "${level}",
  "scenario": "${scenario.id}",
  "title": "<title in target language>",
  "opening": "<first NPC line in target language>",
  "startTurnId": "t1",
  "turns": {
    "t1": {
      "id": "t1",
      "prompt": "<NPC line in target language>",
      "promptTranslation": "<English translation>",
      "branches": [
        { "keywords": ["keyword1", "keyword2"], "nextTurnId": "t2" },
        { "keywords": [""], "nextTurnId": "t-repeat" }
      ],
      "fallbackBranchId": "t-repeat",
      "isTerminal": false
    },
    "t-repeat": { "id": "t-repeat", "prompt": "...", "promptTranslation": "...", "branches": [{"keywords":[""],"nextTurnId":"t1"}], "fallbackBranchId": "t1", "isTerminal": false },
    "t-end": { "id": "t-end", "prompt": "<goodbye>", "promptTranslation": "...", "branches": [], "fallbackBranchId": "t-end", "isTerminal": true }
  }
}`;

}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callLLM(prompt: string, lang: string, attempt = 0): Promise<unknown> {
  const { provider, apiKey, model, endpoint } = getProviderForLang(lang);

  let res: Response;
  if (provider === "gemini") {
    // Gemini's responseSchema does not support `additionalProperties`
    // (used by the `turns` map), so we drop the schema and rely on
    // responseMimeType + the prompt's explicit structure description.
    res = await fetch(`${endpoint.url(model)}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...endpoint.auth(apiKey) },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 16384,
          responseMimeType: "application/json",
        },
      }),
    });
  } else {
    // DashScope: OpenAI-compatible, no responseSchema support
    const sysMsg = "You are a strict JSON generator for dialogue scenes. Output ONLY a JSON object matching the schema described in the user message — no prose, no markdown fences.";
    res = await fetch(endpoint.url(model), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...endpoint.auth(apiKey) },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sysMsg },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        top_p: 0.95,
        max_tokens: 16384,
        response_format: { type: "json_object" },
      }),
    });
  }

  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`  [${provider}] HTTP ${res.status}, retry in ${wait}ms`);
      await sleep(wait);
      return callLLM(prompt, lang, attempt + 1);
    }
    throw new Error(`[${provider}] HTTP ${res.status} after retries`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${provider}] HTTP ${res.status}: ${text.slice(0, 400)}`);
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
      return callLLM(prompt, lang, attempt + 1);
    }
    throw new Error(`[${provider}] empty response`);
  }

  // Strip markdown fences if present, then parse.
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Best-effort repair for truncated JSON: close open strings + braces.
    let s = cleaned;
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
    return JSON.parse(s);
  }
}

// ── Defensive post-processing: bring LLM output up to DialogueScene
//    schema. Returns null only if the scene is unrecoverable.
//
//    Handles the 4 failure patterns we saw in validate output:
//      1. branches is undefined / not an array → []
//      2. fallbackBranchId missing or dangling → repair
//      3. branch.nextTurnId missing or dangling (LLM uses t_end vs t-end) → normalize
//      4. no terminal turn → mark last turn terminal
//    Also strips any extra fields LLM places on the turn object
//    (e.g. nextTurnId mistakenly at the turn level instead of branch)
//    by rebuilding the turn from a known-safe shape.
// ────────────────────────────────────────────────────────────
function repairScene(
  raw: any,
  lang: string,
  scenarioId: string,
  level: string,
): any | null {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.turns || typeof raw.turns !== "object") return null;

  const turns = raw.turns;
  const turnIds = new Set(Object.keys(turns));
  if (turnIds.size === 0) return null;

  // Case-insensitive ref resolver: t_end / t-end / T-END all map to
  // whichever case variant actually exists as a key.
  const refLookup = new Map<string, string>();
  for (const tid of turnIds) {
    refLookup.set(tid.toLowerCase().replace(/[_\s-]+/g, "-"), tid);
  }
  const resolveRef = (ref: string | undefined): string | undefined => {
    if (!ref) return undefined;
    if (turnIds.has(ref)) return ref;
    return refLookup.get(ref.toLowerCase().replace(/[_\s-]+/g, "-"));
  };

  // Find or designate a terminal turn (needed for repairing dangling refs).
  let terminalId: string | undefined;
  for (const [tid, t] of Object.entries<any>(turns)) {
    if (t && t.isTerminal) {
      terminalId = tid;
      break;
    }
  }
  if (!terminalId) {
    const ids = Object.keys(turns);
    terminalId = ids[ids.length - 1];
    const t = turns[terminalId];
    t.isTerminal = true;
    t.branches = [];
  }

  for (const [tid, turnRaw] of Object.entries<any>(turns)) {
    // Replace the value entirely so we control its shape.
    const turn: any = {
      id: tid,
      prompt: typeof turnRaw?.prompt === "string" ? turnRaw.prompt : "",
      branches: Array.isArray(turnRaw?.branches) ? turnRaw.branches : [],
      fallbackBranchId:
        typeof turnRaw?.fallbackBranchId === "string"
          ? turnRaw.fallbackBranchId
          : "",
    };
    if (typeof turnRaw?.promptTranslation === "string") {
      turn.promptTranslation = turnRaw.promptTranslation;
    }
    if (turnRaw?.isTerminal) turn.isTerminal = true;
    turns[tid] = turn;

    // Skip branch repair for terminal turns.
    if (turn.isTerminal) {
      turn.branches = [];
      turn.fallbackBranchId = resolveRef(turn.fallbackBranchId) || tid;
      continue;
    }

    // Non-terminal: ensure at least one branch.
    if (!Array.isArray(turnRaw.branches) || turnRaw.branches.length === 0) {
      // Point a wildcard at the terminal so the conversation can end.
      turn.branches = [{ keywords: [""], nextTurnId: terminalId }];
    }

    // Repair each branch.nextTurnId.
    const seen = new Set<string>();
    const repairedBranches: any[] = [];
    for (const b of turn.branches) {
      if (!b || typeof b !== "object") continue;
      const keywords = Array.isArray(b.keywords)
        ? b.keywords.filter((k: any) => typeof k === "string")
        : [];
      const nextOk = resolveRef(b.nextTurnId);
      if (!nextOk) {
        // Dangling ref — skip silently; will fall through to fallback.
        continue;
      }
      if (seen.has(nextOk)) continue; // dedup
      seen.add(nextOk);
      repairedBranches.push({ keywords, nextTurnId: nextOk });
    }
    if (repairedBranches.length === 0) {
      // All branches were dangling — keep one wildcard at the terminal.
      repairedBranches.push({ keywords: [""], nextTurnId: terminalId });
    }
    turn.branches = repairedBranches;

    // Repair fallbackBranchId: prefer the original (resolved), else the
    // last branch (typically the wildcard).
    const fbResolved = resolveRef(turn.fallbackBranchId);
    if (fbResolved) {
      turn.fallbackBranchId = fbResolved;
    } else {
      turn.fallbackBranchId =
        repairedBranches[repairedBranches.length - 1].nextTurnId;
    }
  }

  // Scene-level fields (force canonical — LLM occasionally drifts).
  raw.id = `dlg-${lang}-${scenarioId}-${level.toLowerCase()}`;
  raw.language = lang;
  raw.level = level;
  raw.scenario = scenarioId;
  if (typeof raw.title !== "string" || !raw.title) {
    raw.title = `${scenarioId} / ${level}`;
  }
  if (typeof raw.opening !== "string" || !raw.opening) {
    const first = turns[Object.keys(turns)[0]];
    raw.opening = first?.prompt || "";
  }
  if (!raw.startTurnId || !turnIds.has(raw.startTurnId)) {
    raw.startTurnId = Object.keys(turns)[0];
  }
  return raw;
}

async function main() {
  const tasks = plan();
  const outDir = path.join(process.cwd(), "scripts", "generated", "dialogues");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Planning ${tasks.length} (lang, scenario, level) batches...`);
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < tasks.length; i++) {
    const { lang, scenario, level } = tasks[i];
    const levelSlug = level.toLowerCase();
    const file = path.join(outDir, `${lang}-${scenario.id}-${levelSlug}.json`);
    if (fs.existsSync(file) && !argv.overwrite) {
      console.log(`[${i + 1}/${tasks.length}] ${lang}/${scenario.id}/${level} — exists, skip (use --overwrite=true to regen)`);
      continue;
    }
    const prompt = buildPrompt(lang, scenario, level);
    process.stdout.write(`[${i + 1}/${tasks.length}] ${lang}/${scenario.id}/${level} ... `);
    try {
      const scene = (await callLLM(prompt, lang)) as any;
      const repaired = repairScene(scene, lang, scenario.id, level);
      if (!repaired) {
        console.log("FAIL (unrepairable)");
        fail++;
        continue;
      }
      fs.writeFileSync(file, JSON.stringify(repaired, null, 2));
      console.log("ok");
      ok++;
    } catch (e) {
      console.log("FAIL", (e as Error).message);
      fail++;
    }
    // Stay under Gemini free-tier 15 RPM.
    await sleep(4500);
  }
  console.log(`Done. ${ok} ok, ${fail} failed out of ${tasks.length}.`);
  if (fail > 0 && ok === 0) {
    console.error("All batches failed — see errors above.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
