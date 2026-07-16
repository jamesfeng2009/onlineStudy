/**
 * P3-3: 写作评分算法测试
 *
 * 覆盖：
 *   - tokenize：CJK / 拉丁分支、空字符串
 *   - computeScore：字数不足/合适/超限、词汇多样性、关键词命中/缺失
 */
import { describe, it, expect } from "vitest";
import { tokenize, computeScore } from "../server/lib/writing-score";

describe("tokenize", () => {
  it("空字符串返回空数组", () => {
    expect(tokenize("")).toEqual({ words: [], isCjk: false });
  });

  it("拉丁文本按空格切分", () => {
    const r = tokenize("hello world foo");
    expect(r.isCjk).toBe(false);
    expect(r.words).toEqual(["hello", "world", "foo"]);
  });

  it("拉丁文本转小写并去除标点", () => {
    const r = tokenize("Hello, World! Foo-Bar.");
    expect(r.isCjk).toBe(false);
    expect(r.words).toEqual(["hello", "world", "foo-bar"]);
  });

  it("CJK 文本按字符计数", () => {
    const r = tokenize("你好，世界。今天天气很好。");
    expect(r.isCjk).toBe(true);
    // 去除标点后应剩 10 个字
    expect(r.words.length).toBe(10);
    expect(r.words[0]).toBe("你");
  });

  it("混合文本以 CJK 为主时按 CJK 处理", () => {
    const r = tokenize("我今天去 shopping 了");
    // CJK 字符占比 > 30%，按 CJK 处理
    expect(r.isCjk).toBe(true);
  });

  it("混合文本以拉丁为主时按拉丁处理", () => {
    const r = tokenize("I went to 北京 yesterday and it was great");
    expect(r.isCjk).toBe(false);
    expect(r.words.length).toBeGreaterThan(3);
  });
});

describe("computeScore", () => {
  const baseOpts = {
    minWords: 50,
    maxWords: 200,
    keywords: ["互联网", "学习", "改变"],
  };

  it("空内容得 0 分", () => {
    const r = computeScore("", baseOpts);
    expect(r.wordCount).toBe(0);
    expect(r.varietyScore).toBe(0);
    expect(r.score).toBeLessThan(50);
  });

  it("字数合适且命中全部关键词 → 高分", () => {
    // 80 字 CJK 内容，含 3 个关键词
    const content = "互联网改变了我们的学习方式，这是一种深刻的改变。" +
      "在过去的几年里，技术的发展让我们能够随时随地获取信息。" +
      "这种变化不仅影响了个人，也影响了整个社会的运作方式。";
    const r = computeScore(content, baseOpts);
    expect(r.wordCount).toBeGreaterThanOrEqual(50);
    expect(r.wordCount).toBeLessThanOrEqual(200);
    expect(r.lengthScore).toBe(100);
    expect(r.keywordScore).toBe(100);
    expect(r.feedback.matchedKeywords).toHaveLength(3);
    expect(r.feedback.missedKeywords).toHaveLength(0);
    // CJK 按字计数时存在天然字符重复，varietyScore < 100，故综合分 >= 80 即为高分
    expect(r.score).toBeGreaterThanOrEqual(80);
  });

  it("字数不足按比例扣 lengthScore", () => {
    // 10 字内容
    const content = "互联网学习改变。";
    const r = computeScore(content, baseOpts);
    expect(r.wordCount).toBeLessThan(baseOpts.minWords);
    expect(r.lengthScore).toBeLessThan(100);
    expect(r.lengthScore).toBeGreaterThan(0);
    expect(r.feedback.lengthHint).toContain("字数偏少");
  });

  it("字数超出 1.5 倍上限扣分", () => {
    // 构造 800 字 CJK 内容，远超 maxWords*1.5=300，触发扣分分支
    const content = "学习".repeat(400);
    const r = computeScore(content, baseOpts);
    expect(r.wordCount).toBeGreaterThan(baseOpts.maxWords * 1.5);
    expect(r.lengthScore).toBeLessThan(100);
    expect(r.feedback.lengthHint).toContain("字数偏多");
  });

  it("部分命中关键词得部分 keywordScore", () => {
    const content = "互联网很有趣。"; // 只命中 1 个
    const r = computeScore(content, baseOpts);
    expect(r.feedback.matchedKeywords).toEqual(["互联网"]);
    expect(r.feedback.missedKeywords).toEqual(["学习", "改变"]);
    expect(r.keywordScore).toBe(Math.round((1 / 3) * 100));
  });

  it("无关键词要求时 keywordScore = 100", () => {
    const r = computeScore("一些内容用于测试。", {
      minWords: 5,
      maxWords: 200,
      keywords: [],
    });
    expect(r.keywordScore).toBe(100);
    expect(r.feedback.keywordHint).toContain("未设置关键词");
  });

  it("综合分 = round(length*0.3 + variety*0.3 + keyword*0.4)", () => {
    const content = "互联网改变了学习。";
    const r = computeScore(content, baseOpts);
    const expected = Math.round(
      r.lengthScore * 0.3 + r.varietyScore * 0.3 + r.keywordScore * 0.4
    );
    expect(r.score).toBe(expected);
  });

  it("词汇重复较多时 varietyScore 较低且给出建议", () => {
    const content = "互联网互联网互联网互联网互联网互联网互联网互联网互联网互联网";
    const r = computeScore(content, baseOpts);
    expect(r.varietyScore).toBeLessThan(50);
    expect(r.feedback.varietyHint).toContain("重复");
  });

  it("CJK 内容会加入 CJK 写作建议", () => {
    const content = "互联网改变了我们的学习方式，这是一种深刻的改变。";
    const r = computeScore(content, baseOpts);
    expect(
      r.feedback.suggestions.some((s: string) =>
        s.includes("中文/日文/韩文写作")
      )
    ).toBe(true);
  });
});
