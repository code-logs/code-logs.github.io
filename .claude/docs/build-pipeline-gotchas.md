# Build Pipeline Gotchas

Read this when: modifying `next.config.js`, `package.json` scripts, the licenses pipeline, or `.github/workflows/docs.yml`.

## Pitfalls

### `pnpm <name>` collides with built-in subcommands
- `pnpm docs` and `pnpm licenses` invoke pnpm's built-in subcommands, NOT the `package.json` scripts. Silent failure: `pnpm docs` prints `[ERR_PNPM_MISSING_PACKAGE_NAME]` instead of running the build.
- ALWAYS write `pnpm run <name>` for these scripts. CI uses `pnpm run` for the same reason.

### `next.config.js` `distDir` and `output: 'export'`
- With `output: 'export'`, Next writes the static export to `out/` regardless of `distDir`. `distDir` only relocates the `.next/` build cache.
- NEVER set `distDir: 'docs'`. We tried it once: `BUILD_ID` and other cache files leaked into `docs/`, and `docs:clean` then deleted them every build, forcing a full re-build.
- The `docs` script moves `out/` to `docs/` after `next build` completes (`mv ./out ./docs`).

### pnpm 11 blocks build scripts and exotic git subdeps
- pnpm 11 throws a hard error on first install for packages with native postinstall scripts (`sharp`, `@parcel/watcher`, `unrs-resolver`). Approve them in `pnpm-workspace.yaml` under `allowBuilds` (the legacy `package.json` `pnpm.onlyBuiltDependencies` is removed).
- pnpm 11 also blocks transitive deps resolved via git URLs. `npm-license-crawler` had such a subdep, so it was replaced with `license-checker-rseidelsohn`. NEVER reintroduce a dep that pulls from a git URL.

### `/licenses` page consumes a specific JSON shape
- The page at `pages/licenses/index.tsx` reads `licenses[depName].licenses` and `licenses[depName].repository`.
- The current generator (`license-checker-rseidelsohn`, invoked via `pnpm run licenses`) does NOT emit `licenseUrl`. NEVER write code that depends on `licenseUrl` — use `repository`.
- Switching to a different license tool requires verifying both keys exist in its output.

### React 19 + TypeScript: no global `JSX` namespace
- React 19 dropped the auto-imported global `JSX` namespace. `JSX.Element` in component prop or return types causes `Cannot find namespace 'JSX'` at build time.
- ALWAYS `import { ReactElement } from 'react'` and use `ReactElement` instead. (`React.JSX.Element` works too but adds a needless namespace hop.)

### Husky v9 layout
- Husky v9 hooks are plain shell scripts at `.husky/<hook>` — no shebang line, no `husky.sh` source line.
- `prepare` script MUST be `husky` (not `husky install`, which is deprecated in v9).
- The `.husky/_/` directory is generated locally by the `prepare` script; it MUST NOT be committed.

### `pnpm.overrides` are security pins
- Many entries in `package.json` `pnpm.overrides` exist purely to satisfy Dependabot alerts on transitive deps (lodash, flatted, immutable, etc.).
- NEVER trim them without confirming via `pnpm why <pkg>` that the parent dependency tree no longer requires the vulnerable range.
- See issue #87 for the planned cleanup pass.

## CI prerequisites
- `.github/workflows/docs.yml` uses Corepack to bootstrap pnpm. The `packageManager` field in `package.json` is the source of truth — bumping the pnpm version there updates CI automatically; no `pnpm/action-setup` needed.
- `pnpm install --frozen-lockfile` in CI fails if `pnpm-lock.yaml` is out of sync with `package.json`. ALWAYS commit lockfile changes alongside dependency edits.
- The Node version comes from `.nvmrc` via `actions/setup-node@v4` `node-version-file`. Bumping `.nvmrc` updates CI in lockstep.

## Rationale
- Locking pnpm via `packageManager` + Node via `.nvmrc` + Corepack means contributors don't install pnpm globally — `corepack enable` once per machine is the only setup. This eliminates a class of "works on my machine" lockfile churn.
