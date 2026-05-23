import type {
  DrizzleSchemaFragment,
  DrizzleTableEdit,
  ExtraFragments,
  ImportSpec,
} from "./fragments-types.js"
import { formatImports } from "./format.js"

const CORE_IMPORTS: ImportSpec[] = [
  {
    from: "drizzle-orm/pg-core",
    named: ["pgTable", "text", "timestamp", "boolean", "index", "uniqueIndex"],
  },
]

function findTableStart(lines: string[], tableName: string): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.includes(`pgTable("${tableName}"`)) return i
  }
  return -1
}

function findColumnsCloseLine(lines: string[], startIdx: number): number {
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i]
    if (!l) continue
    if (l.startsWith("}")) return i
  }
  return -1
}

function findExtrasCloseLine(lines: string[], startIdx: number): number {
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i]
    if (!l) continue
    if (l.startsWith("])")) return i
  }
  return -1
}

function applyTableEdit(
  tableText: string,
  tableName: string,
  edit: DrizzleTableEdit,
): string {
  const lines = tableText.split("\n")
  const startIdx = findTableStart(lines, tableName)
  if (startIdx === -1) {
    throw new Error(`Drizzle tableEdit references unknown table '${tableName}'`)
  }

  if (edit.columns && edit.columns.length > 0) {
    const closeIdx = findColumnsCloseLine(lines, startIdx)
    if (closeIdx === -1) {
      throw new Error(`Could not find columns close for table '${tableName}'`)
    }
    const insertion = edit.columns.map((c) => `  ${c.trim()},`)
    lines.splice(closeIdx, 0, ...insertion)
  }

  if (edit.extras && edit.extras.length > 0) {
    const newStartIdx = findTableStart(lines, tableName)
    const closeIdx = findExtrasCloseLine(lines, newStartIdx)
    if (closeIdx === -1) {
      throw new Error(
        `Could not find extras close for table '${tableName}' — table may have no extras block`,
      )
    }
    const insertion = edit.extras.map((e) => `  ${e.trim()},`)
    lines.splice(closeIdx, 0, ...insertion)
  }

  return lines.join("\n")
}

interface MergedTables {
  imports: ImportSpec[]
  tables: { name: string; text: string }[]
}

function extractTableName(tableText: string): string {
  const m = tableText.match(/export\s+const\s+(\w+)\s*=\s*pgTable/)
  if (!m) {
    throw new Error(
      `Drizzle table missing export name: '${tableText.slice(0, 80)}'`,
    )
  }
  return m[1] ?? ""
}

function mergeDrizzleFragments(
  fragments: readonly ExtraFragments[],
): MergedTables {
  const imports: ImportSpec[] = [...CORE_IMPORTS]
  const tableOrder: string[] = []
  const tableMap = new Map<string, string>()
  const pendingEdits = new Map<string, DrizzleTableEdit[]>()

  for (const frag of fragments) {
    const ds: DrizzleSchemaFragment | undefined = frag.drizzleSchema
    if (!ds) continue
    if (ds.imports) imports.push(...ds.imports)
    if (ds.tables) {
      for (const t of ds.tables) {
        const name = extractTableName(t)
        if (tableMap.has(name)) {
          throw new Error(
            `Duplicate Drizzle table '${name}' contributed by '${frag.extra}'`,
          )
        }
        tableMap.set(name, t)
        tableOrder.push(name)
      }
    }
    if (ds.tableEdits) {
      for (const [tableName, edit] of Object.entries(ds.tableEdits)) {
        const list = pendingEdits.get(tableName) ?? []
        list.push(edit)
        pendingEdits.set(tableName, list)
      }
    }
  }

  for (const [tableName, edits] of pendingEdits) {
    const text = tableMap.get(tableName)
    if (!text) {
      throw new Error(
        `Drizzle tableEdit references unknown table '${tableName}'`,
      )
    }
    let updated = text
    for (const edit of edits) {
      updated = applyTableEdit(updated, tableName, edit)
    }
    tableMap.set(tableName, updated)
  }

  return {
    imports,
    tables: tableOrder.map((name) => {
      const text = tableMap.get(name)
      if (!text) throw new Error(`Internal: missing table '${name}'`)
      return { name, text }
    }),
  }
}

export function generateDrizzleSchema(
  fragments: readonly ExtraFragments[],
): string {
  const merged = mergeDrizzleFragments(fragments)
  const parts: string[] = []
  parts.push(formatImports(merged.imports))
  parts.push("")
  parts.push(merged.tables.map((t) => t.text).join("\n\n"))
  return parts.join("\n") + "\n"
}
