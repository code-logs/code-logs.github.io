## Yarn berry 활성화

yarn berry는 일반적인 yarn 환경과의 충돌을 방지하기 위해 적용하고자 하는 디렉토리에서 아래의 커맨드를 통해 활성화 할 수 있다.

```bash
yarn set version berry
```

Yarn berry를 활성화하게 되면 몇가지 파일이 자동적으로 생성되는데 디펜던시를 관리하기 위한 metadata (.pnp.cjs)와 현재 `workspace` (root 디렉토리도 결국 하나의 workspace와 같다)의 설정들 (설치된 plugins, sdk 등) 그리고 가장 중요한 압축된 형식의 디펜던시들이다.

yarn berry를 이용하는 것은 디펜던시를 node_modules 디렉토리에 저장하는 것이 아닌 압축된 파일로 저장하게 되고 패키지의 디펜던시 참조 관계를 하나의 파일을 통해 확인한다. (.pnp.cjs 파일은 디펜던시 추가 이후 생성됨) 이를 통해 예전의 상위 디렉토리로 올라가며 node_modules를 탐색하던 방식의 성능이 획기적으로 개선된다.

## Workspace 구성

workspace 구성을 위해선 프로젝트 root 디렉토리의 `package.json` 파일을 수정해야 한다.

```json
{
  "worskpaces": ["packages/*"]
}
```

상기 설정은 `packages` 디렉토리 하위의 모든 디렉토리를 패키지로 본다.

만약 한 depth 더 들어가게 구성하고 싶을 경우 (예를들어 `components`, `utils` 와 같이 유형에 따라 디렉토리를 달리하고 싶을 경우) 아래와 같이 설정해야한다.

```json
{
	"workspaces": ["packages/components/*", "packages/utils/*"]
}

or

{
	"workspaces": ["packages/*/*"]
}
```

상기 설정과 동일한 형태의 디렉토리 구조를 생성하고 아래의 커맨드를 통해 현재 구성된 워크스페이스의 리스트를 확인한다.

```bash
yarn workspaces list
```

> 디렉토리 구조를 정상적으로 만들었더라도 참조할 하위 `package.json` 파일이 존재하지 않으면 workspace를 인식 할 수 없다.

## React library 패키지 추가

### 디렉토리 구성 및 디펜던시 설치

앞서 설정한 workspace 경로에 근거하여 적절한 위치에 추가하고자하는 react library 디렉토리를 구성한다.

본 설명에서는 `root/packages/components/button` 경로에 button 컴퍼넌트를 만든다.

패키지 디렉토리로 이동해 `package.json` 를 생성한다.

```bash
cd packages/components
mkdir button && cd $_
yarn init
```

필요한 디펜던시를 설치한다.

package.json을 생성한 이후로는 `yarn workspace` 커맨드를 이용해 직접 디렉토리를 오가며 작업하지 않아도 된다.

```bash
yarn workspace button add react
yarn workspace button add -D @types/react typescript
```

### 버튼 컴퍼넌트 생성 및 빌드 환경 구성

button 컴퍼넌트를 만든다. (버튼을 만드는 특별한 방법이 있지 않기 때문에 상술하지 않는다. 일반적인 컴퍼넌트 만들기와 다르지 않다)

빌드 환경을 구성하기 위해 tsconfig.json 파일을 만든다.

각 패키지별로 tsconfig.json 파일을 각자 가지고 있을 수 있지만 workspace를 통해 공통 속성은 공유 하도록 구성하려한다.

