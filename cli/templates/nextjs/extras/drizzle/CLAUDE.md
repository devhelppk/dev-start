# Project Instructions

## Database (Drizzle)
- Schema files live in `db/schema/`. Run `bun run db:generate` after schema changes.
- Use `bun run db:push` to push schema to the database during development.
- Use `bun run db:migrate` to run generated migrations in production.
- Import `db` from `@/lib/db` — never instantiate the Drizzle client directly.
- Use String IDs with `@paralleldrive/cuid2` `createId()` for new tables (matches auth patterns).
- For typed JSONB columns, use `.$type<YourType>()` on `jsonb()` columns.
- Drizzle schema types are inferred via `typeof table.$inferSelect` and `typeof table.$inferInsert`.
