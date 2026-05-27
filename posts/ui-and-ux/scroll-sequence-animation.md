## Scroll Sequence Animation

<div align=center>

[Sample Page](/examples/scroll-sequence-animation/index.html)

</div>

요즘 많은 사이트에서 `Scroll Sequence Animation`을 이용한 화면들을 접할 수 있다. 나도 처음 이런 애니메이션 기법을 봤을 때 '오...'라며 감탄했던 기억이 있다.

처음으로 이 애니메이션을 접한 사이트는 apple의 제품 소개 페이지였던 것으로 기억하는데 그 이후로 종종 다른 사이트에서도 볼 수 있었다.

동일한 화면을 구현할 일이 없어 '나중에 필요할 때 해보지 뭐'라며 넘겼었는데 며칠 전 문득 포스팅을 하면서 한번 뜯어 봐야겠다는 생각이 들었다.

대부분의 Apple 제품 소개 페이지에서 볼 수 있는 애니메이션으로 특별히 샘플 이미지나 영상을 첨부하지 않아도 어떤 것인지 기억 할 수 있으리라 생각한다.

간단히 말로 풀어 정리하면... 사용자가 스크롤을 내리거나 올리는 것을 통해 이미지의 프레임을 앞/뒤로 넘기고 프레임이 넘어감에 따라 이어지는 영상과 같은 효과를 내는 것이 `Scroll Sequence Animation`이다.

## How to implement

그럼 내친김에 한번 만들어 봐야겠다.

우선 `Scroll Sequence Animation`을 구현하기 위해 메커니즘을 정리하고 시작한다.

1. 고정된 포지션에 이미지가 노출된다.
1. 노출된 이미지는 스크롤을 움직이더라도 처음 포지션을 그대로 유지한다.
1. 스크롤이 내려가거나 올라감에 따라 노출된 이미지가 변경된다.
   - 스크롤 가능한 영역의 높이와 전체 이미지수를 통해 스크롤 대비 프레임 인덱스를 계산하고 이를 기준으로 이미지를 변경한다
1. 스크롤 가능한 범위를 넘어설 경우 이미지는 더이상 고정되지 않고 화면에서 사라진다
   - 이렇게 하지 않을 경우 페이지의 다음 내용을 출력할 수 없을 것이다.

이제 하나씩 순서대로 구현해 보자.

### DOM 구조

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Scroll Sequence Animation</title>

    <style>
      html,
      body {
        margin: 0px;
        width: 100%;
        height: 100%;
      }

      main {
        height: 100%;
        overflow: auto;
      }

      .boundary {
        margin: 0px auto;
        height: 2400px;
      }

      .boundary.begin {
        background: rgb(2, 0, 36);
        background: linear-gradient(180deg, rgba(2, 0, 36, 1) 0%, rgba(250, 32, 74, 1) 50%, rgba(250, 32, 74, 1) 100%);
      }

      .boundary.end {
        background: rgb(2, 0, 36);
        background: linear-gradient(180deg, rgba(250, 32, 74, 1) 0%, rgba(250, 32, 74, 1) 50%, rgba(2, 0, 36, 1) 100%);
      }

      #wrapper {
        margin: 0px auto;
        height: 3600px;
        background-color: rgba(250, 32, 74, 1);
      }
    </style>

    <script defer src="./scroll-sequence.js"></script>
  </head>

  <body>
    <main>
      <div class="boundary begin"></div>
      <div id="wrapper"></div>
      <div class="boundary end"></div>
    </main>
  </body>
</html>
```

- `<main>` 스크롤이 가능한 전체 영역
- `<div class="boundary begin"></div>` 이미지에 앞서 나타나는 컨텐츠 영역
- `<div id="wrapper"></div>` 이미지가 출력되는 영역으로 해당 영역 내부에서 `<canvas>`가 생성됨
- `<div class="boundary end"></div>` 이미지에 이어 나타나는 컨텐츠 영역

### Canvas element 생성

이제 `JavaScript` 파일 (`scroll-sequence.js`)을 생성한다.
`<div id="wrapper"></div>` 아래에 `canvas` 엘리먼트를 생성해서 `append` 한다.
`canvas`의 너비와 높이는 `css`를 통해 설정하지 않고 `canvas` tag의 프로퍼티를 통해 결정한다.

> `css`를 통해 너비와 높이를 설정 할 경우 이미지의 해상도가 깨지기 때문에 반드시 프로퍼티를 통해 설정해야함

`<script></script>` 태그에 `defer` 어트리뷰트를 설정 했기 때문에 `<div id="wrapper"></div>`의 너비와 높이를 추출 할 수 있을 때 `script`가 실행된다.

> `async` & `defer`
>
> async
>
> async 어트리뷰트를 가지고 있는 script 태그는 DOM parsing을 블록하지 않고 스크립트를 다운로드 받게된다.
>
> 스크립트의 다운로드가 완료되는 즉시 실행된다.
>
> defer
>
> defer 어트리뷰트를 가지고 있는 script 태그 또한 DOM parsing을 블록하지 않고 스크립트를 다운받는다.
>
> defer script는 DOMContentLoaded 이벤트 이후에 실행되게 된다.

`<div id="wrapper"></div>`의 현재 너비를 추출하여 `canvas`를 생성한다.

```javascript
const wrapper = document.querySelector('#wrapper')
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d') // get 2D context
canvas.width = wrapper.offsetWidth
canvas.height = (canvas.width / 3) * 2 // 예제에서 사용할 이미지가 3:2 비율을 갖고 있기 때문에 `canvas`의 높이를 이와 같이 계산함

