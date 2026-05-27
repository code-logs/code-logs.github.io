## 웹 컴포넌트

웹 컴포넌트는 존재하는 HTML `태그를 확장`하여 새로운 기능을 추가하고 `캡슐화`를 통해 외부 요소로 부터 독립적인 커스텀 엘리먼트를 제작하기 위한 웹 API의 모음이다.

웹 컴포넌트는 `웹 표준`을 따르기 때문에 대부분의 모던 브라우저에서 문제 없이 동작한다. 지금도 꾸준히 표준을 잡아가고 있으며 브라우저 `spec`이 계속해서 정립되고 있다.

### Why Webcomponent?

- 웹 컴포넌트는 `캡슐화`를 통해 기본적으로 외부 요소와 독립적으로 존재한다.

웹 컴포넌트 API를 통해 정의된 커스텀 엘리먼트는 캡슐화되어 존재하기 때문에 외부에서 주입되는 `style sheet`의 영향을 받지 않는다.
컴포넌트가 `부품`으로서의 가치를 갖기 위해서는 어떠한 환경에서 사용 되더라도 동일한 기능과 형태를 유지해야 한다. 이런 관점에서 웹 컴포넌트로 생성된 커스텀 엘리먼트는 `shadow root`라는 영역에 독립적으로 존재하며 외부의 `style sheet`에 의해 형태가 변형되지 않는다.

> 물론 필요에 따라 외부의 style sheet의 영향을 받도록 설정할 수 있다.

더불어 커스텀 엘리먼트 내부에서 발생하는 이벤트의 버블링은 기본적으로 `shadow root`를 벗어 날 수 없다. 이는 이벤트 버블링에 의해 야기될 수 있는 사이드 이펙트를 방지 할 수 있도록 돕는다.

- 표준 API를 사용해 어떤 라이브러리 또는 프레임워크를 통해 구성된 웹 앱에서도 동작 할 수 있다.

웹 표준 API를 통해 구현되는 커스텀 엘리먼트는 사용자의 브라우저 환경이 이를 지원한다면 (대부분의 모던 브라우저가 지원하고 있다.) 별도의 라이브러리에 의존하지 않는다. 다시말해 `React`로 구성 되었건 `Vue`로 구성 되었건 화면의 일부 요소는 얼마든지 `custom element`로 구현 할 수 있다.
`어떤 환경에서도 사용 할 수 있는 것` 또한 컴포넌트로서의 가치를 증가 시킬수 있는 요소다.

## 커스텀 엘리먼트

커스텀 엘리먼트는 `CustomElementRegistry` 객체를 통해 제어 할 수 있다. `CustomElementRegistry` 객체의 `define` 메서드를 통해 새로운 커스텀 엘리먼트를 등록하게 된다.

커스텀 엘리먼트는 반드시 `kebab-case` 형식의 명칭을 사용해야 하는데 이는 미래에 추가될 `html` 네이티브 태그와 구분하기 위함이다. (새롭게 추가될 html 태그는 절대 `-`을 포함하지 않을 것이기 때문에) - [Custom element naming convention](https://html.spec.whatwg.org/#valid-custom-element-name)

### 커스텀 엘리먼트 등록하기

```javascript
window.customElements.define('custom-element', CustomElement)

// or

window.customElements.define('custom-element', CustomElement, { extends: 'form' })
```

`define` 메서드는 다음 세가지의 매개변수를 전달 받을 수 있다.

- DOMString: 커스텀 엘리먼트의 이름
- class 객체: 커스텀 엘리먼트의 동작을 정의한 `class` 객체
- `optional` extends 속성: 현재 커스텀 엘리먼트가 상속 받는 대상 태그

### 생명주기

커스텀 엘리먼트를 등록하기 위해 동작에 대한 정의를 담고 있는 class 객체를 생성해야한다.
class 객체는 생명주기를 갖고 있으며 생명주기에 따라 적절한 동작을 정의해야한다.

- constructor: 커스텀 엘리먼트의 인스턴스가 생성될 때마다 호출됨
- connectedCallback: 커스텀 엘리먼트가 `document`에 추가될 때마다 호출됨
- disconnectedCallback: 커스텀 엘리먼트가 `document`에서 제거 될 때마다 호출됨
- adoptedCallback: 커스텀 엘리먼트가 새로운 `document`로 이동할 때마다 호출됨
- attributeChangedCallback: 커스텀 엘리먼트의 attribute가 변화할 때 마다 호출됨

이런 생명주기를 통해 이벤트 리스너를 등록/제거 하거나 특정 속성의 변화에 따른 동작을 구현할 수 있고 데이터 패칭과 같이 컴포넌트 초기화 시점에 필요한 상태들을 설정할 때 사용할 수 있다. - [https://web.dev/custom-elements-v1/#custom-element-reactions](https://web.dev/custom-elements-v1/#custom-element-reactions)

> attributeChangedCallback(attrName, oldVal, newVal)
>
> `attributeChangedCallback`은 상기와 같은 매개변수를 전달 받는다. 이렇게 attributeChangedCallback을 통해 관리 돼야하는 `attribute`는 반드시 객체 내부의 `observedAttributes` 배열로 작성되어야 한다.

## custom-form

앞서 살펴본 커스텀 엘리먼트의 기본적인 요소들을 바탕으로 `custom-form`을 작성한다.
`custom-form`은 기존 `form` 태그를 상속 받아 `serialize`라는 내부 메서드를 갖는다.

`serialize` 메서드는 `form` 내부에 정의된 입력 요소들 (`input`, `select`, `textarea` 와 같은)의 값을 추출하고 입력된 `type`에 따라 값을 변형하여 return하는 역할을 하게 된다.

### custom-form 등록하기

```javascript
class CustomForm extends HTMLFormElement {}

window.customElements.define('custom-form', CustomForm, { extends: 'form' })
```

### custom-form 내부 메서드 정의하기

```javascript
class CustomForm extends HTMLFormElement {
  serialize() {
    const elements = Array.from(this.querySelectorAll('input,select,textarea'))
    if (elements.some((element) => !element.name)) {
      throw new Error('Failed to find field name')
    }

    let result = {}

    elements.forEach(({ name, type, value, checked }) => {
      switch (type) {
        case 'number':
          result[name] = Number(value)
          break

        case 'checkbox':
          result[name] = checked
          break

        default:
          result[name] = value
      }
    })

    return result
  }
}

window.customElements.define('custom-form', CustomForm, { extends: 'form' })
```

`CustomForm` class 내부에 `serialize`라는 명칭의 메서드를 정의한다. `form` 내부에 존재하는 입력 요소들을 찾아 필드 명칭을 확인하고 데이터 유형에 따라 변형한 값을 객체에 담아 반환한다.

### custom-form HTML에서 사용하기

```html
...

<script defer src="./custom-form.js"></script>

...

<form id="custom-form" is="custom-form">
  <input type="text" name="text" />
  <input type="number" name="number" />
  <input type="date" name="date" />
  <input type="checkbox" name="checkbox" />
  <textarea name="textarea"></textarea>
  <select name="option">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</form>

...

<script>
  const formData = document.querySelector('#custom-form').serialize()
  console.log(formData)
</script>
```

예제에서 처럼 기존의 HTML 태그를 상속 받아 사용할 경우 `is` 속성을 통해 사용하고자 하는 커스텀 엘리먼트의 명칭을 입력한다.

## counter-button

버튼을 클릭하면 숫자가 올라가는 간단한 커스텀 엘리먼트를 작성한다. 기존에 존재하는 태그의 기능을 상속 받지 않는 완전히 새로운 형태의 커스텀 엘리먼트다.

### counter-button 등록하기

```javascript
class CounterButton extends HTMLElement {}

window.customElements.define('counter-button', CounterButton)
```

### counter-button 내부 메서드 정의하기

`constructor`가 호출되는 시점에 `counter-button`의 shadowRoot 생성하고 shadowRoot 아래에 캡슐화된 UI 요소들을 삽입한다.

```javascript
class CounterButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>
        span {
          font-size: 20px;
        }
      </style>

      <span id="display"></span>
      <button id="button">+</button>
    `
  }
}

