#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-better-auth-prisma-dev-tooling-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
DEV_LOG="$TMP_DIR/dev.log"
DEV_PORT="3210"
DEV_PID=""
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-better-auth-prisma-dev-tooling"

cleanup() {
  if [[ -n "$DEV_PID" ]] && kill -0 "$DEV_PID" >/dev/null 2>&1; then
    kill "$DEV_PID" >/dev/null 2>&1 || true
    wait "$DEV_PID" >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_overlay_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating Better Auth + Prisma + dev-tooling output for $expected_name"
  test -f "$app_dir/.env.schema"
  test ! -f "$app_dir/_env.schema"
  test -f "$app_dir/lib/auth.ts"
  test -f "$app_dir/lib/auth-client.ts"
  test -f "$app_dir/app/api/auth/[...all]/route.ts"
  test -f "$app_dir/app/sign-in/page.tsx"
  test -f "$app_dir/app/sign-up/page.tsx"
  test -f "$app_dir/app/dashboard/page.tsx"
  test -f "$app_dir/components/sign-in-form.tsx"
  test -f "$app_dir/components/sign-up-form.tsx"
  test -f "$app_dir/components/sign-out-button.tsx"
  test -f "$app_dir/prisma/schema.prisma"
  test -f "$app_dir/prisma.config.ts"
  test -d "$app_dir/.husky"
  test -f "$app_dir/.husky/pre-commit"
  test -x "$app_dir/.husky/pre-commit"
  test ! -d "$app_dir/_husky"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"db:generate"' "$app_dir/package.json"
  grep -q '"db:migrate"' "$app_dir/package.json"
  grep -q '"prepare": "husky"' "$app_dir/package.json"
  grep -q '"precommit": "lint-staged"' "$app_dir/package.json"
  grep -q '"better-auth"' "$app_dir/package.json"
  grep -q '"@better-auth/prisma-adapter"' "$app_dir/package.json"
  grep -q 'BETTER_AUTH_SECRET=' "$app_dir/.env.schema"
  grep -q 'BETTER_AUTH_URL=' "$app_dir/.env.schema"
  grep -q 'model Session' "$app_dir/prisma/schema.prisma"
  grep -q 'model Account' "$app_dir/prisma/schema.prisma"
  grep -q 'model Verification' "$app_dir/prisma/schema.prisma"
}

wait_for_auth_ok() {
  local url="http://127.0.0.1:${DEV_PORT}/api/auth/ok"

  for _ in {1..30}; do
    if curl -fsS "$url" | grep -q '"ok":true'; then
      return 0
    fi
    sleep 1
  done

  echo "Timed out waiting for $url"
  cat "$DEV_LOG"
  return 1
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding Better Auth + Prisma + dev-tooling app from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --prisma --auth --dev-tooling -y --no-install --no-git
)

assert_overlay_shape "$SOURCE_APP" "source-app"

echo "Scaffolding Better Auth + Prisma + dev-tooling app from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --prisma --auth --dev-tooling --no-install
)

assert_overlay_shape "$BUILT_APP" "built-app"

echo "Preparing Better Auth + Prisma environment"
(
  cd "$BUILT_APP"
  cp .env.schema .env
)

echo "Installing generated Better Auth + Prisma + dev-tooling app dependencies"
(
  cd "$BUILT_APP"
  env TMPDIR="$BUN_TMP_DIR" bun install
)

echo "Checking Husky install contract"
(
  cd "$BUILT_APP"
  test -d .git
  test -f .husky/_/h
  test "$(git config --get core.hooksPath)" = ".husky/_"
  bun run precommit
)

echo "Running Better Auth + Prisma + dev-tooling generation contract"
(
  cd "$BUILT_APP"
  bun run db:generate
  test -f generated/prisma/client.ts
)

echo "Running generated Better Auth + Prisma + dev-tooling app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
)

echo "Checking generated Better Auth + Prisma + dev-tooling auth route"
(
  cd "$BUILT_APP"
  bun run dev -- --hostname 127.0.0.1 --port "$DEV_PORT" >"$DEV_LOG" 2>&1 &
  DEV_PID=$!
  wait_for_auth_ok
)

echo "nextjs/base + prisma + better-auth + dev-tooling verification passed"
