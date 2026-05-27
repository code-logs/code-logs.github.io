## Elasticsearch?

`Elasticsearch`는 전문검색엔진으로 처음 개발 되었지만 현재는 검색엔진을 넘어 보안, 로그분석, 전문분석 등 다양한 영역에서 사용되고 있다.
샤이 배논에의해 2004년 부터 개발이 시작된 `elasticsearch`는 `Apache Lucene (검색 라이브러리)`을 사용했으나 이것의 한계점을 발견하고 이를 보완한 새로운 검색엔진을 만들기 시작했다.

이것이 `elasticsearch` 프로젝트의 시작이 되었다.

샤이 베논이 검색 프로그램을 만들기 시작한 이유는 그의 아내가 요리공부를 시작하게 되어 레시피 검색을 돕는 프로그램을 만들면서 부터라고 한다. ~~그 이후로 일이 이상하게 흘러가 여전히 레시피 검색 프로그램을 받지는 못한 모양이다~~

초기 `elasticsearch`는 `Logstash`와 `Kibana`를 함께 사용하며 `ELK Stack`이라 불리게 되었고 현재는 `Logstash`와 `Kibana`를 흡수하여 함께 개발되고 있으며 `Elastic Stack`이라는 명칭을 갖게 되었다.

### Elasticsearch의 역할

`Elastic Stack`의 가장 핵심적인 역할을 수행한다. 데이터 색인, 저장, 검색, 집계를 수행하고 결과를 클라이언트 또는 다른 프로그램으로 전달하는 역할을 수행한다.

### Elasticsearch의 특징

