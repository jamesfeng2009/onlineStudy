import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";

// 批量导入需要更高并发：覆盖 URL 里的 connection_limit=1 → 10
// （仅此脚本，不影响其他使用 Prisma 的地方）
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace("connection_limit=1", "connection_limit=10"),
    },
  },
});

// 并发执行器：最多 concurrency 个任务同时运行
async function mapWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (index < items.length) {
        const i = index++;
        await fn(items[i]);
      }
    },
  );
  await Promise.all(workers);
}

// P1017 (Server has closed the connection) 自动重试
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const code = (e as { code?: string })?.code;
      if (code === "P1017" && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}

const OUTPUT_DIR = path.join(process.cwd(), "scripts", "generate-content", "output");

interface GeneratedWord {
  word: string;
  translation: string;
  phonetic?: string;
  reading?: string;
  example: string;
  exampleTranslation?: string;
  language: string;
  level: string;
}

interface WordBankInput {
  id: string;
  languageCode: string;
  level: string;
  word: string;
  translation: string;
  phonetic: string | null;
  exampleSentence: string;
  vocabOrder: number;
}

interface QuizInput {
  id: string;
  languageCode: string;
  level: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  quizOrder: number;
}

function loadJson(filename: string): GeneratedWord[] {
  const file = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(file)) {
    console.warn(`File not found: ${file}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as GeneratedWord[];
}

function sanitizeLevel(level: string, languageCode: string): string {
  const knownLevels: Record<string, string[]> = {
    en: ["A1", "A2", "B1", "B2", "C1", "C2"],
    ja: ["N5", "N4", "N3", "N2", "N1"],
    zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7", "HSK8", "HSK9"],
    // ko/es/fr/de/it 走 CEFR（generate_other.py 用 en 词频估算）
    ko: ["A1", "A2", "B1", "B2", "C1", "C2"],
    es: ["A1", "A2", "B1", "B2", "C1", "C2"],
    fr: ["A1", "A2", "B1", "B2", "C1", "C2"],
    de: ["A1", "A2", "B1", "B2", "C1", "C2"],
    it: ["A1", "A2", "B1", "B2", "C1", "C2"],
  };
  const levels = knownLevels[languageCode] ?? [];
  const upper = level.trim().toUpperCase();
  if (levels.includes(upper)) return upper;
  // 简单兜底映射
  if (languageCode === "en" || languageCode === "ko" || languageCode === "es"
      || languageCode === "fr" || languageCode === "de" || languageCode === "it") {
    if (upper.startsWith("A")) return "A1";
    if (upper.startsWith("B")) return "B1";
    if (upper.startsWith("C")) return "C1";
    return "A1";
  }
  if (languageCode === "ja") {
    if (upper.includes("5")) return "N5";
    if (upper.includes("4")) return "N4";
    if (upper.includes("3")) return "N3";
    if (upper.includes("2")) return "N2";
    return "N1";
  }
  if (languageCode === "zh") {
    const num = parseInt(upper.replace(/\D/g, ""), 10);
    // P4-1: 修复兜底逻辑,支持 HSK 3.0 完整 9 级(之前只到 HSK6,会丢 HSK7-9)
    if (!isNaN(num) && num >= 1 && num <= 9) return `HSK${num}`;
    return "HSK1";
  }
  return level;
}

function wordToInput(item: GeneratedWord, order: number): WordBankInput {
  const languageCode = item.language;
  const level = sanitizeLevel(item.level, languageCode);
  const phonetic = item.reading || item.phonetic || "";
  // 例句翻译与单词释义语言不同，不能混用；释义为空时留空占位
  const translation = item.translation || "(释义待补充)";
  // ID 必须稳定且只含 ASCII 安全字符（原 word 字段可能是长句/含空格/非 ASCII）
  const safeKey = item.word
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return {
    id: `gen-${languageCode}-${order}-${safeKey || "item"}`,
    languageCode,
    level,
    word: item.word,
    translation: translation.slice(0, 240),
    phonetic: phonetic ? phonetic.slice(0, 120) : null,
    exampleSentence: item.example || "",
    vocabOrder: order,
  };
}

function isValidTranslation(t: string): boolean {
  return !!t && t !== "(释义待补充)";
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateQuizzes(words: WordBankInput[], maxPerLevel = 30): QuizInput[] {
  const grouped = new Map<string, WordBankInput[]>();
  for (const w of words) {
    const key = `${w.languageCode}#${w.level}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(w);
  }

  const quizzes: QuizInput[] = [];
  let order = 0;

  for (const [, group] of grouped) {
    // 每个级别最多生成 maxPerLevel 道选择题
    const selected = group.slice(0, maxPerLevel);
    for (const word of selected) {
      const otherTranslations = shuffle(group.filter((w) => w.id !== word.id))
        .slice(0, 3)
        .map((w) => w.translation);
      const optionsSet = new Set([word.translation, ...otherTranslations]);
      // 如果干扰项不够，用占位符补齐
      while (optionsSet.size < 4) optionsSet.add("—");
      const options = shuffle(Array.from(optionsSet).slice(0, 4));
      const answer = options.indexOf(word.translation);
      const label = word.languageCode === "ja" ? `「${word.word}」` : `"${word.word}"`;
      quizzes.push({
        id: `q-${word.id}`,
        languageCode: word.languageCode,
        level: word.level,
        question:
          word.languageCode === "ja"
            ? `${label}の意味は？`
            : word.languageCode === "zh"
              ? `${label}是什么意思？`
              : `What is the meaning of ${label}?`,
        options,
        answer,
        explain:
          word.languageCode === "ja"
            ? `${label}（${word.phonetic ?? ""}）の意味：${word.translation}`
            : word.languageCode === "zh"
              ? `${label}（${word.phonetic ?? ""}）的意思是：${word.translation}`
              : `${label} means: ${word.translation}`,
        quizOrder: order++,
      });
    }
  }

  return quizzes;
}

