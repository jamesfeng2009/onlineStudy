import fs from "node:fs";
import path from "node:path";
import { tatoeba } from "./lib/tatoeba.js";

const OUT_DIR = path.join(process.cwd(), "generated");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Oxford 3000 / NGSL 高频词种子（按 CEFR 级别分组）
const WORDS_BY_LEVEL: Record<string, string[]> = {
  A1: ["hello", "goodbye", "please", "thank", "sorry", "yes", "no", "name", "friend", "family", "water", "food", "eat", "drink", "sleep", "go", "come", "see", "look", "know", "think", "say", "speak", "read", "write", "listen", "learn", "work", "play", "live", "love", "like", "want", "need", "have", "do", "make", "take", "get", "buy"],
  A2: ["morning", "afternoon", "evening", "night", "today", "tomorrow", "yesterday", "time", "hour", "minute", "week", "month", "year", "weather", "rain", "sun", "snow", "wind", "city", "country", "home", "house", "room", "school", "office", "store", "street", "car", "bus", "train"],
  B1: ["experience", "decision", "opportunity", "challenge", "conversation", "relationship", "environment", "community", "culture", "tradition", "journey", "adventure", "memory", "emotion", "imagination", "confidence", "responsibility", "independence", "patience", "curiosity"],
  B2: ["perspective", "contribution", "consequence", "assumption", "interpretation", "implementation", "evaluation", "negotiation", "collaboration", "innovation", "sustainability", "diversity", "equality", "democracy", "globalization", "technology", "entrepreneur", "philosophy", "psychology", "architecture"],
  C1: ["serendipity", "ephemeral", "resilient", "ambiguous", "paradox", "nuance", "dichotomy", "juxtaposition", "epiphany", "catharsis", "pragmatic", "eloquent", "meticulous", "tenacious", "altruistic", "cynical", "pragmatism", "rhetoric", "empathy", "integrity"],
};

interface FreeDictEntry {
  word: string;
  phonetic?: string;
  meanings: { partOfSpeech: string; definitions: { definition: string }[] }[];
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWordInfo(word: string): Promise<FreeDictEntry | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as FreeDictEntry[];
    return data[0] ?? null;
  } catch (err) {
    console.warn(`Fetch failed for ${word}:`, (err as Error).message);
    return null;
  }
}

function pickDefinition(info: FreeDictEntry | null): string {
  if (!info) return "";
  for (const m of info.meanings) {
    if (m.definitions.length) return m.definitions[0].definition;
  }
  return "";
}

function pickPhonetic(info: FreeDictEntry | null): string | undefined {
  return info?.phonetic || undefined;
}

function chineseHint(def: string): string {
  // 非常粗略的汉化示意，仅作兜底；真实生产环境建议接翻译 API
  return def;
}

async function generate() {
  const wordItems: Record<string, unknown>[] = [];
  const quizItems: Record<string, unknown>[] = [];

  for (const [level, words] of Object.entries(WORDS_BY_LEVEL)) {
    for (const word of words) {
      const info = await fetchWordInfo(word);
      await sleep(100);

      const definition = pickDefinition(info);
      const example = tatoeba.findExample(word, "en") || (definition ? `This is a sentence about ${word}.` : "");

      wordItems.push({
        id: `gen-en-${word}`,
        word,
        translation: chineseHint(definition) || word,
        phonetic: pickPhonetic(info),
        example,
        language: "en",
        level,
      });

      if (definition && quizItems.length < 200) {
        const options = [definition];
        // 添加几个干扰项（从同级别的其他词里随机取）
        const otherWords = words.filter((w) => w !== word).sort(() => 0.5 - Math.random()).slice(0, 3);
        for (const w of otherWords) {
          const other = await fetchWordInfo(w);
          await sleep(50);
          const def = pickDefinition(other);
          if (def) options.push(def);
        }
        while (options.length < 4) options.push("—");
        const shuffled = options.slice(0, 4).sort(() => 0.5 - Math.random());
        const answer = shuffled.indexOf(definition);
        quizItems.push({
          id: `gen-en-q-${word}`,
          languageCode: "en",
          level,
          question: `What is the meaning of "${word}"?`,
          options: shuffled,
          answer,
          explain: `The word "${word}" means: ${definition}`,
        });
      }
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "en-words.json"), JSON.stringify(wordItems, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "en-quizzes.json"), JSON.stringify(quizItems, null, 2));

  console.log(`Generated ${wordItems.length} English words and ${quizItems.length} quizzes.`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
