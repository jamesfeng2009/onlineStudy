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
  # Copy all lines except the ones we manage below.
  grep -vE '^(LLM_PROVIDER|GEMINI_API_KEY|GEMINI_MODEL|OPENROUTER_API_KEY|OPENROUTER_MODEL|DOUBAO_API_KEY|DOUBAO_MODEL|LLM_MAX_COST_USD|LLM_COST_PER_1M_IN|LLM_COST_PER_1M_OUT)=' "$TARGET" >> "$TMP" || true
fi

# Pull current values from $TARGET (if any) so we can prefill.
CURRENT_PROVIDER=$(grep -E '^LLM_PROVIDER=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_GEMINI_KEY=$(grep -E '^GEMINI_API_KEY=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_GEMINI_MODEL=$(grep -E '^GEMINI_MODEL=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_OR_KEY=$(grep -E '^OPENROUTER_API_KEY=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_OR_MODEL=$(grep -E '^OPENROUTER_MODEL=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_DOUBAO_KEY=$(grep -E '^DOUBAO_API_KEY=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_DOUBAO_MODEL=$(grep -E '^DOUBAO_MODEL=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)
CURRENT_CAP=$(grep -E '^LLM_MAX_COST_USD=' "$TARGET" 2>/dev/null | head -1 | cut -d= -f2- || true)

# Choose provider first. Defaults to gemini if the user just hits enter.
echo ""
echo "Which LLM provider?"
echo "  1) gemini      — Google AI Studio (NOT reachable from mainland China)"
echo "  2) openrouter  — Unified router, works in CN, free tier available"
echo "  3) doubao      — 字节火山引擎 Ark, China-direct, real-name KYC"
echo ""
read -r -p "Enter choice [1]: " PROVIDER_CHOICE
case "${PROVIDER_CHOICE:-1}" in
  2|openrouter) NEW_PROVIDER="openrouter" ;;
  3|doubao)     NEW_PROVIDER="doubao" ;;
  *)            NEW_PROVIDER="gemini" ;;
esac

# Prompt for the secret without echoing it to the terminal.
case "$NEW_PROVIDER" in
  openrouter) KEY_PROMPT="Enter OPENROUTER_API_KEY (https://openrouter.ai/keys): " ;;
  doubao)     KEY_PROMPT="Enter DOUBAO_API_KEY (https://www.volcengine.com/product/ark): " ;;
  *)          KEY_PROMPT="Enter GEMINI_API_KEY (https://aistudio.google.com/apikey): " ;;
esac
case "$NEW_PROVIDER" in
  openrouter) CURRENT_KEY="$CURRENT_OR_KEY" ;;
  doubao)     CURRENT_KEY="$CURRENT_DOUBAO_KEY" ;;
  *)          CURRENT_KEY="$CURRENT_GEMINI_KEY" ;;
esac
if [[ -n "$CURRENT_KEY" && "$CURRENT_KEY" != "" ]]; then
  KEY_PROMPT="${KEY_PROMPT%? } (Enter to keep current ending ...$(printf '%s' "$CURRENT_KEY" | tail -c 6 | tr -d '\n')): "
fi

# `read -s` suppresses echo; `-r` keeps backslashes literal.
read -r -s -p "$KEY_PROMPT" NEW_KEY
echo "" # newline after the silent input

# If user just hit enter, keep the existing key.
if [[ -z "$NEW_KEY" ]]; then
  NEW_KEY="$CURRENT_KEY"
fi

if [[ -z "$NEW_KEY" ]]; then
  echo "✗ API key is empty; aborting." >&2
  rm -f "$TMP"
  exit 1
fi

# Sanity-check the key shape. Gemini starts with "AIza",
# OpenRouter / Doubao start with "sk-or-" / random alnum.
if [[ "$NEW_PROVIDER" == "gemini" ]] && [[ ! "$NEW_KEY" =~ ^AIza[A-Za-z0-9_-]{30,}$ ]]; then
  echo "  ! key doesn't look like a typical AIzaSy… key — proceeding anyway"
  echo "    (paid keys from non-Google-AI-Studio paths sometimes differ)"
fi

