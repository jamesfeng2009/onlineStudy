-- ============================================================
-- 004_add_quiz_listening_speaking: 新增语法题、听力、口语表
-- 用途：支撑后台对互动学习内容的 CRUD 管理
-- 说明：
--   - 新部署数据库：在 001_init 之后执行
--   - 已部署数据库：在 Supabase SQL Editor 单独执行本文件
--   - 执行后建议手动在 _prisma_migrations 表插入迁移记录：
--       INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
--       VALUES (gen_random_uuid(), '', NOW(), '004_add_quiz_listening_speaking', NULL, NULL, NOW(), 1);
-- ============================================================

-- CreateTable Quiz
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" INTEGER NOT NULL,
    "explain" TEXT NOT NULL,
    "quizOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable Listening
CREATE TABLE "listening" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "blanks" JSONB NOT NULL,
    "listenOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "listening_pkey" PRIMARY KEY ("id")
);

-- CreateTable Speaking
CREATE TABLE "speaking" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "phonetic" TEXT,
    "speakOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "speaking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKeys
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "listening" ADD CONSTRAINT "listening_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "speaking" ADD CONSTRAINT "speaking_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "quizzes_languageCode_level_idx" ON "quizzes"("languageCode", "level");
CREATE INDEX "listening_languageCode_level_idx" ON "listening"("languageCode", "level");
CREATE INDEX "speaking_languageCode_level_idx" ON "speaking"("languageCode", "level");
