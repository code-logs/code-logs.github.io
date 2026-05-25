# Documentation Index

Read this when: you need to find project knowledge documents written by AI agents.

## Task-Oriented Routes

| I need to know... | Go to |
|---|---|
| Why the build pipeline is shaped the way it is, and what NOT to change | [build-pipeline-gotchas.md](build-pipeline-gotchas.md) |
| Why a lucide icon won't size via `font-size`, or where a brand icon went | [icon-library-gotchas.md](icon-library-gotchas.md) |
| How to safely depend on dates, randomness, or other host-runtime values inside a page under `output: 'export'`, or how to handle the copyright-year / build-time value in a global `_app`-rendered component that has no `getStaticProps` | [static-export-rendering-gotchas.md](static-export-rendering-gotchas.md) |
| How Tailwind v4 is set up here, and what classes/tokens MUST NOT be changed | [styling-gotchas.md](styling-gotchas.md) |
| How the page skeleton/containers/slim header/static footer work, which `.container-*` a page uses, why the app-global aside is gone, or why the layout breakpoint is 767/1024 | [layout-system-gotchas.md](layout-system-gotchas.md) |
| Where the search-palette/mobile-sheet open state lives, how Cmd+K is wired, how focus-trap/scroll-lock/focus-restore are hand-rolled, why the search mark uses `text-link`, or how the `.nav-link` active indicator aligns | [header-interaction-gotchas.md](header-interaction-gotchas.md) |
| Why spacing/radius tokens are px not rem, why they are named `--spacing-*` (not `--space-*`), or why an untouched `rounded-md` element changed radius | [styling-gotchas.md](styling-gotchas.md) |
| Why an untouched `ease-in-out`/`shadow-md` utility changed after the motion-token work, why `.clickable`'s `@layer base` transition has no effect, or why the code-block shadow depends on `--shadow-sm` | [styling-gotchas.md](styling-gotchas.md) |
| Which color token to use where, why `accent-700` (not `accent-600`) is the light-mode link, which token a selected/active solid-accent control (pagination current page) uses, or how dark-mode pairing works | [color-tokens-gotchas.md](color-tokens-gotchas.md) |
| How to put a focus ring on a composite/wrapped input without doubling it, or why `ring-color-focus-ring` is not a valid utility | [styling-gotchas.md](styling-gotchas.md) |
| Why a list page's static HTML is empty / contains no list items, or how to keep `getStaticProps` content in the exported HTML while still filtering client-side | [static-export-rendering-gotchas.md](static-export-rendering-gotchas.md) |
| How the `next-themes` 3-mode toggle works, why dark mode is `.dark` class (not `@media`), how to avoid FOUC/hydration mismatch, or why a static `theme-color` meta breaks the dark variant | [dark-mode-toggle-gotchas.md](dark-mode-toggle-gotchas.md) |
| How the self-hosted fonts load, why `--text-*`/`--leading-*` tokens override Tailwind built-ins, why fonts inject from `_app.tsx` not `_document.tsx`, or why post-body headings differ from base `h1~h4` | [typography-system-gotchas.md](typography-system-gotchas.md) |
| Why AdSense throws a fatal error at narrow viewports, and why `useIsMobile` threshold is 1100 px | [ads-adsense-rendering-gotchas.md](ads-adsense-rendering-gotchas.md) |
| Where the sitemap base URL comes from, why `ts-node` does not auto-load `.env.*`, how `<loc>` in `sitemap.xml` is encoded, why post and non-post URLs differ, why sitemap output is sorted, why an empty `./docs` must fail fast, or why sitemap throws on duplicate normalized post slugs | [sitemap-generation-gotchas.md](sitemap-generation-gotchas.md) |
| Which characters `PostUtil.normalizeTitle` strips and why, or why a `?`/`#` in a post title 404s | [post-slug-normalization-gotchas.md](post-slug-normalization-gotchas.md) |
| How post reading time is calculated, why the Hangul regex ends at `힣` not `힝`, why `PostServerUtil` must not be imported in components, or what `utils/PostServerUtil.ts` is for | [post-reading-time-gotchas.md](post-reading-time-gotchas.md) |
| Why `pages/index.tsx` is single-column without any `_app.tsx` change, how the `/categories` index and `/categories/[category]/[page]` routes divide responsibility, why an active list-row highlight makes an inner `bg-bg-subtle` chip vanish, how `PageHeader` breadcrumbs work, or why `META_CONTENTS.CATEGORIES` was renamed to `CATEGORY_DETAIL` | [layout-system-gotchas.md](layout-system-gotchas.md) |
| How the post detail page TOC-hybrid layout / sticky TOC aside / mobile `<details>` work, why code-block syntax colors must come from `--syntax-*` tokens, why `--tw-prose-pre-code` can't be `#fff`, why there's no marked heading-renderer override, how heading-anchor copy preserves heading semantics, or how Utterances follows the dark toggle | [post-detail-page-gotchas.md](post-detail-page-gotchas.md) |
| How the `/tags` and `/categories` alphabet index share `AlphabetNav`, why Korean tags bucket via `getKoreanGroup` (and why char-code comparison mis-files `파`), why the `/tags` count splits unique vs. total, how the full-bleed sticky nav tracks container padding, or why `CategoriesGrid` letter anchors are gated by `enableLetterAnchors` | [tags-categories-index-gotchas.md](tags-categories-index-gotchas.md) |
| Why a category link 404s with `%20`, which of `CATEGORIES` key/value is the URL slug vs. the display label, or how to iterate `CATEGORIES` when building category hrefs | [category-key-label-slug-gotchas.md](category-key-label-slug-gotchas.md) |
