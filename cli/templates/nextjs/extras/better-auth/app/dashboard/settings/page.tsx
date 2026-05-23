import { headers } from "next/headers"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Account</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <dl className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <dt className="text-muted-foreground">Name</dt>
            <dd>{session?.user.name ?? "—"}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{session?.user.email ?? "—"}</dd>
          </dl>
        </CardContent>
      </Card>
    </>
  )
}
