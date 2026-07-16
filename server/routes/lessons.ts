/**
 * P0-1: Lesson hierarchy API.
 *
 *   GET  /courses/:courseId/units          list units + lessons (+ derived status)
 *   GET  /lessons/:lessonId                lesson detail + resolved exercises
 *   POST /lessons/:lessonId/start          mark in_progress (auth)
 *   POST /lessons/:lessonId/complete       mark completed + unlock next (auth)
 *
 * Status derivation (no UserLessonProgress row yet):
 *   - requiresLessonId === null → "unlocked"  (first lesson of a course)
 *   - requiresLessonId set, prerequisite row status === "completed" → "unlocked"
 *   - otherwise → "locked"
 * Once a row exists, its `status` field is authoritative.
 */
import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

type LessonStatus = "locked" | "unlocked" | "in_progress" | "completed";

interface ProgressRow {
  lessonId: string;
  status: string;
  bestScore: number | null;
  attemptCount: number;
}

/** Resolve translation for a WordBank row, preferring the user's
 *  nativeLanguage, falling back to English, then any. */
function pickWordTranslation(
  translations: { baseLanguageCode: string; translation: string; exampleTranslation: string | null }[],
  nativeLanguage: string
): { translation: string; exampleTranslation: string | null } {
  const exact = translations.find((t) => t.baseLanguageCode === nativeLanguage);
  if (exact) return { translation: exact.translation, exampleTranslation: exact.exampleTranslation };
  const en = translations.find((t) => t.baseLanguageCode === "en");
  if (en) return { translation: en.translation, exampleTranslation: en.exampleTranslation };
  const any = translations[0];
  if (any) return { translation: any.translation, exampleTranslation: any.exampleTranslation };
  return { translation: "", exampleTranslation: null };
}

