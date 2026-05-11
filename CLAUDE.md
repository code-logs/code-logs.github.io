# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

<!-- DOCS_TEMPLATE_PATH: .claude/doc-templates/ -->

Knowledge derived during an AI agent's work is documented under `.claude/docs/` via the `write-docs` skill. Document templates are managed in `.claude/doc-templates/`. Start at [.claude/docs/index.md](.claude/docs/index.md).

## Toolchain

- **Node**: pinned via `.nvmrc` (Node 22). Use `nvm use` locally.
- **Package manager**: pnpm, version pinned via the `packageManager` field in `package.json` and bootstrapped through Corepack. Run `corepack enable` once per machine; pnpm will then auto-resolve to the pinned version.

## Commands

Always invoke scripts as `pnpm run <script>` — bare `pnpm <script>` collides with built-in pnpm subcommands (e.g. `docs`, `licenses`).

- `pnpm dev` — Next.js dev server (http://localhost:3000)
- `pnpm run build` — Next.js production build (writes static export to `./out` because `output: 'export'` is set in `next.config.js`)
- `pnpm run docs` — full static export pipeline used by CI: cleans, builds, moves `./out` → `./docs`, drops `.nojekyll`, then runs `pnpm run sitemap`. The `./docs` directory is what GitHub Pages serves, so it is committed to `main` (by CI, not by hand — see Deployment).
- `pnpm run sitemap` — runs `bin/generate-sitemap.ts` against the just-built `./docs` directory; will fail if `./docs` is empty.
- `pnpm run licenses` — regenerates `public/licenses.json` (consumed by `/licenses` page) using `license-checker-rseidelsohn`.
- `pnpm run lint` — `next lint` (extends `next/core-web-vitals`; `@next/next/no-img-element` is intentionally disabled — native `<img>` is allowed).

There are no tests. The Husky `pre-commit` hook exists but is a no-op (the `ts-node precommit.ts` line is commented out).

For the *why* behind these commands and config (`distDir` trap, license JSON shape, pnpm 11 build-script policy, React 19 `JSX` removal, Husky v9 layout, security-pin `pnpm.overrides`), see [.claude/docs/build-pipeline-gotchas.md](.claude/docs/build-pipeline-gotchas.md). Do not modify the build pipeline without reading it.

## Deployment

`.github/workflows/docs.yml` runs on every push to `main`: it sets up Node from `.nvmrc`, enables Corepack, runs `pnpm install --frozen-lockfile`, then `pnpm run docs`, and force-commits the regenerated `./docs` back to `main` via `EndBug/add-and-commit`. This is why the git log contains commits like `Commit from GitHub Actions (Docs)`. **Do not hand-edit files under `./docs`** — they are build output and will be overwritten on the next push to `main`. Only edit sources; let CI regenerate `./docs`.

## Architecture

Next.js 15 Pages Router + React 19 + TypeScript, statically exported to GitHub Pages via `output: 'export'`. Styling is a mix of MUI icons (only `@mui/icons-material`, no `@mui/material` components in use) and CSS Modules (`*.module.scss`). All post content is built at build time — there is no runtime data fetching.

### Post pipeline (the central abstraction)

A "post" lives in two places that must stay in sync:

1. **Markdown body** at `posts/<category>/<fileName>.md`.
2. **Metadata entry** appended to the `posts: Post[]` array in `config/posts.config.ts` (title, description, category from the `CATEGORIES` map, `published`, `publishedAt`, `thumbnailName`, `tags`, optional `references` and `series`).

A markdown file with no entry in `posts.config.ts` is invisible; an entry with `published: false` is filtered out. Adding a new post means doing both.

Build-time flow:

- `database/post-database.ts` (`PostDatabase extends Database<Post>`) wraps the config array, filters by `published`, and sorts by `publishedAt` desc with original-order tiebreak. **All page code reads posts through `postsDatabase`, never from the raw config.** Query helpers: `findByTitle`, `findByCategory`, `findByNormalizedTitle`, `query` (search), `count*`, `hasNewByCategory` (7-day window).
- `pages/[title].tsx` is the dynamic post route. `getStaticPaths` enumerates all published posts; `getStaticProps` calls `MarkdownUtil.getMarkdownContent` which reads `./posts/<category>/<fileName>.md` (note: `MarkdownUtil.publicPath` is `'./public'` and `PostUtil.getMarkdownFilePath` returns `'../posts/...'` — the `path.resolve` joins them back to `./posts/...`). Markdown is parsed with `marked` and injected via `dangerouslySetInnerHTML`; syntax highlighting runs client-side via `hljs.highlightAll()` in a `useEffect`.
- URLs are derived from titles via `PostUtil.normalizeTitle` (spaces → `-`, lowercased). Anything that links to a post (sitemap, internal links, `getStaticPaths`) must go through this helper — do not hand-build paths.
- `bin/generate-sitemap.ts` runs **after** the build and walks the emitted `./docs/*.html` tree. For each file whose normalized name matches a post title it emits `<lastmod>` from `publishedAt`; everything else gets today's date. Files matching `EXCLUDE_FILE_PATTERNS` (Google/Naver site verification HTML) are skipped.

### Other route conventions

- `pages/categories/[category]/...` and `pages/tags/index.tsx` use the same `postsDatabase` helpers.
- `pages/posts/[page].tsx` is paginated by `blogConfig.pageLimit` (10).
- `pages/_app.tsx` and `pages/_document.tsx` wire global styles, analytics scripts (`gtag-script`, `naver-analytics-script`), service worker, and `<CommonMeta>`.

### Configuration surface

- `config/blog.config.ts` — site identity, ad/analytics IDs (env-driven via `NEXT_PUBLIC_*`), pagination limits.
- `config/posts.config.ts` — the `Post` schema and the post list. `CATEGORIES` keys must match the directory names under `posts/`.
- `config/banner.config.ts`, `menu.config.ts`, `social.config.tsx`, `meta-contents.ts` — declarative content for navigation, banners, SEO copy.
- `.env.development` / `.env.production` — `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_NAVER_ANALYTICS_ID`. The base URL is used by `PathUtil.absolutePath` for canonical URLs in meta tags.

### Assets

Post thumbnails and inline markdown images are served from `public/assets/images/` and referenced by `thumbnailName` (just the filename — `PathUtil.buildImagePath` prefixes the directory).
