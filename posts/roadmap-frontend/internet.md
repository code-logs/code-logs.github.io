> 본 포스팅 시리즈는 [roadmap.sh](https://roadmap.sh/frontend)의 학습 순서에 따라 정리한 글 입니다.

## Internet

### 인터넷의 기본 Parts

1. `The last mile`
   - 가정 또는 기업에서 사용되는 클라이언트를 인터넷에 연결하는 부분
2. `Data centers`
   - Data center는 사용자의 데이터, 앱과 컨텐츠를 저장하는 서버로 가득찬 공간
3. `The backbone`
   - 백본은 데이터 센터와 이를 소비하는 주체들 간의 장거리 네트워크 구성을 의미

## Packet

### 패킷이란?

- 패킷은 인터넷을 통해 전송되는 기본 단위를 의미한다.
- 네트워크 가용성에 따라 효율적으로 사용하기 위해 작은 단위로 나누어진다.
- 패킷은 다음 세가지로 구성된다.
  - `Header`
  - `Payload`
  - `Trailer`
- 최대 64kb의 데이터를 보관 할 수 있다. (20 페이지 정도의 문자)

> **Packet Header**
>
> 패킷의 길이, 패킷의 목적지를 찾는데 필요한 정보, checksum 등을 담고 있다.
>
> **Packet Payload**
>
> 패킷에 의해 실제 전송되는 데이터로 네트워크에 따라 48byte에서 4kb 까지 다양한 사이즈를 가질 수 있다.
>
> **Packet Trailer**
>
> 네트워크 유형에 따라 내용이 달라질 수 있다. 일반적으로 수신자에게 패킷의 종료를 알리기 위한 몇 비트의 정보와 모든 패킷이 정상적으로 수신 됐즌지 컴퓨터로 하여금 판단 할 수 있도록 돕는 CRC (Cyclic Redundancy Check)를 포함하고 있다.

## 프로토콜 스택과 패킷

컴퓨터의 데이터는 또 다른 컴퓨터로 전송하기 위해 프로토콜 스택을 거쳐 전송 가능한 디지털 신호로 변형된다.

프로토콜 스택은 아래와 네가지로 구성되어 있다.

- `Application Protocols Layer`
- `Transmission Control Protocol Layer`
- `Internet Protocols Layer`
- `Hardware Layer`

전송하고자하는 메시지는 프로토콜 스택의 가장 상위에서 하향식으로 출발한다.

스택의 레이어를 거치며 데이터는 작은 단위로 쪼개질수 있다. 그리고 이렇게 쪼개진 작은 단위의 데이터가 바로 **패킷**이다.

`TCP Layer`를 거치며 패킷은 포트 번호를 부여 받는다.

`IP Layer`를 거치며 패킷은 목적지의 IP 주소를 부여 받는다.

포트 번호와 IP 주소를 부여 받은 패킷은 인터넷을 통해 목적지를 찾을 수 있는 상태가 된다. `Hardware Layer`를 거치며 패킷은 유/무선 네트워크를 통해 전송 될 수 있는 전기신호로 전환된다.

전기신호로 전환되어 전송된 데이터는 라우터를 거쳐 목적지를 찾아 앞서 통과한 Layer를 역순으로 따라 올라가며 원래 상태의 데이터 형태로 재조립된다.

### 패킷은 어떻게 목적지를 찾아갈까?

패킷은 인터넷에 연결되어 있는 각각의 라우터들이 가지고 있는 `routing table`에 포함되어 있는 정보를 통해 목적지를 찾아 간다.

각각의 라우터는 자신이 속해 있는 네트워크의 하위 네트워크의 구성과 어떤 IP를 사용하는지 알고 있다. (일반적으로 상위 네트워크의 IP 주소에 대해서는 알지 못한다.)

패킷이 라우터에 도착하면 오리진 컴퓨터의 IP Protocol Layer에 의해 결정된 IP 주소를 검사한다. 라우터가 동일한 IP 주소를 `routing table`에 있는지 확인하고 만약 존재한다면 패킷은 해당 네트워크로 전송된다. 존재하지 않는 경우 라우터는 해당 패킷을 기본 경로 (일반적으로는 백본 계층상 다음 라우터)로 전송한다. 만약 다음 라우터를 통해서도 목적지를 찾을수 없다면 NSP backbone (Network Service Provider) 에 도달할 때 까지 상위 네트워크로 라우팅 된다.

NSP backbone은 가장 큰 `routing table`을 자기고 있고 이를 바탕으로 정확한 목적지가 있는 backbone으로 패킷이 라우팅 된다. 그리고 그곳에서 부터 다시 점점 더 작은 네트워크로 (하향식) 목적지를 찾아 패킷이 전송된다.

## Protocol

### Application Protocol

애플리케이션 프로토콜은 응용프로그램과의 커뮤니케이션을 위해 사용되는 프로토콜을 의미한다 대표적인 `Application Protocol`은 `http`, `smtp` 등이 있다.

### Transmission Control Protocol (TCP)

애플리케이션이 인터넷을 통해 다른 컴퓨터에 메시지를 전송하게 되면 `TCP Layer`를 거치게 된다.

`TCP는 application protocol`이 목적하는 대상 컴퓨터의 application으로 전송하는 것을 담당한다.

이것을 당성하기 위해 `port` 번호가 사용된다.

TCP는 IP 정보에 대해 관여하지 않고 오직 port 번호를 통해 Application layer에서 목적하는 application으로 패킷을 전송하도록 돕는다.

TCP는 연결지향(`connection-oriented`, `reliable`, `byte stream service`)적인 서비스다 다시 말해 TCP는 데이터 교환에 앞서 반드시 커넥션을 체결해야 하는 것을 의미한다.

### Internet Protocol (IP)

TCP와 달리 IP는 연결이 없으며 안정적이지도 않은 (`unreliable`, `connection-less`) 프로토콜이다.

IP는 패킷이 목적지에 도달 여부에 관여하지 않을뿐 더러 연결 또는 포트 번호에 대해 아는 것이 없다. IP의 역할은 오로지 패킷을 다른 컴퓨터로 보내는 것 뿐이다.

IP 패킷은 독립적인 엔티티로 도착 순서를 보장하지 않는다. (IP로 패킷이 전송될때 순서에 맞게 전송하는 역할은 TCP의 역할이다.)

IP의 역할은 TCP를 통해 전달 받은 데이터에 IP 정보를 주입하는 것이다.