- **오픈소스**
  - 핵심 기능들은 Apache 2.0 라이센스로 배포된다. _모든 소스가 [깃허브](https://github.elastic)에 공개되어 있다._
  - 6.3 버전 부터 Elastic 라이센스와 Apache 라이센스가 혼용되고 있지만 버전에 따른 별도의 배포판이 있다
- **실시간 분석**
  - 일반적인 데이터 분석시스템 (eg. `Hadoop`) 은 배치 작업을 기본으로 한다. 소스데이터와 분석을 수행하는 프로그램을 분석 시스템에 올리고 실행하면 결과가 나오는 식의 방식이다
  - 반면 `elasticsearch`는 클러스터가 실행되고 있는 동안 데이터가 입력됨과 동시에 색인된 데이터의 검색 집계가 가능하다
- **전문 검색 엔진**

  - 역색인 구조 (`inverted index`)로 가공된 텍스트를 검색한다
  - 내부적으로 역색인 구조로 데이터를 저장하고 있고 사용자 관점에서는 JSON 형식으로 데이터를 전달한다

- **RESTFul API**
  - 데이터 조회, 입력, 삭제를 http 프로토콜을 통해 Rest API로 처리한다
- **멀티테넌시**
  - `Elasticsearch`의 데이터는 `index`를 기준으로 구분되어 저장된다. `elasticsearch`는 다른 `index`에 속한 데이터를 별도의 커넥션 없이도 조회가 가능하고 이것을 `elasticsearch`에서는 멀티테넌시라한다.

> `elasticsearch`는 `JSON` 형식만 지원하고 있기 때문에 데이터의 입력을 위해서 반드시 JSON으로 변환하는 작업이 필요하다. `Logstash`를 이용하여 대부분의 파일형식을 JSON 형식으로 변경할 수 있다.

> `elasticsearch`는 내부적으로 역색인 구조의 데이터를 저장한다. 이를 통해 데이터의 양이 늘어남에 따라 조회 대상이 늘어나는 일반적인 RDBMS와 달리 `term`을 통해 해당 `term`이 포함되어 있는 도큐먼트의 아이디를 찾게되고 결과적으로 검색 성능을 향상 시킬 수 있다. 역색인 구조로 데이터를 가공하여 저장하는 절차는 새로운 도큐먼트가 추가될 때 발생하기 때문에 `elasticsearch`는 저장이 아닌 색인이란 표현을 사용한다.

## Clustering

`Elasticsearch` 노드들은 `cluster.name`을 설정으로 갖는데 동일한 `cluster.name`을 가지고 있는 노드들은 하나의 클러스터에 포함된다.
클러스터링은 하나의 서버에서 여러개로 구분될 수 있고 거꾸로 여러개의 서버에서 하나의 클러스터를 구성할 수 있다.
다른 네트워크 환경에 구성되어 있는 클러스터는 `discover.seed_hosts` 설정을 통해 서로를 탐색하고 하나의 클러스터로 구성 될 수 있다. 자세한 내용은 [공식문서](https://www.elastic.co/guide/en/elasticsearch/reference/current/important-settings.html)를 통해 확인 할 수 있다.

### Node의 종류

1. Master node
1. Data node

### Master node

`elasticsearch`의 클러스터는 반드시 하나의 마스터 노드를 포함하고 있어야 한다. 마스터 노드는 인덱스의 메타 데이터, 데이터가 분산 저장되어 있는 위치와 같은 클러스터의 상태 정보를 관리한다. 마스터노드가 관리하는 데이터가 유실되면 클러스터 전체가 작동하지 않기 때문에 마스터 노드가 어떠한 이유에 의해 중지되었을 때 이를 대신할 마스터 노드 후보자가 필요하다.

모든 노드는 기본적으로 마스터 노드가 될 수 있는 후보자로 등록된다. 후보자로 등록되어 있는 노드들은 마스터 노드가 정상적으로 동작하고 있더라도 마스터 노드에서 관리되는 메타 데이터를 가지고 있게된다. 이렇게 하는 것을 통해 갑작스레 마스터 노드가 유실 되었을 때 곧바로 후보자중 하나가 마스터 노드의 역할을 대신 수행 할 수 있기 때문이다.

클러스터의 규모가 커짐에 따라 불필요하게 많은 마스터 노드의 후보자가 생성될 수 있는데 이것은 성능에 안좋은 영향을 미치게 되고 이런 문제를 사전에 방지하기 위해 `node.master` 설정을 통해 후보자로 등록될지 여부를 결정 할 수 있다.

### Data node

데이터 노드는 실제로 색인된 데이터를 저장하고 있는 노드이다. 마스터 노드와 마찬가지로 `node.data` 설정을 통해 데이터 노드의 역할을 수행할지 여부를 결정 할 수 있다.

> 그 밖의 노드의 역할
>
> _node.ingest_
>
> 데이터 색인 전처리 작업인 ingest pipeline 작업
>
> node.ingest 설정을 통해 해당 역할을 on/off 할 수 있다.
>
> _node.ml_
>
> 머신러닝 작업
>
> node.ml 설정을 통해 해당 역할을 on/off 할 수 있다.

> 마스터 노드와 데이터 노드의 성능 향상
>
> 마스터 노드와 데이터 노드는 두가지 역할을 함께 수행 할 수 있지만 각자에 역할만 수행하도록 설정하는 것을 통해 성능상의 이점을 얻을 수 있다.

### Split Brain

클러스터를 구성 할 때 마스터 노드를 최소 3개 이상의 '홀수'로 구성하는 것을 권장한다. 만약 마스터 후보 노드가 2개 또는 짝수로 구성할 경우 네트워크 유실로 인해 분리된 두개의 클러스터로 구성되어 계속 동작할 수 있는데 각기 다른 형상의 데이터를 저장하게 된다. 네트워크가 다시 연결되어 정상 상태인 하나의 클러스터로 묶일 때 데이터의 정합성과 무결성을 유지할 수 없게 된다. 이런 문제를 `Split Brain`이라 한다.

### Node의 데이터 저장

elasticsearch에서는 단일 데이터 단위를 `document`라고 하며 이 `document`의 집합을 `index`라고 한다.
Node에 데이터를 저장할 때 `document`의 집합인 `index`는 다 시 `shard`라는 단위로 분리되어 저장되게 된다. 분리된 `shard`는 클러스터에 포함된 노드들에 의해 나뉘어 보관된다. 뿐만 아니라 `shard`는 `replica`라고 불리는 복제본을 생성하게 되며 이 복제본들 또한 노드들에 의해 나뉘어 보관된다.

이렇게 분리된 `shard`와 `replica`에 의해 클러스터의 특정 노드에 문제가 발생하여 데이터가 유실되더라도 다른 노드에 보관중인 `replica`와 `shard`에 의해 데이터의 유실을 방지 할 수 있다.

node가 실행을 멈추게 되면 일정시간동안 node의 재실행을 기다리고 timeout이 발생하게 되면 남아 있는 노드에 유실된 `shard`와 `replica`를 다시 생성하는 것을 통해 다시 발생할지도 모르는 장애로인한 데이터 유실을 방지한다.

## REST API를 이용한 CRUD

elasticsearch는 도큐먼트 별로 고유한 URL을 갖는다. URL은 아래의 패턴을 갖는다

<div align=center>http://host:port/index/doc type/doc id</div>

### 입력 (PUT)

```javascript
const response = await fetch('http://localhost:9200/new_index/_doc/1', {
  method: 'put',
  headers: { ['Content-Type']: 'application/json' },
  body: JSON.stringify({
    name: 'Code Logs',
  }),
})

console.log((await response.json()).result) // created
```

`new_index`라는 명칭의 인덱스에 새로운 도큐먼트가 추가 되었다 정상적으로 데이터가 추가되면 `created`를 response.result로 응답한다.

동일한 요청을 다시 보내게 되면 대상 도큐먼트가 덮어씌워지게 된다. 이 경우에는 `created` 대신 `updated`를 response.result로 응답한다.

도큐먼트가 덮어 씌워지는 것을 방지하기 위해 요청시 도큐먼트 타입을 `_create`로 지정 할 수 있다. 이렇게 하면 해당 아이디를 가진 도큐먼트가 이미 존재 할 경우 에러를 발생시키고 그렇지 않을 경우에만 새로운 도큐먼트를 저장한다.

```javascript
const response = await fetch('http://localhost:9200/new_index/_create/1', {
  method: 'put',
  headers: { ['Content-Type']: 'application/json' },
  body: JSON.stringify({ name: 'Code Logs' }),
})

if (!response.ok) console.log((await response.json()).error.reason) // [1]: version conflict, document already exists (current version [2])
```

### 조회 (GET)

```javascript
const response = await fetch('http://localhost:9200/new_index/_doc/1')
console.log((await response.json())._source) // { name: 'Code Logs' }
```

도큐먼트를 조회하면 저장되어 있는 데이터 외에도 다양한 정보를 응답한다. 데이터는 `_source` 프로퍼티를 통해 접근 할 수 있다.

### 삭제 (DELETE)

도큐먼트 또는 인덱스 단위로 데이터를 삭제 할 수 있다.

```javascript
// 도큐먼트 단위 삭제
const response = await fetch('http://localhost:9200/new_index/_doc/1', {
  method: 'delete',
})

console.log((await response.json()).result) // deleted
```

```javascript
// 인덱스 단위 삭제
const response = await fetch('http://localhost:9200/new_index', {
  method: 'delete',
})

console.log((await response.json()).acknowledged) // true
```

### 수정 (POST)

POST 메서드는 PUT 메서드와 마찬가지로 데이터 입력에 사용된다. 도큐먼트를 입력 할 때 도큐먼트 아이디를 생략하게 되면 임의의 도큐먼트 아이디가 자동으로 생성된다.

```javascript
const response = await fetch('http://localhost:9200/new_index/_doc', {
  method: 'post',
  headers: { ['Content-Type']: 'application/json' },
  body: JSON.stringify({ name: 'Code Logs' }),
})

const { result, _id } = await response.json()
console.log(_id) // 임의 아이디
console.log(result) // created
```

### \_update

POST 또는 PUT 메서드를 통해 도큐먼트를 업데이트 하려면 대상 도큐먼트의 모든 필드를 다시 입력해야 하는 번거로움이 있다. 이럴 경우 `_update` 도큐먼트 타입을 이용하면 수정하고자 하는 필드만 업데이트 할 수 있다.

```javascript
const response = await fetch('http://localhost:9200/new_index/_update/1', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    doc: {
      description: 'Personal blog about web development',
    },
  }),
})

console.log((await response.json()).result) // updated
```

> \_version 프로퍼티
>
> 도큐먼트를 조회 했을 때 받게되는 응담의 프로퍼티중 `_version` 프로퍼티는 해당 도큐먼트의 변경이 발생함에 따라 1씩 증가하게 된다.
>
> `_update` 도큐먼트 타입을 통해 일부 필드가 수정되더라도 `_version`은 1 증가하는 것을 확인 할 수 있는데 그 이유는 내부적으로 업데이트 대상 도큐먼트를 모두 가지고와 일부 필드만 수정한 뒤 전체 내용을 PUT하는 방식으로 동작하기 때문이다.

### 벌크 API

여러 유형의 명령을 배치로 수행하기 위해서 `_bulk` API를 사용 할 수 있다. `_bulk` API는 `delete`를 제외하고 명령문과 데이터문을 한 줄 씩 순서대로 입력해야 한다.
`delete`는 입력할 데이터가 없기 때문에 명령문만 입력한다.

다음 예제는 아래의 명령을 한번에 실행하는 것이다.

1. user index에 id가 1인 { name: 'Jay', age: 20 } 생성
1. user index에 id가 2인 { name: 'Lee', age: 21 } 생성
1. fruit index에 id가 1인 { name: 'apple', price: 2000 } 생성
1. user index에 id가 2인 도큐먼트 삭제
1. fruit index에 id가 1인 도큐먼트의 { description: 'Fresh and delicious apple' } 업데이트

```javascript
const commands = [
  { index: { _index: 'user', _id: '1' } },
  { name: 'Jay', age: '20' },
  { index: { _index: 'user', _id: '2' } },
  { name: 'Lee', age: '21' },
  { index: { _index: 'fruit', _id: '1' } },
  { name: 'apple', price: '2000' },
  { delete: { _index: 'user', _id: '2' } },
  { update: { _index: 'fruit', _id: '1' } },
  { doc: { description: 'Fresh and delicious apple' } },
]
const response = await fetch('http://localhost:9200/_bulk', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: commands.map((c) => JSON.stringify(c)).join('\n') + '\n',
})

console.log((await response.json()).items) // (5) [{…}, {…}, {…}, {…}, {…}]
```

`_bulk` API를 통해 변경된 도큐먼트의 응답은 `items` 프로퍼티를 통해 확인 할 수 있다.

만약 조작하고자하는 도큐먼트가 모두 하나의 index에 속해 있다면 아래와 같이 index를 명시한 상태로 호출 할 수 있다.

```javascript
const commands = [{ index: { _id: 1 } }, { name: 'Jay', age: 20 }, { index: { _id: 2 } }, { name: 'Lee', age: 21 }, { delete: { _id: 2 } }]
const response = await fetch('http://localhost:9200/user/_bulk', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: commands.map((c) => JSON.stringify(c)).join('\n') + '\n',
})

console.log((await response.json()).items) // (3) [{…}, {…}, {…}]
```

> elasticsearch는 `commit`, `rollback`, `transaction` 개념이 존재하지 않는다 만약 `_bulk` API를 통해 여러 도큐먼트를 대상으로 작업을 수행하던 중 문제가 발생하면 수행이 완료된 index를 찾을 수 없기 때문에 모든 index를 삭제하고 다시 전체 bulk 작업을 수행하는 것을 권장한다.

## \_search API

`_search` API를 통해 인덱스 단위의 검색을 할 수 있다.
`GET` 메서드를 이용하여 아래의 형식으로 조회를 요청 할 수 있다.

<div align=center>http://localhost:9200/target_index/_search</div>

### URI 검색

`q` 파라메터를 이용하여 검색 조건을 설정 할 수 있다. 검색 조건이 존재하지 않을 경우 인덱스의 모든 도큐먼트를 대상으로 검색을 수행한다.

이러한 검색 방식을 `URI 검색`이라 한다.

<div align=center>http://localhost:9200/target_index/_search?q=condition</div>

> AND 조건으로 검색하기
>
> http://localhost:9200/target_index/\_search?q=condition1 AND condition2

> 검색 조건을 특정 필드로 한정하기
>
> http://localhost:9200/target_index/\_search?q=field:condition1

### 멀티테넌시

멀티네넌시는 한번에 여러 인덱스를 대상으로 검색하는 것을 의미한다. 여러 인덱스를 검색할때는 `,`로 구분하여 나열하거나 `*` 와일드 카드를 통해 표현 할 수 있다.

<div align=center>http://localhost:9200/target_index1,target_index2/_search</div>

<div align=center>http://localhost:9200/target_index*/_search</div>

> 인덱스를 지정하지 않고 클러스터 내부의 모든 인덱스를 대상으로 검색을 하려면 `_all` 지정자를 사용할 수 있지만 시스템 사용을 위해 정의된 인덱스에도 접근하게 되어 불필요한 작업을 수행하게 되므로 권장되지 않는다.

## Full-text search

`elasticsearch`는 검색시 주어지는 조건의 대소문자, 단수, 복수, 원형의 여부와 상관 없이 검색이 가능하도록 `Term`으로 분석하는 과정을 거친 뒤 데이터를 저장한다.
이런 전처리 과정을 거친 결과로 Full-text search가 가능하게 된다.

> DSL - 도메인 특화 언어 (Domain Specific Language)
>
> 도메인 특화 언어는 특정한 도메인에 적용하도록 최적화된 프로그래밍 언어이다. Elasticsearch는 JSON 형태의 Query DSL을 사용한다.
>
> Query DSL을 통해 `데이터 본문 (Data body) 검색`을 할 수 있다.
>
> [wiki](https://ko.wikipedia.org/wiki/%EB%8F%84%EB%A9%94%EC%9D%B8_%ED%8A%B9%ED%99%94_%EC%96%B8%EC%96%B4)

### match_all

특별한 조건 없이 특정 인덱스의 모든 도큐먼트를 검색하는 쿼리

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
})
```

> Full-text search를 진행하기 위해서 앞서 살펴본 URI 검색이 아닌 `데이터 본문 (Data body) 검색`을 이용해야 한다.
>
> [@elastic/elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch) 모듈을 이용해 데이터 본문 검색을 사용할 수 있다.

### match

가장 일반적으로 사용되는 풀 텍스트 검색 쿼리로 특정 필드에 특정한 값이 포함되는 도큐먼트를 조회하는데 사용된다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      match: {
        field: 'condition',
      },
    },
  }),
})
```

`match` 검색을 사용할 때 여러개의 검색어를 집어 넣으면 기본적으로 `OR` 조건으로 검색이 된다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      match: {
        field: 'condition1 condition2',
      },
    },
  }),
})
```

여러 검색어를 `AND` 조건으로 검색하려면 `operator` 옵션을 사용한다. `AND` 조건으로 검색할 때는 본문의 형식이 달라지는 것에 유의한다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      match: {
        field: {
          query: 'condition1 condition2',
          operator: 'and',
        },
      },
    },
  }),
})
```

