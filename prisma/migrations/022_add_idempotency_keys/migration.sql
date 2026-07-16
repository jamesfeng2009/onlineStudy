-- ============================================================
-- P4-3: 幂等键表（Idempotency Keys）
--
-- 用于 AI 对话 /send 接口的幂等性保证。
-- 客户端每次发送生成唯一 UUID 作为 Idempotency-Key header,
-- 服务端用 (conversationId, idempotencyKey) 做去重。
-- 同一 key 重复请求直接返回首次的响应,不重复创建消息、不重复扣配额。
--
-- 设计:
--   * 24 小时 TTL(createdAt 索引,定期清理)
--   * (conversationId, idempotencyKey) 复合唯一键
--   * 存储首次响应的 JSON,重复请求直接返回
-- ============================================================

CREATE TABLE "ai_idempotency_keys" (
    "id"              TEXT      NOT NULL,
    "conversationId" TEXT      NOT NULL,
    "idempotencyKey"  TEXT      NOT NULL,          -- 客户端生成的 UUID
    "responseJson"    TEXT      NOT NULL,          -- 首次响应的 JSON
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- 同一会话内同一 key 只能存在一条
CREATE UNIQUE INDEX "ai_idempotency_keys_conversationId_idempotencyKey_key"
    ON "ai_idempotency_keys"("conversationId", "idempotencyKey");

-- 用于 TTL 清理(24 小时前的记录可删)
CREATE INDEX "ai_idempotency_keys_createdAt_idx"
    ON "ai_idempotency_keys"("createdAt");

-- Foreign key
ALTER TABLE "ai_idempotency_keys"
    ADD CONSTRAINT "ai_idempotency_keys_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE;
