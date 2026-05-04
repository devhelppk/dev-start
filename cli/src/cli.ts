import { defineCommand } from "citty";
import { create } from "./commands/create.js";
import { add } from "./commands/add.js";
import { resolveInitOptions } from "./prompts/init-wizard.js";

const initArgs = {
  dir: {
    type: "positional" as const,
    description: "Project directory",
    required: false,
  },
  yes: {
    type: "boolean" as const,
    alias: "y",
    description: "Accept the recommended production starter defaults",
    default: false,
  },
  "no-git": {
    type: "boolean" as const,
    description: "Skip git initialization",
    default: false,
  },
  "no-install": {
    type: "boolean" as const,
    description: "Skip dependency installation",
    default: false,
  },
  "github-workflows": {
    type: "boolean" as const,
    description: "Include GitHub Actions CI workflow",
    default: false,
  },
  "vercel-deploy": {
    type: "boolean" as const,
    description: "Include Vercel deployment workflow (implies --github-workflows)",
    default: false,
  },
  prisma: {
    type: "boolean" as const,
    description: "Include Prisma ORM",
    default: false,
  },
  drizzle: {
    type: "boolean" as const,
    description: "Include Drizzle ORM (mutually exclusive with --prisma)",
    default: false,
  },
  auth: {
    type: "boolean" as const,
    description: "Include authentication with Better Auth (requires --prisma or --drizzle)",
    default: false,
  },
  clerk: {
    type: "boolean" as const,
    description: "Include authentication with Clerk (no database required)",
    default: false,
  },
  stripe: {
    type: "boolean" as const,
    description: "Include Stripe billing (requires --auth or --clerk)",
    default: false,
  },
  email: {
    type: "boolean" as const,
    description: "Include transactional email with Resend + React Email",
    default: false,
  },
  "file-uploads": {
    type: "boolean" as const,
    description: "Include S3-compatible file uploads",
    default: false,
  },
  zustand: {
    type: "boolean" as const,
    description: "Include Zustand client state management",
    default: false,
  },
  forms: {
    type: "boolean" as const,
    description: "Include JSON-driven form renderer",
    default: false,
  },
  base: {
    type: "boolean" as const,
    description: "Scaffold base template only, no extras",
    default: false,
  },
};

async function runInit(args: Record<string, unknown>): Promise<void> {
  const options = await resolveInitOptions(args);
  await create(options);
}

/** The `init` subcommand — same as running devstart without a subcommand. */
const init = defineCommand({
  meta: {
    name: "init",
    description: "Scaffold a production-ready Next.js app",
  },
  args: initArgs,
  async run({ args }) {
    await runInit(args);
  },
});

/** Root command — routes to `init` or `add` subcommands. */
export const main = defineCommand({
  meta: {
    name: "devstart",
    version: "0.0.1",
    description: "Scaffold and extend production-ready Next.js apps",
  },
  subCommands: {
    init,
    add,
  },
});
