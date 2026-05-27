## Slot

`<slot>` 태그는 웹 컴포넌트 내 특정 영역의 `마크업`을 외부로 부터 주입 받기 위해 사용되는 태그다.

예를들면 `dialog` 컴포넌트 처럼 팝업이 나타나고 닫기 버튼을 통해 다시 팝업을 닫는 것과 같은 기능은 컴포넌트 내부에서 구현되지만 팝업의 내용을 채우기 위해서는 외부로 부터 `DOM`을 주입 받아야 하는데 이럴때 사용할 수 있는 태그가 `<slot>`이다.

### Slot 사용하기

`<slot>` 태그를 통해 커스텀 엘리먼트의 내부로 `DOM`을 넣는 예제는 아래와 같다.

```javascript
customElements.define(
  'custom-slot',
  class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = `
        <style>
          #container {
            padding: 20px 10px;
            background-color: skyblue;
          }
        </style>

        <div id="container">
          <slot></slot>
        </div>
      `
    }
  }
)
```

```html
...
<custom-slot>
  <p>Slotted</p>
</custom-slot>
...
```

`<slot>`은 `name` attribute를 통해 식별할 수 있다. 만약 `<slot>` 태그에 `name` attribute가 설정되어 있다면 외부에서 대상 `<slot>`을 식별 할 수 있도록 `slot` attribute를 통해 반드시 대상 `<slot>`의 `name`을 입력해야 한다.

```javascript
customElements.define(
  'custom-slot',
  class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = `
        <style>
          #container {
            padding: 20px 10px;
            background-color: skyblue;
          }
        </style>

        <div id="container">
          <slot name="first-slot"></slot>
          <slot name="second-slot"></slot>
        </div>
      `
    }
  }
)
```

```html
...
<custom-slot>
  <p>Slotted</p>
  <p slot="second-slot">Second Slotted</p>
  <p slot="first-slot">First Slotted</p>
</custom-slot>
...
```

위 예제와 같이 `<slot>`을 주입하고 `name`, `slot` attribute를 설정하면 아래와 같은 형태로 화면에 출력된다.

- `<p>Slotted</p>`는 `slot` attribute가 없어 대상 `<slot>`을 찾을 수 없기 때문에 화면에 출력되지 않음
- `<p slot="second-slot">Second Slotted</p>`과 `<p slot="first-slot">First Slotted</p>`은 `slot` attribute를 통해 대상 `<slot>`을 찾아 화면에 출력됨
- 화면에 출력된 두 `<p>` 태그는 주입시 순서와 달리 `<custom-slot>` 컴포넌트가 지정한 `<slot>`의 위치에 따라 순서가 바뀐 상태로 출력됨

> `<slot>` 태그에 `name`이 설정되어 있지 않다면 `<slot>` 태그에 주입되는 자식 요소중 `slot` attribute가 설정되지 않은 *모든 엘리먼트*를 `<slot>`에 삽입한다.
>
> `<slot>` 태그에 `name` attribute가 설정되어 있다면 `slot` attribute에 `name`과 동일한 값을 가지고 있는 *모든 엘리먼트*가 `<slot>`에 삽입 된다.

### Styling

`<slot>` 태그를 통해 외부에서 주입 받은 엘리먼트에 대한 스타일을 정의하기 위해 `::slotted` [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)를 사용한다.

`::slotted`를 이용한 `CSS`는 반드시 `shadow DOM` 내부에 정의해야 한다. 이렇게 정의된 `selector`는 `text node`를 제외한 `<slot>` 내부의 모든 엘리먼트를 대상으로 한다.

```javascript
customElements.define(
  'custom-slot',
  class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = `
        <style>
          #container {
            padding: 20px 10px;
            background-color: skyblue;
          }
          ::slotted(*) {
            font-size: 20px;
          }
          ::slotted([slot=first-slot]) {
            color: tomato;
          }
          ::slotted([slot=second-slot]) {
            color: green;
          }
        </style>

        <div id="container">
          <slot name="first-slot"></slot>
          <slot name="second-slot"></slot>
        </div>
      `
    }
  }
)
```

예제와 같은 style 정의를 통해 외부에서 전달 받은 엘리먼트에 대한 스타일을 적용할 수 있다.

> `[slot=second-slot]` 에서 확인 할 수 있듯 특정 attribute를 통해 대상 엘리먼트를 `select` 할 경우 외부에서 정의한 엘리먼트의 attribute를 참조한다.

## Dialog 만들기

`<slot>` 태그와 `::slotted` `pseudo element`를 이용해 외부에서 컨텐츠 영역의 `DOM`을 주입 할 수 있는 `custom dialog` 컴포넌트를 만든다.

```javascript
customElements.define(
  'custom-dialog',
  class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: none;
          }
          :host([open]) {
            display: initial;
          }
          #modal {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: black;
            opacity: 0.5;
            z-index: 1;
          }
          #dialog {
            position: absolute;
            background-color: white;
            border-radius: 6px;
            z-index: 2;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          #dialog > header {
            padding: 5px;
            display: flex;
            gap: 10px;
          }
          #close-button {
            margin: auto 0;
            border: none;
            background-color: transparent;
          }
          #content {
            padding: 10px;
          }
          ::slotted([slot=title]) {
            flex: 1;
            font-size: 1rem;
            font-weight: bold;
            padding: 10px 0;
            margin: 0;
          }
        </style>

        <div id="modal"></div>
        <section id="dialog">
          <header>
            <slot name="title"></slot>
            <button id="close-button">X</button>
          </header>
          <section id="content">
            <slot name="content"></slot>
          </section>
        </section>
      `
    }

    connectedCallback() {
      const closeButton = this.shadowRoot.querySelector('#close-button')
      closeButton.onclick = this.close.bind(this)
    }

    open() {
      this.setAttribute('open', '')
    }

    close() {
      this.removeAttribute('open')
    }
  }
)
```

`<custom-dialog>` 컴포넌트는 `title` 과 `content` 두개의 `slot` 영역을 가지고 있다. 각 영역에 기본적으로 적용되야 할 스타일은 `::slotted` `pseudo-elements`를 통해 정의되었고 `open`과 `close` 두개의 메서드를 제공한다.
