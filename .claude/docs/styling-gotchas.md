# Styling Gotchas

Read this when: editing anything under `styles/`, adding Tailwind classes to a component, introducing a new design token, or touching a `*.module.scss` (there should not be any — see below).

## Overview

The project styles itself with Tailwind CSS v4 in CSS-first mode (no `tailwind.config.*`). Tokens live in `styles/globals.css` under `@theme`, the post-body markdown gets `@tailwindcss/typography`'s `prose` plus a project-specific override block, and the Highlight.js code theme is kept outside the Tailwind cascade in `styles/highlight.css`. There are no CSS Modules (`*.module.scss`) anymore — reintroducing them is a regression of #93.

## Pitfalls

### Tailwind preflight strips browser default block margins

- **Symptom:** headings (`h1`–`h6`), paragraphs, and lists render flush against each other with no vertical breathing room; About page paragraphs collapse, post-body looks cramped.
- **Why:** Tailwind's `@import "tailwindcss"` injects preflight, which zeroes `margin` on those elements. The site previously relied on `normalize.css`, which preserves the user-agent defaults.
- **Rule:** `styles/globals.css` under `@layer base` MUST keep the em-based margin restoration block (`h1 { margin: 0.67em 0 }`, …, `p { margin: 1em 0 }`, `ul, ol { margin: 1em 0; padding-left: 40px }`). The numbers match the WHATWG HTML rendering-defaults spec — do not "round them" without intent.

### `.post-body` rules must out-specify `prose`

- **Symptom:** A custom override on `.post-body h2` (or similar) is silently ignored; the prose default wins.
- **Why:** `prose` uses `:where(...)`-scoped selectors (specificity `0,1,0`). A nested rule `.post-body & h2` resolves to specificity `0,1,1`, so it wins — but only because of that extra element selector. Adding overrides as a plain `.post-body { ... }` declaration (e.g. `color: red` on the wrapper) won't propagate to children the same way.
- **Rule:** Element-level overrides on the post body MUST live inside `.post-body` in `@layer components` and target the child element explicitly (`& h2 { ... }`, `& blockquote { ... }`). NEVER mark `.post-body` as `not-prose`; the goal is to keep prose's defaults and override surgically.

### `outline: none` on every element breaks keyboard focus

- **Symptom:** Tab-navigating the site shows no focus indicator on any element.
- **Why:** The legacy SCSS had `* { outline: none }`. Porting that as-is is an accessibility regression.
- **Rule:** Suppress focus rings only for non-keyboard interaction: `:focus:not(:focus-visible) { outline: none }`. NEVER reintroduce a universal `outline: none`.

### `--breakpoint-tablet: 800px` is intentional, not a typo for `md`

- **Symptom:** A new component uses `md:` for its tablet break and looks wrong at 769–800 px.
- **Why:** Tailwind's default `md` breakpoint is 768 px. The legacy stylesheets used `@media (max-width: 800px)` for layout reflows (header rearrange, post-card stacking, aside hide). To preserve the exact reflow points, `@theme` defines `--breakpoint-tablet: 800px`, exposing the `tablet:` and `max-tablet:` variants.
- **Rule:** Use `max-tablet:` for legacy 800 px reflows. `max-md:` (768 px) is reserved for the rarer 768 px breakpoint already present in `globals.css` `@layer base` (`#__next`, mobile font-size, aside hide).

### Complex `grid-template-areas` belong in `@layer components`, not inline

- **Symptom:** A `.tsx` `className` grows past ~200 characters with `[grid-template-areas:'..._..._...']_'..._..._...']` arbitrary values; the line becomes unreadable and the same grid duplicated across mobile and desktop variants.
- **Why:** Tailwind's arbitrary-value escaping makes long named-area grids unreadable. Both reflows (default + `max-tablet:`) doubling the length.
- **Rule:** Multi-area grids with a tablet reflow MUST be defined as a named class in `globals.css` `@layer components` (precedents: `.header-grid`, `.post-card-grid`). Use that class on the element; keep only the simple utilities (`gap-*`, `border-*`, `py-*`) inline.

### `highlight.css` is intentionally outside the Tailwind cascade

- **Symptom:** Tweaking a hljs token color in `globals.css` has no effect, or vice versa.
- **Why:** `styles/highlight.css` is imported in `pages/_app.tsx` AFTER `globals.css` and is plain CSS (not a Tailwind layer). It owns `.hljs`, `.hljs-*`, and the `pre code` reset, and it is loaded last so it overrides preflight on code blocks.
- **Rule:** Add or change syntax-highlight colors in `highlight.css` only. Add or change layout/typography for code blocks (e.g., border-radius on `<pre>`) also in `highlight.css`. NEVER move hljs rules into `globals.css` — the import order matters.

### Token names must follow Tailwind v4's `--<namespace>-<name>` convention

- **Symptom:** A custom token defined in `@theme` doesn't generate the expected utility.
- **Why:** Tailwind v4 only auto-generates utilities for tokens that match a registered namespace prefix (`--color-*` → `bg-*`/`text-*`/`border-*`, `--spacing-*` → `m-*`/`p-*`/`gap-*`, `--leading-*` → `leading-*`, `--breakpoint-*` → screen variants, etc.).
- **Rule:** When adding a token, ALWAYS use the namespace prefix that matches the utility family you want. To get `leading-wide`, the token MUST be named `--leading-wide`, not `--line-height-wide` or `--wide-leading`.

## Conventions

- `*.module.scss` and the `sass` dependency MUST stay removed. Components express their styles either as Tailwind utility classes in JSX or, for shared multi-rule blocks, as classes in `globals.css` `@layer components` (e.g. `.header-grid`, `.post-card-grid`, `.post-body`, `.clickable`).
- New design tokens MUST be added to the `@theme` block in `globals.css`. Dark-mode overrides live in the same file's `@media (prefers-color-scheme: dark)` block — the codebase uses media-query dark mode, not a class strategy.
- `normalize.css` MUST NOT be reintroduced. If a preflight reset bites a new component (lists, headings, form controls), restore the affected user-agent default in `globals.css` `@layer base` and document it here.
- The post-body article element MUST carry `prose max-w-none post-body` together (in that order is fine). `prose` provides the typography baseline; `.post-body` selectively overrides.

## Related

- [ads-adsense-rendering-gotchas.md](ads-adsense-rendering-gotchas.md) — pitfalls when the aside cell becomes too narrow for AdSense (ties into the `repeat(3, 1fr)` + fixed-width main grid behavior documented above).

## Rationale

The migration to Tailwind v4 (issue #93) collapsed 30 `*.module.scss` files into Tailwind utilities to reduce cognitive overhead and enable token-based theming. CSS-first config was chosen over a JS config because v4's `@theme` directive removes the need for `tailwind.config.ts` and keeps tokens colocated with the rest of the global styles. `@tailwindcss/typography` was adopted to handle the markdown-rendered post body, where the HTML is `dangerouslySetInnerHTML`-injected and cannot receive utility classes element-by-element.