root 디렉토리에 `tsconfig.base.json` 파일을 생성한다. 이 파일에 공통 속성을 넣는다.

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  }
}
```

> tsconfig.base.json의 내용은 당연히 환경에 따라 상이할 수 있으며 위 설정은 기본적인 내용만을 포함하고 있다.

이제 button 컴퍼넌트 패키지 디렉토리에도 `tsconfig.json` 파일을 생성한다.

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### Typescript 환경 설정

이제 Button 컴퍼넌트 파일을 열어보면 아래와 같이 에러가 발생한 것을 확인 할 수 있다.

<figure>
  <img src="/examples/infrastructure/yarn-berry-monorepo/001.png" alt="소스 코드 상에서 발생하는 에러" />
  <figcaption>소스 코드 상에서 발생하는 에러</figcaption>
</figure>

이것은 코드상의 문제가 아니라 SDK(VSCode)의 모듈 참조 과정이 일반적이지 (기존 npm 또는 yarn과 다른 방식의 참조 방식을 사용하기 때문에) 않기 때문인데 이것을 해결하기 위해 yarn의 플러그인과 SDK 호환을 위한 extension을 설치해야 한다.

아래의 커맨드를 통해 SDK extension을 설치한다. (VSCode의 경우에 해당되며 yarn 공식 문서를 통해 다른 IDE를 사용할 경우에 대한 설명을 찾을 수 있다.)

```bash
yarn dlx @yarnpkg/sdks vscode
```

설치가 정상적으로 마무리되면 `.yarn/sdks` 경로에 새롭게 추가된 파일을 확인 할 수 있다.

그리고 vscode가 사용하는 typescript의 버전의 workspace에서 참조하도록 설정해야 한다.

> workspace의 typescript를 참조 할 수 없는 경우는 workspace root package.json이 typescript를 dependency로 가지고 있지 않을 경우이다.
> `yarn add typescript` 를 통해 디펜던시를 설치하게 되면 정상적으로 버전 선택이 가능하다.
>
> 이렇게 @yarnpkg/sdks 설치 이후에 typescript를 설치 했다면 `yarn dlx @yarnpkg/sdks` 명령을 통해 extension을 다시 설치해 줘야 한다.

`cmd + shift + p ⇒ select typescript version ⇒ use workspace version`

### 빌드 구성

이 예제에서는 간단히 `tsc` 만 수행하도록 진행할 예정이다.

button 디렉토리의 package.json 파일을 열어 아래의 스크립트를 추가한다.

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

아래의 커맨드를 실행하여 패키지 내부의 스크립트를 실행한다.

```bash
yarn workspace button build
```

빌드가 정상적으로 완료되면 `dist` 디렉토리 아래에 파일이 생성될 것이다.

## Utility library 추가

### 기본 디렉토리 구성 및 디펜던시 설치

본 예제에서는 스트링을 Capitalize 하는 라이브러리를 만드는 것을 예제로 한다.

`root/packages/utils/capitalize` 디렉토리를 생성하고 앞서 react 컴퍼넌트 생성과 동일한 방법으로 `package.json` 파일까지 만들어 준다.

마찬가지로 필요한 디펜던시를 설치한다. 예제의 경우 아래와 같다

```bash
yarn workspace capitalize add -D typescript
```

### 구현 및 빌드 환경 구성

문자를 전달 받아 대문자화 한 뒤 리턴하는 유틸리티 함수를 만들고 외부에서 사용 할 수 있도록 export 해준다.

```tsx
// root/utils/capitalize/index.ts

const capitalize = (text: string) => text.toUpperCase()

