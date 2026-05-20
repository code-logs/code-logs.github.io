## Table of contents

1. [Harness Engineering](#harness-engineering)
1. [Harness가 필요한 이유](#harness가-필요한-이유)
1. [Harness의 종류](#harness의-종류)
   1. [Test Harness](#test-harness)
   1. [Local Harness](#local-harness)
   1. [CI Harness](#ci-harness)
1. [좋은 Harness의 조건](#좋은-harness의-조건)
1. [마무리](#마무리)

## Harness Engineering

`Harness`는 원래 어떤 대상을 붙잡아 두거나 안전하게 제어하기 위한 장치를 의미한다. 소프트웨어 개발에서의 `Harness`도 비슷하다. 애플리케이션, 라이브러리, 테스트, 빌드 스크립트가 일정한 조건 안에서 실행될 수 있도록 감싸는 실행 환경 또는 보조 도구를 뜻한다.

`Harness Engineering`은 이런 실행 환경을 설계하고 관리하는 작업이다.

단순히 테스트 코드를 작성하는 것과는 조금 다르다. 테스트 코드가 특정 기능의 기대 결과를 검증한다면, harness는 그 테스트가 실행될 수 있는 조건을 만든다. 필요한 데이터를 준비하고, 외부 API를 대체하고, 실행 순서를 고정하고, 실패했을 때 원인을 추적할 수 있게 만드는 영역까지 포함한다.

> 테스트가 신뢰할 수 없는 이유가 테스트 코드 자체가 아니라 실행 환경에 있는 경우가 많다. Harness Engineering은 이런 불안정한 실행 조건을 줄이는 작업에 가깝다.

## Harness가 필요한 이유

개발 과정에서 반복되는 작업들은 대부분 환경의 영향을 받는다.

로컬에서는 성공한 테스트가 CI에서는 실패하거나, 특정 순서로 실행했을 때만 실패하는 테스트가 생기거나, 외부 서비스의 응답 상태에 따라 빌드 결과가 달라지는 경우가 있다. 이런 문제는 기능 구현과 직접적인 관련이 없어 보여도 개발 속도를 크게 떨어뜨린다.

예를 들어 `monorepo` 환경에서는 여러 패키지의 빌드와 테스트가 서로 영향을 줄 수 있다. 이때 단순히 각 패키지에 `test` 스크립트를 추가하는 것만으로는 충분하지 않다. 어떤 패키지를 먼저 빌드해야 하는지, 변경된 패키지만 테스트할 수 있는지, 공통 설정이 모든 패키지에 동일하게 적용되는지 같은 실행 조건을 함께 설계해야 한다.

이런 관점에서 harness는 개발환경의 일부다. ESLint 설정, package manager, workspace, Dockerfile, CI workflow 모두 넓은 의미에서는 harness를 구성하는 재료가 될 수 있다.

## Harness의 종류

### Test Harness

`Test Harness`는 테스트 대상 코드를 고립된 조건에서 실행하기 위한 장치다.

일반적으로 아래와 같은 요소를 포함한다.

- 테스트 데이터 생성
- mock, stub, fake server 구성
- 테스트 대상 모듈의 초기화 및 정리
- 실행 결과 수집
- 에러 로그 또는 snapshot 저장

예를 들어 API 클라이언트를 테스트한다고 할 때 실제 서버를 호출하면 네트워크 상태, 인증 토큰, 서버 데이터에 따라 테스트 결과가 달라질 수 있다. 이런 경우 fake server 또는 mock response를 제공하는 test harness를 구성하면 테스트는 외부 환경과 분리된다.

```ts
const createApiTestHarness = () => {
  const server = createMockServer()
  const client = createApiClient({ baseUrl: server.url })

  return {
    client,
    server,
    cleanup: () => server.close(),
  }
}
```

중요한 것은 테스트 코드마다 반복적으로 환경을 구성하지 않도록 하는 것이다. 테스트 실행에 필요한 조건을 harness 내부에 모아두면 테스트는 검증하고자 하는 동작에만 집중할 수 있다.

### Local Harness

`Local Harness`는 개발자가 로컬 환경에서 애플리케이션을 일관되게 실행할 수 있도록 돕는 구성이다.

예를 들어 아래와 같은 스크립트가 여기에 해당한다.

```sh
pnpm dev
pnpm test
pnpm lint
pnpm build
```

이 스크립트들이 단순히 명령어를 줄여주는 alias 정도에 머문다면 효과는 제한적이다. 좋은 local harness는 필요한 환경 변수를 확인하고, 의존 서비스가 실행 중인지 검사하고, 초기 데이터가 없다면 생성하고, 실패했을 때 다음에 확인해야 할 지점을 알려준다.

개발자가 프로젝트에 처음 참여했을 때 README를 여러 번 오가며 수동으로 환경을 맞추지 않아도 된다면 local harness가 제 역할을 하고 있다고 볼 수 있다.

### CI Harness

`CI Harness`는 remote 환경에서 동일한 품질 검사를 반복적으로 수행하기 위한 구성이다.

로컬에서 실행하는 `lint`, `test`, `build`와 동일한 작업이라도 CI에서는 더 엄격한 조건이 필요하다. lock file을 기준으로 dependency를 설치해야 하고, cache가 잘못된 결과를 만들지 않도록 관리해야 하며, 실패한 작업이 어떤 package 또는 어떤 step에서 발생했는지 확인할 수 있어야 한다.

특히 Docker 또는 monorepo 기반 프로젝트에서는 CI harness의 역할이 더 커진다. 빌드 대상과 관계 없는 파일 변경으로 cache가 계속 무효화되거나, workspace 내부의 symbolic link 구조가 이미지 빌드 과정에 섞이면 실행 결과가 흔들릴 수 있다.

> CI에서만 실패하는 문제는 대개 CI가 특별해서가 아니라 로컬과 CI의 harness가 서로 다르게 구성되어 있기 때문에 발생한다.

## 좋은 Harness의 조건

좋은 harness는 실행 결과를 예측 가능하게 만든다.

첫번째로 `재현 가능성`이 중요하다. 같은 입력과 같은 코드라면 같은 결과가 나와야 한다. 이를 위해 lock file, 고정된 런타임 버전, 명확한 환경 변수, deterministic seed 같은 요소가 필요하다.

두번째로 `관찰 가능성`이 필요하다. 실패했을 때 단순히 exit code만 남는다면 원인을 찾기 어렵다. 어떤 준비 단계가 성공했는지, 어떤 외부 의존성이 사용됐는지, 어떤 테스트 데이터가 만들어졌는지 확인할 수 있어야 한다.

세번째로 `분리`가 필요하다. 테스트나 빌드가 이전 실행 결과에 의존하면 작은 변경도 예측하기 어렵다. 실행 전 상태를 만들고 실행 후 상태를 정리하는 과정이 harness에 포함되어야 한다.

마지막으로 `사용하기 쉬워야` 한다. harness가 너무 복잡해서 특정 사람만 사용할 수 있다면 결국 문서 밖의 지식이 된다. 좋은 harness는 복잡한 환경을 내부로 숨기되, 외부에서는 명확한 커맨드와 실패 메시지를 제공한다.

## 마무리

`Harness Engineering`은 기능 개발 자체보다는 기능 개발이 안정적으로 반복될 수 있는 환경을 만드는 작업이다.

작은 프로젝트에서는 테스트 helper나 npm script 정도로 충분할 수 있다. 하지만 프로젝트가 커지고 패키지가 나뉘고 CI/CD 단계가 복잡해질수록 harness의 품질은 개발 생산성에 직접적인 영향을 준다.

결국 좋은 harness는 개발자가 매번 기억해야 하는 절차를 줄이고, 실행 환경의 차이에서 발생하는 불필요한 실패를 줄인다. 기능을 잘 만드는 것만큼이나, 그 기능을 계속 검증하고 배포할 수 있는 장치를 잘 만드는 것도 중요한 엔지니어링 영역이다.
