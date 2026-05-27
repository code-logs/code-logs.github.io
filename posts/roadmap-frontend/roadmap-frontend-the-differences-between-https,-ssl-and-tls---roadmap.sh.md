> 본 포스팅 시리즈는 [roadmap.sh](https://roadmap.sh/frontend)의 학습 순서에 따라 정리한 글 입니다.

## HTTPS

HTTPS는 보안이 강화된 HTTP 프로토콜이다.

보안을 강화하기 위해 클라이언트와 서버간 통신 데이터를 암호화 하는데 암호화하는데 사용되는 프로토콜이 SSL/TLS 이다.

## SSL (Secure Sockets Layer)

SSL은 Netscape 의해 정립된 보안 프로토콜이다. Netscape는 1995년에 Netscape 브라우저 1.1에 SSL v2를 포함하여 릴리즈한다. (SSL v1은 정식으로 릴리즈된 적이 없다.) 그러나 그 다음해에 SSL v2가 가지고 있는 여러 보안 이슈로인해 v3를 출시하게 된다.

인터넷 환경에 대한 기업간 경쟁이 심화되면서 Netscape는 1999년 SSL에 대한 권한을 IETF (Internet Engineering Task Force)에게 넘기게 된다.

1999년이 끝나기도 전에 IETF는 TLS v1을 출시하는데 이것이 SSL v3.1과 다르지 않다.

## TLS (Transport Layer Security)

SSL의 권한에 대한 양도를 받은 IETF는 이후 TLS라는 명칭의 프로토콜을 출시하며 1999년 버전 1을 출시, 2006년에는 버전 1.1을 출시한다. 2008년에는 버전 1.2를 출시하는데 현재까지도 권장버전으로 사용되는 버전 1.2는 2013년이 될때 까지도 브라우저에서 지원되지 않았다.

2013년 이후 브라우저는 TLS 버전 1.2를 지원하기 시작했고 이후 SSL과 TLS의 혼용이 발생하여 혼란을 야기 했다 이러한 혼란을 줄이기 위해 마침내 2015년 SSL 3.0은 공식적으로 deprecate 되었다.

2018년 TLS는 1.3 버전을 출시했고 1.3 버전은 이전 버전과 비교하여 보안성 향상에 약진하게 되었다.
