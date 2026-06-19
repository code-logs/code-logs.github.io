## 하이브리드 앱에서 OAuth를 어디에서 처리해야 할까?

하이브리드 앱은 화면의 상당 부분을 `WebView`로 구현하지만 OAuth 관점에서는 네이티브 앱이다.

RFC 8252는 네이티브 코드와 WebView를 함께 사용하는 하이브리드 앱도 네이티브 앱으로 분류한다. 로그인 화면이 웹으로 작성되어 있다는 이유로 Google이나 Kakao의 인증 페이지를 WebView 안에서 열어서는 안 된다.

WebView에서 인증을 수행하면 구현 방식에 따라 공급자 토큰과 사용자 정보가 Javascript bridge, 웹 저장소, 디버깅 로그 같은 불필요한 영역에 노출될 가능성도 커진다. RFC 8252는 이런 embedded user-agent 대신 브라우저나 Custom Tabs 같은 외부 사용자 에이전트를 사용하도록 요구한다.

따라서 프로덕션 환경에서는 다음 원칙을 먼저 정해야 한다.

- WebView는 로그인을 요청할 수 있지만 OAuth를 직접 수행하지 않는다.
- Google과 Kakao 인증은 Android 네이티브 계층에서 처리한다.
- 공급자가 발급한 credential은 WebView에 전달하지 않는다.
- 백엔드가 공급자 credential을 검증하고 서비스 자체 세션을 발급한다.
- 앱의 로그인 상태는 공급자 토큰이 아니라 서비스 세션을 기준으로 판단한다.

## 권장 아키텍처

전체 인증 흐름은 다음과 같이 구성할 수 있다.

```text
WebView
  │ login(provider)
  ▼
Native Auth Coordinator
  ├─ Google Credential Manager
  ├─ Kakao Android SDK
  └─ Generic OAuth + Custom Tabs
  │ provider credential
  ▼
Backend Auth API
  ├─ 서명, issuer, audience, expiration 검증
  ├─ provider subject와 내부 사용자 매핑
  └─ 서비스 전용 세션 발급
  │ session
  ▼
Native secure storage
  │ authenticated 상태만 전달
  ▼
WebView
```

이 구조의 핵심은 WebView, 공급자 인증 정보, 서비스 세션의 책임을 분리하는 것이다.

WebView는 로그인 버튼과 로그인 결과 화면을 담당한다. 네이티브 계층은 공급자 SDK 실행과 서비스 세션 관리를 담당하고, 백엔드는 외부 credential 검증과 사용자 식별을 담당한다.

## WebView를 인증 경계 밖에 두기

Javascript bridge에는 가능한 한 작은 API만 노출해야 한다.

```kotlin
class AuthBridge(
    private val onLoginRequested: (Provider) -> Unit,
    private val onLogoutRequested: () -> Unit,
) {
    @JavascriptInterface
    fun login(provider: String) {
        Provider.from(provider)?.let(onLoginRequested)
    }

    @JavascriptInterface
    fun logout() {
        onLogoutRequested()
    }
}
```

Javascript에서 필요한 것은 로그인 요청과 완료 여부다.

```javascript
window.AndroidAuth.login('google')
```

다음 정보는 bridge를 통해 전달하지 않는다.

- Google 또는 Kakao access token
- ID token
- authorization code
- 서비스 refresh credential
- 사용자 개인정보가 포함된 전체 공급자 응답

`addJavascriptInterface`로 등록한 객체는 iframe을 포함한 WebView의 모든 frame에 노출된다. 또한 앱은 해당 객체를 호출한 frame의 origin을 직접 확인할 수 없다.

따라서 WebView에는 신뢰하는 HTTPS origin만 허용하고 navigation도 allowlist로 제한한다.

```kotlin
private val allowedHosts = setOf("app.example.com")

override fun shouldOverrideUrlLoading(
    view: WebView,
    request: WebResourceRequest,
): Boolean {
    val uri = request.url
    val allowed = uri.scheme == "https" && uri.host in allowedHosts

    if (!allowed) {
        openExternalBrowser(uri)
    }

    return !allowed
}
```

