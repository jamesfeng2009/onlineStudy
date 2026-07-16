import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { updateProgressInTransaction } from "../lib/progress.js";
import { sendSuccess, sendError } from "../lib/response.js";

type ReviewQuality = "again" | "hard" | "good" | "easy";

interface SrsStateInput {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string; // ISO timestamp
}

const userReviewsRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 获取当前用户的所有单词复习记录 ======
  fastify.get<{
    Querystring: { language?: string; due?: string };
  }>(
    "/user/word-reviews",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { language, due } = request.query;
      const dueOnly = due === "true" || due === "1";

      request.log.info({ userId, language, dueOnly }, "user/word-reviews: list");

      const where: Record<string, unknown> = { userId };
      if (language) {
        where.wordBank = { languageCode: language };
      }
      if (dueOnly) {
        where.nextReviewAt = { lte: new Date() };
      }

      const reviews = await prisma.userWordReview.findMany({
        where,
        orderBy: { nextReviewAt: "asc" },
        include: {
          wordBank: {
            select: {
              id: true,
              word: true,
              phonetic: true,
              languageCode: true,
              level: true,
              translations: { select: { baseLanguageCode: true, translation: true } },
            },
          },
        },
      });

      const result = reviews.map((r) => {
        const en = r.wordBank.translations.find((t) => t.baseLanguageCode === "en");
        const any = r.wordBank.translations[0];
        return {
          id: r.id,
          itemId: r.wordBankId,
          word: r.wordBank.word,
          translation: en?.translation ?? any?.translation ?? "",
          phonetic: r.wordBank.phonetic,
          language: r.wordBank.languageCode,
          level: r.wordBank.level,
          easeFactor: r.easeFactor,
          interval: r.interval,
          repetitions: r.repetitions,
          nextReviewAt: r.nextReviewAt,
          lastReviewAt: r.lastReviewAt,
          isLearned: r.isLearned,
          totalReviews: r.totalReviews,
          correctReviews: r.correctReviews,
        };
      });

      return sendSuccess(reply, result);
    }
  );

  // ====== 获取当前用户的所有测验复习记录 ======
  fastify.get<{
    Querystring: { language?: string; due?: string };
  }>(
    "/user/quiz-reviews",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { language, due } = request.query;
      const dueOnly = due === "true" || due === "1";

      request.log.info({ userId, language, dueOnly }, "user/quiz-reviews: list");

      const where: Record<string, unknown> = { userId };
      if (language) {
        where.quiz = { languageCode: language };
      }
      if (dueOnly) {
        where.nextReviewAt = { lte: new Date() };
      }

      const reviews = await prisma.userQuizReview.findMany({
        where,
        orderBy: { nextReviewAt: "asc" },
        include: {
          quiz: {
            select: {
              id: true,
              languageCode: true,
              level: true,
              options: true,
              answer: true,
              translations: { select: { baseLanguageCode: true, question: true, explain: true } },
            },
          },
        },
      });

      const result = reviews.map((r) => {
        const en = r.quiz.translations.find((t) => t.baseLanguageCode === "en");
        const any = r.quiz.translations[0];
        return {
          id: r.id,
          itemId: r.quizId,
          question: en?.question ?? any?.question ?? "",
          explain: en?.explain ?? any?.explain ?? "",
          options: r.quiz.options as string[],
          answer: r.quiz.answer,
          language: r.quiz.languageCode,
          level: r.quiz.level,
          easeFactor: r.easeFactor,
          interval: r.interval,
          repetitions: r.repetitions,
          nextReviewAt: r.nextReviewAt,
          lastReviewAt: r.lastReviewAt,
          wrongCount: r.wrongCount,
          lastWrongAt: r.lastWrongAt,
          isMastered: r.isMastered,
        };
      });

      return sendSuccess(reply, result);
    }
  );

  // ====== 提交单词复习结果 ======
  fastify.post<{
    Params: { wordBankId: string };
    Body: {
      quality: ReviewQuality;
      srsState: SrsStateInput;
    };
  }>(
    "/user/word-reviews/:wordBankId/review",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { wordBankId } = request.params;
      const { quality, srsState } = request.body;

      if (!quality || !srsState) {
        return sendError(reply, "BAD_REQUEST", "缺少 quality 或 srsState");
      }

      request.log.info(
        { userId, wordBankId, quality, repetitions: srsState.repetitions },
        "user/word-reviews: review submit"
      );

      const correct = quality !== "again";
      const isLearned = correct && srsState.repetitions >= 1;
      const now = new Date();
      const gainedExp = correct ? 5 : 0;

      // 在 updateProgressInTransaction 内部事务里 upsert UserWordReview
      await updateProgressInTransaction(
        userId,
        () => {
          // 聚合表由 record-word 路由更新；这里只算 XP
        },
        gainedExp,
        async (tx) => {
          await tx.userWordReview.upsert({
            where: { userId_wordBankId: { userId, wordBankId } },
            update: {
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              lastRating: quality,
              totalReviews: { increment: 1 },
              isLearned,
              ...(correct ? { correctReviews: { increment: 1 } } : {}),
            },
            create: {
              userId,
              wordBankId,
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              lastRating: quality,
              totalReviews: 1,
              correctReviews: correct ? 1 : 0,
              isLearned,
            },
          });
        }
      );

      const updated = await prisma.userWordReview.findUnique({
        where: { userId_wordBankId: { userId, wordBankId } },
      });

      return sendSuccess(reply, updated);
    }
  );

  // ====== 提交测验复习结果 ======
  fastify.post<{
    Params: { quizId: string };
    Body: {
      quality: ReviewQuality;
      srsState: SrsStateInput;
      correct?: boolean;
    };
  }>(
    "/user/quiz-reviews/:quizId/review",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { quizId } = request.params;
      const { quality, srsState, correct } = request.body;

      if (!quality || !srsState) {
        return sendError(reply, "BAD_REQUEST", "缺少 quality 或 srsState");
      }

      // 如果客户端没传 correct，从 quality 推断：again → 错，其它 → 对
      const isCorrect = typeof correct === "boolean" ? correct : quality !== "again";

      request.log.info(
        { userId, quizId, quality, isCorrect, repetitions: srsState.repetitions },
        "user/quiz-reviews: review submit"
      );

      const isMastered = isCorrect && srsState.repetitions >= 3;
      const now = new Date();
      const gainedExp = isCorrect ? 8 : 0;

      await updateProgressInTransaction(
        userId,
        () => {
          // 聚合表由 record-quiz 路由更新；这里只算 XP
        },
        gainedExp,
        async (tx) => {
          await tx.userQuizReview.upsert({
            where: { userId_quizId: { userId, quizId } },
            update: {
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              isMastered,
              ...(!isCorrect
                ? { wrongCount: { increment: 1 }, lastWrongAt: now }
                : {}),
            },
            create: {
              userId,
              quizId,
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              wrongCount: isCorrect ? 0 : 1,
              lastWrongAt: isCorrect ? null : now,
              isMastered,
            },
          });
        }
      );

      const updated = await prisma.userQuizReview.findUnique({
        where: { userId_quizId: { userId, quizId } },
      });

      return sendSuccess(reply, updated);
    }
  );

  // ====== P1-3: 列出听力复习队列 ======
  fastify.get<{
    Querystring: { language?: string; due?: string };
  }>(
    "/user/listening-reviews",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { language, due } = request.query;
      const dueOnly = due === "true" || due === "1";

      const where: Record<string, unknown> = { userId };
      if (language) where.listening = { languageCode: language };
      if (dueOnly) where.nextReviewAt = { lte: new Date() };

      const reviews = await prisma.userListeningReview.findMany({
        where,
        orderBy: { nextReviewAt: "asc" },
        include: {
          listening: {
            select: {
              id: true,
              languageCode: true,
              level: true,
              title: true,
              script: true,
              blanks: true,
              listenOrder: true,
            },
          },
        },
      });

      const result = reviews.map((r) => ({
        id: r.id,
        itemId: r.listeningId,
        title: r.listening.title,
        script: r.listening.script,
        blanks: r.listening.blanks,
        language: r.listening.languageCode,
        level: r.listening.level,
        easeFactor: r.easeFactor,
        interval: r.interval,
        repetitions: r.repetitions,
        nextReviewAt: r.nextReviewAt,
        lastReviewAt: r.lastReviewAt,
        lastRating: r.lastRating,
        lastAccuracy: r.lastAccuracy,
        totalReviews: r.totalReviews,
        goodReviews: r.goodReviews,
        isMastered: r.isMastered,
      }));

      return sendSuccess(reply, result);
    }
  );

  // ====== P1-3: 列出口语复习队列 ======
  fastify.get<{
    Querystring: { language?: string; due?: string };
  }>(
    "/user/speaking-reviews",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { language, due } = request.query;
      const dueOnly = due === "true" || due === "1";

      const where: Record<string, unknown> = { userId };
      if (language) where.speaking = { languageCode: language };
      if (dueOnly) where.nextReviewAt = { lte: new Date() };

      const reviews = await prisma.userSpeakingReview.findMany({
        where,
        orderBy: { nextReviewAt: "asc" },
        include: {
          speaking: {
            select: {
              id: true,
              languageCode: true,
              level: true,
              phrase: true,
              translation: true,
              phonetic: true,
              speakOrder: true,
            },
          },
        },
      });

      const result = reviews.map((r) => ({
        id: r.id,
        itemId: r.speakingId,
        phrase: r.speaking.phrase,
        translation: r.speaking.translation,
        phonetic: r.speaking.phonetic,
        language: r.speaking.languageCode,
        level: r.speaking.level,
        easeFactor: r.easeFactor,
        interval: r.interval,
        repetitions: r.repetitions,
        nextReviewAt: r.nextReviewAt,
        lastReviewAt: r.lastReviewAt,
        lastRating: r.lastRating,
        lastScore: r.lastScore,
        totalReviews: r.totalReviews,
        goodReviews: r.goodReviews,
        isMastered: r.isMastered,
      }));

      return sendSuccess(reply, result);
    }
  );

  // ====== P1-3: 提交听力复习 ======
  fastify.post<{
    Params: { listeningId: string };
    Body: {
      quality: ReviewQuality;
      srsState: SrsStateInput;
      accuracy?: number;     // 本次正确率 0-100
    };
  }>(
    "/user/listening-reviews/:listeningId/review",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { listeningId } = request.params;
      const { quality, srsState, accuracy } = request.body;

      if (!quality || !srsState) {
        return sendError(reply, "BAD_REQUEST", "缺少 quality 或 srsState");
      }

      const correct = quality !== "again";
      const isMastered = correct && srsState.repetitions >= 3;
      const now = new Date();
      const gainedExp = correct ? 8 : 0;
      const accuracyVal = typeof accuracy === "number" ? Math.max(0, Math.min(100, accuracy)) : 0;

      request.log.info(
        { userId, listeningId, quality, accuracy: accuracyVal, repetitions: srsState.repetitions },
        "user/listening-reviews: review submit"
      );

      await updateProgressInTransaction(
        userId,
        () => {},
        gainedExp,
        async (tx) => {
          await tx.userListeningReview.upsert({
            where: { userId_listeningId: { userId, listeningId } },
            update: {
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              lastRating: quality,
              lastAccuracy: accuracyVal,
              totalReviews: { increment: 1 },
              isMastered,
              ...(correct ? { goodReviews: { increment: 1 } } : {}),
            },
            create: {
              userId,
              listeningId,
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              lastRating: quality,
              lastAccuracy: accuracyVal,
              totalReviews: 1,
              goodReviews: correct ? 1 : 0,
              isMastered,
            },
          });
        }
      );

      const updated = await prisma.userListeningReview.findUnique({
        where: { userId_listeningId: { userId, listeningId } },
      });

      return sendSuccess(reply, updated);
    }
  );

  // ====== P1-3: 提交口语复习 ======
  fastify.post<{
    Params: { speakingId: string };
    Body: {
      quality: ReviewQuality;
      srsState: SrsStateInput;
      score?: number;        // 本次发音评分 0-100
    };
  }>(
    "/user/speaking-reviews/:speakingId/review",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { speakingId } = request.params;
      const { quality, srsState, score } = request.body;

      if (!quality || !srsState) {
        return sendError(reply, "BAD_REQUEST", "缺少 quality 或 srsState");
      }

      const correct = quality !== "again";
      const isMastered = correct && srsState.repetitions >= 3;
      const now = new Date();
      const gainedExp = correct ? 8 : 0;
      const scoreVal = typeof score === "number" ? Math.max(0, Math.min(100, score)) : 0;

      request.log.info(
        { userId, speakingId, quality, score: scoreVal, repetitions: srsState.repetitions },
        "user/speaking-reviews: review submit"
      );

      await updateProgressInTransaction(
        userId,
        () => {},
        gainedExp,
        async (tx) => {
          await tx.userSpeakingReview.upsert({
            where: { userId_speakingId: { userId, speakingId } },
            update: {
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              lastRating: quality,
              lastScore: scoreVal,
              totalReviews: { increment: 1 },
              isMastered,
              ...(correct ? { goodReviews: { increment: 1 } } : {}),
            },
            create: {
              userId,
              speakingId,
              easeFactor: srsState.easeFactor,
              interval: srsState.interval,
              repetitions: srsState.repetitions,
              nextReviewAt: new Date(srsState.nextReviewAt),
              lastReviewAt: now,
              lastRating: quality,
              lastScore: scoreVal,
              totalReviews: 1,
              goodReviews: correct ? 1 : 0,
              isMastered,
            },
          });
        }
      );

      const updated = await prisma.userSpeakingReview.findUnique({
        where: { userId_speakingId: { userId, speakingId } },
      });

      return sendSuccess(reply, updated);
    }
  );
};

export default userReviewsRoutes;
