## Table of contents

1. [Harness](#harness)
1. [Harness engineering](#harness-engineering)
1. [어디에 사용될까](#어디에-사용될까)
1. [좋은 Harness의 조건](#좋은-harness의-조건)
1. [마무리](#마무리)

## Harness

`Harness`는 사전적으로 마구, 안전벨트, 장비를 고정하는 장치에 가까운 의미를 갖는다.

소프트웨어 개발에서의 `Harness`도 크게 다르지 않다. 어떤 코드를 독립적으로 실행하거나 검증하기 위해 필요한 주변 장치를 묶어둔 환경을 의미한다.

가장 익숙한 예시는 `test harness` 이다.

테스트 대상 함수가 있다고 할 때, 테스트는 함수만 실행한다고 끝나지 않는다. 입력값을 준비하고, 외부 API를 대신할 mock을 만들고, 데이터베이스 상태를 초기화하고, 실행 결과를 수집해야 한다.

이때 테스트 대상이 안정적으로 실행될 수 있도록 감싸는 코드와 도구의 묶음이 harness다.

```ts
const userRepository = createMockUserRepository()
const mailer = createMockMailer()

const service = new SignupService(userRepository, mailer)

await service.signup({ email: 'sample@example.com' })

expect(mailer.send).toHaveBeenCalled()
```

위 예제에서 실제로 검증하고 싶은 것은 `signup`의 동작이다. 하지만 이 동작을 확인하기 위해 `repository`, `mailer`, 입력값, assertion이 함께 필요하다. 이런 주변 환경을 매번 손으로 만들면 테스트는 금방 지저분해진다.

## Harness engineering

`Harness engineering`은 이런 실행 환경을 일회성 보조 코드가 아니라 하나의 엔지니어링 대상으로 다루는 일이다.

테스트 코드 몇 줄을 추가하는 것과는 조금 다르다. 반복되는 검증 환경을 정리하고, 팀이 같은 방식으로 코드를 실행하고, 실패 원인을 빠르게 좁힐 수 있도록 도구와 구조를 만드는 작업에 가깝다.

예를 들어 다음과 같은 작업들이 포함될 수 있다.

- 통합 테스트를 위한 서버, 데이터베이스, 큐 실행 환경 구성
- 외부 API를 대체하는 mock server 또는 fake adapter 구성
- 시나리오별 fixture 데이터 관리
- 테스트 실행 결과, 로그, 스냅샷 수집
- 로컬 개발 환경과 CI 환경의 차이 줄이기
- 특정 기능을 독립적으로 실행해볼 수 있는 sandbox 구성

[ESLint - Plugin and Extends](/posts/개발환경/eslint-plugin-and-extends)에서 plugin과 config를 분리해 이해했던 것처럼, harness도 제품 코드와 검증 환경을 분리해서 바라보면 역할이 선명해진다.

제품 코드는 실제 기능을 담당하고, harness는 그 기능이 반복 가능하고 관찰 가능한 상태로 실행되도록 돕는다.

## 어디에 사용될까

### 테스트 자동화

가장 대표적인 영역은 테스트 자동화다.

단위 테스트에서는 dependency를 교체하고 입력값을 만드는 helper가 harness가 될 수 있다. 통합 테스트에서는 Docker compose, seed script, test database 초기화 코드가 harness의 일부가 된다.

```sh
pnpm test:integration
```

이 한 줄 안에서 데이터베이스가 준비되고, migration이 수행되고, fixture가 입력되고, 테스트 서버가 실행된다면 이미 꽤 많은 harness engineering이 들어간 상태라고 볼 수 있다.

### 로컬 개발 환경

복잡한 서비스를 다루다 보면 기능 하나를 확인하기 위해 여러 서버를 켜고, 환경 변수를 맞추고, 특정 데이터를 직접 만들어야 하는 경우가 있다.

이 과정이 문서에만 의존하면 사람마다 조금씩 다른 환경에서 작업하게 된다. 반대로 harness가 잘 구성되어 있으면 신규 개발자도 동일한 명령어로 같은 상태를 재현할 수 있다.

```sh
pnpm dev:scenario checkout-failed-payment
```

이런 식으로 특정 시나리오를 바로 실행할 수 있다면, 버그 재현과 기능 검증에 드는 비용이 크게 줄어든다.

### CI와 배포 검증

CI에서 실행되는 검증 작업도 harness의 영향을 크게 받는다.

테스트가 가끔 실패하거나, 로컬에서는 통과하지만 CI에서는 실패한다면 제품 코드보다 harness를 먼저 의심해야 할 때가 많다. 시간, 네트워크, 파일 경로, 병렬 실행, 캐시 상태처럼 제품 기능과 직접 관련이 없는 요소가 실패를 만들 수 있기 때문이다.

좋은 harness는 이런 비결정성을 줄인다.

## 좋은 Harness의 조건

좋은 harness는 복잡한 내부 동작을 숨기되, 실패했을 때는 충분한 정보를 보여줘야 한다.

실행은 단순해야 한다.

```sh
pnpm test:e2e
```

하지만 실패했을 때는 어느 단계에서 실패했는지, 어떤 fixture가 사용되었는지, 어떤 로그를 확인해야 하는지 알 수 있어야 한다.

또한 제품 코드보다 더 복잡해지지 않아야 한다. 검증을 돕기 위한 코드가 실제 기능보다 이해하기 어렵다면 유지보수 비용이 반대로 증가한다.

개인적으로 좋은 harness는 다음 조건을 만족해야 한다고 생각한다.

- 같은 입력에서는 같은 결과를 만든다.
- 로컬과 CI에서 가능한 한 같은 방식으로 실행된다.
- 실패 원인을 좁힐 수 있는 로그와 결과물을 남긴다.
- 테스트 대상과 테스트 환경의 책임이 섞이지 않는다.
- 새로운 시나리오를 추가하는 비용이 낮다.

특히 마지막 조건이 중요하다. harness를 만드는 이유는 검증을 더 많이, 더 자주 하기 위해서다. 새로운 테스트를 추가할 때마다 많은 설정을 반복해야 한다면 harness가 제 역할을 하지 못하고 있는 것이다.

## 마무리

`Harness engineering`은 화려한 기능을 만드는 작업은 아니지만, 팀의 개발 속도와 신뢰도를 크게 좌우한다.

처음에는 테스트 helper나 mock server 정도로 시작할 수 있다. 하지만 프로젝트가 커질수록 실행 환경을 표준화하고, 반복 가능한 검증 흐름을 만들고, 실패를 관찰 가능하게 만드는 일이 중요해진다.

제품 코드를 잘 만드는 것만큼이나, 그 코드가 안정적으로 실행되고 검증될 수 있는 환경을 잘 만드는 것도 엔지니어링의 일부다.

그 환경을 의식적으로 설계하는 일이 바로 harness engineering이다.
