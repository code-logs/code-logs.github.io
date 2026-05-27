## 고차 컴포넌트란?

컴포넌트를 이용한 웹개발은 재사용성을 확보하는데 아주 큰 의미가 있다. 일회성으로 사용되고 다시는 사용 할 수 없는 컴포넌트는 컴포넌트 그 자체의 의미를 잃어버리는 것이다.

### 정의

고차 컴포넌트는 컴포넌트의 재사용을 위해 사용 할 수 있는 `패턴`으로 특정 컴포넌트가 가지고 있는 로직을 재사용할 수 있도록 돕는다.

고차 컴포넌트는 아래와 같이 컴포넌트를 함수의 인자로 받아 새로운 컴포넌트를 리턴하는 형식을 갖느다.

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent)
```

> 고차 컴포넌트(HOC)는 React API의 일부가 아니며, React의 구성적 특성에서 나오는 패턴입니다. - [React Docs](https://ko.reactjs.org/docs/higher-order-components.html)

## 고차 컴포넌트를 사용하는 이유

서두에 이야기한 것 처럼 고차 컴포넌트는 **컴포넌트가 가지고 있는 로직을 재사용**하기 위해 사용한다. 간단히 말하면 재사용성을 확보한다는데 의미가 있으며 이를 통해 **횡단 관심사** 문제를 해결 할 수 있다.

> 횡단 관심사 (Cross cutting concerns)
>
> 어떤 시스템의 본래 목적을 위한 기능들을 핵심 관심사라하며 핵심 관심사를 수행하기 위한 절차에 반복적으로 등장하는 기능이 횡단 관심사다.
>
> 핵심 관심사를 수행하기 위해 발생하는 클라이언트의 요청을 완료하기 까지 매번 발생하게 되는 `인증 확인`, `로그 생성`과 같은 것을 예로 들수있다.

## 고차 컴포넌트 사용방법

고차 컴포넌트를 사용하기 위해 아래의 몇가지 규칙을 따라야한다.

- 고차 컴포넌트는 컴포넌트를 리턴해야한다.
- 일반적으로 고차 컴포넌트 생성 함수의 명칭은 `with___` 형태를 갖는다.
- 클래스 컴포넌트를 이용할 경우 고차 컴포넌트는 기존 컴포넌트의 static method를 갖지 않기 때문에 이를 복사해 줘야 한다.
  - [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)를 사용하여 이를 편히 해결 할 수 있다.
- 클래스 컴포넌트를 이용할 경우 `render` 함수 내부에서 고차함수를 호출해선 안된다.
  - render가 발생 할 때 마다 새로운 고차함수를 만들어내게 되고 그 결과 내부로 전달되었던 property와 컴포넌트가 가지고 있던 state가 손실되기 때문
- ref는 전달되지 않는다.
  - ref는 React에서 일반적인 props와 동일하게 취급되지 않기 때문에 ref를 전달할 경우 내부 컴포넌트가 전달되는 것이 아닌 가장 바깥쪽 컨테이너 컴포넌트를 가르키게 된다.
  - 이를 해결하기 위해서는 [React.forwardRef API](https://ko.reactjs.org/docs/forwarding-refs.html)를 사용해야 합니다.

### Sample

다음 이야기를 기준으로 컴포넌트를 개발해 보도록 한다.

버튼을 클릭하면 클릭한 횟수를 표시하는 버튼 컴포넌트를 개발해야 한다.

```javascript
// ClickCounterButton.jsx
const ClickCounterButton = () => {
  const [count, setCount] = useState(0)

  const increaseCount = () => {
    setCount(count + 1)
  }

  return <button onClick={increaseCount}>Click count: {count}</button>
}

export default ClickCounterButton
```

버튼을 더블클릭하면 더블클릭한 횟수를 표시하는 버튼 컴포넌트를 개발해야 한다.

```javascript
// DblClickCounterButton.jsx
const DblClickCounterButton = () => {
  const [count, setCount] = useState(0)

  const increaseCount = () => {
    setCount(count + 1)
  }

  return <button onDblClick={increaseCount}>Double click count: {count}</button>
}

export default DblClickCounterButton
```

앞서 만든 두개의 컴포넌트가 상당부분 유사한 기능을 수행하고 있다는 것을 발견하고 이를 공통화 한다.

```javascript
// withCounter.jsx
const withCounter = (WrappedComponent) => (props) => {
  const [count, setCount] = useState(0)

  const increaseCount = () => {
    setCount(count + 1)
  }

  return <WrappedComponent increaseCount={increaseCount} count={count} {...props} />
}

export default withCounter
```

고차 컴포넌트를 생성하기 위한 함수를 만들었으니 기존에 만들었던 `ClickCounterButton`과 `DblClickCounterButton`의 공통된 내부 로직을 삭제하고 `withCounter`의 공통 로직을 전달 받도록 수정한다.

```javascript
// ClickCounterButton.jsx
const ClickCounterButton = (props) => <button onClick={props.increaseCount}>Click count: {props.count}</button>

export default withCounter(ClickCounterButton)
```

```javascript
// DblClickCounterButton.jsx
const DblClickCounterButton = (props) => <button onDblClick={increaseCount}>Double click count: {props.count}</button>

export default withCounter(DblClickCounterButton)
```

> 주목할 부분은 `export` 구문에 있다. 기존의 정의한 컴포넌트를 리턴하는 것이 아닌 `withCounter`를 호출한 결과 생성된 컴포넌트를 리턴하는 것을 통해 고차 컴포넌트를 생성해야 한다.

`ClickCounterButton`의 버튼 메시지 `Click count:`를 `text`라는 명칭의 프로퍼티를 통해 외부에서 주입 받도록 수정해야한다면?

```javascript
// ClickCounterButton.jsx
const ClickCounterButton = (props) => (
  <button onClick={props.increaseCount}>
    {props.text}: {props.count}
  </button>
)

export default withCounter(ClickCounterButton)
```

`DblClickCounterButton`의 버튼 메시지 `Double click count:` 또한 외부에서 주입 받도록 수정해야 하고 이번에는 `title`이라는 명칭의 프로퍼티를 통해야 한다면?

```javascript
// DblClickCounterButton.jsx
const DblClickCounterButton = (props) => (
  <button onDblClick={increaseCount}>
    {props.title} {props.count}
  </button>
)

export default withCounter(DblClickCounterButton)
```

이렇게 컴포넌트의 로컬 프로퍼티를 정의 했다고 하더라고 `HOC`를 통해 대상 프로퍼티의 값을 전달해 줄수 있다.

```javascript
// withCounter.jsx
const withCounter = (WrappedComponent) => (props) => {
  const [count, setCount] = useState(0)

  const increaseCount = () => {
    setCount(count + 1)
  }

  return <WrappedComponent increaseCount={increaseCount} count={count} {...props} />
}

export default withCounter
```

> 앞서 정의한 `HOC`를 다시 살펴 보면 `withCounter`는 `WrappedComponent`를 전달 받고 바로 `(props) => JSX.Element` 형식의 함수를 리턴하게 된다 그 결과 `props` 변수를 통해 컴포넌트를 대상으로한 `props`를 전달 받을 수 있고 최종적으로 `{...props}`를 통해 대상 컴포넌트에 프로퍼티를 전달 할 수 있게 된다.
