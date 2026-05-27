## Package Manager

`pnpm`을 패키지 매니저로 사용하도록 설정해야 한다 이미 `pnpm`을 프로젝트의 패키지 매니저로 사용하고 있다면 현재 과정은 생략한다.

### pnpm-workspace.yaml 파일 생성

기존에 `pnpm`을 사용하지 않았다면 `package.json`에 설정되어 있는 `workspace`를 `pnpm-workspace.yaml` 파일을 통해 참조 할 수 있도록 `pnpm-workspace.yaml` 파일을 생성해야 한다.

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

> `package.json` 파일에 있는 `workspace` 설정은 제거한다.

### pnpm-lock.yaml 파일 생성

정상적으로 `pnpm`을 통한 `workspace` 설정이 완료되면 `pnpm install` 커맨드를 통해 `pnpm-lock.yaml` 파일을 생성한다. 이후 `Docker`를 통해 빌드를 진행할 때 lock 파일을 바탕으로 개발환경과 동일한 디펜던시를 설치하기 위해 빌드를 시작하기 전에 반드시 lock 파일을 생성해야 한다.

## package.json

`pnpm -v` 커맨드를 통해 현재 설치된 `pnpm`의 버전을 확인하고 `package.json`에 `packageManager` 프로퍼티를 아래와 같은 형태로 수정한다.

```json
{
  ...
	"packageManager": "pnpm@8.1.1"
  ...
}
```

## dockerignore

### node_modules

`pnpm`을 통해 패키지를 설정하면 모노리포의 애플리케이션 디렉토리에 설치되는 모듈은 `symbolic link`를 통해 `workspace` 루트의 모듈을 참조한다.
`Docker` 빌드 과정에서 설치한 모듈을 복사하게 되는데 이렇게 링크로 생성된 파일은 에러를 발생 시킨다.

> `symbolic link`를 통한 참조는 실행환경에 따라 다르기 때문에 `Docker`를 통한 빌드가 항상 동일한 결과를 만든다는 것을 보장 할 수 없기 때문에 `symbolic link`를 빌드 과정에 개입 시키는 것을 방지하고 있다.

`dockerignore` 파일에 `**/node_modules`를 추가해서 모든 루트 디렉토리 뿐 아니라 하위 패키지에 설치된 `node_modules` 디렉토리도 복사 대상이 되지 않도록 제외해야 한다.

### out

`Docker`는 빌드시 생성된 파일을 캐싱하고 캐싱 된 레이어를 통해 동일한 작업을 반복하지 않도록 하여 성능을 최적화 한다.

`Dockerizing` 대상이 되지 않는 파일의 `package.json`을 빌드 대상에 포함 시키면 빌드와는 관계가 없는 모듈의 패키지 의존 정보가 변경됨에 따라 캐싱된 레이어를 파기하고 다시 한번 불필요한 빌드 과정을 수행하게 된다. 결과적으로 `Dockerizing`의 성능 최적화 이점을 사용 할 수 없게 된다.

`turbo`는 이런 최적화를 그대로 사용 할 수 있도록 `prune` 커맨드를 제공한다. `prune` 커맨드를 실행하면 특정된 `scope`와 관계 있는 패키지들의 `package.json` 파일을 추출하고 `out` 디렉토리에 저장한다.

```sh
$ turbo prune --scope=<target>
```

`out` 디렉토리가 `dockerignore`에 포함되지 않은 상태로 이미지 빌드를 하게 되면 `out` 디렉토리가 이미지 안쪽에 복사되는 문제가 발생 할 수 있다. `docker` 이미지 빌드 시점에 `out` 디렉토리가 `COPY` 커맨드의 대상이 되지 않도록 `dockerignore`에 추가한다.

> `turbo` 프로젝트를 스캐폴딩하고 나면 기본적으로 `out` 디렉토리는 `gitignore` 항목으로 추가되어 있다.
> 일반적으로 `github action`과 같은 `CI/CD` 툴을 사용한다면 소스 코드를 remote 저장소에서 가지고 오기 때문에 `out` 디렉토리가 존재하지 않는다.

## Dockerfile

### pnpm 스크립트 사용

패키지 설치, 빌드를 위해 실행하는 커맨드를 `pnpm`을 사용하도록 수정한다.

패키지 설치 스크립트는 `---frozen-lockfile` 옵션을 추가해서 `pnpm-lock.yaml` 파일을 참조하여 개발환경과 정확히 일치하는 디펜던시를 설치 할 수 있도록 강제해야 한다.

> `pnpm`을 통해 스크립트를 실행해야 하는 `intermediate layer`에서 커맨드 실행전 `npm`을 통해 `pnpm`을 전역에 설치 할 필요가 있다.

## next.config.js

### `experimental.outputFileTracingRoot`

`pnpm`을 통해 모노리포 환경에서 디펜던시를 설치하게 되면 앞서 이야기한 바와 같이 모든 디펜던시를 프로젝트의 루트 디렉토리에 설치하게 된다. 최종적으로 서버를 실행하는데 사용되는 `server.js` 파일은 이런 구조에 대한 참조를 정확히 하고 있지 않다. `Next.js`는 이런 경우를 위한 옵션을 제공하는데 `experimental.outputFileTracingRoot` 설정을 통해 `server.js` 파일과 동일한 디렉토리에 모듈이 설치 될 수 있도록 한다.

```json
{
  // next.config.js
  ...
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../) // 패키지의 애플리케이션 디렉토리 부터 프로젝트 루트 까지 경로를 설정
  },
  ...
}
```
