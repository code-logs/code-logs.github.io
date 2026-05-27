> 본 포스팅 시리즈는 [roadmap.sh](https://roadmap.sh/frontend)의 학습 순서에 따라 정리한 글 입니다.

## HTTP는 무엇인가?

`HTTP (Hypertext Transfer Protocol)`는 `World Wide Web`의 근간이며 하이퍼텍스트 링크를 사용하는 웹페이지를 불러오는데 사용된다.
HTTP는 application layer의 프로토콜로 네트워크로 연결된 장치간의 정보 교환을 위해 디자인 되었으며 네트워크 프로토콜 스택의 최상단에서 운영된다.
일반적인 HTTP의 흐름은 클라이언트 머신이 서버로 요청을 보내고 서버는 응답을 반환하는 형태로 이루어진다.

## HTTP Request

HTTP 리퀘스트는 웹브라우저와 같은 인터넷 커뮤니케이션 플랫폼에 의해 웹사이트에 로드하고자 하는 정보를 요청하는 것이다.
각 HTTP 요청은 다양한 형태의 정보가 연속적으로 인코딩된 형태로 인터넷을 통해 운반된다. 일반적인 HTTP 요청은 아래의 항목을 포함하고 있다.

- HTTP 버전
- URL
- HTTP method
- HTTP 요청 헤더
- HTTP body - optional

### HTTP method는 무엇인가?

HTTP 메서드는 HTTP 요청에 의해 요청을 받은 서버로 부터 기대하는 일련의 동작을 지시하는 동사로 일컬어지곤 한다. 예를들어 자주 사용되는 두가지 메서드 `GET`과 `POST`, `GET` 요청은 응답으로 어떤 정보를 얻는 것을 기대한다. 반면 `POST` 요청은 일반적으로 클라이언트가 웹서버로 어떤 정보를 전송하는 것을 의미한다.

### HTTP 요청 headers는 무엇인가?

HTTP 헤더는 키-밸류 쌍의 텍스트 정보를 포함하며, 모든 HTTP 요청은 HTTP 헤더를 가지고 있다. 헤더는 사용자가 사용하는 브라우저가 무엇인지, 어떤 데이터가 요청 되었는지와 같은 요청에 대한 핵심 정보를 포함한다.

### HTTP 요청 body는 무엇인가?

리퀘스트 바디는 요청이 전송하는 정보의 `몸체`를 의미한다. HTTP 요청의 body는 사용자 이름, 비밀번호 또는 웹페이지의 폼을 통해 전송되는 데이터와 같이 웹서버로 전송될 데이터를 포함하고 있다.

## HTTP Response

HTTP 응답은 웹클라이언트가 (대체로 브라우저) HTTP 요청을 통해 서버로 부터 돌려 받은 응답을 의미한다.
일반적으로 HTTP 응답은 아래와 같이 구성된다.

- HTTP status code
- HTTP 응답 헤더
- HTTP body - optional

### HTTP status code는 무엇인가?

HTTP status code는 3자리 숫자로 HTTP 요청의 성공 여부를 가르키기 위해 사용된다. status code는 아래의 다섯가지 유형으로 나눌 수 있다.

- 1xx Information
- 2xx Success
- 3xx Redirection
- 4xx Client Error
- 5xx Server Error

> `xx`는 00 부터 99까지의 범위를 갖고 있다.

### HTTP 응답 headers는 무엇인가?

HTTP 요청과 유사하게 HTTP 응답 또한 응답 데이터와 관련된 주요한 정보를 전달하기 위해 존재한다.

### HTTP 응답 body는 무엇인가?

성공적으로 클라이언트에 도달한 `GET` 요청에 대한 응답은 일반적으로 요청한 데이터가 response body에 포함된다. 대부분의 웹 요청은 브라우저에 의해 웹 페이지로 번역될 HTML 데이터를 포함하고 있다.