신뢰하지 않는 콘텐츠를 로드하기 전에는 Javascript interface를 제거해야 한다. 사용자 생성 HTML, 광고, 신뢰하지 않는 iframe을 표시해야 한다면 인증 bridge를 등록한 WebView와 별도의 WebView를 사용하는 편이 안전하다.

## 모던 Android 아키텍처로 책임 분리하기

공급자 SDK 호출을 `Activity`나 `ViewModel`에 모두 넣으면 공급자가 늘어날수록 분기와 상태 처리가 복잡해진다.

Android 권장 아키텍처에 맞춰 UI, domain, data layer를 분리하고 공급자 차이를 공통 인터페이스 뒤에 숨길 수 있다.

```kotlin
interface IdentityProvider {
    suspend fun authenticate(): ProviderCredential
}

sealed interface ProviderCredential {
    data class GoogleIdToken(val value: String) : ProviderCredential
    data class KakaoIdToken(val value: String) : ProviderCredential
}
```

`GoogleIdentityProvider`와 `KakaoIdentityProvider`는 SDK 결과를 애플리케이션이 이해하는 credential로 변환한다. `AuthRepository`는 이 credential을 백엔드 세션으로 교환한다.

```kotlin
class AuthRepository(
    private val providers: Map<Provider, IdentityProvider>,
    private val authApi: AuthApi,
    private val sessionStore: SessionStore,
) {
    suspend fun login(provider: Provider): Result<UserSession> = runCatching {
        val credential = providers.getValue(provider).authenticate()
        val session = authApi.exchange(credential)
        sessionStore.save(session)
        session
    }
}
```

UI에는 토큰 대신 상태만 노출한다.

```kotlin
sealed interface AuthUiState {
    data object Idle : AuthUiState
    data object LaunchingProvider : AuthUiState
    data object ExchangingSession : AuthUiState
    data class Authenticated(val user: User) : AuthUiState
    data object Cancelled : AuthUiState
    data class Failed(val reason: AuthFailure) : AuthUiState
}
```

`ViewModel`은 `StateFlow<AuthUiState>`를 제공하고 `Activity`나 `Context`를 장기간 보관하지 않는다. SDK 실행처럼 UI host가 필요한 동작은 Activity의 launcher 또는 coordinator가 시작하고 결과만 use case에 전달한다.

`IdentityProvider`, `AuthRepository`, `AuthCoordinator`라는 이름 자체가 Android의 표준은 아니다. 중요한 것은 UI가 공급자 SDK와 저장소 구현을 직접 소유하지 않도록 책임을 분리하는 것이다.

## Google 로그인은 Credential Manager로 처리하기

Android 신규 구현에서는 Credential Manager 기반 Sign in with Google을 사용하는 것이 기본 선택이다.

앱은 서버용 Web client ID와 요청별 nonce를 지정해 Google ID token을 요청할 수 있다.

```kotlin
val rawNonce = generateSecureNonce()

val googleIdOption = GetGoogleIdOption.Builder()
    .setFilterByAuthorizedAccounts(false)
    .setServerClientId(BuildConfig.GOOGLE_WEB_CLIENT_ID)
    .setNonce(rawNonce)
    .setAutoSelectEnabled(false)
    .build()

val request = GetCredentialRequest.Builder()
    .addCredentialOption(googleIdOption)
    .build()

val result = credentialManager.getCredential(
    context = activity,
    request = request,
)
```

반환된 credential에서 ID token을 얻은 뒤 백엔드에 전송한다.

```kotlin
val googleCredential = GoogleIdTokenCredential.createFrom(
    result.credential.data,
)

authApi.loginWithGoogle(
    GoogleLoginRequest(
        idToken = googleCredential.idToken,
        nonce = rawNonce,
    ),
)
```

nonce 생성과 검증 방식은 서버 계약에 맞춰야 한다. 위 예제에서는 요청마다 예측하기 어려운 값을 만들고 Credential Manager와 백엔드에 동일한 nonce를 전달한다. 백엔드는 ID token의 nonce claim이 해당 로그인 요청에 저장한 값과 일치하는지 검증한다.

