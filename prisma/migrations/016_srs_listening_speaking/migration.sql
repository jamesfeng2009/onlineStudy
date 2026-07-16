-- ============================================================
-- P1-3: SRS 扩展到听力/口语
--
-- 与 UserQuizReview 同构的 SM-2 复习表，分别对应 Listening 和 Speaking：
--   * UserListeningReview: blank 正确率 < 阈值时进入复习队列
--   * UserSpeakingReview: 评分 < 60 时进入复习队列
--   * SM-2 字段：easeFactor / interval / repetitions / nextReviewAt
--
-- 设计差异：UserQuizReview.isMastered=错误数==0；这里 isMastered 改为
--   用户主动评分 "good"/"easy" 且 repetitions >= 阈值（与 user-reviews.ts 对齐）。
-- ============================================================

CREATE TABLE "user_listening_reviews" (
    "id"            TEXT      NOT NULL,
    "userId"        TEXT      NOT NULL,
    "listeningId"   TEXT      NOT NULL,
    "easeFactor"    DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval"      INTEGER   NOT NULL DEFAULT 1,
    "repetitions"   INTEGER   NOT NULL DEFAULT 0,
    "nextReviewAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt"  TIMESTAMP(3),
    "lastRating"    TEXT,                       -- again | hard | good | easy
    "lastAccuracy"  INTEGER   NOT NULL DEFAULT 0,
    "totalReviews"  INTEGER   NOT NULL DEFAULT 0,
    "goodReviews"   INTEGER   NOT NULL DEFAULT 0,
    "isMastered"    BOOLEAN   NOT NULL DEFAULT FALSE,
    CONSTRAINT "user_listening_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_listening_reviews_userId_listeningId_key"
    ON "user_listening_reviews"("userId", "listeningId");

CREATE INDEX "user_listening_reviews_userId_nextReviewAt_idx"
    ON "user_listening_reviews"("userId", "nextReviewAt");

CREATE INDEX "user_listening_reviews_userId_isMastered_idx"
    ON "user_listening_reviews"("userId", "isMastered");

CREATE TABLE "user_speaking_reviews" (
    "id"            TEXT      NOT NULL,
    "userId"        TEXT      NOT NULL,
    "speakingId"    TEXT      NOT NULL,
    "easeFactor"    DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval"      INTEGER   NOT NULL DEFAULT 1,
    "repetitions"   INTEGER   NOT NULL DEFAULT 0,
    "nextReviewAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt"  TIMESTAMP(3),
    "lastRating"    TEXT,
    "lastScore"     INTEGER   NOT NULL DEFAULT 0,   -- 0-100
    "totalReviews"  INTEGER   NOT NULL DEFAULT 0,
    "goodReviews"   INTEGER   NOT NULL DEFAULT 0,
    "isMastered"    BOOLEAN   NOT NULL DEFAULT FALSE,
    CONSTRAINT "user_speaking_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_speaking_reviews_userId_speakingId_key"
    ON "user_speaking_reviews"("userId", "speakingId");

CREATE INDEX "user_speaking_reviews_userId_nextReviewAt_idx"
    ON "user_speaking_reviews"("userId", "nextReviewAt");

CREATE INDEX "user_speaking_reviews_userId_isMastered_idx"
    ON "user_speaking_reviews"("userId", "isMastered");

-- Foreign keys
ALTER TABLE "user_listening_reviews"
    ADD CONSTRAINT "user_listening_reviews_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "user_listening_reviews"
    ADD CONSTRAINT "user_listening_reviews_listeningId_fkey"
    FOREIGN KEY ("listeningId") REFERENCES "listening"("id") ON DELETE CASCADE;

ALTER TABLE "user_speaking_reviews"
    ADD CONSTRAINT "user_speaking_reviews_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "user_speaking_reviews"
    ADD CONSTRAINT "user_speaking_reviews_speakingId_fkey"
    FOREIGN KEY ("speakingId") REFERENCES "speaking"("id") ON DELETE CASCADE;
