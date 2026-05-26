# Ads / AdSense Rendering Gotchas

Read this when: editing `GoogleAdsenseBanner`, `AsideAdsBanner`, `useIsMobile`, or the 3-column grid layout in `globals.css` / `pages/_app.tsx`.

## Overview

This page documents pitfalls in the AdSense ad rendering system and the `aside` column layout. Both are tightly coupled: the desktop grid determines how wide the aside cell is, and AdSense throws an unhandled exception when that width is insufficient.

## Pitfalls

### AdSense throws `TagError` when slot width < ~125 px — causing Next.js "Application error" fallback

- **Symptom:** First-landing on any page (e.g. `/about`, `/{title}`) shows "Application error: a client-side exception has occurred" instead of content. Reloading usually recovers. Stack trace is entirely inside `adsbygoogle.js` with no React frames.
- **Root cause:** `window.adsbygoogle.push({})` throws `TagError: No slot size for availableWidth=N` when the `<ins>` slot is narrower than ~125 px. Next.js 15 production mode treats any unhandled client-side throw as fatal and replaces the page with an error fallback.
- **Fix:** `GoogleAdsenseBanner` MUST read `insRef.current.offsetWidth` before calling `push()`. If `offsetWidth < MIN_SLOT_WIDTH` (125), skip `push()` entirely. This is already implemented — do not remove this guard.

### Aside cell collapses to ~30–70 px at viewport widths of ~860–1100 px

- **Symptom:** The aside column appears nearly empty or too narrow to render ads.
- **Root cause:** `#__next` uses `grid-template-columns: repeat(3, 1fr)` but `main` has a fixed `width: 768px`. The grid expands the main column to 768 px; the remaining space is split equally between the two flanking columns. At a 900 px viewport: aside ≈ (900 − 768) / 2 ≈ 66 px. At 1100 px: aside ≈ (1100 − 768) / 2 ≈ 166 px (safe).
- **Rule:** NEVER lower `MOBILE_BREAKPOINT` in `hooks/useIsMobile.ts` below 1100 without verifying the aside cell width at the new threshold is ≥ 165 px (125 px slot + 40 px `p-wide` padding).

### `useIsMobile` threshold (1100 px) does not match the CSS mobile breakpoint (800 px)

- **Symptom:** `ContentExplorer` and `AsideAdsBanner` are absent at "clearly desktop" widths (e.g. 900–1099 px).
- **Root cause:** The CSS `@media (max-width: 768px)` breakpoint controls grid layout collapse. The JS `useIsMobile` hook controls whether the aside's React subtree renders at all. These serve different purposes and MUST remain independent. The JS threshold (1100 px) is set to guarantee a safe aside cell width for ads, not to match the CSS layout breakpoint.
- **Rule:** Do NOT assume `useIsMobile` means "phone-sized screen." It means "viewport too narrow for aside content to render safely." Keep both thresholds documented separately.

### Push is called only once on mount — resizing the window does not re-trigger ads

- **Symptom:** If a user loads the page at a narrow viewport (ads skipped), then widens the window, ads still don't appear until a full page reload.
- **Root cause:** `useEffect` with `[]` runs once. Adding a ResizeObserver to re-push ads is out of scope and risks duplicate-push bugs. Reload-on-resize is acceptable given the target audience.
- **Rule:** Do NOT add dynamic re-push logic without understanding AdSense's duplicate-push behavior. A single `push({})` per `<ins>` instance is the correct contract.

## Conventions

- `MIN_SLOT_WIDTH = 125` in `GoogleAdsenseBanner.tsx` — MUST NOT be lowered; 125 px is the empirically observed AdSense minimum for responsive ad slots.
- `MOBILE_BREAKPOINT = 1100` in `hooks/useIsMobile.ts` — MUST NOT be lowered without recalculating aside cell width (formula: `(viewport − 768) / 2 ≥ MIN_SLOT_WIDTH + 40`).
- The only caller of `useIsMobile` is `pages/_app.tsx`. Both the `AsideAdsBanner` and `ContentExplorer` render gates are controlled by the same `isMobile` value — changing the threshold affects both simultaneously.

## Rationale

The 3-column equal-fraction grid with a fixed-width main column is a legacy layout decision. Rather than refactoring the grid (high risk, wide blast radius), the safer fix was a JS-level render gate (`useIsMobile` threshold) backed by a component-level push guard (`MIN_SLOT_WIDTH`). The two layers are complementary: the threshold prevents rendering the aside entirely at unsafe widths, and the push guard is a last-resort safety net for any future caller that bypasses the render gate.

## Related

- [ads-placement-list-pages-gotchas.md](ads-placement-list-pages-gotchas.md) — sibling concern: where `MainAdsBanner` units are placed on list pages and why a standalone banner must not be added next to `PostCardList`. This doc covers *whether an ad can render*; that doc covers *where ads are placed*.
