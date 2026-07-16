/**
 * P3-3: SM-2 间隔重复算法单元测试
 *
 * 覆盖：
 *   - scheduleNext：首次/再次/困难/良好/轻松 各分支
 *   - easeFactor 边界（< 1.3 钳位）
 *   - isDue 时间判断
 *   - describeNextInterval 文本输出
 *   - 纯函数性（不修改入参）
 */
import { describe, it, expect } from "vitest";
import {
  INITIAL_SRS_STATE,
  scheduleNext,
  isDue,
  describeNextInterval,
  qualityToLabel,
} from "../src/lib/sm2";
import type { SrsState } from "../src/types";

describe("INITIAL_SRS_STATE", () => {
  it("初始 easeFactor = 2.5", () => {
    expect(INITIAL_SRS_STATE.easeFactor).toBe(2.5);
  });

  it("初始 interval = 0、repetitions = 0", () => {
    expect(INITIAL_SRS_STATE.interval).toBe(0);
    expect(INITIAL_SRS_STATE.repetitions).toBe(0);
  });

  it("nextReviewAt 是 epoch（1970-01-01），即立刻到期", () => {
    expect(new Date(INITIAL_SRS_STATE.nextReviewAt).getTime()).toBe(0);
  });
});

describe("scheduleNext - 首次复习", () => {
  it("首次答 good（q=4）→ 1 天后、repetitions=1", () => {
    const next = scheduleNext(INITIAL_SRS_STATE, "good");
    expect(next.interval).toBe(1);
    expect(next.repetitions).toBe(1);
    expect(next.easeFactor).toBeCloseTo(2.5, 1);
  });

  it("首次答 easy（q=5）→ 1 天后、easeFactor 上升", () => {
    const next = scheduleNext(INITIAL_SRS_STATE, "easy");
    expect(next.interval).toBe(1);
    expect(next.repetitions).toBe(1);
    // EF' = 2.5 + (0.1 - 0) = 2.6
    expect(next.easeFactor).toBeCloseTo(2.6, 1);
  });

  it("首次答 again（q=0）→ 1 天后但 repetitions=0", () => {
    const next = scheduleNext(INITIAL_SRS_STATE, "again");
    expect(next.interval).toBe(1);
    expect(next.repetitions).toBe(0);
  });
});

describe("scheduleNext - 连续正确", () => {
  it("第二次答 good → 6 天后", () => {
    const s1 = scheduleNext(INITIAL_SRS_STATE, "good"); // 1 天
    const s2 = scheduleNext(s1, "good");
    expect(s2.repetitions).toBe(2);
    expect(s2.interval).toBe(6);
  });

  it("第三次答 good → 上一区间 × easeFactor", () => {
    const s1 = scheduleNext(INITIAL_SRS_STATE, "good");
    const s2 = scheduleNext(s1, "good");
    const s3 = scheduleNext(s2, "good");
    expect(s3.repetitions).toBe(3);
    // interval = round(6 * ~2.5) ≈ 15
    expect(s3.interval).toBeGreaterThan(10);
    expect(s3.interval).toBeLessThan(20);
  });
});

describe("scheduleNext - hard 缩短分支", () => {
  it("hard 比同等条件下的 good 间隔短", () => {
    const s1g = scheduleNext(INITIAL_SRS_STATE, "good");
    const s1h = scheduleNext(INITIAL_SRS_STATE, "hard");
    expect(s1h.interval).toBeLessThanOrEqual(s1g.interval);
  });

  it("hard 不会把 interval 缩到 0", () => {
    const next = scheduleNext(INITIAL_SRS_STATE, "hard");
    expect(next.interval).toBeGreaterThanOrEqual(1);
  });
});

describe("scheduleNext - easeFactor 钳位", () => {
  it("连续 again 后 easeFactor 不低于 1.3", () => {
    let state: SrsState = { ...INITIAL_SRS_STATE };
    for (let i = 0; i < 10; i++) {
      state = scheduleNext(state, "again");
    }
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe("scheduleNext - 纯函数性", () => {
  it("不修改入参", () => {
    const input: SrsState = {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewAt: new Date(0).toISOString(),
    };
    const snapshot = { ...input };
    scheduleNext(input, "good");
    expect(input).toEqual(snapshot);
  });
});

describe("isDue", () => {
  it("nextReviewAt 已过 → true", () => {
    const past: SrsState = {
      ...INITIAL_SRS_STATE,
      nextReviewAt: new Date(Date.now() - 86400000).toISOString(),
    };
    expect(isDue(past)).toBe(true);
  });

  it("nextReviewAt 在未来 → false", () => {
    const future: SrsState = {
      ...INITIAL_SRS_STATE,
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
    };
    expect(isDue(future)).toBe(false);
  });

  it("支持自定义 now 参数", () => {
    const future: SrsState = {
      ...INITIAL_SRS_STATE,
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
    };
    // 2 天后该卡已到期
    expect(isDue(future, Date.now() + 2 * 86400000)).toBe(true);
  });
});

describe("describeNextInterval", () => {
  it("首次 good → 1 天后", () => {
    expect(describeNextInterval("good", INITIAL_SRS_STATE)).toBe("1 天后");
  });

  it("again → 1 天后", () => {
    expect(describeNextInterval("again", INITIAL_SRS_STATE)).toBe("1 天后");
  });

  it("若干次后产生周/月量级描述", () => {
    let s: SrsState = { ...INITIAL_SRS_STATE };
    // 模拟连续答 good，让 interval 增长到周/月量级
    for (let i = 0; i < 5; i++) {
      s = scheduleNext(s, "good");
    }
    const desc = describeNextInterval("good", s);
    expect(desc).toMatch(/(天后|周后|个月后)/);
  });
});

describe("qualityToLabel", () => {
  it("四种质量都有中文标签", () => {
    expect(qualityToLabel("again")).toBe("不记得");
    expect(qualityToLabel("hard")).toBe("困难");
    expect(qualityToLabel("good")).toBe("良好");
    expect(qualityToLabel("easy")).toBe("轻松");
  });
});
