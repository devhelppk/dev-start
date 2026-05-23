import { Button, Heading, Text } from "@react-email/components"

import { EmailLayout } from "./layout"

interface PasswordResetEmailProps {
  url: string
  userName: string
}

export function PasswordResetEmail({ url, userName }: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Heading style={heading}>Reset your password</Heading>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Someone requested a password reset for your account. If this was you,
        click the button below. If not, you can safely ignore this email.
      </Text>
      <Button style={button} href={url}>
        Reset Password
      </Button>
      <Text style={muted}>
        This link expires in 1 hour.
      </Text>
    </EmailLayout>
  )
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#1a1a1a",
  marginBottom: "16px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
}

const button = {
  backgroundColor: "#171717",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  marginTop: "16px",
  marginBottom: "16px",
}

const muted = {
  fontSize: "13px",
  color: "#8898aa",
}

export default PasswordResetEmail
