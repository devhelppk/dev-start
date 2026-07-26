`nextjs/base` is restored from a real `shadcn` Next.js scaffold. Dev tooling (husky + lint-staged) is included in the base template.

Currently supported:

1. `base`
2. `base + extras/prisma`
3. `base + extras/prisma + extras/better-auth`
4. `base + extras/github-workflows`
5. `base + extras/github-workflows + extras/vercel-deploy`
6. `base + extras/prisma + extras/github-workflows`
7. `base + extras/prisma + extras/github-workflows + extras/vercel-deploy`
8. `base + extras/prisma + extras/better-auth + extras/github-workflows`
9. `base + extras/prisma + extras/better-auth + extras/github-workflows + extras/vercel-deploy`
10. `base + extras/drizzle`
11. `base + extras/drizzle + extras/better-auth`
12. `base + extras/email`
13. `base + extras/forms`
14. `base + extras/stripe` (with better-auth or clerk)

Still pending:

1. overlay combinations beyond the verified paths

Do not expand the public scaffold contract until each supported path is verified in CI.
