import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"

import * as schema from "@/db/schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env.schema and run `varlock load` to validate.")
}

const globalForDrizzle = globalThis as typeof globalThis & {
  db?: ReturnType<typeof drizzle>
}

function createDrizzleClient(): ReturnType<typeof drizzle> {
  return drizzle({ connection: { connectionString }, schema })
}

export const db = globalForDrizzle.db ?? createDrizzleClient()

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.db = db
}
