## Template Literal

Template Literal은 ES6에 포함된 새로운 방식의 문자열 표현 방식이다.
기존의 변수를 포함한 문자 (동적인 문자열) 표시에 `+`를 붙여가며 문자를 완성하던 방식을 개선했고 대부분의 사용자들이 유용하게 사용하고 있는 ES6 syntax가 아닐까 생각한다.

```javascript
const blogName = 'Code Logs'

console.log('Welcome to ' + blogName)
console.log(`Welcome to ${blogName}`)
```

상기 예제에서 확인 할 수 있듯 Template literal을 사용하기 위해선 문자열을 (\`) (backtick, 억음부호)으로 감싸주기만 하면 되고 중간 중간 변수가 포함될 경우 `${variable}` 과 같은 형태로 문자열 중간에 넣어주기만 하면 그만이다.

Back-end 작업을 하다보면 간혹 Raw query를 작성해야 할 경우가 있는데 이런 경우에도 꽤 유용하다.
Legacy 코드중 아래와 같은 유형의 코드를 보기도 하는데

```javascript
var sql = 'SELECT name FROM users WHERE name like %' + name + '%;'
```

Template literal을 사용하게 되면 훨씬 가독성이 좋아진다.

```javascript
const sql = `SELECT name FROM users WHERE name like %${name}%;`
```

더불어 문자열의 줄바꿈 처리도 훨씬 수월하다.

```javascript
var multiLines = 'First Line\n' + 'Second Line'
```

기존 방식으로 줄바꿈을 하기 위해선 `\n`처럼 escape 처리를 해야했지만 template literal을 사용하면 아래와 같이 줄바꿈을 직접해주면 된다.

```javascript
const multiLines = `First Line
Second Line
`
```

## Tagged Template Literal

Tagged template literal은 앞서 살펴본 template literal과 같이 동적인 문자열을 표현하기 위해 사용된다. 한가지 차이점은 tagged template literal은 함수의 형태로 호출 된다는 것이다.

[styled-components](https://styled-components.com/) 또는 [lit-html](https://lit-html.polymer-project.org)을 사용해본 사람이라면 아래의 syntax가 익숙할 것이라 생각한다.

```javascript
// Styled components
const StyledButton = styled.button`
  padding: 10px;
  background-color: ${(props) => props.backgroundColor || 'blue'};
`

// Lit html
const buttonText = 'Click Me!'
const clickMeButton = html`<button>${buttonText}</button>`
```

동적인 문자열을 완성하는 과정에 함수 호출을 할 수 있다는 것은 많은 가능성을 열어주기 때문에 앞서 이야기한 두가지의 라이브러리 외에도 상당히 많은 곳에서 사용되고 있을 것으로 생각 된다.

## Tagged Template Literal 사용법

Tagged Template Literal을 사용하기 위해서는 우선 함수 정의를 해야한다.

```javascript
function toUpperCase(staticText, ...dynamicValues) {
  console.log(staticText)
  console.log(dynamicValues)
}
```

함수를 정의했으니 이제 호출하면 되는데 앞서 살펴본 `styled-components`와 `lit-html`에서 그 용법을 봤듯 일반적인 함수 호출 방식을 통해 호출 해선 tagged template literal을 호출하는 것이 아닌 일반 함수를 호출하는 것과 같은 결과를 만든다. 따라서 tagged template literal은 아래의 방법을 통해 호출 해야 한다.

```javascript
function toUpperCase(staticText, ...dynamicValues) {
  console.log(staticText)
  console.log(dynamicValues)
}

const lowerCaseName = 'jay lee'
toUpperCase`Hi, my name is ${lowerCaseName}`
/* 호출 결과
[ 'Hi, my name is ', '' ]
[ 'jay lee' ]
*/
```

호출 결과를 통해 보면 첫번째 파라미터 `staticText`는 정적인 문자열의 배열이, 두번째 파라미터 `dynamicValues`는 맵핑 된 변수값의 배열이 들어간 것을 확인 할 수 있다.

이제 toUpperCase 함수를 조금 수정해서 넘겨 받은 `dynamicValues`를 대문자로 변경하여 리턴하도록 하면

```javascript
function toUpperCase(staticText, ...dynamicValues) {
  return staticText.reduce((acc, text, idx) => {
    acc = `${acc}${text}${(dynamicValues[idx] || '').toUpperCase()}`
    return acc
  }, '')
}

const lowerCaseName = 'jay lee'
console.log(toUpperCase`Hi, my name is ${lowerCaseName}`)
/* 호출 결과
'Hi, my name is JAY LEE'
*/
```

tagged template literal 함수 내부에서 reduce를 사용하면 `staticText`와 `dynamicValues`의 조합을 통해 최종 문자열을 얻어낼 수 있다. 이를 응용하면 아래와 같은 tagged template literal을 만들어 낼 수 있다.

```javascript
function makeItDelicious(texts, ...values) {
  return texts.reduce((acc, text, idx) => {
    acc = `${acc}${text}${values[idx] ? `맛있는 ${values[idx]}` : ''}`
    return acc
  }, '')
}

const kimchiStew = '김치찌개'
const stirFriedPork = '제육볶음'

console.log(makeItDelicious`제가 좋아하는 음식은 ${kimchiStew}와 ${stirFriedPork} 입니다.`)
```

> ReactJS의 주요한 기능중 하나는 Virtual DOM이다. Virtual DOM은 화면에 그려지지는 않지만 화면상에 존재하는 것과 동일한 구조의 가상 돔을 메모리상에 구성하고 화면이 다시 렌더링 되기 전에 새롭게 그려질 돔과 가상 돔을 비교하여 변화가 발생한 부분만 다시 그려 낼 수 있도록 돕기 위한 것이다.
>
> 개인적으로 오래 사용한 웹개발 라이브러리인 `lit-element`도 이와 같은 역할을 수행하는 개념이 존재한다. React에서 컴퍼넌트의 property 또는 state의 변화를 감지하여 render를 다시 수행 하는 것 처럼 `lit-element`에서도 웹컴퍼넌트의 내부 프로퍼티를 관리하고 프로퍼티의 변경이 발생할 경우 `render` 함수를 호출하여 다시 컴퍼넌트를 그리게 되는데 이때 tagged template literal을 사용하여 변경된 사항만 추출하고 그것만 다시 렌더링 하도록 되어 있다.
