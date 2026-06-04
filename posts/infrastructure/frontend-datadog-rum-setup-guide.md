## Frontend 알람은 오류 1건이 기준이 아니다

Frontend 운영환경에서 모니터링을 붙이면 가장 먼저 고민하게 되는 지점은 `언제 알람을 보낼 것인가`이다.

JavaScript error가 1건 발생할 때마다 Slack이나 PagerDuty로 알람을 보내면 금방 아무도 보지 않는 채널이 된다. 반대로 너무 느슨하게 잡으면 실제 사용자가 깨진 화면을 보고 있는데도 늦게 알게 된다.

그래서 Datadog RUM 알람은 단순히 `에러 발생 여부`가 아니라 다음 질문으로 설계하는 편이 좋다.

- 몇 분 동안 볼 것인가?
- 같은 오류가 몇 번 반복되면 볼 것인가?
- 몇 명의 사용자에게 영향을 주면 볼 것인가?
- 단순 count가 아니라 error rate로 봐야 하는가?
- warning과 alert의 기준을 다르게 둘 것인가?
- 같은 오류를 하나의 알람으로 묶을 것인가?

Google SRE 문서에서도 알람은 원인보다 사용자에게 보이는 증상에 가까워야 하고, on-call이 실제로 행동할 수 있어야 한다고 설명한다. Frontend RUM 알람도 마찬가지다. `console error가 1번 발생했다`보다 `production checkout 화면에서 5분 동안 동일 오류가 10회 발생했고 3명 이상의 사용자가 영향을 받았다`가 훨씬 대응하기 좋은 알람이다.

## RUM Monitor와 Error Tracking Monitor

Datadog에서 frontend 오류 알람을 만들 때는 주로 두 가지 monitor를 사용한다.

### RUM Monitor

RUM Monitor는 RUM event가 특정 기간 동안 정해둔 threshold를 넘었을 때 알람을 보낸다. Datadog 문서에서는 RUM monitor를 특정 RUM event type이 predefined threshold를 초과할 때 alerting하는 monitor로 설명한다.

Frontend에서 보통 다음과 같은 기준에 사용한다.

- JavaScript error count
- view load time
- resource error
- long task
- 특정 page나 action에서의 error rate
- RUM event가 더 이상 들어오지 않는 상태

`5분 동안 error event가 10회 이상 발생하면 알람` 같은 조건은 RUM Monitor가 잘 맞는다.

### Error Tracking Monitor

Error Tracking Monitor는 비슷한 오류를 issue로 묶고, 새로운 issue나 사용자 영향이 큰 issue를 기준으로 알람을 보낸다. Datadog 문서에 따르면 Error Tracking monitor는 new issue, regression, high impact issue에 대해 알람을 만들 수 있다.

Frontend에서 보통 다음과 같은 기준에 사용한다.

- production에서 새로운 browser issue가 발생했는가?
- 이전에 resolve된 issue가 다시 발생했는가?
- 특정 issue가 여러 사용자나 세션에 영향을 주는가?

`새로운 오류가 2명 이상의 사용자에게 영향을 주면 알람` 같은 조건은 Error Tracking Monitor가 더 자연스럽다.

## 먼저 알람 등급을 나누기

알람은 하나의 기준으로 끝내면 운영하기 어렵다. 같은 JavaScript error라도 결제 화면에서 발생하는 오류와 관리자 설정 화면에서 1명에게 발생하는 오류의 우선순위는 다르다.

먼저 등급을 나눈다.

| 등급 | 목적 | 예시 |
| --- | --- | --- |
| P1 | 즉시 확인해야 하는 사용자 영향 | 결제, 로그인, 핵심 저장 기능에서 오류율 급증 |
| P2 | 업무 시간 내 빠르게 확인 | 동일 오류가 여러 사용자에게 반복 발생 |
| P3 | 추적은 필요하지만 즉시 호출은 아님 | 낮은 빈도의 신규 오류, staging 오류 |

이렇게 나누면 threshold도 다르게 잡을 수 있다.

| 등급 | 권장 시작점 |
| --- | --- |
| P1 | 5분 동안 동일 오류 5회 이상 또는 영향 사용자 3명 이상 |
| P2 | 10분 동안 동일 오류 10회 이상 또는 영향 세션 5개 이상 |
| P3 | 1시간 동안 동일 오류 20회 이상, Slack 알림만 전송 |

