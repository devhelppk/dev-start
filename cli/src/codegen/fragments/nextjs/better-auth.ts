import type { ExtraFragments } from "../../fragments-types.js"

const sendResetPasswordStub = `async ({ user, url }) => {
  // TODO: Replace with a real email transport (Resend, Nodemailer, etc.)
  // This console.log lets you test the flow locally — copy the URL from your terminal.
  console.log(\`[auth] Password reset for \${user.email}: \${url}\`)
}`

const googleProvider = `{
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
}`

const userModel = `model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}`

const sessionModel = `model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}`

const accountModel = `model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}`

const verificationModel = `model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}`

const userTable = `export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("user_email_idx").on(table.email),
])`

const sessionTable = `export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
  uniqueIndex("session_token_idx").on(table.token),
  index("session_user_id_idx").on(table.userId),
])`

const accountTable = `export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("account_user_id_idx").on(table.userId),
])`

const verificationTable = `export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier),
])`

export const betterAuthFragment: ExtraFragments = {
  extra: "better-auth",
  auth: {
    config: {
      appName: "Dev-Start",
      emailAndPassword: {
        enabled: true,
        sendResetPassword: sendResetPasswordStub,
      },
      socialProviders: {
        google: googleProvider,
      },
    },
  },
  prismaSchema: {
    models: [userModel, sessionModel, accountModel, verificationModel],
  },
  drizzleSchema: {
    imports: [
      {
        from: "drizzle-orm/pg-core",
        named: ["pgTable", "text", "timestamp", "boolean", "index", "uniqueIndex"],
      },
    ],
    tables: [userTable, sessionTable, accountTable, verificationTable],
  },
}
