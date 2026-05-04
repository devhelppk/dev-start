import path from "node:path";
import fs from "fs-extra";
import consola from "consola";
import { initGit } from "../helpers/git.js";
import { installDeps } from "../helpers/install.js";
import { updatePackageJson } from "../helpers/package-json.js";
import { applyExtraSubTemplate, scaffold } from "../helpers/scaffold.js";

const PRISMA_CI_STEP = `
      - name: Generate Prisma client
        run: bun run db:generate

`;

const DRIZZLE_CI_STEP = `
      - name: Generate Drizzle migrations
        run: bun run db:generate

`;

const CI_LINT_MARKER = `      - name: Lint`;

async function patchCiForDb(targetDir: string, ciStep: string): Promise<void> {
  const ciPath = path.join(targetDir, ".github", "workflows", "ci.yml");

  if (!(await fs.pathExists(ciPath))) {
    return;
  }

  const content = await fs.readFile(ciPath, "utf8");

  if (content.includes("db:generate")) {
    return;
  }

  const patched = content.replace(CI_LINT_MARKER, `${ciStep}${CI_LINT_MARKER}`);
  await fs.writeFile(ciPath, patched);
}

export interface CreateOptions {
  projectDir: string;
  template: string;
  extras: {
    auth?: string;
    db?: string;
    githubWorkflows?: string;
    vercelDeploy?: string;
    stripe?: string;
    email?: string;
    fileUploads?: string;
    zustand?: string;
    forms?: string;
  };
  initGit: boolean;
  install: boolean;
}

