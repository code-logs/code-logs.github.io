# Sitemap Generation Gotchas

Read this when: modifying `bin/generate-sitemap.ts`, changing how post URLs are built (`utils/PostUtil.ts`), changing where the site base URL comes from (`config/blog.config.ts` / `NEXT_PUBLIC_BASE_URL`), or debugging crawler / Search Console errors about malformed `<loc>` values or wrong-domain sitemaps.

## Overview

`bin/generate-sitemap.ts` runs after `next build` and walks `./docs/*.html` to emit `docs/sitemap.xml`. The base URL prefix MUST come from the same source as site canonical URLs (`blogConfig.baseURL` → `NEXT_PUBLIC_BASE_URL`); sitemap is a separate `ts-node` process and does NOT inherit Next's env loading, so the script loads `.env` files via `dotenv` itself. Two encoding layers then apply to every `<loc>`: RFC 3986 percent-encoding (sitemap 0.9 requirement) and XML entity escaping. The post branch and the non-post branch encode differently — mixing them up causes double-encoding or raw-character regressions.

## Pitfalls

### Sitemap base URL MUST come from `blogConfig` / env — never hardcode

- **Symptom**: domain changes (custom domain swap, staging→prod cutover) update the site's canonical `<link rel="canonical">` and OG URLs via `NEXT_PUBLIC_BASE_URL`, but `sitemap.xml`'s `<loc>` prefix still points to the old domain. Search Console rejects the sitemap for cross-domain mismatch and previously indexed URLs drop off.
- **Why**: pages render canonical URLs through `blogConfig.baseURL` (which resolves `process.env.NEXT_PUBLIC_BASE_URL`). If sitemap hardcodes a string literal for the same URL, drift is silent until production indexing breaks — there is no compile-time link between the two sources.
- **Rule**: ALWAYS read the sitemap base URL through `blogConfig.baseURL`. NEVER define a raw domain string literal in `bin/generate-sitemap.ts`. If a future sitemap variant needs a different base URL (e.g. a CDN host), add a field to `blogConfig` and read it from there — do NOT inline.

### `ts-node` does NOT auto-load `.env.*` — sitemap must load it explicitly

- **Symptom**: `pnpm run docs` succeeds but the generated `sitemap.xml` contains `http://localhost:3000` as the `<loc>` prefix in production. Or `pnpm run sitemap` produces a sitemap whose URLs do not match the deployed site.
- **Why**: `next build` loads `.env.production` internally, but `pnpm run sitemap` invokes `ts-node bin/generate-sitemap.ts` as a separate Node process that does NOT pass through Next's env loader. Without explicit env loading, `blogConfig.baseURL` evaluates to its localhost fallback (`'http://localhost:3000'`), and Search Console will reject the sitemap.
- **Rule**: The sitemap script MUST call `dotenv` to load `.env.production` (then `.env` as fallback) BEFORE `blogConfig` is imported — `blogConfig` reads `process.env` at module-eval time, so dotenv calls must execute first. Place the `loadEnv()` calls between the `dotenv` import and the `blogConfig` import; this looks unusual versus standard import grouping but is load-order-critical. ALWAYS validate against the raw `process.env.NEXT_PUBLIC_BASE_URL` (with `.trim()`) — NEVER validate against the resolved `blogConfig.baseURL`, because its localhost fallback would silently pass the guard. Throw and `process.exit(1)` when the raw env is missing or whitespace-only, so CI fails before shipping a broken sitemap.

### Post URLs and non-post URLs need DIFFERENT encoding paths

- **Symptom**: either raw `+` / `|` / non-ASCII characters appear in `<loc>` (under-encoded), or `%` characters get re-encoded to `%25` (double-encoded — happens when a value that already contains percent-escapes is fed through `encodeURI`/`encodeURIComponent` again).
- **Why**: `PostUtil.buildLinkURLByTitle(title)` already applies `encodeURIComponent` to the normalized title and returns `/encoded-title`. Non-post HTML paths (e.g. `/categories/foo/1`) come from the filesystem walk; macOS/Linux return raw UTF-8 directory names so the segments are usually unencoded, but Next.js export behavior for percent-encoded route params is not guaranteed across versions.
- **Rule**: Post branch MUST pass `PostUtil.buildLinkURLByTitle(post.title)` straight through (no further encoding). Non-post branch MUST normalize each path segment via `encodeURIComponent(decodeURIComponent(segment))` and rejoin with `/`. This pattern is idempotent: already-encoded segments survive unchanged, raw UTF-8 segments get encoded exactly once. NEVER apply `encodeURI` to a non-post path — `encodeURI` does NOT touch existing `%xx` sequences nor reserved chars like `+`, so it gives the wrong answer in both directions (under-encodes `+`, would double-encode if Next ever ships percent-encoded export paths). NEVER apply `encodeURIComponent` (or the decode/encode pair) to a value that already came from `buildLinkURLByTitle`.