### match_phrase

검색어로 나열된 조건들을 공백을 포함한 하나의 문자열 조건으로 검색할 때 사용한다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      match_phrase: {
        field: 'condition1 condition2',
      },
    },
  }),
})
```

나열된 검색어 사이에 n 개의 단어를 포함하여 검색하도록 하기 위해 `slop` 속성을 사용한다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      match_phrase: {
        field: 'condition1 condition2',
        slop: 1, // condition1 something condition2와 같은 형식의 데이터 조회 가능
      },
    },
  }),
})
```

위 예제에서 `slop`을 1로 설정 했기 때문에 `condition1`과 `condition2` 사이에 한개의 추가적인 단어가 존재하는 도큐먼트를 조회하게 된다.

### query_string

[URI 검색](#uri-검색)에서 사용했던 `q` 파라메터를 데이터 본문 검색을 통해 수행할 수 있다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      query_string: {
        default_field: 'field',
        query: 'condition1 AND condition2',
      },
    },
  }),
})
```

`query_string`을 이용해서도 `match_phrase`와 같이 구문을 검색이 가능한데 그럴 경우 검색어를 `\"`로 묶어주면 된다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      query_string: {
        default_field: 'field',
        query: '(condition1 AND condition2) OR "condition3 condition4"',
      },
    },
  }),
})
```

> `query_string`을 이용하여 구문 검색을 할 때 `slop`은 사용 할 수 없다.

### bool query

`데이터 본문 검색`을 통해 복합적인 조건을 구성하려면 `bool query (복합쿼리)`를 이용해야한다.

`bool query`는 다음의 네가지 인자를 가지고 있으며 각 인자에 따라 검색 조건이 달라진다.

- must
  - 조건이 반드시 true인 도큐먼트를 검색한다.
- must_not
  - 조건이 반드시 false인 도큐먼트를 검색한다.
- should
  - 검색된 결과중 이 조건에 부함하는 도큐먼트의 정확도 점수를 높인다.
- filter
  - 조건이 반드시 true인 도큐먼트를 검색하되 정확도 점수를 계산하지 않아 속도가 빠르고 캐싱이 된다는 장점이 있다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      bool: {
        must: [
          {
            match: {
              field: 'condition 1',
            },
          },
        ],
        must_not: [
          {
            match: {
              field: 'condition 3',
            },
          },
        ],
        should: [
          {
            match_phrase: {
              field: 'condition1 condition2',
            },
          },
        ],
      },
    },
  }),
})
```

