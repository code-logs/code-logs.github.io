## AI Agent와 디자인 생성

요즘은 텍스트 몇 줄만 입력해도 화면 시안이나 프론트엔드 코드를 생성할 수 있는 도구들이 많아졌다. Google Stitch는 자연어, 이미지, 와이어프레임을 입력으로 받아 UI와 코드를 생성하는 도구로 소개되고 있고, Figma 역시 MCP, Code Connect 같은 기능을 통해 디자인과 개발 도구 사이의 연결을 강화하고 있다.

처음 이런 도구를 접하면 `프롬프트를 잘 쓰면 디자인과 코드가 한번에 나오지 않을까?` 라는 기대를 하게 된다. 하지만 실제 개발 프로세스에 넣어보면 조금 다르다.

AI agent를 활용한 디자인 생성에서 중요한 것은 단순히 예쁜 화면을 뽑는 것에 그치지 않는다. agent가 디자인 시스템, 코드베이스, 컴포넌트 사용법, 검증 방식까지 충분한 컨텍스트를 가진 상태로 작업하도록 만드는 것이 중요하다.

Figma MCP 문서에서도 MCP 결과는 context quality, model behavior, prompt clarity의 영향을 받는다고 설명한다. 즉 좋은 결과를 얻기 위해서는 프롬프트만 다듬는 것이 아니라 agent가 참고할 수 있는 컨텍스트 자체를 정리해야 한다.

## Design generation과 production code 사이의 간격

AI 디자인 생성 도구는 발산 단계에서 유용하게 사용할 수 있다.

- 새로운 화면의 레이아웃 후보를 빠르게 만든다.
- 여러 스타일 방향을 비교한다.
- 와이어프레임을 고충실도 화면으로 확장한다.
- 비어 있던 제품 아이디어를 실제 화면 단위로 구체화한다.

하지만 이 결과를 그대로 서비스 코드에 넣기는 어렵다.

실제 제품에는 이미 정해진 컴포넌트, spacing, color token, typography, responsive rule, 접근성 기준, 상태 처리 방식이 존재한다. AI가 생성한 화면이 보기에는 그럴듯해도 다음과 같은 문제가 생길 수 있다.

- 기존 디자인 시스템과 다른 색상이나 spacing을 사용한다.
- 이미 있는 버튼, 카드, 모달 컴포넌트를 새로 만든다.
- loading, empty, error 상태가 빠져 있다.
- 모바일 화면에서 텍스트가 겹친다.
- 디자인은 맞지만 실제 코드 구조와 맞지 않는다.
- 리뷰하기 어려운 큰 diff가 만들어진다.

이 목록은 특정 도구가 항상 이런 문제를 만든다는 의미는 아니다. 다만 agent가 디자인 시스템과 코드베이스 컨텍스트 없이 작업하면 추측이 늘어나고, 그 추측이 실제 제품의 규칙과 어긋날 가능성이 생긴다.

그래서 AI agent 기반 디자인 생성은 `생성 → 복사 → 붙여넣기` 흐름으로 접근하면 오래 유지하기 어렵다. 개발 프로세스 안에서는 `생성 → 선택 → 구현 → 검증 → 반복` 흐름으로 다뤄야 한다.

## 전체 흐름

실제 프로세스에 녹인다면 다음과 같은 순서가 적절하다.

1. 디자인 brief를 텍스트로 정리한다.
1. 디자인 시스템과 코드 컴포넌트를 agent가 읽을 수 있게 만든다.
1. AI 도구로 여러 화면 후보를 생성한다.
1. 선택한 화면을 Figma 또는 디자인 파일에서 정리한다.
1. Figma MCP, Code Connect, repository context를 통해 coding agent에게 전달한다.
1. agent가 실제 코드베이스의 컴포넌트로 구현한다.
1. Storybook, Playwright 같은 도구로 시각적 회귀를 확인하고, PR review로 코드 변경을 별도로 검토한다.
1. 반복적으로 수정하되, 반복되는 문제는 prompt가 아니라 시스템 쪽을 고친다.

하나씩 정리해보자.

## 1. Design brief를 코드처럼 관리하기

AI agent에게 `관리자 대시보드 예쁘게 만들어줘` 라고 요청하면 결과가 매번 달라질 수 있다. 더 큰 문제는 결과가 제품의 목적과 맞는지 판단하기 어렵다는 점이다.

