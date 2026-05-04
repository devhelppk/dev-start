#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-email-ba-drizzle-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-email-better-auth-drizzle"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_email_ba_drizzle_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating Email + Better Auth + Drizzle overlay output for $expected_name"
  test -f "$app_dir/.env.schema"
  test ! -f "$app_dir/_env.schema"
  test -f "$app_dir/lib/auth.ts"
  test -f "$app_dir/lib/auth-client.ts"
  test -f "$app_dir/lib/db.ts"
  test -f "$app_dir/lib/email.ts"
  test -f "$app_dir/emails/password-reset.tsx"
  test -f "$app_dir/emails/verification.tsx"
  test -f "$app_dir/db/schema/index.ts"
  test -f "$app_dir/db/schema/events.ts"
  test -f "$app_dir/db/schema/auth.ts"
  test -f "$app_dir/drizzle.config.ts"
  test ! -d "$app_dir/prisma"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"drizzle-orm"' "$app_dir/package.json"
  grep -q '"better-auth"' "$app_dir/package.json"
  grep -q 'drizzleAdapter' "$app_dir/lib/auth.ts"
  grep -q 'sendEmail' "$app_dir/lib/auth.ts"
  grep -q 'sendVerificationEmail' "$app_dir/lib/auth.ts"
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding Email + Better Auth + Drizzle app from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --drizzle --auth --email -y --no-install --no-git
)

assert_email_ba_drizzle_shape "$SOURCE_APP" "source-app"

echo "Scaffolding Email + Better Auth + Drizzle app from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --drizzle --auth --email --no-install --no-git
)

assert_email_ba_drizzle_shape "$BUILT_APP" "built-app"

echo "Preparing Email + Better Auth + Drizzle environment"
(
  cd "$BUILT_APP"
  cp .env.schema .env
)

echo "Installing generated Email + Better Auth + Drizzle app dependencies"
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

echo "Running generated Email + Better Auth + Drizzle app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
)

echo "nextjs/base + drizzle + better-auth + email verification passed"
