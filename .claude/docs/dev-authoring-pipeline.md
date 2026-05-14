# Dev-Only Authoring Pipeline Gotchas

Read this when: working on `pages/dev/`, `pages/api/dev/`, `utils/dev/`, `next.config.js` `pageExtensions`, or the Codex-backed post authoring flow.

## Overview

The dev authoring pipeline is a local-only UI (`/dev/authoring`) that calls the `codex` CLI to draft post content and then publishes it by mutating `config/posts.config.ts` and writing the markdown file. All pages and API routes participating in this flow use the `.dev.tsx` / `.dev.ts` suffix convention to be stripped from production builds.

## Pitfalls

### `output: 'export'` must be production-only or dev breaks at startup

- **Symptom**: `next dev` crashes immediately with `API Routes cannot be used with "output: export"`, blocking the whole dev server (not just the dev API routes).
- **Root cause**: Next.js 15 enforces the `output: 'export'` / `pages/api/*` incompatibility at startup, before any build. Even though API routes never run during `next dev`, simply having `output: 'export'` set rejects the presence of any `pages/api/*` file.
- **Rule**: `next.config.js` MUST set `output: 'export'` only when `NODE_ENV === 'production'` (see the `isDev` ternary at the top of the file). `pnpm run build` and `pnpm run docs` run under `NODE_ENV=production` and still emit the static export. NEVER set `output: 'export'` unconditionally as long as `pages/api/dev/*` exists.

### `pageExtensions` alone does NOT exclude `.dev.tsx` files from production

- **Symptom**: a route like `/dev/authoring.dev` appears in the static export.
- **Root cause**: `pageExtensions` filters which extensions Next.js recognizes as page files. Setting it to exclude `.dev.tsx` in production prevents the route from appearing at a clean URL — but Next.js still resolves the raw `*.dev.tsx` filename and can emit a page for it.
- **Fix**: the `NormalModuleReplacementPlugin` in `next.config.js` swaps every `*.dev.tsx` / `*.dev.ts` module for an empty stub during production webpack compilation. This is the load-bearing exclusion. Both mechanisms must stay in place together.
- **Belt-and-suspenders**: `getStaticProps` in `pages/dev/authoring.dev.tsx` returns `{ notFound: true }` when `NODE_ENV !== 'development'`, and the API routes return `405` for the same check. These guards catch the case where someone manually overrides `pageExtensions`.
- **Artifact cleanup**: Next.js still creates an empty `./docs/dev/` directory during static export. The `docs` npm script runs `rm -rf ./docs/dev` after the build to remove it.

### Category KEY vs VALUE — directory name != metadata value

- **Symptom**: `PostConfigWriter` writes the wrong category string into `posts.config.ts`, causing a post to be invisible or mis-routed.
- **Root cause**: `CATEGORIES` maps hyphenated keys to display values, e.g. `CATEGORIES['react-native'] === 'react native'`. The directory on disk uses the KEY (`posts/react-native/`), but the `category` field in the `Post` metadata stores the VALUE (`'react native'`).
- **Fix**: `PostConfigWriter.getCategoryDir` reverses the map lookup to derive the correct directory from any given category value. NEVER write the category key directly into the metadata or the category value directly into the file path.

### `posts.config.ts` string surgery requires a precise file tail

- **Symptom**: `PostConfigWriter` throws at runtime with an assertion error, refusing to mutate the config.
- **Root cause**: the writer appends to the `posts` array by locating the exact tail `]\n\nexport default posts\n`. If the file ends differently (trailing whitespace, different export style, extra blank lines), the assertion fails.
- **Rule**: NEVER reformat the tail of `config/posts.config.ts` by hand or with a code formatter that changes that pattern. ALWAYS verify the assertion still holds after any manual edit to the file.

### `codex` is a system binary, not an npm dependency

- **Symptom**: `ENOENT` or "command not found" when the authoring API route spawns the Codex process.
- **Root cause**: `CodexClient` calls `child_process.spawn('codex', ...)`. `codex` must be installed globally and on `$PATH` as a system binary. It is deliberately absent from `package.json`.
- **Rule**: NEVER add `codex` as a project npm dependency. Before using the authoring page, run `codex login` once. Confirm it is reachable with `which codex`.

### `generate-post` request body splits topic from additional instruction

- **Symptom**: `POST /api/dev/generate-post` returns 400 with "topic is required".
- **Root cause**: the request body is `{ topic: string, additionalInstruction?: string }`. The server reassembles the full prompt with `buildAuthoringPrompt({ today, topic, additionalInstruction })` — the client never sends a full prompt string.
- **Rule**: NEVER let the client send the full prompt. The Core template (style rules, workspace layout, schema constraints) is server-owned and must not be user-editable. Only `topic` (required) and `additionalInstruction` (optional) come from the client.