클라이언트가 ID token을 디코딩해 이메일이나 사용자 ID만 백엔드로 보내는 방식은 안전하지 않다. 토큰 검증은 백엔드에서 수행해야 한다.

백엔드는 최소한 다음 항목을 검증한다.

| 항목 | 검증 내용 |
| --- | --- |
| signature | Google 공개키로 서명 검증 |
| `aud` | 서버용 Web client ID와 일치 |
| `iss` | Google issuer와 일치 |
| `exp` | 토큰이 만료되지 않음 |
| `nonce` | 로그인 요청에 저장한 nonce와 일치 |
| `hd` | 조직 계정 제한이 있을 때 허용 도메인인지 확인 |

검증이 끝난 토큰의 `sub`를 Google 사용자의 식별자로 사용한다.

```text
(provider = google, providerSubject = verifiedToken.sub)
```

이메일은 변경될 수 있으므로 내부 계정의 영구 식별자로 사용하지 않는다.

Google 로그인과 Google API 권한 요청도 구분해야 한다. 로그인은 사용자를 인증하기 위한 작업이고 Google Drive나 Calendar 접근은 별도의 authorization API와 scope를 요청하는 작업이다.

## Kakao 로그인은 Android SDK를 우선 사용하기

Kakao 로그인은 카카오톡 로그인을 먼저 시도하고 사용할 수 없는 경우 카카오계정 로그인으로 fallback할 수 있다.

```kotlin
fun loginWithKakao(context: Context, callback: (OAuthToken?, Throwable?) -> Unit) {
    if (UserApiClient.instance.isKakaoTalkLoginAvailable(context)) {
        UserApiClient.instance.loginWithKakaoTalk(context) { token, error ->
            when {
                error == null -> callback(token, null)
                error is ClientError && error.reason == ClientErrorCause.Cancelled -> {
                    callback(null, error)
                }
                else -> UserApiClient.instance.loginWithKakaoAccount(
                    context = context,
                    callback = callback,
                )
            }
        }
    } else {
        UserApiClient.instance.loginWithKakaoAccount(
            context = context,
            callback = callback,
        )
    }
}
```

사용자가 카카오톡 로그인 화면에서 취소한 경우에는 카카오계정 로그인을 자동으로 다시 열지 않는다. 취소와 기술적인 실패를 구분해야 사용자가 원하지 않는 로그인 화면을 반복해서 보지 않는다.

Kakao OpenID Connect를 활성화했다면 SDK가 반환한 OAuth token의 ID token을 백엔드로 보내 검증할 수 있다. 백엔드는 Kakao의 공개키로 서명을 확인하고 다음 claim을 검증한다.

- `iss`가 `https://kauth.kakao.com`인지 확인
- `aud`가 인가 요청의 `client_id` 또는 SDK 초기화에 사용한 앱 키와 일치하는지 확인
- `exp`가 지나지 않았는지 확인
- ID token에 nonce를 사용한 흐름이라면 요청에 저장한 값과 일치하는지 확인

Kakao REST OIDC 인증 요청은 nonce를 지원한다. Android SDK의 nonce 전달 방식은 사용하는 SDK 버전과 로그인 API를 확인해야 하므로, nonce 바인딩이 필수인 서비스라면 공식 API가 해당 흐름을 지원하는지 먼저 검증하거나 서버 중심 REST OIDC 흐름을 선택한다.

공개키는 변경될 수 있으므로 특정 키를 코드에 영구적으로 고정하지 않는다. JWKS를 적절히 캐시하고 알 수 없는 `kid`를 만났을 때 키 목록을 갱신한다.

Kakao SDK의 `hasToken()`은 로컬에 토큰이 존재하는지만 알려준다. 토큰이 유효한지 확인해야 한다면 `accessTokenInfo()`를 사용한다. 서비스 로그인 여부는 이 값과 별개로 백엔드가 발급한 서비스 세션을 기준으로 판단한다.

## 일반 OAuth 공급자는 Authorization Code와 PKCE 사용하기

전용 Android SDK가 없는 공급자는 AppAuth 또는 Custom Tabs 기반 Authorization Code Flow를 사용할 수 있다.

