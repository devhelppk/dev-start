import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/lib/db"
import * as schema from "@/db/schema"
import { sendEmail } from "@/lib/email"
import { PasswordResetEmail } from "@/emails/password-reset"
import { VerificationEmail } from "@/emails/verification"

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
})
