#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d /tmp/dev-start-nextjs-stripe-ba-drizzle-XXXXXX)"
SOURCE_APP="$TMP_DIR/source-app"
BUILT_APP="$TMP_DIR/built-app"
BUN_TMP_DIR="$ROOT_DIR/.tmp/verify-nextjs-stripe-better-auth-drizzle"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

assert_stripe_ba_drizzle_shape() {
  local app_dir="$1"
  local expected_name="$2"

  echo "Validating Stripe + Better Auth + Drizzle overlay output for $expected_name"
  test -f "$app_dir/.env.schema"
  test ! -f "$app_dir/_env.schema"
  test -f "$app_dir/lib/auth.ts"
  test -f "$app_dir/lib/auth-client.ts"
  test -f "$app_dir/lib/billing.ts"
  test -f "$app_dir/lib/db.ts"
  test -f "$app_dir/app/billing/page.tsx"
  test -f "$app_dir/components/pricing-card.tsx"
  test -f "$app_dir/components/billing-actions.tsx"
  test -f "$app_dir/db/schema/index.ts"
  test -f "$app_dir/db/schema/events.ts"
  test -f "$app_dir/db/schema/auth.ts"
  test -f "$app_dir/drizzle.config.ts"
  test ! -d "$app_dir/prisma"
  grep -q "\"name\": \"$expected_name\"" "$app_dir/package.json"
  grep -q '"@better-auth/stripe"' "$app_dir/package.json"
  grep -q '"stripe"' "$app_dir/package.json"
  grep -q '"drizzle-orm"' "$app_dir/package.json"
  grep -q 'STRIPE_SECRET_KEY=' "$app_dir/.env.schema"
  grep -q 'STRIPE_WEBHOOK_SECRET=' "$app_dir/.env.schema"
  grep -q 'STRIPE_PUBLISHABLE_KEY=' "$app_dir/.env.schema"
  grep -q 'export const subscription' "$app_dir/db/schema/auth.ts"
  grep -q 'drizzleAdapter' "$app_dir/lib/auth.ts"
  grep -q 'stripeClient' "$app_dir/lib/auth.ts"
}

echo "Building CLI"
(
  cd "$ROOT_DIR"
  mkdir -p "$BUN_TMP_DIR"
  bun run build
)

echo "Scaffolding Stripe + Better Auth + Drizzle app from source"
(
  cd "$ROOT_DIR"
  bun cli/src/index.ts -- init "$SOURCE_APP" --drizzle --auth --stripe -y --no-install --no-git
)

assert_stripe_ba_drizzle_shape "$SOURCE_APP" "source-app"

echo "Scaffolding Stripe + Better Auth + Drizzle app from built output"
(
  cd "$ROOT_DIR"
  node cli/dist/index.js init "$BUILT_APP" --drizzle --auth --stripe --no-install --no-git
)

assert_stripe_ba_drizzle_shape "$BUILT_APP" "built-app"

echo "Preparing Stripe + Better Auth + Drizzle environment"
(
  cd "$BUILT_APP"
  cp .env.schema .env
)

echo "Installing generated Stripe + Better Auth + Drizzle app dependencies"
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

echo "Running generated Stripe + Better Auth + Drizzle app quality gates"
(
  cd "$BUILT_APP"
  bun run build
  bun run lint
  bun run typecheck
)

echo "nextjs/base + drizzle + better-auth + stripe verification passed"
