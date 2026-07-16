import type { FastifyPluginAsync } from "fastify";
import { Prisma } from "../lib/prisma-generated/client/index.js";
import { prisma } from "../lib/prisma.js";
import {
  aggregateProgress,
  updateProgressInTransaction,
  defaultModuleScores,
  type ModuleScores,
} from "../lib/progress.js";
import { clamp } from "../lib/utils.js";
import { sendSuccess, sendError } from "../lib/response.js";
import { createRouteLogger } from "../lib/logger.js";

const log = createRouteLogger("progress");

type ReviewQuality = "again" | "hard" | "good" | "easy";

interface SrsStateInput {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string; // ISO timestamp
}

const progressRoutes: FastifyPluginAsync = async (fastify) => {

  // ====== 获取用户进度汇总 ======
  fastify.get(
    "/progress/me",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return sendError(reply, "NOT_FOUND", "User not found");

      const progressDays = await prisma.userProgressDay.findMany({
        where: { userId },
        orderBy: { studyDate: "asc" },
      });

      let totalWordsLearned = 0;
      let totalWordCorrect = 0;
      let totalWordTotal = 0;
      let totalQuizzesDone = 0;
      let totalQuizCorrect = 0;
      let totalQuizTotal = 0;
      let totalSpeakingMinutes = 0;
      let totalListeningMinutes = 0;
      const perDay: Record<string, number> = {};
      let lastModuleScores: ModuleScores = defaultModuleScores;

      for (const day of progressDays) {
        totalWordsLearned += day.wordsLearned;
        totalWordCorrect += day.wordCorrect;
        totalWordTotal += day.wordTotal;
        totalQuizzesDone += day.quizzesDone;
        totalQuizCorrect += day.quizCorrect;
        totalQuizTotal += day.quizTotal;
        totalSpeakingMinutes += day.speakingMinutes;
        totalListeningMinutes += day.listeningMinutes;
        const key = new Date(day.studyDate).toISOString().slice(0, 10);
        perDay[key] = day.minutes;
        if (day.moduleScores) {
          const s = day.moduleScores as unknown as Partial<ModuleScores>;
          lastModuleScores = {
            words: typeof s.words === "number" ? s.words : defaultModuleScores.words,
            grammar: typeof s.grammar === "number" ? s.grammar : defaultModuleScores.grammar,
            listening: typeof s.listening === "number" ? s.listening : defaultModuleScores.listening,
            speaking: typeof s.speaking === "number" ? s.speaking : defaultModuleScores.speaking,
          };
        }
      }

      return sendSuccess(reply, {
        wordsLearned: totalWordsLearned,
        wordCorrect: totalWordCorrect,
        wordTotal: totalWordTotal,
        quizzesDone: totalQuizzesDone,
        quizCorrect: totalQuizCorrect,
        quizTotal: totalQuizTotal,
        speakingMinutes: totalSpeakingMinutes,
        listeningMinutes: totalListeningMinutes,
        perDay,
        moduleScores: lastModuleScores,
        streak: user.streak,
        level: user.level,
        exp: user.exp,
        goalMinutesPerDay: user.goalMinutesPerDay,
      });
    }
  );

  // ====== 记录单词练习 ======
  fastify.post<{
    Body: {
      correct: boolean;
      language: string;
      itemId?: string;
      quality?: ReviewQuality;
      srsState?: SrsStateInput;
    };
  }>(
    "/progress/record-word",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { correct, itemId, quality, srsState } = request.body;

      const gainedExp = correct ? 5 : 0;

      request.log.info(
        { userId, itemId, correct, quality, hasSrsState: !!srsState },
        "record-word: starting"
      );

      try {
        await updateProgressInTransaction(
          userId,
          (d) => {
            d.wordTotal += 1;
            if (correct) {
              d.wordCorrect += 1;
              d.wordsLearned += 1;
            }
            d.minutes += 1;
            if (d.wordTotal > 0) {
              d.moduleScores.words = clamp(Math.round((d.wordCorrect / d.wordTotal) * 100));
            }
          },
          gainedExp,
          itemId
            ? async (tx) => {
                // upsert UserWordReview（per-item SM2 状态）
                const reps = srsState?.repetitions ?? 0;
                const isLearned = correct && reps >= 1;
                const now = new Date();

                await tx.userWordReview.upsert({
                  where: { userId_wordBankId: { userId, wordBankId: itemId } },
                  update: {
                    totalReviews: { increment: 1 },
                    isLearned,
                    ...(correct ? { correctReviews: { increment: 1 } } : {}),
                    ...(quality && srsState
                      ? {
                          easeFactor: srsState.easeFactor,
                          interval: srsState.interval,
                          repetitions: srsState.repetitions,
                          nextReviewAt: new Date(srsState.nextReviewAt),
                          lastReviewAt: now,
                          lastRating: quality,
                        }
                      : {}),
                  },
                  create: {
                    userId,
                    wordBankId: itemId,
                    totalReviews: 1,
                    correctReviews: correct ? 1 : 0,
                    isLearned,
                    easeFactor: srsState?.easeFactor ?? 2.5,
                    interval: srsState?.interval ?? 1,
                    repetitions: srsState?.repetitions ?? 0,
                    nextReviewAt: srsState ? new Date(srsState.nextReviewAt) : now,
                    lastReviewAt: quality ? now : null,
                    lastRating: quality ?? null,
                  },
                });
              }
            : undefined
        );
      } catch (err: unknown) {
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 记录测验练习 ======
  fastify.post<{
    Body: {
      correct: boolean;
      language: string;
      itemId?: string;
      quality?: ReviewQuality;
      srsState?: SrsStateInput;
      grammarPointId?: string;
    };
  }>(
    "/progress/record-quiz",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { correct, itemId, quality, srsState } = request.body;

      const gainedExp = correct ? 8 : 0;

      request.log.info(
        { userId, itemId, correct, quality, hasSrsState: !!srsState },
        "record-quiz: starting"
      );

      try {
        await updateProgressInTransaction(
          userId,
          (d) => {
            d.quizzesDone += 1;
            d.quizTotal += 1;
            if (correct) d.quizCorrect += 1;
            d.minutes += 2;
            if (d.quizTotal > 0) {
              d.moduleScores.grammar = clamp(Math.round((d.quizCorrect / d.quizTotal) * 100));
            }
          },
          gainedExp,
          itemId
            ? async (tx) => {
                // upsert UserQuizReview（SM2 + 错题本）
                const reps = srsState?.repetitions ?? 0;
                const isMastered = correct && reps >= 3;
                const now = new Date();

                await tx.userQuizReview.upsert({
                  where: { userId_quizId: { userId, quizId: itemId } },
                  update: {
                    isMastered,
                    ...(!correct
                      ? { wrongCount: { increment: 1 }, lastWrongAt: now }
                      : {}),
                    ...(quality && srsState
                      ? {
                          easeFactor: srsState.easeFactor,
                          interval: srsState.interval,
                          repetitions: srsState.repetitions,
                          nextReviewAt: new Date(srsState.nextReviewAt),
                          lastReviewAt: now,
                        }
                      : {}),
                  },
                  create: {
                    userId,
                    quizId: itemId,
                    wrongCount: correct ? 0 : 1,
                    lastWrongAt: correct ? null : now,
                    isMastered,
                    easeFactor: srsState?.easeFactor ?? 2.5,
                    interval: srsState?.interval ?? 1,
                    repetitions: srsState?.repetitions ?? 0,
                    nextReviewAt: srsState ? new Date(srsState.nextReviewAt) : now,
                    lastReviewAt: quality ? now : null,
                  },
                });
              }
            : undefined
        );
      } catch (err: unknown) {
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 记录口语练习 ======
  fastify.post<{
    Body: {
      minutes: number;
      language: string;
      itemId?: string;
      score?: number;
    };
  }>(
    "/progress/record-speaking",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const minutes = Math.max(0, Number(request.body.minutes) || 0);
      const itemId = typeof request.body.itemId === "string" ? request.body.itemId : undefined;
      const score = typeof request.body.score === "number" ? Math.max(0, Math.min(100, Math.round(request.body.score))) : undefined;
      const gainedExp = minutes * 3;

      request.log.info({ userId, minutes, itemId, score }, "record-speaking");

      try {
        await updateProgressInTransaction(
          userId,
          (d) => {
            d.speakingMinutes += minutes;
            d.minutes += minutes;
            d.moduleScores.speaking = clamp(Math.round(d.moduleScores.speaking * 0.85 + minutes * 5));
          },
          gainedExp,
          // P1: 如果传了 itemId，upsert UserSpeakingProgress（per-item 跟读记录）
          itemId
            ? async (tx) => {
                const existing = await tx.userSpeakingProgress.findUnique({
                  where: { userId_speakingId: { userId, speakingId: itemId } },
                });

                const now = new Date();
                const attempts = (existing?.attempts ?? 0) + 1;
                const bestScore = Math.max(existing?.bestScore ?? 0, score ?? 0);
                const lastScore = score ?? existing?.lastScore ?? 0;
                const isCompleted = bestScore >= 60;

                // 构建分数历史（最多保留 50 条）
                const oldHistory = Array.isArray(existing?.scoreHistory)
                  ? (existing!.scoreHistory as { score: number; timestamp: string }[])
                  : [];
                const newEntry = score !== undefined ? [{ score, timestamp: now.toISOString() }] : [];
                const scoreHistory: Prisma.InputJsonValue = [...newEntry, ...oldHistory].slice(0, 50);

                await tx.userSpeakingProgress.upsert({
                  where: { userId_speakingId: { userId, speakingId: itemId } },
                  update: {
                    attempts,
                    bestScore,
                    lastScore,
                    isCompleted,
                    lastPracticedAt: now,
                    scoreHistory,
                  },
                  create: {
                    userId,
                    speakingId: itemId,
                    attempts,
                    bestScore,
                    lastScore,
                    isCompleted,
                    lastPracticedAt: now,
                    scoreHistory,
                  },
                });
              }
            : undefined
        );
      } catch (err: unknown) {
        request.log.error({ err, userId, itemId }, "record-speaking failed");
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 记录听力练习 ======
  fastify.post<{
    Body: {
      minutes: number;
      language: string;
      itemId?: string;
      blankResults?: { index: number; correct: boolean; userAnswer?: string }[];
      correctCount?: number;
      totalBlanks?: number;
    };
  }>(
    "/progress/record-listening",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const minutes = Math.max(0, Number(request.body.minutes) || 0);
      const itemId = typeof request.body.itemId === "string" ? request.body.itemId : undefined;
      const blankResults = Array.isArray(request.body.blankResults) ? request.body.blankResults : undefined;
      const correctCount = typeof request.body.correctCount === "number" ? request.body.correctCount : undefined;
      const totalBlanks = typeof request.body.totalBlanks === "number" ? request.body.totalBlanks : undefined;
      const gainedExp = minutes * 3;

      request.log.info({ userId, minutes, itemId, correctCount, totalBlanks }, "record-listening");

      try {
        await updateProgressInTransaction(
          userId,
          (d) => {
            d.listeningMinutes += minutes;
            d.minutes += minutes;
            d.moduleScores.listening = clamp(Math.round(d.moduleScores.listening * 0.85 + minutes * 5));
          },
          gainedExp,
          // P1: 如果传了 itemId，upsert UserListeningProgress（per-item 听力进度）
          itemId
            ? async (tx) => {
                const existing = await tx.userListeningProgress.findUnique({
                  where: { userId_listeningId: { userId, listeningId: itemId } },
                });

                const now = new Date();
                const attempts = (existing?.attempts ?? 0) + 1;
                const newAccuracy =
                  correctCount !== undefined && totalBlanks && totalBlanks > 0
                    ? Math.round((correctCount / totalBlanks) * 100)
                    : existing?.bestAccuracy ?? 0;
                const bestAccuracy = Math.max(existing?.bestAccuracy ?? 0, newAccuracy);
                const isCompleted = newAccuracy >= 60;

                await tx.userListeningProgress.upsert({
                  where: { userId_listeningId: { userId, listeningId: itemId } },
                  update: {
                    status: isCompleted ? "completed" : "in_progress",
                    blankResults: blankResults ?? existing?.blankResults ?? [],
                    correctCount: correctCount ?? existing?.correctCount ?? 0,
                    totalBlanks: totalBlanks ?? existing?.totalBlanks ?? 0,
                    attempts,
                    bestAccuracy,
                    completedAt: isCompleted ? (existing?.completedAt ?? now) : existing?.completedAt,
                    lastPracticedAt: now,
                  },
                  create: {
                    userId,
                    listeningId: itemId,
                    status: isCompleted ? "completed" : "in_progress",
                    blankResults: blankResults ?? [],
                    correctCount: correctCount ?? 0,
                    totalBlanks: totalBlanks ?? 0,
                    attempts,
                    bestAccuracy,
                    completedAt: isCompleted ? now : null,
                    lastPracticedAt: now,
                  },
                });
              }
            : undefined
        );
      } catch (err: unknown) {
        request.log.error({ err, userId, itemId }, "record-listening failed");
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 更新进度设置 ======
  fastify.patch<{
    Body: Partial<{ goalMinutesPerDay: number; targetLanguage: string }>;
  }>(
    "/progress/me",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const update: Record<string, unknown> = {};
      if (typeof request.body.goalMinutesPerDay === "number") {
        update.goalMinutesPerDay = Math.max(0, Math.floor(request.body.goalMinutesPerDay));
      }
      if (typeof request.body.targetLanguage === "string") {
        update.targetLanguage = request.body.targetLanguage;
      }

      if (Object.keys(update).length === 0) {
        return sendError(reply, "BAD_REQUEST", "没有提供更新字段");
      }

      await prisma.user.update({ where: { id: userId }, data: update });
      const updated = await aggregateProgress(userId);
      log.info(request, "progress updated", {
        userId,
        wordsLearned: updated.wordsLearned,
        streakDays: updated.streak,
      });
      return sendSuccess(reply, updated);
    }
  );
};

export default progressRoutes;
