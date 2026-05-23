import { BillingActions } from "@/components/billing-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPlanName, getSubscriptionLimits } from "@/lib/billing"

export default async function BillingPage(): Promise<React.ReactElement> {
  const currentPlan = await getPlanName()
  const limits = await getSubscriptionLimits()

  return (
    <>
      <header className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Subscription
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold capitalize">{currentPlan}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {limits.projects} projects included
          </p>
        </CardContent>
      </Card>

      <BillingActions currentPlan={currentPlan} />
    </>
  )
}
