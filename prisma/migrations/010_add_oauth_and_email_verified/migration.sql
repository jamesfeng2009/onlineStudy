-- OAuth 登录 + 邮箱验证字段
-- 1. passwordHash 改为可空（OAuth 用户没有密码）
ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- 2. OAuth 绑定字段
ALTER TABLE "users" ADD COLUMN "oauthProvider" TEXT;
ALTER TABLE "users" ADD COLUMN "oauthId" TEXT;

-- 3. 邮箱验证标志（OAuth 用户默认 true，密码用户默认 false）
ALTER TABLE "users" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
-- 既有 OAuth 邮箱（null passwordHash）视为已验证
UPDATE "users" SET "emailVerified" = true WHERE "passwordHash" IS NULL;

-- 4. 同一 provider+oauthId 唯一
CREATE UNIQUE INDEX "users_oauthProvider_oauthId_key" ON "users"("oauthProvider", "oauthId");