### Default prompt MUST reference workspace paths, NEVER embed data dumps

- **Symptom**: prompt length balloons as more posts and thumbnails are added; every new asset requires reassembling and re-sending the prompt to keep Codex current.
- **Root cause**: embedding the full CATEGORIES map, every published post's metadata, and every thumbnail filename inline makes the prompt a snapshot that goes stale the moment any of those change.
- **Rule**: `buildAuthoringPrompt()` MUST reference paths (`config/posts.config.ts`, `public/assets/images/`, `posts/<category-key>/`) and tell Codex to read them itself. Codex runs with `--sandbox workspace-write` and has read access to the project root, so it can resolve live state on every run. NEVER reintroduce inline catalog/thumbnail dumps in the default prompt.

### Codex output schema — Node-side validation is defense-in-depth, not optional

- **Symptom**: downstream code receives a partial or malformed post draft and silently produces a broken `posts.config.ts` entry.
- **Root cause**: `--output-schema` constrains Codex output at the model layer, but schema enforcement is probabilistic, not guaranteed.
- **Rule**: `generate-post.dev.ts` MUST validate the response against the same JSON Schema defined in `utils/dev/types.ts` before returning data to the client. Do not remove or weaken this validation in the belief that `--output-schema` is sufficient.

### Markdown HTML must be sanitized before `dangerouslySetInnerHTML`

- **Symptom**: a malicious `<script>`, event handler, or `javascript:` URL in markdown body executes when the post renders.
- **Root cause**: `marked()` passes raw HTML in markdown through unchanged. Codex output and user edits in the authoring page are untrusted inputs that share the same render path as production posts.
- **Rule**: BOTH `utils/MarkdownUtil.ts` (production post render via `getStaticProps`) AND `pages/dev/authoring.dev.tsx` (dev preview) MUST run `DOMPurify.sanitize(marked(md))` before injecting into `dangerouslySetInnerHTML`. The `isomorphic-dompurify` package handles both Node and browser environments. NEVER inject `marked()` output directly.

### Thumbnail path-traversal containment applies to every writer

- **Symptom**: a crafted filename (whether from a `reuseFileName` field or a Codex-generated output) could escape `public/assets/images/` and read or overwrite arbitrary files.
- **Root cause**: user- or model-supplied names are joined directly to the image directory path.
- **Rule**: BOTH `ThumbnailResolver` AND `ImageGenerator` MUST check that `path.resolve(IMAGES_DIR, fileName)` starts with `path.resolve(IMAGES_DIR) + path.sep` before reading or writing. NEVER bypass this check. The deterministic-name rule in the next pitfall reduces but does not eliminate this risk — keep the containment guard regardless.

### `$imagegen` outputs MUST use a deterministic filename owned by the caller

- **Symptom**: Codex saves the generated image to an arbitrary filename or path; the publish step then either misses it or accepts an attacker-controlled name into `posts.config.ts`.
- **Root cause**: Codex chooses the output filename freely when only given an image description.
- **Rule**: `ImageGenerator.generateThumbnail()` MUST compute the target filename from `<fileName-without-.md>.png` and inject that exact path into the Codex prompt as the required save location. The output JSON Schema MUST require `savedFileName` to equal that deterministic name; mismatch is a hard error. Additionally, the file MUST exist on disk and be non-empty (`fs.statSync(path).size > 0`) after the call — empty or missing files trigger an error and trigger fallback. NEVER trust an arbitrary `savedFileName` Codex returns.

### `$imagegen` runs in a second Codex call and needs ≥10 minutes

- **Symptom**: the image generation call times out after the default 5 minutes, especially for series-consistent images or first-use cold starts.
- **Root cause**: `gpt-image-2` with reasoning can take several minutes per image, and the metadata-generation 1st call already consumed time before the 2nd call starts.
- **Rule**: `ImageGenerator` MUST call `runCodex({ ..., timeoutMs: 600_000 })` (10 minutes). NEVER share `runCodex`'s default 5-minute timeout for image generation. If the call times out, the API route MUST return HTTP 200 with `thumbnailGenerationError` set, NOT a 5xx — the metadata draft is still valid and the client falls back to manual upload.

### Series visual consistency is the only contract that drives image style

