-- ============================================================
-- P4-2: AI 对话模块（AI Conversations）
--
-- 与 P3-1 的单次解释不同，对话是多轮的，需要持久化 session + messages。
-- 设计要点：
--   * AiConversation：一次对话会话（含语言、目标类型、超时控制）
--   * AiConversationMessage：每轮消息（user / assistant / system）
--   * 超时：10 分钟无活动自动标记 timeout（路由层查询时判断）
--   * 限次：复用 ai_usage_daily 表，每轮对话 count+1，受 AI_DAILY_LIMIT 约束
-- ============================================================

CREATE TABLE "ai_conversations" (
    "id"             TEXT      NOT NULL,
    "userId"         TEXT      NOT NULL,
    "languageCode"   TEXT      NOT NULL,          -- 学习的目标语言 zh/en/ja/...
    "level"          TEXT,                         -- 可选：HSK5 / N3 / B2 等
    "title"          TEXT,                         -- 自动生成的会话标题
    "scenarioType"   TEXT      NOT NULL DEFAULT 'free',  -- 'free' | 'roleplay' | 'topic'
    "status"         TEXT      NOT NULL DEFAULT 'active', -- 'active' | 'ended' | 'timeout'
    "turnCount"      INTEGER   NOT NULL DEFAULT 0,
    "lastActiveAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_conversations_userId_updatedAt_idx"
    ON "ai_conversations"("userId", "updatedAt");

CREATE INDEX "ai_conversations_status_lastActiveAt_idx"
    ON "ai_conversations"("status", "lastActiveAt");

CREATE TABLE "ai_conversation_messages" (
    "id"             TEXT      NOT NULL,
    "conversationId" TEXT      NOT NULL,
    "role"           TEXT      NOT NULL,          -- 'user' | 'assistant' | 'system'
    "content"        TEXT      NOT NULL,
    "tokensInput"    INTEGER   NOT NULL DEFAULT 0,
    "tokensOutput"   INTEGER   NOT NULL DEFAULT 0,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_conversation_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_conversation_messages_conversationId_createdAt_idx"
    ON "ai_conversation_messages"("conversationId", "createdAt");

-- Foreign keys
ALTER TABLE "ai_conversations"
    ADD CONSTRAINT "ai_conversations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "ai_conversation_messages"
    ADD CONSTRAINT "ai_conversation_messages_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE;
