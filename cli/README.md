# ds-start

Complete functional blocks for Next.js. Start from a production-ready foundation, or bolt blocks onto an existing app with `add`.

## Quick Start

Scaffold a new project with the interactive wizard:

```bash
npx ds-start init my-app
```

The wizard asks what you want to build — recommended production starter, app with auth, or base app — then walks you through module selection with a confirmation summary before scaffolding.

Add modules to an existing project:

```bash
npx ds-start add email
npx ds-start add forms
```

Include modules at scaffold time with flags:

```bash
npx ds-start init my-app --prisma --auth --github-workflows
# or with Clerk auth (no database required)
npx ds-start init my-app --clerk --github-workflows
```

Skip the wizard with the recommended production preset:

```bash
npx ds-start init my-app -y
```

Scaffold the foundation only, no modules:

```bash
npx ds-start init my-app --base
```

## Why ds-start?

ds-start ships **complete functional blocks** (not raw components) plus verified **presets** on a production-ready foundation. Blocks compose shadcn/ui, Better Auth, and similar libraries into end-to-end capabilities with small APIs — **agent-first, developer-friendly**. See [`PHILOSOPHY.md`](../PHILOSOPHY.md).

**Production-ready foundation** — Not a toy starter. You get strict TypeScript, oxlint + oxfmt, Husky pre-commit hooks running lint + format + typecheck, and GitHub Actions CI — all wired up and working from the first commit.

