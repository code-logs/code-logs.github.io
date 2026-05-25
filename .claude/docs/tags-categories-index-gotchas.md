# Tags / Categories Alphabet Index Gotchas

Read this when: editing `pages/tags/index.tsx` or `pages/categories/index.tsx`, the shared `components/alphabet-nav/AlphabetNav.tsx`, the Hangul grouping helper `utils/HangulUtil.ts`, or `components/categories-grid/CategoriesGrid.tsx` letter anchors.

## Overview

The `/tags` and `/categories` index pages (issue #156) share one sticky alphabet navigator (`AlphabetNav`) and one bucketing helper (`getIndexLetter` in `HangulUtil`). Both pages bucket their labels into A–Z + 14 Korean groups, link the nav to per-section/per-card `#letter` anchors, and are statically exported. This doc covers the traps in that index layer.

## Pitfalls

### `/tags` header count must distinguish unique tags from total usage

- **Symptom:** The header count is far larger than the real number of distinct tags (e.g. shows 178 when there are 142 tags) — a tag used on 5 posts is counted 5 times.
- **Why:** `getStaticProps` returns a *flat* array of every tag occurrence (`posts.flatMap(p => p.tags)`), with duplicates kept because they drive per-tag usage counts. The legacy header rendered `tags.length` (total occurrences) as if it were the tag count.
- **Rule:** `uniqueTagCount = new Set(tags).size`, `totalUsage = tags.length`. The header subtitle is `{uniqueTagCount} tags · {totalUsage} uses`. NEVER use `tags.length` as the tag count.

### Hangul bucketing MUST use `getKoreanGroup`, never char-code range comparison

- **Symptom:** A Korean tag lands in the wrong group — classically `파`-initial words (e.g. "프록시", "파이썬") fall under `하` instead of `파`; tense consonants (ㄲ/ㄸ/ㅃ/ㅆ/ㅉ) misfile too.
- **Why:** The old code compared raw `charCodeAt(0)` against group-boundary char codes. Hangul syllables are composed (initial × medial × final), so a linear code comparison does not map to initial consonants.
- **Rule:** Use `getKoreanGroup(char)` from `HangulUtil`, which derives the initial-jamo index from the Unicode syllable block (`(code - 0xAC00) / (21 * 28)`) and maps 19 jamo → 14 groups (tense consonants fold into their plain counterpart; ㅊ→차, ㅋ→카, ㅌ→타, ㅍ→파). Non-Hangul/empty input returns `null`.

### `getIndexLetter` is the single bucketing source — both pages MUST call it

- **Symptom:** `/tags` and `/categories` disagree on which letter a label belongs to, or the nav highlights a letter that has no section/card.
- **Why:** Each page independently deciding "first char → bucket" drifts (English uppercasing, Hangul grouping, fallback all have to match the nav rows).
- **Rule:** Bucket every label through `getIndexLetter(label)` (returns an A–Z uppercase letter, a Korean group, or `OTHER_GROUP`). `AlphabetNav` renders exactly `ENGLISH_LETTERS` + `KOREAN_GROUPS` from the same module, so buckets and nav rows cannot diverge.

### `OTHER_GROUP` (`#`) has no fixed nav row — handle it conditionally

- **Symptom:** A tag/category starting with a digit or symbol produces a `<section id="#">` (or a card anchor) that the nav cannot reach; the "View all below ↓" anchor could target `#`.
- **Why:** `AlphabetNav`'s two fixed rows are A–Z and the 14 Korean groups. `getIndexLetter` returns `OTHER_GROUP` for anything else, so a bucket can exist with no matching nav entry.
- **Rule:** `AlphabetNav` appends `OTHER_GROUP` to the Korean row ONLY when `activeLetters.has(OTHER_GROUP)`, keeping the common case clean while never orphaning a `#` section. This is latent today (no current tag/category starts with a non-letter), but the guard must stay.

### `AlphabetNav` is full-bleed sticky — its padding MUST track `.container-*` padding

- **Symptom:** The sticky nav's background/border does not span the content width, or it misaligns at the desktop breakpoint.
- **Why:** The nav lives inside `.container-content` (which has horizontal padding), but its blurred background should bleed to the container edges. It uses negative margins + re-applied padding: `-mx-[var(--spacing-page-x)] px-[var(--spacing-page-x)]` and `lg:-mx-[var(--spacing-page-x-desktop)] lg:px-[var(--spacing-page-x-desktop)]`.
- **Rule:** The padding switch happens at `lg:` (1024px) because that is where `.container-content` swaps `--spacing-page-x` → `--spacing-page-x-desktop` (see `styling-gotchas.md` / `layout-system-gotchas.md`). There is NO `desktop:` breakpoint — only `tablet:` (800px) and the built-in `lg:` (1024px) exist. Do not invent `desktop:`.

### Section/card anchors need `scroll-margin-top` to clear the sticky nav

- **Symptom:** Clicking a letter scrolls the target heading under the sticky header + nav, hiding it.
- **Why:** Sticky header (`--header-height`) plus the sticky `AlphabetNav` occupy the top; a bare `#letter` jump lands behind them.
- **Rule:** Anchor targets set `scrollMarginTop: calc(var(--header-height) + var(--spacing-12))` — on `/tags` the `<section id={letter}>`, on `/categories` the first card `<li id={letter}>`.

### `CategoriesGrid` letter anchors are gated — keep the home grid anchor-free

- **Symptom:** The home page top-8 categories grid sprouts duplicate/unexpected `id` anchors.
- **Why:** `CategoriesGrid` is reused by both the home page and `/categories`. Letter anchors only belong on the full index.
- **Rule:** Pass `enableLetterAnchors` ONLY from `/categories`. When on, the first card of each letter group (in the caller's sort order) gets `id={letter}` + `scroll-margin-top`; the home page omits the prop.

## Conventions

- **Key↔label sort invariant (`/categories`):** `getStaticProps` sorts cards by the category *key* (`a.category.localeCompare(b.category)`, the #155 decision), but `activeLetters` and card anchors derive from the display *label* via `getIndexLetter(label)`. This is correct ONLY while each `CATEGORIES` key and its label share a first letter (true for the current map). If a future label's first letter diverges from its key, switch the sort to the label, or anchors will land on a non-first card. A comment at the sort site records this. For the key-as-slug vs. value-as-label distinction when building category *hrefs*, see [category-key-label-slug-gotchas.md](category-key-label-slug-gotchas.md).
- **`Tags` chip spacing:** `components/tags/Tags.tsx` uses `flex flex-wrap gap-2` (8px). NEVER reintroduce arbitrary `[&>li]:mr-[5px]`-style margins — `Tags` is reused in post cards, footers, and the home page, so spacing changes there are site-wide.
- **`TitleWithCount` is retained for `RecentPosts` only.** It was removed from `/tags` (folded into `PageHeader`) but is NOT dead code.
- Meta copy for both pages is English (`META_CONTENTS.TAGS` / `CATEGORIES_INDEX`).

## Rationale

`TagNavigator` and `TagList` were deleted: their only consumer was `/tags`, and `AlphabetNav` (page-agnostic, driven by an `activeLetters: Set<string>` prop) replaces both. Generalizing the navigator was the point of issue #156 — `/tags` and `/categories` now speak one UI language. See `layout-system-gotchas.md` for the `PageHeader` / `.container-*` patterns these pages build on, and `static-export-rendering-gotchas.md` for why the buckets must be computed at build time (no runtime fetch).