### Sitemap `<loc>` must match site-internal link encoding

- **Symptom**: a URL works when clicked from a `<PostCard>` but Search Console reports the sitemap version as "Not found" — the two encoded forms differ.
- **Why**: components render hrefs through `PostUtil.buildLinkURLByTitle`; sitemap historically built URLs ad-hoc, producing a different byte sequence for the same post.
- **Rule**: ALWAYS derive sitemap post URLs from `PostUtil.buildLinkURLByTitle`. If you need a new sitemap URL shape (e.g. for a new route family), add it to `PostUtil` first and reuse the helper, do NOT inline a parallel encoder in `bin/generate-sitemap.ts`.

### XML escape must process `&` FIRST

- **Symptom**: `&amp;` in output becomes `&amp;amp;` (double-escape) — visible in `docs/sitemap.xml`.
- **Why**: a naive `replace` order like `< → &lt;` then `& → &amp;` re-escapes the `&` introduced by earlier rules.
- **Rule**: ALWAYS replace `&` first, then `<`, `>`, `"`, `'`. The helper `xmlEscape` in `bin/generate-sitemap.ts` enforces this order — do NOT reorder its `replace` chain.

### Post matching MUST key on basename, not on the on-disk relative path

- **Symptom**: a post HTML emitted under a subdirectory (e.g. `docs/posts/some-title.html` instead of `docs/some-title.html`) gets `<lastmod>` set to today instead of its `publishedAt`. Search Console then re-crawls the post on every deploy.
- **Why**: the match key between the filesystem walk and `posts.config.ts` is the normalized post title (`PostUtil.normalizeTitle`). If the lookup key is derived from the full relative path (e.g. `posts/some-title`), it can never equal the normalized title (`some-title`) and the file falls through to the non-post branch.
- **Rule**: ALWAYS derive the post-match key with `path.basename(htmlFullPath, '.html')` so the match is independent of which directory the static export drops the HTML into. The post URL itself still comes from `PostUtil.buildLinkURLByTitle(post.title)` — the on-disk directory is never used to build `<loc>`, only to enumerate which HTML files exist. The basename match relies on `normalizeTitle` producing a filename-safe slug; see [post-slug-normalization-gotchas.md](post-slug-normalization-gotchas.md) for which characters are stripped and why.

### Two published posts MUST NOT share the same normalized post slug

- **Symptom**: `pnpm run sitemap` throws a "Duplicate normalized post title" error (the runtime message uses the code-level term `normalized post title` for `PostUtil.normalizeTitle(title)` output) and exits non-zero, blocking the deploy.
- **Why**: `posts.config.ts` has no compile-time validation that `PostUtil.normalizeTitle(title)` produces a unique normalized post slug across published posts. If two published entries normalize to the same slug, the static export emits only one `/{slug}.html` (the later one overwrites the earlier on disk), and any sitemap lookup keyed by the slug becomes ambiguous. Before this guard existed, the second post silently won the lookup while the first post became unreachable from the sitemap. Unpublished drafts are NOT a problem — `postsDatabase` (and therefore `pages/[title].tsx` `getStaticPaths`) filters by `post.published`, so an unpublished entry never produces an HTML file and cannot collide on disk.
- **Rule**: `bin/generate-sitemap.ts` MUST build `normalizedPostMap` over `posts.filter((post) => post.published)`, mirroring the export scope used by `postsDatabase`. The map construction MUST include an explicit `if (map.has(key)) throw` check — NEVER use `new Map(posts.map(...))` because that silently overwrites duplicates, and NEVER iterate the raw `posts` array because that would let an unpublished draft block deploys for a collision that does not exist on disk. When this guard fires, fix the colliding published post titles in `posts.config.ts` before retrying; do NOT relax the guard. The normalization rules that determine which titles collapse to the same slug are documented in [post-slug-normalization-gotchas.md](post-slug-normalization-gotchas.md).

### Strip `index.html` BEFORE `.html` in the non-post branch

- **Symptom**: a category listing emitted as `docs/categories/foo/index.html` shows up in `sitemap.xml` as `/categories/foo/index` (no trailing slash, with the literal segment `index`) instead of `/categories/foo/`.
- **Why**: the non-post path is normalized by chaining `.replace(/index\.html$/, '').replace(/\.html$/, '')`. If the order is swapped, `.html` strips first and leaves `/categories/foo/index`, which no longer matches `/index\.html$/`.
- **Rule**: ALWAYS run the `index.html` strip before the generic `.html` strip. The two `replace` calls are order-dependent — do NOT reorder or merge them into one regex.

### `encodeURI` is NOT a substitute for `encodeURIComponent` on path segments

