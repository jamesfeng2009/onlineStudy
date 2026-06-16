#!/usr/bin/env bash
# First-time setup for the Gemini quiz generator.
#
# Why this exists:
#   LangOria is a solo project but you may be working in an
#   ephemeral Trae sandbox where `~/.zshrc` doesn't survive across
#   workspace restarts. The simplest persistent place to stash
#   GEMINI_API_KEY on this kind of host is the project-local
#   `.env` (or `.env.local`). Both are gitignored, so the secret
#   never lands in a commit.
#
# What it does:
#   1. Prompts for GEMINI_API_KEY with input hidden (no echo).
#   2. Picks a free key from https://aistudio.google.com/apikey
#      if you don't already have one — the URL is printed.
#   3. Writes (or rewrites) GEMINI_API_KEY / GEMINI_MODEL /
#      GEMINI_MAX_COST_USD into the file you choose.
#   4. Preserves any other variables already in that file.
#
# Usage:
#   bash scripts/setup-env.sh                # default: writes .env
#   bash scripts/setup-env.sh .env.local     # write .env.local instead
#
# Re-runnable: subsequent runs just update GEMINI_* lines.

set -euo pipefail

TARGET="${1:-.env}"

if [[ ! -f "$TARGET" ]] && [[ ! -f ".env.example" ]]; then
  echo "✗ neither $TARGET nor .env.example exists in $(pwd)" >&2
  exit 1
fi

# Start from .env.example so the file has all the keys
# (DB / Stripe / Frontend URL) the rest of the app expects,
# then overlay any pre-existing values from $TARGET.
TMP=$(mktemp)
if [[ -f .env.example ]]; then
  cp .env.example "$TMP"
fi
if [[ -f "$TARGET" ]]; then
  # Copy all lines except the three we manage.
  grep -vE '^(GEMINI_API_KEY|GEMINI_MODEL|GEMINI_MAX_COST_USD|GEMINI_COST_PER_1M_IN|GEMINI_COST_PER_1M_OUT)=' "$TARGET" >> "$TMP" || true
fi

# Pull current values from $TARGET (if any) so we can prefill.
CURRENT_KEY=$(grep -E '^GEMINI_API_KEY=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_MODEL=$(grep -E '^GEMINI_MODEL=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_CAP=$(grep -E '^GEMINI_MAX_COST_USD=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)

# Prompt for the secret without echoing it to the terminal.
PROMPT_KEY="Enter GEMINI_API_KEY (https://aistudio.google.com/apikey): "
if [[ -n "$CURRENT_KEY" && "$CURRENT_KEY" != "" ]]; then
  PROMPT_KEY="Enter GEMINI_API_KEY (Enter to keep current ending ...$(printf '%s' "$CURRENT_KEY" | tail -c 6 | tr -d '\n')): "
fi

# `read -s` suppresses echo; `-r` keeps backslashes literal.
read -r -s -p "$PROMPT_KEY" NEW_KEY
echo "" # newline after the silent input

# If user just hit enter, keep the existing key.
if [[ -z "$NEW_KEY" ]]; then
  NEW_KEY="$CURRENT_KEY"
fi

if [[ -z "$NEW_KEY" ]]; then
  echo "✗ GEMINI_API_KEY is empty; aborting." >&2
  rm -f "$TMP"
  exit 1
fi

# Sanity-check the key shape. Real keys start with "AIza" and
# are ~39 chars. We warn but don't block — paid-tier keys
# occasionally have different prefixes.
if [[ ! "$NEW_KEY" =~ ^AIza[A-Za-z0-9_-]{30,}$ ]]; then
  echo "  ! key doesn't look like a typical AIzaSy… key — proceeding anyway"
  echo "    (paid keys from non-Google-AI-Studio paths sometimes differ)"
fi

NEW_MODEL="${CURRENT_MODEL:-gemini-2.5-flash}"
read -r -p "Enter GEMINI_MODEL [${NEW_MODEL}]: " INPUT_MODEL
if [[ -n "$INPUT_MODEL" ]]; then
  NEW_MODEL="$INPUT_MODEL"
fi

NEW_CAP="${CURRENT_CAP:-1.00}"
read -r -p "Enter GEMINI_MAX_COST_USD [${NEW_CAP}]: " INPUT_CAP
if [[ -n "$INPUT_CAP" ]]; then
  NEW_CAP="$INPUT_CAP"
fi

# Drop any previous Gemini block from the temp file (in case
# .env.example had placeholder lines), then append the new values.
sed -i.bak '/^# Gemini (Google AI Studio)/,/^GEMINI_COST_PER_1M_OUT=/d' "$TMP" 2>/dev/null || true
rm -f "$TMP.bak"

cat >> "$TMP" <<EOF

# ============================================
# Gemini (Google AI Studio) — quiz generator
# ============================================
# Filled by scripts/setup-env.sh on $(date -u +%Y-%m-%dT%H:%M:%SZ).
# Free key: https://aistudio.google.com/apikey
# Same model alias for free/paid — keep MAX_COST_USD low.
GEMINI_API_KEY=${NEW_KEY}
GEMINI_MODEL=${NEW_MODEL}
GEMINI_MAX_COST_USD=${NEW_CAP}
GEMINI_COST_PER_1M_IN=0.30
GEMINI_COST_PER_1M_OUT=2.50
EOF

mv "$TMP" "$TARGET"
chmod 600 "$TARGET" # rw for owner only — secret hygiene
echo ""
echo "✓ wrote $TARGET (mode 600)"
echo ""
echo "Test the setup:"
echo "  pnpm tsx scripts/generate-quizzes-gemini.ts --lang=en --count=5 --max-cost=0.10"
