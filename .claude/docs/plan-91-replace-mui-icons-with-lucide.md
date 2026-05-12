## Implementation Plan: #91 chore(deps): replace MUI icons with lucide-react and drop MUI/Emotion dependencies

### Overview

`@mui/icons-material`을 위해 끌려와 있는 `@mui/material`, `@emotion/react`, `@emotion/styled` 4개 의존성을 모두 제거하고, 코드에서 실제로 사용 중인 6개 아이콘만 `lucide-react`로 교체한다. 추가로 lucide의 svg 크기 규칙은 MUI와 다르므로(`font-size` 미적용), `svg { font-size: ... }`를 사용하는 SCSS 2곳을 `width/height`로 전환해 시각적 회귀를 방지한다.

### Impact scope

| 파일 | 변경 유형 |
|---|---|
| `package.json` | `@mui/icons-material`, `@mui/material`, `@emotion/react`, `@emotion/styled` 제거 / `lucide-react` 추가 |
| `pnpm-lock.yaml` | 의존성 트리 대량 감소 |
| `components/paginator/Paginator.tsx` | MUI 아이콘 3개 → lucide |
| `components/search-input/SearchInput.tsx` | MUI 아이콘 1개 → lucide |
| `config/social.config.tsx` | MUI 아이콘 1개 → lucide (LinkedIn import는 코드에 미사용, 정리) |
| `components/paginator/Paginator.module.scss` | `svg { font-size: 1.5rem }` → `svg { width/height: 1.5rem }` |
| `components/header/Header.module.scss` | `svg { font-size: 24px }` → `svg { width/height: 24px }` |
| `CLAUDE.md` | Architecture 섹션의 MUI 언급 제거 → lucide-react로 갱신 |

### Implementation steps

#### Step 1: `lucide-react` 설치

- Work: `pnpm add lucide-react` 실행
- Files to change: `package.json`, `pnpm-lock.yaml`
- 고려사항: latest stable. Next 15 + React 19와 호환되는 버전 확인

#### Step 2: 아이콘 import 교체

- Work: 6개 import를 lucide-react로 교체
- Files to change:
  - `components/paginator/Paginator.tsx`: `ChevronLeftRounded` → `ChevronLeft`, `ChevronRightRounded` → `ChevronRight`, `MoreHorizRounded` → `MoreHorizontal`
  - `components/search-input/SearchInput.tsx`: `SearchRounded` → `Search` (기존 `className={styles.icon}` 유지)
  - `config/social.config.tsx`: `GitHub` → `Github`. 현재 LinkedIn은 import만 되고 미사용 — import에서 제거
- 고려사항: lucide 아이콘은 `className`, `size`, `color`, `strokeWidth` props를 지원. 현재 코드는 `className`만 사용 중이라 호환

#### Step 3: SCSS 크기 규칙 보정

- Work: `font-size`로 svg 크기를 제어하던 규칙을 `width`/`height`로 변경
- Files to change:
  - `components/paginator/Paginator.module.scss` (line 13–16 영역): `font-size: 1.5rem;` → `width: 1.5rem; height: 1.5rem;`
  - `components/header/Header.module.scss` (line 37–39 영역): `font-size: 24px;` → `width: 24px; height: 24px;`
- 고려사항: lucide svg는 기본 24×24. Paginator는 24px ≈ 1.5rem이라 시각 차이 거의 없음. `color`는 SVG `stroke`/`fill`이 `currentColor`라 그대로 작동

#### Step 4: MUI/Emotion 의존성 제거

- Work: `pnpm remove @mui/icons-material @mui/material @emotion/react @emotion/styled` 실행 후 `pnpm install`
- Files to change: `package.json`, `pnpm-lock.yaml`
- 고려사항: `pnpm.overrides`에 mui/emotion 항목이 남아있다면 함께 정리 (단, #87에서 별도로 다룰 예정이므로 본 이슈에서는 본 의존성 제거 후 deadweight가 된 항목만 처리)

#### Step 5: CLAUDE.md Architecture 섹션 갱신

- Work: 현재 "MUI icons (only `@mui/icons-material`, no `@mui/material` components in use)" 표현을 "lucide-react icons" 기반으로 수정
- Files to change: `CLAUDE.md` (Architecture 섹션)

#### Step 6: 빌드/시각적 회귀 검증

- Work: `pnpm dev`로 Paginator(좌·우·`...`), SearchInput 돋보기, Header GitHub 아이콘 시각 확인 → `pnpm run docs` (전체 export 파이프라인)
- 고려사항: lucide는 stroke 기반이라 fill 기반 MUI보다 살짝 얇아 보일 수 있음. 차이가 크다면 `strokeWidth={2.25}` 등으로 보정

### Test plan

- `pnpm run lint` 통과
- `pnpm dev`로 다음 시각 확인:
  - 페이지네이터: 좌/우 화살표, ‘...’ 더보기 아이콘
  - 검색 입력: 돋보기 아이콘 위치·색
  - 헤더: GitHub 아이콘 클릭/표시
- `pnpm run docs` 빌드 성공 (`./docs` 정상 생성)
- `pnpm-lock.yaml` diff에서 `@mui/*`, `@emotion/*` 트리 사라짐 확인

### Definition of done

- [ ] 6개 아이콘이 lucide-react로 교체됨
- [ ] `package.json`에서 `@mui/*`, `@emotion/*` 4개 제거, `lucide-react` 추가
- [ ] `pnpm-lock.yaml`에서 mui/emotion 항목 제거
- [ ] `pnpm dev`에서 모든 아이콘 시각 정상
- [ ] `pnpm run docs` 빌드 성공
- [ ] CLAUDE.md의 Architecture 섹션이 lucide-react 기준으로 갱신됨
- [ ] SCSS 2곳의 svg 사이즈 규칙이 `width/height` 기반으로 동작

### Risks and edge cases

- **시각적 톤 차이**: lucide는 stroke 기반(기본 `strokeWidth: 2`)이라 굵기/외형이 미세히 다름. 사용자 만족 여부 → `strokeWidth` 조절 가능
- **MoreHorizontal 명칭**: lucide v0.x → 신버전에서 `Ellipsis`로 별칭. 둘 다 export되므로 `MoreHorizontal` 사용
- **SocialIcon LinkedIn import 미사용**: 기존 import만 되고 socialIcons 배열에 없음 — 함께 정리해 죽은 코드 제거
- **pnpm.overrides 잔존**: #87에서 별도 처리 예정. 본 이슈에서는 본 의존성과 직접 묶인 항목이 있다면 처리, 나머지는 손대지 않음
- **peer dep 경고**: lucide-react가 React 19를 정식 지원하는 버전을 설치해야 함 — peer 경고 발생 시 latest로 재시도
