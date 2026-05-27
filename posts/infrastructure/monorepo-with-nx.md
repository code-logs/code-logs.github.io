## Monorepo

`Monorepo`는 방대한 양의 프로젝트 코드를 단일 Repository에서 관리하는 전략이다. 개인적으로 4년 전쯤 (2022년 기준) 처음 도입해서 사용했는데, 프론트엔드 개발자로서 컴퍼넌트 개발을 많이했고 각 컴퍼넌트들이 분산된 저장소에서 관리됨으로 발생하는 문제점들을 획기적으로 개선하는 경험을 했다.

그 이후 라이브러리 성향의 프로젝트를 구성할 경우에는 `Monorepo`를 필수적으로 체택하게 되었다.

처음 `Monorepo`를 도입한 뒤 감동은 말 그대로 `신세계`를 보는 듯 했으나 이것도 사실 20년도 ["As of 2017, this software engineering practice was over two decades old" - wiki](https://en.wikipedia.org/wiki/Monorepo) 훌쩍 넘긴 것이라 하니 여전히 공부해야 할 것들이 넘쳐난다는 생각이 든다

## Nx

나에게 익숙한 `Monorepo` 구성은 `lerna`를 이용한 구성이였는데
이번 포스팅에서는 `Monorepo` 구성뿐 아니라 프로젝트 빌드의 전반적인 프로세스를 돕는 `Nx` 빌드 시스템을 살펴본다.

<div style="text-align:center"><a href="https://nx.dev" target="_blank">Nx 홈페이지 바로가기</a></div>

`Nx`는 `Nrwl (Narwhal Technologies Inc)`에 의해 만들어진 시스템이다.

`Nrwl`은 Google의 Angular 팀 멤버에 의해 만들어진 법인으로 세계 여러 국가의 IT 컨설팅 외 다수의 작업을 하는 것으로 보인다. [Nrwl](https://nrwl.io/)

## Nx 프로젝트 구성하기

### 새로운 Workspace 생성

아래의 커맨드를 통해 새로운 workspace를 생성한다

```sh
npx create-nx-workspace@latest --preset=core
```

> `--preset=core` 옵션은 npm 패키지를 위한 빈 (yarn workspace와 유사한) 워크스페이스를 생성한다.
>
> 상기 옵션 없이 커맨드를 실행 할 경우 몇가지 옵션을 선택 할 수 있고 구성하려는 프로젝트의 성향에 맞게 preset을 선택 할 수 있다.

커맨드를 실행하면 디렉토리를 생성하고 필요한 설정이 담긴 파일들이 만들어진다.

생성된 파일중 `nx.json` 파일을 통해 `nx`의 설정을 진행 할 수 있다.

### NPM Package 생성

아래의 커맨드를 통해 새로운 패키지(sample)를 workspace에 추가 할 수 있다.

```sh
nx g npm-package sample
```

이렇게 생성된 패키지의 `package.json` 파일을 열어 보면

```json
{
  "name": "@nx-sample-workspace/sample",
  "version": "0.0.0",
  "scripts": {
    "test": "node index.js"
  }
}
```

패키지의 명칭이 @nx-sample-worspace로 설정되어 있다. 처음 Workspace를 생성할 때 입력이 organization으로 결정되니 Workspace 생성 시점에 이를 고려해야한다.

### Package 내부 script 실행

패키지 내부에 정의된 script를 실행하기 위해 아래의 커맨드를 입력한다.

```sh
nx ${script} ${package}
```

> `yarn`과 `lerna`로 구성한 monorepo에서는
>
> `yarn workspace ${package} ${script}`
>
> 형식으로 스크립트를 실행 할 수 있는데 `${package}`를 `@nx-sample-workspace/sample`과 같이 패키지의 이름 전체를 입력해야 한다.

### 여러 Package 내부 script 실행

빌드를 실행하거나 테스트 커맨드를 실행하는 등 전체 또는 복수의 package를 대상으로 script를 실행하려면 아래의 커맨드를 입력한다.

```sh
nx run-many --target=${script} --all
```

> 특정 패키지를 대상으로 스크립트를 실행하려면 `--all` 옵션 대신 `--projects=package1,package2` 옵션을 추가한다.

이렇게 실행한 scripts는 비동기적으로 평행하게 수행된다.

### Package간 참조 설정

`Monorepo` 구성 내부에서 컴퍼넌트를 개발하다 보면 종종 컴퍼넌트간의 참조가 발생한다. `Monorepo`의 도입을 통해 얻을 수 있는 장점중 하나가 참조하고 있는 컴퍼넌트의 완전한 `publishing` 없이 변경 사항을 적용하고 테스트 할 수 있다는 것이기도 하다.

> 만약 A 모듈이 B 모듈을 참조하고 있을때 이 둘이 각기 별도의 Repository로 구성되어 있을 경우 A 모듈을 수정하던중 B 모듈의 문제점을 발견하게 되면
>
> `B 모듈을 수정 -> B 모듈 Publishing -> A 모듈의 디펜던시 최신화 -> A 모듈 작업 재개`의 순으로 작업을 하게 되는데 (`yarn link`를 사용하는 방법도 있지만) `monorepo` 내부에서 패키지간의 참조는 별도의 publishing 없이도 최신화된 로컬 소스를 참조 할 수 있다.

패키지간의 참조 설정을 위해 또 다른 패키지를 생성한다.

```sh
nx g npm-package rely-on-sample
```

`packages/rely-on-sample/index.js`를 열어 `sample` 패키지를 참조하도록 아래와 같이 수정한다.

```js
// index.js
import '@nx-sample-workspace/sample'

console.log('Hello World')
```

참조 대상을 불러오기 위해 `rely-on-sample` 패키지의 `package.json`에 디펜던시를 추가한다.

> `@nx-sample-worspace/sample` 패키지는 아직 publishing 되지 않은 상태이기 때문에 커맨드를 통해 추가 할 수 없다.
>
> 직접 `package.json` 파일을 수정한 뒤 `yarn install` 또는 `npm install`을 통해 패키지를 최신화해야 한다.

## NX Graph

아래의 커맨드를 실행하면 헌재 Workspace에 존재하는 패키지간의 상관관계를 볼 수 있는 dashboard를 실행 할 수 있다.

```sh
nx graph
```

## Generator

`Nx`는 Generator를 이용해서 다양한 환경의 라이브러리/애플리케이션을 스카폴딩 할 수 있도록 돕는다.
몇가지 유용한 Generator를 살펴본다.

### Typescript Library Generator

타입스크립트 기반의 라이브러리 패키지를 생성하기 위해 사용 할 수 있는 `Generator`로 `jest`, `lint`와 빌드환경을 모두 갖춘 패키지를 생성한다.

`devDependency`로 `@nrwl/js` 패키지를 설치한다.

설치가 완료되면 아래 커맨드를 통해 타입스크립트 기반의 라이브러리를 생성한다.

```sh
nx g @nrwl/js:library ${library name}
```

> Typescript 기반의 라이브러리를 생성하는데 `@nrwl/js`라는 패키지를 설치하는 것은 nx의 generator가 기본적으로 ts를 사용하도록 설정되어 있기 때문이다.
>
> 실제 `@nrwl/js` 패키지는 타입스크립트 기반의 라이브러를 생성하는 것이 아닌 라이브러리 성향의 패키지 그 자체를 의미하며 `--js=false` 옵션이 default 값으로 설정되어 있다.
>
> 다시 말해 Javascript 베이스의 라이브러리를 생성하고 싶다면 아래의 커맨드를 입력해야 한다.
>
> `nx g @nrwl/js:library --js=false

> `--buildable 옵션`
>
> 상기 커맨드를 통해 생성된 라이브러리는 기본적으로 `빌드 할 수 없는` 형태이다.
>
> `--buildable=true` 옵션을 추가하는 것을 통해 `빌드 할 수 있는` 형태의 패키지를 생성할 수 있다..

그 외에도 라이브러리를 생성하며 전달할 수 있는 옵션들이 다수 있으니 공식 문서를 참조하면 조금 더 다채로운 형태의 라이브러리를 생성 할 수 있다.

> `--compiler 옵션`
>
> 타입스크립트 라이브러리를 생성하며 `--compiler=swc` 옵션을 추가하면 `tsc` 대신 `swc`를 컴파일러로 설정 할 수 있다.

> SWC (standard for Speedy Web Compiler)
>
> `Rust` 기반의 웹컴파일러로 기존의 `babel`과 같은 transpiler에 비해 월등한 성능을 보임.
>
> `SWC`는 다른 트랜스파일러와 유사하게 `typescript`의 type checking을 수행하지 않기 때문에 사용하더라도 `tsc`를 통해 타입체크를 별도로 수행해야한다. 특히 라이브러리 프로젝트의 경우 다른 프로젝트에서 라이브러리의 타입 정보를 체크하기 위해 `tsc`를 통해 타입선언을 해주는 것이 좋겠다.

### React Library Generator

리액트 라이브러리 패키지를 생성하기 위해 `@nrwl/react` 디펜던시를 설치한다. 패키지 생성 명령은 앞서 살펴본 타입스크립트의 경우와 동일한 형식을 갖는다.

```sh
nx g @nrwl/react:library
```

타입스크립트 생성과 유사한 `linting`, `testing` 환경이 갖춰진 패키지를 생성해낸다.
React Library도 기본적으로 타입스크립트 베이스로 생성되며 만약 자바스크립트 베이스의 React 라이브러리를 생성하고자 한다면 `--js=false` 옵션을 추가해야 한다.

## 마치며

`nx`는 패키지를 개발과정의 `workflow`를 관리하는 툴에 가깝다. `lerna`와 유사한 기능을 제공할거라고 기대한 (물론 대부분의 기능을 nx도 제공하지만 module publishing이나 versioning은 lerna가 나에게는 더 수월하다는 생각이든다.) 것과는 약간 다른 성격을 가지고 있었다.

다양한 코드베이스의 프로젝트들을 한군데에서 관리하고 일하는 것 자체의 효율을 높이기 위한 툴이라는 생각이 들었다 (프론트엔드 백엔드를 넘나드는 Scaffolding과 필요한 대부분의 툴이 inject 된 상태의 디렉토리 구조등)

[직접 느꼈으나 말로 표현 할 수 없던 이야기](https://stackoverflow.com/questions/67000436/the-difference-between-nx-and-lerna-monorepos)를 누군가 아주 잘 정리해준 글이 있어 첨부한다.
