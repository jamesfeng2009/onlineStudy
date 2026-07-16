/**
 * P3-1: AI 句子解释模块（AI Explain）
 *
 * 设计：
 *   1. 缓存命中：同 (targetType, targetId, promptHash) 直接返回已有结果，节省 LLM 调用
 *   2. 限流：每用户每天 50 次（AI_DAILY_LIMIT env 可调）
 *   3. 多 Provider：默认 Gemini，可切 OpenRouter / Doubao（与 generate-* 脚本一致）
 *   4. 4 个接入点：
 *      - POST /ai-explain/reading/:passageId  (auth) — 解释阅读段落中的指定句子
 *      - POST /ai-explain/writing/:submissionId (auth) — 对用户写作给出 AI 润色建议
 *      - POST /ai-explain/lesson/:exerciseId  (auth) — 解释练习答案（为何对/错）
 *      - POST /ai-explain/word/:wordId        (auth) — 用当前单词造 3 个不同场景例句
 *
 * 响应：{ explanation: string (Markdown), cached: boolean, remainingToday: number }
 *
 * 失败降级：LLM 调用失败时返回 503 + 通用提示，不阻塞用户学习流程。
 */

import type { FastifyPluginAsync } from "fastify";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

// ============================================================
// Provider 路由（与 scripts/generate-* 一致）
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