> `should`를 이용한 검색 정확도 가중치 부여하기
>
> `elasticsearch`는 기본적으로 검색 결과의 정확도를 기준으로 결과를 정렬한다.
>
> `bool query`를 통해 도큐먼트를 조회 할 때 필요에 따라 더 중요한 키워드를 `should` 속성에 포함시켜 정확도 점수에 가중치를 부여할 수 있고 결과적으로 도큐먼트중 더 중요한 결과를 상위에 노출 시킬 수 있다.

> `filter`를 이용한 검색 정확도 배제하기
>
> 경우에 따라 겸색어가 정확도에 영향을 미쳐선 안되는 상황이 벌어질 수 있다. 이런 경우의 검색어 조건을 `filter` 속성에 포함시켜 정확도 점수에 영향을 주지 않도록 설정하고 검색 할 수 있다.

## Analyzer

관계형 데이터베이스의 일반적인 조회가 아닌 `Full-text search`를 이용하는 것을 통해 얻을 수 있는 이점중 하나는 동의어 검색 또는 원형을 통한 검색 (ex. _먹었다_ 라는 키워드를 통해 동일한 원형 (_먹다_)을 갖고 있는 키워드 (_먹었는데_, _먹고_)를 포함하는 도큐먼트를 조회하는 것)이다.