canvas.style.position = 'sticky' // wrapper 영역 내에서 상대 위치를 유지하기 위한 position
canvas.style.top = '50%' // 이미지가 정중앙에 표시되도록 하기 위한 style
canvas.style.transform = 'translateY(-50%)' // 이미지가 정중앙에 표시되도록 하기 위한 style

wrapper.append(canvas)
```

### Canvas API를 통한 이미지 그리기

`Canvas API`는 `JavaScript`와 `HTML canvas` 엘리먼트를 통해 브라우저 상에서 그래픽을 그리기 위한 수단으로 제공된다. 자세한 내용은 [이곳의 문서](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API)를 통해 확인 할 수 있다.

이번에 사용할 `canvas api`는 2D 컨텍스트의 `canvas`에 그림을 그려 넣는 `(drawImage)` 것으로 충분하다.

```javascript
const img = new Image()

img.onload = () => {
  context.drawImage(img, 0, 0, canvas.width, canvas.height)
}

img.src = 'PATH/TO/IMAGE.img'
```

위의 `syntax`를 통해 이미지를 로드하고 `canvas` 엘리먼트의 컨택스트를 통해 내부에 이미지를 그려낼 수 있다.

### Scroll 이벤트 등록 및 현재 프레임 계산

스크롤 가능한 영역 `<main>` 엘리먼트에 `scroll` 이벤트 리스너를 등록한다.

```javascript
const main = document.querySelector('main')
main.onscroll = onScrollHandler
```

`onScrollHandler` 함수에서는 `<main>` 엘리먼트의 `scrollTop`과 `startScrollY` 그리고 `standardHeight`를 통해 현재 출력돼야 하는 이미지의 index를 계산한다.

> startScrollY
>
> 스크롤에 의해 이미지 프레임을 증가/감소시킬 최소한의 y축 높이를 갖고 있는 변수
>
> standardHeight
>
> 프레임을 1 증가/감소시키기 위한 최소 scroll 높이로 canvas의 높이를 총 프레임수 (이미지 수)로 나눈 것과 같다

```javascript
const computeStartScrollY = () => {
  let prevElementSibling = wrapper.previousElementSibling
  let height = 0
  while (prevElementSibling) {
    height += prevElementSibling.offsetHeight
    prevElementSibling = prevElementSibling.previousElementSibling
  }

  return height
}

const startScrollY = computeStartScrollY()
const standardHeight = canvas.height / imageSources.length

const currentFrameIndex = () => {
  const index = Math.floor((main.scrollTop - startScrollY) / standardHeight)
  if (index < 0) return 0 // index가 음수일 경우 스크롤이 아직 startScrollY에 도달하지 못한 경우 => 첫번째 인덱스를 리턴
  if (!imageSources[index]) return imageSources.length - 1 // index를 통해 imageSource를 찾지 못하는경우 => 마지막 인덱스를 리턴

  return index
}

const render = () => {
  const frameIndex = currentFrameIndex()
  const image = new Image()
  image.src = imageSources[frameIndex]
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
}

const onScrollHandler = () => {
  requestAnimationFrame(render)
}
```

> `requestAnimationFrame`
>
> `requestAnimationFrame`의 콜백으로 등록된 함수는 Browser가 리페인트를 수행하기전에 호출된다.
> `requestAnimationFrame`에 콜백을 등록하는 것을 통해 `canvas`의 이미지를 안정적으로 갱신 할 수 있다
>
> `requestAnimationFrame`은 성능 및 베터리 수명을 고려하여 `hidden` 엘리먼트 또는 background 탭에서는 실행이 중단된다.

### 이미지 불러오기와 최적화

이미지는 `imagesSources`라는 배열에 이미지를 참조하기 위한 경로를 저장하도록 한다.

```javascript
const imageSources = Array(121)
  .fill('')
  .map((_, idx) => `./images/${String(idx + 1).padStart(3, '0')}.png`)
```

> 각 프레임에 해당하는 이미지는 일종의 규칙을 갖게 하여 코드를 통해 경로를 저장하도록 함
>
> 예제에서는 [001 ~ 121].png 까지 이미지 파일을 각 프레임으로 사용

이미지를 변수에 담았으니 앞서 정의한 `render` 함수를 통해 `canvas`에 이미지를 그려주면 되는데
프레임이 변경될 때마다 이미지를 다운받고 그리게 되면 이미지가 모두 다운로드 되기 전에 이미 다음 프레임을 보여줘야 할 때가 되었을 가능성이 크다.

이미지를 `preloading`하여 사전에 이미지를 다운 받아두고 `render`가 호출 될 때에는 `cache`된 이미지를 그리도록 해야한다.

```javascript
const preloadImages = () => {
  imageSources.forEach((imgSrc) => {
    const img = new Image()
    img.src = imgSrc
  })
}
```

### 초기 이미지 그리기

`canvas`에 이미지가 채워지는 시점은 `scroll` 이벤트가 발생 했을 때다. 만약 화면이 로딩되고 스크롤을 움직이지 않는다면 `canvas`는 비어 있는 상태일 것이다.
명시적으로 첫번째 이미지를 그리도록 하여 비어 있는 `canvas`가 노출 되지 않도록 한다.

```javascript
const initFirstFrame = () => {
  const image = new Image()
  image.src = imageSources[0]
  image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height)
}
```

### 그 밖의 최적화

아무래도 여러개의 이미지 파일을 다운받아야 하기 때문에 UX 및 성능상의 이슈를 고려해야한다.

- 네트워크 속도가 좋지 못하여 빠른 속도로 이미지를 다운 받지 못하는 환경
- 데이터 소모에 대해 거부감을 갖고 있는 사용자

등의 경우에 따라 에니메이션 효과를 적용하는 것이 아닌 대표 이미지만 나타내도록 하는 것이 방법이 될 것 같다.
