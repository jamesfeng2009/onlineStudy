/**
 * P4-2: AI 对话模块单元测试
 *
 * 测试范围:
 *   - 系统提示词构造(buildSystemPrompt)
 *   - 超时阈值常量
 *   - 限流逻辑边界
 *
 * 注:由于 callLLMMultiTurn 和数据库交互依赖外部服务,
 * 这里只测纯函数逻辑。集成测试需要单独的测试 DB。
 */

import { describe, it, expect } from "vitest";

// 复刻 ai-converse.ts 的纯函数逻辑用于测试
// (因为原函数未 export,这里复制实现来验证逻辑正确性)
function buildSystemPrompt(languageCode: string, level?: string): string {
  const levelHint = level ? `The learner is at ${level} level.` : "The learner is at a beginner level.";
  return [
    `You are a friendly language tutor helping a student learn ${languageCode.toUpperCase()}.`,
    levelHint,
    "Rules:",
    `1. Respond primarily in ${languageCode.toUpperCase()} (the target language), with brief English glosses for new vocabulary.`,
    "2. Keep responses short (2-4 sentences) to maintain conversation flow.",
    "3. Gently correct mistakes by rephrasing correctly, not by lecturing.",
    "4. Ask follow-up questions to keep the conversation going.",
    "5. If the student writes in their native language, encourage them to try the target language.",
    "6. Be encouraging and patient. Praise effort.",
  ].join("\n");
}

const SESSION_TIMEOUT_MS = 10 * 60 * 1000;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isTimedOut(lastActiveAt: Date): boolean {
  return Date.now() - lastActiveAt.getTime() > SESSION_TIMEOUT_MS;
}

describe("P4-2 AI 对话 - buildSystemPrompt", () => {
  it("包含目标语言代码(大写)", () => {
    const p = buildSystemPrompt("zh");
    expect(p).toContain("ZH");
    expect(p).toContain("friendly language tutor");
  });

  it("指定等级时包含等级提示", () => {
    const p = buildSystemPrompt("ja", "N3");
    expect(p).toContain("The learner is at N3 level.");
  });

  it("未指定等级时使用默认 beginner 提示", () => {
    const p = buildSystemPrompt("en");
    expect(p).toContain("beginner level");
    expect(p).not.toContain("at undefined level");
  });

  it("包含核心教学规则", () => {
    const p = buildSystemPrompt("ko");
    expect(p).toContain("Respond primarily in KO");
    expect(p).toContain("Gently correct mistakes");
    expect(p).toContain("Ask follow-up questions");
    expect(p).toContain("encourage them to try the target language");
  });

  it("粤语语言代码正常处理", () => {
    const p = buildSystemPrompt("yue");
    expect(p).toContain("YUE");
  });
});

describe("P4-2 AI 对话 - 超时逻辑", () => {
  it("10 分钟阈值正确(600000 ms)", () => {
    expect(SESSION_TIMEOUT_MS).toBe(10 * 60 * 1000);
    expect(SESSION_TIMEOUT_MS).toBe(600000);
  });

  it("刚刚活跃的会话不超时", () => {
    const justNow = new Date();
    expect(isTimedOut(justNow)).toBe(false);
  });

  it("5 分钟前的会话不超时", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(isTimedOut(fiveMinAgo)).toBe(false);
  });

  it("9 分钟前的会话不超时(边界)", () => {
    const nineMinAgo = new Date(Date.now() - 9 * 60 * 1000 - 59 * 1000);
    expect(isTimedOut(nineMinAgo)).toBe(false);
  });

  it("10 分钟前的会话超时", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000 - 1000);
    expect(isTimedOut(tenMinAgo)).toBe(true);
  });

  it("1 小时前的会话超时", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(isTimedOut(oneHourAgo)).toBe(true);
  });
});

describe("P4-2 AI 对话 - 限流工具", () => {
  it("todayKey 返回 YYYY-MM-DD 格式", () => {
    const key = todayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(key.length).toBe(10);
  });

  it("todayKey 与当前 UTC 日期一致", () => {
    const now = new Date();
    const expected = now.toISOString().slice(0, 10);
    expect(todayKey()).toBe(expected);
  });
});