export default capitalize
```

이제 `tsconfig.json` 를 만든다 리엑트 컴퍼넌트 개발과 동일한 방식으로 root 디렉토리의 `tsconfig.base.json` 을 참조하도록 구성한다.

필요한 설정들이 있다면 추가한다.

capitalize 패키지의 package.json 파일을 열고 아래의 빌드 스크립트를 추가한다.

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

> 앞서 설정한 리엑트 컴퍼넌트의 빌드 커맨드와 동일한 명칭으로 생성하는 것이 좋다.
> 이후에 일괄적으로 스크립트를 실행하려면 동일한 이름을 기준으로 일괄 처리가 되기 때문이다.
> 물론 내용은 달라져도 된다.

스크립트를 작성한 뒤 아래의 명령어를 통해 빌드를 수행하고 확인한다.

## 여러 패키지 스크립트 한번에 실행하기

경우에 따라 모든 패키지를 순회하며 스크립트를 실행해야 할 때가 있다. (전체 패키지 빌드, 테스트 등)

이런 작업을 `lerna` 를 통해 수행할 수 있지만 yarn workspaces에서도 plugin을 통해 해당 기능을 사용 할 수 있다.

우선 plugin을 설치해야 하기 위해 아래의 커맨드를 입력한다.

```bash
yarn plugin import plugin-workspace-tools
```

> `yarn plugin list` 명렁을 통해 공식적으로 제공되는 plugin 리스트를 조회 할 수 있다.
> 더불어 plugin을 직접 개발해서 쓰기도 쉽다고하니 필요한 경우 고려해 볼만하다.

플러그인이 정상적으로 임포트 되면 `.yarn` 디렉토리를 통해 해당 사항을 확인 할 수 있고

아래의 명령어를 사용 할 수 있다.

```bash
yarn workspaces foreach run build
```

> 그 밖의 커맨드로는 `focus` 도 있다 사용법 및 역할은 [공식문서](https://github.com/yarnpkg/berry/blob/HEAD/packages/plugin-workspace-tools/README.md)를 참조

## 로컬 패키지 참조하기

이제 `Button` 컴퍼넌트에서 `capitalize` 유틸리티를 참조하도록 설정한다. monorep 구성의 궁극적인 목적은 로컬 패키지의 변경사항을 즉각적으로 다른 로컬 패키지에 적용하기 위함이다.

monorepo의 구성이 없다면 변경사항을 publishing하고 다시 다운 받는등 번거로운 작업을 수행해야하기 때문이데

button 컴퍼넌트 패키지의 package.json 파일을 열고 디펜던시를 추가한다.

```json
{
  "dependencies": {
    "capitalize": "workspace:*",
    "react": "^17.0.2"
  }
}
```

디펜던시를 추가 할 때 사용하는 `workspace:*` 버전 range를 통해 해당 패키지가 로컬 저장소에서 부터 참조된다는 것을 명시한다.

디펜던시 항목을 수정한 뒤에는 반드시 `yarn install` 을 실행해서 디펜던시 참조 관계를 다시 불러와야 한다.

불러온 패키지를 Button 컴퍼넌트가 사용하도록 수정한 뒤 정상적으로 빌드가 되는지 확인한다.

> 이렇게 설정된 로컬 디펜던시의 버전은 실제 `yarn (npm) publish` 또는 `yarn pack` 명령이 실행될 때 remote에서 사용 할 수 있는 버전으로 자동변환된다.

## Zero-install

zero install은 어렵게 생각할 것이 전혀 없다. 이미 한번 설치된 패키지를 통채로 저장소에 업로드 하는 것이다. 기존의 node_modules를 이용한 디펜던시 참조는 중복된 디펜던시를 설치하고 패키지의 내용이 커서 저장소에 올리는 일이 경우에 따라 불가능에 가까웠기 때문인데 yarn berry의 새로운 디펜던시 참조 설정을 통해 이것이 가능하게 됐다.

아래의 두가지 `.gitignore` 파일을 참조하여 zero-install 설정과 non-zero-install 설정의 차이를 살펴본다.

```bash
# Zero install

.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

```bash
# Non Zero Install
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.pnp.*
```

Zero install 설정을 진행 할 경우 `.pnp.*` 파일 (디펜던시의 참조 관계가 저장된 metadata)이 커밋 대상이 되고 `.yarn/cache` 의 내용이 커밋 대상이 되는 것을 확인 할 수 있다.

결과적으로 yarn install을 통해 생성 할 수 있는 파일과 설치 결과 자체를 저장소의 커밋 대상으로 만든다고 볼 수 있다.
