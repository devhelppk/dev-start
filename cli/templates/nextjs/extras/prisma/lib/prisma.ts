import { PrismaPg } from "@prisma/adapter-pg"
import { ENV } from "varlock/env"

import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (ENV.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
