/**
 * P0-1: Seed Unit + Lesson entities for every Course.
 *
 * Before this script, `Course.lessons` was just an integer count — there
 * was no Lesson row, no Unit grouping, no unlock graph. This script
 * derives a Course → Unit → Lesson hierarchy from the static COURSES
 * array and fills each Lesson.exerciseIds with real WordBank / Quiz /
 * Listening / Speaking ids pulled from the DB (matched by
 * languageCode + level).
 *
 * Hierarchy rules:
 *   - Each course is split into N units of ~5 lessons each
 *     (last unit absorbs the remainder).
 *   - Lessons rotate through skillType: vocab → grammar → listening →
 *     speaking, so a unit touches all four skills.
 *   - The LAST lesson of the LAST unit is a checkpoint (isCheckpoint
 *     = true, skillType = "mixed", pulls from all four pools).
 *   - Each lesson's `requiresLessonId` points to the previous lesson in
 *     the course, forming a linear unlock chain. The first lesson has
 *     no prerequisite (null) so it is unlocked by default.
 *
 * Idempotency:
 *   - Stable ids: `unit-{courseId}-{n}` and `lesson-{courseId}-{u}-{n}`.
 *   - All writes use upsert, so re-running after adding more content
 *     refreshes exerciseIds in place.
 *
 * Prerequisites:
 *   1. migration 013_add_lesson_hierarchy applied to DB
 *   2. prisma generate (picks up Unit / Lesson / UserLessonProgress)
 *   3. For ko: run `pnpm tsx scripts/migrate-ko-levels.ts --apply`
 *      first, so WordBank/Quiz/etc level = TOPIK1/3/5 (matches
 *      courses.ts which now uses TOPIK codes for ko).
 *
 * Run:
 *   pnpm tsx scripts/seed-lessons.ts
 */

import { PrismaClient } from "../server/lib/prisma-generated/client/index.js";
import { COURSES } from "../src/data/courses";

const prisma = new PrismaClient();

/** Lessons per unit. Last unit absorbs the remainder so the total
 *  always equals `course.lessons`. */
const LESSONS_PER_UNIT = 5;

/** Exercises to attach to each lesson. Bounded so the lesson player
 *  response stays small. */
const EXERCISES_PER_LESSON = 8;

type SkillType = "vocab" | "grammar" | "listening" | "speaking";

interface SkillSlot {
  skillType: SkillType;
  source: "wordBank" | "quiz" | "listening" | "speaking";
}

/** Rotates through the four core skills so every unit touches each. */
const SKILL_ROTATION: SkillSlot[] = [
  { skillType: "vocab", source: "wordBank" },
  { skillType: "grammar", source: "quiz" },
  { skillType: "listening", source: "listening" },
  { skillType: "speaking", source: "speaking" },
];

interface ExercisePools {
  wordBank: string[];
  quiz: string[];
  listening: string[];
  speaking: string[];
}

async function fetchExercisePools(
  languageCode: string,
  level: string
): Promise<ExercisePools> {
  const [words, quizzes, listenings, speakings] = await Promise.all([
    prisma.wordBank.findMany({
      where: { languageCode, level },
      orderBy: [{ vocabOrder: "asc" }, { id: "asc" }],
      take: 60,
      select: { id: true },
    }),
    prisma.quiz.findMany({
      where: { languageCode, level },
      orderBy: [{ quizOrder: "asc" }, { id: "asc" }],
      take: 60,
      select: { id: true },
    }),
    prisma.listening.findMany({
      where: { languageCode, level },
      orderBy: [{ listenOrder: "asc" }, { id: "asc" }],
      take: 60,
      select: { id: true },
    }),
    prisma.speaking.findMany({
      where: { languageCode, level },
      orderBy: [{ speakOrder: "asc" }, { id: "asc" }],
      take: 60,
      select: { id: true },
    }),
  ]);

  return {
    wordBank: words.map((w) => w.id),
    quiz: quizzes.map((q) => q.id),
    listening: listenings.map((l) => l.id),
    speaking: speakings.map((s) => s.id),
  };
}

/** Round-robin pick `count` ids from `pool`. If the pool is smaller
 *  than `count`, cycles so the lesson still has exercises. Returns []
 *  when the pool is empty (lesson is created with no exercises; re-run
 *  after seeding more content to fill them in). */
function pickExercises(pool: string[], count: number): string[] {
  if (pool.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[i % pool.length]);
  }
  return Array.from(new Set(out));
}

/** Human-readable title for a skill lesson. */
function skillTitle(skillType: SkillType, idx: number): string {
  switch (skillType) {
    case "vocab":
      return `词汇 ${idx}`;
    case "grammar":
      return `语法 ${idx}`;
    case "listening":
      return `听力 ${idx}`;
    case "speaking":
      return `口语 ${idx}`;
  }
}

