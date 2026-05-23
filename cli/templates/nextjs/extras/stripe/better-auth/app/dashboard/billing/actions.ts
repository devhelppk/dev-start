"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export async function upgradePlan(planName: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  await auth.api.upgradeSubscription({
    body: { plan: planName },
    headers: await headers(),
  })
}

export async function cancelPlan(): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  await auth.api.cancelSubscription({
    body: { returnUrl: "/dashboard/billing" },
    headers: await headers(),
  })
}
