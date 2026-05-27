# Header Interaction Gotchas

Read this when: editing the header's interactive pieces — `components/header/Header.tsx`, `Logo.tsx`, the search palette (`components/search-palette/*`, `SearchTrigger.tsx`), the mobile sheet (`components/mobile-sheet/MobileSheet.tsx`), `NavBar.tsx`/`MarkedAnchor.tsx`, or the global Cmd+K wiring in `pages/_app.tsx`.

## Overview

The redesigned header (issue #150) is a five-slot row (Logo · Nav · Search · Theme · Social) with a Cmd+K search palette and a mobile slide-in sheet. This doc covers the interaction/state-ownership traps in those overlays. The header *layout* skeleton (sticky bar, `.container-*` padding alignment, background/border ownership) lives in [layout-system-gotchas.md](layout-system-gotchas.md); the accent token the logo/nav use lives in [color-tokens-gotchas.md](color-tokens-gotchas.md).

## Pitfalls

### Search-palette state is global (`_app`); mobile-sheet state is local (`Header`)
- **Symptom:** Adding a second palette open-state in `Header`, or trying to trigger the palette from a page, breaks the Cmd+K shortcut or double-mounts the dialog.
- **Why:** Cmd+K is a window-level shortcut, so the palette must be mounted once at `_app` scope with its `open` state there. The mobile sheet has no global shortcut and needs `menus`/`socialIcons` that `Header` already holds, so its state is local to `Header` — lifting it would only add prop drilling.
- **Rule:** Keep `paletteOpen` in `_app.tsx` (it passes `onOpenSearch` down and mounts `<SearchPalette>` as a page sibling). Keep `sheetOpen` in `Header.tsx`. NEVER introduce a context/provider for these — there is one trigger and one consumer each (YAGNI).

### Escape is handled in two places — the palette MUST `stopPropagation`
- **Symptom:** Future logic added to the `_app` window `keydown` handler fires unexpectedly when Escape closes the palette.
- **Why:** `_app.tsx` has a window-level `keydown` that closes the palette on Escape, AND `SearchPalette`'s own panel `onKeyDown` closes on Escape. Both fire on the same event (bubble + panel).
- **Rule:** The palette's Escape branch MUST call `e.stopPropagation()` so it owns Escape while open. The `_app` handler's Escape branch is the fallback for when focus is outside the dialog.

### Cmd+K MUST be ignored inside INPUT/TEXTAREA
- **Symptom:** Pressing Cmd+K while typing in a field hijacks the browser/OS default (e.g. Safari address bar) or the page's own search input.
- **Why:** A blanket `metaKey && key==='k'` handler overrides native behavior everywhere.
- **Rule:** In the `_app` handler, `return` early when `e.target.tagName` is `INPUT` or `TEXTAREA` before `preventDefault()`. (Vimium-class extensions can still intercept — that is unavoidable; do not add more mitigation than `preventDefault`.)

### `MobileSheet` MUST render through a portal to `document.body`
- **Symptom:** The sheet's `fixed inset-0` overlay clips to the ~55px header box instead of the viewport — the backdrop only covers the header, body clicks don't close it, and the off-screen panel (`translate-x-full`) bleeds right, causing horizontal overflow. (issue #210)
- **Why:** `<header>` carries `backdrop-filter: blur(8px)` (the frosted bar), which makes the header a *containing block* for its `position: fixed` descendants. A sheet rendered inside the header is therefore positioned against the header box, not the viewport. See [layout-system-gotchas.md](layout-system-gotchas.md) for header background/border ownership — the blur MUST stay there, so the fix is to escape the subtree, not remove the blur.
- **Rule:** `MobileSheet` MUST `createPortal(tree, document.body)` so its `fixed` overlay resolves against the viewport. Keep the `sheetOpen` state in `Header` (only the render location moves — do NOT lift state or add a context; see the state-ownership pitfall above). Under `output: 'export'` the portal target doesn't exist at build time, so gate it behind a post-mount flag (`const [mounted,setMounted]=useState(false); useEffect(()=>setMounted(true),[]); if(!mounted) return null`) — the first render returns `null`, matching the static HTML and avoiding a hydration mismatch. The sheet is interactive-only, so its absence from initial HTML is harmless. The inner backdrop/panel stay `absolute` (the body-level `fixed inset-0` wrapper is their containing block) — that is the intended final shape, do NOT "normalize" them to `fixed`.

### `MobileSheet` open-focus MUST defer one frame AND drop the `visibility` transition on open
- **Symptom:** Opening the sheet leaves focus on the hamburger button instead of moving into the panel, so Escape never reaches the panel's `onKeyDown` and the sheet won't close via keyboard. (issue #210)
- **Why:** The panel is always mounted and toggles `invisible`↔`visible` (so the slide-out animates both ways). A `visibility:hidden` element rejects `focus()` — and the `visible` state, if it inherits the panel's `visibility` *transition*, doesn't apply synchronously, so even a next-frame `focus()` silently bounces back to the hamburger.
- **Rule:** Two things MUST hold together: (1) on the open render, the panel's `transition` MUST exclude `visibility` (transform only) so `visible` applies synchronously — keep the `visibility var(--duration-slow)` transition on the *close* branch only, so the panel stays visible through the slide-out. (2) Move focus inside a single `requestAnimationFrame` (focusing in the same tick still sees `hidden`), and `cancelAnimationFrame` in the effect cleanup. Removing either half regresses Escape-to-close. NOTE: `SearchPalette` does NOT need this — it unmounts on close (`if(!open) return null`), so it is already `visible` when it mounts and can focus immediately. The two overlays differ here on purpose; do NOT "unify" them.

### Both overlays implement focus-trap / scroll-lock / focus-restore by hand
- **Symptom:** Tab escapes the open dialog to the page beneath; or after closing, focus is lost to `<body>`; or the page behind scrolls.
- **Why:** There is no focus-trap dependency (zero-dep is a project constraint). Each overlay must do it itself, and they must stay in sync.
- **Rule:** Both `SearchPalette` and `MobileSheet` MUST: (1) trap `Tab`/`Shift+Tab` within the panel's focusables (query the panel ref with the `FOCUSABLE` selector, wrap at first/last), (2) set `document.body.style.overflow='hidden'` on open and restore it in the effect cleanup, (3) save `document.activeElement` on open and `.focus()` it back on close. The two overlays are never open at once (mobile search opens the palette, not inside the sheet), so their body-scroll locks do not collide — but each cleanup MUST restore to `''` regardless.

### Search-result highlight: `aria-activedescendant` MUST target the `role="option"` element
- **Symptom:** Screen readers do not announce the active result during arrow navigation.
- **Why:** The combobox input's `aria-activedescendant` must point to the element that bears `role="option"`. If the `id` sits on the inner `<a>` while `role="option"` is on the wrapping `<li>`, the reference is invalid.
- **Rule:** In `SearchResult`, the `id` and `role="option"` MUST be on the same element (the `<li>`). The input MUST carry `role="combobox"` + `aria-expanded` for the reference to be meaningful.

### Search mark highlight uses `text-link`, not `text-accent`
- **Symptom:** Matched-token `<mark>` text fails WCAG AA in light mode.
- **Why:** `text-accent` is `accent-600` (decorative). The mark is readable text. See [color-tokens-gotchas.md](color-tokens-gotchas.md) §"`text-accent` is decorative-only".
- **Rule:** Highlight is built by splitting React nodes (NEVER `dangerouslySetInnerHTML` — XSS-safe under static export) and the `<mark>` is colored `text-link`.

### Manifest fetch is lazy and same-origin-absolute
- **Symptom:** The manifest is fetched on every page load, or the fetch 404s under a non-root base URL.
- **Why:** The palette should not pay the fetch until first opened; and the manifest is served from the site root.
- **Rule:** Fetch `'/search-index.json'` (absolute, NOT prefixed with `NEXT_PUBLIC_BASE_URL`) once on first open, cached in component state for the session. Result hrefs are `/${entry.slug}` — `slug` is already `PostUtil.normalizeTitle` output (`[a-z0-9-]`), so do NOT re-`encodeURIComponent` it.

## Conventions

- **`.nav-link` indicator alignment:** the active-page 2px accent line is anchored by stretching `.nav-link` to `height: var(--header-height)` with the `::after` at `bottom: 0`, so it lands exactly on the header's bottom border. NEVER use a magic negative `bottom` offset — nav is desktop-only (≥768, where the header is 64px), mobile routes nav through the sheet. Active state is keyed off `aria-current="page"` (set by `MarkedAnchor`), not a class.
- **`@utility kbd`:** the keyboard-key chip (search trigger's `⌘K`, palette footer hints) is a Tailwind `@utility` in `globals.css`. Reuse the `kbd` class; do not hand-roll bordered key styling.
- **768 boundary uses Tailwind `md:`:** the header's desktop/mobile split is at 768px, which is Tailwind's default `md:`. Component-internal reflows elsewhere use the project's `max-tablet:` (800px) — do NOT mix the two for the header slots.
- **Logo is type, not SVG:** the `code-logs/` wordmark is Geist Mono (`font-mono`) with the slash in `text-accent`. There is no SVG glyph. The home `<a href="/">` keeps a native anchor (whole site does) with an inline `eslint-disable-next-line @next/next/no-html-link-for-pages`.

## Rationale

The state-ownership split (palette global in `_app`, sheet local in `Header`) follows from where each is triggered: a window-level shortcut forces a single global mount, while a header-button-only overlay that already has its data stays local — introducing a context for either would add indirection a single producer/consumer pair does not need. Focus-trap, scroll-lock, and focus-restore are hand-rolled because the project carries zero UI dependencies (no Radix/Headless UI); the cost is two small effects per overlay, paid to keep the bundle and dependency surface minimal. The `<mark>` highlight is built from split React nodes rather than `dangerouslySetInnerHTML` so a user-typed query can never inject markup — the same XSS-safety stance the static-export markdown pipeline takes elsewhere.

## Related
- [layout-system-gotchas.md](layout-system-gotchas.md) — header layout skeleton, sticky bar, background/border ownership, `.container-*` padding.
- [color-tokens-gotchas.md](color-tokens-gotchas.md) — the `--color-accent` token and the `text-accent` vs `text-link` rule.
- [build-pipeline-gotchas.md](build-pipeline-gotchas.md) — why `search-index` runs before `next build` and is committed.
- [playwright-testing-gotchas.md](playwright-testing-gotchas.md) — how MobileSheet is tested via Playwright, why containing-block bugs only appear in tests, and how issue #210 was discovered.
