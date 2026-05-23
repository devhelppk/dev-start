#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-email-ba-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-email-better-auth"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_email_ba_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating email + Better Auth overlay output for $expected_name"
  test -f "$app_dir/.env.schema"
  test ! -f "$app_dir/_env.schema"
  test -f "$app_dir/lib/email.ts"
  test -f "$app_dir/lib/auth.ts"
  test -f "$app_dir/lib/auth-client.ts"
  test -f "$app_dir/emails/welcome.tsx"
  test -f "$app_dir/emails/layout.tsx"
  test -f "$app_dir/emails/password-reset.tsx"
  test -f "$app_dir/emails/verification.tsx"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"resend"' "$app_dir/package.json"
  grep -q '"@react-email/components"' "$app_dir/package.json"
  grep -q '"react-email"' "$app_dir/package.json"
  grep -q '"email:dev"' "$app_dir/package.json"
  grep -q '"better-auth"' "$app_dir/package.json"
  grep -q 'RESEND_API_KEY=' "$app_dir/.env.schema"
  grep -q 'EMAIL_FROM=' "$app_dir/.env.schema"
  grep -q 'BETTER_AUTH_SECRET=' "$app_dir/.env.schema"
  grep -q 'sendEmail' "$app_dir/lib/auth.ts"
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding email + Better Auth app from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --email --auth --prisma -y --no-install --no-git
)

assert_email_ba_shape "$SOURCE_APP" "source-app"

echo "Scaffolding email + Better Auth app from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --email --auth --prisma --no-install --no-git
)

assert_email_ba_shape "$BUILT_APP" "built-app"

echo "Installing generated email + Better Auth app dependencies"
(
  cd "$BUILT_APP"
  env TMPDIR="$BUN_TMP_DIR" bun install
)

echo "Running Better Auth and Prisma generation contract"
(
  cd "$BUILT_APP"
  bun run db:generate
  test -f generated/prisma/client.ts
)

echo "Running generated email + Better Auth app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
  bun run test
)

echo "nextjs/base + prisma + better-auth + email verification passed"
