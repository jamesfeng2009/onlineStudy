import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "scripts", "generate-content", "output");
const SQL_OUT = path.join(process.cwd(), "generated", "import-generated-content.sql");

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
  };
  const levels = knownLevels[languageCode] ?? [];
  const upper = level.trim().toUpperCase();
  if (levels.includes(upper)) return upper;
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
    const selected = group.slice(0, maxPerLevel);
    for (const word of selected) {
      const otherTranslations = shuffle(group.filter((w) => w.id !== word.id))
        .slice(0, 3)
        .map((w) => w.translation);
      const optionsSet = new Set([word.translation, ...otherTranslations]);
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

function sqlEscape(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function buildSql(words: WordBankInput[], quizzes: QuizInput[]): string {
  const lines: string[] = [];
  lines.push("-- 自动生成的学习内容导入 SQL");
  lines.push("-- 来源：WordNet + Tatoeba（英）、JMdict + Tatoeba（日）、CC-CEDICT + Tatoeba（中）");
  lines.push("-- 生成时间：" + new Date().toISOString());
  lines.push("");
  lines.push("BEGIN;");
  lines.push("");

  lines.push("-- WordBank");
  for (const w of words) {
    lines.push(
      `INSERT INTO word_bank (id, "languageCode", level, word, translation, phonetic, "exampleSentence", "vocabOrder") VALUES (` +
        `'${sqlEscape(w.id)}', '${sqlEscape(w.languageCode)}', '${sqlEscape(w.level)}', '${sqlEscape(w.word)}', ` +
        `'${sqlEscape(w.translation)}', ${w.phonetic ? `'${sqlEscape(w.phonetic)}'` : "NULL"}, ` +
        `'${sqlEscape(w.exampleSentence)}', ${w.vocabOrder}` +
        `) ON CONFLICT (id) DO UPDATE SET ` +
        `"languageCode" = EXCLUDED."languageCode", ` +
        `level = EXCLUDED.level, ` +
        `word = EXCLUDED.word, ` +
        `translation = EXCLUDED.translation, ` +
        `phonetic = EXCLUDED.phonetic, ` +
        `"exampleSentence" = EXCLUDED."exampleSentence", ` +
        `"vocabOrder" = EXCLUDED."vocabOrder";`
    );
  }

  lines.push("");
  lines.push("-- Quizzes");
  for (const q of quizzes) {
    const optionsJson = JSON.stringify(q.options).replace(/'/g, "''");
    lines.push(
      `INSERT INTO quizzes (id, "languageCode", level, question, options, answer, explain, "quizOrder", "createdAt", "updatedAt") VALUES (` +
        `'${sqlEscape(q.id)}', '${sqlEscape(q.languageCode)}', '${sqlEscape(q.level)}', '${sqlEscape(q.question)}', ` +
        `'${optionsJson}'::jsonb, ${q.answer}, '${sqlEscape(q.explain)}', ${q.quizOrder}, NOW(), NOW()` +
        `) ON CONFLICT (id) DO UPDATE SET ` +
        `"languageCode" = EXCLUDED."languageCode", ` +
        `level = EXCLUDED.level, ` +
        `question = EXCLUDED.question, ` +
        `options = EXCLUDED.options, ` +
        `answer = EXCLUDED.answer, ` +
        `explain = EXCLUDED.explain, ` +
        `"quizOrder" = EXCLUDED."quizOrder", ` +
        `"updatedAt" = NOW();`
    );
  }

  lines.push("");
  lines.push("COMMIT;");
  return lines.join("\n");
}

function main() {
  const files = [
    { filename: "generated_en.json", languageCode: "en" },
    { filename: "generated_ja.json", languageCode: "ja" },
    { filename: "generated_zh.json", languageCode: "zh" },
  ];

  fs.mkdirSync(path.dirname(SQL_OUT), { recursive: true });

  let totalWords = 0;
  let totalQuizzes = 0;
  const allWords: WordBankInput[] = [];
  const allQuizzes: QuizInput[] = [];

  for (const { filename, languageCode } of files) {
    const raw = loadJson(filename);
    console.log(`Loaded ${raw.length} ${languageCode} words from ${filename}`);

    const words = raw
      .filter((item) => item.word && item.example)
      .map((item, idx) => wordToInput(item, idx));
    const quizWords = words.filter((w) => isValidTranslation(w.translation));
    const quizzes = generateQuizzes(quizWords, 30);

    allWords.push(...words);
    allQuizzes.push(...quizzes);

    totalWords += words.length;
    totalQuizzes += quizzes.length;
  }

  const sql = buildSql(allWords, allQuizzes);
  fs.writeFileSync(SQL_OUT, sql, "utf-8");
  console.log(`\nGenerated SQL: ${SQL_OUT}`);
  console.log(`Total: ${totalWords} words, ${totalQuizzes} quizzes.`);
}

main();
