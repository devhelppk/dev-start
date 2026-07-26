# Codex Instructions

## Product philosophy (read first)

**Canonical:** [`PHILOSOPHY.md`](./PHILOSOPHY.md) · Docs: `/docs/philosophy`

ds-start ships **complete functional blocks** (not raw components) plus verified **presets**, built on libraries like shadcn/ui and Better Auth. Blocks bolt on via `init` or `add`. Agents and humans should spend effort on product features, not re-deriving email, forms, jobs, auth glue, or conventions.

Before adding or changing a module, apply the decision test in `PHILOSOPHY.md`. Reference pattern: `forms` and `email`. Future blocks (`jobs`, `ai`, `organizations`, …) must meet the same bar.

## Project Overview

Bun monorepo for **ds-start** (`cli/` publishes the npm package; `web/` is the marketing + docs site).

- CLI: scaffold with `ds-start init`, bolt blocks onto existing apps with `ds-start add`
- Templates live under `cli/templates/nextjs/{base,extras}/`
- Marketing/docs site: `web/` (Fumadocs + Next.js)

## Project Structure

```
cli/                          # ds-start package (workspace)
  src/
    cli.ts                    # Main command definition (citty)
    commands/                 # init, add, create
    helpers/                  # git, install, package-json, scaffold utilities
    codegen/                  # Typed fragment composition (auth, schema, …)
    modules.ts                # Module registry
  templates/nextjs/
    base/                     # Foundation template
    extras/                   # Functional blocks (email, forms, …)
web/                          # Marketing site + docs
PHILOSOPHY.md                 # Core product philosophy (source of truth)
```

## Code Location Rules

- CLI commands go in `cli/src/commands/`
- Shared utilities go in `cli/src/helpers/`
- Codegen fragments go in `cli/src/codegen/`
- New blocks go in `cli/templates/nextjs/extras/{block}/` and register in `modules.ts`
- Dotfiles in templates use underscore prefix (`_gitignore`, `_env.schema`) — npm strips dotfiles on publish
- Docs for blocks: `web/content/docs/modules/`
- Philosophy for humans/agents: `PHILOSOPHY.md` and `web/content/docs/philosophy.mdx`

## Block authoring rules

When creating or extending an extra/module:

1. Ship **end-to-end functionality**, not a thin library wrapper
2. Expose a **small, stable API** agents can call
3. Follow kit conventions (types, env schema, folder layout, skills)
4. Support both **`init` and `add`**
5. Include a **verify path** that proves build/boot with the block enabled

Prefer improving completeness of existing blocks over adding unverified surface area.

## Quality Gates

```bash
# Run before commits:
bun run lint        # oxlint
bun run typecheck   # tsc --noEmit
bun run build       # tsup
```

## Type Safety Rules (enforced)

- NEVER use `any` type — use `unknown` + type guards, or define proper types
- NEVER use type assertions (`as Type`) — use type narrowing, discriminated unions, or `satisfies`
- NEVER add `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck` comments
- NEVER add `eslint-disable` comments
- ALL function parameters and return types must be explicitly typed
- For external data, define Zod schemas or TypeScript interfaces FIRST
- Use `satisfies` operator over `as` for type validation
- Escape hatch: append `// type-ok` to a line ONLY when absolutely unavoidable (third-party API mismatch, etc.)

## Conventions

- **File naming:** kebab-case for all files and directories
- **Imports:** Relative imports with `.js` extensions (ESM). No path aliases in CLI source.
- **Exports:** Named exports for helpers/utilities. No default exports except entry points.
- **Functions:** Named function declarations for exported functions. Async/await throughout.
- **CLI framework:** citty for command definitions, consola for logging/prompts
- **Error handling:** Throw errors, let them propagate. Defensive checks with early returns.
- **Commit style:** Conventional commits via commitlint + commitizen (cz-git)
- **Versioning:** Changesets