위 숫자는 Datadog의 공식 기본값이 아니라 운영을 시작하기 위한 예시다. 실제 값은 서비스 트래픽, 기능 중요도, 배포 빈도, on-call 체계에 맞춰 조정해야 한다.

## 동일 오류 반복 알람

가장 실용적인 첫 번째 알람은 `같은 오류가 짧은 시간 안에 반복되는가`이다.

예를 들어 다음과 같은 기준으로 시작할 수 있다.

| 항목 | 설정 |
| --- | --- |
| Monitor type | Real User Monitoring |
| Event type | Error |
| Filter | `env:production`, `service:web` |
| Group by | Error Tracking issue id 또는 error message facet |
| Evaluation window | Last 5 minutes |
| Warning threshold | above 3 |
| Alert threshold | above 5 |
| Notification | Slack frontend channel |

핵심은 group by다. 전체 error count만 보면 서로 다른 오류가 섞인다. 가능한 경우 Error Tracking issue id 기준으로 묶고, 어렵다면 error message, error type, page path 같은 facet을 조합해 같은 오류를 하나의 그룹으로 만든다.

> Datadog UI에서 사용할 수 있는 facet 이름은 RUM 설정과 수집 데이터에 따라 다를 수 있다. Monitor를 만들기 전에 RUM Explorer에서 실제 error event를 열어 어떤 facet으로 묶을 수 있는지 먼저 확인하는 편이 좋다.

알람 메시지는 다음 정보를 포함해야 한다.

```text
[Frontend RUM] 동일 오류 반복 발생

env: production
service: web
window: last 5m
condition: same error count > 5

확인할 것:
1. 최근 배포 version 확인
2. RUM Explorer에서 issue/session 확인
3. source map으로 stack trace 확인
4. 동일 page/action에서 재현되는지 확인
```

이 알람은 `오류가 있었음`을 알려주는 것이 아니라 `반복되고 있으니 같은 원인으로 사용자들이 계속 실패하고 있음`을 알려주는 역할이다.

## 영향 사용자 기준 알람

오류 count만 기준으로 잡으면 한 명의 사용자가 같은 오류를 여러 번 반복해서 발생시킨 경우에도 큰 장애처럼 보일 수 있다. 그래서 production 알람은 count와 함께 impacted users나 impacted sessions 기준을 보는 것이 좋다.

Error Tracking Monitor에서는 metric으로 Error Occurrences, Impacted Users, Impacted Sessions를 선택할 수 있다. Browser issue에 대해서는 사용자 이메일 수나 session id 수를 기준으로 high impact 조건을 만들 수 있다.

예를 들어 다음과 같은 기준을 둘 수 있다.

| 항목 | 설정 |
| --- | --- |
| Monitor type | Error Tracking |
| Alerting condition | High Impact |
| Issue scope | Browser |
| Filter | `env:production`, `service:web` |
| Metric | Impacted Users |
| Threshold | above 3 |
| Notification | Slack + on-call |

사용자 수 기준 알람은 특히 SaaS나 커머스 서비스에서 중요하다. error count는 높지만 한 사용자의 반복 클릭일 수도 있고, error count는 낮아도 VIP 고객이나 결제 사용자 여러 명에게 영향을 줄 수도 있다.

처음에는 다음처럼 나눠볼 수 있다.

| 기준 | 알람 처리 |
| --- | --- |
| 동일 오류 5분 5회 이상, 영향 사용자 1명 | Slack warning |
| 동일 오류 5분 5회 이상, 영향 사용자 3명 이상 | Alert |
| 결제/로그인 화면에서 영향 사용자 1명 이상 | Alert 검토 |

중요한 기능에서는 사용자 수 threshold를 낮추고, 덜 중요한 화면에서는 threshold를 높이는 방식이 현실적이다.

## Error rate 기준 알람

트래픽이 많은 서비스에서는 error count만으로 알람을 만들면 노이즈가 많아진다. 평소에도 error가 어느 정도 발생하는 서비스라면 `오류 수`보다 `오류 비율`이 더 안정적인 기준이 된다.

