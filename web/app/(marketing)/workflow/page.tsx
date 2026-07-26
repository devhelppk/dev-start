import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Agentic Workflow",
  description:
    "Agent workflows on top of functional blocks — plans, quality gates, reviews, and handoffs so agents ship product features.",
}

const steps = [
  {
    number: "1",
    command: "/start-prd",
    title: "Plan",
    description:
      "Interview-driven PRD creation. Explores your codebase, asks targeted questions about scope, edge cases, and integration points, then outputs a step-by-step implementation plan with acceptance criteria.",
  },
  {
    number: "2",
    command: "/start-work",
    title: "Build",
    description:
      "Begin or resume implementation from a PRD. Follows plan steps sequentially, enforces strict type safety, and verifies acceptance criteria after each step. Supports session continuity via handoff files.",
  },
  {
    number: "3",
    command: "/handoff",
    title: "Handoff",
    description:
      "Save session progress for continuity across sessions. Captures completed steps, current state, key decisions, gotchas, and modified files so the next session picks up without losing context.",
  },
  {
    number: "4",
    command: "/start-review",
    title: "Review",
    description:
      "Run quality gates and review the diff. Checks lint, typecheck, and tests, then does a thorough code review covering logic, patterns, security, and performance. Read-only — no code modifications.",
  },
  {
    number: "5",
    command: "/start-pr",
    title: "Ship",
    description:
      "Commit changes and create a PR with conventional commit messages, pre-commit hooks, and gh CLI integration. Generates a PR description with summary, test plan, and change context.",
  },
] satisfies ReadonlyArray<{
  number: string
  command: string
  title: string
  description: string
}>

const domainSkills = [
  {
    command: "/next-ts-api",
    title: "Type-safe API Routes",
    description:
      "Guides you through creating end-to-end type-safe API routes and clients using next-ts-api. Auto-generates TypeScript types from route handlers.",
  },
  {
    command: "/vercel-react-best-practices",
    title: "React Performance",
    description:
      "64 rules from Vercel Engineering for React and Next.js performance optimization. Covers rendering, data fetching, caching, and bundle size.",
  },
  {
    command: "/frontend-design",
    title: "Frontend Design",
    description:
      "Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.",
  },
] satisfies ReadonlyArray<{
  command: string
  title: string
  description: string
}>

export default function WorkflowPage(): React.ReactNode {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,var(--muted)_0%,transparent_55%)] opacity-80" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20" style={{ minHeight: "280px" }}>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Agent workflows
          </p>
          <h1
            className="mt-4 max-w-3xl font-semibold tracking-tight text-balance"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Give agents finished blocks and the workflow to extend them.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Skills provide plans, quality gates, reviews, and handoffs on top of
            complete functional blocks — so agents build product features, not
            plumbing. See{" "}
            <Link href="/docs/philosophy" className="font-medium text-foreground underline">
              Philosophy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Development Cycle */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Development Cycle
          </h2>
          <div className="mt-6 divide-y rounded-xl border bg-background/95 shadow-sm backdrop-blur">
            {steps.map((step) => (
              <div
                key={step.command}
                className="flex gap-4 px-4 py-5 sm:px-6"
              >
                <div className="flex flex-col items-center">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted font-mono text-xs text-muted-foreground">
                    {step.number}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium">{step.title}</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {step.command}
                    </code>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            How It Works
          </h2>
          <div className="mt-6 space-y-4 rounded-xl border bg-background/95 p-6 text-sm leading-relaxed text-muted-foreground shadow-sm backdrop-blur">
            <p>
              Skills are prompt files that ship inside your scaffolded project.
              When you invoke a skill (e.g. type{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                /start-prd
              </code>{" "}
              in Claude Code), your AI assistant loads the skill&apos;s instructions
              and follows the defined workflow.
            </p>
            <p>
              The workflow keeps project conventions, quality gates, planning,
              review expectations, and handoffs in the repo so they do not need to
              be re-explained every session.
            </p>
            <p>
              Plans are saved as markdown files in{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                .claude/plans/
              </code>{" "}
              and handoffs in{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                .claude/handoffs/
              </code>
              . This means your project state is always version-controlled and
              portable between sessions.
            </p>
          </div>
        </div>
      </section>

      {/* Domain Skills */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Domain Skills
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Specialized skills for common development tasks.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {domainSkills.map((skill) => (
              <div key={skill.command} className="rounded-xl border bg-background/95 p-5 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium">{skill.title}</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {skill.command}
                  </code>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
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
            <p className="max-w-xl text-sm text-muted-foreground">
              Pair the workflow with your scaffolded project — whether from a
              preset or a custom module selection — so agents can plan, build,
              review, and ship from shared project context.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/docs">Read Docs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
