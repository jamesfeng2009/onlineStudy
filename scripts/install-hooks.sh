#!/usr/bin/env bash
# scripts/install-hooks.sh
# Install project git hooks into .git/hooks/. Safe to re-run.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$ROOT/.git/hooks"
SRC_DIR="$ROOT/scripts"

install_one() {
  local name="$1"
  local src="$SRC_DIR/$name"
  local dst="$HOOKS_DIR/$name"
  if [[ ! -f "$src" ]]; then
    echo "SKIP $name: $src not found"
    return
  fi
  cp "$src" "$dst"
  chmod +x "$dst"
  echo "INSTALLED $name -> $dst"
}

install_one pre-commit

echo ""
echo "Hooks installed. To bypass a hook once: git commit --no-verify"
echo "Uninstall: rm $HOOKS_DIR/pre-commit"
