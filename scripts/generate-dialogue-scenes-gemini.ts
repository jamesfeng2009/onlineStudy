/* eslint-disable no-console */
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
 *   GEMINI_API_KEY  — required
 *   GEMINI_MODEL    — default "gemini-2.0-flash"
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

const API_KEY = process.env.GEMINI_API_KEY?.trim();
if (!API_KEY) {
  console.error("GEMINI_API_KEY is required");
  process.exit(1);
}
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// ---- CLI args ----
const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);
const ONLY_LANG = argv.lang as string | undefined;
const ONLY_SCENARIO = argv.scenario as string | undefined;

// ---- Generation plan: per (language, scenario) one scene. ----
// Picked the 4 priority languages × 6 high-frequency scenarios.
// Total 24 batches; ~3 minutes on Gemini Flash free tier.
type LangKey = "en" | "zh" | "ja" | "yue";

const LANG_META: Record<LangKey, { native: string; english: string; level: string }> = {
  en: { native: "English", english: "English", level: "A1" },
  zh: { native: "Chinese (Simplified)", english: "Chinese", level: "HSK2" },
  ja: { native: "Japanese", english: "Japanese", level: "N5" },
  yue: { native: "Cantonese (Traditional, Hong Kong)", english: "Cantonese", level: "初级" },
};

const SCENARIOS: { id: string; title: string; description: string }[] = [
  { id: "hotel", title: "Hotel check-in", description: "Checking into a hotel — providing name, ID, payment, room preference, breakfast." },
  { id: "phone-call", title: "Phone call", description: "Making or receiving a phone call — identifying yourself, asking who's calling, leaving a message." },
  { id: "interview", title: "Job interview (basic)", description: "A short interview — talking about yourself, your experience, your strengths and weaknesses." },
  { id: "transport", title: "Public transport", description: "Taking a bus/train — buying ticket, asking about stops, transfers, delays." },
  { id: "shopping-clothes", title: "Shopping (clothes)", description: "Buying clothes — asking for size, color, trying on, paying, returning/exchanging." },
  { id: "small-talk", title: "Small talk", description: "Casual small talk at a party or work — hobbies, weekend, family, movies, food." },
];

function plan(): { lang: LangKey; scenario: typeof SCENARIOS[number] }[] {
  const out: { lang: LangKey; scenario: typeof SCENARIOS[number] }[] = [];
  const langs = (Object.keys(LANG_META) as LangKey[]).filter((l) => !ONLY_LANG || l === ONLY_LANG);
  for (const lang of langs) {
    for (const sc of SCENARIOS) {
      if (ONLY_SCENARIO && sc.id !== ONLY_SCENARIO) continue;
      out.push({ lang, scenario: sc });
    }
  }
  return out;
}

// ---- JSON Schema: strict DialogueScene shape ----
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    id: { type: "STRING", description: "Lowercase id like 'dlg-en-hotel'." },
    language: { type: "STRING", description: "The language code (en/zh/ja/yue)." },
    level: { type: "STRING", description: "CEFR/HSK/JLPT level string." },
    scenario: { type: "STRING", description: "Short scenario slug like 'hotel'." },
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

function buildPrompt(lang: LangKey, scenario: typeof SCENARIOS[number]): string {
  const meta = LANG_META[lang];
  return `You are authoring a multi-turn conversation scene for a language-learning app.

Language: ${meta.english} (${meta.native})
Level: ${meta.level}
Scenario: ${scenario.title} — ${scenario.description}

Design a small directed graph of 4-8 turns. Each turn is one NPC line + matching branches.

HARD RULES (output rejected otherwise):
1. All NPC prompts MUST be in ${meta.native} (target language), not English. Translation fields go in `promptTranslation`.
2. Each turn MUST have 2-4 branches, each with 1-4 keywords (lowercase, no spaces inside one keyword).
3. ONE terminal turn with "isTerminal": true and empty branches. Its prompt says goodbye.
4. ONE fallback turn (usually a "please repeat" or "sorry?" line). Non-terminal turns should reference it in fallbackBranchId.
5. startTurnId MUST exist as a key in `turns`.
6. All branch.nextTurnId values MUST exist as keys in `turns`.
7. The opening line and at least 2 follow-up turns must include romanization or pinyin/furigana where appropriate for ${meta.english}.
8. Every branch MUST have non-empty keywords (no wildcards except the LAST branch of a turn, which can use [""] to mean "anything else" — but only as the last resort).
9. Conversation should reach the terminal in 3-5 user replies (not too long).
10. Include cultural-natural phrases native speakers actually use (e.g. "能説慢啲嗎？" for Cantonese, "もう一度お願いします" for Japanese).

Output ONLY the JSON object — no markdown fences, no commentary.`;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callGemini(prompt: string, attempt = 0): Promise<unknown> {
  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(API_KEY!)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });
  if (res.status === 429 || res.status >= 500) {
    if (attempt < 4) {
      const wait = 4000 * Math.pow(2, attempt);
      console.warn(`  HTTP ${res.status}, retry in ${wait}ms`);
      await sleep(wait);
      return callGemini(prompt, attempt + 1);
    }
    throw new Error(`HTTP ${res.status} after retries`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 400)}`);
  }
  const data: any = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    if (attempt < 2) {
      await sleep(2000);
      return callGemini(prompt, attempt + 1);
    }
    throw new Error("empty response");
  }
  return JSON.parse(text);
}

async function main() {
  const tasks = plan();
  const outDir = path.join(process.cwd(), "scripts", "generated", "dialogues");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Planning ${tasks.length} (lang, scenario) batches...`);
  for (let i = 0; i < tasks.length; i++) {
    const { lang, scenario } = tasks[i];
    const file = path.join(outDir, `${lang}-${scenario.id}.json`);
    if (fs.existsSync(file) && !argv.overwrite) {
      console.log(`[${i + 1}/${tasks.length}] ${lang}/${scenario.id} — exists, skip (use --overwrite=true to regen)`);
      continue;
    }
    const prompt = buildPrompt(lang, scenario);
    process.stdout.write(`[${i + 1}/${tasks.length}] ${lang}/${scenario.id} ... `);
    try {
      const scene = await callGemini(prompt);
      fs.writeFileSync(file, JSON.stringify(scene, null, 2));
      console.log("ok");
    } catch (e) {
      console.log("FAIL", (e as Error).message);
    }
    // Stay under Gemini free-tier 15 RPM.
    await sleep(4500);
  }
  console.log(`Done. ${tasks.length} scenes written to ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
