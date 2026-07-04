/**
 * Seed Listening / Speaking / Quiz (and QuizTranslation) tables from
 * the auto-generated data files.
 *
 * Idempotent: uses prisma.upsert so re-runs are safe.
 *
 * Run with:
 *   pnpm tsx scripts/seed-listening-speaking.ts
 *
 * Schema notes (see prisma/schema.prisma):
 *   - Listening: { id, languageCode, level, title, script, blanks (JSON), listenOrder }
 *     (no tokens / scene / speeds / accent columns)
 *   - Speaking: { id, languageCode, level, phrase, translation, phonetic?, speakOrder }
 *   - Quiz: { id, languageCode, level, options (JSON string[]), answer (int), quizOrder }
 *     (no question / explain columns — those live on QuizTranslation)
 *   - QuizTranslation: { id, quizId, baseLanguageCode, question, explain }
 */
import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";
import { GENERATED_LISTENING } from "../src/data/generated-listening.js";
import { GENERATED_SPEAKING } from "../src/data/generated-speaking.js";
import { GENERATED_QUIZZES } from "../src/data/generated-quizzes.js";

const prisma = new PrismaClient();

interface Blank {
  index: number;
  answer: string;
}

async function importListening(): Promise<number> {
  let count = 0;
  // 按 language+level 的索引决定 listenOrder
  const orderMap = new Map<string, number>();
  for (const item of GENERATED_LISTENING) {
    const key = `${item.language}#${item.level ?? ""}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);

    const blanks: Blank[] = Array.isArray(item.blanks) ? item.blanks : [];
    await prisma.listening.upsert({
      where: { id: item.id },
      update: {
        languageCode: item.language,
        level: item.level ?? "",
        title: item.title,
        script: item.script,
        blanks,
        listenOrder: order,
      },
      create: {
        id: item.id,
        languageCode: item.language,
        level: item.level ?? "",
        title: item.title,
        script: item.script,
        blanks,
        listenOrder: order,
      },
    });
    count++;
  }
  return count;
}

async function importSpeaking(): Promise<number> {
  let count = 0;
  const orderMap = new Map<string, number>();
  for (const item of GENERATED_SPEAKING) {
    const key = `${item.language}#${item.level ?? ""}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);

    await prisma.speaking.upsert({
      where: { id: item.id },
      update: {
        languageCode: item.language,
        level: item.level ?? "",
        phrase: item.phrase,
        translation: item.translation,
        phonetic: item.phonetic ?? null,
        speakOrder: order,
      },
      create: {
        id: item.id,
        languageCode: item.language,
        level: item.level ?? "",
        phrase: item.phrase,
        translation: item.translation,
        phonetic: item.phonetic ?? null,
        speakOrder: order,
      },
    });
    count++;
  }
  return count;
}

async function importQuizzes(): Promise<{ count: number; translations: number }> {
  let count = 0;
  let translations = 0;
  const orderMap = new Map<string, number>();
  for (const item of GENERATED_QUIZZES) {
    const key = `${item.language}#${item.level ?? ""}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);

    // 1) upsert Quiz 表（只写 options/answer/quizOrder）
    await prisma.quiz.upsert({
      where: { id: item.id },
      update: {
        languageCode: item.language,
        level: item.level ?? "",
        options: item.options,
        answer: item.answer,
        quizOrder: order,
      },
      create: {
        id: item.id,
        languageCode: item.language,
        level: item.level ?? "",
        options: item.options,
        answer: item.answer,
        quizOrder: order,
      },
    });
    count++;

    // 2) upsert QuizTranslation（写 question/explain，baseLanguageCode 用 "en"）
    const question = item.question ?? "";
    const explain = item.explain ?? "";
    await prisma.quizTranslation.upsert({
      where: {
        quizId_baseLanguageCode: {
          quizId: item.id,
          baseLanguageCode: "en",
        },
      },
      update: {
        baseLanguageCode: "en",
        question,
        explain,
      },
      create: {
        quizId: item.id,
        baseLanguageCode: "en",
        question,
        explain,
      },
    });
    translations++;
  }
  return { count, translations };
}

async function main() {
  console.log("Seeding listening exercises...");
  const listeningCount = await importListening();

  console.log("Seeding speaking phrases...");
  const speakingCount = await importSpeaking();

  console.log("Seeding quizzes (+ translations)...");
  const { count: quizCount, translations: translationCount } = await importQuizzes();

  console.log(
    `\nImported ${listeningCount} listening, ${speakingCount} speaking, ${quizCount} quizzes (+ ${translationCount} translations)`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
