# Color Tokens Gotchas

Read this when: editing `styles/globals.css` `@theme`/`.dark` blocks, adding a new color token, applying a color utility (`bg-*`, `text-*`, `border-*`, `ring-*`) to a component, or changing the dark-mode palette.

## Overview

The color system is a two-tier palette layered under semantic aliases: **Zinc 9-step neutrals** + **Teal 5-step accents** as primitives, **semantic tokens** (`--color-bg-page`, `--color-text-body`, `--color-link`, `--color-danger`, …) as the surface components consume. Dark mode flips only neutrals + link semantics + shadow tokens via the `.dark` class; accents stay light-invariant. The class strategy (`next-themes` 3-mode toggle) and its FOUC/`theme-color` traps live in [dark-mode-toggle-gotchas.md](dark-mode-toggle-gotchas.md). The Tailwind v4 namespace rule (`--color-*` prefix is mandatory) is documented in [styling-gotchas.md](styling-gotchas.md) — this doc covers the semantic conventions on top of it.

## Pitfalls

### `bg-accent-600` (light Teal-600) on white fails WCAG AA for normal text

- **Symptom:** A small interactive element (active page number, badge) styled `bg-accent-600 text-white` looks fine visually but trips a WCAG AA contrast check at 3.74:1 (< 4.5:1).
- **Why:** Teal-600 `#0d9488` is borderline for AA when paired with white at normal text size. The 3:1 large-text exemption does not apply to ~12–14 px text.
- **Rule:** For white-on-accent UI surfaces, ALWAYS use `bg-accent-700` (`#0f766e` → ~5.47:1). Reserve `bg-accent-600` for non-text surfaces (hover backgrounds, decorative fills) where contrast against a text-color foreground is checked separately.

### `--color-danger: #ef4444` (Tailwind red-500) on white fails AA

- **Symptom:** A `bg-danger text-white` badge measures ~3.76:1 against white.
- **Why:** Red-500 was the issue spec's first draft, but it fails AA with white text at normal size. The current token resolves to `#dc2626` (red-600, ~4.83:1) for that reason.
- **Rule:** NEVER change `--color-danger` back to `#ef4444`. If a softer red is needed for a non-text fill (e.g., a 5%-opacity warning surface), introduce a new token (`--color-danger-surface`) rather than weakening `--color-danger` itself.

### Light-mode link `--color-link` is `accent-700`, not `accent-600`

- **Symptom:** An ad-hoc `text-accent-600` link in a component looks slightly off-brand and fails AA (~4.0:1 on white).
- **Why:** `--color-link` is explicitly bound to `accent-700` in light mode for AA compliance. In dark mode it switches to `accent-400` (brighter teal, ~10:1 on Zinc-950).
- **Rule:** Components MUST use the `text-link` utility (or `--color-link` directly), NEVER `text-accent-600`/`text-accent-700` directly. The light/dark split is handled in `globals.css` — bypassing it duplicates the decision and breaks dark mode.

### Components referencing primitive tokens directly bypass dark mode

- **Symptom:** A component sets `text-neutral-700` and renders unreadable dark-on-dark text in dark mode.
- **Why:** The semantic tokens (`--color-text-body`, `--color-text-heading`, …) are what get re-pointed in the `.dark` block. Primitive tokens (`--color-neutral-*`, `--color-accent-*`) are also overridden in dark mode, but bypass the semantic intent — a component that says "I want neutral-700 specifically" gets `#d4d4d8` in dark mode, which is intended for *body text on dark*, not whatever the component meant.
- **Rule:** Components MUST use only semantic utilities (`text-text-body`, `text-text-muted`, `text-text-heading`, `bg-bg-page`, `bg-bg-subtle`, `border-divider`, `border-border`, `text-link`, `text-danger`, …). The single exception is `--color-code-bg` consumed by `.prose.post-body --tw-prose-pre-bg`. Primitives are palette infrastructure, not application surface.

### `border-border` vs `border-divider` is semantic, not stylistic

- **Symptom:** A new component picks one of `border-border` / `border-divider` based on which name reads better, and the visual weight ends up wrong.
- **Why:** `--color-border` resolves to `neutral-200` (hairline edge — buttons, input boxes, card outlines). `--color-divider` resolves to `neutral-300` (more visible section separator — header/footer rule, list dividers, `<hr>`). They were briefly identical in an earlier draft; they are intentionally different now.
- **Rule:** Use `border-divider` for horizontal/vertical separators between logical sections. Use `border-border` for the edge of an interactive surface (button, input, card). When in doubt, divider — that is the project default.

## Conventions

