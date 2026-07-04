/**
 * 共享的学习进度辅助函数。
 *
 * `updateProgressInTransaction` 把"读 day 聚合表 → 调用方更新 draft →
 * 可选 per-item upsert → 写回 day 聚合表 + user 等级/经验/streak"
 * 封装成一个事务，避免 record-word / record-quiz / user-reviews 路由各自重复实现。
 *
 * `aggregateProgress` 把所有 day 行汇总成给前端展示的总览。
 */
import { prisma } from "./prisma.js";
import type { TransactionClient } from "./prisma.js";
import { addExpAndLevelUp, computeStreakFromLastActive } from "./level.js";
import { clamp } from "./utils.js";

export interface ModuleScores {
  [key: string]: number;
  words: number;
  grammar: number;
  listening: number;
  speaking: number;
}

export const defaultModuleScores: ModuleScores = {
  words: 0,
  grammar: 0,
  listening: 0,
  speaking: 0,
};

export interface ProgressDraft {
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
}

/**
 * 事务内更新进度（幂等 + 事务）。
 *
 * - `updater` 回调只负责修改 day 聚合表的 draft；
 * - `extraTx`（可选）在 draft 修改完之后、day 表写回之前调用，
 *   让调用方在同一事务里 upsert per-item 表（如 UserWordReview / UserQuizReview）。
 */
export async function updateProgressInTransaction(
  userId: string,
  updater: (draft: ProgressDraft) => void,
  gainedExp: number,
  extraTx?: (tx: TransactionClient) => Promise<void>
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

    const draft: ProgressDraft = {
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

    // 在 day 聚合表写入之前，让调用方执行额外的 per-item upsert（同一事务）
    if (extraTx) {
      await extraTx(tx);
    }

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

/**
 * 把所有 day 行汇总成给前端展示的总览。
 */
export async function aggregateProgress(userId: string) {
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

export { clamp };