async function importWords(inputs: WordBankInput[]) {
  // WordBank 表不再存 translation（拆到 WordBankTranslation 表）；
  // generated_*.json 的 translation 是英文释义（en↔tgt 句对的 en 一侧），
  // 所以 baseLanguageCode="en"。
  await mapWithConcurrency(inputs, 5, async (w) => {
    await withRetry(() => prisma.wordBank.upsert({
      where: { id: w.id },
      update: {
        languageCode: w.languageCode,
        level: w.level,
        word: w.word,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
        vocabOrder: w.vocabOrder,
      },
      create: {
        id: w.id,
        languageCode: w.languageCode,
        level: w.level,
        word: w.word,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
        vocabOrder: w.vocabOrder,
      },
    }));
    await withRetry(() => prisma.wordBankTranslation.upsert({
      where: { wordBankId_baseLanguageCode: { wordBankId: w.id, baseLanguageCode: "en" } },
      update: {
        baseLanguageCode: "en",
        translation: w.translation,
      },
      create: {
        wordBankId: w.id,
        baseLanguageCode: "en",
        translation: w.translation,
      },
    }));
  });
  return inputs.length;
}

async function importQuizzes(quizzes: QuizInput[]) {
  // Quiz 表只存 options/answer/quizOrder；question/explain 在 QuizTranslation
  await mapWithConcurrency(quizzes, 5, async (q) => {
    await withRetry(() => prisma.quiz.upsert({
      where: { id: q.id },
      update: {
        languageCode: q.languageCode,
        level: q.level,
        options: q.options,
        answer: q.answer,
        quizOrder: q.quizOrder,
      },
      create: {
        id: q.id,
        languageCode: q.languageCode,
        level: q.level,
        options: q.options,
        answer: q.answer,
        quizOrder: q.quizOrder,
      },
    }));
    await withRetry(() => prisma.quizTranslation.upsert({
      where: { quizId_baseLanguageCode: { quizId: q.id, baseLanguageCode: "en" } },
      update: {
        baseLanguageCode: "en",
        question: q.question,
        explain: q.explain,
      },
      create: {
        quizId: q.id,
        baseLanguageCode: "en",
        question: q.question,
        explain: q.explain,
      },
    }));
  });
  return quizzes.length;
}

async function main() {
  const files = [
    { filename: "generated_en.json", languageCode: "en" },
    { filename: "generated_ja.json", languageCode: "ja" },
    { filename: "generated_zh.json", languageCode: "zh" },
    { filename: "generated_ko.json", languageCode: "ko" },
    { filename: "generated_es.json", languageCode: "es" },
    { filename: "generated_fr.json", languageCode: "fr" },
    { filename: "generated_de.json", languageCode: "de" },
    { filename: "generated_it.json", languageCode: "it" },
    { filename: "generated_th.json", languageCode: "th" },
    { filename: "generated_yue.json", languageCode: "yue" },
  ];

  let totalWords = 0;
  let totalQuizzes = 0;

  for (const { filename, languageCode } of files) {
    const raw = loadJson(filename);
    console.log(`Loaded ${raw.length} ${languageCode} words from ${filename}`);

    const words = raw
      .filter((item) => item.word && item.example)
      .map((item, idx) => wordToInput(item, idx));

    const importedWords = await importWords(words);
    console.log(`Imported ${importedWords} ${languageCode} words into WordBank`);

    const quizWords = words.filter((w) => isValidTranslation(w.translation));
    const quizzes = generateQuizzes(quizWords, 30);
    const importedQuizzes = await importQuizzes(quizzes);
    console.log(`Imported ${importedQuizzes} ${languageCode} quizzes into Quiz`);

    totalWords += importedWords;
    totalQuizzes += importedQuizzes;
  }

  console.log(`\nDone. Total: ${totalWords} words, ${totalQuizzes} quizzes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
