# Dark Mode Toggle Gotchas

Read this when: editing `pages/_app.tsx` `ThemeProvider`, the `_document.tsx` FOUC script or `theme-color` metas, the `.dark` token block in `styles/globals.css`, `styles/highlight.css` dark rules, `components/theme-toggle/ThemeToggle.tsx`, or adding any `theme-color`/dark-scheme meta anywhere.

## Overview

Dark mode is a 3-mode (System / Light / Dark) manual toggle built on `next-themes` (issue #148). `next-themes` sets `.dark` on `<html>`; the token flip lives in the `.dark` block in `globals.css`. This doc covers the class-strategy invariants and the FOUC/`theme-color`/hydration traps. Token semantics themselves live in [color-tokens-gotchas.md](color-tokens-gotchas.md).

## Pitfalls

### A static media-less `theme-color` meta silently overrides the dark variant

- **Symptom:** The dark `theme-color` meta is present but the mobile address bar never goes dark.
- **Why:** `next/head` injects its tags *after* the `_document` `<Head>` in DOM order. A media-less `<meta name="theme-color">` always matches, and being later it wins over the `_document` media-scoped pair. This is exactly why the static `theme-color` (and the `blogConfig.themeColor` field that fed it) was removed from `components/common-meta/CommonMeta.tsx`.
- **Rule:** `theme-color` is owned ONLY by `pages/_document.tsx` as a light/dark `media=` pair. NEVER add a media-less `theme-color` meta anywhere — it re-creates the override.

### `theme-color` follows the OS, not the manual toggle

- **Symptom:** An OS-light user picks Dark via the toggle; the page goes dark but the mobile address bar stays light.
- **Why:** A static `<meta media="(prefers-color-scheme: dark)">` keys off the OS preference, not the `.dark` class. There is no JS hook to repoint a static meta to the toggle choice.
- **Rule:** Accept this as an inherent HTML limitation — do NOT try to "fix" it by toggling the meta in JS for marginal benefit. The page background (driven by `.dark` tokens) is always correct; only the browser chrome can desync.

### `highlight.css` dark rules must use an explicit `.dark` selector, not `@variant`/`@media`

- **Symptom:** Code-block dark styling desyncs from the toggle (e.g. the resting shadow stays) when OS scheme and chosen mode differ.
- **Why:** `styles/highlight.css` is plain CSS loaded outside the Tailwind cascade (see [styling-gotchas.md](styling-gotchas.md)), so `@variant dark` is unavailable. A `@media (prefers-color-scheme: dark)` query tracks the OS, not the `.dark` class the toggle sets.
- **Rule:** Dark overrides in `highlight.css` MUST be written as `.dark .hljs { … }` (explicit ancestor selector). NEVER use `@media (prefers-color-scheme)` there — it desyncs from the manual toggle.

### Hydration mismatch from server-unknown theme

- **Symptom:** React hydration warning on `<html>`, or the toggle icon flickers/mismatches on first paint.
- **Why:** Under `output: 'export'` the server has no theme; `next-themes` mutates the `<html>` class before hydration. A component that reads `theme` on first render produces server≠client markup.
- **Rule:** `<Html>` in `_document.tsx` MUST carry `suppressHydrationWarning`. `ThemeToggle` MUST gate on a `mounted` flag and render a **same-size** placeholder (`w-6 h-6`) until mounted — matching the social-icon footprint avoids layout shift.

## Conventions

- `ThemeProvider` config is fixed: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. `attribute="class"` is what couples it to the `.dark` token block; `disableTransitionOnChange` suppresses the global interactive-element transition flash on swap.
- `ThemeProvider` MUST sit OUTSIDE the `display: contents` font-variable wrapper in `_app.tsx`. It renders no DOM (Context only), so the `#__next` 3-column grid is unaffected — but nesting it *inside* the wrapper or adding a real DOM node would break the grid-item flattening.
- The `_document.tsx` FOUC script reads `localStorage.getItem('theme')` — this key MUST stay in sync with `next-themes`' default `storageKey` (`'theme'`). Changing one without the other reintroduces FOUC.
- `ThemeToggle` cycle order is `light → dark → system`; it shows the user's chosen `theme` (so System stays in the rotation), NOT `resolvedTheme`. Icons: `Sun`/`Moon`/`Monitor` at `strokeWidth={1.5}`. `aria-label` MUST name the current mode.

## Rationale

The class strategy replaced the prior `@media (prefers-color-scheme: dark)` block wholesale — keeping both would double the source of truth for the token flip. System mode still honors the OS because `next-themes` resolves `system` → the `.dark` class via `prefers-color-scheme`, so no media query is needed in CSS. The FOUC script duplicates `next-themes`' own no-flash logic defensively; the class toggle is idempotent so running both is harmless.

## Related

- [color-tokens-gotchas.md](color-tokens-gotchas.md) — which tokens the `.dark` block flips (neutrals, link, shadow) and the semantic-only consumption rule.
- [styling-gotchas.md](styling-gotchas.md) — the Tailwind v4 `@theme`/`@variant` setup and why `highlight.css` sits outside the Tailwind cascade.