export async function create(opts: CreateOptions) {
  const targetDir = path.resolve(process.cwd(), opts.projectDir);
  const projectName = path.basename(targetDir);
  const requestedExtras = [
    opts.extras.db,
    opts.extras.auth,
    opts.extras.githubWorkflows,
    opts.extras.vercelDeploy,
    opts.extras.stripe,
    opts.extras.email,
    opts.extras.fileUploads,
    opts.extras.zustand,
    opts.extras.forms,
  ].filter((value): value is string => typeof value === "string" && value.length > 0);
  const selectedExtras = requestedExtras.join(" + ");

  const details = [
    `project: ${projectName}`,
    `target directory: ${targetDir}`,
    `template: ${opts.template}`,
    selectedExtras ? `requested extras: ${selectedExtras}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (opts.template !== "nextjs") {
    throw new Error(
      `Only the nextjs/base scaffold path is available in the rebuilt template contract.\n\n${details}`,
    );
  }

  const supportedExtras = new Set([
    "better-auth",
    "clerk",
    "drizzle",
    "email",
    "file-uploads",
    "github-workflows",
    "prisma",
    "stripe",
    "vercel-deploy",
    "zustand",
    "forms",
  ]);
  const unsupportedExtras = requestedExtras.filter((extra) => !supportedExtras.has(extra));
  if (unsupportedExtras.length > 0) {
    throw new Error(
      `Unsupported template extras requested: ${unsupportedExtras.join(", ")}.\n\n${details}\n\nSupported extras: prisma, drizzle, better-auth (requires prisma or drizzle), clerk, github-workflows, vercel-deploy (requires github-workflows). All combinations are valid.`,
    );
  }

  if (requestedExtras.includes("prisma") && requestedExtras.includes("drizzle")) {
    throw new Error(
      `Cannot use both prisma and drizzle. Choose one database adapter.\n\n${details}`,
    );
  }

  if (requestedExtras.includes("better-auth") && !requestedExtras.includes("prisma") && !requestedExtras.includes("drizzle")) {
    throw new Error(
      `The better-auth extra requires a database adapter (prisma or drizzle).\n\n${details}`,
    );
  }

  if (requestedExtras.includes("better-auth") && requestedExtras.includes("clerk")) {
    throw new Error(
      `Cannot use both better-auth and clerk. Choose one auth provider.\n\n${details}`,
    );
  }

  if (requestedExtras.includes("stripe") && !requestedExtras.includes("better-auth") && !requestedExtras.includes("clerk")) {
    throw new Error(
      `Stripe billing requires an auth provider (better-auth or clerk).\n\n${details}`,
    );
  }

  if (await fs.pathExists(targetDir)) {
    const existingEntries = await fs.readdir(targetDir);
    if (existingEntries.length > 0) {
      throw new Error(`Target directory already exists and is not empty: ${targetDir}`);
    }
  } else {
    await fs.ensureDir(targetDir);
  }

  const scaffoldLabel = selectedExtras ? `nextjs/base + ${selectedExtras}` : "nextjs/base";

  const hasPrisma = requestedExtras.includes("prisma");
  const hasDrizzle = requestedExtras.includes("drizzle");

  consola.start(`Scaffolding ${scaffoldLabel} into ${targetDir}`);
  const excludeSubDirs: Record<string, string[]> = {};
  if (requestedExtras.includes("better-auth")) {
    excludeSubDirs["better-auth"] = hasDrizzle ? ["prisma", "drizzle"] : ["drizzle"];
  }
  if (requestedExtras.includes("stripe")) {
    excludeSubDirs.stripe = ["better-auth", "better-auth-drizzle", "clerk"];
  }
  if (requestedExtras.includes("email")) {
    excludeSubDirs.email = ["better-auth", "better-auth-stripe", "better-auth-drizzle", "better-auth-drizzle-stripe"];
  }
  if (requestedExtras.includes("forms")) {
    excludeSubDirs.forms = ["file-uploads"];
  }
  const excludeArg = Object.keys(excludeSubDirs).length > 0 ? excludeSubDirs : undefined;
  await scaffold("nextjs", targetDir, requestedExtras, excludeArg);

  if (requestedExtras.includes("better-auth") && hasDrizzle) {
    await applyExtraSubTemplate("nextjs", targetDir, "better-auth", "drizzle");
  }

  if (requestedExtras.includes("stripe") && requestedExtras.includes("better-auth")) {
    if (hasDrizzle) {
      await applyExtraSubTemplate("nextjs", targetDir, "stripe", "better-auth-drizzle");
    } else {
      await applyExtraSubTemplate("nextjs", targetDir, "stripe", "better-auth");
    }
  } else if (requestedExtras.includes("stripe") && requestedExtras.includes("clerk")) {
    await applyExtraSubTemplate("nextjs", targetDir, "stripe", "clerk");
  }

  if (requestedExtras.includes("forms") && requestedExtras.includes("file-uploads")) {
    await applyExtraSubTemplate("nextjs", targetDir, "forms", "file-uploads");
  }

  if (requestedExtras.includes("email") && requestedExtras.includes("better-auth") && requestedExtras.includes("stripe")) {
    if (hasDrizzle) {
      await applyExtraSubTemplate("nextjs", targetDir, "email", "better-auth-drizzle-stripe");
    } else {
      await applyExtraSubTemplate("nextjs", targetDir, "email", "better-auth-stripe");
    }
  } else if (requestedExtras.includes("email") && requestedExtras.includes("better-auth")) {
    if (hasDrizzle) {
      await applyExtraSubTemplate("nextjs", targetDir, "email", "better-auth-drizzle");
    } else {
      await applyExtraSubTemplate("nextjs", targetDir, "email", "better-auth");
    }
  }

  await updatePackageJson(targetDir, projectName, {});

  if (hasPrisma && requestedExtras.includes("github-workflows")) {
    await patchCiForDb(targetDir, PRISMA_CI_STEP);
  } else if (hasDrizzle && requestedExtras.includes("github-workflows")) {
    await patchCiForDb(targetDir, DRIZZLE_CI_STEP);
  }

  if (opts.initGit) {
    await initGit(targetDir);
  }

  if (opts.install) {
    await installDeps(targetDir);
  }

  const hasBetterAuth = requestedExtras.includes("better-auth");
  const hasClerk = requestedExtras.includes("clerk");
  const hasStripe = requestedExtras.includes("stripe");
  const hasEmail = requestedExtras.includes("email");
  const hasFileUploads = requestedExtras.includes("file-uploads");
  const hasZustand = requestedExtras.includes("zustand");
  const hasForms = requestedExtras.includes("forms");
  const hasVercelDeploy = requestedExtras.includes("vercel-deploy");

  const nextSteps: string[] = [
    `cd ${projectName}`,
  ];

  if (hasClerk) {
    nextSteps.push("# Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env.schema");
  }

  if (hasPrisma) {
    nextSteps.push("# Set your DATABASE_URL in .env.schema");
    if (hasBetterAuth) {
      nextSteps.push("bun run auth:generate");
    }
    nextSteps.push("bun run db:migrate -- --name init");
    nextSteps.push("bun run db:generate");
  } else if (hasDrizzle) {
    nextSteps.push("# Set your DATABASE_URL in .env.schema");
    nextSteps.push("bun run db:push");
    nextSteps.push("bun run db:generate");
  }

  nextSteps.push("bun run env:check");
  nextSteps.push("bun run dev");

  if (hasStripe && hasBetterAuth) {
    nextSteps.push("");
    nextSteps.push("# Stripe billing setup:");
    nextSteps.push("# 1. Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PUBLISHABLE_KEY in .env.schema");
    nextSteps.push("# 2. Replace price_*_placeholder values in lib/auth.ts with real Stripe price IDs");
    nextSteps.push("# 3. Run `bun run auth:generate` then `bun run db:migrate` to add subscription tables");
    nextSteps.push("# 4. Visit /billing to see the billing page");
  } else if (hasStripe && hasClerk) {
    nextSteps.push("");
    nextSteps.push("# Clerk billing setup:");
    nextSteps.push("# 1. Enable Billing in Clerk Dashboard → Configure → Subscription plans");
    nextSteps.push("# 2. Create plans and attach features in the Clerk Dashboard");
    nextSteps.push("# 3. Visit /billing to see the billing page");
  }

  if (hasEmail) {
    nextSteps.push("");
    nextSteps.push("# Email setup:");
    nextSteps.push("# Set RESEND_API_KEY in .env.schema");
    nextSteps.push("# Run `bun run email:dev` to preview templates");
  }

  if (hasFileUploads) {
    nextSteps.push("");
    nextSteps.push("# File uploads setup:");
    nextSteps.push("# 1. Set S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env.schema");
    nextSteps.push("# 2. Set S3_ENDPOINT for R2/MinIO/Backblaze (omit for AWS S3)");
    nextSteps.push("# 3. Use <FileUpload /> component — see components/file-upload.tsx");
  }

  if (hasZustand) {
    nextSteps.push("");
    nextSteps.push("# Zustand stores live in lib/stores/ — see lib/stores/counter.ts for the pattern");
  }

  if (hasForms) {
    nextSteps.push("");
    nextSteps.push("# Form renderer: see app/(examples)/forms/page.tsx for usage");
    nextSteps.push("# Define a FormSchema and pass it to <FormRenderer /> — see lib/forms/types.ts");
  }

  if (hasVercelDeploy) {
    nextSteps.push("");
    nextSteps.push("# Vercel deployment setup:");
    nextSteps.push("# 1. Set VERCEL_TOKEN and VERCEL_ORG_ID in GitHub secrets");
    nextSteps.push("# 2. Add VERCEL_PROJECT_ID as a GitHub variable");
    nextSteps.push("# 3. See extras/vercel-deploy/README.md for details");
  }

  const extrasLine = selectedExtras ? `\nExtras: ${selectedExtras}` : "";

  consola.box(
    `${projectName}${extrasLine}\n\nNext steps:\n${nextSteps.map((s) => `  ${s}`).join("\n")}\n\nEdit app/page.tsx to start building.`,
  );
}
