## 검색 엔진 최적화란?

검색 엔진 최적화란 인터넷을 통해 공개된 웹문서가 검색엔진을 통해 검색 될 수 있도록 준비하는 작업이다.
아무리 좋은 컨텐츠를 포함한 문서라 할지라도 검색 엔진을 통해 조회 될 수 없다면 해당 문서에 대한 일반 사용자들의 접근은 쉽지 않다.

최적화를 위한 기준은 검색엔진에 따라 다소 차이가 있을 수 있으나 아래에 설명하는 내용들을 대체로 따른다고 판단 할 수 있을 것이다.

## 검색 엔진 최적화에 도움이되는 태그

HTML 문서에는 검색 엔진 최적화에 도움이 되는 특정한 태그들이 있다.
크게 나누어

- Title tag
- Meta tag

### Title tag

Title tag는 말 그대로 웹문서의 제목을 나타내는 태그다.
어떤 문서의 제목은 전체적인 내용을 파악 할 수 있어야 하는 상당히 중요한 정보이며 웹문서에서도 이는 마찬가지다. 고유하고 의미 있는 제목을 웹문서에 포함시킴으로서 검색 엔진 최적화에 도움을 줄 수 있다.

Title tag는 문서의 head에 추가해야 한다.

```html
<html lang="ko">
  <head>
    <title>Your webpage title</title>
  </head>
  <body>
    ...
  </body>
</html>
```

> 하나의 웹사이트에서 다양한 페이지를 가지고 있을 경우 모든 페이지에서 웹사이트명칭을 공통적으로 노출 시킬 수 있도록 하기 위해 `웹사이트명 - 현재페이지명`과 같은 형식의 title 태그 사용을 권장함.

### Meta tag

Meta tag는 title tag와 마찬가지로 웹문서의 `<head></head>` 영역에 자리잡는 태그다.
meta tag는 웹문서를 설명하기 위한 몇가지 정보를 담고 있는데 웹문서의 내용에 대한 설명뿐 아니라
viewport를 제어하거나 메신저를 통한 문서의 참조시에 사용되는 정보 등을 담을 수 있다.

Meta tag는 사용목적에 따른 몇가지 표기법이 존재 하는데 본문에서는 검색엔진 최적화와 관계되어 있는 경우에 대해서만 서술한다.

```html
<meta name="${name}" content="${content}" />
```

- description - 문서의 전체적인 설명을 담고 있는 meta tag

  ```html
  <meta name="description" content="현재 페이지를 설명 할 수 있는 내용을 적습니다." />
  ```

- keywords - 문서의 내용에서의 키워드들을 담고 있는 meta tag

  ```html
  <meta name="keywords" content="검색, 검색엔진, 검색엔진 최적화, SEO" />
  ```

  > `keywords`의 경우 ','를 이용해 각 키워드를 구분 해야함.

Meta tag는 현재 웹문서의 내용을 가능한 정확히 파악 할 수 있도록 구체적인 내용을 서술 하는 것이 좋다.

> 실제 문서의 내용과 무관한 meta tag 등록을 통해 노출빈도를 올리려하면 검색엔진의 로봇에게 적발시 불이익을 받을 수 있음.

> 일부 검색엔진은 `keywords`를 색인 대상으로 삼지 않는다고함 ~~다다익선~~.

## 절대경로

웹문서간의 링크를 위해 `<a>` 태그를 사용 할 때 절대경로를 사용하는 것을 권장한다. 이는 검색엔진 최적화에 직접적인 영향을 주는 것은 아니지만 검색엔진의 로봇이 특정 웹문서의 페이지를 분석 할 때 문서의 내용을 훑어 보고 연결된 페이지들을 찾는데에 도움을 주기 때문에 새롭게 업로드된 웹페이지 색인을 도울 수 있다.

또한 `javascript`를 통한 페이지 전환은 가능한 피하는 것이 좋다. 웬문서를 탐색하는 로봇은 `javascript` 실행 결과를 예측하여 페이지를 찾을 수 없기 때문이다.

> 절대경로의 사용이 반드시 필요한 것은 아님. 기본적으로 검색 엔진의 로봇들은 상대경로를 통해서도 올바른 페이지를 찾아 색인 할 수 있기 때문임.

## robots.txt

`robots.txt` 파일은 검색엔진 로봇의 접근을 허용/방지하기 위한 설명을 기술한 파일로 웹사이트가 공개되는 URL에 `robots.txt` pathname을 통해 접근 할 수 있어야 한다.

> https://code-logs.github.io/robots.txt

`robots.txt` 파일에 포함 할 수 있는 지시어들:

- User-agent: 규칙을 적용할 대상 검색 엔진 로봇의 명칭
- Disallow: `User-agent`의 접근을 차단 하기 위한 설정
- Allow: `User-agent`의 접근을 허용 하기 위한 설정
- Sitemap: `sitemap` 파일을 참조 할 수 있는 URL 경로

아래의 몇가지 예를 통해 사용법에 대해 알아 보겠습니다.

- **모든 검색엔진** 에게 **모든 페이지** 의 크롤링을 **허용** 하는 경우

  ```
  User-agent: *
  Allow: /

  Sitemap: https://code-logs.github.io/sitemap.xml
  ```

- **모든 검색엔진** 에게 **모든 페이지** 의 크롤링을 **차단** 하는 경우

  ```
  User-agent: *
  Disallow: /

  Sitemap: https://code-logs.github.io/sitemap.xml
  ```

- **Google Bot** 에게 **/public 페이지** 의 크롤링을 **허용** 하는 경우

  ```
  User-agent: Google Bot
  Allow: /public

  Sitemap: https://code-logs.github.io/sitemap.xml
  ```

- **Google Bot** 에게 **/private 페이지** 의 크롤링을 **차단** 하는 경우

  ```
  User-agent: Google Bot
  Disallow: /private

  Sitemap: https://code-logs.github.io/sitemap.xml
  ```

- 복합적인 케이스

  ```
  User-agent: Google Bot
  Allow: /
  Disallow: /private
  Disallow: /public/secret.html

  User-agent: Yeti
  Allow: /
  Disallow: /private

  Sitemap: https://code-logs.github.io/sitemap.xml
  ```

## sitemap.xml

Sitemap은 공개된 사이트에 포함된 페이지, 동영상, 파일등과 그 관계에 대한 정보를 제공하는 파일이다. 검색엔진은 sitemap 파일을 통해 웹사이트의 페이지 정보를 보다 직접적으로 확인 할 수 있다. sitemap을 제공하는 것이 검색엔진 최적화에 직접적인 영향을 준다고 보기는 어렵지만 웹페이지의 내용이 업데이트 되었을 경우 검색엔진의 로봇은 이 변경사항을 sitemap을 통해 확인하고 색인 생성이 가능한 빨리 되도록 돕고 결과적으로 검색엔진을 통해 검색이 가능해지는 시점을 앞당기는데에 도움이 된다고 볼 수 있다.

sitemap을 제공하는 방법은 반드시 `xml` 파일 형식으로만 가능한 것은 아니지만 본문에서는 `xml` 형식을 기준으로 작성한다.

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://code-logs.github.io</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <lastmod>2021-10-08T10:09:29.284Z</lastmod>
  </url>
  <url>
    <loc>https://code-logs.github.io/posts</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <lastmod>2021-10-08T10:09:29.284Z</lastmod>
  </url>
  <url>
    <loc>https://code-logs.github.io/about</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
    <lastmod>2021-10-08T10:09:29.284Z</lastmod>
  </url>
</urlset>
```

위 sitemap.xml 파일은 총 세개의 페이지에 대한 정보를 포함하고 있다. 각 `<url>` 블록을 통해 페이지별 정보를 확인 할 수 있다.

sitemap.xml의 표준에 따르는 attributes:

- urlset _<필수>_
  - 현재 프로토콜의 표준을 참조
- url _<필수>_
  - 각 URL 항목의 상위 태그.
- loc _<필수>_
  - 페이지에 접근 할 수 있는 URL
- lastmod _<선택>_
  - 페이지의 최종 수정 날짜를 입력
- changefreq _<선택>_
  - 페이지의 업데이트 빈도, 검색엔진에 정보 제공용도로 사용되며 크롤러의 색인 빈도와 관계 없을 수 있음
  - `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never` 중 택 1
- priority _<선택>_
  - 현재 **웹사이트 내**에서의 페이지 우선 순위를 결정함. 같은 사이트 내의 중요한 페이지를 검색색인에 더 쉽게 노출하기 위해 사용 하지만 다른 사이트와의 관계에서는 전혀 영향을 주지 않는다.

> 참조
> [sitemaps.org](https://www.sitemaps.org/ko/protocol.html)

## 마치며

사실 공개된 서비스에 대한 경험이 많지 않아서 이 블로그를 만드는 작업을 하면서 새롭게 접한 부분들, 내용에 대해 알고는 있었지만 실제로 작업해 본적이 없는 것들도 있었고 직접 해보게 되어 개인적으로는 좋은 경험이 되었다.
앞으로 이 페이지를 통해 조금더 효과적은 SEO에 대해 정리해 나갈 생각이다.
