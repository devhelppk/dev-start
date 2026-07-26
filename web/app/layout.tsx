import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl = "https://dev-start.shahzaibjak.com"

export const metadata: Metadata = {
  title: {
    default: "ds-start — Complete functional blocks for Next.js",
    template: "%s | ds-start",
  },
  description:
    "Complete functional blocks and verified presets for Next.js. Bolt on via init or add. Agent-first APIs so product work starts sooner.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "next.js",
    "app kit",
    "starter",
    "template",
    "typescript",
    "ai",
    "agent-ready",
    "functional blocks",
    "presets",
    "tailwind",
    "shadcn",
    "prisma",
    "better-auth",
    "type-safe",
    "scaffold",
    "modules",
    "composable",
    "cli",
    "agentic",
    "claude",
    "codex",
  ],
  authors: [{ name: "Shahzaib Jak", url: "https://github.com/shahzaibjak" }],
  creator: "Shahzaib Jak",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ds-start",
    title: "ds-start — Complete functional blocks for Next.js",
    description:
      "Bolt-on functional blocks and verified presets. Agent-first APIs for Next.js apps.",
    images: [{ url: "/logo.svg", width: 320, height: 64, alt: "ds-start" }],
  },
  twitter: {
    card: "summary",
    title: "ds-start — Complete functional blocks for Next.js",
    description:
      "Bolt-on functional blocks and verified presets. Agent-first APIs for Next.js apps.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