async function seedCourse(course: (typeof COURSES)[number]): Promise<{
  units: number;
  lessons: number;
  exercises: number;
}> {
  const pools = await fetchExercisePools(course.language, course.level);
  const totalLessons = Math.max(1, course.lessons);
  const totalUnits = Math.max(1, Math.ceil(totalLessons / LESSONS_PER_UNIT));

  let prevLessonId: string | null = null;
  let globalIdx = 0;
  let exerciseTotal = 0;

  for (let unitIdx = 0; unitIdx < totalUnits; unitIdx++) {
    const unitNumber = unitIdx + 1;
    const unitId = `unit-${course.id}-${unitNumber}`;
    const lessonsInUnit = Math.min(
      LESSONS_PER_UNIT,
      totalLessons - unitIdx * LESSONS_PER_UNIT
    );
    const isLastUnit = unitIdx === totalUnits - 1;

    await prisma.unit.upsert({
      where: { id: unitId },
      update: {
        courseId: course.id,
        title: `Unit ${unitNumber}`,
        description: `共 ${totalUnits} 单元 · ${course.title}`,
        unitOrder: unitNumber,
        skillFocus: "mixed",
      },
      create: {
        id: unitId,
        courseId: course.id,
        title: `Unit ${unitNumber}`,
        description: `共 ${totalUnits} 单元 · ${course.title}`,
        unitOrder: unitNumber,
        skillFocus: "mixed",
      },
    });

    for (let lessonInUnit = 0; lessonInUnit < lessonsInUnit; lessonInUnit++) {
      globalIdx++;
      const lessonNumber = lessonInUnit + 1;
      const lessonId = `lesson-${course.id}-${unitNumber}-${lessonNumber}`;
      const isLastLesson = isLastUnit && lessonInUnit === lessonsInUnit - 1;
      const slot = SKILL_ROTATION[(globalIdx - 1) % SKILL_ROTATION.length];

      let exerciseIds: string[];
      let skillType: SkillType | "mixed";

      if (isLastLesson) {
        // Checkpoint: pull a few from every pool so the final test
        // covers all four skills.
        const perSkill = Math.max(2, Math.floor(EXERCISES_PER_LESSON / 4));
        exerciseIds = [
          ...pickExercises(pools.wordBank, perSkill),
          ...pickExercises(pools.quiz, perSkill),
          ...pickExercises(pools.listening, perSkill),
          ...pickExercises(pools.speaking, perSkill),
        ];
        skillType = "mixed";
      } else {
        exerciseIds = pickExercises(
          pools[slot.source],
          EXERCISES_PER_LESSON
        );
        skillType = slot.skillType;
      }

      exerciseTotal += exerciseIds.length;

      const title = isLastLesson
        ? `通关测验 · Unit ${unitNumber}`
        : `Lesson ${globalIdx} · ${skillTitle(slot.skillType, globalIdx)}`;

      await prisma.lesson.upsert({
        where: { id: lessonId },
        update: {
          unitId,
          title,
          lessonOrder: lessonNumber,
          skillType,
          exerciseIds,
          durationMin: isLastLesson ? 10 : 5,
          isCheckpoint: isLastLesson,
          requiresLessonId: prevLessonId,
        },
        create: {
          id: lessonId,
          unitId,
          title,
          lessonOrder: lessonNumber,
          skillType,
          exerciseIds,
          durationMin: isLastLesson ? 10 : 5,
          isCheckpoint: isLastLesson,
          requiresLessonId: prevLessonId,
        },
      });

      prevLessonId = lessonId;
    }
  }

  return { units: totalUnits, lessons: totalLessons, exercises: exerciseTotal };
}

async function main() {
  console.log("=".repeat(60));
  console.log("  P0-1: Seed Units + Lessons");
  console.log("=".repeat(60));

  let totalUnits = 0;
  let totalLessons = 0;
  let totalExercises = 0;
  let coursesWithoutExercises = 0;

  for (const course of COURSES) {
    const result = await seedCourse(course);
    totalUnits += result.units;
    totalLessons += result.lessons;
    totalExercises += result.exercises;
    if (result.exercises === 0) coursesWithoutExercises++;
    console.log(
      `  ✓ ${course.id.padEnd(22)} units=${result.units} lessons=${result.lessons} exercises=${result.exercises}`
    );
  }

  console.log("=".repeat(60));
  console.log(
    `  Done: ${COURSES.length} courses · ${totalUnits} units · ${totalLessons} lessons · ${totalExercises} exercise refs`
  );
  if (coursesWithoutExercises > 0) {
    console.log(
      `  ⚠ ${coursesWithoutExercises} course(s) had no matching exercises in DB.`
    );
    console.log(
      `    Run scripts/seed-listening-speaking.ts and the content generators, then re-run this script.`
    );
  }
  console.log("=".repeat(60));
}

main()
  .catch((err) => {
    console.error("seed-lessons failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