네이티브 앱은 배포된 APK에서 코드를 추출할 수 있으므로 정적으로 포함한 client secret을 안전한 비밀로 취급할 수 없는 public client다. client secret 대신 PKCE가 authorization code 탈취를 방어한다.

인증 요청마다 다음 값을 새로 만든다.

- 예측할 수 없는 `state`
- 고엔트로피 `code_verifier`
- `BASE64URL(SHA256(code_verifier))`로 만든 `code_challenge`
- OpenID Connect를 사용한다면 `nonce`

```text
response_type=code
code_challenge_method=S256
code_challenge={challenge}
state={state}
nonce={nonce}
```

callback을 받으면 먼저 `state`를 비교하고, 일치하지 않으면 authorization code를 사용하지 않는다. 이후 code와 원래 생성한 `code_verifier`를 토큰 endpoint에 전달한다.

Implicit Flow로 access token을 redirect URI에 직접 노출하거나 OAuth 인증 화면을 WebView 안에서 여는 방식은 사용하지 않는다.

공급자가 토큰 요청에 client secret을 요구한다면 네이티브 앱이 아닌 백엔드가 code 교환을 담당해야 한다. 예를 들어 Kakao REST API에서 client secret 기능을 활성화했다면 토큰 요청에 해당 secret이 필요하므로 앱에 secret을 넣지 않는다.

## Redirect URI는 App Link를 우선하기

OAuth callback을 앱으로 돌려보내기 위해 custom scheme을 사용할 수 있지만 다른 앱도 동일한 scheme을 등록해 callback을 가로챌 가능성이 있다.

공급자가 HTTPS redirect URI를 지원한다면 검증된 Android App Link를 우선한다.

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data
        android:scheme="https"
        android:host="auth.example.com"
        android:pathPrefix="/oauth/callback" />
</intent-filter>
```

도메인의 `/.well-known/assetlinks.json`에는 앱 package와 release 인증서 fingerprint를 등록한다.

공급자 SDK가 전용 custom scheme을 요구한다면 공식 SDK의 redirect 처리 방식을 사용하고 scheme, package name, key hash를 debug와 release 환경별로 정확히 등록한다.

## 백엔드에서 서비스 세션으로 교환하기

공급자 토큰을 서비스 API의 인증 수단으로 계속 사용하면 서비스 세션의 만료, 권한, 철회 정책이 Google이나 Kakao에 종속된다.

백엔드는 공급자 credential을 검증한 뒤 서비스 자체 세션을 발급할 수 있다.

```http
POST /v1/auth/google
Content-Type: application/json

