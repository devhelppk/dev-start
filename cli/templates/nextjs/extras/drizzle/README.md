# Drizzle

Adds Drizzle ORM with PostgreSQL, a TypeScript-first, SQL-like ORM.

## First-run Setup

```bash
# Set your DATABASE_URL in .env.schema
bun run env:check
bun run db:push
```

## Key Files

| File | Purpose |
|---|---|
| `db/schema/` | Database schema files (TypeScript) |
| `db/schema/events.ts` | Starter `events` table |
| `drizzle.config.ts` | Drizzle Kit configuration |
| `lib/db.ts` | Shared Drizzle client instance for server-side usage |

## Adding Tables

1. Create a new file in `db/schema/` (e.g., `db/schema/posts.ts`).
2. Define your table using `pgTable()` from `drizzle-orm/pg-core`.
3. Re-export from `db/schema/index.ts`.
4. Run `bun run db:generate` to generate a migration.
5. Run `bun run db:push` (dev) or `bun run db:migrate` (prod) to apply.

## Scripts

| Script | Description |
|---|---|
| `db:generate` | Generate SQL migration from schema changes |
| `db:migrate` | Run pending migrations |
| `db:push` | Push schema directly (dev only) |
| `db:studio` | Open Drizzle Studio (browser-based DB viewer) |

## Next Steps

Import `db` from `@/lib/db` in Server Components, Route Handlers, or Server Actions.
