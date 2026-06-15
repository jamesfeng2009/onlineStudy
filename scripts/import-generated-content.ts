import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";

const prisma = new PrismaClient();

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
    zh: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"],
  };
  const levels = knownLevels[languageCode] ?? [];
  const upper = level.trim().toUpperCase();
  if (levels.includes(upper)) return upper;
  // 简单兜底映射
  if (languageCode === "en") {
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
    if (!isNaN(num) && num >= 1 && num <= 6) return `HSK${num}`;
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
  return {
    id: `gen-${languageCode}-${order}-${item.word}`,
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
  let count = 0;
  for (const w of inputs) {
    await prisma.wordBank.upsert({
      where: { id: w.id },
      update: {
        languageCode: w.languageCode,
        level: w.level,
        word: w.word,
        translation: w.translation,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
        vocabOrder: w.vocabOrder,
      },
      create: {
        id: w.id,
        languageCode: w.languageCode,
        level: w.level,
        word: w.word,
        translation: w.translation,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
        vocabOrder: w.vocabOrder,
      },
    });
    count++;
  }
  return count;
}

async function importQuizzes(quizzes: QuizInput[]) {
  let count = 0;
  for (const q of quizzes) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: {
        languageCode: q.languageCode,
        level: q.level,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        quizOrder: q.quizOrder,
      },
      create: {
        id: q.id,
        languageCode: q.languageCode,
        level: q.level,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        quizOrder: q.quizOrder,
      },
    });
    count++;
  }
  return count;
}

async function main() {
  const files = [
    { filename: "generated_en.json", languageCode: "en" },
    { filename: "generated_ja.json", languageCode: "ja" },
    { filename: "generated_zh.json", languageCode: "zh" },
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
