# Code Logs - v2

[![Deploy](https://github.com/code-logs/code-logs.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/code-logs/code-logs.github.io/actions/workflows/deploy.yml)

개인 기술 블로그. GitHub Pages 정적 export로 운영됩니다.

## Stack

- Next.js 15 (Pages Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config)
- GitHub Pages 정적 export (`output: 'export'`)

## Prerequisites

- **Node 22** — `.nvmrc`에 핀 되어 있음
- **Corepack** — `package.json`의 `packageManager` 필드 기반으로 pnpm 버전을 자동 부트스트랩

## Getting started

```bash
nvm use            # .nvmrc 기반 Node 22
corepack enable    # packageManager 필드 기반 pnpm 자동 활성화 (머신당 1회)
pnpm install
pnpm run dev       # http://localhost:3000
```

## Available scripts

모든 스크립트는 `pnpm run <script>` 형태로 실행합니다. bare `pnpm <script>`는 pnpm 내장 서브커맨드(`docs`, `licenses` 등)와 충돌하므로 피합니다.

| Script | 설명 |
|--------|------|
| `pnpm run dev` | Next.js dev 서버 |
| `pnpm run build` | 프로덕션 빌드 (정적 export, `./out`) |
| `pnpm run docs` | 전체 export 파이프라인 — clean → build → `./out` → `./docs` 이동 → `.nojekyll` → sitemap |
| `pnpm run sitemap` | 빌드된 `./docs`를 대상으로 sitemap 생성 |
| `pnpm run lint` | ESLint (flat config) |
| `pnpm run licenses` | `public/licenses.json` 재생성 |

## Adding a post

포스트는 두 곳에 동시 등록되어야 노출됩니다.

1. 본문: `posts/<category>/<file>.md`
2. 메타: `config/posts.config.ts`의 `posts` 배열에 `Post` 엔트리 추가 — `title`, `description`, `category`(`CATEGORIES` 키), `published`, `publishedAt`, `thumbnailName`, `tags` 등

`config/posts.config.ts`에 항목이 없거나 `published: false`이면 빌드 결과에서 제외됩니다. 카테고리 키는 `posts/` 하위 디렉터리명과 일치해야 합니다. 상세 동작(빌드 시 routing, sitemap 흐름 등)은 [CLAUDE.md](./CLAUDE.md)의 "Post pipeline" 섹션을 참고하세요.

## Deployment

`main` 브랜치에 push되거나 수동으로 `workflow_dispatch`를 실행하면 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)이 `pnpm run docs`를 실행하고, 생성된 `./docs` 디렉터리를 GitHub Pages artifact로 업로드해 배포합니다. GitHub Pages는 **Source = "GitHub Actions"** 설정으로 이 artifact를 서빙합니다.

> **`./docs` 디렉터리는 빌드 산출물입니다. 수동으로 편집하지 마세요** — 다음 `main` push 때 CI가 덮어씁니다. 소스만 수정하고 CI가 재생성하도록 둡니다.

## Project docs

- [CLAUDE.md](./CLAUDE.md) — 아키텍처, post 파이프라인, 라우팅 컨벤션, 환경 변수 등
- [.claude/docs/index.md](./.claude/docs/index.md) — 빌드 파이프라인 / 스타일링 / 아이콘 라이브러리 등 누적된 작업 노트
- [.claude/docs/build-pipeline-gotchas.md](./.claude/docs/build-pipeline-gotchas.md) — 빌드/배포 설정 변경 전 반드시 확인할 함정 모음
