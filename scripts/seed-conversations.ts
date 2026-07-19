/**
 * Seed RealConversation / DialogueScene tables from the static data files.
 *
 * P1 反爬：这两个数据集从此迁入 DB，通过 /api/real-conversations、
 * /api/dialogue-scenes 按需下发，不再打进前端 bundle。
 *
 * Idempotent: uses prisma.upsert so re-runs are safe.
 *
 * Run with:
 *   pnpm tsx scripts/seed-conversations.ts
 *
 * Schema notes (see prisma/schema.prisma):
 *   - RealConversation: { id, languageCode, conversationId, domain, utterances (JSON), convOrder }
 *   - DialogueScene:    { id, languageCode, level, scenario, title, opening, turns (JSON), startTurnId, sceneOrder }
 */
import { PrismaClient, Prisma } from "../server/lib/prisma-generated/client/index.js";
import { REAL_CONVERSATIONS } from "../src/data/real-conversations.js";
import { DIALOGUE_SCENES } from "../src/data/dialogue-scenes.js";

// 覆盖 connection_limit=1 → 5，提高 seed 容错
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace("connection_limit=1", "connection_limit=5"),
    },
  },
});

// P1001/P1017 (网络瞬时断连) 自动重试
async function withRetry<T>(fn: () => Promise<T>, retries = 6): Promise<T> {
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

async function importRealConversations(): Promise<number> {
  // 先顺序计算 convOrder（按 语言#domain 分组编号，避免并发竞争）
  const orderMap = new Map<string, number>();
  const items = REAL_CONVERSATIONS.map((c) => {
    const key = `${c.language}#${c.domain}`;
    const order = orderMap.get(key) ?? 0;
    orderMap.set(key, order + 1);
    return {
      id: c.id,
      languageCode: c.language,
      conversationId: c.conversationId,
      domain: c.domain,
      utterances: c.utterances as unknown as Prisma.InputJsonValue,
      convOrder: order,
    };
  });

  const total = items.length;
  let done = 0;
  // 并发降到 3：pooler 连接不稳定，减少瞬时连接数
  await mapWithConcurrency(items, 3, async (item) => {
    await withRetry(() => prisma.realConversation.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    }));
    done += 1;
    if (done % 250 === 0 || done === total) {
      console.log(`  real_conversations: ${done}/${total}`);
    }
  });
  return total;
}

async function importDialogueScenes(): Promise<number> {
  const orderMap = new Map<string, number>();
  const items = DIALOGUE_SCENES.map((s) => {
    const order = orderMap.get(s.language) ?? 0;
    orderMap.set(s.language, order + 1);
    return {
      id: s.id,
      languageCode: s.language,
      level: s.level,
      scenario: s.scenario,
      title: s.title,
      opening: s.opening,
      turns: s.turns as unknown as Prisma.InputJsonValue,
      startTurnId: s.startTurnId,
      sceneOrder: order,
    };
  });

  await mapWithConcurrency(items, 5, async (item) => {
    await withRetry(() => prisma.dialogueScene.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    }));
  });
  return items.length;
}

async function main() {
  console.log("Seeding real conversations...");
  const convCount = await importRealConversations();

  console.log("Seeding dialogue scenes...");
  const sceneCount = await importDialogueScenes();

  console.log(`\nImported ${convCount} real conversations, ${sceneCount} dialogue scenes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
