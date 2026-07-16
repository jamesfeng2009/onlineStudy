-- ============================================================
-- P2-1: League 排行榜
--
-- 设计：
--   * LeagueSeason：一个全局 season（按周），seasonKey 形如 "2026-W29"
--   * LeagueStanding：每用户每 season 一条记录，记录起始 XP、当前 XP、
--     所在 division（青铜/白银/黄金/铂金/钻石/大师）、rankInDivision
--   * 排序逻辑由后端 GET /league/standings 即时计算（无需物化 rank）
--
-- Division 划分（中文标签）：
--   bronze   青铜   (0-199 XP/周)
--   silver   白银   (200-499)
--   gold     黄金   (500-999)
--   platinum 铂金   (1000-1999)
--   diamond  钻石   (2000-3999)
--   master   大师   (4000+)
--
-- 升降级规则（在前端展示，后端不强制）：
--   * 每个 division 的前 10% 升级，后 10% 降级
--   * season 结束时由定时任务（cron）批量结算（后续实现）
-- ============================================================

CREATE TABLE "league_seasons" (
    "id"            TEXT      NOT NULL,
    "seasonKey"     TEXT      NOT NULL,                    -- "2026-W29"
    "startsAt"      TIMESTAMP(3) NOT NULL,
    "endsAt"        TIMESTAMP(3) NOT NULL,
    "isActive"      BOOLEAN   NOT NULL DEFAULT FALSE,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "league_seasons_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "league_seasons_seasonKey_key"
    ON "league_seasons"("seasonKey");

CREATE UNIQUE INDEX "league_seasons_isActive_key"
    ON "league_seasons"("isActive") WHERE ("isActive" = TRUE);

CREATE TABLE "league_standings" (
    "id"              TEXT      NOT NULL,
    "userId"          TEXT      NOT NULL,
    "seasonId"        TEXT      NOT NULL,
    "division"        TEXT      NOT NULL DEFAULT 'bronze',
    "startingExp"     INTEGER   NOT NULL DEFAULT 0,
    "currentExp"      INTEGER   NOT NULL DEFAULT 0,
    "weekExp"         INTEGER   NOT NULL DEFAULT 0,        -- currentExp - startingExp
    "bestDivision"    TEXT,
    "promotedAt"      TIMESTAMP(3),
    "demotedAt"       TIMESTAMP(3),
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "league_standings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "league_standings_userId_seasonId_key"
    ON "league_standings"("userId", "seasonId");

CREATE INDEX "league_standings_seasonId_division_weekExp_idx"
    ON "league_standings"("seasonId", "division", "weekExp" DESC);

CREATE INDEX "league_standings_userId_idx"
    ON "league_standings"("userId");

-- Foreign keys
ALTER TABLE "league_standings"
    ADD CONSTRAINT "league_standings_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "league_standings"
    ADD CONSTRAINT "league_standings_seasonId_fkey"
    FOREIGN KEY ("seasonId") REFERENCES "league_seasons"("id") ON DELETE CASCADE;
