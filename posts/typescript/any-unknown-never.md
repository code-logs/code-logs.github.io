## Any

### Any 타입은 무엇인가?

처음 JavaScript 코드를 TypeScript로 마이그레이션 할 때 필살기 처럼 사용했던 타입이다. 이러면 안된다는걸 직감적으로 알고 있으면서도 당시에는 당장 마이그레이션 하는게 우선이였기 때문에 묻어두고 넘어 갔고 당연히 시간이 지남에 따라 발목을 잡는 결과를 초래했다.

`any` 타입은 말 그대로 '무엇이든지 가능한' 타입 유형이다. 사실상 무엇이든 가능한 JavaScript 세계에서의 기본적인 타입 규칙을 따르는 것과 다름이 없기 때문에 모든 변수의 타입을 `any`로 잡는 것은 확장자만 ts인 js를 사용하는 것이다. ~~컴파일을 해야하는 불편함 까지 가지고 있는 JavaScript가 완성된다.~~

TypeScript는 정적인 타입을 보장하는 것을 통해 코드의 안정성을 확보하고 개발자가 인지하지 못하는 에러나 케이스 누락을 보장해주는 것인데 이런 장점들을 모두 사라지게 만드는 무분별한 `any`의 사용은 당연히 권장되는 방법은 아니다.

`any` 타입은 `TypeScript` 타입 생태계의 가장 최상위에 있는 `Super type`으로 모든 종류의 type을 포함한다. 다시 말하면 어떤 값도 `any` 타입이 될 수 있다는 것이다.

```typescript
let iAmAny: any
iAmAny.hello.i.am.any.type.that.is.why.you.can.access.any.properties.of.mine()

let iAmBoolean: boolean = iAmAny
```

예제에서 볼 수 있든 정의되지 않은 프로퍼티에 접근하려고 해도 컴파일 에러를 발생시키지 않는다. 심지어 값의 할당이 되기도 한다.

## Unknown

### Unknown 타입은 무엇인가?

`unknown` 타입은 말그대로 타입을 알 수 없는 것이다. `any` 타입과 비슷한 의미로 기억 될 수 있고 어떤 부분에서는 `any` 타입과도 닮아 있다. 하지만 `unknown` 타입은 `any` 타입과 분명한 차이점을 가지고 있으며 이 차이점에 대해서 이해하고 있다면 유연하면서도 TypeScript의 정적 타이핑을 잘 이용한 코드를 작성 할 수 있다.

```typescript
let iAmUnknown: unknown = 'Hello'
iAmUnknown = ['I', 'can', 'be', 'anything', 'because', 'I', 'am', 'unknonw']
iAmUnknown = 12345
```

예제에서 보는 것과 같이 `unknown` 타입의 경우도 `any` 타입과 같이 타입체크에 따른 컴파일 에러가 발생하지 않는 것을 볼 수 있다.

하지만 아래의 경우는 조금 차이가 있다.

```typescript
let iAmUnknown: unknown = 'Hello'
iAmUnknown.split(' ') // Property 'split' does not exist on type 'unknown'.ts(2339)
iAmUnknown.join('') // Property 'join' does not exist on type 'unknown'.ts(2339)
```

위의 예제에서 처럼 unknown 타입에는 split, join과 같은 속성이 없다는 컴파일 에러가 발생한다.
이런 에러를 방지하기 위해 반드시 `type guard`가 필요하다.

> Type Guard
>
> 객체의 타입을 좁혀 나가는 것을 통해 특정 변수의 타입을 보장하는 것

```typescript
let iAmUnknown: unknown = 'Hello'

if (typeof iAmUnknown === 'string') {
  iAmUnknown.split(' ')
} else if (Array.isArray(iAmUnknown)) {
  iAmUnknown.join('')
}
```

이런식으로 `unknown` 타입의 변수는 `type guard`를 통해 안정적인 코드로 변경 할 수 있다.

### Any 타입과 Unknown 타입의 차이는?

결과적으로 `any` 타입과 `unknown` 타입의 차이점은 사용시 타입을 명시해야하는데 있다.

### Unknown 타입 응용하기

`unknown` 타입은 타입 정의가 명확하게 되어 있지 않은 코드를 사용 할 때 유용히 쓰일 수 있다.
예를들어 아래와 같은 코드 블럭이 있다고 가정 했을때

```typescript
const someResult = doSomething()
someResult.split('')
```

코드를 통해 충분히 유추할 수 있듯 `doSomething`이란 함수는 `string` 타입을 리턴하는 것으로 보인다.
그런데 예상과 달리 `number` 타입이나 `split`을 메소드로 가지고 있지 않은 유형의 데이터를 리턴하게 된다면 런타임에 에러가 발생하게 된다.