{
  "idToken": "..."
}
```

백엔드의 처리 순서는 다음과 같다.

1. 공급자 ID token의 서명과 claim을 검증한다.
2. 검증된 `sub`로 내부 사용자를 조회한다.
3. `(provider, providerSubject)` 연결이 없다면 가입 또는 계정 연결 정책을 적용한다.
4. 서비스 access token과 refresh credential을 발급한다.
5. 공급자 토큰이 이후 API 호출에 필요하지 않다면 원문을 보관하지 않는다.

서비스가 Google이나 Kakao의 사용자 데이터 API를 지속적으로 호출해야 한다면 필요한 scope와 보관 목적을 명확히 정의한 뒤 공급자 token을 서버에서 별도로 보호해야 한다.

동일한 이메일을 가진 Google 계정과 Kakao 계정을 자동으로 같은 사용자라고 단정하지 않는다. 기본 식별자는 `(provider, sub)`로 유지하고 계정 연결이 필요하면 기존 서비스 세션의 재인증과 명시적인 사용자 확인 절차를 둔다.

## 토큰 저장 정책

WebView의 `localStorage`와 Javascript 메모리는 서비스 credential의 저장소로 사용하지 않는다.

서비스의 위협 모델과 세션 정책에 따라 다음과 같은 저장 전략을 적용할 수 있다.

| 데이터 | 권장 위치 |
| --- | --- |
| 서비스 access token | 가능한 경우 네이티브 메모리 |
| 서비스 refresh credential | Android Keystore key로 암호화한 네이티브 저장소 |
| 공급자 access token | SDK 또는 인증 처리 범위 안에서 관리 |
| 공급자 ID token | 백엔드 교환 후 더 필요하지 않다면 폐기 |

Android Keystore는 암호화 key material이 애플리케이션 프로세스에 직접 노출되지 않도록 보호할 수 있다. 다만 앱 프로세스가 침해되면 공격자가 기기 안에서 해당 키의 사용을 시도할 가능성까지 없어지는 것은 아니다.

고위험 서비스라면 사용자 인증이 필요한 키, 짧은 세션 만료, refresh token rotation, 기기 무결성 검증 같은 추가 정책을 위협 모델에 맞춰 검토한다.

로그와 분석 이벤트에도 token, authorization code, 전체 이메일, SDK 원본 응답을 기록하지 않는다.

## 로그아웃과 연결 해제 구분하기

로그아웃을 하나의 작업으로 처리하면 사용자가 기대하지 않은 공급자 연결 해제가 발생할 수 있다.

| 작업 | 의미 |
| --- | --- |
| 서비스 로그아웃 | 서비스 access token과 refresh credential 폐기 |
| Kakao 로그아웃 | Kakao access token과 refresh token 폐기 |
| Kakao계정과 함께 로그아웃 | Kakao 토큰과 Kakao Account 로그인 세션을 함께 종료하는 별도 흐름 |
| 연결 해제 | 앱과 공급자 사용자 사이의 연결 해제 |
| 회원 탈퇴 | 서비스 사용자 데이터 삭제와 연결 해제 정책 수행 |

Kakao의 일반 로그아웃 API는 토큰을 폐기하지만 브라우저의 Kakao Account 로그인 세션까지 자동으로 종료하지 않는다. 계정 세션까지 종료하려면 공식 문서의 `카카오계정과 함께 로그아웃` 흐름을 별도로 사용해야 한다.

일반적인 서비스 로그아웃에서는 백엔드 세션을 폐기하고 로컬 서비스 credential을 삭제한다. 공급자 연결 해제와 회원 탈퇴는 별도의 확인 화면과 API로 제공한다.

## 운영환경에서 확인해야 할 항목

운영 체크리스트는 서비스 구조에 따라 달라질 수 있지만 최소한 다음 시나리오는 배포 전에 검증하는 편이 좋다.

- debug와 release의 Google SHA 인증서를 각각 등록했는가?
- Kakao package name과 key hash가 release 서명과 일치하는가?
- OAuth client와 redirect URI가 개발, staging, production 환경에서 충돌하지 않는가?
- callback이 중복 전달되어도 세션이 중복 발급되지 않는가?
- 인증 도중 프로세스가 종료된 뒤 복귀할 때 로그인 트랜잭션을 안전하게 실패 또는 복원하는가?
- 카카오톡 미설치, 사용자 취소, 네트워크 timeout을 구분하는가?
- ID token의 `aud`, `iss`, `exp`, nonce와 서명을 실제 백엔드에서 검증하는가?
- JWKS key rotation에 대응하는가?
- token과 authorization code가 로그나 crash report에 남지 않는가?
- WebView에는 신뢰하는 HTTPS host만 로드되는가?
- 로그아웃, 연결 해제, 회원 탈퇴의 동작이 구분되어 있는가?

## 정리

Android 하이브리드 앱의 OAuth를 안전하게 구현하려면 WebView에서 공급자 로그인과 토큰 관리를 분리해야 한다.

Google은 Credential Manager, Kakao는 공식 Android SDK, 일반 OAuth 공급자는 외부 브라우저 기반 Authorization Code Flow와 PKCE를 사용한다. 공급자 credential은 백엔드에서 검증한 뒤 서비스 자체 세션으로 교환하고, WebView에는 토큰이 아닌 로그인 상태만 전달한다.

이 경계를 명확하게 만들면 공급자가 추가되어도 `IdentityProvider` 구현을 확장하는 방식으로 대응할 수 있고 WebView, 네이티브 SDK, 백엔드 세션의 보안 책임도 분명하게 유지할 수 있다.
