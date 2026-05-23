import { Button, Heading, Text } from "@react-email/components"

import { EmailLayout } from "./layout"

interface VerificationEmailProps {
  url: string
  userName: string
}

export function VerificationEmail({ url, userName }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Heading style={heading}>Verify your email</Heading>
      <Text style={paragraph}>Hi {userName},</Text>
      <Text style={paragraph}>
        Please verify your email address by clicking the button below.
      </Text>
      <Button style={button} href={url}>
        Verify Email
      </Button>
      <Text style={muted}>
        If you didn&apos;t create an account, you can safely ignore this email.
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

export default VerificationEmail
