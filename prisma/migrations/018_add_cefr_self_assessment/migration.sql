-- ============================================================
-- P2-2: CEFR 自评（Cefr Self-Assessment）
--
-- 设计：
--   * 用户对每个 (userId, language) 自评一个 CEFR 等级（A1-C2）
--   * 与 PlacementResult 分离：自评是主观判断，分级测试是客观测量
--   * 二者可同时存在，前端在 profile / dashboard 同时展示并对比
--   * canDoKeys 存用户勾选的 can-do 条目（项目原创描述，避免版权问题）
-- ============================================================

CREATE TABLE "cefr_self_assessments" (
    "id"            TEXT      NOT NULL,
    "userId"        TEXT      NOT NULL,
    "language"      TEXT      NOT NULL,                    -- "en" / "ja" / "ko" ...
    "cefrLevel"     TEXT      NOT NULL,                    -- "A1" / "A2" / "B1" / "B2" / "C1" / "C2"
    "cefrRank"      INTEGER   NOT NULL,                    -- 1-6（A1=1 ... C2=6）
    "canDoKeys"     JSONB     NOT NULL DEFAULT '[]',       -- 用户勾选的 can-do 条目 key
    "note"          TEXT,                                  -- 可选备注
    "assessedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cefr_self_assessments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cefr_self_assessments_userId_language_key"
    ON "cefr_self_assessments"("userId", "language");

CREATE INDEX "cefr_self_assessments_userId_idx"
    ON "cefr_self_assessments"("userId");

CREATE INDEX "cefr_self_assessments_language_cefrRank_idx"
    ON "cefr_self_assessments"("language", "cefrRank");

ALTER TABLE "cefr_self_assessments"
    ADD CONSTRAINT "cefr_self_assessments_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
