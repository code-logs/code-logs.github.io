# Post Detail Page Gotchas

Read this when: editing `pages/[title].tsx`, the TOC (`components/content-explorer/*`, `components/post-detail/MobileToc.tsx`), the post code-block / syntax theme (`styles/highlight.css` + the `--syntax-*` / `--color-code-bg` tokens), heading anchors, `components/utterrances/Utterrances.tsx`, or the post-detail footer sections (`components/post-detail/*`).

## Overview

The post route `/[title]` (issue #153) is a TOC-hybrid reading page: `PostHeader` + 16:9 thumbnail + body + five footer sections (Tags/Share, Series, Prev/Next, More-from-category, Comments), with a sticky table-of-contents aside on the right at ≥1024. This doc covers the traps in that page and its supporting components. Layout-container rules live in [layout-system-gotchas.md](layout-system-gotchas.md); color/spacing token rules in [color-tokens-gotchas.md](color-tokens-gotchas.md) and [styling-gotchas.md](styling-gotchas.md).

## Pitfalls

### `--tw-prose-pre-code` MUST be a token, never `#fff`

- **Symptom:** Code block text is invisible (white-on-near-white) in light mode after the code surface was made light/dark-aware.
- **Why:** The code surface (`--color-code-bg`) and body-code color (`--color-text-body-code`) flip light↔dark via the `.dark` class (issue #153). A hard-coded `--tw-prose-pre-code: #fff` in `.prose.post-body` only worked while the surface was always-dark.
- **Rule:** Keep `--tw-prose-pre-code: var(--color-text-body-code)`. NEVER hard-code a code-text color — both the surface and the text resolve through tokens that flip per theme.

### `styles/highlight.css` colors MUST come from `--syntax-*` tokens, not literals

- **Symptom:** Code syntax colors look right in one theme and clash (or vanish) in the other; or the minimal palette regresses to purple/neon.
- **Why:** `highlight.css` is plain CSS loaded outside the Tailwind cascade (so `@variant dark` is unavailable). The `hljs-*` classes map to `--syntax-keyword/string/number/function/variable/tag/builtin`, defined in `@theme` (light) and flipped in the `.dark` block of `globals.css`. The dark palette deliberately avoids teal hues so syntax never collides with `--color-accent`.
- **Rule:** Add/adjust syntax colors only by editing the `--syntax-*` token values in `globals.css` (both the `@theme` light set and the `.dark` set). NEVER put a literal hex in `highlight.css`. Dark rules in that file key off the `.dark` ancestor explicitly, not `@media (prefers-color-scheme)` — see [dark-mode-toggle-gotchas.md](dark-mode-toggle-gotchas.md).

### `marked` already emits heading ids — there is no heading-renderer override

- **Symptom:** Hunting for a custom marked heading renderer to "fix" anchor ids, or assuming `components/marked-anchor/MarkedAnchor.tsx` is involved.
- **Why:** `marked` 4.3.0 (the pinned version) auto-generates slug ids on `h2/h3/h4`, including for Korean text (`## 한글 제목` → `id="한글-제목"`). `MarkedAnchor.tsx` is the header **nav-link** component (issue #150), unrelated to body headings.
- **Rule:** Rely on marked's built-in ids for TOC anchors and heading-copy links. Do NOT add a heading-id normalizer or a custom renderer unless the marked version changes (v5+ removed auto-ids and would need `marked-gfm-heading-id`).

### TOC tree + active id are computed ONCE in the page, shared by both TOC views

- **Symptom:** Doubled IntersectionObservers / duplicate heading scans, or the observer rebuilding on every render.
- **Why:** The desktop aside (`ContentExplorer`) and the mobile `<details>` (`MobileToc`) both mount simultaneously (only CSS-hidden via `lg:hidden` / `max-lg:hidden`). `pages/[title].tsx` calls `useHeadingTree()` + `useActiveHeading(ids)` once and passes `tree`/`activeId` down as props; both TOC components are presentational. `ids` is memoized (`useMemo` on `tree`) so the observer's effect dep stays referentially stable.
- **Rule:** Keep `ContentExplorer` and `MobileToc` prop-driven. NEVER call `useHeadingTree`/`useActiveHeading` inside them (that reintroduces the double scan). If you add a third TOC surface, feed it the same page-level `tree`/`activeId`.

### Heading-anchor copy is wired by delegation and MUST preserve heading semantics

- **Symptom:** Screen-reader heading navigation stops landing on body headings; or the copy-on-click handler silently does nothing.
- **Why:** Body headings come from `dangerouslySetInnerHTML`, so the click/keydown handlers are attached by delegation on the `#content` section in `pages/[title].tsx`, and each `h2/h3` gets `tabIndex=0` + a `title`. An earlier attempt added `role="button"`, which **overrides** the implicit `heading` role and breaks AT heading navigation.
- **Rule:** NEVER set `role="button"` on the headings. Keep them focusable (`tabIndex`) with the native heading role; convey the copy affordance via the hover `#` glyph (CSS `.post-body h2/h3::before`) and the `title` attribute.

### Utterances follows the manual theme toggle via postMessage, not `preferred-color-scheme`

- **Symptom:** Comments stay light while the site is dark (or vice versa) after toggling the theme.
- **Why:** `Utterrances.tsx` derives the widget theme from next-themes' `resolvedTheme` (mapping `dark→github-dark`, `light→github-light`). The script is injected once **after** `resolvedTheme` is known (avoids a wrong-theme flash), and later toggles are pushed to the loaded iframe via `postMessage({ type: 'set-theme', theme }, 'https://utteranc.es')`.
- **Rule:** Do not pass a static `theme` prop or revert to `preferred-color-scheme`. Guard against `resolvedTheme` being `undefined` on first render. The toggle-time `postMessage` is a no-op until the `.utterances-frame` iframe exists — that is expected (the initial theme was already set on the script tag).

### `MoreFromCategory` desktop columns MUST track the visible post count via static literals

- **Symptom:** A category with only 1–2 other posts renders the "More from" cards as lone, narrow, left-skewed cards in a fixed 3-wide grid; OR the grid loses its column count entirely (renders `class="grid  gap-6 …"`) after a "simplification".
- **Why:** `getStaticProps` slices to `MORE_FROM_CATEGORY_LIMIT = 3`, so the section can receive 1, 2, or 3 posts. The desktop column count is chosen via `DESKTOP_GRID_COLS[Math.min(posts.length, 3)]` (issue #192) so 1–2 posts fill the row instead of skewing left. Tailwind v4 JIT purges any class it cannot see as a whole string — a computed `grid-cols-${n}` would be stripped, leaving no column utility.
- **Rule:** Keep the column class as a lookup into a static-literal map (`grid-cols-1/2/3`), NEVER a template string. Keep the `?? 'grid-cols-3'` fallback and the `max-tablet:grid-cols-1` mobile override. See [styling-gotchas.md](styling-gotchas.md) for the JIT-detectable-class rule.

## Conventions

- The post route uses `.post-detail-layout` (defined in `globals.css`), NOT `container-reading` — a centered 1080 shell that becomes `grid-template-columns: minmax(0, 720px) var(--aside-width)` at ≥1024. The TOC aside is `max-lg:hidden`; `MobileToc` is `lg:hidden`. The 1024 breakpoint matches the layout system's desktop tier.
- Footer sections (Tags/Share → Series → Prev/Next → More-from-category → References → Comments) each carry a top hairline divider + 48px gap via the shared `mt-12 pt-12 border-t border-divider` class. Series and More-from-category render only when they have content.
- `MainAdsBanner` sits between the body and the footer sections (body-end ↔ PostFooter). Keep it there; the AdSense narrow-viewport guard still applies — see [ads-adsense-rendering-gotchas.md](ads-adsense-rendering-gotchas.md).
- Prev/Next semantics: `postsDatabase.findPrevious(post)` returns the **older** post (next index in the publishedAt-desc dataset), `findNext` the **newer** one; both return `undefined` at the chronological boundaries. `getStaticProps` MUST coerce these to `null` (Next.js rejects `undefined` in JSON props).
- `MoreFromCategory` reuses `PostCardGrid` (issue #152), which requires `readingTime` per post — compute it in `getStaticProps` with `calculateReadingTime` ([post-reading-time-gotchas.md](post-reading-time-gotchas.md)), never in the component.
- Card edge convention is `ring-1 ring-border` with NO `border` (matches `PostCardGrid`). `NavCard` previously carried both `border border-border` and `ring-1 ring-border`, doubling the edge to 2px (issue #192) — keep cards on the single-ring edge so they stay consistent and flip cleanly per theme via `--color-border`.
- Internal page links use native `<a>` (full reload) site-wide. A literal internal path like `/posts/1` trips the `no-html-link-for-pages` ESLint rule — keep it in a const so the analyzer treats it as dynamic, matching the dynamic hrefs elsewhere.

## Rationale

The page was rebuilt (issue #153) from a flat single-column flow (right-aligned date → forced 315px thumbnail → CarouselBanner → italic 1.5rem description → body → four flat sections) into the TOC-hybrid reading layout for the "trustworthy minimal" tone. CarouselBanner was removed from this page only; its policy on other pages is out of scope. The TOC was rewritten from a `useScroll`/`offsetTop` scan with a hard-coded `HEADER_HEIGHT` to an `IntersectionObserver` keyed off the `--header-height` CSS variable, and the hand-unrolled 3-level nesting to a recursive `TocNode`.
