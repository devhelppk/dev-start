# Better Auth

Adds authentication with Better Auth, backed by Prisma as the database adapter. Includes email/password auth, Google OAuth, password reset flow, and route protection via `proxy.ts`.

## First-run Setup

```bash
# Set BETTER_AUTH_SECRET and BETTER_AUTH_URL in .env.development (DATABASE_URL
# already points at the bundled docker-compose Postgres on port 5449).
bun run db:up
bun run db:migrate -- --name init
bun run db:generate
```

Generate a real secret: `openssl rand -base64 32`

> **Schema is codegen-owned.** The auth tables in `prisma/schema.prisma`
> (or `db/schema/auth.ts` with Drizzle) are emitted by `ds-start` from
> fragments under `cli/src/codegen/`. There is no `auth:generate` script —
> do not run `@better-auth/cli generate`. To change the auth schema, edit
> the fragments and re-scaffold (or use a future `ds-start codegen`
> subcommand).

### Google OAuth (optional)

1. Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Set authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.schema`

Google sign-in is disabled when these variables are empty.

### Password Reset

The `sendResetPassword` handler in `lib/auth.ts` uses `console.log` by default. To test locally, submit the forgot password form and copy the reset URL from your terminal. Replace the handler with a real email transport (Resend, Nodemailer, etc.) before deploying.

## Key Files

| File | Purpose |
|---|---|
| `lib/auth.ts` | Server config: Prisma adapter, email/password, Google OAuth, password reset |
| `lib/auth-client.ts` | React client instance |
| `app/api/auth/[...all]/route.ts` | Auth API handler |
| `app/sign-in/page.tsx` | Sign-in page |
| `app/sign-up/page.tsx` | Sign-up page |
| `app/forgot-password/page.tsx` | Request password reset |
| `app/reset-password/page.tsx` | Set new password (from email link) |
| `app/dashboard/page.tsx` | Authenticated dashboard |
| `proxy.ts` | Route protection — redirects unauthenticated users |
| `components/sign-in-form.tsx` | Sign-in form with Google OAuth + password toggle |
| `components/sign-up-form.tsx` | Sign-up form with Google OAuth + password toggle |
| `components/forgot-password-form.tsx` | Forgot password form |
| `components/reset-password-form.tsx` | Reset password form with confirm field |
| `components/sign-out-button.tsx` | Sign-out button with loading state |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret (min 32 chars) |
| `BETTER_AUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

## Route Protection

`proxy.ts` (Next.js 16) performs optimistic cookie-based session checks:

- `/dashboard` and sub-routes require authentication — redirects to `/sign-in`
- Auth pages (`/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`) redirect authenticated users to `/dashboard`
- The server-side `getSession()` call in the dashboard page is the authoritative check

## Verification

Scaffold verification covers dependency install, Prisma client generation, `build`, `lint`, `typecheck`, and a `/api/auth/ok` smoke check.

## Next Steps

Use the `/better-auth-best-practices` skill for guidance on adding plugins, additional social providers, or session management.
