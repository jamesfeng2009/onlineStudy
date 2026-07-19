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
# 首次 migrate deploy 失败（P3018）在 _prisma_migrations 留了 failed 记录。
# 清理 failed 记录后，migrate deploy 重新执行 023（SQL 已幂等化，IF NOT EXISTS / DO 块，
# 表已存在不会报错），Prisma 写入 applied 记录，后续部署正常跳过。
pnpm prisma db execute --stdin <<'SQL'
DELETE FROM "_prisma_migrations"
 WHERE "migration_name" = '023_add_conversation_content';
SQL

# 自动执行未应用的数据库迁移
pnpm prisma migrate deploy
