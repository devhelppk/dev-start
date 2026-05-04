import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export interface EventMetadata {
  [key: string]: unknown
}

export const events = pgTable("event", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  type: text("type").notNull(),
  metadata: jsonb("metadata").$type<EventMetadata>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("event_type_idx").on(table.type),
  index("event_created_at_idx").on(table.createdAt),
])