**End-to-end type safety** — Types flow from your database schema through server actions to client components. [Prisma](https://www.prisma.io) generates types from your DB, [next-ts-api](https://github.com/zahinafsar/next-ts-api) ensures your API routes and clients share the same contract, and [varlock](https://varlock.dev) validates environment variables at build time. No `any`, no runtime surprises.

**Functional blocks** — Email, forms, auth, payments, uploads, and more. Each block is a complete capability you can scaffold with `init` or bolt on with `add`. Same templates, same conventions, same result.

**Agent-ready workflows** — Every project ships with structured workflows for coding agents. A development cycle — `/start-prd` to plan, `/start-work` to build, `/handoff` to preserve context, `/start-review` to verify, `/start-pr` to ship — so your coding agent understands project conventions from the first prompt.

## What's Included

### Base Template

| Category | Tech | Link |
|----------|------|------|
| Framework | Next.js 16 (App Router, Turbopack) | [nextjs.org](https://nextjs.org) |
| Language | TypeScript (strict mode) | [typescriptlang.org](https://www.typescriptlang.org) |
| Styling | Tailwind CSS 4 + shadcn/ui | [tailwindcss.com](https://tailwindcss.com) · [ui.shadcn.com](https://ui.shadcn.com) |
| Fonts | Geist Sans + Geist Mono | [vercel.com/font](https://vercel.com/font) |
| API Routes | next-ts-api (end-to-end type safety) | [github](https://github.com/zahinafsar/next-ts-api) |
| URL State | nuqs (type-safe search params) | [nuqs.47ng.com](https://nuqs.47ng.com) |
| Server State | React Query (async state management) | [tanstack.com/query](https://tanstack.com/query) |
| Env Validation | varlock (schema-driven, type-safe) | [varlock.dev](https://varlock.dev) |
| Linting | oxlint + oxfmt | [oxc.rs](https://oxc.rs) |
| Type Checking | tsgo (native TypeScript compiler) | [npm](https://www.npmjs.com/package/@typescript/native-preview) |
| Testing | Vitest | [vitest.dev](https://vitest.dev) |
| Pre-commit | Husky + lint-staged | [typicode.github.io/husky](https://typicode.github.io/husky) |
| Commits | commitlint + cz-git | [commitlint.js.org](https://commitlint.js.org) |
| Theme | Light/dark toggle with next-themes | [github](https://github.com/pacocoursey/next-themes) |

Ships with `Button`, `Card`, `Input`, `Label`, and `Separator` from shadcn/ui. Add more with `bunx shadcn@latest add <component>`.

### Agentic Coding Flow

Every project includes skills that guide your AI coding assistant through a structured development cycle:

| Step | Skill | What it does |
|------|-------|-------------|
| Plan | `/start-prd` | Interview-driven PRD creation with implementation plan |
| Build | `/start-work` | Implement from a PRD, following plan steps sequentially |
| Handoff | `/handoff` | Save session progress for continuity across sessions |
| Review | `/start-review` | Run quality gates + code review (read-only) |
| Ship | `/start-pr` | Commit changes and create a PR |

Plus domain skills: `/next-ts-api` for type-safe APIs, `/vercel-react-best-practices` for performance (64 rules), and `/frontend-design` for production-grade UI.

### Modules

Pre-integrated app features that compose on top of the foundation.

**[Prisma](https://www.prisma.io)** (`--prisma`) — Prisma 6 ORM with PostgreSQL, PrismaPg adapter, typed JSONB via `prisma-json-types-generator`, and a singleton client.

**[Better Auth](https://www.better-auth.com)** (`--auth`) — Full auth system with email/password, Google OAuth, forgot/reset password, route protection via `proxy.ts`, and shadcn/ui forms. Requires `--prisma`.

**[Clerk](https://clerk.com)** (`--clerk`) — Managed authentication via Clerk. No database required. Route protection via `proxy.ts`. Cannot be combined with `--auth`.

**[Stripe](https://stripe.com)** (`--stripe`) — Billing and subscription management with Stripe. Webhook handling, customer portal, and plan management. Requires `--auth` or `--clerk`.

**[Email](https://resend.com)** (`--email`) — Transactional email with Resend and React Email templates. Welcome emails, password resets, and invitations.

**[File Uploads](https://aws.amazon.com/s3)** (`--file-uploads`) — S3-compatible file uploads with presigned URLs. Works with AWS S3, Cloudflare R2, MinIO, Backblaze B2.

**[Zustand](https://zustand.docs.pmnd.rs)** (`--zustand`) — Lightweight client state management. Provider-free, TypeScript-first stores with Redux DevTools support.

**[Forms](https://react-hook-form.com)** (`--forms`) — JSON-driven form renderer with classic, conversational, and multistep view modes. Built on shadcn Form components (react-hook-form + zod). Overridable component map.

**GitHub Workflows** (`--github-workflows`) — CI pipeline: lint, typecheck, build on every PR. Runs on [Blacksmith](https://blacksmith.sh) for faster builds. Includes `varlock scan` for secret leak detection.

**Vercel Deploy** (`--vercel-deploy`) — CD pipeline via [Vercel CLI](https://vercel.com/docs/cli). Preview deploys on push, manual dispatch for production. Implies `--github-workflows`.

## Adding Modules to Existing Projects

Already have a Next.js project? Add modules without re-scaffolding:

```bash
ds-start add email
ds-start add file-uploads
ds-start add zustand
ds-start add forms
ds-start add github-workflows
ds-start add vercel-deploy
```

Smart conflict detection merges package.json, .gitignore, and .env.schema automatically. Prompts for resolution on any file-level conflicts. Best experience on ds-start projects and compatible App Router projects.

## Composability

Modules compose freely with a few rules:

- `--auth` requires `--prisma` (auth uses Prisma as its database adapter)
- `--clerk` cannot be combined with `--auth` (choose one auth provider)
- `--vercel-deploy` implies `--github-workflows` (CD builds on CI)
- `--forms` + `--file-uploads` unlocks the `file` field type in the form renderer
- Everything else is independent

```bash
# Full stack with Better Auth
npx ds-start init my-app --prisma --auth --github-workflows

# Clerk auth (no database needed)
npx ds-start init my-app --clerk --github-workflows

# API-focused
npx ds-start init my-app --prisma --github-workflows

# Minimal + CI
npx ds-start init my-app --github-workflows
```

## Links

- [GitHub](https://github.com/devhelppk/dev-start)
- [Contributing](https://github.com/devhelppk/dev-start/blob/main/CONTRIBUTING.md)
- [Issues](https://github.com/devhelppk/dev-start/issues)

## License

[MIT](https://github.com/devhelppk/dev-start/blob/main/LICENSE)
