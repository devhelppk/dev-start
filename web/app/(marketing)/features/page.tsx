import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toolLogos } from "@/lib/tool-logos"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Foundation, functional blocks, and agent-first APIs — everything in the ds-start kit.",
}

const baseStack = [
  {
    name: "Next.js 16",
    detail: "App Router, Turbopack, React Server Components",
    href: "https://nextjs.org",
  },
  {
    name: "TypeScript",
    detail: "Strict mode, type-checked with tsgo (native compiler)",
    href: "https://www.typescriptlang.org",
  },
  {
    name: "Tailwind CSS 4",
    detail: "Utility-first CSS with shadcn/ui components",
    href: "https://tailwindcss.com",
  },
  {
    name: "shadcn/ui",
    detail: "Button, Card, Input, Label, Separator pre-installed",
    href: "https://ui.shadcn.com",
  },
  {
    name: "nuqs",
    detail: "Type-safe URL state management for search params",
    href: "https://nuqs.47ng.com",
  },
  {
    name: "React Query",
    detail: "Server/async state management with caching and devtools",
    href: "https://tanstack.com/query",
  },
  {
    name: "next-ts-api",
    detail: "End-to-end type-safe API routes and client",
    href: "https://github.com/zahinafsar/next-ts-api",
  },
  {
    name: "varlock",
    detail: "Schema-driven env validation and type-safe access",
    href: "https://varlock.dev",
  },
  {
    name: "Vitest",
    detail: "Fast unit testing with jsdom environment",
    href: "https://vitest.dev",
  },
  {
    name: "oxlint + oxfmt",
    detail: "Blazing-fast linting and formatting powered by Oxc",
    href: "https://oxc.rs",
  },
  {
    name: "Husky + lint-staged",
    detail: "Pre-commit hooks run lint, format, typecheck, and test",
    href: "https://typicode.github.io/husky",
  },
  {
    name: "commitlint + cz-git",
    detail: "Conventional commits enforced with interactive prompts",
    href: "https://commitlint.js.org",
  },
  {
    name: "Geist Sans + Mono",
    detail: "Clean typography by Vercel",
    href: "https://vercel.com/font",
  },
  {
    name: "next-themes",
    detail: "Light/dark toggle with system preference support",
    href: "https://github.com/pacocoursey/next-themes",
  },
] satisfies ReadonlyArray<{ name: string; detail: string; href: string }>

const modules = [
  {
    flag: "--prisma",
    name: "Prisma",
    description:
      "Prisma 6 ORM with PostgreSQL, PrismaPg adapter, typed JSONB via prisma-json-types-generator, and a singleton client.",
    href: "https://www.prisma.io",
  },
  {
    flag: "--auth",
    name: "Better Auth",
    description:
      "Full authentication system with email/password, Google OAuth, forgot/reset password, route protection, and shadcn/ui forms. Requires --prisma.",
    href: "https://www.better-auth.com",
  },
  {
    flag: "--clerk",
    name: "Clerk",
    description:
      "Managed authentication with pre-built sign-in/sign-up components, route protection, and organization support. No database required.",
    href: "https://clerk.com",
  },
  {
    flag: "--github-workflows",
    name: "GitHub Workflows",
    description:
      "CI pipeline for GitHub Actions: lint, typecheck, build on every PR. Runs on Blacksmith for faster builds. Includes varlock scan for secret leak detection.",
    href: "https://github.com/features/actions",
  },
  {
    flag: "--stripe",
    name: "Stripe",
    description:
      "Billing and subscription management with Stripe. Includes webhook handling, customer portal, and plan management. Works with both Better Auth and Clerk. Requires --auth or --clerk.",
    href: "https://stripe.com",
  },
  {
    flag: "--email",
    name: "Email",
    description:
      "Transactional email with Resend for delivery and React Email for type-safe, previewable templates. Welcome emails, password resets, and invitations out of the box.",
    href: "https://resend.com",
  },
  {
    flag: "--file-uploads",
    name: "File Uploads",
    description:
      "S3-compatible file uploads with presigned URLs, upload helpers, and a ready-made FileUpload component. Works with AWS S3, Cloudflare R2, MinIO, and Backblaze B2.",
    href: "https://aws.amazon.com/s3",
  },
  {
    flag: "--zustand",
    name: "Zustand",
    description:
      "Lightweight client state management. Provider-free, TypeScript-first stores with Redux DevTools support via devtools middleware.",
    href: "https://zustand.docs.pmnd.rs",
  },
  {
    flag: "--forms",
    name: "Forms",
    description:
      "JSON-driven form renderer with classic, conversational, and multistep view modes. Define fields as a typed config, get validation and layout for free. Built on shadcn Form components (react-hook-form + zod). Overridable component map for custom field types.",
    href: "https://react-hook-form.com",
  },
  {
    flag: "--vercel-deploy",
    name: "Vercel Deploy",
    description:
      "CD pipeline via Vercel CLI. Preview deploys on push to main, manual dispatch for production. Implies --github-workflows.",
    href: "https://vercel.com",
  },
] satisfies ReadonlyArray<{
  flag: string
  name: string
  description: string
  href: string
}>

