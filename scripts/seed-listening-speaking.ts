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
import { PrismaClient, Prisma } from "../server/lib/prisma-generated/client/index.js";
import { GENERATED_LISTENING } from "../src/data/generated-listening.js";
import { GENERATED_SPEAKING } from "../src/data/generated-speaking.js";
import { GENERATED_QUIZZES } from "../src/data/generated-quizzes.js";

// 覆盖 connection_limit=1 → 5，提高 seed 容错
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace("connection_limit=1", "connection_limit=5"),
    },
  },
});

// P1001/P1017 (网络瞬时断连) 自动重试
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const code = (e as { code?: string })?.code;
      if ((code === "P1001" || code === "P1017") && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}

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

interface Blank {
  index: number;
  answer: string;
}

async function importListening(): Promise<number> {
  // 先顺序计算 listenOrder（避免并发时 orderMap 竞争）
  const orderMap = new Map<string, number>();
  const items = GENERATED_LISTENING.map((item) => {
    const key = `${item.language}#${item.level ?? ""}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);
    const blanks: Blank[] = Array.isArray(item.blanks) ? item.blanks : [];
    return { item, order, blanks: blanks as unknown as Prisma.InputJsonValue };
  });
  // 并发 upsert（5 路）
  await mapWithConcurrency(items, 5, async ({ item, order, blanks }) => {
    await withRetry(() => prisma.listening.upsert({
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
    }));
  });
  return items.length;
}

async function importSpeaking(): Promise<number> {
  const orderMap = new Map<string, number>();
  const items = GENERATED_SPEAKING.map((item) => {
    const key = `${item.language}#${item.level ?? ""}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);
    return { item, order };
  });
  await mapWithConcurrency(items, 5, async ({ item, order }) => {
    await withRetry(() => prisma.speaking.upsert({
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
    }));
  });
  return items.length;
}

async function importQuizzes(): Promise<{ count: number; translations: number }> {
  const orderMap = new Map<string, number>();
  const items = GENERATED_QUIZZES.map((item) => {
    const key = `${item.language}#${item.level ?? ""}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);
    return { item, order };
  });
  await mapWithConcurrency(items, 5, async ({ item, order }) => {
    const question = item.question ?? "";
    const explain = item.explain ?? "";
    // 1) upsert Quiz 表（只写 options/answer/quizOrder）
    await withRetry(() => prisma.quiz.upsert({
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
    }));
    // 2) upsert QuizTranslation（写 question/explain，baseLanguageCode 用 "en"）
    await withRetry(() => prisma.quizTranslation.upsert({
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
    }));
  });
  return { count: items.length, translations: items.length };
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
