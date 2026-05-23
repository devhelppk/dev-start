"use client"

import { PricingCard } from "@/components/pricing-card"
import { Button } from "@/components/ui/button"
import { upgradePlan, cancelPlan } from "@/app/dashboard/billing/actions"

const PLANS = [
  {
    name: "free",
    description: "For personal projects",
    features: ["Up to 3 projects", "Community support"],
  },
  {
    name: "pro",
    description: "For growing teams",
    features: ["Up to 25 projects", "Priority support", "Advanced analytics"],
  },
  {
    name: "enterprise",
    description: "For large organizations",
    features: ["Up to 100 projects", "Dedicated support", "Custom integrations", "SLA"],
  },
]

interface BillingActionsProps {
  currentPlan: string
}

export function BillingActions({ currentPlan }: BillingActionsProps): React.ReactNode {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.name}
            name={plan.name}
            description={plan.description}
            features={plan.features}
            isCurrent={currentPlan === plan.name}
            onSelect={() => upgradePlan(plan.name)}
          />
        ))}
      </div>

      {currentPlan !== "free" && (
        <section className="rounded-3xl border bg-card p-6">
          <p className="text-sm font-medium">Manage subscription</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cancel your current subscription. You can upgrade again at any time.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => cancelPlan()}>
            Cancel subscription
          </Button>
        </section>
      )}
    </>
  )
}
