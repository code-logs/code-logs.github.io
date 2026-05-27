## Proxy?

프락시라는 말은 오늘 기록하려고 하는 javascript에서뿐 아니라 다양한 분야에서 범용적으로 사용되는 용어인듯하다.
나에게 익숙한 용어는 `Proxy server`인데 웹서버 구성시 Reverse proxy 설정을 유용히 사용하면서 익숙해졌다.

> Reverse proxy?
>
> 클라이언트로부터의 요청을 프락시 서버가 직접 받아 내부 네트워크에서 자원을 다운받고 응답하는 네트워크 구조
>
> WAS가 요청을 처리하는 것이 아닌 요청과 응답 사이에 대리인 (Proxy)이 개입하여 이를 중계함

`Proxy`의 사전적 의미는 '대리'로 중계의 역할을 수행하는 것에 보통 사용된다.

javascript에서의 프락시 또한 어떤 객체의 조작이 발생할 때 이를 가로채서 `Proxy` 내부의 로직을 통해 대상 객체를 조작하는 것을 말한다.

## 용법

```javascript
const target = {}
const handler = {
  get(target, prop) {
    if (prop in target) {
      return target[prop]
    } else {
      return `타겟 오브젝트에 해당 프로퍼티 (${prop})가 존재하지 않습니다.`
    }
  },
}

const proxy = new Proxy(target, handler)
console.log(proxy.name) /* 타겟 오브젝트에 해당 프로퍼티 (name)가 존재하지 않습니다. */
```

`Proxy` 객체는 두개의 파라미터를 인자로 받는다. 첫번째는 `Proxy`를 적용할 대상 객체이고 두번째는 대상 객체를 조작할 때 호출될 핸들러 객체이다.
핸들러는 `trap`이라고 불리는 매서드를 가질 수 있으며, `trap`은 대상 객체의 조작이 발생 할 경우 그것을 가로채어 처리하는 역할을 한다.

생성된 `proxy`에 조작이 발생 했을때 handler 내부에 해당 조작을 가로챌 `trap`이 존재한다면 `trap` 매서드가 호출된다.

예제에서 본 것과 같이 `trap`은 정해진 명칭을 통해 구현해야한다.

### Trap의 종류

|      내부 메서드      |    핸들러 메서드 명칭    | 트리거                                                                                                        | 구현 규칙                                         |
| :-------------------: | :----------------------: | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
|        [[Get]]        |           get            | 프로퍼티 읽기                                                                                                 |                                                   |
|        [[Set]]        |           set            | 프로퍼티 쓰기                                                                                                 | 프로퍼티 쓰기 성공여부를 true/false로 리턴 해야함 |
|    [[HasProperty]]    |           has            | in 연산자 사용                                                                                                |                                                   |
|      [[Delete]]       |      deleteProperty      | 프로퍼티 삭제                                                                                                 | 프로퍼티 삭제 성공여부를 true/false로 리턴 해야함 |
|       [[Call]]        |          apply           | 함수 호출                                                                                                     |                                                   |
|     [[Construct]]     |        construct         | new 연산자 사용                                                                                               | 반드시 생성자를 통해 호출된 객체를 리턴 해야함    |
|  [[GetPrototypeOf]]   |      getPrototypeOf      | Object.getPrototypeOf                                                                                         |                                                   |
|  [[SetPrototypeOf]]   |      setPrototypeOf      | Object.setPrototypeOf                                                                                         |                                                   |
|   [[IsExtensible]]    |       isExtensible       | Object.isExtensible                                                                                           |                                                   |
| [[PreventExtensions]] |    preventExtensions     | Object.preventExtensions                                                                                      |                                                   |
| [[DefineOwnProperty]] |      defineProperty      | Object.defineProperty, Object.defineProperties                                                                |                                                   |
|  [[GetOwnProperty]]   | getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor, for..in, Object.keys, Object.values, Object.entries                          |                                                   |
|  [[OwnPropertyKeys]]  |         ownKeys          | Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object.keys, Object.values, Object.entries |                                                   |

> Trap의 기본적인 규칙은 Proxy를 통해 호출되지 않았을 때와 동일한 유형의 값을 return 해야 한다는데 있다.

## Sample

### Get

다음 예제는 `Proxy`를 이용하여 객체의 프로퍼티를 조회할 때 해당 프로퍼티가 없을 경우 기본값을 반환하도록 한다.

```javascript
const defaultValueProxy = (target, defaultValue) => {
  const handler = {
    get(target, prop) {
      if (prop in target) {
        return prop[target]
      } else {
        return defaultValue
      }
    },
  }

  return new Proxy(target, handler)
}

const target = { prop1: 'value 1' }
const defaultValueTarget = defaultValueProxy(target, 'default value')
console.log(defaultValueTarget.prop1) /* value 1 */
console.log(defaultValueTarget.prop2) /* default value */
```

### Set

다음 예제는 `Proxy`를 이용하여 객체의 프로퍼티를 쓰기 전 Validation을 수행한다.

