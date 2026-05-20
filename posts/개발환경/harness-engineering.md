## Table of contents

1. [Harness](#harness)
1. [Harness Engineering](#harness-engineering)
1. [어디에 사용될까](#어디에-사용될까)
1. [좋은 Harness의 조건](#좋은-harness의-조건)
1. [마무리](#마무리)

## Harness

`Harness`는 원래 마구, 안전벨트처럼 무언가를 고정하고 제어하기 위한 장치를 의미한다.

소프트웨어 개발에서의 `Harness`도 비슷하다. 테스트하거나 실행하려는 대상이 안정적으로 동작할 수 있도록 주변 환경을 고정하고, 필요한 입력을 주입하고, 결과를 관찰할 수 있게 만든 장치다.

가장 익숙한 예시는 `test harness`다.

```ts
const result = render(<Button disabled />)

expect(result.getByRole('button')).toBeDisabled()
```

위 코드에서 실제로 검증하고 싶은 것은 `Button` 컴퍼넌트다. 하지만 검증을 위해서는 렌더링 환경, assertion 도구, DOM query, cleanup 같은 주변 장치가 필요하다. 이 주변 장치 전체를 넓은 의미의 harness로 볼 수 있다.

즉 harness는 테스트 대상 그 자체가 아니라 테스트 대상이 반복 가능하게 실행되도록 만드는 실행 환경이다.

## Harness Engineering

`Harness Engineering`은 이런 harness를 설계하고 개선하는 일을 말한다.

단순히 테스트 코드를 많이 작성하는 것과는 조금 다르다. 테스트를 잘 돌릴 수 있는 구조, 실패를 분석하기 쉬운 로그, 실제 환경과 유사한 fixture, 반복 실행 가능한 자동화 파이프라인을 만드는 일에 가깝다.

예를 들어 다음과 같은 작업들이 Harness Engineering에 포함될 수 있다.

- API 테스트를 위해 인증 토큰, mock server, seed data를 자동으로 준비한다.
- 프론트엔드 컴퍼넌트 테스트에서 provider, router, theme 설정을 공통 render 함수로 감싼다.
- E2E 테스트가 실행되기 전에 테스트 계정과 테스트 데이터를 초기화한다.
- CI에서 실패한 테스트의 스크린샷, trace, network log를 남긴다.
- 모델이나 에이전트의 응답 품질을 비교하기 위한 평가 입력과 채점 기준을 만든다.

여기서 중요한 것은 재현성이다. 같은 입력을 넣으면 같은 조건에서 실행되고, 실패했을 때 원인을 추적할 수 있어야 한다.

## 어디에 사용될까

### 테스트 자동화

가장 전통적인 사용처는 테스트 자동화다.

테스트가 많아질수록 각각의 테스트가 직접 환경을 구성하면 중복이 늘어나고 실패 원인도 흐려진다. 이때 harness를 잘 만들어두면 테스트는 검증하고 싶은 동작에만 집중할 수 있다.

```ts
const user = setupUser({ role: 'admin' })
const page = await openDashboard({ user })

await expect(page.getByText('관리자 메뉴')).toBeVisible()
```

테스트 안에서는 `admin` 사용자가 필요하다는 의도만 드러난다. 실제 계정 생성, 로그인, 세션 저장, 페이지 진입은 harness가 담당한다.

### 개발 환경

Harness는 테스트에만 한정되지 않는다.

로컬 개발 서버를 띄울 때 필요한 데이터베이스, 환경 변수, 외부 API mock, 샘플 데이터까지 한 번에 준비하는 스크립트도 개발용 harness라고 볼 수 있다.

`yarn dev`를 실행했을 때 개발자가 매번 수동으로 데이터베이스를 초기화하거나 토큰을 복사하지 않아도 된다면, 그만큼 개발 환경의 품질이 좋아진 것이다.

### AI 평가 환경

최근에는 LLM이나 AI Agent를 평가하는 문맥에서도 harness라는 표현을 자주 사용한다.

모델에게 같은 프롬프트 세트를 입력하고, 응답을 수집하고, 기준에 따라 점수를 매기고, 이전 버전과 비교하는 구조가 필요하기 때문이다. 이 경우 harness는 모델을 실행하는 껍데기이면서 동시에 평가 결과를 안정적으로 비교하기 위한 실험 장치가 된다.

## 좋은 Harness의 조건

좋은 harness는 테스트나 자동화 코드를 짧게 만드는 것에서 끝나지 않는다.

첫째, 실행 조건이 명확해야 한다. 어떤 데이터가 준비되는지, 어떤 외부 시스템이 mock 되는지, 어떤 환경 변수가 필요한지 알 수 있어야 한다.

둘째, 실패를 설명할 수 있어야 한다. 실패했다는 사실만 알려주는 것보다 어떤 요청이 실패했는지, 어떤 fixture가 깨졌는지, 어떤 단계에서 중단되었는지를 보여주는 것이 중요하다.

셋째, 실제 사용 환경과 너무 멀어지지 않아야 한다. 모든 것을 mock으로 대체하면 테스트는 빨라지지만 실제 장애를 놓칠 수 있다. 반대로 모든 것을 실제 환경에 붙이면 느리고 불안정해진다. Harness Engineering은 이 균형을 잡는 작업이기도 하다.

넷째, 사용하는 쪽의 코드가 단순해야 한다. harness가 복잡하더라도 테스트 작성자는 의도를 짧게 표현할 수 있어야 한다.

```ts
await scenario.loginAs('seller')
await scenario.createProduct({ status: 'draft' })
await scenario.openProductEditor()
```

이런 식으로 테스트가 업무 시나리오에 가깝게 읽힌다면 harness가 제 역할을 하고 있는 것이다.

## 마무리

`Harness Engineering`은 테스트 대상 주변의 실행 환경을 만드는 일이다.

작게는 테스트 helper를 만드는 일이고, 크게는 CI, fixture, mock server, seed data, 로그, 평가 파이프라인까지 포함한다.

코드 자체의 품질만큼이나 코드를 검증하는 환경의 품질도 중요하다. harness가 잘 구성되어 있으면 테스트는 더 안정적으로 실행되고, 실패는 더 빠르게 해석되며, 개발자는 반복적인 환경 구성보다 실제 문제 해결에 집중할 수 있다.
