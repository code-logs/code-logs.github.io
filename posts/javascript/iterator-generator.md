## Iterable and Iterator

개발을 하다 보면 이런 에러 메시지를 마주치곤 한다.

```javascript
TypeError: variable is not iterable
```

variable이 반복될 수 없다는 의미인데, 정확히 iterable이 어떤 것인지 그리고 iterator는 어떤 것인지 정리한다.

### Iterable

Array, Map과 같이 `for..of`문 내에서 반복 되는 것 처럼 어떤 반복 동작이 가능한 경우 iterable이라 할 수 있다. javascript에는 이미 내장되어 있는 iterable한 객체들이 몇 있는데 이런 것을 내장 iterable이라 한다.

내장 iterable:

- String
- Array
- TypedArray
- Map
- Set

내장 iterable 외에 사용자가 iterable을 직접 정의해서 사용 할 수 있는데 사용자가 iterable을 직접 정의하기 위해서는 아래의 구조적인 규칙을 반드시 준수 해야한다.

- iterable 객체는 `Symbol.iterator`를 키로하는 `@@iterator` 메서드를 갖고 있어야 함.

### Iterator

Iterator는 `Iterator protocol`을 따르는 객체로, Iterator protocol은 아래의 규칙을 의미한다.

- `next` 메서드를 갖고 있어야 한다.
  - next 메서드는 호출시 { done: boolean, value: any } 형태의 값을 반환해야 한다.
- `Symbol.iterator`를 키로하고 `iterator`를 리턴하는 메서드를 갖고 있어야 한다.

```javascript
const adder = {
  value: 0,
  increment: 2,
  limit: 10,
  next: function () {
    if (this.value >= this.limit) return { done: true }
    return { done: false, value: (this.value += this.increment) }
  },
  [Symbol.iterator]: function () {
    return this
  },
}
```

`adder`라는 객체를 정의 하였다. `adder`는 `value`의 초기값 0을 기준으로 매번 반복동작이 수행 될 때 (`next` 메서드가 호출 될 때) 마다 `increment` 만큼 값이 증가하고 `value`가 `limit` 보다 크거나 같을 경우 더이상 반복동작을 수행 할 수 없다.

이와 같이 사용자가 직접 iterable한 객체를 정의 할 수 있다. 구조적으로 조건에 충족하는 iterator를 구현하면 아래와 같은 문법을 통해 해당 객체를 순회 할 수 있다.

```javascript
for (const value of adder) {
  console.log(value)
}

/* 실행 결과:
  2
  4
  6
  8
  10
*/
```

당연히 iterator를 통해 값을 순회 할 경우 내부 변수의 값이 변경되기 때문에 순회를 이미 마친 객체는 일반적인 방법으로는 다시 처음의 값으로 되돌릴 수 없다.

```javascript
for (const value of adder) {
  console.log(value)
}

/* 실행 결과:
  2
  4
  6
  8
  10
*/

console.log('Value', ...adder)
/* 실행 결과:  
  Value
*/
```

## Generator

`Iterator`를 직접 정의하여 사용 할 수 있지만 `Generator` 함수를 이용하면 조금 더 간편하게 `iterator`를 구현 할 수 있다.

`Generator` 함수는 일반 함수 정의와 달리 function 키워드 뒤에 `*`를 붙여야 한다.

> Arrow function 정의 방식을 통해서는 generator를 구현 할 수 없음

`iterator`에서 `next` 메서드를 호출하는 것은 반복구문을 1회 수행한다는 것을 의미하는데 `Generator` 함수에서는 `yield` 키워드를 통해 함수 반복구문의 범위를 설정 할 수 있다.

아래 예제 코드를 보면 앞서 설명한 이야기를 조금 더 쉽게 이해 할 수 있다.

```javascript
function* adder() {
  let value = 0
  const increment = 2
  const limit = 10

  value += increment
  yield value

  value += increment
  yield value

  value += increment
  yield value

  value += increment
  yield value

  value += increment
  yield value
}

for (const value of adder()) {
  console.log(value)
}

/* 실행 결과:
  2
  4
  6
  8
  10
*/
```

`Generator` 함수 내부에서 루프문을 이용하면 조금더 쉽게 반복구문을 정의 할 수 있다.

```javascript
function* adder() {
  let value = 0
  const increment = 2
  const limit = 10

  while (value < limit) {
    yield (value += increment)
  }
}

for (const value of adder()) {
  console.log(value)
}

/* 실행 결과:
  2
  4
  6
  8
  10
*/
```

개인적으로 `Generator` 함수를 사용하여 실무에서 무언가 작업한 경험은 극히 드물다 . 반복적인 작업을 처리할 때 `Iterator`와 `Generator`를 떠올리기 보단 `Array`를 통해 간단히 해결하는 것이 대부분인 것 같다. 그런데 순차적인 반복구문의 수행 그리고 일정 범위에 도달 했을 때의 반복 불가와 같은 `Iterable`의 특징은 단방향의 절차적 흐름을 가지고 있는 데이터를 처리하는데 용이하다는 생각이 든다.
