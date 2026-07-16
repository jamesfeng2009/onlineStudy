/**
 * P0-2: 韩语等级迁移脚本
 *
 * 把 ko 语言的所有内容（WordBank / Quiz / Listening / Speaking）的 level 字段
 * 从 ["초급","중급","고급","심화"] 迁移到 ["TOPIK1","TOPIK2","TOPIK3","TOPIK4","TOPIK5","TOPIK6"]
 *
 * 迁移映射：
 *   초급 → TOPIK1  (A1)
 *   중급 → TOPIK3  (B1)  ← 注意：跳过 TOPIK2，因为原中级对应 CEFR B1
 *   고급 → TOPIK5  (C1)  ← 跳过 TOPIK4
 *   심화 → TOPIK6  (C2)
 *
 * 注意：th 和 yue 也在 P0-2 改成 CEFR，但它们原来用的就是 ["初级","中级","高级"] 中文标签，
 *       这次需要改成 ["A1","A2","B1","B2","C1"]，不过这些语言本身内容很少，
 *       而且迁移复杂（3 级 → 5 级），P0-2 暂不强制迁移 th/yue 的旧数据，
 *       只让新数据用 CEFR 即可（参考 level-utils.ts 的 fallback 逻辑）。
 *
 * 运行方式：
 *   pnpm tsx scripts/migrate-ko-levels.ts --dry-run   # 先看 dry run
 *   pnpm tsx scripts/migrate-ko-levels.ts --apply     # 真实迁移 DB
 *
 * 幂等：重复跑只迁移 level 还在旧值的数据。
 */

import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";

const prisma = new PrismaClient();

const KO_LEVEL_MAP: Record<string, string> = {
  초급: "TOPIK1",
  중급: "TOPIK3",
  고급: "TOPIK5",
  심화: "TOPIK6",
};

const isDryRun = !process.argv.includes("--apply");

async function migrate() {
  console.log("=".repeat(60));
  console.log(`  韩语等级迁移 ${isDryRun ? "(DRY RUN)" : "(APPLY)"}`);
  console.log("=".repeat(60));

  for (const [oldLevel, newLevel] of Object.entries(KO_LEVEL_MAP)) {
    // WordBank
    const wbCount = await prisma.wordBank.count({
      where: { languageCode: "ko", level: oldLevel },
    });
    const qtCount = await prisma.quiz.count({
      where: { languageCode: "ko", level: oldLevel },
    });
    const lsCount = await prisma.listening.count({
      where: { languageCode: "ko", level: oldLevel },
    });
    const spCount = await prisma.speaking.count({
      where: { languageCode: "ko", level: oldLevel },
    });

    console.log(
      `[${oldLevel} → ${newLevel}] wordBank=${wbCount} quiz=${qtCount} listening=${lsCount} speaking=${spCount}`
    );

    if (!isDryRun && (wbCount + qtCount + lsCount + spCount) > 0) {
      const [, , ,] = await Promise.all([
        prisma.wordBank.updateMany({
          where: { languageCode: "ko", level: oldLevel },
          data: { level: newLevel },
        }),
        prisma.quiz.updateMany({
          where: { languageCode: "ko", level: oldLevel },
          data: { level: newLevel },
        }),
        prisma.listening.updateMany({
          where: { languageCode: "ko", level: oldLevel },
          data: { level: newLevel },
        }),
        prisma.speaking.updateMany({
          where: { languageCode: "ko", level: oldLevel },
          data: { level: newLevel },
        }),
      ]);
      console.log(`  ✓ migrated`);
    }
  }

  console.log("=".repeat(60));
  console.log(isDryRun ? "DRY RUN 结束。加 --apply 真实迁移。" : "✓ 迁移完成");
}

migrate()
  .catch((err) => {
    console.error("迁移失败：", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
