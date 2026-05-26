# Posts List Page Gotchas

Read this when: editing `pages/posts/[page].tsx` (the `/posts/[page]` search/list route), the shared `components/paginator/Paginator.tsx`, or `components/search-input/SearchInput.tsx`; or wiring search/pagination/empty states on any list page.

## Overview

`/posts/[page]` is the only list route with a client-side search form. This doc covers the search-form accessibility requirement, the shared `Paginator` self-gating invariant, and why the zero-posts empty state is unreachable here. Layout/aside structure lives in [layout-system-gotchas.md](layout-system-gotchas.md); in-list ad placement in [ads-placement-list-pages-gotchas.md](ads-placement-list-pages-gotchas.md). The `/licenses` page has its own inline filter (not the shared `SearchInput`) with a different result-feedback model — see [licenses-page-gotchas.md](licenses-page-gotchas.md).

## Pitfalls

### The `/posts` search input has no visible `<label>` — it MUST carry `aria-label`

- **Symptom:** The `role="search"` form exposes no accessible name; a screen reader announces the input only by its placeholder, which is not a reliable programmatic label (placeholder is not a label substitute).
- **Why:** `SearchInput` renders a bare `<input type="search">` with only `placeholder`. The visible `<label>` was never added because the search icon stands in visually.
- **Rule:** The caller MUST pass `aria-label="Search posts"` to `SearchInput` (it spreads `...rest` onto the native input). This is page-specific — `/posts` is the only route with a search form, so the asymmetry vs `/categories/[category]/[page]` (no search) is intentional, not a missing parallel change.

### `Paginator` self-gates on `lastPage <= 1` — do NOT also guard at the call site

- **Symptom:** A lone "1" flanked by two disabled arrows (or, for `lastPage === 0`, an empty nav with just arrows) renders for single-result pages — most visibly on single-page search results and single-page category detail pages.
- **Why:** `Paginator` is shared by `/posts/[page]` and `/categories/[category]/[page]`. It now returns `null` when `lastPage <= 1`. The bound is `<= 1` (not `< 1`) on purpose: `/categories/[category]/[page]` renders `Paginator` unconditionally (no `posts.length` guard), so `<= 1` is what protects both the single-page (`=== 1`) and empty (`=== 0`) cases there.
- **Rule:** NEVER re-add a `lastPage > 1 &&` guard at a call site — the component owns this. The early return MUST stay AFTER the `useState`/`useEffect` hooks so hook call order remains unconditional (React rules-of-hooks); moving it above the hooks is a violation the inline comment warns against.

### Zero published posts is unreachable on `/posts` — do NOT add an empty-state UI

- **Symptom:** A plan calls for a "no posts" empty state on `/posts` mirroring the `/tags` zero-tags handling.
- **Why:** `getStaticPaths` computes `lastPage = Math.ceil(posts.length / pageLimit)` and emits `Array(lastPage).fill('')` paths. With zero posts, `lastPage === 0`, so no `/posts/N` page is generated at all — the route cannot be hit in the static export. (This differs from `/tags`, which is a single always-generated static page; see [tags-categories-index-gotchas.md](tags-categories-index-gotchas.md).)
- **Rule:** Only the search-miss empty state needs handling, and `NoFoundPosting` (gated on `query && !posts.length`) already owns it. Do NOT add a non-search empty state.

## Conventions

- The page-1 flash before a `?query=` search result swaps in client-side is an ACCEPTED trade-off (issue #154) — see the comment at `pages/posts/[page].tsx`. NEVER "fix" it by blocking the static page-1 render.
- Search-mode `noindex`: the `customMeta` robots tag is added only when `query` is truthy (set after hydration). Static export never generates query URLs and robots.txt blocks them, so this client-only signal is sufficient — do not promote it to a static meta.

## Rationale

The `Paginator` gating was applied in the shared component (not per-page) during issue #191 QA so `/posts` and `/categories/[category]/[page]` stay consistent; this also retroactively cleaned up the single-page category detail pages merged in #189.
