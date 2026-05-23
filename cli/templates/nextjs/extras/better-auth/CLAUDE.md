# Project Instructions

## Auth

- `lib/auth.ts` — Server config with the database adapter, Google OAuth, and password reset handler
- `lib/auth-client.ts` — React client instance
- `proxy.ts` — Route protection via optimistic cookie check (Next.js 16)
- Auth pages: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/dashboard`
- Google OAuth is optional — disabled when `GOOGLE_CLIENT_ID` is empty
- Password reset uses a console.log stub — replace with a real email transport before deploying

## Schema is codegen-owned

The auth tables in `prisma/schema.prisma` (or `db/schema/auth.ts` with Drizzle) are emitted by `ds-start` from fragments under `cli/src/codegen/fragments/nextjs/`. **Do not run `@better-auth/cli generate`** — there is no `auth:generate` script and the CLI is not a project dependency. To change the auth schema:

1. Edit the relevant fragment (e.g. `better-auth.ts`, `stripe.ts`).
2. Re-scaffold the project, or use the future `ds-start codegen` subcommand.

`lib/auth.ts` and `lib/auth-client.ts` are likewise emitted from fragments. Edit those files in place only for project-specific glue (analytics hooks, etc.); structural changes belong in the fragments so they survive a re-scaffold.

## DB-aware route gating

Use `proxy.ts` for fast cookie-only checks and a **server-component layout** for definitive, DB-aware gating. Both run on every request — proxy is optimistic (no DB hit), the layout is authoritative.

```tsx
// app/dashboard/layout.tsx
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  return <>{children}</>
}
```

When gating on plan, role, or onboarding state, do the check in the layout — it has the session and can hit the DB. The proxy stays plain cookie presence.

## Auth Skills
- `/better-auth-best-practices` — Configure Better Auth server and client, database adapters, sessions, plugins, and environment variables.
