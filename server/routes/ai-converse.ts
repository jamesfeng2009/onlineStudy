/**
 * P4-2: AI 对话模块（AI Conversation）
 *
 * 与 P3-1 的单次解释不同,这里实现多轮对话。
 *
 * 设计：
 *   1. 会话持久化:AiConversation + AiConversationMessage 落库,刷新页面可恢复
 *   2. 限次:复用 ai_usage_daily 表,每轮对话 count+1,受 AI_DAILY_LIMIT 约束
 *   3. 限时:10 分钟无活动自动标记 timeout(查询时判断,不跑定时任务)
 *   4. 多 Provider:复用 P3-1 的 Gemini/OpenRouter/Doubao 配置
 *   5. 多轮消息:扩展 callLLM 支持 messages 数组
 *
 * 路由：
 *   POST /ai-converse/start                (auth) — 开始新会话
 *   POST /ai-converse/:conversationId/send (auth) — 发送消息并获取 AI 回复
 *   GET  /ai-converse/list                  (auth) — 列出用户会话
 *   GET  /ai-converse/:conversationId       (auth) — 获取会话详情(含全部消息)
 *   POST /ai-converse/:conversationId/end   (auth) — 结束会话
 */

import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("ai-converse");

// ============================================================
// Provider 路由(与 ai-explain.ts 一致,独立声明避免循环依赖)
// ============================================================

type Provider = "gemini" | "openrouter" | "doubao";

const PROVIDER: Provider = (process.env.LLM_PROVIDER as Provider) || "gemini";
const API_KEY =
  (PROVIDER === "openrouter" ? process.env.OPENROUTER_API_KEY
    : PROVIDER === "doubao" ? process.env.DOUBAO_API_KEY
    : process.env.GEMINI_API_KEY
  )?.trim();

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-flash",
  openrouter: "qwen/qwen-2.5-72b-instruct",
  doubao: "doubao-seed-2.0-mini",
};
const MODEL = process.env.LLM_MODEL?.trim() || DEFAULT_MODEL[PROVIDER];

const ENDPOINTS: Record<Provider, { url: (m: string) => string; auth: (k: string) => Record<string, string> }> = {
  gemini: {
    url: (m) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,
    auth: (k) => ({ "x-goog-api-key": k }),
  },
  openrouter: {
    url: () => "https://openrouter.ai/api/v1/chat/completions",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
  },
  doubao: {
    url: () => "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    auth: (k) => ({ Authorization: `Bearer ${k}` }),
  },
};

