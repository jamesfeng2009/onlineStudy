#!/usr/bin/env bash
set -e

# wordnet-lmf-en / better-sqlite3 等 devDep 的 postinstall 会在 Vercel build
# 容器里跑失败（better-sqlite3 找不到 native binding），但 production runtime
# 完全不依赖这些。 --ignore-scripts 跳过所有 postinstall，再用 pnpm rebuild
# 单独跑 esbuild 的 binding 安装。
pnpm install --frozen-lockfile --ignore-scripts
pnpm rebuild esbuild

# 修复 P3009：清理之前在 Supabase 手动执行 009 留下的 failed 记录。
# 009 已设计为幂等（IF NOT EXISTS / DO 块判断），Prisma 重新跑一遍不会出错。
pnpm prisma db execute --stdin <<'SQL'
DELETE FROM "_prisma_migrations"
 WHERE "migration_name" LIKE '009%'
   AND "finished_at" IS NULL;
SQL

pnpm prisma generate

# 023_add_conversation_content 之前在本地通过 run-migration-023.ts 手动建表。
# 首次 migrate deploy 失败（P3018 relation exists）在 _prisma_migrations 留了记录，
# 直接 migrate resolve --applied 会报 P2002（migration_name unique 冲突）。
# 先 DELETE 清理残留记录，再 resolve --applied 插入带正确 checksum 的记录。
pnpm prisma db execute --stdin <<'SQL'
DELETE FROM "_prisma_migrations"
 WHERE "migration_name" = '023_add_conversation_content';
SQL
pnpm prisma migrate resolve --applied 023_add_conversation_content || true

# 自动执行未应用的数据库迁移
pnpm prisma migrate deploy