# Pick model default per provider.
case "$NEW_PROVIDER" in
  openrouter) NEW_MODEL="${CURRENT_OR_MODEL:-google/gemini-2.5-flash}" ;;
  doubao)     NEW_MODEL="${CURRENT_DOUBAO_MODEL:-doubao-seed-2.0-mini}" ;;
  *)          NEW_MODEL="${CURRENT_GEMINI_MODEL:-gemini-2.5-flash}" ;;
esac
read -r -p "Enter model [${NEW_MODEL}]: " INPUT_MODEL
if [[ -n "$INPUT_MODEL" ]]; then
  NEW_MODEL="$INPUT_MODEL"
fi

NEW_CAP="${CURRENT_CAP:-1.00}"
read -r -p "Enter LLM_MAX_COST_USD [${NEW_CAP}]: " INPUT_CAP
if [[ -n "$INPUT_CAP" ]]; then
  NEW_CAP="$INPUT_CAP"
fi

# Drop any previous LLM block from the temp file (in case
# .env.example had placeholder lines), then append the new values.
sed -i.bak '/^# ====/,/^LLM_COST_PER_1M_OUT=/d' "$TMP" 2>/dev/null || true
rm -f "$TMP.bak"

cat >> "$TMP" <<EOF

# ============================================
# LLM provider (used by scripts/generate-quizzes-gemini.ts)
# ============================================
# Filled by scripts/setup-env.sh on $(date -u +%Y-%m-%dT%H:%M:%SZ).
# Get a key from the URL matching LLM_PROVIDER, then paste it into
# the matching _API_KEY variable. Same-model-name caveat for gemini:
# gemini-2.5-flash is the same alias for free/paid keys, so keep
# LLM_MAX_COST_USD low if you bind a card.
LLM_PROVIDER=${NEW_PROVIDER}
GEMINI_API_KEY=${CURRENT_GEMINI_KEY}
GEMINI_MODEL=${CURRENT_GEMINI_MODEL:-gemini-2.5-flash}
OPENROUTER_API_KEY=${CURRENT_OR_KEY}
OPENROUTER_MODEL=${CURRENT_OR_MODEL:-google/gemini-2.5-flash}
DOUBAO_API_KEY=${CURRENT_DOUBAO_KEY}
DOUBAO_MODEL=${CURRENT_DOUBAO_MODEL:-doubao-seed-2.0-mini}
LLM_MAX_COST_USD=${NEW_CAP}
LLM_COST_PER_1M_IN=0.30
LLM_COST_PER_1M_OUT=2.50
EOF

# If the active provider's key was just updated, also write it to
# its dedicated variable (the block above preserves the others).
# We use sed in-place because we want only the matching line
# of the active provider to change.
if [[ "$NEW_PROVIDER" == "gemini" ]]; then
  sed -i.bak "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=${NEW_KEY}|" "$TMP"
elif [[ "$NEW_PROVIDER" == "openrouter" ]]; then
  sed -i.bak "s|^OPENROUTER_API_KEY=.*|OPENROUTER_API_KEY=${NEW_KEY}|" "$TMP"
else
  sed -i.bak "s|^DOUBAO_API_KEY=.*|DOUBAO_API_KEY=${NEW_KEY}|" "$TMP"
fi
# Always write the freshly-typed model to its dedicated variable.
if [[ "$NEW_PROVIDER" == "gemini" ]]; then
  sed -i.bak "s|^GEMINI_MODEL=.*|GEMINI_MODEL=${NEW_MODEL}|" "$TMP"
elif [[ "$NEW_PROVIDER" == "openrouter" ]]; then
  sed -i.bak "s|^OPENROUTER_MODEL=.*|OPENROUTER_MODEL=${NEW_MODEL}|" "$TMP"
else
  sed -i.bak "s|^DOUBAO_MODEL=.*|DOUBAO_MODEL=${NEW_MODEL}|" "$TMP"
fi
rm -f "$TMP.bak"

mv "$TMP" "$TARGET"
chmod 600 "$TARGET" # rw for owner only — secret hygiene
echo ""
echo "✓ wrote $TARGET (mode 600)"
echo ""
echo "Active provider: $NEW_PROVIDER  model: $NEW_MODEL"
echo "Test the setup:"
echo "  pnpm tsx scripts/generate-quizzes-gemini.ts --lang=en --count=5 --max-cost=0.10"
