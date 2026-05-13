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

### `generate-post` accepts a full prompt string, not a `userInstruction` field

- **Symptom**: `POST /api/dev/generate-post` returns 400 with "prompt must be a non-empty string (min 50 chars)".
- **Root cause**: the request body schema changed from `{ userInstruction: string }` to `{ prompt: string }`. Callers that still send `userInstruction` receive a 400 because the field is no longer read.
- **Rule**: ALWAYS send the full assembled prompt in the `prompt` field. The server does NOT reassemble the prompt — it passes the client-supplied string directly to Codex. The client is responsible for fetching and editing the default prompt via `GET /api/dev/default-prompt` first.

### `GET /api/dev/default-prompt` must return a fresh prompt on every call

- **Symptom**: category list, post catalog, or thumbnail list in the prompt textarea is stale after new posts are published or thumbnails added.
- **Root cause**: the default prompt is assembled at request time from live data (postsDatabase, listThumbnailFiles, today's date). However, the browser will NOT refetch the prompt automatically while the authoring page stays open.
- **Rule**: the endpoint sets `Cache-Control: no-store` to prevent browser caching. Users who need a fresh catalog MUST click "기본값으로 되돌리기" to trigger a re-fetch, which overwrites the textarea. The `today` timestamp embedded in the prompt reflects the server's clock at the time of the last fetch — edits that span midnight will contain a stale date.

### Codex output schema — Node-side validation is defense-in-depth, not optional

- **Symptom**: downstream code receives a partial or malformed post draft and silently produces a broken `posts.config.ts` entry.
- **Root cause**: `--output-schema` constrains Codex output at the model layer, but schema enforcement is probabilistic, not guaranteed.
- **Rule**: `generate-post.dev.ts` MUST validate the response against the same JSON Schema defined in `utils/dev/types.ts` before returning data to the client. Do not remove or weaken this validation in the belief that `--output-schema` is sufficient.

### Markdown HTML must be sanitized before `dangerouslySetInnerHTML`

- **Symptom**: a malicious `<script>`, event handler, or `javascript:` URL in markdown body executes when the post renders.
- **Root cause**: `marked()` passes raw HTML in markdown through unchanged. Codex output and user edits in the authoring page are untrusted inputs that share the same render path as production posts.
- **Rule**: BOTH `utils/MarkdownUtil.ts` (production post render via `getStaticProps`) AND `pages/dev/authoring.dev.tsx` (dev preview) MUST run `DOMPurify.sanitize(marked(md))` before injecting into `dangerouslySetInnerHTML`. The `isomorphic-dompurify` package handles both Node and browser environments. NEVER inject `marked()` output directly.

### ThumbnailResolver path-traversal containment

- **Symptom**: a crafted `thumbnailName` value could escape `public/assets/images/` and read or overwrite arbitrary files.
- **Root cause**: user-supplied thumbnail names are joined directly to the image directory path.
- **Rule**: `ThumbnailResolver` MUST check that `path.resolve(imageDir, thumbnailName)` starts with `path.resolve(imageDir)` before accepting any path. NEVER bypass this check.

## Conventions

### File placement

| Concern | Location |
|---|---|
| Dev-only pages | `pages/dev/*.dev.tsx` |
| Dev-only API routes | `pages/api/dev/*.dev.ts` |
| Server-only Node modules (dev) | `utils/dev/` |

NEVER import anything from `utils/dev/` in a client component or non-dev page. These modules use `child_process` and other Node-only APIs that will break the client bundle.

### Prompt assembly and editing flow

The prompt pipeline has two stages:

1. **Default prompt assembly** (`GET /api/dev/default-prompt`): `buildAuthoringPrompt()` in `utils/dev/AuthoringPrompt.ts` assembles the full prompt from live data (CATEGORIES map, postsDatabase, listThumbnailFiles, today's date). The result is returned as `{ prompt: string }` and displayed in the authoring textarea.
2. **Generation** (`POST /api/dev/generate-post`): the client sends the edited textarea content as `{ prompt: string }`. The server passes it unchanged to Codex. `buildAuthoringPrompt()` is NOT called at generation time.

The `userInstruction` parameter of `buildAuthoringPrompt` is optional; when omitted, the `=== USER INSTRUCTION ===` block contains a placeholder string. The client is responsible for the user filling in that section before submitting.

### Codex CLI invocation

The canonical spawn arguments are:

```
codex exec --json --skip-git-repo-check --sandbox workspace-write --output-schema --output-last-message -
```

`--skip-git-repo-check` prevents Codex from failing when run outside a git repo root. `--sandbox workspace-write` restricts filesystem writes to the workspace. `--output-last-message` returns only the final model turn. NEVER omit `--json`; the response parser in `CodexClient` expects NDJSON.

### Thumbnail v1 scope

- `reuse`: the authoring page accepts an existing `thumbnailName`. `ThumbnailResolver` validates it exists under `public/assets/images/` (with path-traversal check).
- `generate`: falls back to a manual file upload. Automatic image generation is deferred — do not add it without a separate design review.

## Rationale

The `.dev.tsx` / `.dev.ts` dual-mechanism approach (webpack plugin + `pageExtensions` + runtime `notFound`) was chosen because no single Next.js mechanism is sufficient to guarantee exclusion from a `output: 'export'` static build. The webpack plugin is the primary gate; the rest are belt-and-suspenders for defense-in-depth.
