/**
 * P0-3: 分级测试（Placement Test）
 *
 * 设计原则：
 * 1. 自适应：题目难度根据答题正确率在等级阶梯上二分查找（前端实现，避免服务端会话状态）
 * 2. 无登录可测：guest 也能拉题目、跑算法、看推荐
 * 3. 登录后可存：POST /placement/result (auth) 把结果 upsert 到 PlacementResult 表
 * 4. 跨语言可比：返回 finalCefrRank (1-6, A1-C2) 便于跨语言排序
 *
 * 数据来源：从 Quiz 表按 level 分组抽样（quiz 有 4 选项 + 明确 answer，最适合自适应打分）
 *
 * 路由：
 *   GET  /placement/questions/:language?countPerLevel=2&nativeLanguage=en  (no auth)
 *   POST /placement/result                                                 (auth)
 *   GET  /placement/result/:language                                       (auth)
 */

import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("placement");

interface PlacementAnswer {
  level: string;
  itemId: string;
  selectedOption: number;
  correct: boolean;
}

function pickTranslation(
  translations: { baseLanguageCode: string; question: string; explain: string }[],
  nativeLanguage: string
): { question: string; explain: string } {
  const exact = translations.find((t) => t.baseLanguageCode === nativeLanguage);
  if (exact) return { question: exact.question, explain: exact.explain };
  const en = translations.find((t) => t.baseLanguageCode === "en");
  if (en) return { question: en.question, explain: en.explain };
  const any = translations[0];
  if (any) return { question: any.question, explain: any.explain };
  return { question: "", explain: "" };
}

const placementRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 1. 拉取分级测试题集（无登录）======
  // 返回该语言所有 level 的题目（按 level 分组，每组最多 countPerLevel 个）
  // 前端按自适应算法决定显示哪一题；题目随机顺序由前端 shuffle 处理
  fastify.get<{
    Params: { language: string };
    Querystring: { countPerLevel?: string; nativeLanguage?: string };
  }>("/placement/questions/:language", async (request, reply) => {
    const { language } = request.params;
    const countPerLevel = Math.min(5, Math.max(1, parseInt(request.query.countPerLevel ?? "3", 10)));
    const nativeLanguage = request.query.nativeLanguage || "en";

    // 1. 拉取该语言所有 quiz，按 level 分组
    const quizzes = await prisma.quiz.findMany({
      where: { languageCode: language },
      orderBy: [{ quizOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        level: true,
        options: true,
        answer: true,
        translations: {
          where: { OR: [{ baseLanguageCode: nativeLanguage }, { baseLanguageCode: "en" }] },
          select: { baseLanguageCode: true, question: true, explain: true },
        },
      },
    });

    // 2. 按 level 分组，每组取前 countPerLevel 个
    const byLevel = new Map<string, typeof quizzes>();
    for (const q of quizzes) {
      if (!q.level) continue;
      if (!byLevel.has(q.level)) byLevel.set(q.level, []);
      const arr = byLevel.get(q.level)!;
      if (arr.length < countPerLevel) arr.push(q);
    }

    // 3. 构造响应：扁平 questions 数组（每条带 level），levels 数组（升序）
    const levels = Array.from(byLevel.keys()).sort();
    const questions = levels.flatMap((level) =>
      byLevel.get(level)!.map((q) => {
        const t = pickTranslation(q.translations, nativeLanguage);
        return {
          level,
          id: q.id,
          question: t.question,
          options: q.options as string[],
          answer: q.answer,
        };
      })
    );

    log.info(request, "placement questions fetched", { language, countPerLevel, count: questions.length });

    return sendSuccess(reply, {
      language,
      levels,
      questions,
      totalQuestions: questions.length,
    });
  });

  // ====== 2. 保存分级测试结果（auth）======
  // 每个 (userId, language) 仅保留最新一次（upsert 覆盖）
  fastify.post<{
    Body: {
      language: string;
      recommendedLevel: string;
      recommendedCourseId?: string | null;
      totalQuestions: number;
      correctCount: number;
      finalCefrRank: number;
      answers?: PlacementAnswer[];
    };
  }>(
    "/placement/result",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const body = request.body ?? ({} as typeof request.body);

      // 基本校验
      if (!body.language || !body.recommendedLevel) {
        return sendError(reply, "BAD_REQUEST", "缺少 language 或 recommendedLevel");
      }
      if (typeof body.totalQuestions !== "number" || typeof body.correctCount !== "number") {
        return sendError(reply, "BAD_REQUEST", "totalQuestions / correctCount 必须为数字");
      }
      if (typeof body.finalCefrRank !== "number" || body.finalCefrRank < 1 || body.finalCefrRank > 6) {
        return sendError(reply, "BAD_REQUEST", "finalCefrRank 必须为 1-6");
      }

      request.log.info(
        {
          userId,
          language: body.language,
          recommendedLevel: body.recommendedLevel,
          correctCount: body.correctCount,
          totalQuestions: body.totalQuestions,
        },
        "placement/result: save"
      );

      const saved = await prisma.placementResult.upsert({
        where: { userId_language: { userId, language: body.language } },
        create: {
          userId,
          language: body.language,
          recommendedLevel: body.recommendedLevel,
          recommendedCourseId: body.recommendedCourseId ?? null,
          totalQuestions: body.totalQuestions,
          correctCount: body.correctCount,
          finalCefrRank: body.finalCefrRank,
          answers: (body.answers ?? []) as unknown as object,
        },
        update: {
          recommendedLevel: body.recommendedLevel,
          recommendedCourseId: body.recommendedCourseId ?? null,
          totalQuestions: body.totalQuestions,
          correctCount: body.correctCount,
          finalCefrRank: body.finalCefrRank,
          answers: (body.answers ?? []) as unknown as object,
          takenAt: new Date(),
        },
      });

      log.info(request, "placement result saved", {
        language: body.language,
        recommendedLevel: body.recommendedLevel,
        correctCount: body.correctCount,
        totalQuestions: body.totalQuestions,
      });

      return sendSuccess(reply, saved);
    }
  );

  // ====== 3. 拉取该语言最新分级结果（auth）======
  fastify.get<{
    Params: { language: string };
  }>(
    "/placement/result/:language",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { language } = request.params;

      const result = await prisma.placementResult.findUnique({
        where: { userId_language: { userId, language } },
      });

      log.info(request, "placement result fetched", { language });

      return sendSuccess(reply, result);
    }
  );
};

export default placementRoutes;
