#!/usr/bin/env bash
set -e
pnpm install
pnpm prisma generate
# 自动执行未应用的数据库迁移（已 baseline 后启用）
# pnpm prisma migrate deploy
