export interface ImportSpec {
  from: string
  named?: string[]
  default?: string
  namespace?: string
  typeOnly?: boolean
}

export interface PluginEntry {
  name: string
  args?: string
}

export interface AuthServerConfig {
  appName?: string
  database?: string
  plugins?: PluginEntry[]
  socialProviders?: Record<string, string>
  emailAndPassword?: {
    enabled?: boolean
    sendResetPassword?: string
  }
  emailVerification?: {
    sendOnSignUp?: boolean
    sendVerificationEmail?: string
  }
  raw?: Record<string, string>
}

export interface AuthServerFragment {
  imports?: ImportSpec[]
  config?: AuthServerConfig
  topLevel?: { before?: string[]; after?: string[] }
}

export interface AuthClientFragment {
  imports?: ImportSpec[]
  plugins?: PluginEntry[]
}

export interface PrismaModelEdit {
  fields?: string[]
  attributes?: string[]
}

export interface PrismaSchemaFragment {
  models?: string[]
  modelEdits?: Record<string, PrismaModelEdit>
  enums?: string[]
}

export interface DrizzleTableEdit {
  columns?: string[]
  extras?: string[]
}

export interface DrizzleSchemaFragment {
  imports?: ImportSpec[]
  tables?: string[]
  tableEdits?: Record<string, DrizzleTableEdit>
}

export interface ExtraFragments {
  extra: string
  requires?: string[]
  auth?: AuthServerFragment
  authClient?: AuthClientFragment
  prismaSchema?: PrismaSchemaFragment
  drizzleSchema?: DrizzleSchemaFragment
}