- **Symptom**: a slug containing `+`, `&`, `?`, or `#` (e.g. `/categories/c++/1`) ships into `<loc>` with the raw reserved char. Some crawlers interpret `+` in path position as a space, and `&`/`?` will break URL parsing entirely.
- **Why**: `encodeURI` only encodes characters that are illegal anywhere in a URI. It preserves all reserved chars (`+`, `&`, `?`, `#`, `:`, etc.) because they are legal in *some* URI position — even when they appear inside a path segment where they shouldn't.
- **Rule**: ALWAYS use per-segment `encodeURIComponent(decodeURIComponent(segment))` for non-post paths. NEVER apply `encodeURI` to a whole path: it under-encodes reserved chars in segments while doing nothing for already-encoded segments. The decode-then-encode pair handles both directions: `encodeURIComponent('개발환경')` produces the correct percent-encoding, and `decodeURIComponent('%EA%B0%9C…')` then `encodeURIComponent(...)` round-trips to the same encoding without double-escaping.

### Sitemap output MUST be deterministic across builds

- **Symptom**: two consecutive `pnpm run docs` runs against the same source produce sitemaps that differ in `<url>` ordering. CI deploy diffs become noisy and Search Console may treat the sitemap as "changed" on every push.
- **Why**: `fs.readdirSync` returns entries in filesystem/OS-dependent order. Mapping that list straight to XML fragments preserves whatever order the FS chose, which is not stable across machines (macOS dev vs. Ubuntu CI) or even across builds on the same machine.
- **Rule**: ALWAYS build `urlEntries` as `{ loc, lastmod }` objects, sort with `(a, b) => a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0`, THEN map to XML fragments via `buildUrlSet`. NEVER call `localeCompare` without an explicit locale — it would re-introduce system-locale-dependent ordering. The byte comparator is case-sensitive (ASCII byte ordering): post URLs are lowercase via `normalizeTitle` so they sort cleanly, but non-post HTML segments preserve filesystem case. If a future build emits mixed-case segments that need to interleave with their lowercase counterparts in `<loc>` order, lowercase the comparison key — do NOT change the sort to a locale-aware variant.

### Empty `./docs` MUST fail fast

- **Symptom**: `pnpm run sitemap` produces a `sitemap.xml` containing an empty `<urlset>` and exits 0. The deploy ships an empty sitemap to GitHub Pages; Search Console drops every previously indexed URL.
- **Why**: `readDirectoryFiles(DOCUMENT_PATH, 'html')` returns `[]` when `./docs` exists but has no HTML files (e.g. `pnpm run sitemap` invoked without a preceding build, or `./docs` cleaned but not repopulated). Without an explicit guard, the empty list flows through `.map`, `.sort`, and `.join('')` to produce a syntactically valid but semantically destructive sitemap.
- **Rule**: ALWAYS guard `htmlFullPathList.length === 0` with `throw new Error(...)` immediately after `readDirectoryFiles`. The throw MUST happen BEFORE the dynamic `import('../config/posts.config.ts')` so the failure is fast and config loading is skipped. The call site `sitemapGenerator()` MUST attach `.catch((err) => { console.error(err); process.exit(1) })` so the rejected promise surfaces a non-zero exit code instead of being silently swallowed by Node's default unhandled-rejection handler.

## Conventions

- Sitemap generation MUST run **after** the Next.js static export — `./docs/` must already exist and contain HTML files. The fail-fast behavior is enforced and described in the "Empty `./docs` MUST fail fast" pitfall above.
- Sitemap base URL MUST come from `blogConfig.baseURL`; environment loading MUST happen via `dotenv` before `blogConfig` is imported. See the "Sitemap base URL MUST come from `blogConfig` / env" and "`ts-node` does NOT auto-load `.env.*`" pitfalls above.
- The XML envelope (`<?xml version="1.0" encoding="UTF-8"?><urlset ...>`) MUST stay sitemap 0.9 namespace — Search Console and Naver both rely on this exact namespace string.
- `EXCLUDE_FILE_PATTERNS` MUST continue to skip Google / Naver site-verification HTML files; they are not crawlable site content.
- `<lastmod>` for post URLs MUST use the post's `publishedAt` (not today). Non-post URLs use today's date because they have no first-class authored timestamp.

## Rationale

The encoding split exists because the post pipeline owns its own URL shape (`/{normalized-title}`) via `PostUtil`, while the non-post URLs are derived from the on-disk path layout the Next exporter produces. Centralizing both behind a single encoder would require teaching `PostUtil` about route families it doesn't own — pushing knowledge in the wrong direction. Keeping the two branches separate but reusing `buildLinkURLByTitle` for the post case is the minimal coupling that still guarantees sitemap-internal-link parity.