### Token tier ownership

| Tier | Examples | Where it lives | Who reads it |
|---|---|---|---|
| Primitive — neutral | `--color-neutral-0` … `--color-neutral-900` | `@theme` (light), `.dark` override | Only semantic tokens. NEVER components. |
| Primitive — accent | `--color-accent-50` … `--color-accent-700` | `@theme` only — light-invariant | Only semantic tokens. NEVER components. |
| Semantic | `--color-bg-page`, `--color-text-body`, `--color-link`, `--color-danger`, … | `@theme` (light), `.dark` override (link only) | All components, all pages, `@layer base`, `.prose.post-body` |

### Semantic token naming uses the long form

ALWAYS name semantic tokens with the role-doubled prefix even when it reads repetitively: `--color-bg-page`, `--color-text-body`, `--color-bg-subtle`. The resulting utility names are `bg-bg-page`, `text-text-body` — visually redundant but unambiguous about the token's role. Short names (`--color-page`, `--color-body`) were considered and rejected because `bg-page` collides with the mental model of "page = a route file".

### Dark mode flips only what diverges

The `.dark` block MUST override only:
- All 8 neutral steps (Zinc 0–900 → Zinc 950→50 inverse).
- `--color-link` (accent-700 → accent-400) and `--color-link-hover` (accent-600 → accent-500).
- The shadow tokens `--shadow-xs`…`--shadow-lg` (black shadows vanish on dark surfaces → white hairline + deeper shadow). `--shadow-focus` is NOT overridden — accent is light-invariant.

Accent primitives (`--color-accent-*`) stay identical in both modes — the Teal palette is light-invariant by design. Semantic tokens that derive from neutrals/accents do not need their own dark override because they re-resolve through the overridden primitives. NEVER duplicate the dark override at the semantic layer; that creates two places to update.

### Forward-looking tokens are defined but unused

The following tokens are intentionally defined for upcoming work even though no current component consumes them. Do NOT prune as YAGNI:

| Token | Reserved for |
|---|---|
| `--color-success`, `--color-warning` | Future status surfaces (success banners, warning toasts) |
| `--color-focus-ring` | Universal `:focus-visible` outline — see #147 (motion/focus tokens) |
| `--color-link-hover` | Hover state on links — wired in #147 |
| `--color-bg-surface` | Card/elevated surface — wired in #149 (layout container) and #152 (main page) |
| `--color-accent-50` | Subtle accent surface (hover backgrounds, info banners) |

If a forward-looking token is still unused after its referenced issue closes, that issue did not complete its acceptance criteria — fix the issue, do not remove the token.

### Hardcoded colors are forbidden outside `@theme` and `highlight.css`

NEVER add a hex literal in a component, page, or `@layer components/base` block. The only sanctioned hardcoded colors are:
- The primitive scale values inside `@theme` (the palette source of truth).
- `styles/highlight.css` syntax-highlight tokens (kept outside the Tailwind cascade — see [styling-gotchas.md](styling-gotchas.md) §"`highlight.css` is intentionally outside the Tailwind cascade").
- `--color-code-bg: #212836` (a brand-specific code background that is neither Zinc nor Teal).

If a new color is needed, add it as a primitive (if it's a palette extension) or as a semantic token (if it expresses an intent). NEVER inline it.

## Rationale

The "trustworthy minimal" tone target ruled out the legacy GitHub blue + pure-black approach. Zinc was chosen over Slate/Gray for the neutral scale because its slight warm tint reads less clinical at typography sizes. Teal (Tailwind's stock teal scale) was chosen as the accent because (a) it is distinct from any common framework default, (b) its 400/700 split lands in the AA-passable contrast band against both white and Zinc-950 with no exotic gamma adjustments, and (c) the same hue works in both modes — only luminance shifts. The semantic-over-primitive split exists to make future token swaps (e.g., trying Cyan instead of Teal) a single-file edit.

The one-shot legacy-token cutover (no `--color-theme-*` aliases retained) was deliberate per the issue: aliases lengthen the migration tail and accumulate dead code. The `rg "*-theme-*"` sweep is the safety net; CI lint does not catch a phantom utility class.

## Related

- [styling-gotchas.md](styling-gotchas.md) — the Tailwind v4 `@theme` setup these color tokens live in.
- [typography-system-gotchas.md](typography-system-gotchas.md) — sibling token system (font families + type scale) in the same `@theme` block.
- [dark-mode-toggle-gotchas.md](dark-mode-toggle-gotchas.md) — the `.dark` class strategy that flips these tokens, plus FOUC/`theme-color`/hydration traps.
