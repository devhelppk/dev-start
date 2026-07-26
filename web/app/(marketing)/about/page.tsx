import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About",
  description:
    "Why ds-start exists — complete functional blocks and agent-first APIs for Next.js.",
}

export default function AboutPage(): React.ReactNode {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,var(--muted)_0%,transparent_55%)] opacity-80" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20" style={{ minHeight: "280px" }}>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            About
          </p>
          <h1
            className="mt-4 max-w-3xl font-semibold tracking-tight text-balance"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Complete blocks. Agent-ready APIs. Product work first.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            ds-start exists so humans and AI agents bolt on finished capabilities —
            email, forms, jobs, and more — instead of rebuilding plumbing.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Origin
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              ds-start came out of repetition. I was building a lot with AI — spinning
              up Next.js projects, wiring up the same strict TypeScript config, the same
              oxlint and oxfmt setup, the same pre-commit hooks, the same env
              validation, the same API route patterns. Every new project started with
              hours of setup before I could write a product feature.
            </p>
            <p>
              Worse, every time I started a new AI coding session, I had to re-explain
              the project conventions, the quality gates, the patterns I wanted followed.
              The AI assistant had no memory of how I like to work.
            </p>
            <p>
              So I built the starter I wished I had. One command, and you get a project
              where the tooling is already wired, the types already flow end-to-end, and
              your AI assistant already understands the codebase conventions from the
              first prompt.
            </p>
            <p>
              Then the starter grew. People wanted auth, email, payments, forms — but not
              always at scaffold time, and not as raw library dumps. So ds-start became
              composable: a foundation you start from, plus{" "}
              <strong className="font-medium text-foreground">functional blocks</strong>{" "}
              you bolt on later. Same templates, same conventions, whether you scaffold
              fresh with{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">init</code>{" "}
              or extend an existing app with{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">add</code>.
            </p>
            <p>
              The latest evolution is the interactive wizard. Instead of passing
              flags or answering yes/no prompts one by one, you choose a build
              path — recommended production starter, app with auth, or base app —
              and the wizard walks you through the rest. Three presets cover the
              common cases; flags and{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                --base
              </code>{" "}
              remain for CI and power users.
            </p>
          </div>
        </div>
      </section>

      {/* Opinionated */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Opinionated by design
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              ds-start is deliberately opinionated. It picks a stack and commits to it.
              That&apos;s not a limitation — it&apos;s the point. Opinions eliminate decisions.
              Decisions slow you down. When everything from your ORM to your commit
              messages follows a known convention, both you and your AI assistant can
              move faster.
            </p>
            <p>The stack reflects what I actually build production apps with:</p>
          </div>
          <ul className="mt-4 max-w-3xl divide-y rounded-xl border bg-background/95 shadow-sm backdrop-blur">
            <li className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Next.js + TypeScript strict</span>{" "}
                — the foundation. App Router, server components, Turbopack.
              </span>
            </li>
            <li className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Tailwind + shadcn/ui</span>{" "}
                — fast, consistent UI without fighting a component library.
              </span>
            </li>
            <li className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">nuqs + React Query + next-ts-api + varlock</span>{" "}
                — URL state, server state, type-safe API routes, and validated env vars. No gaps in the chain.
              </span>
            </li>
            <li className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Prisma + Better Auth</span>{" "}
                — when you need a database and auth, they&apos;re one flag away and already integrated.
              </span>
            </li>
            <li className="flex items-start gap-3 px-4 py-3 text-sm">
              <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Agent-ready workflows</span>{" "}
                — your coding agent gets structured workflows, not just a blank context window.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Vision */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Vision
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              The edge is not more shadcn modules. It is known-good, agent-ready{" "}
              <strong className="font-medium text-foreground">functional blocks</strong>{" "}
              plus verified{" "}
              <strong className="font-medium text-foreground">presets</strong>, built on
              libraries like shadcn/ui and Better Auth. Blocks such as forms and email
              are the reference: complete capability, small stable API,{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">init</code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">add</code>,
              and a boring verify story. Future blocks — jobs, AI, organizations — must
              clear the same bar.
            </p>
            <p>
              <strong className="font-medium text-foreground">
                AI agents first, developers second — same APIs.
              </strong>{" "}
              Success means agents spend tokens on user-facing features, not re-deriving
              auth, email, jobs, or conventions. Most starters give you files. ds-start
              gives you finished blocks and the workflows to extend them.
            </p>
            <p>
              Read the full model in{" "}
              <Link href="/docs/philosophy" className="font-medium text-foreground underline">
                Philosophy
              </Link>
              . See what&apos;s coming next on the{" "}
              <Link href="/roadmap" className="font-medium text-foreground underline">
                roadmap
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
