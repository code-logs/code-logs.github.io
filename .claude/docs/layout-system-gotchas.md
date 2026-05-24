# Layout System Gotchas

Read this when: editing the page skeleton in `pages/_app.tsx`, the `header`/`main`/`footer` base rules or `.container-*`/`.layout-with-aside` utilities in `styles/globals.css`, wrapping a page in a container, or touching `Header.tsx`/`Footer.tsx`/`NavBar.tsx` layout.

## Overview

The common layout (issue #149) is a flex skeleton in `pages/_app.tsx` — `min-h-dvh flex flex-col` wrapping `Header` / `<main className="flex-1">` / `Footer` — that replaced the legacy `#__next` 3-column grid. Pages opt into one of three width containers, with a slim sticky header and a static footer. This doc covers the traps in that layer.

## Pitfalls

### `*/` inside a CSS block comment closes it early

- **Symptom:** `pnpm run build` fails with `Syntax error: Unknown word --header-height` (or similar) pointing at a token line that looks fine.
- **Why:** A `/* ... */` comment in `globals.css` that contains the literal `*/` — e.g. writing `--spacing-*/--radius-*` in prose — terminates the comment at that `*/`, so the rest of the comment body is parsed as CSS and breaks.
- **Rule:** NEVER write `*/` inside a CSS comment. Rephrase (e.g. "the spacing/radius scale tokens") instead of `--spacing-*/--radius-*`.

### Bare JSX comment as the first child of `return (` is a parse error

- **Symptom:** ESLint/`tsc` fails with `Parsing error: ')' expected` in a component you just edited.
- **Why:** `{/* ... */}` placed directly after `return (` as a sibling of the root element is an expression in an invalid position — there is no enclosing element to hold it.
- **Rule:** Put the comment as a plain `// ...` JS comment ABOVE `return`, or inside the root element. NEVER leave a `{/* */}` as the bare first node of a return.

### Header/footer background & border have ONE owner — the base rule

- **Symptom:** A doubled border under the header/footer, OR the header backdrop-blur shows no blur-through (looks opaque).
- **Why:** The base `header`/`footer` rules in `globals.css` own `background-color` (header uses a translucent `color-mix` so `backdrop-filter: blur` shows through), `border`, and footer spacing. If `Header.tsx`/`Footer.tsx` ALSO set `bg-bg-page` (opaque) or `border-b border-divider`, the opaque bg defeats the blur and the divider token drifts from the base rule's `--color-border`.
- **Rule:** Keep `Header.tsx`/`Footer.tsx` free of background/border classes — the base rule owns them. The header background MUST stay semi-transparent for the blur effect.
- **Footer internals (issue #151):** the base `footer` rule owns only *vertical* spacing (`padding: var(--spacing-12) 0` + `margin-top` + `border-top`). The 3-column footer therefore wraps its content in `.container-content` to get horizontal padding + max-width — do NOT re-add `border`/`bg`/vertical-`py` to the outer `<footer>`. The `border-t` on `FooterBottomBar` and the mobile column dividers (`border-t border-divider` on the 2nd/3rd column) are *internal content dividers*, NOT the outer footer border — they are not a doubling violation and must not be "deduplicated" away.

### Header horizontal padding MUST track `.container-*` padding

- **Symptom:** On desktop ≥1024px the header title/icons sit at a different left/right edge than page content — a staggered vertical edge.
- **Why:** `.container-*` uses `--spacing-page-x` (24) that bumps to `--spacing-page-x-desktop` (48) at `min-width: 1024px`. If the header uses a fixed `px-6`, it stays at 24 while content moves to 48.
- **Rule:** The base `header` rule sets `padding-inline: var(--spacing-page-x)` with a `@media (min-width: 1024px)` bump to `var(--spacing-page-x-desktop)` — identical to the containers. Do NOT hardcode header padding in `Header.tsx`.

### The app-global aside is gone — `enableContentExplorer` is currently dead

- **Symptom:** Looking for where `ContentExplorer` (post TOC) or `AsideAdsBanner` renders and finding nothing; `pageProps.enableContentExplorer` has no consumer.
- **Why:** Issue #149 removed the `<aside>` from `_app.tsx` (the issue's own skeleton has none). `ContentExplorer` rework is deferred to #153; `AsideAdsBanner` re-placement to the follow-up aside-composition issues (2-2/2-3). The `enableContentExplorer` prop on `pages/[title].tsx` is intentionally kept as the wiring point for #153 but reads nowhere today.
- **Rule:** To add an aside, compose `.layout-with-aside` inside the page's container (it is defined but applied to no page). Do NOT re-add an app-global aside to `_app.tsx`.

## Conventions

- Layout tokens (`--header-height` 64, `--header-height-mobile` 56, `--container-reading-max` 720, `--container-content-max` 1120, `--container-wide-max` 1280, `--aside-width` 280) live in `@theme` and are consumed only via `var()` — they are NOT utility namespaces, so they carry no blast radius (unlike the `--spacing-*`/`--radius-*` scales; see [styling-gotchas.md](styling-gotchas.md)).
- Every page MUST wrap its top-level element in exactly one container: `container-reading` (720, long-form prose — post/about/licenses/404), `container-content` (1120, card/list pages — index/posts/categories/tags), or `container-wide` (1280, reserved). `<main className="flex-1">` in `_app.tsx` owns vertical flex; the container owns horizontal width/padding.
- The static footer is pinned to the viewport bottom on short pages by the skeleton (`min-h-dvh flex flex-col` + `main flex-1`), NOT by `position: fixed`. NEVER reintroduce `position: fixed` on the footer.
- Responsive model is three-tier: **≤767** mobile (single column, `:root { font-size: 12px }`, 56px header), **768–1023** tablet (single column, container padding bumps at 1024), **≥1024** desktop (`.layout-with-aside` grid active). The base-layer mobile `@media` boundary is `max-width: 767px`. Component-internal reflows keep using the `max-tablet:` (800px) variant — see [styling-gotchas.md](styling-gotchas.md).

## Rationale

The legacy `#__next` `repeat(3, 1fr)` grid with a hardcoded `main { width: 768px }` pinned content to the right third of wide viewports and forced the aside to `display: none` on mobile. The container model decouples reading width from viewport thirds and lets the aside reflow instead of vanish. The header slot contents (logo/search palette/mobile sheet) landed in issue #150 — their interaction traps live in [header-interaction-gotchas.md](header-interaction-gotchas.md). The footer content (3-column Brand/Explore/Categories + copyright meta bar) landed in issue #151; its build-time dynamic-year handling — a sanctioned exception to the `getStaticProps` rule because the footer is globally rendered from `_app` — is in [static-export-rendering-gotchas.md](static-export-rendering-gotchas.md).
