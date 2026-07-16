import { defineConfig } from "vitest/config";

/**
 * P3-3: Vitest 配置
 *
 * 测试范围：纯函数 + 类型逻辑（不测 DB / 网络）
 *   - server/lib/writing-score.ts（评分算法）
 *   - src/lib/level-utils.ts（CEFR 映射）
 *   - src/data/badges.ts（badge 阈值）
 *   - src/data/level-meta.ts（HSK 3.0 等级完整性）
 */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
});
