# Meta Tags Gotchas

Read this when: editing `components/common-meta/CommonMeta.tsx`, passing `imageURL`/`keywords` props to `CommonMeta` from any page, building a comma-joined `keywords` list across multiple posts, or changing SEO/social-card/viewport meta.

## Overview

`CommonMeta` is the single shared `<Head>` surface every route renders. It owns SEO, OpenGraph/Twitter card, and viewport meta. Because one component feeds all pages, mistakes here regress every page at once. This covers the ownership boundary between callers and the component, plus the meta-key traps.

## Pitfalls

### Pass a site-relative `imageURL`, never an absolute URL
- What goes wrong: passing an already-absolute URL (`https://...`) to `CommonMeta` produces a broken double-absolutized `og:image`/`twitter:image`.
- Why: `CommonMeta` absolutizes `imageURL` once internally via `PathUtil.absolutePath`. OG/Twitter crawlers require absolute URLs, but the component — not the caller — owns that conversion.
- What to do: callers MUST pass a site-relative path (`/icons/...` or `PathUtil.buildImagePath(...)` → `/assets/images/...`). Do not wrap it in `PathUtil.absolutePath` at the call site.

### `og:image`/`twitter:image` need absolute URLs; `canonical`/`og:url` do not get auto-absolutized
- What goes wrong: a relative `og:image` silently breaks SNS link previews even though the page looks fine.
- Why: only `imageURL` is absolutized inside `CommonMeta`. The `url` prop is passed through verbatim, so callers already build it absolute (`${blogConfig.baseURL}...`).
- What to do: keep building `url` as an absolute URL at the call site; keep `imageURL` relative and let the component absolutize it.

### Use the plural `keywords` meta key
- What goes wrong: `<meta name="keyword">` (singular) is ignored by crawlers.
- Why: the standard key is plural `keywords`.
- What to do: ALWAYS use `name="keywords"` with a matching `key="keywords"` for `next/head` dedup.

### Do not feed `description` into `keywords`
- What goes wrong: a full-sentence `post.description` lands in the comma-joined keyword list, diluting keyword value.
- Why: `keywords` is for short terms, not prose.
- What to do: build `keywords` from tags/category/title only.

### Dedup keywords with `Array.from`, not `Set` spread
- What goes wrong: building a deduped `keywords` list across multiple posts with `[...new Set(...)]` fails the `tsc` build (`Set` can only be spread under a higher TS target / `downlevelIteration`).
- Why: the project's TS target does not allow spreading a `Set`.
- What to do: use `Array.from(new Set(posts.flatMap(...)))`.

### Never set `user-scalable=no` on the viewport
- What goes wrong: `user-scalable=no` blocks pinch-zoom — WCAG 1.4.4 / 1.4.10 violation.
- Why: it disables user text resizing.
- What to do: use `content="width=device-width, initial-scale=1"`.

## Conventions

- Every `<meta>`/`<link>` in `CommonMeta` MUST carry a `key` so `next/head` dedups when a page injects its own override via `customMeta`.
- Guard optional array renders with `!!arr?.length` (not `arr?.length &&`) so a falsy `0` does not leak as a DOM text node.
- Meta description copy lives in `config/meta-contents.ts`; keep language policy consistent there rather than inlining strings per page.

## Rationale

Image absolutization is centralized in the component (not the 9 call sites) so adding a new page that uses `CommonMeta` gets correct social-card images for free. Introduced in issue #183.
