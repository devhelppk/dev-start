#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-base-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
DEV_LOG="$TMP_DIR/dev.log"
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-base"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_scaffold_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating scaffold output for $expected_name"
  test -f "$app_dir/.gitignore"
  test -f "$app_dir/.oxlintrc.json"
  test -f "$app_dir/.oxfmtrc.json"
  test -f "$app_dir/components/.gitkeep"
  test -f "$app_dir/hooks/.gitkeep"
  test -f "$app_dir/lib/.gitkeep"
  test -f "$app_dir/public/.gitkeep"
  test ! -f "$app_dir/_gitignore"
  test ! -f "$app_dir/_oxlintrc.json"
  test ! -f "$app_dir/_oxfmtrc.json"
  test -f "$app_dir/.env.schema"
  test -f "$app_dir/.env.development"
  test -f "$app_dir/.env.staging"
  test -f "$app_dir/.env.production"
  test ! -f "$app_dir/_env.development"
  grep -q '@currentEnv=$APP_ENV' "$app_dir/.env.schema"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"jsdom"' "$app_dir/package.json"
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --base -y --no-install --no-git
)

assert_scaffold_shape "$SOURCE_APP" "source-app"

echo "Scaffolding from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --base -y --no-install --no-git
)

assert_scaffold_shape "$BUILT_APP" "built-app"

echo "Installing generated app dependencies"
(
  cd "$BUILT_APP"
  env TMPDIR="$BUN_TMP_DIR" bun install
)

echo "Running generated app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
  bun run test
)

echo "Checking generated app dev server"
(
  cd "$BUILT_APP"
  status=0
  timeout 20s bun run dev >"$DEV_LOG" 2>&1 || status=$?
  if [[ "$status" -ne 0 && "$status" -ne 124 ]]; then
    cat "$DEV_LOG"
    exit "$status"
  fi
)

echo "nextjs/base verification passed"