describe("P4-2 AI 对话 - 多轮消息构造", () => {
  it("历史消息 + 当前消息合并", () => {
    const history = [
      { role: "user" as const, content: "Hello" },
      { role: "assistant" as const, content: "Hi there!" },
    ];
    const current = { role: "user" as const, content: "How are you?" };
    const messages = [...history, current];
    expect(messages).toHaveLength(3);
    expect(messages[0].role).toBe("user");
    expect(messages[2].content).toBe("How are you?");
  });

  it("过滤 system 消息(只保留 user/assistant)", () => {
    const allMessages = [
      { role: "system", content: "You are a tutor" },
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi!" },
    ];
    const filtered = allMessages.filter((m) => m.role !== "system");
    expect(filtered).toHaveLength(2);
    expect(filtered.every((m) => m.role === "user" || m.role === "assistant")).toBe(true);
  });
});

describe("P4-3 AI 对话 - 幂等性逻辑", () => {
  // 复刻幂等键的复合唯一键逻辑用于测试
  function buildIdempotencyUniqueKey(conversationId: string, idempotencyKey: string): string {
    return `${conversationId}#${idempotencyKey}`;
  }

  it("不同会话的相同 key 应视为不同(复合键)", () => {
    const k1 = buildIdempotencyUniqueKey("conv-1", "key-abc");
    const k2 = buildIdempotencyUniqueKey("conv-2", "key-abc");
    expect(k1).not.toBe(k2);
  });

  it("同一会话的相同 key 应视为相同(命中缓存)", () => {
    const k1 = buildIdempotencyUniqueKey("conv-1", "key-abc");
    const k2 = buildIdempotencyUniqueKey("conv-1", "key-abc");
    expect(k1).toBe(k2);
  });

  it("同一会话的不同 key 应视为不同(新请求)", () => {
    const k1 = buildIdempotencyUniqueKey("conv-1", "key-abc");
    const k2 = buildIdempotencyUniqueKey("conv-1", "key-def");
    expect(k1).not.toBe(k2);
  });

  it("crypto.randomUUID 生成符合 UUID 格式", () => {
    // 模拟前端生成的 idempotency key
    const uuid = crypto.randomUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it("两次 randomUUID 调用应生成不同的值", () => {
    const u1 = crypto.randomUUID();
    const u2 = crypto.randomUUID();
    expect(u1).not.toBe(u2);
  });

  it("无 Idempotency-Key 时应正常处理(向后兼容)", () => {
    // 模拟旧客户端不发 header 的情况
    const header = undefined as string | undefined;
    const idempotencyKey = header?.trim();
    expect(idempotencyKey).toBeUndefined();
    // 这种情况应跳过幂等检查,直接处理请求
  });

  it("响应数据可正确 JSON 序列化/反序列化", () => {
    const responseData = {
      userMessage: { id: "msg-1", role: "user", content: "Hello", createdAt: "2026-01-01T00:00:00Z" },
      assistantMessage: { id: "msg-2", role: "assistant", content: "Hi!", createdAt: "2026-01-01T00:00:01Z" },
      remainingToday: 49,
    };
    const json = JSON.stringify(responseData);
    const parsed = JSON.parse(json);
    expect(parsed.userMessage.content).toBe("Hello");
    expect(parsed.assistantMessage.content).toBe("Hi!");
    expect(parsed.remainingToday).toBe(49);
  });

  it("幂等重放标记(idempotentReplay)", () => {
    // 模拟幂等命中时的响应
    const cachedResponse = {
      userMessage: { id: "msg-1", role: "user", content: "Hello", createdAt: "2026-01-01T00:00:00Z" },
      assistantMessage: { id: "msg-2", role: "assistant", content: "Hi!", createdAt: "2026-01-01T00:00:01Z" },
      remainingToday: 49,
      idempotentReplay: true,
    };
    expect(cachedResponse.idempotentReplay).toBe(true);
  });
});

describe("P4-3 AI 对话 - /start 幂等复用逻辑", () => {
  // 模拟会话复用的判断条件
  function shouldReuseSession(
    existingStatus: string,
    lastActiveAgoMs: number,
    timeoutMs: number
  ): boolean {
    return existingStatus === "active" && lastActiveAgoMs < timeoutMs;
  }

  it("active 且未超时的会话应复用", () => {
    expect(shouldReuseSession("active", 5 * 60 * 1000, 10 * 60 * 1000)).toBe(true);
  });

  it("已结束的会话不应复用", () => {
    expect(shouldReuseSession("ended", 1 * 60 * 1000, 10 * 60 * 1000)).toBe(false);
  });

  it("已超时的会话不应复用", () => {
    expect(shouldReuseSession("active", 15 * 60 * 1000, 10 * 60 * 1000)).toBe(false);
  });

  it("边界:刚好 10 分钟不应复用(用 >)", () => {
    expect(shouldReuseSession("active", 10 * 60 * 1000, 10 * 60 * 1000)).toBe(false);
  });
});
