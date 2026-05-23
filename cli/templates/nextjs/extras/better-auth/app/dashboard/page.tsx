import { headers } from "next/headers"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/auth"

export default async function DashboardPage(): Promise<React.ReactElement> {
  const session = await auth.api.getSession({ headers: await headers() })
  const displayName = session?.user.name ?? "there"

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-sm text-muted-foreground">
          A quick view of what&apos;s happening in your workspace.
        </p>
      </header>

      <section
        aria-label="Workspace overview"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <p className="mt-2 text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Events captured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
            <p className="mt-2 text-xs text-muted-foreground">Since launch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <p className="mt-2 text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
