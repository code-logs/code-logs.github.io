## Plugin

`Plugin`은 `ESLint` rule이 들어 있는 하나의 `Rule set` 이다.

`Plugin`은 일반적으로 `eslint-plugin-${plugin-name}` 형식의 이름을 갖는 패키지다.

플러그인을 사용하기 위해선 필요한 플러그인을 설치하고 ESLint 설정파일의 `plugins` 프로퍼티에 추가하면 된다.

```json
{
  "plugins": ["react"]
}
```

> Plugin을 추가 할 때 prefix인 `eslint-plugin-` 부분은 생략 가능하다.

플러그인을 적용한다는 것은 플러그인에 정의되어 있는 Rule set을 사용하겠다는 것을 의미하지는 않는다.

플러그인은 여러가지 Rule set을 제공할 뿐 특정 룰을 사용하려면 이를 직접 작성야한다.

사용하고자 하는 룰은 `rules` 프로퍼티를 통해 정의한다.

플러그인이 제공하는 Rule set의 수는 상당히 방대하고 이것들을 모두 수동으로 설정하는 것은 번거로운 일이다.

## Sharable config

앞서 이야기한 번거로움을 해결하기 위해 `sharable config`가 존재한다. `sharable config`는 일반적으로 `eslint-config-${config-name}` 형식의 이름을 갖는 패키지이다. 사용하려는 rule set을 수동으로 적용하는 것이 아닌 sharable config를 적용하는 것을 통해 방대한 rule set을 한번에 적용할 수 있다.

sharable config의 사용여부는 ESLint 설정파일의 `extends` 프로퍼티에 해당 sharable config를 추가하면 된다.

```json
{
  "extends": ["prettier"]
}
```

> `eslint-plugin` 과 같이 prefix인 `eslint-config-` 는 생략 가능하다.

## Plugin with Config

일부 플러그인은 sharable config를 함께 가지고 있다. plugin과 config를 각각 설치하는 것이 아닌 plugin 설치를 통해 config 까지 함께 설치되는 것이다.

plugin이 내장하고 있는 config를 사용하기 위해서는 sharable config 설정과 동일한 방법으로 하돼 `plugin:` Prefix를 붙여준다.

```json
{
  "extends": ["plugin:react/recomended"]
}
```

> `eslint-plugin-react`가 제공하는 `recomended` config를 사용하는 예제로 prefix인 `eslint-plugin`은 생략 가능하다.

> Plugin이 제공하는 config를 확인하기 위해선 해당 플러그인의 `root/index.js` 를 참고하면 된다. (일반적으로) index.js 에서 export 하는 Object에서 configs property를 통해 어떤 config가 제공되고 있는지 확인 할 수 있다.
>
> [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L118-L179)
>
> 상기 저장소에서 `eslint-plugin-react`가 제공하는 config를 확인 할 수 있다.

## 마무리

`plugins`에 추가하는 것은 모든 룰셋을 로드하지만 실제로 적용하는 것은 아닌 상태이다.
다시 말해 `config` 또는 `rules`에 어떠한 설정도 하지 않은 상태로 `plugins`만 추가 한다면 모든 설정을 `off`로 설정한 것과 같다.

`extends`에 `config`를 추가하는 것은 사용하려는 `plugins`를 이미 추가한 것과 같아서 `plugins`를 별도로 추가하지 않아도 된다.

> `plugin`이 제공하는 `config` 를 사용할 경우
>
> - `extends`만 추가 (`plugins`를 추가하지 않아도 설정을 불러올수 있음)
>
> `plugin`이 제공하는 `config` 를 사용하지 않고 직접 정의할 경우
>
> - `plugin`을 추가하고 필요한 설정을 `rules` 를 통해 정의
