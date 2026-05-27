## What is Heroku?

`Heroku`는 2007년 6월 개발이 시작된 최초의 클라우드 플랫폼 중 하나다.

[PaaS](https://en.wikipedia.org/wiki/Platform_as_a_service) 형태의 클라우드 서비스로 처음에는 `Rails` 앱의 배포 및 관리를 지원하는 플랫폼이였고 현재는 `Java`, `Node.js`, `Scala`, `Clojure`, `Python`, `PHP`, `Go`를 지원한다.

`Heroku`는 `Heroku CLI`를 제공하며 이를 통해 애플리케이션의 배포 및 관리 등의 작업을 수행 할 수 있도록 돕고 `GitHub`와의 연동을 통해 저장소의 변경사항을 감지하고 자동배포 하는 등의 기능을 제공한다.

`Heroku`를 이용해 `Node.js` 애플리케이션을 배포하고 `GitHub`와의 연동 설정을 통해 최신화된 소스 코드를 자동으로 배포 할 수 있는 환경구성 과정을 기록한다.

## Heroku CLI 설치하기

`Heroku CLI`는 애플리케이션 배포 및 로그 확인 등 전체적인 애플리케이션 관리를 위해 사용된다.

다음 [링크](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)를 통해 설치 패키지를 다운받고 OS 환경에 맞는 설치를 진행한다.

## 배포의 시작 - Heroku create

배포하려는 Node.js 프로젝트의 root 디렉토리로 이동한다. 해당 디렉토리는 GitHub에 업로드된 상태여야 한다. (.git 디렉토리가 있어야 한다.)

프로젝트 root 디렉토리에서 아래의 커맨드를 통해 애플리케이션을 생성한다.

```bash
$ heroku create ${APPLICATION_NAME} --region ${REGION}
```

`APPLICATION_NAME`과 `REGION`은 필수값이 아니며 해당 옵션들이 없는 상태에서도 애플리케이션 생성을 진행 할 수 있다.

> **APPLICATION_NAME**
>
> `APPLICATION_NAME`을 설정하지 않으면 임의이 문자가 자동으로 생성된다. 원하는 이름이 있다면 입력하면 된다.
> `APPLICATION_NAME`은 이후 서비스에 접근하기 위한 URL을 구성하는데 사용되기 때문에 알파벳과 숫자 그리고 `-` 만 입력할 수 있다.

> **Region**
>
> 다른 클라우드 서비스와 마찬가지로 서버의 지리적 위치를 선택하는 옵션이다. 서비스가 주로 제공될 지역에서 부터 물리적으로 가까운 곳에 위치한 데이터센터를 선택하는 것이 더 좋은 네트워크 성능을 제공 받는데 도움이 된다.
>
> `heroku regions` 커맨드를 통해 사용 가능한 region 리스트를 확인 할 수 있으며, `Heroku`는 외부에 공개 할 용도의 `Common Spaces` 유형과 분리된 네트워크 환경을 갖는 `Private Spaces` 유형을 제공한다.

## 배포하기 - Heroku 원격 저장소로 Push

애플리케이션 생성이 완료되면 새로운 `git remote` 저장소가 정의된 것을 확인 할 수 있다.

```bash
$ git remote -v
heroku	https://git.heroku.com/application-name.git (fetch)
heroku	https://git.heroku.com/application-name.git (push)
```

아래의 커맨드를 통해 `heroku` 원격 저장소에 소스 코드를 push 한다.

```bash
$ git push heroku main
```

> **애플리케이션 디펜던시 설정**
>
> `heroku`는 `package.json` 파일의 존재를 확인하고 Node.js 프로젝트임을 감지한 뒤 `package-lock.json` 파일을 통해 필요한 디펜던시를 확인하고 설치하게 된다. (yarn을 사용할 경우 yarn-lock.json 파일) 따라서 프로젝트의 디펜던시를 설치한 이후 생성되는 `package-lock.json` 또는 `yarn-lock.json` 파일을 커밋하는 것이 좋다.

push 커맨드를 실행하면 소스코드를 업로드 하고 빌드와 배포를 자동으로 진행하게 된다.

배포된 애플리케이션은 적어도 한개 이상의 노드에서 실행돼야 한다. 아래의 커맨드를 통해 실행중인 노드의 정보를 확인 할 수 있다.

```bash
$ heroku ps:scale
```

## 앱 실행을 위한 스크립트 정의 - Procfile

`heroku`는 배포된 파일을 통해 해당 프로젝트가 어떤 언어의 프로젝트인지 판단한다. Node.js의 경우 `package.json` 파일로 Node.js 프로젝트임을 확인하고 `scripts` 프로퍼티를 통해 애플리케이션을 실행하기 위해 필요한 작업들은 진행한다.

변경사항을 `heroku` [원격 저장소에 push](#배포하기---heroku-원격-저장소로-push) 하면 로그를 출력하는데 이 로그를 통해 `heroku`가 어떤 작업들을 수행하는지 확인 할 수 있다.

간추려서 이야기 해보면 `node 설치` → `npm 또는 yarn 설치` → `dependency 설치` → `build script 실행` → `dev dependency 삭제` → `start script 실행`의 순서로 작업을 수행하게 된다.

> **Build script 실행**
>
> build script를 실행 할 때 heroku는 기본적으로 `build`라는 명칭의 스크립트를 찾고 있다면 이것을 실행한다.
>
> **Start script 실행**
>
> start script를 실행 할 때 heroku는 기본적으로 `start`라는 명칭의 스크립트를 찾고 있다면 이것을 실행한다.

> **devDependency prune**
>
> heroku는 배포 프로세스를 수행하고 가장 마지막 단계에서 devDependency를 삭제하는 절차를 포함하고 있다. (저장공간의 점유를 최소화 하기 위함이 아닐까 생각이 든다.)
>
> 사용자로서 주의할 점은 devDependency가 이미 삭제된 이후 devDependency에 의존적인 작업을 수행 할 경우가 있는데 (ex. data migration) 이 경우 해당 작업을 정상적으로 수행할 수 없다.
>
> Heroku는 이런 추가적인 작업을 특정 시점에 수행 할 수 있도록 빌드 스탭에 따른 스크립트 정의를 지원한다. - [참조](https://devcenter.heroku.com/articles/nodejs-support#heroku-specific-build-steps)

`Procfile`은 애플리케이션 실행시 실행할 커맨드를 정의할 수 있는 파일이다. 프로젝트 root 디렉토리에 파일을 생성하고 `<process>: <command>`의 형태로 내용을 추가하면 `Heroku`는 이 파일을 기준으로 커맨드를 실행하게 된다.

```
web: npm start
```

그 밖의 다양한 커맨드를 설정 할 수 있으며 자세한 내용은 [가이드](https://devcenter.heroku.com/articles/procfile)를 참조

## 자동배포 - GitHub로 간단하게

GitHub 연동은 [heroku 사이트](https://heroku.com/)에서 아주 간단히 설정 할 수 있다.

애플리케이션이 정상적으로 생성 되었다면 heroku 사이트에 로그인한 뒤 생성한 애플리케이션 목록을 확인 할 수 있다.

애플리케이션 목록을 클릭해 상세 설정으로 이동 → `Deploy` 메뉴로 이동한다.
`Deploy method` 중 GitHub을 선택하고 `인증` → `배포 대상 브랜치 선택`만 해주면 자동배포 설정이 완료된다.

## Scaling - Scale up/down & Scale out/in

아래의 커맨드를 통해 현재 배포된 애플리케이션이 몇개의 노드를 통해 서비스 되고 있는지 확인 할 수 있다.

```bash
$ heroku ps:scale
web=1:Free
```

`heroku ps:scale` 커맨드를 통해 확인한 web=1:Free는 `Dynos유형:Dynos수량:Dynos크기`의 조합이다.

> **Dynos**
>
> `Dynos`는 일반적으로 node, instance 또는 container라고 부르는 실행환경을 의미한다

### Scale up/down

Scale up/down은 Dynos 크기를 조절하여 더 높거나 낮은 성능의 node를 사용하도록 변경하면 된다.

```bash
$ heroku ps:scale web=1:hobby
```

> Free Dynos를 제외한 다른 유형의 Dynos는 결제 정보가 입력된 사용자에 한해 사용설정 할 수 있다.

### Scale out/in

Scale out/in은 Dynos 수량을 조절하는 것을 통해 가능하다.

```bash
$ heroku ps:scale web=2
```

`web` 유형의 dynos는 무료 서비스로 위 커맨드를 그대로 실행 할 경우 무료 서비스에 한해 *스케일 아웃 할 수 없다*는 에러 메시지가 출력된다.

> **Dynos types**
>
> Dynos는 `Web`, `Worker`, `One-off` 세가지 유형이 존재한다.
> 배포하고자 하는 애플리케이션의 성격에 맞는 Dynos를 선택해야한다.
> `Web`은 일반적인 Web application을, `Worker`는 Batch 성향의 백그라운드 프로세스를, `One-off`는 idle 상태를 유지하다 필요한 순간에만 active 되는 서비스를 배포하기에 적절한 유형이다 - [자세히 보기](https://devcenter.heroku.com/articles/dynos#dyno-configurations)
>
> **Dynos 크기**
>
> Dynos 크기는 쉽게 이야기해서 하드웨어 성능을 의미한다.
> Heroku가 제공하는 Dynos 크기의 종류 및 각 크기별 spec은 [링크](https://devcenter.heroku.com/articles/dyno-types)를 통해 확인 할 수 있다.

## 그 밖의 내용

### 서비스 로그 보기 - Heroku logs

아래의 커맨드를 통해 실행중인 서비스가 출력하는 로그를 확인 할 수 있다.

```bash
$ heroku logs --tail
```

### Local 환경에서 애플리케이션 실행하기

다음 커맨드를 통해 local 환경에서 애플리케이션 실행을 할 수 있다.

```bash
$ heroku local web
```

위 커맨드를 통해 local 환경에서 애플리케이션을 실행 할 경우 `heroku`는 `Procfile`을 참조하여 실행 할 스크립트를 판단한다.

### 서비스 접속하기 - Heroku open

아래 커맨드를 입력하여 브라우저를 통해 서비스에 접근할 수 있다.

```bash
$ heroku open
```

### Heroku 내부가 궁금 할 때 - Heroku run bash

아래 커맨드를 통해 `heroku` 노드 내부를 탐색 할 수 있다.

```bash
$ heroku run bash
```

### 명령어와 로그 보기 - DEBUG=\*

heroku 커맨드를 실행할 때 아래와 같이 `DEBUG=*` prefix를 주면 DEBUG 콘솔이 활성화 되어 문제가 발생 했을때 어떤 프로세스에서 문제가 발생했는지 조금 더 상세히 파악 할 수 있다.

```bash
$ DEBUG=* heroku local web
```

### Project 커맨드 실행하기 - Heroku run cmd

`Heroku` 노드 내부에서 어떤 커맨드를 실행하고 싶다면 아래의 명령어를 사용한다.

```bash
$ heroku run echo HelloWorld
```

### Heroku 무료요금 정책

작성일 기준 Web dyno는 기본적으로 무료지만 몇가지 제약 조건이 있다.

**Sleep 상태로 전환**

30분 동안 트래픽이 발생하지 않을 경우 IDLE 상태로 전환되고, 다시 트래픽이 발생하면 약간의 delay를 두고 활성화 됨 (노드가 잠시 IDLE 상태로 전환 되었다가 다시 올라오는 것이 아닌 노드 자체가 Reset 되는 것 처럼 보인다. 예를들어 `sqlite` 데이터베이스를 파일형태로 가지고 있었다면 데이터베이스 파일도 삭제된다.)

**Dyno hour pool**

사용자는 매달 web dyno를 운영 할 수 있는 시간의 제약이 있다. 기본적으로는 매달 550 시간이 주어지고 유효한 결재정보를 입력한 사용자의 경우 추가적으로 450 시간의 무료 이용 시간을 제공 받을 수 있다. 아래 명령을 통해 잔여 시간을 확인 할 수 있다.

```bash
$ heroku ps -a ${APPLICATION_NAME}`
Free dyno hours quota remaining this month: 1000h 0m (100%)
Free dyno usage for this app: 0h 0m (0%)
```

## 마치며

블로그에서 사용할 [hit-counter](https://github.com/code-logs/hit-counter)를 개발해서 배포하려다가 예전에 해봤던 heroku를 통해 배포하기로 결정했고 그참에 다시금 heroku를 조금 더 상세히 확인하는 계기가 되었다. ~~데이터베이스가 휘발되는 바람에 기껏 만들고 사용은 안하게 됐다~~

이전에 사용경험이 그리 좋지 않았는데 아무래도 당시 내가 이해하기에는 조금 버거운 내용들이 있어서 그랬던게 아닐까 생각하게 된다.

다시 사용해 본 heroku는 상당히 많은 부분이 자동화 되어 있고 정말 편하게 배포를 할 수 있다는 인상을 받았다 또 적재적소에 커스터마이징 할 수 있는 요소들을 제공해서 배포 과정에 고민하게 되는 많은 문제점들을 해결 해 줄 수 있으리라는 생각도 들었다.

배포에 필요한 꽤 많은 부분에 대해 정리했다고 생각이 드는데 heroku가 제공해주는 기능중 극히 일부분만 정리된 것이라는 것도 참 놀라운 일이다.
