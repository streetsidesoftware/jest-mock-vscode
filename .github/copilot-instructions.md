# Copilot Instructions for `jest-mock-vscode`

## Repository purpose

- This package provides Jest and Vitest-friendly mocks for the VS Code API.
- The main public entry point is `/home/runner/work/jest-mock-vscode/jest-mock-vscode/src/index.ts`.
- The generated CommonJS package entry point is `/home/runner/work/jest-mock-vscode/jest-mock-vscode/index.js`, which re-exports the compiled output from `dist/`.

## Tech stack and environment

- Language: TypeScript.
- Package manager: `pnpm` (see `packageManager` in `/home/runner/work/jest-mock-vscode/jest-mock-vscode/package.json`).
- Required Node version: `>22.0.0`.
- The repo is a pnpm workspace with integration test packages under `/home/runner/work/jest-mock-vscode/jest-mock-vscode/test-packages`.

## Important paths

- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/src/`
  - Main source and unit tests.
- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/src/vscode/`
  - Mock implementations for VS Code types and modules.
- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/test-packages/jest-integration/`
  - Consumer-style Jest integration tests.
- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/test-packages/vitest-integration/`
  - Consumer-style Vitest integration tests.
- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/README.md`
  - Public usage docs; some examples are injected from files in `test-packages`.
- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/.github/workflows/test.yml`
  - CI build and test flow.
- `/home/runner/work/jest-mock-vscode/jest-mock-vscode/.github/workflows/lint.yml`
  - CI lint and spell-check flow.

## Build, test, and lint commands

Run commands from `/home/runner/work/jest-mock-vscode/jest-mock-vscode`.

- Install dependencies: `pnpm install`
- Build all TypeScript projects: `pnpm build`
- Run root unit tests plus workspace integration tests: `pnpm test`
- Run only root Jest tests: `pnpm test:root`
- Run lint checks used in CI: `pnpm lint:ci`
- Auto-fix lint and formatting issues: `pnpm lint`
- Run spelling checks: `pnpm lint:spelling`
- Rebuild injected README snippets after changing example files: `pnpm build:readme`

CI currently installs dependencies, runs `pnpm build`, then runs `pnpm test` and `pnpm lint:ci`.

## Working conventions

- Prefer small, focused changes; this is a published package.
- Do not hand-edit generated output in `dist/`.
- Keep README usage snippets in sync by editing the source example files in `test-packages`, then run `pnpm build:readme`.
- Root Jest tests live in `src/**/*.test.ts`; the root Jest config ignores `test-packages`.
- Integration coverage lives in the workspace packages under `test-packages`.
- Formatting uses Prettier with `singleQuote: true` and `printWidth: 120`.
- ESLint uses the flat config in `/home/runner/work/jest-mock-vscode/jest-mock-vscode/eslint.config.mjs`.

## Efficient agent workflow

1. Read `package.json`, `README.md`, and the relevant files in `src/` before editing.
2. If a change affects public behavior or docs examples, check both root tests and the relevant integration package.
3. After editing source or examples, run `pnpm build`.
4. Run the smallest relevant validation first, then `pnpm test` and `pnpm lint:ci` before finishing broader changes.
5. If README example sources changed, run `pnpm build:readme` and review the generated README diff.

## Known gotchas

- `README.md` contains injected sections; direct edits inside injected blocks will be overwritten.
- The package depends on `@types/vscode` as a peer dependency, so type-surface changes should be checked carefully.
- The repository uses CommonJS packaging even though most source is TypeScript.

## Errors encountered during onboarding

- `pnpm` was not initially available in the environment. Work-around: run `corepack enable` before using repo scripts.
- `pnpm lint:ci` failed before a build because `index.js` requires `./dist/index` and ESLint checked that import before `dist/` existed. Work-around: run `pnpm build` before linting, matching the CI workflow order.
- `pnpm lint:spelling` failed locally because `cspell` is not installed as a repo dependency. Work-around: use the GitHub Actions spelling workflow or run `pnpm dlx cspell --dot <path>` for local spot checks.