/** Resolve translation for a Quiz row. */
function pickQuizTranslation(
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

/** Derive effective status for a lesson given the user's progress map.
 *  If a progress row exists, use its status. Otherwise infer from the
 *  prerequisite chain: null prerequisite → unlocked; prerequisite
 *  completed → unlocked; else locked. */
function deriveStatus(
  lesson: { id: string; requiresLessonId: string | null },
  progressByLessonId: Map<string, ProgressRow>
): LessonStatus {
  const row = progressByLessonId.get(lesson.id);
  if (row) return row.status as LessonStatus;
  if (!lesson.requiresLessonId) return "unlocked";
  const prereq = progressByLessonId.get(lesson.requiresLessonId);
  if (prereq && prereq.status === "completed") return "unlocked";
  return "locked";
}

const lessonsRoutes: FastifyPluginAsync = async (fastify) => {
  // ============================================================
  // GET /courses/:courseId/units — unit + lesson tree
  // ============================================================
  fastify.get<{ Params: { courseId: string } }>(
    "/courses/:courseId/units",
    async (request, reply) => {
      const { courseId } = request.params;

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, languageCode: true, level: true, title: true, lessons: true },
      });
      if (!course) {
        return sendError(reply, "NOT_FOUND", "课程不存在");
      }

      const units = await prisma.unit.findMany({
        where: { courseId },
        orderBy: { unitOrder: "asc" },
        include: {
          lessons: {
            orderBy: { lessonOrder: "asc" },
            select: {
              id: true,
              title: true,
              lessonOrder: true,
              skillType: true,
              durationMin: true,
              isCheckpoint: true,
              requiresLessonId: true,
            },
          },
        },
      });

      // If the request is authenticated, pull the user's progress rows
      // for every lesson in this course so we can derive status.
      let progressByLessonId = new Map<string, ProgressRow>();
      let userId: string | undefined;
      try {
        await request.jwtVerify();
        userId = (request.user as { userId?: string })?.userId;
      } catch {
        // unauthenticated — leave progress map empty; all lessons
        // derive status from the prerequisite chain only.
      }

      if (userId) {
        const lessonIds = units.flatMap((u) => u.lessons.map((l) => l.id));
        if (lessonIds.length > 0) {
          const rows = await prisma.userLessonProgress.findMany({
            where: { userId, lessonId: { in: lessonIds } },
            select: { lessonId: true, status: true, bestScore: true, attemptCount: true },
          });
          progressByLessonId = new Map(
            rows.map((r) => [
              r.lessonId,
              {
                lessonId: r.lessonId,
                status: r.status,
                bestScore: r.bestScore,
                attemptCount: r.attemptCount,
              },
            ])
          );
        }
      }

      const result = units.map((u) => ({
        id: u.id,
        title: u.title,
        description: u.description,
        unitOrder: u.unitOrder,
        skillFocus: u.skillFocus,
        lessons: u.lessons.map((l) => {
          const status = deriveStatus(l, progressByLessonId);
          const row = progressByLessonId.get(l.id);
          return {
            id: l.id,
            title: l.title,
            lessonOrder: l.lessonOrder,
            skillType: l.skillType,
            durationMin: l.durationMin,
            isCheckpoint: l.isCheckpoint,
            requiresLessonId: l.requiresLessonId,
            status,
            bestScore: row?.bestScore ?? null,
            attemptCount: row?.attemptCount ?? 0,
          };
        }),
      }));

      return sendSuccess(reply, {
        course: {
          id: course.id,
          title: course.title,
          language: course.languageCode,
          level: course.level,
          totalLessons: course.lessons,
        },
        units: result,
      });
    }
  );

  // ============================================================
  // GET /lessons/:lessonId — lesson detail + resolved exercises
  // ============================================================
  fastify.get<{ Params: { lessonId: string } }>(
    "/lessons/:lessonId",
    async (request, reply) => {
      const { lessonId } = request.params;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          unit: { select: { courseId: true, unitOrder: true, title: true } },
        },
      });
      if (!lesson) {
        return sendError(reply, "NOT_FOUND", "课时不存在");
      }

      const exerciseIds = (lesson.exerciseIds as unknown as string[]) ?? [];

      // Resolve exercises grouped by type. Each id is looked up in
      // the matching table; ids that don't exist are silently dropped
      // (they may reference content that was deleted).
      const course = await prisma.course.findUnique({
        where: { id: lesson.unit.courseId },
        select: { languageCode: true, level: true },
      });
      const nativeLanguage = "en"; // default; auth-aware native lang resolution is a follow-up

      const [words, quizzes, listenings, speakings] = await Promise.all([
        prisma.wordBank.findMany({
          where: { id: { in: exerciseIds } },
          select: {
            id: true, languageCode: true, level: true, word: true,
            phonetic: true, exampleSentence: true,
            translations: {
              select: { baseLanguageCode: true, translation: true, exampleTranslation: true },
            },
          },
        }),
        prisma.quiz.findMany({
          where: { id: { in: exerciseIds } },
          select: {
            id: true, languageCode: true, level: true, options: true, answer: true,
            translations: {
              select: { baseLanguageCode: true, question: true, explain: true },
            },
          },
        }),
        prisma.listening.findMany({
          where: { id: { in: exerciseIds } },
          select: { id: true, languageCode: true, level: true, title: true, script: true, blanks: true },
        }),
        prisma.speaking.findMany({
          where: { id: { in: exerciseIds } },
          select: { id: true, languageCode: true, level: true, phrase: true, translation: true, phonetic: true },
        }),
      ]);

      const resolvedWords = words.map((w) => {
        const t = pickWordTranslation(w.translations, nativeLanguage);
        return {
          id: w.id, language: w.languageCode, level: w.level,
          word: w.word, phonetic: w.phonetic,
          translation: t.translation,
          exampleTranslation: t.exampleTranslation,
          exampleSentence: w.exampleSentence,
        };
      });
      const resolvedQuizzes = quizzes.map((q) => {
        const t = pickQuizTranslation(q.translations, nativeLanguage);
        return {
          id: q.id, language: q.languageCode, level: q.level,
          question: t.question, options: q.options as string[],
          answer: q.answer, explain: t.explain,
        };
      });

      // Derive status for this single lesson (auth-aware).
      let status: LessonStatus = lesson.requiresLessonId ? "locked" : "unlocked";
      let bestScore: number | null = null;
      let attemptCount = 0;
      try {
        await request.jwtVerify();
        const userId = (request.user as { userId?: string })?.userId;
        if (userId) {
          const row = await prisma.userLessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
            select: { status: true, bestScore: true, attemptCount: true },
          });
          if (row) {
            status = row.status as LessonStatus;
            bestScore = row.bestScore;
            attemptCount = row.attemptCount;
          } else {
            // No row yet — check prerequisite completion.
            if (lesson.requiresLessonId) {
              const prereq = await prisma.userLessonProgress.findUnique({
                where: { userId_lessonId: { userId, lessonId: lesson.requiresLessonId } },
                select: { status: true },
              });
              status = prereq?.status === "completed" ? "unlocked" : "locked";
            }
          }
        }
      } catch {
        // unauthenticated — keep derived default
      }

      return sendSuccess(reply, {
        id: lesson.id,
        title: lesson.title,
        skillType: lesson.skillType,
        durationMin: lesson.durationMin,
        isCheckpoint: lesson.isCheckpoint,
        requiresLessonId: lesson.requiresLessonId,
        unit: lesson.unit,
        course: course
          ? { language: course.languageCode, level: course.level }
          : null,
        status,
        bestScore,
        attemptCount,
        exerciseIds,
        exercises: {
          words: resolvedWords,
          quizzes: resolvedQuizzes,
          listenings: listenings.map((l) => ({
            id: l.id, language: l.languageCode, level: l.level,
            title: l.title, script: l.script, blanks: l.blanks,
          })),
          speakings: speakings.map((s) => ({
            id: s.id, language: s.languageCode, level: s.level,
            phrase: s.phrase, translation: s.translation, phonetic: s.phonetic,
          })),
        },
      });
    }
  );

  // ============================================================
  // POST /lessons/:lessonId/start — mark in_progress
  // ============================================================
  fastify.post<{ Params: { lessonId: string } }>(
    "/lessons/:lessonId/start",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.userId;
      const { lessonId } = request.params;

      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) {
        return sendError(reply, "NOT_FOUND", "课时不存在");
      }

      // Prerequisite gate: if this lesson requires another, that one
      // must be completed before the user can start.
      if (lesson.requiresLessonId) {
        const prereq = await prisma.userLessonProgress.findUnique({
          where: { userId_lessonId: { userId, lessonId: lesson.requiresLessonId } },
          select: { status: true },
        });
        if (prereq?.status !== "completed") {
          return sendError(reply, "BAD_REQUEST", "前置课时尚未完成，无法开始");
        }
      }

      const now = new Date();
      const existing = await prisma.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });

      const row = await prisma.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: {
          status: "in_progress",
          startedAt: existing?.startedAt ?? now,
          attemptCount: (existing?.attemptCount ?? 0) + 1,
          updatedAt: now,
        },
        create: {
          userId,
          lessonId,
          status: "in_progress",
          startedAt: now,
          attemptCount: 1,
          updatedAt: now,
        },
      });

      return sendSuccess(reply, {
        lessonId,
        status: row.status,
        attemptCount: row.attemptCount,
        startedAt: row.startedAt,
      });
    }
  );

  // ============================================================
  // POST /lessons/:lessonId/complete — mark completed + unlock next
  // ============================================================
  fastify.post<{
    Params: { lessonId: string };
    Body: { score?: number };
  }>(
    "/lessons/:lessonId/complete",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.userId;
      const { lessonId } = request.params;
      const { score } = request.body ?? {};

      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) {
        return sendError(reply, "NOT_FOUND", "课时不存在");
      }

      const now = new Date();
      const existing = await prisma.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });

      // bestScore = max(prev, score). For non-checkpoint lessons
      // score is undefined → bestScore stays null.
      const prevBest = existing?.bestScore ?? null;
      const nextBest =
        typeof score === "number"
          ? prevBest === null
            ? score
            : Math.max(prevBest, score)
          : prevBest;

      const row = await prisma.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: {
          status: "completed",
          completedAt: now,
          bestScore: nextBest,
          startedAt: existing?.startedAt ?? now,
          attemptCount: existing?.attemptCount ?? 1,
          updatedAt: now,
        },
        create: {
          userId,
          lessonId,
          status: "completed",
          startedAt: now,
          completedAt: now,
          bestScore: nextBest,
          attemptCount: 1,
          updatedAt: now,
        },
      });

      // Find the next lesson in the chain (the one whose
      // requiresLessonId points at this lesson) and auto-unlock it
      // by creating a progress row with status="unlocked" if none
      // exists yet. This makes the next lesson appear as "可开始" in
      // the path UI without the user having to click it first.
      let unlockedLessonId: string | null = null;
      const next = await prisma.lesson.findFirst({
        where: { requiresLessonId: lessonId },
        select: { id: true },
      });
      if (next) {
        unlockedLessonId = next.id;
        const nextExisting = await prisma.userLessonProgress.findUnique({
          where: { userId_lessonId: { userId, lessonId: next.id } },
        });
        if (!nextExisting) {
          await prisma.userLessonProgress.create({
            data: {
              userId,
              lessonId: next.id,
              status: "unlocked",
              updatedAt: now,
            },
          });
        } else if (nextExisting.status === "locked") {
          await prisma.userLessonProgress.update({
            where: { userId_lessonId: { userId, lessonId: next.id } },
            data: { status: "unlocked", updatedAt: now },
          });
        }
      }

      return sendSuccess(reply, {
        lessonId,
        status: row.status,
        bestScore: row.bestScore,
        attemptCount: row.attemptCount,
        completedAt: row.completedAt,
        unlockedLessonId,
      });
    }
  );

  // ============================================================
  // P1-4: GET /courses/:courseId/crowns — Crown progress
  //
  // Crown = a checkpoint lesson (isCheckpoint=true) the user has
  // completed with bestScore >= 60 (passing threshold). Returns:
  //   { crowns, totalCheckpoints, passedCheckpoints: [{lessonId,title,bestScore}] }
  // ============================================================
  fastify.get<{
    Params: { courseId: string };
  }>(
    "/courses/:courseId/crowns",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.userId;
      const { courseId } = request.params;

      // All checkpoint lessons in the course (via Unit → Lesson chain)
      const checkpoints = await prisma.lesson.findMany({
        where: {
          isCheckpoint: true,
          unit: { courseId },
        },
        select: {
          id: true,
          title: true,
          lessonOrder: true,
          unit: { select: { unitOrder: true, title: true } },
        },
        orderBy: [{ unit: { unitOrder: "asc" } }, { lessonOrder: "asc" }],
      });

      const checkpointIds = checkpoints.map((c) => c.id);

      const progress = checkpointIds.length
        ? await prisma.userLessonProgress.findMany({
            where: {
              userId,
              lessonId: { in: checkpointIds },
              status: "completed",
            },
            select: { lessonId: true, bestScore: true, completedAt: true },
          })
        : [];

      const progressMap = new Map(progress.map((p) => [p.lessonId, p]));
      const PASS_THRESHOLD = 60;

      const passedCheckpoints = checkpoints
        .map((c) => {
          const prog = progressMap.get(c.id);
          const bestScore = prog?.bestScore ?? null;
          const passed = prog !== undefined && bestScore !== null && bestScore >= PASS_THRESHOLD;
          return {
            lessonId: c.id,
            title: c.title,
            unitTitle: c.unit.title,
            bestScore,
            passed,
            completedAt: prog?.completedAt ?? null,
          };
        })
        .filter((c) => c.passed);

      return sendSuccess(reply, {
        crowns: passedCheckpoints.length,
        totalCheckpoints: checkpoints.length,
        passThreshold: PASS_THRESHOLD,
        passedCheckpoints,
      });
    }
  );
};

export default lessonsRoutes;
