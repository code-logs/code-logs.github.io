> 본 포스팅 시리즈는 [roadmap.sh](https://roadmap.sh/frontend)의 학습 순서에 따라 정리한 글 입니다.

## HTTPS가 필요한 이유?

1. 개인정보 보호
1. 데이터 무결성
1. 신원증명

### 개인정보 보호

`HTTP` 프로토콜은 네트워크를 통해 전송되는 데이터 패킷을 암호화 하지 않는다 그로인해 [`Wireshark`](https://www.wireshark.org/)와 같은 패킷 분석 툴을 통해 `클라이언트 - 서버`간 전송되는 데이터가 외부로 유출 될 수 있다.
반면에 `HTTPS`를 통해 전송되는 패킷은 암호화를 통해 패킷에 포함된 데이터를 암호화 하기 때문에 패킷이 중간에 외부로 유출 되더라도 원문의 내용을 확인 할 수 없다.

### 데이터 무결성

`HTTP` 프로토콜을 통해 전송되는 데이터 패킷은 중간에 패킷에 대한 변형을 가 할 수 있는 위험 `(man-in-the-middle attack)`에 노출되어 있다. 이는 네트워크간 전송/수신하는 데이터의 무결성을 헤치게 된다.
반면 `HTTPS`를 통해 전달되는 패킷은 중간자에 의해 패킷의 내용이 조작되지 않도록 보호한다.

### 신원증명

`HTTPS` 프로토콜을 사용하는 웹사이트는 인증된 기관으로 부터 발급 받은 `certification`을 가지고 있다. 방문자는 `certification`의 존재 여부를 통해 신뢰할 수 있는 사이트인지 여부를 검증 할 수 있다.

## HTTPS의 동작 원리

### 대칭키 (symmetric) 암호화 알고리즘

대칭키 암호화 알고리즘은 하나의 키를 통해 암호화/복호화가 모두 가능한 알고리즘이다.

### 비대칭키 (asymmetric) 암호화 알고리즘

비대칭키 암호화 알고리즘은 공개키와 비공개키, 두개의 키로 구성된다.
공개키는 암호화를 하는데 사용되며 비공개키를 통해서만 공개키로 암호화된 데이터를 복호화 할 수 있다.

### The Handshake

`3 way handshake`는 `SYN (client)` → `SYN ACK (server)` → `ACK (client)` 의 순으로 진행되는 TCP 연결 생성을 위한 핸드쉐이크이다.

> SYN
> synchronize sequence numbers
> ACK
> Acknowledgement

TCP 연결을 위한 `3 way handshake`가 정상적으로 완료되면 `HTTPS` 통신을 위한 `SSL Handshake (TLS Handshake)`를 수행한다.

`SSL Handshake`는 아래의 순서로 진행된다.

1. Client Hello
1. Server Hello
   1. Server key exchange
1. Client key exchange
1. Change Cipher spec / Finished

### Client Hello

클라이언트는 서버로 사용가능한 암호와 알고리즘 (`cipher suite`) 과 `SSL/TLS` 버전을 서버로 전송한다.

### Server Hello

서버는 전달 받은 `cipher suite` 중 사용할 알고리즘 (서버의 선호에 따라 결정됨)과 인증서를 전송한다. 이때 인증서에 `서버의 공개키`가 포함될 수 있다.

### Server key exchange

`Server Hello` 단계에서 클라이언트로 전달되는 인증서에 서버의 공개키가 포함되지 않을 경우 `Server key exchange` 과정을 거치며 서버가 클라이언트로 공개키를 전송한다. 인증서에 서버의 공개키가 포함되어 있는 경우 이 과정은 생략될 수 있다.

### Client key exchange

클라이언트의 대칭키를 `서버로 부터 제공 받은 공개키로 암호화`한 뒤 서버로 전송한다.

### Change Cipher spec / Finished

서버는 자신이 가지고 있는 비공개키 (비대칭키)를 통해 클라이언트로 부터 전달 받은 암호화된 클라이언트의 공개키를 복호화 한다. 이를 통해 클라이언트와 서버는 동일한 대칭키를 가질 수 있게되며 이 대칭키를 통해 데이터를 암호화/복호화 하여 전송/수신한다.
