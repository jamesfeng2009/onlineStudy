-- P0-3: 分级测试结果（Placement Test）
-- 每个用户每个 (userId, language) 仅保留最近一次结果（upsert 覆盖）

CREATE TABLE "placement_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "recommendedLevel" TEXT NOT NULL,
    "recommendedCourseId" TEXT,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "finalCefrRank" INTEGER NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "placement_results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "placement_results_userId_language_key" ON "placement_results"("userId", "language");
CREATE INDEX "placement_results_userId_takenAt_idx" ON "placement_results"("userId", "takenAt");

-- 外键约束
ALTER TABLE "placement_results"
    ADD CONSTRAINT "placement_results_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
