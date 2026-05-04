import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/lib/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  appName: "Dev-Start",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Replace with a real email transport (Resend, Nodemailer, etc.)
      // This console.log lets you test the flow locally — copy the URL from your terminal.
      console.log(`[auth] Password reset for ${user.email}: ${url}`)
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
    },
  },
})
