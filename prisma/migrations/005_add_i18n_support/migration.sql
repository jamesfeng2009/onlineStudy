-- 增加国际化支持：用户界面/母语字段 + 单词/题目多语种释义表

-- 1. 用户增加界面语言和母语字段
ALTER TABLE "users" ADD COLUMN "uiLanguage" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "users" ADD COLUMN "nativeLanguage" TEXT NOT NULL DEFAULT 'en';

-- 2. 创建单词释义翻译表
CREATE TABLE "word_bank_translations" (
    "id" TEXT NOT NULL,
    "wordBankId" TEXT NOT NULL,
    "baseLanguageCode" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "exampleTranslation" TEXT,

    CONSTRAINT "word_bank_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "word_bank_translations_wordBankId_baseLanguageCode_key" ON "word_bank_translations"("wordBankId", "baseLanguageCode");
CREATE INDEX "word_bank_translations_baseLanguageCode_idx" ON "word_bank_translations"("baseLanguageCode");
ALTER TABLE "word_bank_translations" ADD CONSTRAINT "word_bank_translations_wordBankId_fkey" FOREIGN KEY ("wordBankId") REFERENCES "word_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. 创建题目释义翻译表
CREATE TABLE "quiz_translations" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "baseLanguageCode" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "explain" TEXT NOT NULL,

    CONSTRAINT "quiz_translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "quiz_translations_quizId_baseLanguageCode_key" ON "quiz_translations"("quizId", "baseLanguageCode");
CREATE INDEX "quiz_translations_baseLanguageCode_idx" ON "quiz_translations"("baseLanguageCode");
ALTER TABLE "quiz_translations" ADD CONSTRAINT "quiz_translations_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. 迁移已有单词释义
-- 原平台以中文为主：非中文目标语言的释义多为中文；中文目标语言的释义多为英文。
INSERT INTO "word_bank_translations" ("id", "wordBankId", "baseLanguageCode", "translation", "exampleTranslation")
SELECT
    gen_random_uuid()::text,
    wb.id,
    CASE WHEN wb."languageCode" = 'zh' THEN 'en' ELSE 'zh' END,
    wb.translation,
    NULL
FROM "word_bank" wb;

-- 5. 迁移已有题目释义（现有题目题干/解析以英文为主，默认归入英文释义）
INSERT INTO "quiz_translations" ("id", "quizId", "baseLanguageCode", "question", "explain")
SELECT
    gen_random_uuid()::text,
    q.id,
    'en',
    q.question,
    q.explain
FROM "quizzes" q;

-- 6. 删除原表中已迁移到翻译表的字段
ALTER TABLE "word_bank" DROP COLUMN "translation";
ALTER TABLE "quizzes" DROP COLUMN "question";
ALTER TABLE "quizzes" DROP COLUMN "explain";
