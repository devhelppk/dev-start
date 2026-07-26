import { Logo } from "@/components/logo"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo variant="lockup" size="sm" />,
      url: "/",
    },
    githubUrl: "https://github.com/devhelppk/dev-start",
  }
}