window.customElements.define('counter-button', CounterButton)
```

`connectedCallback` 라이프 사이클을 통해 버튼 엘리먼트에 이벤트 리스너를 등록한다.
`getter`를 정의해서 커스텀 엘리먼트 내부의 요소에 쉽게 접근 할 수 있도록 한다.

```javascript
class CounterButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>
        span {
          font-size: 20px;
        }
      </style>

      <span id="display"></span>
      <button id="button">+</button>
    `
  }

  get display() {
    return this.shadowRoot.querySelector('#display')
  }

  get button() {
    return this.shadowRoot.querySelector('#button')
  }

  connectedCallback() {
    if (this.isConnected) {
      this.button.addEventListener('click', () => {
        this.buttonClickHandler()
      })
    }
  }

  buttonClickHandler() {
    const currentNumber = this.display.textContent ? Number(this.display.textContent) : 0
    this.display.textContent = currentNumber + 1
  }
}

window.customElements.define('counter-button', CounterButton)
```

### counter-button Property를 통해 커스텀 엘리먼트 값 변경하기

```javascript
class CounterButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>
        span {
          font-size: 20px;
        }
      </style>

      <span id="display"></span>
      <button id="button">+</button>
    `
  }

  get display() {
    return this.shadowRoot.querySelector('#display')
  }

  get button() {
    return this.shadowRoot.querySelector('#button')
  }

  connectedCallback() {
    if (this.isConnected) {
      this.button.addEventListener('click', () => {
        this.buttonClickHandler()
      })
    }
  }

  attributeChangedCallback(props, oldValue, newValue) {
    if (props === 'count') {
      this.countChangeHandler(newValue)
    }
  }

  static get observedAttributes() {
    return ['count']
  }

  buttonClickHandler() {
    const currentNumber = this.display.textContent ? Number(this.display.textContent) : 0
    this.display.textContent = currentNumber + 1
  }

  countChangeHandler(newValue) {
    this.display.textContent = newValue
  }
}

window.customElements.define('counter-button', CounterButton)
```

`attributeChangedCallback`과 `observedAttributes` 메서드를 구현하여 커스텀 엘리먼트의 `attribute`의 변화를 감지하고 값을 반영 할 수 있도록 한다.

### counter-button HTML에서 사용하기

```html
...

<script defer src="./counter-button.js"></script>

...

<counter-button></counter-button>

<!-- or -->

<counter-button count="20"></counter-button>

...
```

## 마치며

커스텀 엘리먼트를 만드는 방법에 대해 간단하게 정리했다. Web Component의 주요 개념을 이해하기 위해서는 `shadow dom`에 대한 이해도 필요하다고 생각한다.
다른 포스팅을 통해 `shadow dom`에 대해 정리해야겠다.