Datadog은 RUM monitor에서 formula와 function을 사용해 비율이나 퍼센트 기반 알람을 만들 수 있다고 설명한다. 예를 들어 error event count를 view event count로 나누어 특정 화면의 error rate를 볼 수 있다.

실무에서는 다음과 같은 기준으로 시작할 수 있다.

| 항목 | 설정 |
| --- | --- |
| Monitor type | Real User Monitoring |
| Query A | Error events count |
| Query B | View events count |
| Formula | `A / B * 100` |
| Filter | `env:production`, `service:web`, 핵심 page |
| Evaluation window | Last 10 minutes |
| Warning threshold | above 1% |
| Alert threshold | above 3% |

단, 비율 알람은 분모가 너무 작을 때 쉽게 흔들린다. 예를 들어 1명이 방문해서 1번 실패하면 error rate는 100%가 된다. 그래서 error rate monitor는 최소 traffic 조건과 함께 보는 편이 좋다.

운영 기준으로는 다음처럼 나눌 수 있다.

| 조건 | 처리 |
| --- | --- |
| page view 50 미만 | 알람 대신 dashboard에서 관찰 |
| page view 50 이상 + error rate 1% 초과 | warning |
| page view 100 이상 + error rate 3% 초과 | alert |

Datadog monitor UI에서 여러 query와 formula를 구성할 수 있다면 count와 rate를 함께 보는 monitor를 만들고, 어렵다면 count monitor와 rate monitor를 분리하는 편이 관리하기 쉽다.

## 신규 오류 알람

새로운 JavaScript error는 count가 낮아도 확인할 가치가 있다. 특히 배포 직후에는 `처음 보는 오류`가 regression인지 단순 edge case인지 빨리 확인해야 한다.

Error Tracking Monitor의 New Issue 조건은 이런 상황에 맞다. Datadog 문서에 따르면 New Issue monitor는 monitor 생성 또는 마지막 수정 이후 created/regressed 된 issue를 대상으로 하며 24시간 lookback period를 가진다.

예시 기준은 다음과 같다.

| 항목 | 설정 |
| --- | --- |
| Monitor type | Error Tracking |
| Alerting condition | New Issue |
| Issue scope | Browser |
| Filter | `env:production`, `service:web` |
| Threshold | impacted users above 2 |
| Notification | Slack frontend channel |

신규 오류를 `any new issue`로 바로 호출하면 너무 시끄러울 수 있다. 처음에는 다음처럼 완충 조건을 둔다.

- production만 대상으로 한다.
- staging은 별도 채널로 보낸다.
- 신규 issue라도 impacted user가 2명 이상일 때 alert로 올린다.
- 1명만 영향받은 신규 issue는 warning 또는 daily triage로 보낸다.

Error Tracking 문서에서도 issue 상태를 properly triage하지 않으면 New Issue monitor가 OK와 ALERT 사이를 오가며 같은 issue에 대해 여러 번 알람을 만들 수 있다고 설명한다. 따라서 알람 설정만큼 issue 상태 관리도 중요하다.

## 핵심 flow 기준 알람

Frontend 알람은 전체 서비스 단위보다 사용자 flow 단위로 나누는 것이 좋다.

예를 들어 커머스라면 다음 flow의 기준을 다르게 둔다.

| Flow | 기준 |
| --- | --- |
| 로그인 | 5분 동안 동일 오류 3회 이상 |
| 상품 상세 | 10분 동안 동일 오류 10회 이상 |
| 장바구니 | 5분 동안 동일 오류 5회 이상 |
| 결제 | 5분 동안 동일 오류 1회 이상 + 영향 사용자 확인 |

결제처럼 비즈니스 영향이 큰 flow는 낮은 threshold로 빠르게 본다. 반대로 방문량이 많고 오류 허용 범위가 있는 일반 페이지는 count와 rate를 함께 보고 threshold를 높게 잡는다.

RUM event에는 view, action, resource, long task, error 같은 event type이 있다. 그래서 page path, action name, resource URL, error type을 조합하면 flow별 monitor를 만들 수 있다.

핵심 버튼에는 명시적인 action name을 붙여두는 것이 좋다.

```tsx
<button data-dd-action-name="checkout.submit">
  결제하기
</button>
```

