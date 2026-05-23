# Project Instructions

## Database (Prisma)
- Schema lives in `prisma/schema.prisma`. Run `bun run db:generate` after schema changes.
- Use `bun run db:migrate -- --name <name>` to create migrations.
- Import `prisma` from `@/lib/prisma` — never instantiate `PrismaClient` directly.
- Use String IDs with `@default(cuid())` for new models (matches auth patterns).
- For JSONB columns, annotate with `/// [TypeName]` above the `Json` field, then declare the matching type in the `PrismaJson` namespace in `types/prisma-json.d.ts`.
- `prisma-json-types-generator` enforces typed JSON — untyped `Json` fields resolve to `unknown`.

## Local Postgres (docker-compose)
- `bun run db:up` starts the bundled Postgres 16 (host port 5449). `db:down` stops it. Data persists in the `dev-start-pgdata` named volume.
- The `DATABASE_URL` in `.env.development` matches the compose defaults — no manual env edits needed on first scaffold.
- To target a different local Postgres, override `DATABASE_URL` in `.env.development.local` (gitignored).

## Env access
- `lib/prisma.ts` reads `DATABASE_URL` via `ENV.DATABASE_URL` from `varlock/env`. Do not reintroduce `dotenv`.
- All `db:*` scripts run under `varlock run --` so Prisma CLI sees the validated env.
- `prisma.config.ts` calls `env("DATABASE_URL")` from `prisma/config` — varlock populates `process.env` before that runs. `datasource db` in `schema.prisma` no longer declares `url` (Prisma 7 — `prisma.config.ts` is the sole datasource source).
