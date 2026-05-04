export const MODULE_IDS = [
  "prisma",
  "drizzle",
  "better-auth",
  "clerk",
  "stripe",
  "email",
  "file-uploads",
  "forms",
  "zustand",
  "github-workflows",
  "vercel-deploy",
] satisfies readonly string[];

export const MODULE_LABELS: Record<string, string> = {
  prisma: "Prisma + Postgres",
  drizzle: "Drizzle + Postgres",
  "better-auth": "Better Auth",
  clerk: "Clerk",
  stripe: "Stripe billing",
  email: "Transactional email",
  "file-uploads": "File uploads",
  forms: "Form renderer",
  zustand: "Zustand",
  "github-workflows": "GitHub Actions CI",
  "vercel-deploy": "Vercel deployment workflow",
};

export const AUTH_PROVIDERS = {
  betterAuth: "better-auth",
  clerk: "clerk",
} satisfies Record<string, string>;

export const DATABASE_ADAPTERS = {
  prisma: "prisma",
  drizzle: "drizzle",
} satisfies Record<string, string>;
