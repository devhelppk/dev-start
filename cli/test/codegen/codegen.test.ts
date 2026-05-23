import { describe, expect, test } from "bun:test"
import {
  generateAuthClient,
  generateAuthServer,
  generateDrizzleSchema,
  generatePrismaSchema,
  loadFragments,
} from "../../src/codegen/index.js"

const combos = [
  { name: "better-auth+prisma", extras: ["better-auth"], adapter: "prisma" as const },
  { name: "better-auth+drizzle", extras: ["better-auth"], adapter: "drizzle" as const },
  { name: "better-auth+prisma+email", extras: ["better-auth", "email"], adapter: "prisma" as const },
  { name: "better-auth+drizzle+email", extras: ["better-auth", "email"], adapter: "drizzle" as const },
  { name: "better-auth+prisma+stripe", extras: ["better-auth", "stripe"], adapter: "prisma" as const },
  { name: "better-auth+drizzle+stripe", extras: ["better-auth", "stripe"], adapter: "drizzle" as const },
  { name: "better-auth+prisma+email+stripe", extras: ["better-auth", "email", "stripe"], adapter: "prisma" as const },
  { name: "better-auth+drizzle+email+stripe", extras: ["better-auth", "email", "stripe"], adapter: "drizzle" as const },
]

describe("auth codegen snapshots", () => {
  for (const combo of combos) {
    describe(combo.name, () => {
      const fragments = loadFragments("nextjs", combo.extras)

      test("lib/auth.ts", () => {
        const out = generateAuthServer(fragments, { adapter: combo.adapter, appName: "Dev-Start" })
        expect(out).toMatchSnapshot()
      })

      test("lib/auth-client.ts", () => {
        expect(generateAuthClient(fragments)).toMatchSnapshot()
      })

      if (combo.adapter === "prisma") {
        test("prisma/schema.prisma", () => {
          expect(generatePrismaSchema(fragments)).toMatchSnapshot()
        })
      } else {
        test("db/schema/auth.ts", () => {
          expect(generateDrizzleSchema(fragments)).toMatchSnapshot()
        })
      }
    })
  }
})