async function callLLM(systemPrompt: string, userPrompt: string): Promise<LLMResponse> {
  if (!API_KEY) {
    throw new Error("AI service not configured (missing API_KEY)");
  }

  const ep = ENDPOINTS[PROVIDER];
  const url = ep.url(MODEL);
  const headers = { "Content-Type": "application/json", ...ep.auth(API_KEY) };

  let body: string;
  if (PROVIDER === "gemini") {
    body = JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 800, topP: 0.9 },
    });
  } else {
    // OpenRouter / Doubao: OpenAI-compatible
    body = JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 800,
      top_p: 0.9,
    });
  }

  const resp = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(15000) });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`LLM API ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const json = await resp.json() as any;
  let text = "";
  let tokensInput = 0;
  let tokensOutput = 0;

  if (PROVIDER === "gemini") {
    text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    tokensInput = json?.usageMetadata?.promptTokenCount ?? 0;
    tokensOutput = json?.usageMetadata?.candidatesTokenCount ?? 0;
  } else {
    text = json?.choices?.[0]?.message?.content ?? "";
    tokensInput = json?.usage?.prompt_tokens ?? 0;
    tokensOutput = json?.usage?.completion_tokens ?? 0;
  }

  if (!text.trim()) {
    throw new Error("LLM returned empty response");
  }

  return { text, tokensInput, tokensOutput };
}

// ============================================================
// 限流 + 缓存工具
// ============================================================

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT ?? "50");

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function checkAndIncrementUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const dateKey = todayKey();
  // upsert 当日计数
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

function hashPrompt(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 32);
}

// ============================================================
// 4 种 target 类型的 prompt 构造器
// ============================================================

interface ExplainContext {
  targetType: "reading" | "writing" | "lesson" | "word";
  targetId: string;
  languageCode?: string;
  query: string;
  // 额外上下文（如阅读段落、写作原文）
  extraContext?: string;
}

function buildPrompt(ctx: ExplainContext): { system: string; user: string } {
  const langLabel = ctx.languageCode ? `${ctx.languageCode} ` : "";
  switch (ctx.targetType) {
    case "reading":
      return {
        system:
          `你是 ${langLabel}语言教学专家。用户在阅读材料中选中了一个句子，请给出简明易懂的中文解释，` +
          `包含：1) 句子结构分析；2) 关键词汇/语法的用法说明；3) 中文翻译。用 Markdown，控制在 300 字以内。`,
        user:
          `阅读材料上下文：\n${ctx.extraContext ?? "(无)"}\n\n` +
          `用户选中的句子：\n${ctx.query}\n\n请用中文解释。`,
      };
    case "writing":
      return {
        system:
          `你是 ${langLabel}写作教练。用户提交了一段写作，请给出 1) 简短肯定；` +
          `2) 最多 3 处具体修改建议（指出原句+改进版+原因）；3) 一段润色后的范文。用 Markdown，控制在 400 字以内。`,
        user:
          `写作题目要求：\n${ctx.extraContext ?? "(无)"}\n\n` +
          `用户提交内容：\n${ctx.query}\n\n请用中文给出反馈。`,
      };
    case "lesson":
      return {
        system:
          `你是 ${langLabel}练习讲解员。用户做了一道练习题，请解释为什么正确答案是对的` +
          `（如果用户答错，说明错在哪里、易混点是什么）。用 Markdown，控制在 200 字以内。`,
        user:
          `题目与选项：\n${ctx.extraContext ?? "(无)"}\n\n` +
          `用户问题：\n${ctx.query}\n\n请用中文解释。`,
      };
    case "word":
      return {
        system:
          `你是 ${langLabel}词汇老师。请用给定的词，按 3 个不同生活场景造 3 个例句，` +
          `每句附中文翻译和该场景说明。用 Markdown 列表。控制在 250 字以内。`,
        user:
          `目标词汇：\n${ctx.query}\n\n` +
          `词汇信息：\n${ctx.extraContext ?? "(无)"}\n\n请造 3 个场景例句。`,
      };
  }
}

// ============================================================
// 通用执行器：缓存 → LLM → 落库
// ============================================================

interface ExecuteParams extends ExplainContext {
  userId: string;
}

async function executeExplain(params: ExecuteParams): Promise<{
  explanation: string;
  cached: boolean;
  remaining: number;
}> {
  const { userId, targetType, targetId, languageCode, query, extraContext } = params;

  // 1. 构造 prompt + hash
  const { system, user } = buildPrompt({ targetType, targetId, languageCode, query, extraContext });
  const promptHash = hashPrompt(system + "\n\n" + user);

  // 2. 缓存命中？
  const cached = await prisma.aiExplanation.findUnique({
    where: {
      targetType_targetId_promptHash: { targetType, targetId, promptHash },
    },
  });
  if (cached) {
    // 缓存命中不计入用户配额
    const { remaining } = await checkAndIncrementUsageSafe(userId);
    return { explanation: cached.response, cached: true, remaining };
  }

  // 3. 限流
  const { allowed, remaining } = await checkAndIncrementUsage(userId);
  if (!allowed) {
    throw new Error(`DAILY_LIMIT_EXCEEDED:${DAILY_LIMIT}`);
  }

  // 4. 调用 LLM
  const llmResp = await callLLM(system, user);

  // 5. 落库（缓存）
  await prisma.aiExplanation.create({
    data: {
      userId,
      targetType,
      targetId,
      languageCode: languageCode ?? null,
      query,
      promptHash,
      response: llmResp.text,
      model: MODEL,
      tokensInput: llmResp.tokensInput,
      tokensOutput: llmResp.tokensOutput,
    },
  });

  return { explanation: llmResp.text, cached: false, remaining };
}

/** 缓存命中时不消耗配额的轻量版本（返回当前剩余） */
async function checkAndIncrementUsageSafe(userId: string): Promise<{ remaining: number }> {
  const dateKey = todayKey();
  const existing = await prisma.aiUsageDaily.findUnique({
    where: { userId_dateKey: { userId, dateKey } },
  });
  const current = existing?.count ?? 0;
  return { remaining: Math.max(0, DAILY_LIMIT - current) };
}

// ============================================================
// 路由
// ============================================================

const aiExplainRoutes: FastifyPluginAsync = async (fastify) => {
  // 1. 阅读段落句子解释
  fastify.post<{
    Params: { passageId: string };
    Body: { sentence: string; nativeLanguage?: string };
  }>("/ai-explain/reading/:passageId", {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const { passageId } = request.params;
      const { sentence, nativeLanguage } = request.body ?? {};

      if (!sentence?.trim()) {
        return sendError(reply, "BAD_REQUEST", "sentence 不能为空");
      }

      const passage = await prisma.readingPassage.findUnique({
        where: { id: passageId },
        select: { id: true, languageCode: true, title: true, body: true },
      });
      if (!passage) {
        return sendError(reply, "NOT_FOUND", "阅读段落不存在");
      }

      const result = await executeExplain({
        userId,
        targetType: "reading",
        targetId: passageId,
        languageCode: passage.languageCode,
        query: sentence,
        extraContext: `标题：${passage.title}\n段落前 200 字：${passage.body.slice(0, 200)}`,
      });

      return sendSuccess(reply, {
        explanation: result.explanation,
        cached: result.cached,
        remainingToday: result.remaining,
      });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.startsWith("DAILY_LIMIT_EXCEEDED")) {
        return sendError(reply, "FORBIDDEN", `今日 AI 解释次数已用尽（限额 ${msg.split(":")[1]}）`);
      }
      fastify.log.error({ err: msg }, "ai-explain/reading failed");
      return sendError(reply, "INTERNAL_ERROR", "AI 解释服务暂时不可用，请稍后重试");
    }
  });

  // 2. 写作润色建议
  fastify.post<{
    Params: { submissionId: string };
    Body: { content?: string };
  }>("/ai-explain/writing/:submissionId", {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const { submissionId } = request.params;

      const submission = await prisma.userWritingSubmission.findFirst({
        where: { id: submissionId, userId },
        include: {
          prompt: {
            select: { id: true, languageCode: true, level: true, type: true, prompt: true, minWords: true, maxWords: true },
          },
        },
      });
      if (!submission) {
        return sendError(reply, "NOT_FOUND", "写作提交不存在");
      }

      const result = await executeExplain({
        userId,
        targetType: "writing",
        targetId: submissionId,
        languageCode: submission.prompt.languageCode,
        query: submission.content,
        extraContext:
          `题目：${submission.prompt.prompt}\n` +
          `等级：${submission.prompt.level}（${submission.prompt.type}）\n` +
          `字数要求：${submission.prompt.minWords}-${submission.prompt.maxWords}`,
      });

      return sendSuccess(reply, {
        explanation: result.explanation,
        cached: result.cached,
        remainingToday: result.remaining,
      });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.startsWith("DAILY_LIMIT_EXCEEDED")) {
        return sendError(reply, "FORBIDDEN", `今日 AI 解释次数已用尽（限额 ${msg.split(":")[1]}）`);
      }
      fastify.log.error({ err: msg }, "ai-explain/writing failed");
      return sendError(reply, "INTERNAL_ERROR", "AI 解释服务暂时不可用，请稍后重试");
    }
  });

  // 3. 练习答案讲解
  fastify.post<{
    Params: { exerciseId: string };
    Body: { question: string; options?: string[]; correctAnswer?: string; userAnswer?: string };
  }>("/ai-explain/lesson/:exerciseId", {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const { exerciseId } = request.params;
      const { question, options, correctAnswer, userAnswer } = request.body ?? {};

      if (!question?.trim()) {
        return sendError(reply, "BAD_REQUEST", "question 不能为空");
      }

      const result = await executeExplain({
        userId,
        targetType: "lesson",
        targetId: exerciseId,
        query: question,
        extraContext:
          `选项：${options?.join(" | ") ?? "(无)"}\n` +
          `正确答案：${correctAnswer ?? "(未知)"}\n` +
          `用户答案：${userAnswer ?? "(未答)"}`,
      });

      return sendSuccess(reply, {
        explanation: result.explanation,
        cached: result.cached,
        remainingToday: result.remaining,
      });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.startsWith("DAILY_LIMIT_EXCEEDED")) {
        return sendError(reply, "FORBIDDEN", `今日 AI 解释次数已用尽（限额 ${msg.split(":")[1]}）`);
      }
      fastify.log.error({ err: msg }, "ai-explain/lesson failed");
      return sendError(reply, "INTERNAL_ERROR", "AI 解释服务暂时不可用，请稍后重试");
    }
  });

  // 4. 单词造句
  fastify.post<{
    Params: { wordId: string };
    Body: { word?: string; translation?: string; exampleSentence?: string; languageCode?: string };
  }>("/ai-explain/word/:wordId", {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const { wordId } = request.params;
      const body = request.body ?? {};

      // 如果 body 没传 word，从 DB 取
      let word = body.word;
      let translation = body.translation;
      let exampleSentence = body.exampleSentence;
      let languageCode = body.languageCode;

      if (!word) {
        const w = await prisma.wordBank.findUnique({
          where: { id: wordId },
          include: {
            translations: {
              where: { OR: [{ baseLanguageCode: "en" }] },
              take: 1,
            },
          },
        });
        if (!w) return sendError(reply, "NOT_FOUND", "单词不存在");
        word = w.word;
        translation = w.translations[0]?.translation ?? undefined;
        exampleSentence = w.exampleSentence ?? undefined;
        languageCode = w.languageCode;
      }

      const result = await executeExplain({
        userId,
        targetType: "word",
        targetId: wordId,
        languageCode,
        query: word,
        extraContext:
          `释义：${translation ?? "(无)"}\n` +
          `例句：${exampleSentence ?? "(无)"}`,
      });

      return sendSuccess(reply, {
        explanation: result.explanation,
        cached: result.cached,
        remainingToday: result.remaining,
      });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.startsWith("DAILY_LIMIT_EXCEEDED")) {
        return sendError(reply, "FORBIDDEN", `今日 AI 解释次数已用尽（限额 ${msg.split(":")[1]}）`);
      }
      fastify.log.error({ err: msg }, "ai-explain/word failed");
      return sendError(reply, "INTERNAL_ERROR", "AI 解释服务暂时不可用，请稍后重试");
    }
  });

  // 5. 查询当前用户今日剩余配额（前端展示用）
  fastify.get("/ai-explain/usage", {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = request.user.userId;
    const dateKey = todayKey();
    const usage = await prisma.aiUsageDaily.findUnique({
      where: { userId_dateKey: { userId, dateKey } },
    });
    const used = usage?.count ?? 0;
    return sendSuccess(reply, {
      used,
      limit: DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - used),
    });
  });
};

export default aiExplainRoutes;
