import type { ExtraFragments } from "../../fragments-types.js"

const stripePluginArgs = `{
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
}`

const subscriptionModel = `model Subscription {
  id                     String   @id
  plan                   String
  referenceId            String
  stripeCustomerId       String?
  stripeSubscriptionId   String?
  status                 String
  periodStart            DateTime?
  periodEnd              DateTime?
  cancelAtPeriodEnd      Boolean  @default(false)
  seats                  Int?
  trialStart             DateTime?
  trialEnd               DateTime?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
  user                   User     @relation(fields: [referenceId], references: [id], onDelete: Cascade)

  @@index([referenceId])
  @@index([stripeCustomerId])
  @@map("subscription")
}`

const subscriptionTable = `export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  seats: integer("seats"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("subscription_reference_id_idx").on(table.referenceId),
  index("subscription_stripe_customer_id_idx").on(table.stripeCustomerId),
])`

export const stripeFragment: ExtraFragments = {
  extra: "stripe",
  requires: ["better-auth"],
  auth: {
    imports: [
      { from: "@better-auth/stripe", named: ["stripe"] },
      { from: "stripe", default: "Stripe" },
    ],
    topLevel: {
      before: [`const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY ?? "")`],
    },
    config: {
      plugins: [
        { name: "stripe", args: stripePluginArgs },
      ],
    },
  },
  prismaSchema: {
    models: [subscriptionModel],
    modelEdits: {
      User: { fields: ["subscriptions Subscription[]"] },
    },
  },
  drizzleSchema: {
    imports: [
      { from: "drizzle-orm/pg-core", named: ["integer"] },
    ],
    tables: [subscriptionTable],
  },
}
