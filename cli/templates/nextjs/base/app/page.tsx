import { GaugeIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const FEATURES = [
  {
    title: "Ship in days, not quarters",
    detail:
      "Skip the integration plumbing. Auth, payments, storage, and email are wired into a single typed stack so your team focuses on the product.",
    icon: GaugeIcon,
  },
  {
    title: "Type-safe end to end",
    detail:
      "Types flow from the database to the UI. Errors surface at compile time — not in a 3am Sentry alert from production.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Built for AI-assisted work",
    detail:
      "Project conventions and quality gates are encoded so any coding agent — Claude, Cursor, Copilot — produces work that matches your standards.",
    icon: SparklesIcon,
  },
]

export default function Page(): React.ReactElement {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-24 px-6 py-16 sm:py-24">
        <section className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            A new way to build
          </p>
          <h1 className="text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight">
            The platform your team has been waiting for.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Move from idea to deployed product without losing momentum on the integration
            work that doesn&apos;t belong in your roadmap.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </div>
        </section>

        <section
          aria-label="Product highlights"
          className="grid gap-6 md:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-6"
            >
              <feature.icon className="size-6 text-foreground" aria-hidden="true" />
              <h2 className="text-base font-semibold tracking-tight">{feature.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.detail}
              </p>
            </article>
          ))}
        </section>

        <section className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-8 sm:p-10">
          <h2 className="text-xl font-semibold tracking-tight">
            See what your team can ship this quarter.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Start with a working baseline and stay in control of every decision that
            matters.
          </p>
          <Button variant="outline">Create an account</Button>
        </section>
      </div>
    </main>
  )
}