먼저 화면의 목적을 텍스트로 고정해야 한다.

예를 들면 다음과 같은 내용을 issue, `DESIGN.md`, 또는 작업 문서에 남긴다.

- 이 화면을 사용하는 사용자는 누구인가?
- 사용자가 이 화면에서 끝내야 하는 작업은 무엇인가?
- 가장 중요한 정보는 무엇인가?
- 어떤 상태가 필요한가? (`loading`, `empty`, `error`, `success`)
- 모바일에서 반드시 유지해야 하는 정보는 무엇인가?
- 사용하면 안 되는 UI 패턴은 무엇인가?
- 기존 제품에서 참고해야 하는 화면은 무엇인가?

이 문서는 사람을 위한 기획서이기도 하지만 agent를 위한 입력 컨텍스트이기도 하다. Claude Code의 best practices 문서에서도 `CLAUDE.md` 같은 파일을 통해 프로젝트의 명령, 구조, 스타일 가이드를 agent에게 제공하는 방식을 소개한다.

AI agent에게는 감각적인 표현보다 제약이 중요하다. `깔끔하고 세련되게` 보다 `기존 Button, Card, Tabs 컴포넌트를 사용하고 새 색상은 추가하지 않는다` 가 더 재현 가능한 요청이 된다.

## 2. 디자인 시스템을 agent가 읽을 수 있게 만들기

디자인 시스템이 사람 머릿속에만 있으면 agent는 추측할 수밖에 없다.

Figma MCP 문서에서는 MCP server를 Figma design file의 정보를 AI agent에게 전달하는 도구로 설명한다. 선택한 Figma 요소의 구조, 컴포넌트, 레이아웃, 토큰, 변수 같은 정보를 AI assistant가 읽을 수 있게 전달하는 역할이다.

여기서 중요한 점은 MCP가 자동으로 완벽한 코드를 만들어주는 도구가 아니라는 것이다. Figma 문서에서도 MCP가 보내는 정보와 agent가 수행하는 작업은 구분되어 있다. MCP는 디자인 정보를 전달하고, 실제 해석과 코딩은 agent가 한다.

따라서 agent가 좋은 결과를 만들려면 Figma 파일 자체도 정리되어 있어야 한다.

- 반복되는 UI는 Figma component로 만든다.
- layer와 component 이름을 의미 있게 작성한다.
- spacing, color, radius, typography는 variable 또는 token으로 관리한다.
- Auto Layout을 사용해 반응형 의도를 전달한다.
- 시각적으로만 알기 어려운 동작은 annotation으로 남긴다.

`Frame 1287`, `Rectangle 42` 같은 이름만 있는 파일은 사람도 해석하기 어렵고 agent도 해석하기 어렵다.

## 3. Code Connect로 디자인과 실제 컴포넌트 연결하기

디자인 파일의 `Button`과 코드의 `Button`이 이름만 같다고 같은 것은 아니다.

Figma Code Connect는 Figma component와 실제 코드 컴포넌트를 연결하는 기능이다. 연결해두면 Dev Mode에서 추상적인 코드 조각이 아니라 실제 프로덕션 컴포넌트 사용 예시를 보여줄 수 있다.

이 연결은 AI agent에게도 중요하다. Figma 문서에 따르면 Code Connect 연결 정보는 MCP server를 통해 agent에게 더 정확한 implementation detail을 제공하는 데 도움을 줄 수 있다.

예를 들어 디자인에는 Primary Button이 있고 코드에는 다음과 같은 컴포넌트가 있다고 가정해보자.

`<Button variant="primary" size="md" />`

Code Connect 없이 agent가 디자인만 보고 구현하면 새 CSS class를 만들거나 별도 버튼을 만들 수 있다. 반대로 Code Connect와 repository context가 있으면 agent에게 이렇게 지시할 수 있다.

> Figma의 Primary Button은 코드베이스의 `Button` 컴포넌트로 구현한다. 새 버튼 스타일을 만들지 않는다.

이렇게 되면 AI agent는 디자인을 그럴듯하게 따라하는 것이 아니라 제품의 컴포넌트 시스템 안에서 구현할 가능성이 높아진다.

## 4. Design token을 공통 언어로 사용하기

AI가 UI를 생성할 때 자주 확인해야 하는 지점은 색상과 간격을 임의로 만들지 않는가이다.

