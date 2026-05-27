# Playwright Testing Gotchas

Read this when: setting up or extending Playwright e2e tests, debugging flaky mobile tests, or choosing between test scope/coverage strategies.

## Overview

Playwright is used as a rendering verification tool (not regression testing) to validate component behavior on mobile viewports where direct browser viewing is unavailable. Issue #209 introduced the first e2e test suite (`tests/mobile-hamburger.spec.ts`) targeting the mobile hamburger menu. This doc captures patterns, traps, and decisions made during that implementation.

## Pitfalls

### Containing-block bugs are invisible in static export
- **Symptom:** A component looks correct in `pnpm dev` and `pnpm build` output, but a mobile test reveals unintended clipping, backdrop coverage loss, or overflow.
- **Why:** `position: fixed` containing blocks are shaped by ancestor `backdrop-filter`, `transform`, `filter`, or `will-change` — invisible in screenshots but fatal to overlay positioning. Static HTML doesn't reveal these at inspection time. This is exactly how issue #210 surfaced: the header's `backdrop-filter` trapped the mobile sheet's `fixed` overlay in the header box.
- **Rule:** ALWAYS test mobile overlays (sheets, modals, popovers) with Playwright before merging. Even small CSS changes to ancestor elements (e.g., adding blur to a header) can break all fixed-position children. The fix is usually to render the overlay through a portal to `document.body` (escaping the containing block) rather than removing the ancestor effect — see [header-interaction-gotchas.md](header-interaction-gotchas.md) §"`MobileSheet` MUST render through a portal".

### iPhone 13 preset defaults to WebKit
- **Symptom:** `devices['iPhone 13']` works in Playwright docs, but test fails with "Executable doesn't exist" for WebKit.
- **Why:** Playwright's device presets define their default browser engine. iPhone 13 → WebKit. If only chromium is installed (for cost), the engine must be overridden.
- **Rule:** In `playwright.config.ts`, always explicitly set `browserName: 'chromium'` (or your chosen engine) in the device object when installation is limited to one browser. Do not rely on preset defaults if you have installed fewer than all engines.

### Animation timing is hard-coded; changes break tests
- **Symptom:** `page.waitForTimeout(400)` was added to wait for slide transition, but a future CSS change to `--duration-slow` invalidates the hardcoded value.
- **Why:** Playwright tests cannot evaluate CSS variables; they hardcode durations. Future maintainers won't know to sync the magic number when animation timing changes.
- **Rule:** Add a comment in the test linking to the CSS variable or config value (e.g., "Sync with `--duration-slow` in `globals.css`"). Or, consider extracting animation timing to a shared test config file if it becomes a pattern.

### Port 3000 may already be in use
- **Symptom:** `pnpm run test:e2e` hangs or fails because port 3000 is already claimed by a running `pnpm dev` server.
- **Why:** `webServer.reuseExistingServer` defaults to true, which works if the server is already running, but fails silently or hangs if the intended server isn't listening on the expected port.
- **Rule:** In `playwright.config.ts`, set `reuseExistingServer: !process.env.CI` so local runs reuse an existing server (faster) but CI always spawns a fresh one. If you change the port, update both `PORT` and `BASE_URL` constants.

### Accessibility selectors are more stable than class selectors
- **Symptom:** A test using `querySelector('.button-close')` breaks when a designer refactors the class name, but a test using `getByRole('button', { name: 'Close menu' })` survives the refactor.
- **Why:** CSS class names are implementation details; aria attributes and semantic roles are contracts between component and user.
- **Rule:** Prefer `getByRole`, `getByLabel`, `getByText` over DOM queries. Selectors should reflect user-facing contracts (what can a user interact with and how do they find it), not CSS structure.

### `test.fixme()` is a tool for "right behavior, known bug"
- **Symptom:** Three test cases verify correct behavior, but the current implementation has a CSS bug preventing them from passing. Should we skip the tests entirely, or leave them to rot?
- **Why:** `test.fixme()` is exactly the signal needed: "This test documents what *should* happen, the implementation is currently broken, fix the implementation and change `fixme` to `test` later."
- **Rule:** When a test failure is due to a bug in the component (not the test), mark it `test.fixme()` with a detailed comment explaining the bug and linking to the issue. Update the issue reference if the bug issue number changes. When the bug is fixed, flip `test.fixme` back to `test` and replace the "known bug" comment with a one-line note of how it was resolved. (The three #210 cases — Escape-close, backdrop-click-close, no horizontal overflow — were restored this way once the sheet was portaled to `document.body`.)

## Conventions

### Directory and file layout
- Tests live in `tests/` at the project root (not colocated with components).
- Test files use the pattern `{feature}.spec.ts` (e.g., `mobile-hamburger.spec.ts`).
- Screenshot outputs go to `test-results/` (git-ignored, not committed).

### Selector helper functions
For tests with repeated selectors, define const helpers at the top of the file:
```typescript
const hamburger = (page: Page) => page.getByRole('button', { name: 'Open menu' })
const sheet = (page: Page) => page.getByRole('dialog', { name: 'Navigation menu' })
```
This keeps tests readable and makes selector changes centralized. As test count grows, consider a shared selectors module.

### Viewport and device strategy
- Mobile tests use `devices['iPhone 13']` preset with chromium engine (not WebKit).
- This covers 390px width (< 768px Tailwind `md:` breakpoint), ensuring mobile-only UI paths are tested.
- Overlay tests MUST run on mobile to catch containing-block bugs invisible at desktop widths.

### Screenshot strategy
- Screenshots are for **visual verification only**, not regression comparison.
- Use `page.screenshot({ path: 'test-results/...', fullPage: true })` during test-only exploration.
- Do NOT commit snapshots or use `toHaveScreenshot()` (would require baseline snapshots).
- Instead, manually inspect screenshot output to confirm the visual bug exists, then file a separate issue.

### Async/await discipline
- Always `await` element visibility: `await expect(sheet(page)).toBeVisible()` waits up to 5000ms (default timeout).
- For animations, add `page.waitForTimeout(ms)` AFTER the action that triggers the animation, documented with a CSS variable reference.
- For element-at-point hit tests, use `page.evaluate()` to run JS in the browser context (DOM state as seen by the user).

## Rationale

Playwright was introduced (issue #209) to solve a specific problem: verifying mobile layout without direct browser access. The choice of chromium-only installation + iPhone 13 preset balances coverage (390px width hits the `md:` breakpoint) with cost (one browser binary). Accessibility selectors were chosen to make tests less brittle than class selectors — a test that verifies "the close button exists and is findable" survives CSS refactors better than one that relies on a specific class name. Screenshot validation (not snapshot comparison) provides visibility into bugs without requiring maintenance of baseline images.

## Related

- [`header-interaction-gotchas.md`](header-interaction-gotchas.md) — Mobile sheet focus trap / scroll lock / keyboard handling — the component being tested.
- [`styling-gotchas.md`](styling-gotchas.md) — Tailwind tokens, media queries, dark mode — foundation for layout testing.
- Issue [#209](https://github.com/code-logs/code-logs.github.io/issues/209) — Initial Playwright e2e testing introduction.
- Issue [#210](https://github.com/code-logs/code-logs.github.io/issues/210) — Backdrop-filter containing-block bug discovered via Playwright testing, resolved by portaling the mobile sheet to `document.body` (see [header-interaction-gotchas.md](header-interaction-gotchas.md)).
