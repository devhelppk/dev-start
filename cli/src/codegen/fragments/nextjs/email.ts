import type { ExtraFragments } from "../../fragments-types.js"

const sendResetPasswordEmail = `async ({ user, url }) => {
  void sendEmail({
    to: user.email,
    subject: "Reset your password",
    template: PasswordResetEmail,
    props: { url, userName: user.name ?? "there" },
  })
}`

const sendVerificationEmail = `async ({ user, url }) => {
  void sendEmail({
    to: user.email,
    subject: "Verify your email address",
    template: VerificationEmail,
    props: { url, userName: user.name ?? "there" },
  })
}`

export const emailFragment: ExtraFragments = {
  extra: "email",
  requires: ["better-auth"],
  auth: {
    imports: [
      { from: "@/lib/email", named: ["sendEmail"] },
      { from: "@/emails/password-reset", named: ["PasswordResetEmail"] },
      { from: "@/emails/verification", named: ["VerificationEmail"] },
    ],
    config: {
      emailAndPassword: {
        sendResetPassword: sendResetPasswordEmail,
      },
      emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: sendVerificationEmail,
      },
    },
  },
}
