#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-stripe-ba-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-stripe-better-auth"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_stripe_ba_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating Stripe + Better Auth overlay output for $expected_name"
  test -f "$app_dir/.env.schema"
  test ! -f "$app_dir/_env.schema"
  test -f "$app_dir/lib/auth.ts"
  test -f "$app_dir/lib/auth-client.ts"
  test -f "$app_dir/lib/billing.ts"
  test -f "$app_dir/app/billing/page.tsx"
  test -f "$app_dir/components/pricing-card.tsx"
  test -f "$app_dir/components/billing-actions.tsx"
  test -f "$app_dir/prisma/schema.prisma"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"@better-auth/stripe"' "$app_dir/package.json"
  grep -q '"stripe"' "$app_dir/package.json"
  grep -q 'STRIPE_SECRET_KEY=' "$app_dir/.env.schema"
  grep -q 'STRIPE_WEBHOOK_SECRET=' "$app_dir/.env.schema"
  grep -q 'STRIPE_PUBLISHABLE_KEY=' "$app_dir/.env.schema"
  grep -q 'model Subscription' "$app_dir/prisma/schema.prisma"
  grep -q 'stripeClient' "$app_dir/lib/auth.ts"
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding Stripe + Better Auth app from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --prisma --auth --stripe -y --no-install --no-git
)

assert_stripe_ba_shape "$SOURCE_APP" "source-app"

echo "Scaffolding Stripe + Better Auth app from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --prisma --auth --stripe --no-install --no-git
)

assert_stripe_ba_shape "$BUILT_APP" "built-app"

echo "Installing generated Stripe + Better Auth app dependencies"
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

echo "Running generated Stripe + Better Auth app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
  bun run test
)

echo "nextjs/base + prisma + better-auth + stripe verification passed"