`doSomething`의 호출 결과인 `someResult`는 기본적으로 any 타입을 갖게 된다.
이것을 `unknown` 타입으로 변경하면 타입 가드를 반드시 만들어줘야하고 결과적으로 런타임에 발생하게 되는 에러를 미연에 방지 할 수 있다.

```typescript
const someResult: unknown = doSomething()

if (typeof someResult === 'string') {
  someResult.split('')
}
```

## Never

### Never 타입은 무엇인가?

never 타입은 절대로 발생하지 않는 값의 타입이다. 절대로 발생하지 않는 값의 타입이라는 말이 무언가 모순적인데 아래의 예제 코드를 통해 조금 명확히 해야겠다.

```typescript
const neverPass = (): never => {
  throw new Error(`You can't pass through this function`)
}
```

`neverPass`라는 함수의 리턴 값이 `never`로 설정 했다 당연히 `neverPass` 함수는 절대로 값을 리턴할 수 없기 때문이다. 또다른 예제는 아래와 같다

```typescript
const infiniteLoop = (): never => {
  while (true) {
    console.log('You are in infinite loop function')
  }
}
```

`infiniteLoop`라는 함수의 리턴 타입 또한 `never`로 설정 됐다. 이 예제의 함수 또한 절대로 어떠한 값도 리턴 할 수 없기 때문이다.

`never` 타입의 몇가지 특징에 대해서 이야기해 보면 아래와 같다.

- `never` 타입은 모든 타입의 하위 타입이다. 다시 말해 어떠한 유형의 값에도 `never` 타입의 값은 할당 될 수 있다.
- 어떠한 타입도 `never` 타입의 하위 타입이 될 수 없다. `never` 타입에는 `never` 그 자체만을 할당 할 수 있고 다른 어떤 값도 `never` 타입에 할당 될 수 없다.

### Never 타입 응용하기

앞서 살펴본 `never` 타입에는 `never` 타입만 할당 할 수 있다는 특징의 응용을 통해 런타임 에러를 방지 할 수 있다.

우선 서로 다른 두개의 `type`을 정의한다.

```typescript
type CustomType1 = { name: 'custom type 1' }
type CustomType2 = { name: 'custom type 2' }
```

그리고 두 타입의 유니언 타입을 정의한다.

```typescript
type CustomType1 = { name: 'custom type 1' }
type CustomType2 = { name: 'custom type 2' }

type CustomUnionType = CustomType1 | CustomType2
```

그리고 `CustomUnionType`을 매개변수로 갖는 함수를 정의한다.

```typescript
function doSomething(param: CustomUnionType) {
  if (param.name === 'custom type 1') {
    return 'This is custom type 1'
  } else if (param.name === 'custom type 2') {
    return 'This is custom type 2'
  }
}
```

예제의 코드는 상당히 간단하기 때문에 `doSomething` 함수 내부에서 다루어져야 하는 모든 케이스에 대한 처리가 되었음을 확인 할 수 있다.

그런데 만약 `CustomUnionType`이 변경되어 새롭게 고려해야 할 케이스가 발생한다면 어떨까?

결론부터 이야기하면 현재 상태로는 새롭게 추가되는 타입이 생기더라도 이것을 쉽게 알 수 없다.

이때 `never`는 `never` 자체에만 할당 가능하다는 것을 이용하면 `doSomething` 내에서 모든 케이스가 다루어지고 있는지 여부를 손쉽게 확인 할 수 있다.

```typescript
function doSomething(param: CustomUnionType) {
  if (param.name === 'custom type 1') {
    return 'This is custom type 1'
  } else if (param.name === 'custom type 2') {
    return 'This is custom type 2'
  }

  const isNever: never = param
}
```

코드를 통해 확인 할 수 있듯이 전달받은 `param`은 `CustomType1` 또는 `CustomType2`인 경우 함수 실행이 종료되게 되고 마지막 라인인 `const isNever: never = param`에 도달 했을 경우 `param`은 `CustomType1`도 `CustomType2`도 아닌 `never` 타입이기 때문에 컴파일 에러가 발생하지 않는다.

그런데 만약 `CustomUnionType`에 `CustomType3`라는 새로운 타입이 포함된다면 마지막 라인에서 `param`의 유형이 `CustomType3`가 되고 결과적으로 `isNever`에 `param`을 할당 할 수 없게된다.

```typescript
type CustomType1 = { name: 'custom type 1' }
type CustomType2 = { name: 'custom type 2' }
type CustomType3 = { name: 'custom type 3' }

type CustomUnionType = CustomType1 | CustomType2 | CustomType3

function doSomething(param: CustomUnionType) {
  if (param.name === 'custom type 1') {
    return 'This is custom type 1'
  } else if (param.name === 'custom type 2') {
    return 'This is custom type 2'
  }

  const isNever: never = param // 'isNever' is declared but its value is never read.ts(6133)
}
```

이런 장치를 함수 내부의 포함시키는 것을 통해 타입별 처리를 누락 없이 수행 할 수 있다.
