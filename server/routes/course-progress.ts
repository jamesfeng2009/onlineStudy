import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { sendSuccess, sendError } from "../lib/response.js";

type CourseAction = "start" | "complete_lesson" | "set_current" | "complete";

const courseProgressRoutes: FastifyPluginAsync = async (fastify) => {
  // ====== 列出用户所有课程进度 ======
  fastify.get(
    "/user/course-progress",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      request.log.info({ userId }, "user/course-progress: list");

      const rows = await prisma.userCourseProgress.findMany({
        where: { userId },
        orderBy: { lastStudiedAt: "desc" },
      });

      const result = rows.map((r) => ({
        courseId: r.courseId,
        status: r.status,
        currentLesson: r.currentLesson,
        completedLessons: r.completedLessons as number[],
        progressPercent: r.progressPercent,
        startedAt: r.startedAt,
        completedAt: r.completedAt,
        lastStudiedAt: r.lastStudiedAt,
      }));

      return sendSuccess(reply, result);
    }
  );

  // ====== 课程进度操作：start / complete_lesson / set_current / complete ======
  fastify.post<{
    Params: { courseId: string };
    Body: {
      action: CourseAction;
      lessonNumber?: number;
      currentLesson?: number;
    };
  }>(
    "/user/course-progress/:courseId",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { courseId } = request.params;
      const { action, lessonNumber, currentLesson } = request.body;

      if (!action) {
        return sendError(reply, "BAD_REQUEST", "缺少 action 字段");
      }

      request.log.info(
        { userId, courseId, action, lessonNumber, currentLesson },
        "user/course-progress: action"
      );

      // 校验课程存在 + 拿 lessons 字段算进度百分比
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        return sendError(reply, "NOT_FOUND", "课程不存在");
      }

      const now = new Date();
      const existing = await prisma.userCourseProgress.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (action === "start") {
        // 创建/重置为 in_progress
        const row = await prisma.userCourseProgress.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {
            status: "in_progress",
            startedAt: now,
            lastStudiedAt: now,
          },
          create: {
            userId,
            courseId,
            status: "in_progress",
            startedAt: now,
            lastStudiedAt: now,
          },
        });
        return sendSuccess(reply, serialize(row));
      }

      if (action === "complete_lesson") {
        if (typeof lessonNumber !== "number" || lessonNumber < 1) {
          return sendError(reply, "BAD_REQUEST", "lessonNumber 必须是 >= 1 的整数");
        }
        const prevList = (existing?.completedLessons as unknown as number[]) ?? [];
        if (!prevList.includes(lessonNumber)) prevList.push(lessonNumber);
        const completedLessons = Array.from(new Set(prevList)).sort((a, b) => a - b);
        const progressPercent =
          course.lessons > 0
            ? Math.min(100, Math.round((completedLessons.length / course.lessons) * 100))
            : 0;
        const isCompleted = progressPercent >= 100;

        const row = await prisma.userCourseProgress.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {
            status: isCompleted ? "completed" : "in_progress",
            completedLessons,
            progressPercent,
            ...(isCompleted ? { completedAt: now } : {}),
            startedAt: existing?.startedAt ?? now,
            lastStudiedAt: now,
          },
          create: {
            userId,
            courseId,
            status: isCompleted ? "completed" : "in_progress",
            completedLessons,
            progressPercent,
            startedAt: now,
            ...(isCompleted ? { completedAt: now } : {}),
            lastStudiedAt: now,
          },
        });
        return sendSuccess(reply, serialize(row));
      }

      if (action === "set_current") {
        if (typeof currentLesson !== "number" || currentLesson < 0) {
          return sendError(reply, "BAD_REQUEST", "currentLesson 必须是 >= 0 的整数");
        }
        const row = await prisma.userCourseProgress.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {
            currentLesson,
            status: existing?.status === "not_started" || !existing ? "in_progress" : existing.status,
            startedAt: existing?.startedAt ?? now,
            lastStudiedAt: now,
          },
          create: {
            userId,
            courseId,
            status: "in_progress",
            currentLesson,
            startedAt: now,
            lastStudiedAt: now,
          },
        });
        return sendSuccess(reply, serialize(row));
      }

      if (action === "complete") {
        const row = await prisma.userCourseProgress.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {
            status: "completed",
            progressPercent: 100,
            completedAt: now,
            lastStudiedAt: now,
          },
          create: {
            userId,
            courseId,
            status: "completed",
            progressPercent: 100,
            startedAt: now,
            completedAt: now,
            lastStudiedAt: now,
          },
        });
        return sendSuccess(reply, serialize(row));
      }

      return sendError(reply, "BAD_REQUEST", `未知 action: ${action}`);
    }
  );

  // ====== 简化版追踪：currentLesson + completedLesson ======
  fastify.post<{
    Params: { courseId: string };
    Body: { currentLesson?: number; completedLesson?: number };
  }>(
    "/user/course-progress/:courseId/track",
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { courseId } = request.params;
      const { currentLesson, completedLesson } = request.body;

      if (typeof currentLesson !== "number" && typeof completedLesson !== "number") {
        return sendError(reply, "BAD_REQUEST", "至少传 currentLesson 或 completedLesson 之一");
      }

      request.log.info(
        { userId, courseId, currentLesson, completedLesson },
        "user/course-progress: track"
      );

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        return sendError(reply, "NOT_FOUND", "课程不存在");
      }

      const now = new Date();
      const existing = await prisma.userCourseProgress.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      const prevList = (existing?.completedLessons as unknown as number[]) ?? [];
      let completedLessons = prevList;
      if (typeof completedLesson === "number" && completedLesson >= 1 && !prevList.includes(completedLesson)) {
        completedLessons = [...prevList, completedLesson].sort((a, b) => a - b);
      }
      const progressPercent =
        course.lessons > 0
          ? Math.min(100, Math.round((completedLessons.length / course.lessons) * 100))
          : 0;
      const isCompleted = progressPercent >= 100;

      const prevStatus = existing?.status ?? "not_started";
      const nextStatus = isCompleted
        ? "completed"
        : prevStatus === "not_started"
          ? "in_progress"
          : prevStatus;

      const row = await prisma.userCourseProgress.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {
          status: nextStatus,
          completedLessons,
          progressPercent,
          lastStudiedAt: now,
          ...(isCompleted ? { completedAt: now } : {}),
          ...(typeof currentLesson === "number" ? { currentLesson } : {}),
        },
        create: {
          userId,
          courseId,
          status: nextStatus,
          currentLesson: typeof currentLesson === "number" ? currentLesson : 0,
          completedLessons,
          progressPercent,
          startedAt: now,
          lastStudiedAt: now,
          ...(isCompleted ? { completedAt: now } : {}),
        },
      });

      return sendSuccess(reply, serialize(row));
    }
  );
};

function serialize(r: {
  courseId: string;
  status: string;
  currentLesson: number;
  completedLessons: unknown;
  progressPercent: number;
  startedAt: Date | null;
  completedAt: Date | null;
  lastStudiedAt: Date | null;
}) {
  return {
    courseId: r.courseId,
    status: r.status,
    currentLesson: r.currentLesson,
    completedLessons: r.completedLessons as number[],
    progressPercent: r.progressPercent,
    startedAt: r.startedAt,
    completedAt: r.completedAt,
    lastStudiedAt: r.lastStudiedAt,
  };
}

export default courseProgressRoutes;