앞서 살펴본바와 같이 `elasticsearch`는 역색인 구조를 통해 도큐먼트를 조회하기 때문에 이런 고급검색 기능을 사용하기 위해서는 동의어와 원형을 통해 도큐먼트를 찾을 수 있도록 데이터를 저장하는 시점에 미리 적절한 index를 생성해야 한다.

저장하려는 데이터를 분석하여 적절한 index를 설정하는 것이 Analyzer의 역할이다.

### Analyzer의 구조

`Analyzer`는 다음 세가지 요소의 조합으로

- Character filters
- Tokenizer
- Token filters

저장 되려는 데이터는 각 요소를 거쳐 최종적으로 필요한 인덱스를 생성하며 저장된다.

1. Character filters

   문장을 특정 문자로 대치하거나 제거하는 과장을 담당하는 필터

1. Tokenizer

   입력된 도큐먼트를 어떤 기준을 통해 잘라내는 과정 (일반적으로는 whitespace를 기준으로 함)

1. Token filters

   잘라진 도큐먼트 요소들을 돌며 최종적인 index 키워드를 생성하는 과정으로 동의어, 원형등을 만들어 내고 (ing, ed 등의 접미사를 제거하거나 등록되어 있는 사전을 통해 동의어를 찾아 등록하는 등) 그렇게 만들어진 index와 도큐먼트를 연결함