const composabilityRules = [
  {
    rule: "--auth requires --prisma",
    reason: "Better Auth uses Prisma as its database adapter.",
  },
  {
    rule: "--clerk works independently",
    reason: "Clerk manages users externally — no database required.",
  },
  {
    rule: "--clerk and --auth are mutually exclusive",
    reason: "One auth provider per project.",
  },
  {
    rule: "--stripe requires --auth or --clerk",
    reason: "Billing needs an auth provider to associate subscriptions with users.",
  },
  {
    rule: "--vercel-deploy implies --github-workflows",
    reason: "CD builds on the CI pipeline.",
  },
  {
    rule: "--forms + --file-uploads enables file field",
    reason:
      "The file field type uses the FileUpload component from the file-uploads module.",
  },
  {
    rule: "Everything else is independent",
    reason:
      "--email, --file-uploads, --zustand, --forms, --prisma, and --github-workflows mix and match freely.",
  },
] satisfies ReadonlyArray<{ rule: string; reason: string }>

export default function FeaturesPage(): React.ReactNode {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,var(--muted)_0%,transparent_55%)] opacity-80" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20" style={{ minHeight: "280px" }}>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Features
          </p>
          <h1
            className="mt-4 max-w-3xl font-semibold tracking-tight text-balance"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Foundation, functional blocks, agent-first APIs.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Complete capabilities you bolt on with{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">init</code>{" "}
            or{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">add</code>
            — so agents and humans build product features, not plumbing. See{" "}
            <Link href="/docs/philosophy" className="font-medium text-foreground underline">
              Philosophy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Interactive Wizard */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Interactive Wizard
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Run{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              npx ds-start init
            </code>{" "}
            and the wizard guides you through three build paths. No flags
            required.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border bg-background/95 p-5 shadow-sm backdrop-blur">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                Recommended production starter
              </code>
              <p className="mt-3 text-sm font-medium">The full stack</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Prisma + Postgres, Better Auth, transactional email, and
                GitHub Actions CI. The same preset applied by{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  -y
                </code>
                .
              </p>
            </div>
            <div className="rounded-xl border bg-background/95 p-5 shadow-sm backdrop-blur">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                App with auth
              </code>
              <p className="mt-3 text-sm font-medium">Choose your auth provider</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pick Better Auth or Clerk, then select additional modules
                interactively. Good when you know you need auth but want to
                customize the rest.
              </p>
            </div>
            <div className="rounded-xl border bg-background/95 p-5 shadow-sm backdrop-blur">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                Base app
              </code>
              <p className="mt-3 text-sm font-medium">Foundation only</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The foundation stack with no modules. Same as{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --base
                </code>
                . Add modules later with{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  ds-start add
                </code>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Foundation
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The foundation is the baseline every generated app starts with:
            framework, type safety, quality gates, environment validation, and
            conventions agents can follow.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {baseStack.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg border bg-background/95 p-4 shadow-sm backdrop-blur transition-colors hover:bg-muted/50"
              >
                {toolLogos[item.name] ? (
                  <img
                    src={toolLogos[item.name]}
                    alt=""
                    width={20}
                    height={20}
                    className="mt-0.5 shrink-0 rounded-sm dark:invert"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-medium group-hover:text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Modules
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pre-integrated app features that compose on top of the foundation.
            Select them through the interactive wizard, include them with flags,
            or add them to an existing project later.
          </p>
          <div className="mt-4 rounded-xl border bg-background/95 p-2 shadow-sm backdrop-blur">
            <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3">
              <p className="text-sm font-medium">Add to an existing project</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Run{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  npx ds-start add email
                </code>{" "}
                from inside a supported Next.js project. Auto-merges package.json
                and config files, prompts only for real conflicts.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {modules.map((module) => (
              <div key={module.flag} className="rounded-xl border bg-background/95 p-5 shadow-sm backdrop-blur">
                <div className="flex h-full items-start gap-4">
                  {toolLogos[module.name] ? (
                    <img
                      src={toolLogos[module.name]}
                      alt=""
                      width={24}
                      height={24}
                      className="mt-0.5 shrink-0 rounded-sm dark:invert"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={module.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline"
                      >
                        {module.name}
                      </a>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {module.flag}
                      </code>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Composability */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Composability
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Modules compose because they share the same project conventions and
            declare the few dependencies that matter. Start with{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              --base
            </code>{" "}
            for the minimal foundation and add modules as you need them.
          </p>
          <div className="mt-6 divide-y rounded-xl border bg-background/95 shadow-sm backdrop-blur">
            {composabilityRules.map((item) => (
              <div key={item.rule} className="px-4 py-4 sm:px-6">
                <p className="font-mono text-sm font-medium wrap-break-word">
                  {item.rule}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex flex-col gap-3 rounded-xl border bg-background/95 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Ready to start?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Scaffold a new app, then use the workflow page to see how agents
                work inside it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/workflow">View Workflow</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
