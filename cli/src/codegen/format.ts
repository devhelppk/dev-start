import type { ImportSpec } from "./fragments-types.js"

export function indentLines(text: string, indent: number): string {
  const pad = " ".repeat(indent)
  return text
    .split("\n")
    .map((line) => (line.length === 0 ? "" : pad + line))
    .join("\n")
}

export function indentContinuation(text: string, indent: number): string {
  const pad = " ".repeat(indent)
  const lines = text.split("\n")
  return lines
    .map((line, i) => (i === 0 || line.length === 0 ? line : pad + line))
    .join("\n")
}

interface MergedImport {
  from: string
  named: string[]
  default?: string
  namespace?: string
  typeOnly: boolean
}

function mergeImports(imports: readonly ImportSpec[]): MergedImport[] {
  const order: string[] = []
  const byKey = new Map<string, MergedImport>()

  for (const imp of imports) {
    const key = `${imp.typeOnly ? "type:" : ""}${imp.from}`
    let merged = byKey.get(key)
    if (!merged) {
      merged = {
        from: imp.from,
        named: [],
        default: imp.default,
        namespace: imp.namespace,
        typeOnly: imp.typeOnly ?? false,
      }
      byKey.set(key, merged)
      order.push(key)
    } else {
      if (imp.default && merged.default && imp.default !== merged.default) {
        throw new Error(
          `Conflicting default imports from '${imp.from}': '${merged.default}' vs '${imp.default}'`,
        )
      }
      if (
        imp.namespace &&
        merged.namespace &&
        imp.namespace !== merged.namespace
      ) {
        throw new Error(
          `Conflicting namespace imports from '${imp.from}': '${merged.namespace}' vs '${imp.namespace}'`,
        )
      }
      if (imp.default && !merged.default) merged.default = imp.default
      if (imp.namespace && !merged.namespace) merged.namespace = imp.namespace
    }

    if (imp.named) {
      for (const n of imp.named) {
        if (!merged.named.includes(n)) merged.named.push(n)
      }
    }
  }

  return order.map((key) => {
    const m = byKey.get(key)
    if (!m) throw new Error(`Internal: missing import key ${key}`)
    return m
  })
}

function renderImport(imp: MergedImport): string {
  const typePrefix = imp.typeOnly ? "type " : ""
  if (imp.namespace) {
    return `import ${typePrefix}* as ${imp.namespace} from "${imp.from}"`
  }
  const parts: string[] = []
  if (imp.default) parts.push(imp.default)
  if (imp.named.length > 0) parts.push(`{ ${imp.named.join(", ")} }`)
  if (parts.length === 0) {
    return `import "${imp.from}"`
  }
  return `import ${typePrefix}${parts.join(", ")} from "${imp.from}"`
}

export function formatImports(imports: readonly ImportSpec[]): string {
  if (imports.length === 0) return ""
  const merged = mergeImports(imports)
  const external: MergedImport[] = []
  const internal: MergedImport[] = []
  for (const imp of merged) {
    if (imp.from.startsWith("@/")) internal.push(imp)
    else external.push(imp)
  }
  const groups: string[] = []
  if (external.length > 0) groups.push(external.map(renderImport).join("\n"))
  if (internal.length > 0) groups.push(internal.map(renderImport).join("\n"))
  return groups.join("\n\n")
}
