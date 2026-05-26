# Licenses Page Gotchas

Read this when: editing `pages/licenses/index.tsx` — the client-side package filter, its result-count feedback, or the empty/zero-match state.

## Overview

`/licenses` lists a small, static set of build-time packages from `public/licenses.json` with an inline name filter. This doc covers the two filter invariants that are easy to regress: the always-mounted live region and the single trimmed-filter value. Layout/token conventions live in [layout-system-gotchas.md](layout-system-gotchas.md), [styling-gotchas.md](styling-gotchas.md), and [color-tokens-gotchas.md](color-tokens-gotchas.md); the parallel `/posts` search form (which uses the shared `SearchInput`) is in [post-list-page-gotchas.md](post-list-page-gotchas.md).

## Pitfalls

### The filter result-count live region MUST stay mounted unconditionally

- **Symptom:** A screen reader announces "No packages match …" on zero results but stays silent on partial matches, or the first keystroke's count is never announced.
- **Why:** Mounting the `<p role="status" aria-live="polite">` only while filtering (or swapping it in/out of a ternary against the list) means the node does not exist at the moment its text first changes, so the assistive-tech announcement for that transition is dropped.
- **Rule:** Render ONE `aria-live="polite"` region that is ALWAYS in the DOM; change only its text content. When there is no filter it carries an empty string and `sr-only` (silent, zero layout — the `PageHeader` subtitle owns the unfiltered total). Partial match → `Showing N of M packages`. Zero match → `No packages match "…"`. The list renders separately under a `filteredItems.length > 0` guard, never inside the same ternary as the status.

### Guard and predicate MUST share one trimmed filter value

- **Symptom:** Typing a leading/trailing space (e.g. ` re`) reports `No packages match " re"` even though `react` exists.
- **Why:** Deriving `hasFilter` from `filter.trim()` while the `items.filter(...)` predicate still calls the raw `filter.toLowerCase()` makes the guard active but the substring match include the space — a spurious zero-match.
- **Rule:** Compute `const trimmedFilter = filter.trim()` once and use it for the guard, the `includes()` predicate, AND the zero-match message. Never reference the raw `filter` for matching.

## Conventions

- The filter input is NOT the shared `SearchInput` (its clear button hard-navigates to `/posts/1`); only `SearchInput`'s focus-ring wrapper pattern is borrowed — `focus-within:shadow-focus` on the wrapper + `focus-visible:shadow-none` on the inner `<input>` to avoid a doubled ring (see [styling-gotchas.md](styling-gotchas.md)).
- Filter state is component-local `useState` only — NO URL state (resets on reload by design, per #159).
- All colors MUST be semantic tokens (`text-text-muted`, `ring-border`, `bg-bg-page`); the repo icon link relies on the global `:focus-visible` ring, no per-link override.

## Rationale

The package set is static build-time data (a small number of rows with short license strings), so there is no pagination, loading, or runtime-fetch edge case, and license-chip overflow is not a real concern at this scale. The work that established these invariants is issue #193 (page QA).
