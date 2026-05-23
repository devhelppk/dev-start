import type {
  AuthClientFragment,
  ExtraFragments,
  ImportSpec,
  PluginEntry,
} from "./fragments-types.js"
import { formatImports } from "./format.js"

function emitPluginEntry(entry: PluginEntry, indent: number): string {
  const pad = " ".repeat(indent)
  if (!entry.args) return `${pad}${entry.name}(),`
  const lines = entry.args.split("\n")
  if (lines.length === 1) return `${pad}${entry.name}(${lines[0]}),`
  const first = lines[0]
  const middle = lines
    .slice(1, -1)
    .map((l) => (l.length === 0 ? "" : pad + l))
  const last = lines[lines.length - 1] ?? ""
  const lastWithIndent = last.length === 0 ? "" : pad + last
  return [`${pad}${entry.name}(${first}`, ...middle, `${lastWithIndent}),`].join(
    "\n",
  )
}

export function generateAuthClient(
  fragments: readonly ExtraFragments[],
): string {
  const clients: AuthClientFragment[] = fragments
    .map((f) => f.authClient)
    .filter((a): a is AuthClientFragment => a !== undefined)

  const coreImports: ImportSpec[] = [
    { from: "better-auth/react", named: ["createAuthClient"] },
  ]
  const allImports: ImportSpec[] = [
    ...coreImports,
    ...clients.flatMap((c) => c.imports ?? []),
  ]
  const plugins: PluginEntry[] = clients.flatMap((c) => c.plugins ?? [])

  const parts: string[] = []
  parts.push(formatImports(allImports))
  parts.push("")

  if (plugins.length === 0) {
    parts.push("export const authClient = createAuthClient()")
  } else {
    const entries = plugins.map((p) => emitPluginEntry(p, 4))
    parts.push("export const authClient = createAuthClient({")
    parts.push(`  plugins: [\n${entries.join("\n")}\n  ],`)
    parts.push("})")
  }

  return parts.join("\n") + "\n"
}
