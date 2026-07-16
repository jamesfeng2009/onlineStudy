-- ============================================================
-- P2-3: 写作模块（Writing Module）
--
-- 设计：
--   * WritingPrompt：分级写作题目，含 prompt（题目描述）+ 范文 + 提示词
--   * WritingTranslation：题目/范文的本地化翻译
--   * UserWritingSubmission：用户提交记录（每次提交一条，保留全部历史）
--     不同于 reading 的 upsert-by-best：写作每次提交都是独立记录，
--     因为每篇都是独立作品，可展示在用户作品集中
--
-- 评分策略：
--   * 后端实现简单评分算法（字数 / 句子多样性 / 重复率 / 关键词命中）
--   * 真正的 LLM 评分作为后续可插拔扩展（保存 rawFeedback 供回溯）
-- ============================================================

CREATE TABLE "writing_prompts" (
    "id"            TEXT      NOT NULL,
    "languageCode"  TEXT      NOT NULL,
    "level"         TEXT      NOT NULL,
    "type"          TEXT      NOT NULL DEFAULT 'essay',  -- essay | email | summary | story | dialogue
    "title"         TEXT      NOT NULL,
    "prompt"        TEXT      NOT NULL,                  -- 题目正文
    "tips"          JSONB     NOT NULL DEFAULT '[]'::jsonb,  -- 写作提示词数组 string[]
    "minWords"      INTEGER   NOT NULL DEFAULT 50,
    "maxWords"      INTEGER   NOT NULL DEFAULT 200,
    "estMinutes"    INTEGER   NOT NULL DEFAULT 15,
    "sampleAnswer"  TEXT,
    "keywords"      JSONB     NOT NULL DEFAULT '[]'::jsonb,  -- 期望出现的关键词 string[]
    "writeOrder"    INTEGER   NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "writing_prompts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "writing_prompts_languageCode_level_idx"
    ON "writing_prompts"("languageCode", "level");

CREATE INDEX "writing_prompts_type_idx"
    ON "writing_prompts"("type");

CREATE TABLE "writing_translations" (
    "id"               TEXT   NOT NULL,
    "writingId"        TEXT   NOT NULL,
    "baseLanguageCode" TEXT   NOT NULL,
    "title"            TEXT   NOT NULL,
    "prompt"           TEXT   NOT NULL,
    "tips"             JSONB  NOT NULL DEFAULT '[]'::jsonb,
    "sampleAnswer"     TEXT,
    CONSTRAINT "writing_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "writing_translations_writingId_baseLanguageCode_key"
    ON "writing_translations"("writingId", "baseLanguageCode");

CREATE INDEX "writing_translations_baseLanguageCode_idx"
    ON "writing_translations"("baseLanguageCode");

CREATE TABLE "user_writing_submissions" (
    "id"              TEXT      NOT NULL,
    "userId"          TEXT      NOT NULL,
    "writingId"       TEXT      NOT NULL,
    "content"         TEXT      NOT NULL,                 -- 用户提交的写作文本
    "wordCount"       INTEGER   NOT NULL DEFAULT 0,
    "score"           INTEGER   NOT NULL DEFAULT 0,       -- 0-100 综合评分
    "lengthScore"     INTEGER   NOT NULL DEFAULT 0,       -- 字数得分 0-100
    "varietyScore"    INTEGER   NOT NULL DEFAULT 0,       -- 词汇多样性 0-100
    "keywordScore"    INTEGER   NOT NULL DEFAULT 0,       -- 关键词命中 0-100
    "feedback"        JSONB     NOT NULL DEFAULT '{}'::jsonb,  -- 结构化反馈
    "status"          TEXT      NOT NULL DEFAULT 'submitted',  -- submitted | reviewed | flagged
    "submittedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt"      TIMESTAMP(3),
    CONSTRAINT "user_writing_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_writing_submissions_userId_writingId_idx"
    ON "user_writing_submissions"("userId", "writingId");

CREATE INDEX "user_writing_submissions_userId_submittedAt_idx"
    ON "user_writing_submissions"("userId", "submittedAt" DESC);

CREATE INDEX "user_writing_submissions_writingId_idx"
    ON "user_writing_submissions"("writingId");

-- Foreign keys
ALTER TABLE "writing_prompts"
    ADD CONSTRAINT "writing_prompts_languageCode_fkey"
    FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE;

ALTER TABLE "writing_translations"
    ADD CONSTRAINT "writing_translations_writingId_fkey"
    FOREIGN KEY ("writingId") REFERENCES "writing_prompts"("id") ON DELETE CASCADE;

ALTER TABLE "user_writing_submissions"
    ADD CONSTRAINT "user_writing_submissions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "user_writing_submissions"
    ADD CONSTRAINT "user_writing_submissions_writingId_fkey"
    FOREIGN KEY ("writingId") REFERENCES "writing_prompts"("id") ON DELETE CASCADE;
