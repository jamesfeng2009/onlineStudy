-- ============================================================
-- 003_add_stripe_events: 新增 Stripe webhook 事件记录表
-- 用途：保证 Stripe webhook 幂等性（重复 event 不重复处理）
-- 说明：
--   - 新部署数据库：001_init 已包含此表，无需执行 003
--   - 已部署数据库：在 Supabase SQL Editor 单独执行本文件
-- 触发原因：引入 server/lib/idempotency.ts 中的 withStripeIdempotency
-- ============================================================

-- CreateTable
CREATE TABLE "stripe_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,
    "userId" TEXT,
    CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

-- 说明：Stripe event ID 本身就是唯一的（evt_xxx 格式），
-- 这里用它作为主键天然保证唯一性，无需额外索引。