디자인 시스템이 `blue-500`, `space-4`, `radius-sm` 같은 token으로 관리되고 있다면 agent에게도 그 token을 사용하도록 요청해야 한다. W3C Design Tokens Format Module은 design token을 여러 tool, discipline, technology 사이에서 공유하기 위한 방법으로 설명한다. 중요한 것은 특정 스펙 자체보다 token을 디자인과 코드 사이의 공통 언어로 둔다는 관점이다.

색상값을 직접 쓰게 하는 대신 다음처럼 제약을 주는 편이 좋다.

- 색상은 기존 semantic token만 사용한다.
- spacing은 design token scale만 사용한다.
- 임의의 `box-shadow`, `border-radius`를 추가하지 않는다.
- 필요한 token이 없다면 구현하지 말고 누락된 token을 보고한다.

이렇게 하면 agent가 만든 UI를 나중에 사람이 정리하는 비용이 줄어든다.

## 5. 발산 단계와 수렴 단계를 나누기

Google Stitch 같은 AI 디자인 생성 도구는 여러 방향을 빠르게 보는 발산 단계에 잘 맞는다. 반대로 production code로 수렴하는 단계에서는 제품의 디자인 시스템과 코드 규칙을 더 강하게 적용해야 한다.

이 두 단계를 섞으면 문제가 생긴다. 아이디어를 넓혀야 할 단계에서는 너무 많은 제약이 방해가 되고, 구현해야 할 단계에서는 제약이 없으면 코드가 제품의 규칙에서 벗어날 수 있다.

그래서 다음처럼 단계를 분리하는 것이 좋다.

### 발산 단계

Stitch 같은 도구를 사용해 여러 화면 후보를 만든다.

이 단계에서는 다음을 본다.

- 정보 우선순위가 맞는가?
- 주요 행동이 잘 보이는가?
- 화면 밀도가 서비스 성격과 맞는가?
- 모바일에서도 흐름이 유지되는가?

이 단계의 결과물은 production code라기보다 디자인 후보이자 대화 재료로 보는 편이 안전하다.

### 수렴 단계

선택한 후보를 Figma에서 정리하고, 디자인 시스템에 맞게 component, variable, Auto Layout을 적용한다. 그 다음 MCP와 Code Connect를 통해 coding agent에게 넘긴다.

이 단계에서는 다음을 지킨다.

- 기존 컴포넌트를 우선 사용한다.
- 새 스타일 추가는 최소화한다.
- 상태별 화면을 빠뜨리지 않는다.
- 작은 단위의 PR로 구현한다.
- screenshot과 visual regression으로 확인한다.

발산 단계에서는 많이 만들고, 수렴 단계에서는 엄격하게 줄인다.

## 6. Coding agent에게 넘기는 단위

AI agent에게 전체 서비스를 한번에 바꾸게 하면 리뷰하기 어렵다.

화면 하나도 너무 클 수 있다. 가능하면 다음과 같이 작은 단위로 나누는 것이 좋다.

- header 영역
- filter 영역
- list item component
- empty state
- detail panel
- mobile layout

각 단위마다 agent에게 명확한 제약을 준다.

예를 들어 다음과 같은 작업 지시가 가능하다.

> Figma MCP에서 선택한 `UserListEmptyState` frame을 기준으로 구현한다. 기존 `EmptyState`, `Button`, `Icon` 컴포넌트를 사용한다. 새 color token을 추가하지 않는다. desktop, mobile story를 추가하고 Playwright screenshot test가 통과해야 한다.

이런 식으로 지시하면 agent가 해야 할 일과 하지 말아야 할 일이 명확해진다.

GitHub Copilot cloud agent 문서에서도 agent가 repository를 조사하고, 구현 계획을 세우고, branch에서 code change를 만들고, pull request 흐름으로 변경사항을 남기는 방식을 설명한다. agent를 실제 개발 프로세스에 넣는다면 결과물을 채팅 메시지가 아니라 리뷰 가능한 변경사항으로 남기는 것이 좋다.

## 7. Storybook과 Playwright로 검증하기

AI가 만든 UI는 사람이 눈으로 보기 전에도 가능한 범위에서 자동 검증을 통과해야 한다.

