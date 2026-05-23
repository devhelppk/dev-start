# ds-start

## 0.4.0

### Minor Changes

- Close the first-run friction gap and ship a dashboard shell. A fresh scaffold now works end-to-end without manual env edits: `bun run db:up && bun run db:migrate` brings up local Postgres on port 5449, and an authed user lands in a real dashboard with sidebar + topbar navigation. Highlights: varlock multi-env (`@currentEnv=$APP_ENV` with committed `.env.{development,staging,production}`), Prisma 7 alignment (varlock-wrapped `db:*` scripts, datasource provider-only), docker-compose for local Postgres, codegen-owned auth schema (no more `auth:generate`), pre-shipped shadcn primitives (sidebar/sheet/tooltip/skeleton/dropdown-menu/avatar/breadcrumb), billing relocated under `/dashboard/billing` with conditional sidebar nav, generic SaaS landing with authed-user redirect, and updated CLAUDE.md docs (env file matrix, varlock-wrap rule, DB-aware gating, codegen-owned schema).

## 0.3.0

### Minor Changes

- 23660f2: Add interactive init wizard with three scaffold paths (recommended production starter, app with auth, base app), shared module/preset definitions, and --base flag. Align brand language across CLI and templates.

## 0.2.0

### Minor Changes

- Add forms module with JSON-driven form renderer, 3 view modes (classic, conversational, multistep), and file-uploads composability. Rebrand to composable Next.js app kit.

## 0.1.0

### Minor Changes

- Add `ds-start add <extra>` subcommand, replace ESLint + Prettier with oxlint + oxfmt, add nuqs + React Query to base template, and add Zustand extra.

## 0.0.8

### Patch Changes

- Add email extra (Resend + React Email), file-uploads extra (S3-compatible presigned uploads), upgrade base template tooling (tsgo, commitlint, Vitest, parallel CI), and fix TypeScript 6 / tsgo build errors in base template.

## 0.0.7

### Patch Changes

- Add Stripe billing extra with Better Auth and Clerk variants. Fix forgetPassword API rename, BETTER_AUTH_SECRET placeholder length, prisma eslint config missing ignores, and stale verify script assertions.

## 0.0.6

### Patch Changes

- Fix varlock NODE_ENV false positive, add auto-generated files to eslint ignores, and merge README.md from extras instead of overwriting

## 0.0.5

### Patch Changes

- Add Clerk auth as alternative to Better Auth

## 0.0.4

### Patch Changes

- Add marketing & docs site, shadcn skill, minimal scrollbars, logo, and update homepage link

## 0.0.3

### Patch Changes

- Readme, branding and cli prompt updates

## 0.0.2

### Patch Changes

- Initial nextjs templates scaffold
