import consola from "consola";
import type { CreateOptions } from "../commands/create.js";
import { AUTH_PROVIDERS, DATABASE_ADAPTERS, MODULE_LABELS } from "../modules.js";
import { RECOMMENDED_PRODUCTION_PRESET } from "../presets.js";
import { promptConfirm, promptSelect, promptText } from "./prompt-utils.js";

const BUILD_RECOMMENDED = "Recommended production starter";
const BUILD_AUTH = "App with auth";
const BUILD_BASE = "Base app";

const AUTH_BETTER = "Better Auth";
const AUTH_CLERK = "Clerk";
const AUTH_NONE = "None";

const DB_PRISMA = "Prisma + Postgres";
const DB_DRIZZLE = "Drizzle + Postgres";

interface InitSelection {
  options: CreateOptions;
  prompted: boolean;
}

function boolArg(args: Record<string, unknown>, key: string): boolean {
  return args[key] === true;
}

function stringArg(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function hasModuleFlags(args: Record<string, unknown>): boolean {
  return boolArg(args, "githubWorkflows")
    || boolArg(args, "vercelDeploy")
    || boolArg(args, "prisma")
    || boolArg(args, "drizzle")
    || boolArg(args, "auth")
    || boolArg(args, "clerk")
    || boolArg(args, "stripe")
    || boolArg(args, "email")
    || boolArg(args, "fileUploads")
    || boolArg(args, "zustand")
    || boolArg(args, "forms")
    || boolArg(args, "base");
}

function createBaseOptions(
  projectDir: string,
  args: Record<string, unknown>,
): CreateOptions {
  return {
    projectDir,
    template: "nextjs",
    extras: {},
    initGit: !boolArg(args, "noGit"),
    install: !boolArg(args, "noInstall"),
  };
}

function applyFlagSelections(
  options: CreateOptions,
  args: Record<string, unknown>,
): void {
  if (boolArg(args, "prisma")) {
    options.extras.db = DATABASE_ADAPTERS.prisma;
  }

  if (boolArg(args, "drizzle")) {
    options.extras.db = DATABASE_ADAPTERS.drizzle;
  }

  if (boolArg(args, "auth")) {
    options.extras.auth = AUTH_PROVIDERS.betterAuth;
  }

  if (boolArg(args, "clerk")) {
    options.extras.auth = AUTH_PROVIDERS.clerk;
  }

  if (boolArg(args, "vercelDeploy")) {
    options.extras.githubWorkflows = "github-workflows";
    options.extras.vercelDeploy = "vercel-deploy";
  } else if (boolArg(args, "githubWorkflows")) {
    options.extras.githubWorkflows = "github-workflows";
  }

  if (boolArg(args, "stripe")) {
    options.extras.stripe = "stripe";
  }

  if (boolArg(args, "email")) {
    options.extras.email = "email";
  }

  if (boolArg(args, "fileUploads")) {
    options.extras.fileUploads = "file-uploads";
  }

  if (boolArg(args, "forms")) {
    options.extras.forms = "forms";
  }

  if (boolArg(args, "zustand")) {
    options.extras.zustand = "zustand";
  }
}

function applyRecommendedPreset(options: CreateOptions): void {
  options.extras = {
    ...RECOMMENDED_PRODUCTION_PRESET.extras,
  };
}

async function selectAuthProvider(
  includeNone: boolean,
  initial: string,
): Promise<string | undefined> {
  const options = includeNone
    ? [AUTH_BETTER, AUTH_CLERK, AUTH_NONE]
    : [AUTH_BETTER, AUTH_CLERK];
  const answer = await promptSelect("Auth provider?", options, initial);

  if (answer === AUTH_BETTER) {
    return AUTH_PROVIDERS.betterAuth;
  }

  if (answer === AUTH_CLERK) {
    return AUTH_PROVIDERS.clerk;
  }

  return undefined;
}

async function selectDatabaseAdapter(): Promise<string> {
  const answer = await promptSelect("Database adapter?", [DB_PRISMA, DB_DRIZZLE], DB_PRISMA);

  if (answer === DB_PRISMA) {
    return DATABASE_ADAPTERS.prisma;
  }

  if (answer === DB_DRIZZLE) {
    return DATABASE_ADAPTERS.drizzle;
  }

  throw new Error(`Unsupported database adapter: ${answer}`);
}

async function askAuthStack(options: CreateOptions, includeNone: boolean): Promise<void> {
  const initial = options.extras.auth === AUTH_PROVIDERS.clerk ? AUTH_CLERK : AUTH_BETTER;
  const auth = await selectAuthProvider(includeNone, initial);
  options.extras.auth = auth;

  if (auth === AUTH_PROVIDERS.betterAuth) {
    options.extras.db = await selectDatabaseAdapter();
  }
}

async function askOptionalAppModules(
  options: CreateOptions,
  emailInitial: boolean,
): Promise<void> {
  if (options.extras.auth && !options.extras.stripe) {
    const stripe = await promptConfirm("Add Stripe billing?", false);
    options.extras.stripe = stripe ? "stripe" : undefined;
  }

  if (!options.extras.email) {
    const email = await promptConfirm("Add transactional email?", emailInitial);
    options.extras.email = email ? "email" : undefined;
  }

  if (!options.extras.fileUploads) {
    const fileUploads = await promptConfirm("Add file uploads?", false);
    options.extras.fileUploads = fileUploads ? "file-uploads" : undefined;
  }

  if (!options.extras.forms) {
    const forms = await promptConfirm("Add form renderer?", false);
    options.extras.forms = forms ? "forms" : undefined;
  }

  if (options.extras.forms && !options.extras.fileUploads) {
    const fileFields = await promptConfirm("Include file upload fields in forms?", false);
    options.extras.fileUploads = fileFields ? "file-uploads" : undefined;
  }

  if (!options.extras.zustand) {
    const zustand = await promptConfirm("Add Zustand?", false);
    options.extras.zustand = zustand ? "zustand" : undefined;
  }

  if (!options.extras.githubWorkflows) {
    const githubWorkflows = await promptConfirm("Add GitHub Actions CI?", false);
    options.extras.githubWorkflows = githubWorkflows ? "github-workflows" : undefined;
  }

  if (options.extras.githubWorkflows && !options.extras.vercelDeploy) {
    const vercelDeploy = await promptConfirm("Add Vercel deployment workflow?", false);
    options.extras.vercelDeploy = vercelDeploy ? "vercel-deploy" : undefined;
  }
}

async function askRelevantFlagFollowups(options: CreateOptions): Promise<boolean> {
  let prompted = false;
  const needsAuthProvider = Boolean(options.extras.stripe && !options.extras.auth);

  if (needsAuthProvider) {
    options.extras.auth = await selectAuthProvider(false, AUTH_BETTER);
    prompted = true;
  }

  if (options.extras.auth === AUTH_PROVIDERS.betterAuth && !options.extras.db) {
    options.extras.db = await selectDatabaseAdapter();
    prompted = true;
  }

  if (options.extras.forms && !options.extras.fileUploads) {
    const fileFields = await promptConfirm("Include file upload fields in forms?", false);
    options.extras.fileUploads = fileFields ? "file-uploads" : undefined;
    prompted = true;
  }

  if (options.extras.githubWorkflows && !options.extras.vercelDeploy) {
    const vercelDeploy = await promptConfirm("Add Vercel deployment workflow?", false);
    options.extras.vercelDeploy = vercelDeploy ? "vercel-deploy" : undefined;
    prompted = true;
  }

  return prompted;
}

function applyNonInteractiveDefaults(options: CreateOptions): void {
  if (options.extras.auth === AUTH_PROVIDERS.betterAuth && !options.extras.db) {
    options.extras.db = DATABASE_ADAPTERS.prisma;
  }

  if (options.extras.stripe && !options.extras.auth) {
    options.extras.auth = AUTH_PROVIDERS.betterAuth;
    if (!options.extras.db) {
      options.extras.db = DATABASE_ADAPTERS.prisma;
    }
  }
}

function validateSelection(options: CreateOptions, args: Record<string, unknown>): void {
  if (boolArg(args, "base") && hasModuleFlagsWithoutBase(args)) {
    throw new Error(
      "The --base flag cannot be combined with --prisma, --drizzle, --auth, --clerk, --stripe, --email, --file-uploads, --zustand, --forms, --github-workflows, or --vercel-deploy.",
    );
  }

  if (boolArg(args, "auth") && boolArg(args, "clerk")) {
    throw new Error(
      "Cannot use both --auth (Better Auth) and --clerk. Choose one auth provider.",
    );
  }

  if (boolArg(args, "prisma") && boolArg(args, "drizzle")) {
    throw new Error(
      "Cannot use both --prisma and --drizzle. Choose one database adapter.",
    );
  }

  if (options.extras.auth === AUTH_PROVIDERS.betterAuth && !options.extras.db) {
    throw new Error("Better Auth requires a database adapter (--prisma or --drizzle).");
  }

  if (options.extras.stripe && !options.extras.auth) {
    throw new Error("Stripe billing requires an auth provider. Use --stripe with --auth or --clerk.");
  }
}

function hasModuleFlagsWithoutBase(args: Record<string, unknown>): boolean {
  return boolArg(args, "githubWorkflows")
    || boolArg(args, "vercelDeploy")
    || boolArg(args, "prisma")
    || boolArg(args, "drizzle")
    || boolArg(args, "auth")
    || boolArg(args, "clerk")
    || boolArg(args, "stripe")
    || boolArg(args, "email")
    || boolArg(args, "fileUploads")
    || boolArg(args, "zustand")
    || boolArg(args, "forms");
}

function selectedModuleLabels(options: CreateOptions): string[] {
  const labels: string[] = ["Next.js base"];

  if (options.extras.db) labels.push(MODULE_LABELS[options.extras.db]);
  if (options.extras.auth) labels.push(MODULE_LABELS[options.extras.auth]);
  if (options.extras.stripe) labels.push(MODULE_LABELS[options.extras.stripe]);
  if (options.extras.email) labels.push(MODULE_LABELS[options.extras.email]);
  if (options.extras.fileUploads) labels.push(MODULE_LABELS[options.extras.fileUploads]);
  if (options.extras.forms) labels.push(MODULE_LABELS[options.extras.forms]);
  if (options.extras.zustand) labels.push(MODULE_LABELS[options.extras.zustand]);
  if (options.extras.githubWorkflows) labels.push(MODULE_LABELS[options.extras.githubWorkflows]);
  if (options.extras.vercelDeploy) labels.push(MODULE_LABELS[options.extras.vercelDeploy]);

  return labels;
}

async function confirmSelection(options: CreateOptions): Promise<void> {
  const modules = selectedModuleLabels(options)
    .map((label) => `  - ${label}`)
    .join("\n");
  const installLine = options.install ? "yes" : "no";
  const gitLine = options.initGit ? "yes" : "no";

  consola.box(
    `Scaffold ${options.projectDir} with:\n${modules}\n\nInitialize git: ${gitLine}\nInstall dependencies: ${installLine}`,
  );

  const confirmed = await promptConfirm("Continue?", true);
  if (!confirmed) {
    process.exit(0);
  }
}

async function buildInteractiveSelection(options: CreateOptions): Promise<void> {
  const buildType = await promptSelect(
    "What do you want to build?",
    [BUILD_RECOMMENDED, BUILD_AUTH, BUILD_BASE],
    BUILD_RECOMMENDED,
  );

  if (buildType === BUILD_BASE) {
    return;
  }

  if (buildType === BUILD_RECOMMENDED) {
    applyRecommendedPreset(options);
    await askOptionalAppModules(options, true);
    return;
  }

  await askAuthStack(options, false);
  await askOptionalAppModules(
    options,
    options.extras.auth === AUTH_PROVIDERS.betterAuth,
  );
}

export async function resolveInitOptions(
  args: Record<string, unknown>,
): Promise<CreateOptions> {
  const projectDir = stringArg(args, "dir") ?? await promptText("Project name:", "my-app");
  const options = createBaseOptions(projectDir, args);
  const explicitModuleFlags = hasModuleFlags(args);
  let prompted = false;

  validateSelection(options, args);

  if (boolArg(args, "base")) {
    validateSelection(options, args);
    return options;
  }

  applyFlagSelections(options, args);

  if (boolArg(args, "yes")) {
    if (!explicitModuleFlags) {
      applyRecommendedPreset(options);
    }
    applyNonInteractiveDefaults(options);
    validateSelection(options, args);
    return options;
  }

  if (!explicitModuleFlags) {
    await buildInteractiveSelection(options);
    prompted = true;
  } else {
    prompted = await askRelevantFlagFollowups(options);
  }

  if (prompted && !boolArg(args, "noInstall")) {
    const install = await promptConfirm("Install dependencies?", options.install);
    options.install = install;
  }

  validateSelection(options, args);

  const selection = {
    options,
    prompted,
  } satisfies InitSelection;

  if (selection.prompted) {
    await confirmSelection(selection.options);
  }

  return selection.options;
}
