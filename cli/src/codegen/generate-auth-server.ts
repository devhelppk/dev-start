import type {
  AuthServerConfig,
  AuthServerFragment,
  ExtraFragments,
  ImportSpec,
  PluginEntry,
} from "./fragments-types.js"
import { formatImports } from "./format.js"

export type DatabaseAdapter = "prisma" | "drizzle"

export interface AuthServerContext {
  adapter: DatabaseAdapter
  appName: string
}

interface CoreContribution {
  imports: ImportSpec[]
  databaseExpr: string
}

function coreContribution(ctx: AuthServerContext): CoreContribution {
  if (ctx.adapter === "prisma") {
    return {
      imports: [
        { from: "better-auth", named: ["betterAuth"] },
        { from: "better-auth/adapters/prisma", named: ["prismaAdapter"] },
        { from: "@/lib/prisma", named: ["prisma"] },
      ],
      databaseExpr: `prismaAdapter(prisma, {\n  provider: "postgresql",\n})`,
    }
  }
  return {
    imports: [
      { from: "better-auth", named: ["betterAuth"] },
      { from: "better-auth/adapters/drizzle", named: ["drizzleAdapter"] },
      { from: "@/lib/db", named: ["db"] },
      { from: "@/db/schema", namespace: "schema" },
    ],
    databaseExpr: `drizzleAdapter(db, {\n  provider: "pg",\n  schema,\n})`,
  }
}

function pad(indent: number): string {
  return " ".repeat(indent)
}

function emitKeyExpression(
  key: string,
  expr: string,
  indent: number,
): string {
  const p = pad(indent)
  const lines = expr.split("\n")
  if (lines.length === 1) {
    return `${p}${key}: ${lines[0]},`
  }
  const first = lines[0]
  const middle = lines
    .slice(1, -1)
    .map((l) => (l.length === 0 ? "" : p + l))
  const last = lines[lines.length - 1] ?? ""
  const lastWithIndent = last.length === 0 ? "" : p + last
  return [`${p}${key}: ${first}`, ...middle, `${lastWithIndent},`].join("\n")
}

function emitObjectKey(
  key: string,
  props: ReadonlyArray<readonly [string, string]>,
  indent: number,
): string {
  const p = pad(indent)
  const inner = indent + 2
  const propLines = props.map(([k, v]) => emitKeyExpression(k, v, inner))
  return `${p}${key}: {\n${propLines.join("\n")}\n${p}},`
}

function emitPluginEntry(entry: PluginEntry, indent: number): string {
  const p = pad(indent)
  if (!entry.args) return `${p}${entry.name}(),`
  const lines = entry.args.split("\n")
  if (lines.length === 1) {
    return `${p}${entry.name}(${lines[0]}),`
  }
  const first = lines[0]
  const middle = lines
    .slice(1, -1)
    .map((l) => (l.length === 0 ? "" : p + l))
  const last = lines[lines.length - 1] ?? ""
  const lastWithIndent = last.length === 0 ? "" : p + last
  return [`${p}${entry.name}(${first}`, ...middle, `${lastWithIndent}),`].join(
    "\n",
  )
}

function emitPluginsArray(
  plugins: readonly PluginEntry[],
  indent: number,
): string {
  const p = pad(indent)
  const inner = indent + 2
  const entries = plugins.map((pl) => emitPluginEntry(pl, inner))
  return `${p}plugins: [\n${entries.join("\n")}\n${p}],`
}

function mergeConfigs(
  configs: ReadonlyArray<AuthServerConfig | undefined>,
): AuthServerConfig {
  const out: AuthServerConfig = {}
  for (const c of configs) {
    if (!c) continue
    if (c.appName !== undefined) out.appName = c.appName
    if (c.plugins) {
      out.plugins = [...(out.plugins ?? []), ...c.plugins]
    }
    if (c.socialProviders) {
      out.socialProviders = { ...out.socialProviders, ...c.socialProviders }
    }
    if (c.emailAndPassword) {
      out.emailAndPassword = {
        ...out.emailAndPassword,
        ...c.emailAndPassword,
      }
    }
    if (c.emailVerification) {
      out.emailVerification = {
        ...out.emailVerification,
        ...c.emailVerification,
      }
    }
    if (c.raw) {
      out.raw = { ...out.raw, ...c.raw }
    }
  }
  return out
}

function emitConfigBody(
  config: AuthServerConfig,
  ctx: AuthServerContext,
  core: CoreContribution,
  indent: number,
): string {
  const sections: string[] = []
  const appName = config.appName ?? ctx.appName
  sections.push(`${pad(indent)}appName: "${appName}",`)
  sections.push(emitKeyExpression("database", core.databaseExpr, indent))

  if (config.emailAndPassword) {
    const props: Array<[string, string]> = []
    if (config.emailAndPassword.enabled !== undefined) {
      props.push(["enabled", String(config.emailAndPassword.enabled)])
    }
    if (config.emailAndPassword.sendResetPassword) {
      props.push(["sendResetPassword", config.emailAndPassword.sendResetPassword])
    }
    if (props.length > 0) {
      sections.push(emitObjectKey("emailAndPassword", props, indent))
    }
  }

  if (config.emailVerification) {
    const props: Array<[string, string]> = []
    if (config.emailVerification.sendOnSignUp !== undefined) {
      props.push(["sendOnSignUp", String(config.emailVerification.sendOnSignUp)])
    }
    if (config.emailVerification.sendVerificationEmail) {
      props.push([
        "sendVerificationEmail",
        config.emailVerification.sendVerificationEmail,
      ])
    }
    if (props.length > 0) {
      sections.push(emitObjectKey("emailVerification", props, indent))
    }
  }

  if (config.socialProviders) {
    const props = Object.entries(config.socialProviders)
    if (props.length > 0) {
      sections.push(emitObjectKey("socialProviders", props, indent))
    }
  }

  if (config.plugins && config.plugins.length > 0) {
    sections.push(emitPluginsArray(config.plugins, indent))
  }

  if (config.raw) {
    for (const [k, v] of Object.entries(config.raw)) {
      sections.push(emitKeyExpression(k, v, indent))
    }
  }

  return sections.join("\n")
}

export function generateAuthServer(
  fragments: readonly ExtraFragments[],
  ctx: AuthServerContext,
): string {
  const auths: AuthServerFragment[] = fragments
    .map((f) => f.auth)
    .filter((a): a is AuthServerFragment => a !== undefined)

  const core = coreContribution(ctx)
  const allImports: ImportSpec[] = [
    ...core.imports,
    ...auths.flatMap((a) => a.imports ?? []),
  ]

  const config = mergeConfigs(auths.map((a) => a.config))
  const topBefore = auths.flatMap((a) => a.topLevel?.before ?? [])
  const topAfter = auths.flatMap((a) => a.topLevel?.after ?? [])

  const parts: string[] = []
  parts.push(formatImports(allImports))
  parts.push("")
  if (topBefore.length > 0) {
    parts.push(topBefore.join("\n\n"))
    parts.push("")
  }
  parts.push("export const auth = betterAuth({")
  parts.push(emitConfigBody(config, ctx, core, 2))
  parts.push("})")
  if (topAfter.length > 0) {
    parts.push("")
    parts.push(topAfter.join("\n\n"))
  }

  return parts.join("\n") + "\n"
}
