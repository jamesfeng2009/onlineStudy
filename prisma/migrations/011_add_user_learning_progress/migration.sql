-- ============================================================
-- 011_add_user_learning_progress: P0 用户学习进度核心表
-- 用途：单词记忆状态(SM2)、课程进度、测验作答记录(SM2+错题本)
-- 说明：
--   - 新部署数据库：在 010 之后执行
--   - 已部署数据库：在 Supabase SQL Editor 单独执行本文件
--   - 执行后建议手动在 _prisma_migrations 表插入迁移记录：
--       INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
--       VALUES (gen_random_uuid(), '', NOW(), '011_add_user_learning_progress', NULL, NULL, NOW(), 1);
-- ============================================================

-- --------------------------------------------------------
-- 1. user_word_reviews — 单词记忆状态（SM2 间隔重复）
--    每个用户对每个单词一条记录，追踪下次复习时间
-- --------------------------------------------------------
CREATE TABLE "user_word_reviews" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT NOT NULL,
    "wordBankId"      TEXT NOT NULL,
    "easeFactor"      DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval"        INTEGER NOT NULL DEFAULT 1,
    "repetitions"     INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt"    TIMESTAMP(3),
    "lastRating"      TEXT,
    "totalReviews"    INTEGER NOT NULL DEFAULT 0,
    "correctReviews"  INTEGER NOT NULL DEFAULT 0,
    "isLearned"       BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_word_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_word_reviews_userId_wordBankId_key" ON "user_word_reviews"("userId", "wordBankId");
CREATE INDEX "user_word_reviews_userId_nextReviewAt_idx" ON "user_word_reviews"("userId", "nextReviewAt");

ALTER TABLE "user_word_reviews" ADD CONSTRAINT "user_word_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_word_reviews" ADD CONSTRAINT "user_word_reviews_wordBankId_fkey" FOREIGN KEY ("wordBankId") REFERENCES "word_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- --------------------------------------------------------
-- 2. user_course_progress — 课程/课时进度
--    用户 × 课程 → 当前课时、已完成课时列表、进度百分比
-- --------------------------------------------------------
CREATE TABLE "user_course_progress" (
    "id"               TEXT NOT NULL,
    "userId"           TEXT NOT NULL,
    "courseId"         TEXT NOT NULL,
    "status"           TEXT NOT NULL DEFAULT 'not_started',
    "currentLesson"    INTEGER NOT NULL DEFAULT 0,
    "completedLessons" JSONB NOT NULL DEFAULT '[]',
    "progressPercent"  INTEGER NOT NULL DEFAULT 0,
    "startedAt"        TIMESTAMP(3),
    "completedAt"      TIMESTAMP(3),
    "lastStudiedAt"    TIMESTAMP(3),

    CONSTRAINT "user_course_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_course_progress_userId_courseId_key" ON "user_course_progress"("userId", "courseId");
CREATE INDEX "user_course_progress_userId_lastStudiedAt_idx" ON "user_course_progress"("userId", "lastStudiedAt");

ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- --------------------------------------------------------
-- 3. user_quiz_reviews — 测验作答记录（SM2 + 错题本）
--    用户 × 题目 → 间隔重复状态 + 错误次数 + 是否已掌握
-- --------------------------------------------------------
CREATE TABLE "user_quiz_reviews" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT NOT NULL,
    "quizId"          TEXT NOT NULL,
    "easeFactor"      DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval"        INTEGER NOT NULL DEFAULT 1,
    "repetitions"     INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt"    TIMESTAMP(3),
    "wrongCount"      INTEGER NOT NULL DEFAULT 0,
    "lastWrongAt"     TIMESTAMP(3),
    "isMastered"      BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_quiz_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_quiz_reviews_userId_quizId_key" ON "user_quiz_reviews"("userId", "quizId");
CREATE INDEX "user_quiz_reviews_userId_nextReviewAt_idx" ON "user_quiz_reviews"("userId", "nextReviewAt");
CREATE INDEX "user_quiz_reviews_userId_isMastered_idx" ON "user_quiz_reviews"("userId", "isMastered");

ALTER TABLE "user_quiz_reviews" ADD CONSTRAINT "user_quiz_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_quiz_reviews" ADD CONSTRAINT "user_quiz_reviews_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
