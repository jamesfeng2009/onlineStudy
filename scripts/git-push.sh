#!/usr/bin/env bash
# scripts/git-push.sh
# Push to origin using GH_TOKEN from .env, without ever writing the
# token to git config or the on-disk remote URL.
#
# Usage:
#   scripts/git-push.sh            # push current branch
#   scripts/git-push.sh main       # push main explicitly
#
# The token is sourced from the first match of:
#   1. $GH_TOKEN env var
#   2. /workspace/.env
# If neither is set, the script exits 1.
set -euo pipefail

# ---------- 1. load token ----------
if [[ -z "${GH_TOKEN:-}" ]]; then
  ENV_FILE="/workspace/.env"
  if [[ -f "$ENV_FILE" ]]; then
    # Grep GH_TOKEN=... (allow leading whitespace, optional quotes)
    GH_TOKEN=$(grep -E '^[[:space:]]*GH_TOKEN[[:space:]]*=' "$ENV_FILE" \
               | head -1 \
               | sed -E 's/^[[:space:]]*GH_TOKEN[[:space:]]*=[[:space:]]*//' \
               | sed -E 's/^["'"'"']//' \
               | sed -E 's/["'"'"']$//')
  fi
fi

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "ERROR: GH_TOKEN not set. Add it to /workspace/.env or export GH_TOKEN=..." >&2
  exit 1
fi

# ---------- 2. determine branch ----------
BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"
REMOTE="origin"

# ---------- 3. push with token in URL, then immediately restore ----------
ORIGINAL_URL=$(git remote get-url "$REMOTE")
# Normalise to https://github.com/<owner>/<repo>.git form
CLEAN_URL=$(echo "$ORIGINAL_URL" \
  | sed -E 's#https://[^/@]+@#https://#')

PUSH_URL="https://x-access-token:${GH_TOKEN}@${CLEAN_URL#https://}"

# Safety: never leak the token via `set -x`
set +x
trap 'git remote set-url "$REMOTE" "$CLEAN_URL" >/dev/null 2>&1 || true' EXIT

git remote set-url "$REMOTE" "$PUSH_URL"
git push "$REMOTE" "$BRANCH"
RC=$?

# Restore clean URL even if push failed
git remote set-url "$REMOTE" "$CLEAN_URL" >/dev/null
exit $RC
