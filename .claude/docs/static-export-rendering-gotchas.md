# Static Export Rendering Gotchas

Read this when: adding or editing any page under `pages/` that references a value derived from the host runtime — current date/time, random numbers, environment-specific state — or adding any computation at module scope or in the component body that could be evaluated at both build time and hydration time.

## Overview

The site builds with `output: 'export'` (Next.js 15 Pages Router) and is served as plain static HTML by GitHub Pages. Each page is pre-rendered to HTML once at build time, then the client hydrates that HTML with the same React tree. Anything that evaluates differently between the build-time render and the client hydration render becomes (1) a React hydration mismatch warning in dev, (2) a visible stale-vs-fresh discrepancy in production after the HTML ages, and (3) a permanently stale value to JS-less crawlers.

## Pitfalls

### `new Date()` / `Date.now()` at module scope or in the component body drifts between build and hydration

- **Symptom:** A page shows a date-derived value (current year, "X년차", "N days ago"). The HTML served by GitHub Pages keeps showing the value baked at the last CI build; once the calendar advances past the next boundary (new year, day rollover), the client hydration re-evaluates `new Date()` to a fresh value and React logs a hydration mismatch in dev. JS-less crawlers see only the stale HTML value forever.
- **Why:** Module-scope code and component-body code execute in two contexts under `output: 'export'`: the Node build process (its result is baked into the static HTML) and the client bundle at hydration. The two evaluations of `new Date()` / `Date.now()` see different clocks. Static export has no per-request server render to reconcile them.
- **Rule:** Compute time-dependent values inside `getStaticProps` and pass them down as props. `getStaticProps` runs only at build time, is stripped from the client bundle, and feeds the same value into the HTML and the hydrated tree.

## Conventions

- ALWAYS source build-time-constant values (current year, computed offsets from a fixed start year, build timestamp) from `getStaticProps`, never from module scope or the component body.
- NEVER call `new Date()` or `Date.now()` outside `getStaticProps` for values that must match the static HTML. The exception is values that are intentionally client-only (e.g., the visitor's local clock), which MUST be guarded behind `useEffect` with an initial empty/placeholder state so the first paint matches the HTML.
- ALWAYS type the prop contract with `GetStaticProps<Props>` so the build-time-to-component handoff is checked.
- The same rule applies to `Math.random()` and any other non-deterministic source: pin it in `getStaticProps` or push it strictly client-side behind `useEffect`.

## Examples

```tsx
// ❌ Wrong — module-scope evaluation drifts between build HTML and hydration.
const CAREER_START_YEAR = 2015
const CAREER_YEARS = new Date().getFullYear() - CAREER_START_YEAR

const About = () => <p>현재 {CAREER_YEARS}년차입니다.</p>
export default About
```

```tsx
// ✅ Right — pinned at build time, passed as a prop.
import type { GetStaticProps } from 'next'

const CAREER_START_YEAR = 2015

interface AboutProps {
  careerYears: number
}

const About = ({ careerYears }: AboutProps) => (
  <p>현재 {careerYears}년차입니다.</p>
)

export const getStaticProps: GetStaticProps<AboutProps> = async () => ({
  props: { careerYears: new Date().getFullYear() - CAREER_START_YEAR },
})

export default About
```

## Rationale

The HTML emitted by `next build` under `output: 'export'` is the artifact GitHub Pages serves and the only thing a JS-less crawler ever sees. There is no SSR fallback to reconcile drift, so any value that is not pinned at build time becomes a divergence between the served HTML and the live React tree the moment the host clock advances past a boundary. `getStaticProps` is the only Pages Router hook that runs strictly at build time, stays out of the client bundle, and feeds identical values into HTML and hydration. The originating case is `pages/about/index.tsx` career years — see PR #104 and the fix in PR #105 for the full thread.

For build-pipeline-level concerns around `output: 'export'` (where the output lands, `distDir` interaction, CI deployment), see [build-pipeline-gotchas.md](build-pipeline-gotchas.md).
