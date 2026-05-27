## GraphQL

> GraphQL은 2012년 부터 페이스북에 의해 개발되었으며 2015년에 공식적으로 발표되었다.
> RESTful API로 대표되는 클라이언트와 서버의 통신 아키텍쳐중 하나이다. 단일 Resource를 대상으로하는 RESTful API와 다르게 Graph 구조, 즉 노드간의 상관관계를 통해 클라이언트에서 반환 받고자 하는 데이터의 형식을 결정 할 수 있는 것이 특징이다.
> 이를 통해 불필요한 데이터의 fetching을 방지 할 수 있다는 것과 클라이언트 소스의 수정만으로 기대되는 API의 Return type을 조정 할 수 있다는 장점을 가지고 있다.

## Typescript와 찰떡 궁합

GraphQL은 ‘강한 타입’ 제약을 가지는 것이 특징이다. GraphQL 아키텍쳐로 구성된 서버는 클라이언트에서 요구하는 데이터 유형과 정확히 일치하는 데이터 유형을 반환해야 하기 때문이다.

## Apollo Server

GraphQL 환경의 클라이언트와 통신하기 위한 Node.js 서버를 구성할 수 있는 패키지다. Apollo Server는 GrpahQL 아키텍쳐의 간단한 서버를 구성하는 것을 목적으로 하기 때문에 조금더 복잡한 구조의 Node.js 서버 구성을 위해서는 `apollo-server-express` 또는 `apollo-server-koa` 와 같은 디펜던시를 `Express` , `Koa` 와 같은 프레임워크에 엮어서 사용해아 한다.

## Apollo Server 구성하기

node 프로젝트를 초기화하고 필요한 디펜던시를 설치한다.

```bash
$ npm init -y
$ npm i graphql apollo-server
```

### Schema - 객체 형태 정의하기

GraphQL은 `강한 타입 제약` 을 가지고 있고 이것을 정의하는 역할을 하게 되는 것이 바로 `Schema`이다. 스키마의 아래 예제를 통해 `User` schema를 정의한다.

```typescript
// typeDefs.ts

import { gql } from 'apollo-server'

const typeDefs = gql`
  type User {
    id: Int
    name: String
    age: Int
  }

  input NewUser {
    name: String!
    age: Int!
  }
`
```

User라는 명칭의 schema는 String 타입의 `name` 필드와 Int 타입의 `age` 필드를 가지고 있다.

> `User` 유형의 schema는 데이터를 반환할 때 사용하는 형태다 (객체 타입)
> `input` 유형의 schema는 클라이언트에서 서버로 데이터를 전달 할 때 사용하는 형태다

