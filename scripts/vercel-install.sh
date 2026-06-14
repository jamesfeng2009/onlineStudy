#!/usr/bin/env bash
set -e
pnpm install
pnpm prisma generate
# 自动执行未应用的数据库迁移，确保 schema 与代码一致
pnpm prisma migrate deploy
