#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-drizzle-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
DEV_LOG="$TMP_DIR/dev.log"
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-drizzle"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_overlay_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating Drizzle overlay output for $expected_name"
  test -f "$app_dir/.env.schema"
  test ! -f "$app_dir/_env.schema"
  test -f "$app_dir/db/schema/index.ts"
  test -f "$app_dir/db/schema/events.ts"
  test -f "$app_dir/drizzle.config.ts"
  test -f "$app_dir/lib/db.ts"
  test -f "$app_dir/.oxlintrc.json"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"db:generate"' "$app_dir/package.json"
  grep -q '"db:migrate"' "$app_dir/package.json"
  grep -q '"db:push"' "$app_dir/package.json"
  grep -q '"db:studio"' "$app_dir/package.json"
  grep -q '"drizzle-orm"' "$app_dir/package.json"
  grep -q '"drizzle-kit"' "$app_dir/package.json"
  grep -q '"pg"' "$app_dir/package.json"
  grep -q 'DATABASE_URL=postgresql://' "$app_dir/.env.schema"
  grep -q 'postgresql' "$app_dir/drizzle.config.ts"
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding Drizzle app from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --drizzle -y --no-install --no-git
)

assert_overlay_shape "$SOURCE_APP" "source-app"

echo "Scaffolding Drizzle app from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --drizzle --no-install --no-git
)

assert_overlay_shape "$BUILT_APP" "built-app"

echo "Preparing Drizzle environment"
(
  cd "$BUILT_APP"
  cp .env.schema .env
)

echo "Installing generated Drizzle app dependencies"
(
  cd "$BUILT_APP"
  env TMPDIR="$BUN_TMP_DIR" bun install
)

echo "Running Drizzle generate contract"
(
  cd "$BUILT_APP"
  bun run db:generate
  test -d db/migrations
)

echo "Running generated Drizzle app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
)

echo "Checking generated Drizzle app dev server"
(
  cd "$BUILT_APP"
  status=0
  timeout 20s bun run dev >"$DEV_LOG" 2>&1 || status=$?
  if [[ "$status" -ne 0 && "$status" -ne 124 ]]; then
    cat "$DEV_LOG"
    exit "$status"
  fi
)

echo "nextjs/base + drizzle verification passed"
