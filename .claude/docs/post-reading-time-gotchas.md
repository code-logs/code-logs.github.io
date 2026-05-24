# Post Reading Time Gotchas

Read this when: implementing or editing `calculateReadingTime` in `utils/PostServerUtil.ts`, adding reading-time display to any component, or calling any `fs`-based utility from `utils/`.

## Overview

`utils/PostServerUtil.ts` is the only server-only utility file in this project. It estimates post reading time at build time by reading the raw markdown source. Two traps: the Hangul Unicode range boundary, and the server-only import boundary.

## Pitfalls

### Hangul syllable range ends at `힣` (U+D7A3), NOT `힝` (U+D7BD)

- **Symptom:** Reading-time estimates are systematically low (typically 1 min short) for Korean posts. The regex matches silently but misses 6 syllables in the U+D7A4–U+D7BD range.
- **Why:** The Hangul Syllable block is U+AC00–**U+D7A3**. `힝` is U+D7BD, which sits in the Hangul Jamo Extended-B block — a different block with no syllables before D7A3. Using `[ㄱ-힝]` in a regex silently extends the range past the syllable block boundary; the extra range just matches nothing useful, but if a future Unicode assignment fills that gap the result will be wrong in the other direction.
- **Rule:** ALWAYS write `[ㄱ-힣]` (U+3131–U+D7A3). NEVER write `[ㄱ-힝]` or any endpoint beyond `힣`.

### `PostServerUtil` MUST NOT be imported in client components or shared utils

- **Symptom:** Next.js production build fails with `Module not found: Can't resolve 'fs'`, or the client bundle bloats with Node built-ins.
- **Why:** `PostServerUtil.ts` calls `MarkdownUtil.readFileSync` which uses Node's `fs` module. Next.js client bundles do not include `fs`; any import path that reaches `PostServerUtil` from a React component or a shared utility will break the client bundle.
- **Rule:** ONLY call `calculateReadingTime` inside `getStaticProps`. NEVER import `PostServerUtil` from a component file, a shared util, or any file that is transitively imported by a component. The naming convention (`PostServerUtil` vs `PostUtil`) is the signal — files without `Server` in the name are safe for client use.

## Conventions

- `utils/PostUtil.ts` — client-safe post helpers (title normalization, path building, display formatting). Safe to import anywhere.
- `utils/PostServerUtil.ts` — server-only (fs-based). Import ONLY in `getStaticProps` / `getStaticPaths` / build scripts.
- Reading time formula: English words at 200 wpm (whitespace-token count minus estimated Korean-token contribution), Korean characters at 500 chars/min, result clamped to `Math.max(1, Math.ceil(...))`.

## Rationale

The split into a separate `PostServerUtil.ts` file (rather than adding a server-only function inside `PostUtil.ts`) prevents accidental client imports. A single mixed file would require `next/dynamic` exclusions or `server-only` package guards; a separate file makes the boundary obvious by naming convention and file location.
