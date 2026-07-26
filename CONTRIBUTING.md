# Contributing to ds-start

Thanks for your interest in contributing! This guide will help you get started.

**Read [`PHILOSOPHY.md`](./PHILOSOPHY.md) first.** New modules must be complete functional blocks (not raw component wrappers), support `init` and `add`, expose a small stable API, and include a verify path. Forms and email are the reference pattern.

## Development Setup

1. Fork and clone the repo:

   ```bash
   git clone https://github.com/<your-username>/dev-start.git
   cd dev-start
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build the CLI:

   ```bash
   bun run build
   ```

4. Verify your setup:

   ```bash
   bun run lint
   bun run typecheck
   node cli/dist/index.js --help
   ```

## Making Changes

### Workflow

1. Create a branch from `main`:

   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes. Follow the conventions below.

3. Run quality gates before committing:

   ```bash
   bun run lint
   bun run typecheck
   bun run build
   ```

4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: add cool new feature"
   ```

5. Push and open a pull request against `main`.

### Commit Style

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint. Prefix your commit messages:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation only
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `chore:` — tooling, CI, dependencies

### Code Conventions

- **TypeScript strict mode** — no `any`, no type assertions, no `@ts-ignore`
- **kebab-case** for all files and directories
- **Named exports** for helpers and utilities
- **Relative imports** with `.js` extensions (ESM)
- **oxlint** for linting — no `eslint-disable` comments

### Template Changes

Templates live in `cli/templates/`. When modifying templates:

- **Base template** (`nextjs/base/`) — changes here affect every scaffolded project
- **Extras** (`nextjs/extras/`) — changes are opt-in
- Dotfiles use underscore prefix (`_gitignore`, `_env.schema`) because npm strips dotfiles on publish
- Run the relevant verification script after changes:

  ```bash
  bun run verify:nextjs-base
  bun run verify:nextjs-better-auth-prisma
  ```

### Adding a New Extra

1. Create a directory under `cli/templates/nextjs/extras/<name>/`
2. Add a `package.json` with dependencies and scripts to merge
3. Add a `README.md` documenting the extra
4. Register the extra in `cli/src/cli.ts` (flag) and `cli/src/commands/create.ts` (scaffold logic)
5. Add a verification script in `scripts/`
6. Add the verification job to `.github/workflows/ci.yml`

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for versioning. If your PR changes user-facing behavior:

```bash
bunx changeset
```

Select the package (`devstart`), choose the semver bump type, and write a summary. Commit the generated changeset file with your PR.

## Reporting Issues

- Use [GitHub Issues](https://github.com/shahzaibjak/dev-start/issues)
- Include steps to reproduce, expected vs actual behavior
- For scaffold bugs, include the command you ran and the error output

## Code of Conduct

Be kind and constructive. We're all here to build good tools.
