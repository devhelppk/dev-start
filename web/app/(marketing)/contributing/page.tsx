import type { Metadata } from "next"
import { CheckCircle2Icon } from "lucide-react"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Contributing",
  description: "How to contribute to ds-start.",
}

const commitTypes = [
  { prefix: "feat:", description: "New feature" },
  { prefix: "fix:", description: "Bug fix" },
  { prefix: "docs:", description: "Documentation only" },
  { prefix: "refactor:", description: "Code change that neither fixes a bug nor adds a feature" },
  { prefix: "chore:", description: "Tooling, CI, dependencies" },
] satisfies ReadonlyArray<{ prefix: string; description: string }>

const codeConventions = [
  "TypeScript strict mode — no any, no type assertions, no @ts-ignore",
  "kebab-case for all files and directories",
  "Named exports for helpers and utilities",
  "Relative imports with .js extensions (ESM)",
  "oxlint for linting — no eslint-disable comments",
] satisfies ReadonlyArray<string>

export default function ContributingPage(): React.ReactNode {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,var(--muted)_0%,transparent_55%)] opacity-80" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20" style={{ minHeight: "280px" }}>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Contributing
          </p>
          <h1
            className="mt-4 max-w-3xl font-semibold tracking-tight text-balance"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Help improve ds-start.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Contributions are welcome. This page covers the local workflow; the
            full guide lives in the GitHub repo.
          </p>
        </div>
      </section>

      {/* Setup */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Development Setup
          </h2>
          <div className="mt-6 max-w-2xl space-y-3 rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur">
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">1. Fork and clone</p>
              <div className="mt-2">
                <CodeBlock>{`git clone https://github.com/<your-username>/dev-start.git
cd dev-start`}</CodeBlock>
              </div>
            </div>
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">2. Install dependencies</p>
              <div className="mt-2">
                <CodeBlock>bun install</CodeBlock>
              </div>
            </div>
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">3. Build and verify</p>
              <div className="mt-2">
                <CodeBlock>{`bun run build
bun run lint
bun run typecheck`}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Making Changes */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Making Changes
          </h2>
          <div className="mt-6 max-w-2xl space-y-3 rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur">
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">1. Create a branch from main</p>
              <div className="mt-2">
                <CodeBlock>git checkout -b feat/my-feature</CodeBlock>
              </div>
            </div>
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">
                2. Run quality gates before committing
              </p>
              <div className="mt-2">
                <CodeBlock>{`bun run lint
bun run typecheck
bun run build`}</CodeBlock>
              </div>
            </div>
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">
                3. Commit with conventional commits
              </p>
              <div className="mt-2">
                <CodeBlock>git commit -m "feat: add cool new feature"</CodeBlock>
              </div>
            </div>
            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-sm font-medium">
                4. Push and open a pull request
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commit Style */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Commit Style
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This project uses{" "}
            <a
              href="https://www.conventionalcommits.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Conventional Commits
            </a>{" "}
            enforced by commitlint.
          </p>
          <div className="mt-6 max-w-2xl divide-y rounded-xl border bg-background/95 shadow-sm backdrop-blur">
            {commitTypes.map((item) => (
              <div
                key={item.prefix}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4 sm:px-6"
              >
                <code className="shrink-0 font-mono text-sm font-medium">
                  {item.prefix}
                </code>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Conventions */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_50%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Code Conventions
          </h2>
          <ul className="mt-6 max-w-2xl divide-y rounded-xl border bg-background/95 shadow-sm backdrop-blur">
            {codeConventions.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 px-4 py-3 text-sm text-muted-foreground"
              >
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Changesets */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_50%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Changesets
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            If your PR changes user-facing behavior, add a changeset:
          </p>
          <div className="mt-4 max-w-2xl">
            <CodeBlock>bunx changeset</CodeBlock>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Commit the generated changeset file with your PR.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl rounded-xl border bg-background/95 p-6 shadow-sm backdrop-blur">
            <p className="text-sm text-muted-foreground">
              For the full contributing guide including template changes and adding
              new modules, see{" "}
              <a
                href="https://github.com/devhelppk/dev-start/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline"
              >
                CONTRIBUTING.md
              </a>{" "}
              on GitHub.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
