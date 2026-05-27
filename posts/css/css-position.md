## CSS의 Position 프로퍼티

CSS의 `Position` 속성은 문서상의 요소를 배치하는 방법을 지정한다. `Position` 속성의 값은 아래와 같다.

- Static
- Relative
- Fixed
- Sticky

### Static

요소를 일반적인 문서 흐름에 따라 배치한다. `top`, `right`, `bottom`, `left`, `z-index` 속성에 영향을 받지 않는다. _(기본값)_

### Relative

대상 엘리먼트의 `position`이 `static`일 경우의 위치로 부터 상대적 위치를 갖는다.

### Absolute

`position`이 지정된 _(static이 아닌 경우)_ 부모 요소를 기준으로 상대적인 위치를 갖는다. 다시말해 `position`이 지정된 부모 요소 내부에서 자유롭게 배치 할 수 있다. 만약 상위 요소중 `position`이 지정된 요소가 존재하지 않는다면 `body`를 기준으로 배치된다.

### Fixed

상위 요소를 기준으로 하는 것이 아닌 `viewport`를 기준으로 상대적인 위치에 배치된다.

### Sticky

부모 요소 내부에서 상대적인 위치에 배치된다. 부모요소의 스크롤이 변경됨에 따라 더이상 본래 위치를 유지할 수 없을 경우 부모 요소 내부에서 설장한 offset (left, right, top, bottom)을 기준으로 상대적인 위치를 유지한다.

## Absolute를 이용한 고정 헤더

```html
<html>
  <head>
    <style>
      html,
      body {
        margin: 0px;
        overflow: hidden;
        color: #fff;
      }
      #container {
        background-color: #999;
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      #header {
        background-color: #333;
        position: absolute;
        width: inherit;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="header">Header</div>
      <ul>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
      </ul>
    </div>
  </body>
</html>
```

<iframe src="/examples/css-position/absolute-header.html"></iframe>

## Fixed를 이용한 고정 헤더

```html
<html>
  <head>
    <style>
      html,
      body {
        margin: 0px;
        overflow: hidden;
        color: #fff;
      }
      #container {
        background-color: #999;
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      #header {
        background-color: #333;
        position: fixed;
        width: inherit;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="header">Header</div>
      <ul>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
      </ul>
    </div>
  </body>
</html>
```

<iframe src="/examples/css-position/fixed-header.html"></iframe>

## Sticky를 이용한 고정 헤더

```html
<html>
  <head>
    <style>
      html,
      body {
        margin: 0px;
        overflow: hidden;
        color: #fff;
      }
      #container {
        background-color: #999;
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      #header {
        background-color: #333;
        position: sticky;
        top: 0px;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="header">Header</div>
      <ul>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
      </ul>
    </div>
  </body>
</html>
```

<iframe src="/examples/css-position/sticky-header.html"></iframe>
