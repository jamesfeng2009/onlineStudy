-- P0-1: 课时层级结构（Course → Unit → Lesson → Exercise）
-- 解决项目最大结构性缺口：原 Course.lessons 只是数字，无 Lesson 实体

CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "unitOrder" INTEGER NOT NULL DEFAULT 0,
    "skillFocus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "units_courseId_unitOrder_key" ON "units"("courseId", "unitOrder");
CREATE INDEX "units_courseId_idx" ON "units"("courseId");

CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lessonOrder" INTEGER NOT NULL DEFAULT 0,
    "skillType" TEXT NOT NULL,
    "exerciseIds" JSONB NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 5,
    "isCheckpoint" BOOLEAN NOT NULL DEFAULT false,
    "requiresLessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lessons_unitId_lessonOrder_key" ON "lessons"("unitId", "lessonOrder");
CREATE INDEX "lessons_unitId_idx" ON "lessons"("unitId");
CREATE INDEX "lessons_requiresLessonId_idx" ON "lessons"("requiresLessonId");

CREATE TABLE "user_lesson_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "bestScore" INTEGER,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_lesson_progress_userId_lessonId_key" ON "user_lesson_progress"("userId", "lessonId");
CREATE INDEX "user_lesson_progress_userId_status_idx" ON "user_lesson_progress"("userId", "status");

-- 外键约束
ALTER TABLE "units"
    ADD CONSTRAINT "units_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE;

ALTER TABLE "lessons"
    ADD CONSTRAINT "lessons_unitId_fkey"
    FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE;

-- 自引用：Lesson 的 requiresLessonId 指向另一条 Lesson
ALTER TABLE "lessons"
    ADD CONSTRAINT "lessons_requiresLessonId_fkey"
    FOREIGN KEY ("requiresLessonId") REFERENCES "lessons"("id") ON DELETE SET NULL;

ALTER TABLE "user_lesson_progress"
    ADD CONSTRAINT "user_lesson_progress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "user_lesson_progress"
    ADD CONSTRAINT "user_lesson_progress_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE;
