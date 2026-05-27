## Shadow DOM

웹 컴포넌트로 제작된 커스텀 엘리먼트는 `Shadow DOM` 영역에 존재하며 외부의 스타일 정의로 부터 독립적으로 동작할 수 있도록 돕고 컴포넌트 내부에서 발생하는 커스텀 이벤트의 버블링이 `Shadow DOM` 바깥의 영역까지 전파되어 발생 할 수 있는 side effect를 방지 할 수 있도록 돕는다.

이렇게 `encapsulation` 처리가된 커스텀 엘리먼트는 어떤 DOM Tree에 존재하더라도 항상 동일한 생김새와 기능을 보장 할 수 있다.

`Shadow DOM`은 구조적으로 아래의 용어로 세분화 할 수 있다.

- Shadow root
  - `Shadow root`는 `Shadow tree`의 관점에서 바라본 `root` 노드를 의미한다.
- Shadow host
  - `Shadow host`는 `Document tree`의 관점에서 바라본 `Shadow tree`의 `root` 노드를 의미한다.
- Shadow tree
  - `Shadow tree`는 `Document tree`와 상응하는 개념으로 `Shadow root`를 포함한 모든 하위 노드의 트리를 의미한다.
- Shadow boundary
  - `Shadow boundary`는 `Shadow DOM`과 `Document tree`의 경계를 의미한다.

## Document tree에 Shadow root 삽입하기

`Shadow root`를 생성하기 위해 `Element`의 `attachShadow` 메서드를 사용한다.

```javascript
const container = document.querySelector('div#container')
container.attachShadow({ mode: 'open' })
```

> 모든 엘리먼트에 Shadow DOM을 삽입 할 수 있을까?
>
> 보안상의 이유로 일부 엘리먼트에는 `shadow dom`을 삽입 할 수 없다. (ex. `anchor`)
> `shadow dom`을 삽입 할 수 있는 엘리먼트는
> 커스텀 엘리먼트와 `article`, `aside`, `blockquote`, `body`, `div`, `footer`, `h1~h6`, `header`, `main`, `nav`, `p`, `section`, `span`이 있다.

`attachShadow` 메서드는 `option`을 객체 형태의 매개변수로 전달 받는다. `option` 객체는 아래의 형식을 갖는다

```typescript
interface ShadowRootInit {
  mode: 'closed' | 'open'
  delegatesFocus?: boolean
}
```

### Open mode shadow root

`shadow dom`이 삽입 될 때 `mode` 프로퍼티를 `open`으로 설정하면 `JavaScript`를 통해 `shadowRoot`에 접근 할 수 있도록 허용한다.
`mode` 프로퍼티는 앞서 이야기한 캡슐화와 관계 없는 옵션으로 `open` 모드를 사용하더라도 캡슐화는 여전히 유효하다.

```javascript
document.body.attachShadow({ mode: 'open' })
console.log(document.body.shadowRoot) // #shadow-root (open)
```

### Closed mode shadow root

`shadow dom`이 삽입 될 때 `mode` 프로퍼티를 `closed`로 설정하면 `JavaScript`를 통해 `shadowRoot`에 접근 할 수 없게된다.

```javascript
document.body.attachShadow({ mode: 'closed' })
console.log(document.body.shadowRoot) // null
```

> Closed 모드를 사용하는 것은 엔드유저가 할 수 있는 일에 상당한 제약을 준다. 더불어 `closed` 모드를 사용하더라도 `shadow dom`에 우회적으로 접근할 수 있다.
> 특별한 이유가 없다면 `open` 모드를 사용하는 것이 좋다.

> Closed 모드인 shadow dom에 접근하는 방법
>
> ```javascript
> Element.prototype._attachShadow = Element.prototype.attachShadow
> Element.prototype.attachShadow = function () {
>   return this._attachShadow({ mode: 'open' })
> }
> ```

### delegatesFocus를 이용한 focus 지정

`shadow dom`은 또 다른 `shadow dom` 아래에 삽입 될 수 있다. 중첩된 `shadow dom` 중 상위 요소를 클릭 했을 때 focus가 대체될 대상 `shadow dom`을 생성하기 위해 `delegatesFocus` 속성을 사용한다.

```javascript
document.body.attachShadow({ mode: 'open' })

const shadowRoot = document.body.shadowRoot
shadowRoot.innerHTML = `
  <style>
    div {
      padding: 20px;
      background-color: tomato;
    }
  </style>
  <div></div>
`
const div = shadowRoot.querySelector('div')
const focusableInput = div.attachShadow({
  mode: 'open',
  delegatesFocus: true,
})
focusableInput.innerHTML = `<input placeholder="focusable" />`
```

위와 같은 형식으로 `DOM`과 `shadow DOM`이 구성되어 있다면 `input` 엘리먼트를 감싸고 있는 `div`의 여백 영역을 클릭하면 `input`으로 포커스가 이동하게 된다.

## Composed 속성을 이용한 Custom Event 전파

커스텀 엘리먼트를 만들게되면 `Event`를 통해 외부 요소와 커뮤니케이션 해야하는 일들이 빈번히 발생한다.
`click`, `touch`, `mouseover`와 같은 모든 UI 이벤트는 기본적으로 `composed` 속성이 설정되어 있고, 다시 말해 `shadow boundary`를 넘어 외부 `DOM` 요소로 이벤트가 전파된다. 하지만 `Custom Event`를 사용할 경우 기본적으로 `composed`가 `false`로 설정되어 있다. 다시 말해 `shadow boundary` 내부에서 생성된 `Custom Event`는 기본적으로 외부에서 이벤트를 위임할 수 없다는 의미가 된다.

예측할 수 없는 커스텀 엘리먼트의 이벤트 전파로 인해 발생할 수 있는 부작용을 차단하기 위함이지만 경우에 따라 버블링을 통한 이벤트 전파 및 위임이 필요하기도 하다.

```javascript
shadowElement.dispatchEvent(new CustomEvent('notify', {
  bubbles: true,
  composed: true
})
```

`composed` 속성은 반드시 `bubbles` 속성이 `true`일 때 의도와 같이 설정되고 마침내 상위 엘리먼트에서 하위의 `shadow dom`에서 발생한 custom event를 전파 받을 수 있게된다.

> Event capturing과 shadow DOM
>
> Event capturing은 shadow DOM에서 상위 엘리멘트로의 이벤트 전파가 아니기 때문에 `shadow DOM`의 존재 유무와 관계 없이 일반적인 형태로 흐른다.
