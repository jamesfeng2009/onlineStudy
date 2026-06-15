#!/usr/bin/env bash
set -e

pnpm install --frozen-lockfile

# 修复 P3009：清理之前在 Supabase 手动执行 009 留下的 failed 记录。
# 009 已设计为幂等（IF NOT EXISTS / DO 块判断），Prisma 重新跑一遍不会出错。
pnpm prisma db execute --stdin <<'SQL'
DELETE FROM "_prisma_migrations"
 WHERE "migration_name" LIKE '009%'
   AND "finished_at" IS NULL;
SQL

pnpm prisma generate
# 自动执行未应用的数据库迁移
pnpm prisma migrate deploy
