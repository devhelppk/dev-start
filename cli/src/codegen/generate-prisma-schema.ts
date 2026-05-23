import type { ExtraFragments } from "./fragments-types.js"
import { mergePrismaFragments, renderModels } from "./prisma-schema-merge.js"

const PRISMA_HEADER = `generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}`

export function generatePrismaSchema(
  fragments: readonly ExtraFragments[],
): string {
  const merged = mergePrismaFragments(fragments)
  const blocks: string[] = [PRISMA_HEADER]

  const modelTexts = renderModels(merged.models)
  for (const m of modelTexts) blocks.push(m)

  for (const e of merged.enums) blocks.push(e.trim())

  return blocks.join("\n\n") + "\n"
}
