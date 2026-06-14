import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";
import { addExpAndLevelUp, computeStreakFromLastActive } from "../lib/level";
import { clamp } from "../lib/utils";

interface ModuleScores {
  words: number;
  grammar: number;
  listening: number;
  speaking: number;
}

const defaultModuleScores: ModuleScores = { words: 0, grammar: 0, listening: 0, speaking: 0 };

const progressRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    await request.jwtVerify();
  };

  fastify.get(
    "/progress/me",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(404).send({ error: "User not found" });

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
      let totalMinutes = 0;
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
        totalMinutes += day.minutes;
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

      return reply.send({
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

  // Helper: ensure a progress day record exists for today, then run an update function
  async function ensureAndUpdate(
    userId: string,
    updater: (todayRecord: { moduleScores: ModuleScores; wordCorrect: number; wordTotal: number; quizCorrect: number; quizTotal: number; wordsLearned: number; quizzesDone: number; minutes: number; speakingMinutes: number; listeningMinutes: number }) => void
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    let day = await prisma.userProgressDay.findUnique({
      where: {
        userId_studyDate: { userId, studyDate: todayDate },
      },
    });

    if (!day) {
      day = await prisma.userProgressDay.create({
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

    await prisma.userProgressDay.update({
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

    return { streakUpdate };
  }

  fastify.post<{
    Body: { correct: boolean; language: string };
  }>(
    "/progress/record-word",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };
      const { correct } = request.body;

      const gainedExp = correct ? 5 : 0;
      let result;
      try {
        result = await ensureAndUpdate(userId, (d) => {
          d.wordTotal += 1;
          if (correct) {
            d.wordCorrect += 1;
            d.wordsLearned += 1;
          }
          d.minutes += 1;
          if (d.wordTotal > 0) {
            d.moduleScores.words = clamp(Math.round((d.wordCorrect / d.wordTotal) * 100));
          }
        });
      } catch (err: unknown) {
        return reply.status(404).send({ error: (err as Error).message });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(404).send({ error: "User not found" });

      const { level, exp } = addExpAndLevelUp(user.level, user.exp, gainedExp);
      await prisma.user.update({
        where: { id: userId },
        data: {
          level,
          exp,
          streak: result.streakUpdate.streak,
          lastActive: result.streakUpdate.lastActive,
        },
      });

      return reply.send(await aggregateProgress(userId));
    }
  );

  fastify.post<{
    Body: { correct: boolean; language: string };
  }>(
    "/progress/record-quiz",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };
      const { correct } = request.body;

      const gainedExp = correct ? 8 : 0;
      let result;
      try {
        result = await ensureAndUpdate(userId, (d) => {
          d.quizzesDone += 1;
          d.quizTotal += 1;
          if (correct) d.quizCorrect += 1;
          d.minutes += 2;
          if (d.quizTotal > 0) {
            d.moduleScores.grammar = clamp(Math.round((d.quizCorrect / d.quizTotal) * 100));
          }
        });
      } catch (err: unknown) {
        return reply.status(404).send({ error: (err as Error).message });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(404).send({ error: "User not found" });

      const { level, exp } = addExpAndLevelUp(user.level, user.exp, gainedExp);
      await prisma.user.update({
        where: { id: userId },
        data: {
          level,
          exp,
          streak: result.streakUpdate.streak,
          lastActive: result.streakUpdate.lastActive,
        },
      });

      return reply.send(await aggregateProgress(userId));
    }
  );

  fastify.post<{
    Body: { minutes: number; language: string };
  }>(
    "/progress/record-speaking",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };
      const minutes = Math.max(0, Number(request.body.minutes) || 0);
      const gainedExp = minutes * 3;

      let result;
      try {
        result = await ensureAndUpdate(userId, (d) => {
          d.speakingMinutes += minutes;
          d.minutes += minutes;
          d.moduleScores.speaking = clamp(Math.round(d.moduleScores.speaking * 0.85 + minutes * 5));
        });
      } catch (err: unknown) {
        return reply.status(404).send({ error: (err as Error).message });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(404).send({ error: "User not found" });

      const { level, exp } = addExpAndLevelUp(user.level, user.exp, gainedExp);
      await prisma.user.update({
        where: { id: userId },
        data: {
          level,
          exp,
          streak: result.streakUpdate.streak,
          lastActive: result.streakUpdate.lastActive,
        },
      });

      return reply.send(await aggregateProgress(userId));
    }
  );

  fastify.post<{
    Body: { minutes: number; language: string };
  }>(
    "/progress/record-listening",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };
      const minutes = Math.max(0, Number(request.body.minutes) || 0);
      const gainedExp = minutes * 3;

      let result;
      try {
        result = await ensureAndUpdate(userId, (d) => {
          d.listeningMinutes += minutes;
          d.minutes += minutes;
          d.moduleScores.listening = clamp(Math.round(d.moduleScores.listening * 0.85 + minutes * 5));
        });
      } catch (err: unknown) {
        return reply.status(404).send({ error: (err as Error).message });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(404).send({ error: "User not found" });

      const { level, exp } = addExpAndLevelUp(user.level, user.exp, gainedExp);
      await prisma.user.update({
        where: { id: userId },
        data: {
          level,
          exp,
          streak: result.streakUpdate.streak,
          lastActive: result.streakUpdate.lastActive,
        },
      });

      return reply.send(await aggregateProgress(userId));
    }
  );

  fastify.patch<{
    Body: Partial<{ goalMinutesPerDay: number; targetLanguage: string }>;
  }>(
    "/progress/me",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };
      const update: Record<string, unknown> = {};
      if (typeof request.body.goalMinutesPerDay === "number") {
        update.goalMinutesPerDay = Math.max(0, Math.floor(request.body.goalMinutesPerDay));
      }
      if (typeof request.body.targetLanguage === "string") {
        update.targetLanguage = request.body.targetLanguage;
      }

      if (Object.keys(update).length === 0) {
        return reply.status(400).send({ error: "没有提供更新字段" });
      }

      await prisma.user.update({ where: { id: userId }, data: update });
      return reply.send(await aggregateProgress(userId));
    }
  );
};

export default progressRoutes;
