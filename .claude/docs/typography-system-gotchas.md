# Typography System Gotchas

Read this when: editing `styles/fonts.ts`, adding/changing a `--text-*`/`--leading-*`/`--tracking-*`/`--font-*` token in `styles/globals.css`, touching the `_app.tsx` font wrapper, adjusting heading sizes, or wiring a new self-hosted font.

## Overview

The site self-hosts three variable fonts via `next/font/local` (Geist for latin, Pretendard for Korean, Geist Mono for code) and exposes a 1.25 Major Third type scale through `@theme` tokens. Font CSS variables are injected by a wrapper in `pages/_app.tsx`; the scale tokens and semantic `h1~h4` mapping live in `styles/globals.css`. This document covers the traps unique to that setup. For the broader Tailwind v4 / `@theme` rules see [styling-gotchas.md](styling-gotchas.md).

## Pitfalls

### `--text-*`/`--leading-*`/`--tracking-*` tokens silently override Tailwind built-ins site-wide

- **Symptom:** A `text-sm`, `leading-snug`, or `tracking-tight` utility anywhere renders at a different size/spacing than Tailwind's default, with no local class change.
- **Why:** Tailwind v4 auto-generates these utility families from `@theme` tokens of the same name. Defining `--text-sm: 0.875rem` etc. *replaces* the built-in `text-sm`, so every existing usage shifts. This was intentional (one canonical scale) and is currently safe because the codebase had **zero** named-utility usages before — all sizes were arbitrary `text-[Nrem]`.
- **Rule:** Before adding or changing a `--text-*`/`--leading-*`/`--tracking-*` token, ALWAYS audit existing usages so the global shift is intended:
  ```sh
  grep -rnoE "text-(xs|sm|base|lg|xl|[2-6]xl)\b|leading-(tight|snug|normal|relaxed|loose)\b|tracking-(tighter|tight|snug|normal|wide)\b" --include="*.tsx" components/ pages/
  ```

### Font variables must be injected from `_app.tsx`, never `_document.tsx`

- **Symptom:** Moving the font wrapper to `_document.tsx` (to set `<body className>`) builds but fonts don't apply, or the build warns about `next/font` usage.
- **Why:** `next/font` loaders must run in `_app`/pages, not `_document`. The grid layout puts `header/main/aside/footer` as direct children of `#__next`, so a normal wrapping `<div>` would break `grid-template-areas`.
- **Rule:** Keep the font variables on the `display: contents` wrapper in `pages/_app.tsx`. `display: contents` drops the wrapper box so the landmark children stay direct grid items, while CSS custom properties still cascade through it. Keep `role="none"` on that wrapper — `display: contents` removes the element from the a11y tree in some browsers, and `role="none"` makes that explicit so only the landmark children are exposed.

### Post-body headings are governed by `prose` (utilities layer), not base `h1~h4`

- **Symptom:** A base-layer `h1~h4` size change shows everywhere *except* inside the rendered markdown post body.
- **Why:** `@tailwindcss/typography` emits `.prose :where(h1)…` into `@layer utilities`, which beats `@layer base` regardless of specificity. Inside `.prose.post-body`, prose wins. The `.post-body` block in `@layer components` overrides specific heading sizes by using a higher-specificity `& h1`/`& h2` selector.
- **Rule:** To change post-body heading sizes, edit the `& h1`/`& h2` rules inside `.post-body` in `globals.css` `@layer components` — NOT the base `h1~h4`. The base mapping governs only non-prose headings (PostCard, Header, section headings).

### Heading line-height/letter-spacing literals between scale steps are intentional

- **Symptom:** `h2 { line-height: 1.2 }`, `h3 { letter-spacing: -0.015em }`, `h4 { letter-spacing: -0.01em }` look like missing-token oversights.
- **Why:** The per-element type ramp (issue #145) specifies values that fall between named `--leading-*`/`--tracking-*` steps. Minting single-use tokens for them would be over-tokenization.
- **Rule:** Leave them as literals (a comment in `globals.css` marks them). Only promote a literal to a token if a second consumer appears.

## Conventions

- New self-hosted fonts: add the woff2 + its OFL/license file to `public/fonts/`, define the loader in `styles/fonts.ts` with a `variable`, and append `.variable` to `fontVariables`. ALWAYS `preload: true` for at most one face (currently Geist Regular) to protect LCP; everything else uses `display: 'swap'` with `preload: false`.
- Card titles map to `--text-xl` (20px) via `[&>*]:text-xl` in `PostCard.tsx` — this is the scale's "card title" step and is deliberately smaller than the global `h3` (`--text-2xl`, 24px). Do NOT "fix" the divergence.
- Code typography is split by ownership: inline code (`.post-body & p > code`) lives in `globals.css`; code blocks (`pre code`) live in `styles/highlight.css`. `--font-mono` is referenced from both. See [styling-gotchas.md](styling-gotchas.md) for why `highlight.css` stays outside the Tailwind cascade.
- `font-feature-settings`/`font-variant-numeric: tabular-nums` are set on `body` so digit columns (category counts, dates) don't shift. Keep them on `body`, not per-component.

## Rationale

- **`public/fonts/` originals coexist with next/font hashed copies.** `next/font/local` emits content-hashed woff2 under `_next/static/media/` (those are what's actually served). The `public/fonts/` originals are the loader's source files and double as the license-archive location. The minor duplication is an accepted trade-off for keeping sources + licenses visible in the repo.
- **Geist + Pretendard over Pretendard-only.** The site mixes English and Korean; Geist carries the latin character while Pretendard handles Korean via stack fallback (`--font-sans: var(--font-geist), var(--font-pretendard), …`). No `:lang()` branching needed — the browser falls through per glyph.

## Related

- [styling-gotchas.md](styling-gotchas.md) — Tailwind v4 `@theme` setup, preflight margin restoration, `.post-body` prose override rules, `highlight.css` cascade separation. This document layers font/type-scale specifics on top of it.
- [color-tokens-gotchas.md](color-tokens-gotchas.md) — sibling token system (Zinc/Teal semantic colors) under the same `@theme` block.
- [plan-145-typography-system.md](plan-145-typography-system.md) — the implementation plan this system was built from.
