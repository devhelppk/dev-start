import type { Metadata } from "next"
import { toolLogos } from "@/lib/tool-logos"

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What's coming next for ds-start.",
}

interface RoadmapItem {
  title: string
  description: string
  status: "shipped" | "coming-soon" | "planned" | "exploring"
}

const shipped = [
  {
    title: "Email (Resend + React Email)",
    description:
      "Lightweight email module with Resend for delivery and React Email for type-safe, previewable templates. Transactional emails — welcome, password reset, invitations — ready out of the box.",
    status: "shipped",
  },
  {
    title: "File Uploads (S3-Compatible)",
    description:
      "File upload module with presigned URLs and type-safe config. Works with any S3-compatible store — AWS S3, Cloudflare R2, MinIO, Backblaze B2.",
    status: "shipped",
  },
  {
    title: "Billing & Subscriptions",
    description:
      "Stripe integration with subscription management, customer portal, and webhook handling. Works with both Better Auth and Clerk.",
    status: "shipped",
  },
  {
    title: "Form Renderer",
    description:
      "JSON-driven form renderer with classic, conversational, and multistep view modes. Config-driven fields, auto-generated zod validation, and an overridable component map. Built on shadcn Form components.",
    status: "shipped",
  },
  {
    title: "Drizzle ORM",
    description:
      "Alternative to Prisma for teams that prefer a more SQL-like ORM. Same type-safe integration, different philosophy.",
    status: "shipped",
  },
] satisfies ReadonlyArray<RoadmapItem>

const comingSoon = [
  {
    title: "Monorepo Templates",
    description:
      "Turborepo-based monorepo starter with shared packages, multiple apps, and coordinated tooling. Same agent-ready workflows across the entire repo.",
    status: "coming-soon",
  },
] satisfies ReadonlyArray<RoadmapItem>

const planned = [
  {
    title: "Organizations & Multi-tenancy",
    description:
      "Team workspaces, role-based access control, and tenant isolation. Built on top of the auth layer with Prisma/Drizzle schema extensions.",
    status: "planned",
  },
] satisfies ReadonlyArray<RoadmapItem>

const exploring = [
  {
    title: "Background Jobs",
    description:
      "Job queue integration for async processing — email sending, webhook delivery, data pipelines. Considering Trigger.dev and BullMQ.",
    status: "exploring",
  },
  {
    title: "Real-time & WebSockets",
    description:
      "Live updates, presence, and collaboration features. Evaluating Ably, Pusher, and PartyKit.",
    status: "exploring",
  },
  {
    title: "Admin Dashboard",
    description:
      "Internal tools template for managing users, viewing analytics, and handling support. Auto-generated from your Prisma/Drizzle schema.",
    status: "exploring",
  },
] satisfies ReadonlyArray<RoadmapItem>

const statusLabels = {
  shipped: "Shipped",
  "coming-soon": "Coming Soon",
  planned: "Planned",
  exploring: "Exploring",
} satisfies Record<RoadmapItem["status"], string>

function RoadmapCard({ item }: { item: RoadmapItem }): React.ReactNode {
  return (
    <div className="flex h-full items-start gap-4 rounded-xl border bg-background/95 p-5 shadow-sm backdrop-blur">
      {toolLogos[item.title] ? (
        <img
          src={toolLogos[item.title]}
          alt=""
          width={24}
          height={24}
          className="mt-0.5 shrink-0 rounded-sm dark:invert"
        />
      ) : null}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-medium">{item.title}</h3>
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
              item.status === "shipped"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {statusLabels[item.status]}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export default function RoadmapPage(): React.ReactNode {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_0%,var(--muted)_0%,transparent_55%)] opacity-80" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20" style={{ minHeight: "280px" }}>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Roadmap
          </p>
          <h1
            className="mt-4 max-w-3xl font-semibold tracking-tight text-balance"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            What is shipping next.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A living plan for ds-start based on what real projects need.
          </p>
        </div>
      </section>

      {/* Recently Shipped */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Recently Shipped
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {shipped.map((item) => (
              <RoadmapCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Coming Soon
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {comingSoon.map((item) => (
              <RoadmapCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Planned */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Planned
          </h2>
          <div className="mt-6 grid gap-4">
            {planned.map((item) => (
              <RoadmapCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Exploring */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_50%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Exploring
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {exploring.map((item) => (
              <RoadmapCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,var(--muted)_0%,transparent_55%)] opacity-70" />
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="rounded-xl border bg-background/95 p-6 shadow-sm backdrop-blur">
            <p className="text-sm text-muted-foreground">
              Have a feature request or want to bump something up the list? Open an
              issue on{" "}
              <a
                href="https://github.com/devhelppk/dev-start/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