Storybook visual test는 story별 screenshot을 이전 버전과 비교해 레이아웃, 색상, 크기 같은 시각적 변경을 확인할 수 있다. Playwright 역시 `toHaveScreenshot`을 통해 기준 스크린샷과 현재 화면을 비교할 수 있다.

AI agent를 쓰는 프로세스라면 최소한 다음을 확인하는 편이 좋다.

- desktop viewport
- mobile viewport
- loading state
- empty state
- error state
- hover 또는 selected state
- 긴 텍스트가 들어간 상태

특히 생성된 UI는 기본 데이터에서는 멀쩡해 보여도 긴 이름, 빈 배열, 작은 화면에서 문제가 드러날 수 있다. 자동 screenshot test는 이런 문제를 빨리 발견하는 데 도움이 된다. 다만 code review는 자동 검증과 별개의 단계로 봐야 한다. 테스트가 시각적 회귀를 잡아준다면, PR review는 컴포넌트 사용 방식, token 우회, 불필요한 중복 구현을 확인하는 단계다.

예전에 작성한 [Scroll Sequence Animation](/posts/ui-and-ux/scroll-sequence-animation) 글에서도 `requestAnimationFrame`, canvas 크기, scroll 위치처럼 화면의 실제 동작을 하나씩 쪼개서 확인했다. AI agent가 만든 UI도 마찬가지로 최종 화면만 볼 것이 아니라 어떤 상태와 조건에서 깨지는지 나눠서 봐야 한다.

## 8. 보안과 권한

AI agent가 디자인만 만드는 동안에는 위험이 작아 보인다. 하지만 실제 개발 프로세스에 들어오면 상황이 달라진다.

agent가 Figma, GitHub, 파일 시스템, 브라우저, 배포 도구에 접근하기 시작하면 권한 관리가 필요하다. OWASP의 LLM 관련 자료에서도 prompt injection, excessive agency, sensitive information disclosure 같은 위험을 다룬다.

디자인 생성 agent에도 다음 원칙을 적용하는 것이 좋다.

- 읽기 권한과 쓰기 권한을 분리한다.
- 배포 권한은 기본적으로 주지 않는다.
- 외부 입력을 그대로 명령으로 실행하지 않는다.
- 디자인 파일과 repository 접근 범위를 제한한다.
- 모든 변경은 PR과 review를 거친다.
- agent가 만든 변경의 로그와 diff를 남긴다.

편리함 때문에 권한을 넓게 주기 시작하면 나중에 원인을 추적하기 어려워진다.

## 실무에 적용할 때의 체크리스트

정리하면 AI agent를 디자인 생성에 활용할 때는 다음 순서로 준비하면 된다.

1. 화면 목적과 사용자 작업을 brief로 정리한다.
1. Figma file의 component, layer name, Auto Layout, variable을 정리한다.
1. 코드베이스의 디자인 시스템과 Storybook을 최신 상태로 둔다.
1. Figma Code Connect로 디자인 컴포넌트와 코드 컴포넌트를 연결한다.
1. 생성형 디자인 도구로 여러 후보를 만든다.
1. 선택한 후보를 디자인 시스템 기준으로 정리한다.
1. MCP를 통해 coding agent에게 필요한 frame context를 전달한다.
1. agent에게 기존 컴포넌트와 token 사용을 요청한다.
1. 작은 PR 단위로 구현한다.
1. Storybook, Playwright로 시각적 회귀를 확인하고 code review로 구현 품질을 검토한다.

이 과정을 갖추면 AI agent는 `화면을 대신 그려주는 도구`에서 `디자인과 개발 사이의 반복 작업을 줄여주는 도구`에 가까워진다.

## 마무리

AI agent를 디자인 생성에 활용하는 핵심은 한번에 완성품을 얻는 것이 아니다.

좋은 결과를 얻으려면 agent가 추측하지 않아도 되는 환경을 만들어야 한다. 디자인 의도는 brief로, 시각 규칙은 token으로, 컴포넌트 관계는 Code Connect로, 구현 결과는 PR과 visual test로 관리한다.

프롬프트를 잘 쓰는 것도 중요하지만 그것만으로는 부족하다. 반복해서 좋은 결과를 얻으려면 디자인 시스템과 개발 프로세스 안에 agent가 들어갈 자리를 만들어야 한다.

결국 AI agent 기반 디자인 생성의 목표는 `멋진 시안 하나`가 아니라 `검증 가능한 변경사항 하나`여야 한다.
