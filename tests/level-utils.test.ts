/**
 * P3-3: level-utils 单元测试
 *
 * 覆盖：
 *   - cefrEquivalent / cefrRank 各语言体系映射
 *   - HSK 3.0 七/八/九级 → C2 映射（P2-4 新增）
 *   - ko TOPIK 1-6 与旧等级向后兼容
 *   - 未知语言/未知等级的 fallback 行为
 */
import { describe, it, expect } from "vitest";
import { cefrEquivalent, cefrRank } from "../src/lib/level-utils";

describe("cefrEquivalent", () => {
  it("CEFR 语言（en/es/fr/de/it/th）原样返回", () => {
    expect(cefrEquivalent("en", "A1")).toBe("A1");
    expect(cefrEquivalent("es", "B2")).toBe("B2");
    expect(cefrEquivalent("fr", "C2")).toBe("C2");
    expect(cefrEquivalent("de", "C1")).toBe("C1");
    expect(cefrEquivalent("it", "A2")).toBe("A2");
    expect(cefrEquivalent("th", "B1")).toBe("B1");
  });

  it("日语 JLPT 映射", () => {
    expect(cefrEquivalent("ja", "N5")).toBe("A1");
    expect(cefrEquivalent("ja", "N4")).toBe("A2");
    expect(cefrEquivalent("ja", "N3")).toBe("B1");
    expect(cefrEquivalent("ja", "N2")).toBe("B2");
    expect(cefrEquivalent("ja", "N1")).toBe("C1");
  });

  it("中文 HSK 3.0 一到六级映射", () => {
    expect(cefrEquivalent("zh", "HSK1")).toBe("A1");
    expect(cefrEquivalent("zh", "HSK2")).toBe("A2");
    expect(cefrEquivalent("zh", "HSK3")).toBe("B1");
    expect(cefrEquivalent("zh", "HSK4")).toBe("B2");
    expect(cefrEquivalent("zh", "HSK5")).toBe("C1");
    expect(cefrEquivalent("zh", "HSK6")).toBe("C1");
  });

  it("中文 HSK 3.0 七/八/九级全部映射到 C2（P2-4 新增）", () => {
    expect(cefrEquivalent("zh", "HSK7")).toBe("C2");
    expect(cefrEquivalent("zh", "HSK8")).toBe("C2");
    expect(cefrEquivalent("zh", "HSK9")).toBe("C2");
  });

  it("韩语 TOPIK 1-6 映射", () => {
    expect(cefrEquivalent("ko", "TOPIK1")).toBe("A1");
    expect(cefrEquivalent("ko", "TOPIK2")).toBe("A2");
    expect(cefrEquivalent("ko", "TOPIK3")).toBe("B1");
    expect(cefrEquivalent("ko", "TOPIK4")).toBe("B2");
    expect(cefrEquivalent("ko", "TOPIK5")).toBe("C1");
    expect(cefrEquivalent("ko", "TOPIK6")).toBe("C2");
  });

  it("韩语旧等级向后兼容", () => {
    expect(cefrEquivalent("ko", "초급")).toBe("A1");
    expect(cefrEquivalent("ko", "중급")).toBe("A2");
    expect(cefrEquivalent("ko", "고급")).toBe("B1");
    expect(cefrEquivalent("ko", "심화")).toBe("B2");
  });

  it("粤语映射", () => {
    expect(cefrEquivalent("yue", "初级")).toBe("A1");
    expect(cefrEquivalent("yue", "中级")).toBe("B1");
    expect(cefrEquivalent("yue", "高级")).toBe("B2");
  });

  it("未注册的语言但 level 是 CEFR 时按 CEFR 处理（文档化 fallback）", () => {
    // cefrEquivalent 故意对已经是 CEFR 编码的 level 直接返回，便于跨语言使用
    expect(cefrEquivalent("xx", "A1")).toBe("A1");
  });

  it("未知等级返回 undefined", () => {
    expect(cefrEquivalent("zh", "HSK99")).toBeUndefined();
    expect(cefrEquivalent("ja", "N0")).toBeUndefined();
    expect(cefrEquivalent("xx", "HSK1")).toBeUndefined();
  });

  it("level 为 undefined 时返回 undefined", () => {
    expect(cefrEquivalent("zh", undefined)).toBeUndefined();
    expect(cefrEquivalent("en", undefined)).toBeUndefined();
  });
});

describe("cefrRank", () => {
  it("A1=1, A2=2, B1=3, B2=4, C1=5, C2=6", () => {
    expect(cefrRank("en", "A1")).toBe(1);
    expect(cefrRank("en", "A2")).toBe(2);
    expect(cefrRank("en", "B1")).toBe(3);
    expect(cefrRank("en", "B2")).toBe(4);
    expect(cefrRank("en", "C1")).toBe(5);
    expect(cefrRank("en", "C2")).toBe(6);
  });

  it("跨语言可比较：zh-HSK9(6) > ja-N5(1)", () => {
    expect(cefrRank("zh", "HSK9")).toBeGreaterThan(cefrRank("ja", "N5"));
  });

  it("HSK7/8/9 排名相同（同为 C2）", () => {
    const r7 = cefrRank("zh", "HSK7");
    const r8 = cefrRank("zh", "HSK8");
    const r9 = cefrRank("zh", "HSK9");
    expect(r7).toBe(r8);
    expect(r8).toBe(r9);
    expect(r9).toBe(6);
  });

  it("未知等级返回 0", () => {
    expect(cefrRank("zh", "HSK99")).toBe(0);
    expect(cefrRank("xx", "HSK1")).toBe(0);
    expect(cefrRank("zh", undefined)).toBe(0);
  });
});
