# Sitemap Generation Gotchas

Read this when: modifying `bin/generate-sitemap.ts`, changing how post URLs are built (`utils/PostUtil.ts`), or debugging crawler / Search Console errors about malformed `<loc>` values.

## Overview

`bin/generate-sitemap.ts` runs after `next build` and walks `./docs/*.html` to emit `docs/sitemap.xml`. Two encoding layers must be applied to every `<loc>`: RFC 3986 percent-encoding (sitemap 0.9 requirement) and XML entity escaping. The post branch and the non-post branch encode differently — mixing them up causes double-encoding or raw-character regressions.

## Pitfalls

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

### `encodeURI` is NOT a substitute for `encodeURIComponent` on path segments

- **Symptom**: a slug containing `+`, `&`, `?`, or `#` (e.g. `/categories/c++/1`) ships into `<loc>` with the raw reserved char. Some crawlers interpret `+` in path position as a space, and `&`/`?` will break URL parsing entirely.
- **Why**: `encodeURI` only encodes characters that are illegal anywhere in a URI. It preserves all reserved chars (`+`, `&`, `?`, `#`, `:`, etc.) because they are legal in *some* URI position — even when they appear inside a path segment where they shouldn't.
- **Rule**: ALWAYS use per-segment `encodeURIComponent(decodeURIComponent(segment))` for non-post paths. NEVER apply `encodeURI` to a whole path: it under-encodes reserved chars in segments while doing nothing for already-encoded segments. The decode-then-encode pair handles both directions: `encodeURIComponent('개발환경')` produces the correct percent-encoding, and `decodeURIComponent('%EA%B0%9C…')` then `encodeURIComponent(...)` round-trips to the same encoding without double-escaping.

## Conventions

- Sitemap generation MUST run **after** the Next.js static export — `./docs/` must already exist. The `pnpm run sitemap` script will fail if `./docs/` is empty (see [build-pipeline-gotchas.md](build-pipeline-gotchas.md)).
- The XML envelope (`<?xml version="1.0" encoding="UTF-8"?><urlset ...>`) MUST stay sitemap 0.9 namespace — Search Console and Naver both rely on this exact namespace string.
- `EXCLUDE_FILE_PATTERNS` MUST continue to skip Google / Naver site-verification HTML files; they are not crawlable site content.
- `<lastmod>` for post URLs MUST use the post's `publishedAt` (not today). Non-post URLs use today's date because they have no first-class authored timestamp.

## Rationale

The encoding split exists because the post pipeline owns its own URL shape (`/{normalized-title}`) via `PostUtil`, while the non-post URLs are derived from the on-disk path layout the Next exporter produces. Centralizing both behind a single encoder would require teaching `PostUtil` about route families it doesn't own — pushing knowledge in the wrong direction. Keeping the two branches separate but reusing `buildLinkURLByTitle` for the post case is the minimal coupling that still guarantees sitemap-internal-link parity.