이렇게 해두면 `checkout.submit 이후 발생한 오류`, `login.submit 이후 발생한 오류`처럼 사용자의 실제 행동에 가까운 알람을 만들 수 있다.

## RUM 수집 중단 알람

오류가 발생하지 않는 것이 항상 정상은 아니다. SDK 초기화가 깨졌거나 CSP, ad blocker, 배포 설정 문제로 RUM event 자체가 들어오지 않을 수도 있다.

Datadog RUM Monitor 문서에서는 RUM event가 더 이상 들어오지 않는 상황을 감지하려면 `below 1` 조건을 사용할 수 있다고 설명한다.

예시 기준은 다음과 같다.

| 항목 | 설정 |
| --- | --- |
| Monitor type | Real User Monitoring |
| Event type | View 또는 Session |
| Filter | `env:production`, `service:web` |
| Condition | below 1 |
| Evaluation window | Last 10 minutes |
| Notification | Slack frontend channel |

이 알람은 트래픽이 거의 없는 서비스에서는 오탐이 많을 수 있다. 사용자가 항상 있는 production 서비스, 핵심 landing page, B2B 업무 시간대처럼 event가 꾸준히 들어와야 하는 범위에만 적용하는 편이 좋다.

## Warning과 Alert를 분리하기

모든 알람을 같은 채널로 보내면 운영 피로도가 높아진다. Datadog monitor는 warning threshold와 alert threshold를 둘 수 있으므로 같은 monitor 안에서도 단계적으로 볼 수 있다.

예를 들어 동일 오류 monitor를 다음처럼 잡는다.

| 상태 | 조건 | 알림 |
| --- | --- | --- |
| Warning | 5분 동안 동일 오류 3회 이상 | Slack |
| Alert | 5분 동안 동일 오류 5회 이상 | Slack + on-call |
| Recovery | 오류 count가 threshold 아래로 회복 | Slack recovery |

recovery threshold를 별도로 설정하면 상태가 threshold 근처에서 흔들릴 때 알람이 반복되는 문제를 줄일 수 있다. Datadog 문서에서도 monitor는 alert threshold, warning threshold, alert recovery threshold, warning recovery threshold를 지원한다.

알림 메시지도 상태별로 다르게 작성한다.

```text
{{#is_warning}}
[WARN] Frontend 오류가 증가하고 있습니다.
우선 RUM Explorer에서 동일 issue인지 확인합니다.
{{/is_warning}}

{{#is_alert}}
[ALERT] Frontend 동일 오류가 threshold를 초과했습니다.
최근 배포 version과 영향 사용자 수를 확인하고, 필요하면 rollback을 검토합니다.
{{/is_alert}}

{{#is_recovery}}
[RECOVERY] Frontend 오류 알람이 회복되었습니다.
원인과 조치 내용을 issue에 남깁니다.
{{/is_recovery}}
```

Datadog notification variable을 사용하면 `is_alert`, `is_warning`, `is_recovery` 상태에 따라 메시지와 mention을 다르게 구성할 수 있다.

## 재알림 주기

처음 알람이 온 뒤에도 문제가 계속되면 다시 알려야 할 때가 있다. 하지만 너무 짧은 주기로 re-notify를 설정하면 같은 장애에 대해 반복 알람만 쌓인다.

Frontend 오류 알람은 보통 다음 정도로 시작할 수 있다.

| 등급 | 재알림 주기 |
| --- | --- |
| P1 | 15분 또는 30분 |
| P2 | 60분 |
| P3 | 재알림 없음 |

재알림은 `아직 처리되지 않은 문제가 계속되고 있다`를 알려주는 용도로만 사용한다. 알람 메시지에는 이미 생성된 incident나 issue 링크를 넣어 같은 문제에 대한 대화가 흩어지지 않도록 한다.

## 배포 시간과 Downtime

배포 중에는 일시적으로 오류가 늘거나 RUM event가 끊기는 경우가 있다. 이때 모든 monitor가 동시에 울리면 실제 장애와 배포 중 노이즈를 구분하기 어렵다.

Datadog Downtime은 maintenance나 upgrade 중 monitor alert와 notification을 silence하는 기능이다. 단, downtime은 monitor state transition 자체를 막는 것이 아니라 notification을 mute한다.

운영에서는 다음처럼 사용한다.

