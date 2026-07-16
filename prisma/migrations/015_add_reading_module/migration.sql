-- ============================================================
-- P1-2: 阅读模块（Reading Module）
--
-- 与 Listening/Speaking/Quiz 平级，提供分级阅读理解材料：
--   * ReadingPassage：正文 + 词汇注释 + 阅读理解题
--   * ReadingTranslation：题目/释义的本地化翻译（每 (readingId, baseLanguageCode) 唯一）
--   * UserReadingProgress：用户的理解题作答 + 完成状态（每 (userId, readingId) 唯一）
-- ============================================================

CREATE TABLE "reading_passages" (
    "id"           TEXT   NOT NULL,
    "languageCode" TEXT   NOT NULL,
    "level"        TEXT   NOT NULL,
    "title"        TEXT   NOT NULL,
    "body"         TEXT   NOT NULL,
    "glossary"     JSONB  NOT NULL DEFAULT '[]'::jsonb,
    "questions"    JSONB  NOT NULL DEFAULT '[]'::jsonb,
    "wordCount"    INTEGER NOT NULL DEFAULT 0,
    "estMinutes"   INTEGER NOT NULL DEFAULT 3,
    "source"       TEXT,
    "readOrder"    INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reading_passages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "reading_passages_languageCode_level_idx"
    ON "reading_passages"("languageCode", "level");

CREATE TABLE "reading_translations" (
    "id"               TEXT   NOT NULL,
    "readingId"        TEXT   NOT NULL,
    "baseLanguageCode" TEXT   NOT NULL,
    "title"            TEXT   NOT NULL,
    "summary"          TEXT   NOT NULL DEFAULT '',
    CONSTRAINT "reading_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reading_translations_readingId_baseLanguageCode_key"
    ON "reading_translations"("readingId", "baseLanguageCode");

CREATE INDEX "reading_translations_baseLanguageCode_idx"
    ON "reading_translations"("baseLanguageCode");

CREATE TABLE "user_reading_progress" (
    "id"                   TEXT      NOT NULL,
    "userId"               TEXT      NOT NULL,
    "readingId"            TEXT      NOT NULL,
    "status"               TEXT      NOT NULL DEFAULT 'not_started',
    "comprehensionResults" JSONB    NOT NULL DEFAULT '[]'::jsonb,
    "correctCount"        INTEGER   NOT NULL DEFAULT 0,
    "totalQuestions"       INTEGER   NOT NULL DEFAULT 0,
    "bestAccuracy"         INTEGER   NOT NULL DEFAULT 0,
    "attemptCount"         INTEGER   NOT NULL DEFAULT 0,
    "completedAt"          TIMESTAMP(3),
    "lastPracticedAt"      TIMESTAMP(3),
    CONSTRAINT "user_reading_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_reading_progress_userId_readingId_key"
    ON "user_reading_progress"("userId", "readingId");

CREATE INDEX "user_reading_progress_userId_lastPracticedAt_idx"
    ON "user_reading_progress"("userId", "lastPracticedAt");

-- Foreign keys
ALTER TABLE "reading_passages"
    ADD CONSTRAINT "reading_passages_languageCode_fkey"
    FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE;

ALTER TABLE "reading_translations"
    ADD CONSTRAINT "reading_translations_readingId_fkey"
    FOREIGN KEY ("readingId") REFERENCES "reading_passages"("id") ON DELETE CASCADE;

ALTER TABLE "user_reading_progress"
    ADD CONSTRAINT "user_reading_progress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "user_reading_progress"
    ADD CONSTRAINT "user_reading_progress_readingId_fkey"
    FOREIGN KEY ("readingId") REFERENCES "reading_passages"("id") ON DELETE CASCADE;
