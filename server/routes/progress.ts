import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { addExpAndLevelUp, computeStreakFromLastActive } from "../lib/level.js";
import { clamp } from "../lib/utils.js";
import { sendSuccess, sendError } from "../lib/response.js";

interface ModuleScores {
  [key: string]: number;
  words: number;
  grammar: number;
  listening: number;
  speaking: number;
}

const defaultModuleScores: ModuleScores = { words: 0, grammar: 0, listening: 0, speaking: 0 };

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

  // ====== 辅助函数：聚合进度数据 ======
  async function aggregateProgress(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

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
          words: typeof s.words === "number" ? s.words : 0,
          grammar: typeof s.grammar === "number" ? s.grammar : 0,
          listening: typeof s.listening === "number" ? s.listening : 0,
          speaking: typeof s.speaking === "number" ? s.speaking : 0,
        };
      }
    }

    return {
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
    };
  }

  // ====== 事务内更新进度（幂等 + 事务） ======
  async function updateProgressInTransaction(
    userId: string,
    updater: (draft: {
      moduleScores: ModuleScores;
      wordCorrect: number;
      wordTotal: number;
      quizCorrect: number;
      quizTotal: number;
      wordsLearned: number;
      quizzesDone: number;
      minutes: number;
      speakingMinutes: number;
      listeningMinutes: number;
    }) => void,
    gainedExp: number
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      let day = await tx.userProgressDay.findUnique({
        where: { userId_studyDate: { userId, studyDate: todayDate } },
      });

      if (!day) {
        day = await tx.userProgressDay.create({
          data: {
            userId,
            studyDate: todayDate,
            moduleScores: defaultModuleScores,
          },
        });
      }

      const moduleScoresRaw = (day.moduleScores as unknown as Partial<ModuleScores>) ?? defaultModuleScores;
      const moduleScores: ModuleScores = {
        words: typeof moduleScoresRaw.words === "number" ? moduleScoresRaw.words : 0,
        grammar: typeof moduleScoresRaw.grammar === "number" ? moduleScoresRaw.grammar : 0,
        listening: typeof moduleScoresRaw.listening === "number" ? moduleScoresRaw.listening : 0,
        speaking: typeof moduleScoresRaw.speaking === "number" ? moduleScoresRaw.speaking : 0,
      };

      const draft = {
        moduleScores,
        wordCorrect: day.wordCorrect,
        wordTotal: day.wordTotal,
        quizCorrect: day.quizCorrect,
        quizTotal: day.quizTotal,
        wordsLearned: day.wordsLearned,
        quizzesDone: day.quizzesDone,
        minutes: day.minutes,
        speakingMinutes: day.speakingMinutes,
        listeningMinutes: day.listeningMinutes,
      };

      updater(draft);

      const streakUpdate = computeStreakFromLastActive(user.lastActive, user.streak);
      const { level, exp } = addExpAndLevelUp(user.level, user.exp, gainedExp);

      await tx.userProgressDay.update({
        where: { id: day.id },
        data: {
          moduleScores: draft.moduleScores,
          wordCorrect: draft.wordCorrect,
          wordTotal: draft.wordTotal,
          quizCorrect: draft.quizCorrect,
          quizTotal: draft.quizTotal,
          wordsLearned: draft.wordsLearned,
          quizzesDone: draft.quizzesDone,
          minutes: draft.minutes,
          speakingMinutes: draft.speakingMinutes,
          listeningMinutes: draft.listeningMinutes,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          level,
          exp,
          streak: streakUpdate.streak,
          lastActive: streakUpdate.lastActive,
        },
      });

      return { streakUpdate };
    });
  }

  // ====== 记录单词练习 ======
  fastify.post<{
    Body: { correct: boolean; language: string };
  }>(
    "/progress/record-word",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { correct } = request.body;

      const gainedExp = correct ? 5 : 0;

      try {
        await updateProgressInTransaction(userId, (d) => {
          d.wordTotal += 1;
          if (correct) {
            d.wordCorrect += 1;
            d.wordsLearned += 1;
          }
          d.minutes += 1;
          if (d.wordTotal > 0) {
            d.moduleScores.words = clamp(Math.round((d.wordCorrect / d.wordTotal) * 100));
          }
        }, gainedExp);
      } catch (err: unknown) {
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 记录测验练习 ======
  fastify.post<{
    Body: { correct: boolean; language: string };
  }>(
    "/progress/record-quiz",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { correct } = request.body;

      const gainedExp = correct ? 8 : 0;

      try {
        await updateProgressInTransaction(userId, (d) => {
          d.quizzesDone += 1;
          d.quizTotal += 1;
          if (correct) d.quizCorrect += 1;
          d.minutes += 2;
          if (d.quizTotal > 0) {
            d.moduleScores.grammar = clamp(Math.round((d.quizCorrect / d.quizTotal) * 100));
          }
        }, gainedExp);
      } catch (err: unknown) {
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 记录口语练习 ======
  fastify.post<{
    Body: { minutes: number; language: string };
  }>(
    "/progress/record-speaking",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const minutes = Math.max(0, Number(request.body.minutes) || 0);
      const gainedExp = minutes * 3;

      try {
        await updateProgressInTransaction(userId, (d) => {
          d.speakingMinutes += minutes;
          d.minutes += minutes;
          d.moduleScores.speaking = clamp(Math.round(d.moduleScores.speaking * 0.85 + minutes * 5));
        }, gainedExp);
      } catch (err: unknown) {
        return sendError(reply, "NOT_FOUND", (err as Error).message);
      }

      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );

  // ====== 记录听力练习 ======
  fastify.post<{
    Body: { minutes: number; language: string };
  }>(
    "/progress/record-listening",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const minutes = Math.max(0, Number(request.body.minutes) || 0);
      const gainedExp = minutes * 3;

      try {
        await updateProgressInTransaction(userId, (d) => {
          d.listeningMinutes += minutes;
          d.minutes += minutes;
          d.moduleScores.listening = clamp(Math.round(d.moduleScores.listening * 0.85 + minutes * 5));
        }, gainedExp);
      } catch (err: unknown) {
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
      return sendSuccess(reply, await aggregateProgress(userId));
    }
  );
};

export default progressRoutes;
