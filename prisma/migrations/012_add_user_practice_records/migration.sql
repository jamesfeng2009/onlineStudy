-- ============================================================
-- 012_add_user_practice_records: P1 用户练习记录表
-- 用途：听力进度、口语跟读记录、成就解锁记录
-- 说明：
--   - 依赖 011 已执行（有 users 表即可，无跨表依赖）
--   - 已部署数据库：在 Supabase SQL Editor 单独执行本文件
--   - 执行后建议手动在 _prisma_migrations 表插入迁移记录：
--       INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
--       VALUES (gen_random_uuid(), '', NOW(), '012_add_user_practice_records', NULL, NULL, NOW(), 1);
-- ============================================================

-- --------------------------------------------------------
-- 4. user_listening_progress — 听力练习进度
--    用户 × 听力材料 → 完成状态、填空正确率、完成次数
-- --------------------------------------------------------
CREATE TABLE "user_listening_progress" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT NOT NULL,
    "listeningId"     TEXT NOT NULL,
    "status"          TEXT NOT NULL DEFAULT 'not_started',  -- not_started | in_progress | completed
    "blankResults"    JSONB NOT NULL DEFAULT '[]',           -- [{ index, correct, userAnswer }]
    "correctCount"    INTEGER NOT NULL DEFAULT 0,
    "totalBlanks"     INTEGER NOT NULL DEFAULT 0,
    "attempts"        INTEGER NOT NULL DEFAULT 0,
    "bestAccuracy"    INTEGER NOT NULL DEFAULT 0,            -- 最佳正确率 %
    "completedAt"     TIMESTAMP(3),
    "lastPracticedAt" TIMESTAMP(3),

    CONSTRAINT "user_listening_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_listening_progress_userId_listeningId_key" ON "user_listening_progress"("userId", "listeningId");
CREATE INDEX "user_listening_progress_userId_lastPracticedAt_idx" ON "user_listening_progress"("userId", "lastPracticedAt");

ALTER TABLE "user_listening_progress" ADD CONSTRAINT "user_listening_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_listening_progress" ADD CONSTRAINT "user_listening_progress_listeningId_fkey" FOREIGN KEY ("listeningId") REFERENCES "listening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- --------------------------------------------------------
-- 5. user_speaking_progress — 口语跟读记录
--    用户 × 口语材料 → 练习次数、发音评分历史、最高分
-- --------------------------------------------------------
CREATE TABLE "user_speaking_progress" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT NOT NULL,
    "speakingId"      TEXT NOT NULL,
    "attempts"        INTEGER NOT NULL DEFAULT 0,
    "scoreHistory"    JSONB NOT NULL DEFAULT '[]',           -- [{ score, timestamp, audioUrl? }]
    "bestScore"       INTEGER NOT NULL DEFAULT 0,            -- 0-100
    "lastScore"       INTEGER NOT NULL DEFAULT 0,
    "isCompleted"     BOOLEAN NOT NULL DEFAULT false,        -- 达到 60 分视为完成
    "lastPracticedAt" TIMESTAMP(3),

    CONSTRAINT "user_speaking_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_speaking_progress_userId_speakingId_key" ON "user_speaking_progress"("userId", "speakingId");
CREATE INDEX "user_speaking_progress_userId_lastPracticedAt_idx" ON "user_speaking_progress"("userId", "lastPracticedAt");

ALTER TABLE "user_speaking_progress" ADD CONSTRAINT "user_speaking_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_speaking_progress" ADD CONSTRAINT "user_speaking_progress_speakingId_fkey" FOREIGN KEY ("speakingId") REFERENCES "speaking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- --------------------------------------------------------
-- 6. user_achievements — 成就解锁记录
--    持久化：解锁时间、已读状态
--    badgeKey 对应 src/data/badges.ts 里的 key (如 streak-3, words-100)
-- --------------------------------------------------------
CREATE TABLE "user_achievements" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "badgeKey"    TEXT NOT NULL,
    "unlockedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead"      BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_achievements_userId_badgeKey_key" ON "user_achievements"("userId", "badgeKey");
CREATE INDEX "user_achievements_userId_isRead_idx" ON "user_achievements"("userId", "isRead");

ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