- 정기 점검 시간에는 관련 monitor를 downtime으로 묶는다.
- 배포 자동화에서 짧은 downtime을 설정할지 검토한다.
- 결제, 로그인 같은 핵심 flow는 downtime 대상에서 제외하거나 별도 기준을 둔다.
- downtime 종료 후에도 alert 상태가 계속되면 다시 notification이 갈 수 있음을 고려한다.

Downtime은 알람을 숨기는 도구이지 장애를 해결하는 도구가 아니다. 배포 중에만 반복되는 알람이라면 monitor threshold, evaluation window, 배포 방식 중 무엇을 고쳐야 하는지 따로 봐야 한다.

## 시작하기 좋은 Monitor 세트

처음부터 많은 monitor를 만들 필요는 없다. 다음 5개 정도로 시작하면 운영 감각을 잡기 쉽다.

### 1. Production 동일 오류 반복

| 항목 | 값 |
| --- | --- |
| Type | RUM Monitor |
| Target | Browser Error |
| Window | Last 5 minutes |
| Group | issue id 또는 error message |
| Warning | above 3 |
| Alert | above 5 |

같은 오류가 짧은 시간 안에 반복되는지 확인한다.

### 2. Production 신규 issue

| 항목 | 값 |
| --- | --- |
| Type | Error Tracking Monitor |
| Condition | New Issue |
| Scope | Browser |
| Threshold | impacted users above 2 |

배포 이후 새로 생긴 오류나 regression을 잡는다.

### 3. 핵심 flow error rate

| 항목 | 값 |
| --- | --- |
| Type | RUM Monitor |
| Target | Error count / View count |
| Window | Last 10 minutes |
| Warning | above 1% |
| Alert | above 3% |

결제, 로그인, 저장 같은 핵심 flow에만 먼저 적용한다.

### 4. High impact issue

| 항목 | 값 |
| --- | --- |
| Type | Error Tracking Monitor |
| Condition | High Impact |
| Metric | Impacted Users 또는 Impacted Sessions |
| Threshold | 서비스 규모에 맞게 조정 |

count보다 실제 사용자 영향을 기준으로 본다.

### 5. RUM event no data

| 항목 | 값 |
| --- | --- |
| Type | RUM Monitor |
| Target | View 또는 Session event |
| Window | Last 10 minutes |
| Condition | below 1 |

RUM SDK 초기화, CSP, 배포 설정 문제로 event 수집이 끊기는 상황을 확인한다.

## 알람 튜닝 기준

알람은 한 번 만들고 끝나는 설정이 아니다. 실제 운영 데이터가 쌓이면 다음 기준으로 계속 조정해야 한다.

- 알람이 왔을 때 실제로 조치했는가?
- 같은 원인으로 너무 자주 반복되지는 않는가?
- threshold가 낮아서 warning만 계속 쌓이지 않는가?
- 특정 사용자 한 명의 반복 오류가 전체 장애처럼 보이지 않는가?
- 신규 issue가 triage되지 않아 같은 issue가 다시 알람을 만들고 있지 않은가?
- 배포 직후에만 울리는 monitor라면 배포 이벤트와 함께 보는 것이 더 나은가?

조치하지 않는 알람은 삭제하거나 dashboard로 내려야 한다. 반대로 놓친 장애가 있다면 어떤 증상 기준이 없어서 놓쳤는지 확인하고 monitor를 추가한다.

## 마무리

Datadog RUM 알람의 핵심은 `오류가 발생했는가`가 아니라 `사용자에게 영향을 주는 오류가 반복되고 있는가`이다.

처음에는 다음 기준으로 시작하면 된다.

1. production만 대상으로 한다.
1. 동일 오류는 5분 5회 이상부터 alert로 본다.
1. 핵심 flow는 threshold를 더 낮춘다.
1. error count와 impacted users를 함께 본다.
1. 트래픽이 많은 화면은 error rate를 함께 본다.
1. warning은 Slack, alert는 on-call로 분리한다.
1. 알람이 조치로 이어지지 않으면 threshold나 대상 범위를 조정한다.

좋은 알람은 많은 정보를 보내는 알람이 아니라 바로 판단하고 행동할 수 있는 알람이다. Frontend RUM monitor도 이 기준으로 설계해야 운영환경에서 실제로 도움이 된다.