interface LLMResponse {
  text: string;
  tokensInput: number;
  tokensOutput: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * 调用 LLM(支持多轮消息)
 * 与 ai-explain.ts 的 callLLM 区别:接受 messages 数组而非单条 userPrompt
 */
async function callLLMMultiTurn(systemPrompt: string, messages: ChatMessage[]): Promise<LLMResponse> {
  if (!API_KEY) {
    throw new Error("AI service not configured (missing API_KEY)");
  }

  const ep = ENDPOINTS[PROVIDER];
  const url = ep.url(MODEL);
  const headers = { "Content-Type": "application/json", ...ep.auth(API_KEY) };

  let body: string;
  if (PROVIDER === "gemini") {
    // Gemini: contents 数组,role 为 user/model
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    body = JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 600, topP: 0.95 },
    });
  } else {
    // OpenRouter / Doubao: OpenAI 兼容
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];
    body = JSON.stringify({
      model: MODEL,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
      top_p: 0.95,
    });
  }

  const resp = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(20000) });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`LLM API ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const json = await resp.json() as Record<string, unknown>;
  let text = "";
  let tokensInput = 0;
  let tokensOutput = 0;

  if (PROVIDER === "gemini") {
    const candidates = json.candidates as Array<Record<string, unknown>> | undefined;
    const content = candidates?.[0]?.content as Record<string, unknown> | undefined;
    const parts = content?.parts as Array<Record<string, unknown>> | undefined;
    text = (parts?.[0]?.text as string) ?? "";
    const usage = json.usageMetadata as Record<string, number> | undefined;
    tokensInput = usage?.promptTokenCount ?? 0;
    tokensOutput = usage?.candidatesTokenCount ?? 0;
  } else {
    const choices = json.choices as Array<Record<string, unknown>> | undefined;
    const message = choices?.[0]?.message as Record<string, unknown> | undefined;
    text = (message?.content as string) ?? "";
    const usage = json.usage as Record<string, number> | undefined;
    tokensInput = usage?.prompt_tokens ?? 0;
    tokensOutput = usage?.completion_tokens ?? 0;
  }

  if (!text.trim()) {
    throw new Error("LLM returned empty response");
  }

  return { text, tokensInput, tokensOutput };
}

// ============================================================
// 限流(复用 ai_usage_daily,与 P3-1 共享配额)
// ============================================================

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT ?? "50");
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 分钟无活动自动 timeout

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function checkAndIncrementUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const dateKey = todayKey();
  const existing = await prisma.aiUsageDaily.findUnique({
    where: { userId_dateKey: { userId, dateKey } },
  });
  const currentCount = existing?.count ?? 0;
  if (currentCount >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  if (existing) {
    await prisma.aiUsageDaily.update({
      where: { id: existing.id },
      data: { count: { increment: 1 }, updatedAt: new Date() },
    });
  } else {
    await prisma.aiUsageDaily.create({ data: { userId, dateKey, count: 1 } });
  }
  return { allowed: true, remaining: DAILY_LIMIT - currentCount - 1 };
}

async function getRemainingUsage(userId: string): Promise<number> {
  const dateKey = todayKey();
  const existing = await prisma.aiUsageDaily.findUnique({
    where: { userId_dateKey: { userId, dateKey } },
  });
  return Math.max(0, DAILY_LIMIT - (existing?.count ?? 0));
}

// ============================================================
// 会话超时检查
// ============================================================

/** 检查并标记超时会话(超过 10 分钟无活动) */
async function markTimeoutIfNeeded(conversationId: string): Promise<boolean> {
  const conv = await prisma.aiConversation.findUnique({
    where: { id: conversationId },
    select: { status: true, lastActiveAt: true },
  });
  if (!conv || conv.status !== "active") return false;
  const elapsed = Date.now() - conv.lastActiveAt.getTime();
  if (elapsed > SESSION_TIMEOUT_MS) {
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { status: "timeout" },
    });
    return true;
  }
  return false;
}

// ============================================================
// 系统提示词构造
// ============================================================

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

// ============================================================
// 路由
// ============================================================

const aiConverseRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 1. 开始新会话(幂等:同语言同等级的 active 会话复用) ======
  fastify.post<{
    Body: { languageCode?: string; level?: string; scenarioType?: string; title?: string };
  }>("/ai-converse/start", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const body = request.body ?? ({} as typeof request.body);
    const languageCode = typeof body.languageCode === "string" ? body.languageCode : "en";
    const level = typeof body.level === "string" ? body.level : undefined;
    const scenarioType = typeof body.scenarioType === "string" ? body.scenarioType : "free";
    const title = typeof body.title === "string" ? body.title : null;

    const remaining = await getRemainingUsage(userId);
    if (remaining <= 0) {
      return sendError(reply, "FORBIDDEN", `今日 AI 对话次数已用尽(限额 ${DAILY_LIMIT})`);
    }

    // 幂等:查找用户同语言+同等级的 active 且未超时的会话,有则复用
    const existing = await prisma.aiConversation.findFirst({
      where: {
        userId,
        languageCode,
        level: level ?? null,
        status: "active",
        lastActiveAt: { gt: new Date(Date.now() - SESSION_TIMEOUT_MS) },
      },
      orderBy: { updatedAt: "desc" },
      take: 1,
    });

    let conv: Awaited<ReturnType<typeof prisma.aiConversation.create>>;
    if (existing) {
      // 复用现有 active 会话
      conv = existing;
    } else {
      conv = await prisma.aiConversation.create({
        data: { userId, languageCode, level, scenarioType, title },
      });
    }

    return sendSuccess(reply, {
      conversationId: conv.id,
      status: conv.status,
      languageCode: conv.languageCode,
      level: conv.level,
      scenarioType: conv.scenarioType,
      remainingToday: remaining,
      reused: existing !== null,
    });
  });

  // ====== 2. 发送消息并获取 AI 回复(幂等:Idempotency-Key 去重) ======
  fastify.post<{
    Params: { conversationId: string };
    Body: { content?: string };
  }>("/ai-converse/:conversationId/send", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { conversationId } = request.params;
    const body = request.body ?? ({} as typeof request.body);
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!content) {
      return sendError(reply, "BAD_REQUEST", "消息内容不能为空");
    }
    if (content.length > 2000) {
      return sendError(reply, "BAD_REQUEST", "消息内容过长(上限 2000 字符)");
    }

    // ===== 幂等性检查 =====
    // 客户端通过 Idempotency-Key header 传入 UUID,同一 key 重复请求返回首次响应
    const idempotencyKey = (request.headers["idempotency-key"] as string | undefined)?.trim();
    if (idempotencyKey) {
      const existing = await prisma.aiIdempotencyKey.findUnique({
        where: { conversationId_idempotencyKey: { conversationId, idempotencyKey } },
      });
      if (existing) {
        // 幂等命中:返回首次的响应,不重复创建消息、不重复扣配额
        const cached = JSON.parse(existing.responseJson) as {
          userMessage: { id: string; role: string; content: string; createdAt: string };
          assistantMessage: { id: string; role: string; content: string; createdAt: string };
          remainingToday: number;
        };
        return sendSuccess(reply, { ...cached, idempotentReplay: true });
      }
    }

    // 检查会话归属 + 状态
    const conv = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 20, // 最近 20 条消息作为上下文
        },
      },
    });

    if (!conv) {
      return sendError(reply, "NOT_FOUND", "会话不存在");
    }
    if (conv.userId !== userId) {
      return sendError(reply, "FORBIDDEN", "无权访问此会话");
    }

    // 检查超时
    const timedOut = await markTimeoutIfNeeded(conversationId);
    if (timedOut || conv.status !== "active") {
      return sendError(reply, "FORBIDDEN", "会话已超时或已结束,请开始新会话");
    }

    // 限流
    const { allowed, remaining } = await checkAndIncrementUsage(userId);
    if (!allowed) {
      return sendError(reply, "FORBIDDEN", `今日 AI 对话次数已用尽(限额 ${DAILY_LIMIT})`);
    }

    // 保存用户消息
    const userMessage = await prisma.aiConversationMessage.create({
      data: { conversationId, role: "user", content },
    });

    // 构造多轮消息(历史 + 当前)
    const history: ChatMessage[] = conv.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
      }));
    history.push({ role: "user", content });

    // 调用 LLM
    log.info(request, "AI converse request", { language: conv.languageCode, messageLength: content.length });
    const systemPrompt = buildSystemPrompt(conv.languageCode, conv.level ?? undefined);
    let assistantText = "";
    let tokensInput = 0;
    let tokensOutput = 0;
    try {
      const llmResp = await callLLMMultiTurn(systemPrompt, history);
      assistantText = llmResp.text;
      tokensInput = llmResp.tokensInput;
      tokensOutput = llmResp.tokensOutput;
    } catch (err) {
      const msg = (err as Error).message;
      fastify.log.error({ err: msg, conversationId }, "ai-converse/send LLM failed");
      log.error(request, "AI converse error", { err });
      // LLM 失败:回滚用户消息 + 配额计数(因为没产生 assistant 回复)
      await prisma.aiConversationMessage.delete({ where: { id: userMessage.id } });
      await prisma.aiUsageDaily.update({
        where: { userId_dateKey: { userId, dateKey: todayKey() } },
        data: { count: { decrement: 1 } },
      }).catch(() => {/* 忽略计数回滚失败 */});
      return sendError(reply, "INTERNAL_ERROR", "AI 回复暂时不可用,请稍后重试");
    }

    // 保存 AI 回复
    const assistantMessage = await prisma.aiConversationMessage.create({
      data: {
        conversationId,
        role: "assistant",
        content: assistantText,
        tokensInput,
        tokensOutput,
      },
    });

    // 更新会话活跃时间 + 轮次
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: {
        turnCount: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });

    const responseData = {
      userMessage: {
        id: userMessage.id,
        role: "user",
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: "assistant",
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      },
      remainingToday: remaining,
    };

    // 保存幂等键(如果有),24 小时 TTL
    if (idempotencyKey) {
      await prisma.aiIdempotencyKey.create({
        data: {
          conversationId,
          idempotencyKey,
          responseJson: JSON.stringify(responseData),
        },
      }).catch((err: unknown) => {
        // 唯一约束冲突 = 并发请求已创建,忽略(返回响应即可)
        fastify.log.warn({ err: (err as Error).message, conversationId, idempotencyKey }, "idempotency key already exists (race)");
      });
    }

    return sendSuccess(reply, responseData);
  });

  // ====== 3. 列出用户会话 ======
  fastify.get<{
    Querystring: { limit?: number };
  }>("/ai-converse/list", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const limit = Math.min(request.query.limit ?? 20, 50);

    const conversations = await prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        languageCode: true,
        level: true,
        title: true,
        scenarioType: true,
        status: true,
        turnCount: true,
        lastActiveAt: true,
        createdAt: true,
      },
    });

    // 标记超时的会话(惰性检查)
    const now = Date.now();
    const result = await Promise.all(
      conversations.map(async (c) => {
        if (c.status === "active" && now - c.lastActiveAt.getTime() > SESSION_TIMEOUT_MS) {
          await prisma.aiConversation.update({
            where: { id: c.id },
            data: { status: "timeout" },
          });
          return { ...c, status: "timeout" };
        }
        return c;
      })
    );

    return sendSuccess(reply, { conversations: result });
  });

  // ====== 4. 获取会话详情(含全部消息) ======
  fastify.get<{
    Params: { conversationId: string };
  }>("/ai-converse/:conversationId", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { conversationId } = request.params;

    const conv = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conv) {
      return sendError(reply, "NOT_FOUND", "会话不存在");
    }
    if (conv.userId !== userId) {
      return sendError(reply, "FORBIDDEN", "无权访问此会话");
    }

    // 惰性超时检查
    if (conv.status === "active" && Date.now() - conv.lastActiveAt.getTime() > SESSION_TIMEOUT_MS) {
      await prisma.aiConversation.update({
        where: { id: conversationId },
        data: { status: "timeout" },
      });
      conv.status = "timeout";
    }

    const remaining = await getRemainingUsage(userId);

    return sendSuccess(reply, {
      conversation: {
        id: conv.id,
        languageCode: conv.languageCode,
        level: conv.level,
        title: conv.title,
        scenarioType: conv.scenarioType,
        status: conv.status,
        turnCount: conv.turnCount,
        lastActiveAt: conv.lastActiveAt,
        createdAt: conv.createdAt,
      },
      messages: conv.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
      remainingToday: remaining,
    });
  });

  // ====== 5. 结束会话 ======
  fastify.post<{
    Params: { conversationId: string };
  }>("/ai-converse/:conversationId/end", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { userId } = request.user;
    const { conversationId } = request.params;

    const conv = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true, status: true },
    });

    if (!conv) {
      return sendError(reply, "NOT_FOUND", "会话不存在");
    }
    if (conv.userId !== userId) {
      return sendError(reply, "FORBIDDEN", "无权访问此会话");
    }

    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { status: "ended" },
    });

    return sendSuccess(reply, { conversationId, status: "ended" });
  });
};

export default aiConverseRoutes;
