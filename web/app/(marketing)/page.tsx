import Link from "next/link"
import {
  BlocksIcon,
  BotIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  Code2Icon,
  Layers3Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Production-ready foundation",
    description:
      "Next.js, TypeScript, quality gates, env validation, CI, and deployment conventions wired in.",
    icon: Layers3Icon,
  },
  {
    title: "Composable modules",
    description:
      "Add pre-integrated auth, email, forms, uploads, billing, and more without starting from scratch.",
    icon: BlocksIcon,
  },
  {
    title: "Agent workflows",
    description:
      "Plans, reviews, handoffs, and conventions give Claude, Codex, and other agents useful context.",
    icon: BotIcon,
  },
  {
    title: "Open code",
    description:
      "You own the generated code. Modules compose freely, and the conventions stay visible.",
    icon: Code2Icon,
  },
] satisfies ReadonlyArray<{
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}>

const proofPoints = [
  "Foundation",
  "Modules",
  "Agent workflows",
] satisfies ReadonlyArray<string>

const faqs = [
  {
    question: "What is ds-start?",
    answer:
      "A Next.js kit of complete functional blocks and verified presets — foundation plus bolt-on capabilities (email, forms, auth, and more) with agent-first APIs.",
  },
  {
    question: "Why not just ask Claude or Codex?",
    answer:
      "You should. ds-start gives them finished blocks and conventions so they build product features instead of recreating email, forms, jobs, auth glue, uploads, CI, and project setup.",
  },
  {
    question: "What are modules?",
    answer:
      "Modules are functional blocks: end-to-end capabilities built on libraries like shadcn/ui and Better Auth — not raw component dumps. They work via init or add. See /docs/philosophy.",
  },
] satisfies ReadonlyArray<{ question: string; answer: string }>

export default function HomePage(): React.ReactNode {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative flex items-center border-b" style={{ minHeight: "100svh" }}>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,var(--muted)_0%,transparent_55%)] opacity-80" />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 xl:gap-16">
          {/* Left column */}
          <div className="flex min-w-0 flex-col items-start text-left">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              functional blocks &middot; verified presets &middot; agent-first
            </p>
            <h1
              className="mt-5 font-semibold tracking-tight text-balance"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)", lineHeight: 1 }}
            >
              Complete blocks for Next.js apps.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:max-w-lg">
              Bolt on finished capabilities — email, forms, and more — so your
              AI agent builds product features instead of plumbing.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://github.com/devhelppk/dev-start"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {proofPoints.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm"
                >
                  <CheckCircle2Icon className="size-3" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — floating terminal */}
          <div className="relative mx-auto w-full min-w-0 max-w-xl lg:mx-0 lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/_0.18,transparent_70%)] opacity-60 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-xl border bg-muted/40"
            />
            <div className="relative rounded-xl border bg-background/95 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18),0_8px_20px_-12px_rgba(0,0,0,0.1)] backdrop-blur transition-transform duration-500 lg:rotate-[1.25deg] lg:hover:rotate-0 motion-reduce:rotate-0 motion-reduce:transition-none">
              <div className="flex items-center gap-1.5 border-b px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-yellow-400/70" />
                <span className="size-2.5 rounded-full bg-green-400/70" />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                  terminal
                </span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-left sm:text-xs">
                <code>
                  <span className="text-muted-foreground">$</span>{" "}
                  <span className="text-foreground">npx ds-start init my-app</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">?</span>{" "}
                  <span className="text-foreground">What do you want to build?</span>
                  {"\n"}
                  <span className="text-green-500">{">"}</span>{" "}
                  <span className="text-foreground font-medium">Recommended production starter</span>
                  {"\n"}
                  {"  "}
                  <span className="text-muted-foreground">App with auth</span>
                  {"\n"}
                  {"  "}
                  <span className="text-muted-foreground">Base app</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">{"┌─────────────────────────────────────┐"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"│"}</span>
                  {" Scaffold "}
                  <span className="text-foreground font-medium">my-app</span>
                  {" with:"}
                  {"                    "}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"  - Next.js base"}
                  {"                      "}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"  - Prisma + Postgres"}
                  {"                 "}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"  - Better Auth"}
                  {"                       "}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"  - Transactional email"}
                  {"               "}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"  - GitHub Actions CI"}
                  {"                 "}
                  <span className="text-muted-foreground">{"│"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"└─────────────────────────────────────┘"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Features
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Functional blocks agents should not have to rebuild.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Finished capabilities with small APIs — not a blank slate or a
                raw component dump.{" "}
                <Link href="/docs/philosophy" className="font-medium text-foreground underline">
                  Philosophy
                </Link>
                .
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/features">Explore Features</Link>
            </Button>
          </div>
          <div
            className="grid gap-4 overflow-x-auto pb-2"
            style={{ gridTemplateColumns: "repeat(4, minmax(14rem, 1fr))" }}
          >
            {features.map((item) => (
              <div key={item.title} className="min-w-56 rounded-xl border bg-background/95 shadow-sm backdrop-blur">
                <div className="p-5">
                  <div className="mb-4 flex size-9 items-center justify-center rounded-md border bg-muted/50">
                    <item.icon className="size-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_50%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Details
              </p>
              <h2
                className="mt-4 font-semibold tracking-tight"
                style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.875rem)", lineHeight: 1.15 }}
              >
                Common questions.
              </h2>
            </div>
            <div className="divide-y rounded-xl border bg-background/95 shadow-sm backdrop-blur">
              {faqs.map((item) => (
                <details key={item.question} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium marker:hidden">
                    <span>{item.question}</span>
                    <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
