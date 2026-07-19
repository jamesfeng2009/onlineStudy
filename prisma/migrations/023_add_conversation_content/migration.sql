-- ============================================================
-- P1 反爬：对话类内容入库（RealConversation / DialogueScene）
--
-- 真实对话语料（Taskmaster-2 翻译版，13 语言 ~2800 条）与手写
-- 分支对话场景从 src/data 静态文件迁入 DB，不再打进前端 bundle，
-- 通过 /api/real-conversations、/api/dialogue-scenes 按需下发
-- （匿名仅样例，登录用户全量）。
--
-- 数据由 scripts/seed-conversations.ts 导入（upsert，幂等）。
-- ============================================================

CREATE TABLE "real_conversations" (
    "id"             TEXT      NOT NULL,     -- 源数据 id（已按语言命名空间，如 "dlg-xxx-en"）
    "languageCode"   TEXT      NOT NULL,
    "conversationId" TEXT      NOT NULL,     -- 源数据集 conversation id（跨语言共享同一源对话）
    "domain"         TEXT      NOT NULL,     -- restaurant / movies / hotels / flights / food-ordering / music / sports
    "utterances"     JSONB     NOT NULL,     -- { index: number; speaker: "USER"|"ASSISTANT"; text: string }[]
    "convOrder"      INTEGER   NOT NULL DEFAULT 0,
    CONSTRAINT "real_conversations_pkey" PRIMARY KEY ("id")
);

-- 列表查询主路径：按语言 + 场景域过滤
CREATE INDEX "real_conversations_languageCode_domain_idx"
    ON "real_conversations"("languageCode", "domain");

CREATE TABLE "dialogue_scenes" (
    "id"           TEXT      NOT NULL,       -- 如 "dlg-en-coffee"
    "languageCode" TEXT      NOT NULL,
    "level"        TEXT      NOT NULL,
    "scenario"     TEXT      NOT NULL,       -- ordering-coffee / asking-directions ...
    "title"        TEXT      NOT NULL,
    "opening"      TEXT      NOT NULL,
    "turns"        JSONB     NOT NULL,       -- Record<turnId, DialogueTurn>（分支图）
    "startTurnId"  TEXT      NOT NULL,
    "sceneOrder"   INTEGER   NOT NULL DEFAULT 0,
    CONSTRAINT "dialogue_scenes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "dialogue_scenes_languageCode_idx"
    ON "dialogue_scenes"("languageCode");

ALTER TABLE "real_conversations"
    ADD CONSTRAINT "real_conversations_languageCode_fkey"
    FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "dialogue_scenes"
    ADD CONSTRAINT "dialogue_scenes_languageCode_fkey"
    FOREIGN KEY ("languageCode") REFERENCES "languages"("code") ON DELETE CASCADE ON UPDATE CASCADE;
