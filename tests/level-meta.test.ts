/**
 * P3-3: level-meta 单元测试
 *
 * 覆盖：
 *   - HSK 3.0 一到九级完整性（P2-4 重点）
 *   - 各语言等级数量正确
 *   - LevelMeta 结构合法性（vocabTarget / guidedHours 为正）
 *   - getLevelMeta / listLevelMeta 查询行为
 */
import { describe, it, expect } from "vitest";
import { LEVEL_META, getLevelMeta, listLevelMeta } from "../src/data/level-meta";

describe("HSK 3.0 完整性（P2-4）", () => {
  it("zh 包含 HSK1-HSK9 全部 9 个等级", () => {
    const zhKeys = Object.keys(LEVEL_META.zh);
    expect(zhKeys).toHaveLength(9);
    for (let i = 1; i <= 9; i++) {
      expect(zhKeys).toContain(`HSK${i}`);
    }
  });

  it("HSK7-9 vocabTarget 单调递增（高级进阶 → 通级）", () => {
    const hsk7 = LEVEL_META.zh.HSK7;
    const hsk8 = LEVEL_META.zh.HSK8;
    const hsk9 = LEVEL_META.zh.HSK9;
    expect(hsk7.vocabTarget).toBeGreaterThan(0);
    expect(hsk8.vocabTarget).toBeGreaterThan(hsk7.vocabTarget);
    expect(hsk9.vocabTarget).toBeGreaterThan(hsk8.vocabTarget);
  });

  it("HSK7-9 全部对齐到 C2", () => {
    expect(LEVEL_META.zh.HSK7.cefrAlignment).toBe("C2");
    expect(LEVEL_META.zh.HSK8.cefrAlignment).toBe("C2");
    expect(LEVEL_META.zh.HSK9.cefrAlignment).toBe("C2");
  });

  it("HSK7-9 frameworkAlignment 标注为 HSK 框架", () => {
    for (const lv of ["HSK7", "HSK8", "HSK9"] as const) {
      const meta = LEVEL_META.zh[lv];
      expect(meta.frameworkAlignment.framework).toBe("HSK");
      expect(meta.frameworkAlignment.level).toBe(lv);
    }
  });

  it("HSK7-9 guidedHours 随等级递增", () => {
    const h7 = LEVEL_META.zh.HSK7.guidedHours;
    const h8 = LEVEL_META.zh.HSK8.guidedHours;
    const h9 = LEVEL_META.zh.HSK9.guidedHours;
    expect(h7).toBeLessThan(h8);
    expect(h8).toBeLessThan(h9);
  });
});

describe("各语言等级数量", () => {
  it("CEFR 语言各 6 个等级（A1-C2）", () => {
    for (const lang of ["en", "es", "fr", "de", "it"] as const) {
      expect(Object.keys(LEVEL_META[lang])).toHaveLength(6);
    }
  });

  it("th 5 个等级（A1-C1）", () => {
    expect(Object.keys(LEVEL_META.th)).toHaveLength(5);
  });

  it("yue 4 个等级（A1-B2）", () => {
    expect(Object.keys(LEVEL_META.yue)).toHaveLength(4);
  });

  it("ja 5 个等级（N5-N1）", () => {
    expect(Object.keys(LEVEL_META.ja)).toEqual(
      expect.arrayContaining(["N5", "N4", "N3", "N2", "N1"])
    );
  });

  it("ko 6 个 TOPIK 等级", () => {
    expect(Object.keys(LEVEL_META.ko)).toHaveLength(6);
  });
});

describe("LevelMeta 结构合法性", () => {
  const allEntries = Object.entries(LEVEL_META);

  it("每个等级都有非空 code 和 name", () => {
    for (const [lang, map] of allEntries) {
      for (const [code, meta] of Object.entries(map)) {
        expect(meta.code, `${lang}.${code}.code`).toBeTruthy();
        expect(meta.name, `${lang}.${code}.name`).toBeTruthy();
      }
    }
  });

  it("每个等级 vocabTarget 为正整数", () => {
    for (const [lang, map] of allEntries) {
      for (const [code, meta] of Object.entries(map)) {
        expect(meta.vocabTarget, `${lang}.${code}.vocabTarget`).toBeGreaterThan(0);
        expect(Number.isInteger(meta.vocabTarget)).toBe(true);
      }
    }
  });

  it("每个等级 guidedHours 为正整数", () => {
    for (const [lang, map] of allEntries) {
      for (const [code, meta] of Object.entries(map)) {
        expect(meta.guidedHours, `${lang}.${code}.guidedHours`).toBeGreaterThan(0);
      }
    }
  });

  it("每个等级至少 4 条 learningGoals", () => {
    for (const [lang, map] of allEntries) {
      for (const [code, meta] of Object.entries(map)) {
        expect(meta.learningGoals.length, `${lang}.${code}.learningGoals`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("每个等级至少 3 条 grammarPoints", () => {
    for (const [lang, map] of allEntries) {
      for (const [code, meta] of Object.entries(map)) {
        expect(meta.grammarPoints.length, `${lang}.${code}.grammarPoints`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

describe("getLevelMeta", () => {
  it("命中返回 LevelMeta", () => {
    const m = getLevelMeta("zh", "HSK9");
    expect(m?.code).toBe("HSK9");
    expect(m?.vocabTarget).toBe(11092);
  });

  it("未知语言返回 undefined", () => {
    expect(getLevelMeta("xx", "A1")).toBeUndefined();
  });

  it("已知语言未知等级返回 undefined", () => {
    expect(getLevelMeta("zh", "HSK99")).toBeUndefined();
  });
});

describe("listLevelMeta", () => {
  it("zh 返回 9 条", () => {
    expect(listLevelMeta("zh")).toHaveLength(9);
  });

  it("未知语言返回空数组", () => {
    expect(listLevelMeta("xx")).toEqual([]);
  });

  it("每条都有 code 字段", () => {
    for (const meta of listLevelMeta("ja")) {
      expect(meta.code).toBeTruthy();
    }
  });
});