> `GraphQL`의 schema 타입을 정의할 때 `javascript`의 원시 타입 (number, string, boolean 등)을 사용하는 것이 아닌 `GraphQL`의 자체 타입을 사용한다. - [참조](https://graphql.org/learn/schema/)

### Schema - Query 정의하기

클라이언트와 서버가 통신하기 위한 입/출력(`type/input`) schema를 정의 했으니 이제 RESTful API의 endpoint와 유사한 `Query` schema를 정의한다.

```typescript
// typeDefs.ts

import { gql } from 'apollo-server'

const typeDefs = gql`
	...

	type Query {
		user(name: String!): User
		users: [User]
	}
`
```

`Query` 타입의 schema는 말 그대로 데이터를 조회하기 위해 사용되는 schema에 대한 정보다.

두가지 Query 유형의 schema가 정의되었고 `User` 를 리턴하는 `user` query와 `[User]` 를 리턴하는 `users` query다.

### Schema - Mutation 정의하기

Query를 정의 했으니 이제 `Mutation`을 정의한다. `Mutation`은 말그대로 데이터의 변이를 발생시키는 스키마를 의미한다.

```typescript
// typeDefs.ts

import { gql } from 'apollo-server'

const typeDefs = gql`
	...

	type Mutation {
		addUser(user: NewUser!): User
		deleteUser(id: String!): Boolean
	}
`
```

새로운 사용자를 추가할 때 사용할 `addUser` schema와 `ID` 를 통해 사용자를 삭제할 때 사용할 `deleteUser` 스키마를 정의 했다.

> Mutation 스키마의 파라미터로 사용되는 스키마는 반드시 `input` 타입 스키마를 사용하며
> Query의 반환결과로 사용되는 스키마는 반드시 객체 타입의 스키마를 사용한다.

> 두 스키마는 각각 `User`와 `Boolean` 을 리턴 타입으로 갖고 있는데 GraphQL에서는 `void` 유형이 없는 것 또한 특징이다. `void` 를 사용해야 할 때 리턴 타입을 Boolean으로 선언한다.

### Resolver - 실제 작업이 일어나는 곳

지금까지 작성한 Schema는

`User`, `New User`, `Query - user`, `Query - users`, `Mutation - addUser`, `Mutation - deleteUser` 로 사용자를 조회하고 생성하고 삭제하기 위한 필요한 타입 정의는 끝났으니 이제 실제 데이터를 가공하는 로직을 작성해야 한다.

이렇게 정의된 schema를 통해 클라이언트로 부터 데이터를 전달 받고 처리하는 것을 `resolver`라 한다.

### 사전 작업 - Dummy Data

우선 본격적으로 resolver를 정의하기 전에 테스트로 사용할 더미 데이터와 인터페이스를 만든다.

```typescript
// dummy-data.ts

export interface User {
  id: number
  name: string
  age: number
}

export const dummyUsers = Array.from({ length: 20 }, (_, idx) => {
  return {
    id: idx + 1,
    name: `Sample User ${idx + 1}`,
    age: Math.floor(Math.random() * 20),
  }
})
```

이제 조회 `user`, `users` 처리를 위한 `resolver`를 정의한다.

### Query 작성하기

`Query`는 데이터 조회를 위한 `resolver`에 해당한다. `name`을 parameter로 전달 받아 동일한 `name`을 가진 사용자를 반환하는 `user` resolver와 `user` 전체 리스트를 반환하는 `users` resolver를 작성한다.

```typescript
// resolvers.ts
import { dummyUsers, User } from './dummy-data'

let users = [...dummyUsers]

const resolvers = {
  Query: {
    user: (_: unknown, { name }: { name: string }) => {
      return users.find((user) => user.name === name)
    },

    users: () => {
      return users
    },
  },
}
```

### Mutation 작성하기

`Mutation`은 데이터의 변이가 일어나는 `resolver`에 해당한다. `user` 객체를 parameter로 전달 받아 새로운 `user` 데이터를 생성하는 `addUser` resolver와 사용자의 `id` 를 전달받아 일치하는 사용자 데이터를 삭제하는 `deleteUser` resolver를 작성한다.

```typescript
// resolvers.ts

...

const resolvers = {

  ...

  Mutation: {
    addUser: (_: unknown, { user }: { user: User }) => {
      const newUser = {
        ...user,
        id: users[users.length - 1].id + 1,
      }
      users.push(newUser)
      return newUser
    },
    deleteUser: (_: unknown, { id }: { id: number }) => {
      users = users.filter((user) => user.id !== id)
    },
  },
}
```

> Resolver의 parameter들
>
> resolver는 `parent`, `args`, `context`, `info` 네개의 parameter를 전달 받는다
> 각 parameter의 역할은 아래와 같다.
>
> `parent` - `field resolver`를 통해 현재 resolver가 호출 될 경우 부모 resolver에 의해 반환된 객체 (Resolver chaining)
>
> `args` - resolver를 호출할 때 전달한 인자
>
> `context` - 모든 resolver에 공통적으로 전달되는 `context` 객체로 일반적으로 미들웨어를 통해 기록된 값이 담겨있다.
>
> `info` - schema 정보와 field 정보 등을 담은 객체

### Apollo Server 실행하기

Apollo Server를 실행하기 위한 type과 resolver가 모두 정의 되었으니 `apollo server` 를 실행하고 테스트 해본다.

```typescript
import { ApolloServer } from 'apollo-server'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(8080).then(() => {
  console.log('Apollo Server is running on 8080')
})
```

Apollo Server를 실행하면 `Apollo Studio` 를 통해 작성한 GraphQL 서버로 요청을 보낼 수 있다.

> **GraphQL Queries And Mutations**
>
> GraphQL에 요청을 보내기 위해 사용하게 되는 Syntax는 _query_ 또는 *mutation*에 관심 있는 필드를 정의하는 것을 기본으로 한다.
>
> [이곳](https://graphql.org/learn/queries/) 에서 보다 자세한 내용을 확인 할 수 있다.

## Field resolver를 이용한 테이블 Join

GraphQL은 반환하는 `Object type`의 모든 필드의 값이 `resolver` 에 의해 채워진다. 어떤 필드에 특정한 resolver가 정의되어 있지 않다면 일반적으로 `object.field` 와 같은 형태로 값을 채우게 된다. (default resolver)

만약 특정 필드가 또 다른 테이블 (객체)을 통해 값이 결정 된다면 `field resolver` 를 정의하여 쉽게 값을 채울 수 있다.

사용자가 `Company`라는 테이블과 relation을 가지고 있다면 아래와 같이 field resolver를 정의 할 수 있다.

```typescript
// dummy-data.ts
...

export const dummyUsers = Array.from({ length: 20 }, (_, idx) => {
  return {
    id: idx + 1,
    name: `Sample User ${idx + 1}`,
    age: Math.floor(Math.random() * 20),
    companyId: (idx % 3) + 1, // company id를 통해 company 객체를 참조한다.
  }
}) as User[]

export interface Company {
  id: number
  name: string
}

export const dummyCompanies = Array.from({ length: 3 }, (_, idx) => {
  return {
    id: idx + 1,
    name: `Sample Company ${idx + 1}`,
  }
}) as Company[]

```

```typescript
// resolvers.ts
import { dummyUsers, User, dummyCompanies } from './dummy-data'

...

let companies = [...dummyCompanies]


const resolvers = {
	...

	User: {
		company: (parent: User) => {
            return companies.find((company) => company.id === parent.companyId)
		}
	}
}
```

field resolver를 이용할 경우 resolver chain을 통해 해당 필드에 대한 접근을 시도할 때에만 대상 객체에 접근하도록 구성 할 수 있고 가상 필드와 같은 효과를 손쉽게 구현 할 수 있다는 장점이 있다. 반면에 리스트 데이터를 조회할 때 유사한 결과를 리턴하는 레코드가 많이 포함되어 있다면 같은 로직을 여러차례 반복하게 되는 단점도 있다. (N + 1 problem)

> **N + 1 problem**
>
> 사용자 레코드를 조회 할 때 사용자를 조회하기 위한 쿼리 1회 + 사용자와 관계를 맺고 있는 회사 레코드를 조회하는 쿼리 N 회가 발생하는 문제로 동일한 쿼리일 가능성이 높은 N회의 쿼리가 반복적으로 발생하는 문제
>
> [DataLoader](https://github.com/graphql/dataloader)와 같은 라이브러리를 이용해 caching, 또는 batch 처리 등의 방법으로 N + 1 problem으로 인해 발생하는 비효율성을 개선하기도 한다.

## TypeGraphQL

GraphQL을 이용한 프로젝트를 구성하다 보면 type 정의, resolver 정의 그리고 entity, interface 등 상당히 많은 파일들을 생성해내야 한다.

프로젝트 구조가 복잡해지거니와 유사한 형태의 파일들을 반복적으로 작성해야하는 것은 번거로운 일이다.

TypeGraphQL은 이런 번거로움을 해결하기 위한 라이브러리로 class를 정의하는 것을 통해 entity와 GraphQL type의 정의를 동시에 처리 할 수 있도록 돕는다.

### 디펜던시 설치

TypeGraphQL을 사용하기 위해 필요한 디펜던시를 설치한다.

```bash
$ npm i graphql class-validator type-graphql reflect-metadata
```

> 만약 디펜던시 설치중 에러가 발생한다면 type-graphql의 peer dependency인 graphql의 버전을 확인하고
>
> 필요한 경우 graphql을 삭제한 뒤 다시 설치한다

### tsconfig configuration

```json
// tsconfig.json
{
  "target": "es2018", // type-graphql이 es2018 spec에 의존하고 있다
  "emitDecoratorMetadata": true, // decorator를 사용하기 위해 true로 설정
  "experimentalDecorators": true // decorator를 사용하기 위해 true로 설정
}
```

### Class 정의

class 정의를 통해 GraphQL의 type과 typescript의 interface 역할을 수행할 객체를 정의 할 수 있다.

```typescript
// entities/User.ts

import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class User {
  @Field((type) => ID)
  id!: number

  @Field()
  name!: string

  @Field()
  age!: number
}
```

### Resolver 정의

resolver 또한 class 형식으로 정의 할 수 있다.

```typescript
// resolvers/User.ts

import { Arg, Query, Resolver } from 'type-graphql'
import { dummyUsers } from '../dummy-data'
import { User } from '../entities/User'

let users = [...dummyUsers]

@Resolver()
export class UserResolver {
  @Query((returns) => User)
  user(@Arg('name') name: string) {
    const foundUser = users.find((user) => user.name === name) || null
    if (!foundUser) throw new Error('No user found')

    return foundUser
  }

  @Query((returns) => [User])
  users() {
    return users
  }
}
```

> TypeGraphQL을 통해 resolver를 정의할 경우 반환 타입에 대한 validation이 더 엄격해진다. `null` 을 반환 할 수 없는 `Query` 의 경우 반환할 결과물이 없을 경우 `null` 또는 `undefined` 를 리턴하지 않도록 에러 처리를 해줘야한다.

### Schema 생성하기

이렇게 정의한 `resolver`를 통해 schema를 생성해야 한다. 생성된 schema는 Apollo Server를 실행할 때 전달되는 `config` 로 사용된다.

```typescript
// app.ts

import { ApolloServer } from 'apollo-server'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/User'

buildSchema({
  resolvers: [UserResolver],
}).then((schema) => {
  const server = new ApolloServer({ schema })

  server.listen(8080).then(() => {
    console.log('Apollo Server is running on 8080')
  })
})
```

> `'reflect-metadata'` 를 import 해야한다. schema 생성시 해당 모듈에 의존하기 때문이다.

### 그 밖의 설정들

그 밖의 설정들은 [공식 문서를](https://typegraphql.com/docs/introduction.html) 참조한다.
