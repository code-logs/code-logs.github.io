# Category Key / Label / Slug Gotchas

Read this when: building any link to a category page (`/categories/{slug}/{page}`), rendering a category name, iterating `CATEGORIES`, or adding a category to `config/posts.config.ts`.

## Overview

`CATEGORIES` in `config/posts.config.ts` is a **key → label** map. The key is the URL slug; the value is the human-readable label. A post's `category` field stores the **key**, not the label. Mixing these up produces broken links or inconsistent display text. This doc covers that single distinction.

## Pitfalls

### NEVER build a category href from `Object.values(CATEGORIES)`

- **Symptom:** A category link like `/categories/react%20native/1` 404s, while the generated page is at `/categories/react-native/1`.
- **Why:** The values are display labels with spaces (`'react native'`, `'roadmap frontend'`, `'ui and ux'`). The URL slug is the **key** (`'react-native'`, `'roadmap-frontend'`, `'ui-and-ux'`). `encodeURIComponent` turns a label's space into `%20`, which matches no statically-exported path.
- **Rule:** ALWAYS derive a category href from the **key**: `/categories/${encodeURIComponent(key)}/1`. Iterate with `Object.keys(CATEGORIES)` or `Object.entries(CATEGORIES)`, never `Object.values` for hrefs.

### Showing the raw key as display text is inconsistent with the rest of the site

- **Symptom:** A chip/label reads `react-native` while post cards and the categories grid elsewhere read `react native`.
- **Why:** Every other category-display surface resolves the label via `CATEGORIES[key]` (`PostCardGrid` uses `categoryLabel`, `CategoriesGrid` uses the value). Showing the key diverges visibly.
- **Rule:** Visible category text MUST use the value (`CATEGORIES[key]`); the href MUST use the key. With `Object.entries`, destructure `[key, label]` and use each for its own role.

## Conventions

- `post.category` MUST be set to a CATEGORIES **key** (e.g. `category: 'react-native'`). `pages/categories/[category]/[page].tsx` `getStaticPaths` generates paths via `encodeURIComponent(post.category)`, so the key *is* the slug.
- `getStaticProps` in that route does `decodeURI(context.params.category)` and matches against `post.category` (the key) — so the round trip only works when posts store keys.
- Single-word categories (`cloud`, `react`) and the Korean `개발환경` have identical key and label, which hides this bug — always test against a multi-word category (`react-native`, `web-component`).

## Rationale

Introduced while redesigning the About page (issue #157): the "Topics covered" chips first used `Object.values` for the href and shipped `%20` links before the slug/label split was made explicit. See [tags-categories-index-gotchas.md](tags-categories-index-gotchas.md) for how the index pages bucket category **labels** into alphabet groups, and [post-slug-normalization-gotchas.md](post-slug-normalization-gotchas.md) for the separate post-title slug rules.