> Tokenizer는 Character filters, token filters와 달리 반드시 하나만 정용 할 수 있다.

### Analyzer 적용

별도의 설정 없이 생성된 `elasticsearch`의 `index`는 기본값인 `standard analyzer`가 설정되어 있다. `standard analyzer`를 통해 생성된 색인은 이 문서의 소기의 목적이였던 `full-text search`의 강력한 기능들을 사용 할 수 없다.

`index`를 생성하는 시점에 어떤 `analyzer`를 사용할지 정의해야한다.

```javascript
const response = await fetch('http://localhost:9200/target_index', {
  method: 'put',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    mappings: {
      properties: {
        name: {
          type: 'text',
          analyzer: 'snowball',
        },
      },
    },
  }),
})
```

`index`가 생성되는 시점에 도큐먼트의 _name_ 필드에 _snowball_ analyzer를 적용하는 예시이다.

> snowball은 elasticsearch가 기본적으로 제공하는 analyzer

이렇게 생성된 `index`에 데이터를 저장하게 되면 앞서 이야기한 `Character filter`, `Tokenizer`, `Token filter`를 적절한 색인이 생성되고 마침내 동의어, 원형 검색 등이 가능하게 된다.

### 사용자 정의 Analyzer

사용자의 정의 `analyzer`는 character filter, tokenizer를 정의하고 token filter들을 조합하는 것을 통해 설정한다.

