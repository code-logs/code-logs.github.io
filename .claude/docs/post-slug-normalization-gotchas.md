# Post Slug Normalization Gotchas

Read this when: editing `utils/PostUtil.ts` `normalizeTitle` / `buildLinkURLByTitle`, adding a post whose title contains punctuation, or debugging post-detail 404s on GitHub Pages.

## Overview

`PostUtil.normalizeTitle` is the single source of truth for post slugs. Every consumer (`getStaticPaths`, `findByTitle`, `findByNormalizedTitle`, sitemap matcher, internal link builders) goes through it, so a one-line change here shifts every URL the site emits. Two failure modes dominate: leaving truly URL-breaking characters in the slug, and stripping characters aggressively enough to change slugs of already-published posts.

## Pitfalls

### Reserved URL chars in titles produce 404 on the static export

- **Symptom**: a post whose title contains `?`, `#`, `/`, `\`, or `%` (e.g. `Harness Engineering이 뭐지?`) builds a file like `…뭐지?.html` under `./docs/`, but the dev server and GitHub Pages return 404 when navigating to it.
- **Why**: `?` is parsed as the query-string delimiter by every HTTP server before any file lookup happens, so `/슬러그?` can never reach the file `슬러그?.html`. `#` is dropped from the request before it leaves the browser. `/` and `\` are path separators. `%` triggers percent-decoding ambiguity (`%3F` decodes back to `?`).
- **Rule**: `normalizeTitle` MUST strip `[?#/\\%]` before lowercasing. Do not extend this set without first auditing existing post titles — see the backward-compatibility pitfall below.

### Whitelist normalization breaks backward compatibility on live posts

- **Symptom**: switching `normalizeTitle` to a `[^a-z0-9가-힣-]`-style whitelist changes the slug for already-published posts that contain `(`, `)`, `:`, `|`, `+`, `,`, etc. After deploy, those posts return 404 because the emitted filename no longer matches indexed URLs and external links.
- **Why**: those characters are not URL-reserved in path position and the existing GitHub Pages routing serves files containing them. The bug is specific to `?#/\\%`. A whitelist trims everything else as collateral damage.
- **Rule**: ALWAYS use a denylist (`[?#/\\%]`) rather than a whitelist when extending normalization. Before adding any character to the denylist, run the audit script (see Conventions) over `config/posts.config.ts` and confirm zero slug changes.

### `<CommonMeta url={...}>` must apply percent-encoding

- **Symptom**: canonical URL in the post detail page's `<link rel="canonical">` contains raw non-ASCII characters or other unencoded bytes; some crawlers reject it.
- **Why**: building the URL as `` `${baseURL}/${normalizeTitle(title)}` `` skips the `encodeURIComponent` step that `buildLinkURLByTitle` performs. `normalizeTitle` returns a Unicode slug — it does not percent-encode.
- **Rule**: ALWAYS build absolute post URLs as `` `${blogConfig.baseURL}${PostUtil.buildLinkURLByTitle(post.title)}` `` (no extra `/` — `buildLinkURLByTitle` already returns a leading slash). NEVER concatenate `normalizeTitle` directly into an absolute URL.

### Empty-slug edge case is intentionally unhandled

- **Symptom**: a hypothetical title made entirely of stripped chars (e.g. `???`) normalizes to an empty string, and `getStaticPaths` then emits `/`, colliding with the root index. Next.js would surface this as a duplicate-path build error.
- **Why**: no live post hits this case; adding a guard would be dead code today.
- **Rule**: if `pnpm run build` ever reports duplicate paths or an empty slug, add an explicit guard in `normalizeTitle` (throw or use a fallback slug). Treat that build error as the trigger to revisit this decision — do NOT pre-empt it.

## Conventions

- The denylist `[?#/\\%]` is the **only** character set `normalizeTitle` strips. Adding any other character is a backward-compatibility decision and MUST be preceded by an audit pass against `config/posts.config.ts`.
- Audit recipe (run before extending the denylist):
  ```sh
  node --experimental-strip-types -e "
    const newNorm = (t) => t.replace(/\s/g, '-').replace(/<NEW_REGEX>/g, '').toLowerCase();
    const oldNorm = (t) => t.replace(/\s/g, '-').replace(/[?#\/\\\\%]/g, '').toLowerCase();
    import('./config/posts.config.ts').then(({ default: posts }) => {
      const diffs = posts.filter(p => oldNorm(p.title) !== newNorm(p.title));
      console.log(diffs.length === 0 ? 'OK' : diffs);
    });
  "
  ```
  Any non-empty `diffs` output blocks the change.
- Absolute post URLs (canonical, OG, share links) MUST go through `PostUtil.buildLinkURLByTitle`. If a second call site for the full pattern `` `${baseURL}${buildLinkURLByTitle(...)}` `` appears, extract a `PostUtil.buildCanonicalURL(post)` helper at that point — not before (one call site is YAGNI).
- The denylist set MUST stay aligned with the basename-matching invariant in [`sitemap-generation-gotchas.md`](sitemap-generation-gotchas.md). Both sides go through `normalizeTitle`, so any change here propagates to sitemap post matching automatically.

## Rationale

The bug pattern that triggered this document was a title ending in `?`. The instinct fix — switch to a whitelist of "obviously safe" characters — broke 7 live posts whose slugs contained `(`, `)`, `:`, `|`, `+`, or `,`. None of those characters actually break HTTP routing or GitHub Pages file serving; only the 5 in the denylist do. The conservative denylist is the minimum change that fixes the bug while preserving every existing URL.
