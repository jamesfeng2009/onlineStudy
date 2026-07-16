-- ============================================================
-- P3-1: AI 句子解释模块（AI Explanations）
--
-- 为 Reading / Writing / Lesson / Word 四类对象提供运行时 AI 解释。
-- 同一 (targetType, targetId, promptHash) 命中缓存即返回，避免重复调用 LLM。
--
--   * AiExplanation：单次解释记录（含 promptHash 缓存键 + AI 返回内容 + token 用量）
--   * AiUsageDaily：每用户每天的调用计数，用于限流
-- ============================================================

CREATE TABLE "ai_explanations" (
    "id"           TEXT      NOT NULL,
    "userId"       TEXT      NOT NULL,
    "targetType"   TEXT      NOT NULL,        -- 'reading' | 'writing' | 'lesson' | 'word'
    "targetId"     TEXT      NOT NULL,        -- 对应实体 id
    "languageCode" TEXT,                       -- 目标语言（zh/en/ja...）
    "query"        TEXT      NOT NULL DEFAULT '',  -- 用户原句或问题
    "promptHash"   TEXT      NOT NULL,        -- SHA256(prompt 模板 + 上下文)，缓存键
    "response"     TEXT      NOT NULL,        -- AI 返回的 Markdown
    "model"        TEXT      NOT NULL,        -- gemini-2.5-flash 等
    "tokensInput"  INTEGER   NOT NULL DEFAULT 0,
    "tokensOutput" INTEGER   NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_explanations_pkey" PRIMARY KEY ("id")
);

-- 缓存命中：同一 target + 同一 prompt 复用结果
CREATE UNIQUE INDEX "ai_explanations_targetType_targetId_promptHash_key"
    ON "ai_explanations"("targetType", "targetId", "promptHash");

CREATE INDEX "ai_explanations_userId_createdAt_idx"
    ON "ai_explanations"("userId", "createdAt");

CREATE INDEX "ai_explanations_targetType_targetId_createdAt_idx"
    ON "ai_explanations"("targetType", "targetId", "createdAt");

CREATE TABLE "ai_usage_daily" (
    "id"           TEXT      NOT NULL,
    "userId"       TEXT      NOT NULL,
    "dateKey"      TEXT      NOT NULL,        -- 'YYYY-MM-DD'
    "count"        INTEGER   NOT NULL DEFAULT 0,
    "tokensUsed"   INTEGER   NOT NULL DEFAULT 0,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_usage_daily_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ai_usage_daily_userId_dateKey_key"
    ON "ai_usage_daily"("userId", "dateKey");

-- Foreign keys
ALTER TABLE "ai_explanations"
    ADD CONSTRAINT "ai_explanations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "ai_usage_daily"
    ADD CONSTRAINT "ai_usage_daily_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