```javascript
const validatorProxy = (target, validator) => {
  const handler = {
    set(target, prop, value) {
      try {
        if (prop in validator) {
          validator[prop](value)
        }

        target[prop] = value
        return true
      } catch (e) {
        console.error(e.message)
        return false
      }
    },
  }

  return new Proxy(target, handler)
}

const profile = validatorProxy(
  {},
  {
    age(age) {
      if (typeof age !== 'number') throw new Error('나이는 반드시 숫자 유형이여야 합니다.')
      if (age < 0) throw new Error('나이는 0 보다 작을 수 없습니다.')
    },
  }
)

profile.name = '홍길동'
profile.age = '스물'
console.log(`Age: ${profile.age}`) /* Age: undefined */
profile.age = -20
console.log(`Age: ${profile.age}`) /* Age: undefined */
profile.age = 20
console.log(`Age: ${profile.age}`) /* Age: 20 */
```

### Apply

다음 예제는 함수 호출시 함수 동작 시간을 출력한다.

```javascript
const timestampProxy = (target) => {
  const handler = {
    apply(target, thisArgs, args) {
      console.time('소요시간')
      target.apply(thisArgs, args)
      console.timeEnd('소요시간')
    },
  }
  return new Proxy(target, handler)
}

const sleep = (second) => {
  const startedAt = Date.now()
  while ((Date.now() - startedAt) / 1000 < second) {} // sleep

  console.log('Done')
}

const sleepTimestamp = timestampProxy(sleep)
sleepTimestamp(3)
/*
  Done
  소요시간: 3000ms 
*/
```

> Proxy의 대상은 객체이기 때문에 함수도 그 대상이 될 수 있다.

### Construct

```javascript
const strictConstructor = (target, paramCount) => {
  const handler = {
    construct(target, args) {
      if (args.length < paramCount) throw new Error('생성자 호출을 위해 필요한 모든 파라미터를 전달 받지 못했습니다.')
      return new target(...args)
    },
  }

  return new Proxy(target, handler)
}

class Person {
  constructor(name, age, nickname, hobby) {
    this.name = name
    this.age = age
    this.nickname = nickname
    this.hobby = hobby
  }

  profile() {
    console.table(this)
  }
}

const person = new Person()
person.profile()
/*
  | (index)  |  Values   |
  ------------------------
  |   name   | undefined |
  |   age    | undefined |
  | nickname | undefined |
  |  hobby   | undefined |
*/
```

```javascript
const StrictPerson = strictConstructor(Person, 2)
new StrictPerson('John')
/*
  Error: 생성자 호출을 위해 필요한 모든 파라미터를 전달 받지 못했습니다.
*/
```

```javascript
const strictPerson = new StrictPerson('John', 20)
strictPerson.profile()
/*
  | (index)  |  Values   |
  ------------------------
  |   name   |  'John'   |
  |   age    |    20     |
  | nickname | undefined |
  |  hobby   | undefined |
*/
```

## Revocable proxy

`Proxy`를 통해 생성된 객체는 `GC`의 대상에서 제외된다. 이것을 `GC`의 대상으로 포함시키기 위해서는 아래와 같은 방식으로 `Proxy`를 생성해야한다.

> GC (Garbage Collection)
>
> 메모리 관리 기법 중의 하나로, 프로그램이 동적으로 할당했던 메모리 영역 중에서 필요없게 된 영역을 해제하는 기능 - [wiki](<https://ko.wikipedia.org/wiki/%EC%93%B0%EB%A0%88%EA%B8%B0_%EC%88%98%EC%A7%91_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)>)

```javascript
const target = {}
const handler = {}
const revocableProxy = Proxy.revocable(target, handler)
```

new 연산자를 통해 `Proxy`를 생성하는 것이 아닌 static method인 `revocable`을 호출하는 것으로 `Proxy` 객체를 생성하면 된다.
그 외의 사용법은 new 연산자를 통해 생성한 `Proxy`와 동일하다.

`revocable proxy`의 경우 `proxy` 프로퍼티를 통해 대상 객체의 인자에 접근 할 수 있다.
`revocable proxy`의 사용이 완료되고 `GC`의 대상으로 포함시키기 위해서는 아래와 같이 명시적으로 `revoke`를 호출해주면 된다.
`revoke`가 호출된 이후 대상 객체에 대한 조작을 시도하면 `TypeError`를 발생시키고 `revocable proxy`는 `GC`의 대상이 되어 폐기된다.

```javascript
const revocableProxy = (target) => {
  const handler = {
    get(target, prop) {
      console.log('Proxy Getter')
      return target[prop]
    },
  }

  return Proxy.revocable(target, handler)
}

const revocable = revocableProxy({ name: '홍길동' })
revocable.proxy.name
/*
  Proxy Getter
  홍길동
*/
revocable.revoke()
revocable.proxy.name
/*
  TypeError: Cannot perform 'get' on a proxy that has been revoked
*/
```

## 마치며

`Proxy`는 객체 내부 인자에 대한 조작을 감지 할 수 있다는 것 자체로도 많은 잠재력을 가지고 있다. 상황에 맞게 `Proxy`를 이용하면 객체의 상태 감지를 통한 특별한 작업들을 할 수 있다. (상태 관리 도구와 같은)
