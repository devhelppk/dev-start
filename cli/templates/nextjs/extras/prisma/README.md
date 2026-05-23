# Prisma

Adds Prisma ORM with PostgreSQL, including typed JSONB support via `prisma-json-types-generator`. Ships a `docker-compose.yml` so local Postgres is a single command away.

## First-run Setup

```bash
bun run db:up          # start local Postgres (docker-compose, port 5449)
bun run db:migrate     # apply migrations
bun run db:generate    # regenerate the Prisma client
```

No env edits required — `.env.development` and `docker-compose.yml` ship aligned defaults. To use an existing Postgres instance, override `DATABASE_URL` in `.env.development.local` (gitignored).

## Local Database

| Script | What it does |
|---|---|
| `bun run db:up` | Start the docker-compose Postgres in the background |
| `bun run db:down` | Stop and remove the container (volume persists) |
| `bun run db:migrate` | Apply pending migrations (`prisma migrate dev`) |
| `bun run db:migrate:deploy` | Apply migrations non-interactively (CI / production) |
| `bun run db:push` | Push schema without a migration (prototyping only) |
| `bun run db:generate` | Regenerate the Prisma client |
| `bun run db:studio` | Open Prisma Studio |

All scripts are wrapped with `varlock run --` so they see the same env varlock validates.

The compose service binds host port **5449** to avoid colliding with a system Postgres on 5432. Change the port mapping in `docker-compose.yml` and the matching `DATABASE_URL` in `.env.development.local` if you need a different one. Data persists in the named `dev-start-pgdata` volume across `db:down` / `db:up`.

## Key Files

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Database schema with starter `Event` model |
| `prisma.config.ts` | Prisma configuration (datasource URL comes from `varlock`) |
| `lib/prisma.ts` | Shared `PrismaClient` instance for server-side usage |
| `types/prisma-json.d.ts` | `PrismaJson` namespace for typed JSONB columns |
| `docker-compose.yml` | Local Postgres 16 service |

## JSONB Type Safety

The `Event` model includes a `metadata` Json column annotated with `/// [EventMetadata]`. The `prisma-json-types-generator` reads these annotations and maps them to types in the `PrismaJson` namespace.

To add typed JSONB columns to new models:
1. Add a `Json` field to your model.
2. Annotate the line above with `/// [YourTypeName]`.
3. Declare `type YourTypeName = { ... }` in `PrismaJson` namespace in `types/prisma-json.d.ts`.
4. Run `bun run db:generate` to regenerate the client.

Untyped `Json` fields resolve to `unknown` (not `any`) thanks to `allowAny = false`.

## Next Steps

Import `prisma` from `@/lib/prisma` in Server Components, Route Handlers, or Server Actions.
