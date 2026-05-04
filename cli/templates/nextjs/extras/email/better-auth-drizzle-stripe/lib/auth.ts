import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"

import { db } from "@/lib/db"
import * as schema from "@/db/schema"
import { sendEmail } from "@/lib/email"
import { PasswordResetEmail } from "@/emails/password-reset"
import { VerificationEmail } from "@/emails/verification"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY ?? "")

export const auth = betterAuth({
  appName: "Dev-Start",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        template: PasswordResetEmail,
        props: { url, userName: user.name ?? "there" },
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        template: VerificationEmail,
        props: { url, userName: user.name ?? "there" },
      })
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
    },
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "free",
            priceId: "price_free_placeholder",
            limits: { projects: 3 },
          },
          {
            name: "pro",
            priceId: "price_pro_placeholder",
            limits: { projects: 25 },
          },
          {
            name: "enterprise",
            priceId: "price_enterprise_placeholder",
            limits: { projects: 100 },
          },
        ],
      },
    }),
  ],
})
