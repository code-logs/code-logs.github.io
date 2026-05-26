# Ads Placement on List Pages Gotchas

Read this when: adding or moving a `MainAdsBanner` on a list page (`/posts/[page]`, `/categories/[category]/[page]`, or any page rendering `PostCardList`), or wondering why two ad units render close together near the end of a post list.

## Overview

`PostCardList` owns in-list ad injection. Pages that render it MUST NOT add their own standalone `MainAdsBanner` adjacent to the list — doing so stacks two ad units and diverges from sibling list pages. This documents that single ownership boundary.

## Pitfalls

### `PostCardList` already injects `MainAdsBanner` — do not add a standalone one next to the list

- **Symptom:** Two `MainAdsBanner` units render within one post card of each other near the end of the list (ad-stacking), and the page shows more ads than its sibling list page.
- **Root cause:** `PostCardList` injects a `MainAdsBanner` after every `adsBlockCycle` cards (default `3`) — i.e. after cards 3, 6, 9 on a 10-item page. A page that also places a standalone `<MainAdsBanner />` right after `<PostCardList>` puts that banner one card after the card-9 inline ad.
- **Rule:** A page rendering `PostCardList` MUST rely on its inline injection alone. NEVER place a standalone `MainAdsBanner` immediately before/after the list. If the import becomes unused after removing one, delete it too (ESLint `no-unused-vars`).
- **Reference:** `/posts/[page].tsx` is the canonical list page — it uses only `PostCardList`'s inline ads with no standalone banner. `/categories/[category]/[page].tsx` was aligned to this in issue #189.

## Conventions

- Suppress inline injection by passing `adsBlockCycle={0}` to `PostCardList` (used when a page wants no in-list ads at all). The standalone-only `MainAdsBanner` pattern is correct **only** on pages that do NOT render `PostCardList` — e.g. `/categories/index.tsx`, which has no list and therefore adds one trailing banner of its own.

## Related

- [ads-adsense-rendering-gotchas.md](ads-adsense-rendering-gotchas.md) — sibling concern: why an AdSense slot throws at narrow widths and how the aside render gate / `MIN_SLOT_WIDTH` guard prevent it. That doc covers *whether an ad can render*; this doc covers *where ads are placed*.
