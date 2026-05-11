# Icon Library Gotchas

Read this when: adding, replacing, or styling an icon component, or considering an icon-library swap.

## Pitfalls

### `lucide-react` v1.x removed all brand icons
- v1.0 dropped trademarked brand marks (`Github`, `Twitter`, `Linkedin`, etc.) for legal reasons. Importing `Github` from `lucide-react` fails type-check: `Module 'lucide-react' has no exported member 'Github'`.
- NEVER re-introduce a third-party brand-icon package (`simple-icons`, `react-icons`, etc.) just for one or two brand marks — it re-grows the dependency surface that issue #91 deliberately trimmed.
- ALWAYS implement brand marks as small inline-SVG components. Example: `config/social.config.tsx` defines a local `GithubIcon` returning `<svg viewBox="0 0 24 24" fill="currentColor">…</svg>`. Use `currentColor` so CSS `color` continues to drive the fill.

### `lucide-react` SVGs do NOT size via CSS `font-size`
- `@mui/icons-material` rendered icons with `font-size: inherit` on the root SVG, so projects sized them via `svg { font-size: ... }`. Lucide does not — its root `<svg>` ignores `font-size` and sizes via `width` / `height` attributes or CSS.
- ALWAYS use `width` / `height` in CSS (or the `size` prop on the React component) to control lucide icon dimensions. The fix applied here was `components/paginator/Paginator.module.scss` and `components/header/Header.module.scss` swapping `font-size` → `width` + `height`.
- Color still works via CSS `color` because lucide SVGs use `stroke="currentColor"`.

### Visual tone differs between MUI and lucide
- MUI's `*Rounded` icons are filled glyphs; lucide is stroke-based (default `strokeWidth: 2`). The same icon may look thinner after the swap.
- If a thicker look is needed, pass `strokeWidth={2.25}` (or higher) on the lucide component rather than reaching for a different library.

## Rationale

- The dependency footprint of `@mui/icons-material` pulled in `@mui/material` + `@emotion/react` + `@emotion/styled` as peers — 61 transitive packages for 6 icons. Issue #91 swapped to `lucide-react` and inline SVG for brand marks; do not undo this by re-adding a heavy icon package.
