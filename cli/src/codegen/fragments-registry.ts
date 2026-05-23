import type { ExtraFragments } from "./fragments-types.js"
import { betterAuthFragment } from "./fragments/nextjs/better-auth.js"
import { emailFragment } from "./fragments/nextjs/email.js"
import { stripeFragment } from "./fragments/nextjs/stripe.js"

export type FragmentRegistry = Record<string, Record<string, ExtraFragments>>

export const fragmentRegistry: FragmentRegistry = {
  nextjs: {
    "better-auth": betterAuthFragment,
    email: emailFragment,
    stripe: stripeFragment,
  },
}