마찬가지로 `index`를 생성하는 시점에 해당 작업을 수행해야 한다.

```javascript
const response = await fetch('http://localhost:9200/target_index', {
  method: 'put',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    settings: {
      analysis: {
        analyzer: {
          custom_analyzer: {
            char_filter: ['custom_char_filter'],
            tokenizer: 'whitespace',
            filter: ['lowercase', 'snowball'],
          },
        },
        char_filter: {
          custom_char_filter: {
            type: 'mapping',
            mappings: ['as soon as possible', '_asap_'],
          },
        },
      },
    },
    mappings: {
      properties: {
        message: {
          type: 'text',
          analyzer: 'custom_analyzer',
        },
      },
    },
  }),
})
```

> 사용자 analyzer를 정의하는 것은 새로운 *Character Filter*를 정의하여 사용할 수 있고 마찬가지로 *Token Filter*를 정의하여 사용할 수도 있다.
>
> *Token Filter*의 조합 순서에 따라 생성되는 index의 결과가 달라질 수 있는 것에 유의해야 한다.

## 그 밖의 검색

### Exact value query

정확한 문자열 검색을 해야할 때 `[field].keyword`를 이용한다

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-type']: 'application/json' },
  body: JSON.stringify({
    query: {
      bool: {
        filter: [
          {
            match: {
              ['name.keyword']: 'Condition 1',
            },
          },
        ],
      },
    },
  }),
})
```

> `[field].keyword` 형식의 검색조건을 설정할 때 `bool query`의 `filter` 속성을 이용하는 것을 권장한다.
>
> Exact value query는 정확도와 관계가 없기 때문에 정확도 점수를 계산할 필요가 없으며 그 결과 `filter`를 통해 검색하는 것이 캐싱이 가능하고 검색 성능이 더 우수하기 때문이다.

### Range query

숫자와 날짜 형식을 포함하고 있는 도큐먼트를 대상으로 검색을 수행할 때 범위를 통한 조건 설정이 가능하다. `range query`는 다음 네가지의 속성을 통해 범위 설정이 가능하다.

- gte (Greater Than or Equal to)
  - 이상
- gt (Grater Than)
  - 초과
- lte (Less Than or Equal to)
  - 이하
- lt (Less Than)
  - 미만

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-Type']: 'application/json' },
  body: JSON.stringify({
    query: {
      range: {
        price: {
          gte: 3000,
          lte: 4000,
        },
      },
    },
  }),
})
```

날짜 데이터의 범위 검색도 숫자 데이터의 범위 검색과 동일하지만 몇가지 옵션이 있다.

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-Type']: 'application/json' },
  body: JSON.stringify({
    query: {
      range: {
        manufacture_date: {
          gte: '2021/11/01',
          lt: '2021/12/01',
          format: 'yyyy/mm/dd', // 날짜 형식을 결정하는 속성
        },
      },
    },
  }),
})
```

`format` 속성을 통해 날짜의 형식을 결정 할 수 있다.

예약어를 통해 범위를 결정하는 방법도 있다. 예약어는 아래의 8가지가 존재한다

- now: 현재시간
- y: 년
- M: 월
- d: 일
- h: 시
- m: 분
- s: 초
- w: 주

```javascript
const response = await fetch('http://localhost:9200/target_index/_search', {
  method: 'post',
  headers: { ['Content-Type']: 'application/json' },
  body: JSON.stringify({
    query: {
      range: {
        manufacture_date: {
          lte: 'now-1w', // 지금으로 부터 일주일 전까지의 날짜에 속하는 도큐먼트를 검색함
        },
      },
    },
  }),
})
```

> 범위검색은 기본적으로 정확도 점수를 계산하지 않는다.
>
> 경우에 따라 어던 기준으로 부터 더 가까운 값이 중요한 결과로 취급 될 수 있는데 이런 경우에는 [Function score query](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/query-dsl-function-score-query.html)를 이용해야한다.