- **Symptom**: a new post in an existing series gets a thumbnail with a wildly different visual style than its siblings.
- **Root cause**: Codex has no awareness of cross-post visual continuity unless explicitly told.
- **Rule**: When `metadata.series` is set, `SeriesResolver.collectSeriesThumbnails()` MUST walk the prev and next chains separately, collect every existing member's `thumbnailName`, and the resulting list MUST be injected into the `$imagegen` prompt as "match the style/palette/composition/typography/illustration tone of these reference images." A cycle-safe `visited` set prevents infinite loops; missing titles are silently skipped (Codex can fabricate prev/nextPostTitle values that don't resolve).

### `series` field MUST round-trip from generation to `posts.config.ts`

- **Symptom**: a series post is authored and published successfully but `series.prevPostTitle` / `nextPostTitle` is missing from the new entry in `posts.config.ts`, silently breaking prev/next navigation.
- **Root cause**: the `series` field can be dropped at any of three handoff points — codex JSON Schema, client-side `buildMetadata()`, or `PostConfigWriter.serializeEntry()`.
- **Rule**: ALL THREE layers MUST preserve `series`:
  - `GENERATED_POST_JSON_SCHEMA.metadata.series` is nullable but listed in `required` (OpenAI structured-output convention).
  - The authoring page's `buildMetadata()` MUST include the `series` state in its return.
  - `PostConfigWriter.serializeEntry()` MUST emit a `series: { ... }` block when at least one endpoint is set.
  If you add another metadata field with the same shape (optional, nested), thread it through all three layers explicitly.

## Conventions

### File placement

| Concern | Location |
|---|---|
| Dev-only pages | `pages/dev/*.dev.tsx` |
| Dev-only API routes | `pages/api/dev/*.dev.ts` |
| Server-only Node modules (dev) | `utils/dev/` |

NEVER import anything from `utils/dev/` in a client component or non-dev page. These modules use `child_process` and other Node-only APIs that will break the client bundle.

### Prompt assembly flow

The Core template is server-owned. Only TOPIC and ADDITIONAL INSTRUCTIONS slots are user-editable.

1. **Core preview** (`GET /api/dev/default-prompt`): returns `buildAuthoringPrompt({ today })` with placeholder strings in the TOPIC and ADDITIONAL INSTRUCTIONS slots. Used for the read-only reference panel in the UI. `Cache-Control: no-store`.
2. **Generation** (`POST /api/dev/generate-post`): client sends `{ topic, additionalInstruction? }`. Server reassembles via `buildAuthoringPrompt({ today, topic, additionalInstruction })` and passes the result to Codex.

The `topic` and `additionalInstruction` parameters are both optional in the function signature so the GET preview path can render placeholders; the POST handler enforces `topic` non-empty at the API layer.

### Codex CLI invocation

The canonical spawn arguments are:

```
codex exec --json --skip-git-repo-check --sandbox workspace-write --output-schema --output-last-message -
```

`--skip-git-repo-check` prevents Codex from failing when run outside a git repo root. `--sandbox workspace-write` restricts filesystem writes to the workspace. `--output-last-message` returns only the final model turn. NEVER omit `--json`; the response parser in `CodexClient` expects NDJSON.

### Thumbnail resolution flow

Three terminal outcomes; the publish endpoint sees only the first two:

1. **`reuse` (auto-generated, downgraded)**: Codex returned `mode: 'generate'`, `ImageGenerator` succeeded, and `generate-post.dev.ts` overwrote the thumbnail with `{ mode: 'reuse', reuseFileName: '<slug>.png' }`. The response also carries `thumbnailAutoGenerated: true` for the UI badge. Publish takes the standard `reuse` path.
2. **`reuse` (user-picked)**: Codex chose `reuse` in the first place, or the user manually picked a filename in the UI. Publish validates the file exists.
3. **`generate` (manual upload fallback)**: `ImageGenerator` failed (timeout, permission, etc.); the response carries `thumbnailGenerationError`. The UI surfaces the error and a "수동 업로드로 대체" (Replace with manual upload) button; once the user uploads, publish receives `thumbnailBase64`/`thumbnailMimeType` and writes the file via `ThumbnailResolver`.

`ImageGenerator` lives entirely server-side and writes directly to `public/assets/images/` via Codex's `--sandbox workspace-write` permission — the client never sees the binary.

## Rationale

The `.dev.tsx` / `.dev.ts` dual-mechanism approach (webpack plugin + `pageExtensions` + runtime `notFound`) was chosen because no single Next.js mechanism is sufficient to guarantee exclusion from a `output: 'export'` static build. The webpack plugin is the primary gate; the rest are belt-and-suspenders for defense-in-depth.
