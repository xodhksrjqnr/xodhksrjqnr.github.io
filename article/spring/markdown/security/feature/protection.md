# 악용 방지 [#](https://docs.spring.io/spring-security/reference/features/exploits/index.html)

스프링 시큐리티는 일반적인 공격으로부터 보호한다. 가능할 때마다 보호는 기본적으로 활성화된다. 이 섹션에서는
스프링 시큐리티가 보호하는 다양한 악용에 대해 설명한다.

# Cross Site Request Forgery (CSRF) [#](https://docs.spring.io/spring-security/reference/features/exploits/csrf.html)

스프링은 사이트 간 요청 위조(CSRF) 공격으로부터 보호하기 위한 포괄적인 지원을 제공한다. 다음 섹션에서는
다음을 살펴본다:

- CSRF 공격이란 무엇인가?
- CSRF 공격으로부터 보호
- CSRF 고려사항

> 설명서의 이 부분에서는 CSRF 보호의 일반적인 주제에 대해 설명한다. 서블릿 및 WebFlux 기반 응용
> 프로그램의 CSRF 보호에 대한 자세한 내용은 관련 섹션을 참조하자.

# CSRF 공격이란 무엇인가?

CSRF 공격을 이해하는 가장 좋은 방법은 구체적인 예를 살펴보는 것이다.

은행의 웹 사이트에서 현재 로그인한 사용자의 돈을 다른 은행 계좌로 이체할 수 있는 양식을 제공한다고
가정하자. 예를 들어 전송 양식은 다음과 같다:

```html
<form method="post" action="/transfer">
    <input type="text" name="amount"/>
    <input type="text" name="routingNumber"/>
    <input type="text" name="account"/>
    <input type="submit" value="Transfer"/>
</form>
```

해당 HTTP 요청은 다음과 같다:

```
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: JSESSIONID=randomid
Content-Type: application/x-www-form-urlencoded

amount=100.00&routingNumber=1234&account=9876
```

이제 은행 웹 사이트에 인증한 후 로그아웃하지 않고 악의적인 웹 사이트를 방문하는 것으로 가정하자. 악의적인
웹 사이트에는 다음과 같은 형식의 HTML 페이지가 포함되어 있다:

```html
<form method="post" action="https://bank.example.com/transfer">
    <input type="hidden" name="amount" value="100.00"/>
    <input type="hidden" name="routingNumber" value="evilsRoutingNumber"/>
    <input type="hidden" name="account" value="evilsAccountNumber"/>
    <input type="submit" value="Win Money!"/>
</form>
```

당신은 돈을 따는 것을 좋아해서 제출 버튼을 클릭한다. 이 과정에서 의도치 않게 악의적인 사용자에게
100달러를 송금했다. 이 문제는 악의적인 웹 사이트에서 쿠키를 볼 수 없는 경우에도 은행과 연결된 쿠키가
요청과 함께 계속 전송되기 때문이다.

더 나쁜 것은, 자바스크립트를 사용함으로써 이 모든 과정이 자동화될 수 있었다는 것이다. 이는 버튼을 클릭할
필요가 없었다는 것을 의미한다. 또한 XSS 공격의 피해자인 정직한 사이트를 방문할 때도 쉽게 발생할 수 있다.
그렇다면 이러한 공격으로부터 사용자를 보호하려면 어떻게 해야 할까?

# CSRF 공격으로부터 보호

CSRF 공격이 가능한 이유는 피해자 웹사이트의 HTTP 요청과 공격자 웹사이트의 요청이 정확히 일치하기
때문이다. 이는 악의적인 웹 사이트에서 오는 요청을 거부할 방법이 없으며 은행 웹 사이트에서 오는 요청만
허용한다는 것을 의미한다. CSRF 공격으로부터 보호하기 위해서는 요청에 악의적인 사이트가 제공할 수 없는
무언가가 있는지 확인하여 두 요청을 구별할 수 있어야 한다.

스프링은 CSRF 공격으로부터 보호하기 위한 두 가지 메커니즘을 제공한다:

- 싱크로나이저 토큰 패턴
- 세션 쿠키에서 동일한 사이트 속성 지정

> 두 가지 보호 방법 모두 안전한 방법을 사용해야 한다.

# 안전한 방법은 동일해야 한다

CSRF에 대한 보호가 작동하려면 응용 프로그램에서 ["안전한" HTTP 메서드가 동일](https://datatracker.ietf.org/doc/html/rfc7231#section-4.2.1)한지
확인해야 한다. 즉, HTTP `GET`, `HEAD`, `OPTIONS` 및 `TRACE` 메서드를 사용하는 요청은 응용
프로그램의 상태를 변경하지 않아야 한다.

# 싱크로나이저 토큰 패턴

CSRF 공격으로부터 보호하는 가장 일반적이고 포괄적인 방법은 [싱크로나이저 토큰 패턴](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)을
사용하는 것이다. 이 솔루션은 각 HTTP 요청에 세션 쿠키 외에도 HTTP 요청에 CSRF 토큰이라는 안전한 랜덤
생성 값이 필요하도록 하는 것이다.

HTTP 요청이 제출되면 서버는 예상 CSRF 토큰을 조회하여 HTTP 요청의 실제 CSRF 토큰과 비교해야 한다.
값이 일치하지 않으면 HTTP 요청을 거부해야 한다.

이 작업의 핵심은 실제 CSRF 토큰이 브라우저에 의해 자동으로 포함되지 않는 HTTP 요청의 일부에 있어야
한다는 것이다. 예를 들어 HTTP 매개 변수 또는 HTTP 헤더에 실제 CSRF 토큰이 필요하면 CSRF
공격으로부터 보호된다. 쿠키가 브라우저에 의해 HTTP 요청에 자동으로 포함되기 때문에 쿠키에 실제 CSRF
토큰이 필요하지 않다.

애플리케이션 상태를 업데이트하는 각 HTTP 요청에 대해 실제 CSRF 토큰만 요구하도록 기대를 완화할 수 있다.
그것이 작동하려면, 우리의 애플리케이션은 안전한 HTTP 메소드가 동일한지 확인해야 한다. 이렇게 하면 외부
사이트에서 웹 사이트로의 링크를 허용하기 때문에 사용성이 향상된다. 또한 임의 토큰을 HTTP GET에 포함하지
않는다. 이렇게 하면 토큰이 유출될 수 있기 때문이다.

싱크로나이저 토큰 패턴을 사용할 때 예제가 어떻게 변경되는지 고려해야 한다. 실제 CSRF 토큰이
`_csrf`라는 HTTP 매개 변수에 있어야 한다고 가정하자. 우리의 지원서의 이전 양식은 다음과 같다:

```html
<form method="post" action="/transfer">
    <input type="hidden" name="_csrf" value="4bfd1575-3ad1-4d21-96c7-4ef2d9f86721"/>
    <input type="text" name="amount"/>
    <input type="text" name="routingNumber"/>
    <input type="hidden" name="account"/>
    <input type="submit" value="Transfer"/>
</form>
```

이제 양식에 CSRF 토큰 값이 포함된 숨겨진 입력이 포함된다. 동일한 오리진 정책으로 악의적인 사이트가 응답을
읽을 수 없으므로 외부 사이트는 CSRF 토큰을 읽을 수 없다.

송금을 위한 해당 HTTP 요청은 다음과 같다:

```
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: JSESSIONID=randomid
Content-Type: application/x-www-form-urlencoded

amount=100.00&routingNumber=1234&account=9876&_csrf=4bfd1575-3ad1-4d21-96c7-4ef2d9f86721
```

이제 HTTP 요청에 보안 임의 값을 가진 `_csrf` 매개 변수가 포함되어 있다. 악의적인 웹 사이트는
`_csrf` 매개 변수(악의 웹 사이트에서 명시적으로 제공되어야 함)에 대한 올바른 값을 제공할 수 없으며
서버가 실제 CSRF 토큰을 예상 CSRF 토큰과 비교할 때 전송이 실패한다.

# 동일 사이트 속성

CSRF 공격으로부터 보호하는 새로운 방법은 쿠키에 `SameSite` 속성을 지정하는 것이다. 서버는 외부
사이트에서 쿠키를 전송하지 않도록 쿠키를 설정할 때 동일한 사이트 속성을 지정할 수 있다.

> 스프링 시큐리티는 세션 쿠키 작성을 직접 제어하지 않으므로 `SameSite` 속성에 대한 지원을 제공하지
> 않는다. 스프링 Session은 서블릿 기반 응용 프로그램에서 `SameSite` 특성을 지원한다. 스프링
> Framework의 `CookieWebSessionIdResolver`는 WebFlux 기반 응용 프로그램에서 `SameSite`
> 속성을 즉시 지원한다.

`SameSite` 특성이 있는 HTTP 응답 헤더의 예는 다음과 같다:

```
Set-Cookie: JSESSIONID=randomid; Domain=bank.example.com; Secure; HttpOnly; SameSite=Lax
```

`SameSite` 특성의 유효한 값은 다음과 같다:

- `Strict`: 지정하면 동일한 사이트에서 들어오는 모든 요청에 쿠키가 포함된다. 그렇지 않으면 쿠키가
HTTP 요청에 포함되지 않는다.

- `Lax`: 이 옵션을 지정하면 동일한 사이트에서 오거나 최상위 탐색에서 요청이 왔을 때 메서드가 동일할 때
쿠키가 전송된다. 그렇지 않으면 쿠키가 HTTP 요청에 포함되지 않는다.

`SameSite` 특성을 사용하여 예제를 보호하는 방법을 고려한다. 은행 응용 프로그램은 세션 쿠키에
`SameSite` 특성을 지정하여 CSRF로부터 보호할 수 있다.

세션 쿠키에 `SameSite` 속성이 설정된 상태에서 브라우저는 은행 웹 사이트에서 오는 요청과 함께
`JSESSIONID` 쿠키를 계속 보낸다. 그러나 브라우저는 더 이상 `JSESSIONID` 쿠키를 악의적인 웹
사이트에서 전송 요청과 함께 보내지 않는다. 악의적인 웹 사이트에서 전송되는 전송 요청에 세션이 더 이상
없으므로 응용 프로그램은 CSRF 공격으로부터 보호된다.

`SameSite` 특성을 사용하여 CSRF 공격으로부터 보호할 때 주의해야 할 몇 가지 중요한 고려 사항이 있다.

`SameSite` 속성을 `Strict`로 설정하면 더 강력한 방어 기능을 제공하지만 사용자에게 혼란을 줄 수
있다. `social.example.com` 에서 호스팅되는 소셜 미디어 사이트에 계속 로그인하고 있는 사용자를
생각해 보자. 사용자는 `email.example.org` 에서 소셜 미디어 사이트에 대한 링크가 포함된 이메일을
받는다. 사용자가 링크를 클릭하면 소셜 미디어 사이트에 인증되기를 기대할 수 있다. 그러나 `SameSite`
특성이 `Strict`인 경우 쿠키가 전송되지 않으므로 사용자가 인증되지 않는다.

> 우리는 [gh-7537](https://github.com/spring-projects/spring-security/issues/7537)를
> 구현함으로써 CSRF 공격에 대한 `SameSite` 보호의 보호와 유용성을 개선할 수 있었다.

또 다른 분명한 고려 사항은 `SameSite` 특성이 사용자를 보호하려면 브라우저가 `SameSite` 특성을
지원해야 한다는 것이다. 대부분의 최신 브라우저는 `SameSite` [특성을 지원](https://developer.mozilla.org/en-US/docs/Web/HTTP/headers/Set-Cookie#browser_compatibility)한다.
그러나 여전히 사용 중인 이전 브라우저는 그렇지 않을 수 있다.

이러한 이유로 일반적으로 CSRF 공격에 대한 단독 보호보다는 심층 방어로 동일 사이트 특성을 사용하는 것이
좋다.

# CSRF 보호를 사용해야 하는 경우

CSRF 보호를 사용해야 하는 경우는 언제일까? 일반 사용자가 브라우저에서 처리할 수 있는 모든 요청에 대해
CSRF 보호를 사용하는 것이 좋다. 브라우저가 아닌 클라이언트에서만 사용하는 서비스를 만드는 경우 CSRF
보호를 사용하지 않도록 설정할 수 있다.

# CSRF 보호 및 JSON

일반적인 질문은 "JSON 요청을 자바스크립트에서 보호해야 합니까?"이다. 간단한 대답은 다음과 같다: 사정에
따라 다르다. 그러나 JSON 요청에 영향을 줄 수 있는 CSRF 악용이 있으므로 매우 주의해야 한다. 예를 들어
악의적인 사용자는 다음 양식을 사용하여 JSON으로 CSRF를 생성할 수 있다:

```html
<form action="https://bank.example.com/transfer" method="post" enctype="text/plain">
	<input name='{"amount":100,"routingNumber":"evilsRoutingNumber","account":"evilsAccountNumber", "ignore_me":"' value='test"}' type='hidden'>
	<input type="submit" value="Win Money!"/>
</form>
```

이를 통해 다음과 같은 JSON 구조가 생성된다:

```json
{
  "amount": 100,
  "routingNumber": "evilsRoutingNumber",
  "account": "evilsAccountNumber",
  "ignore_me": "=test"
}
```

응용 프로그램이 `Content-Type` 헤더의 유효성을 검사하지 않는 경우 이 취약성에 노출된다. 설정에 따라
`.json`으로 끝나는 URL 접미사를 다음과 같이 업데이트하여 `Content-Type`의 유효성을 확인하는 스프링
MVC 애플리케이션을 계속 이용할 수 있다:

```html
<form action="https://bank.example.com/transfer.json" method="post" enctype="text/plain">
	<input name='{"amount":100,"routingNumber":"evilsRoutingNumber","account":"evilsAccountNumber", "ignore_me":"' value='test"}' type='hidden'>
	<input type="submit" value="Win Money!"/>
</form>
```

# CSRF 및 상태 비저장 브라우저 응용 프로그램

응용 프로그램이 상태 비저장이면 어떻게 해야 할까? 그렇다고 해서 반드시 보호받는 것은 아니다. 실제로
사용자가 지정된 요청에 대해 웹 브라우저에서 작업을 수행할 필요가 없는 경우에도 CSRF 공격에 여전히 취약할
수 있다.

예를 들어, `JSESSIONID` 대신 인증확인을 위해 내부의 모든 상태를 포함하는 사용자 정의 쿠키를 사용하는
응용 프로그램을 생각해 보자. CSRF 공격이 발생하면 이전 예제에서 `JSESSIONID` 쿠키가 전송된 것과
동일한 방식으로 사용자 지정 쿠키가 요청과 함께 전송된다. 이 응용 프로그램은 CSRF 공격에 취약하다.

# CSRF 고려사항

CSRF 공격에 대한 보호를 구현할 때 고려해야 할 몇 가지 특별한 고려 사항이 있다.

### 로그인

로그인 요청 위조를 방지하려면 로그인 HTTP 요청을 CSRF 공격으로부터 보호해야 한다. 악의적인 사용자가
피해자의 중요한 정보를 읽을 수 없도록 로그인 요청 위조로부터 보호해야 한다. 공격은 다음과 같이 수행된다:

1) 악의적인 사용자는 악의적인 사용자의 자격 증명으로 CSRF 로그인을 수행한다. 이제 공격 대상자가 악의적인
사용자로 인증되었다.
2) 그런 다음 악의적인 사용자는 공격 대상자를 속여 손상된 웹 사이트를 방문하고 중요한 정보를 입력하도록
한다.
3) 이 정보는 악의적인 사용자의 계정과 연결되므로 악의적인 사용자는 자신의 자격 증명으로 로그인하고 공격
대상자의 중요한 정보를 볼 수 있다.

로그인 HTTP 요청이 CSRF 공격으로부터 보호되도록 하는 데 문제가 될 수 있는 것은 사용자가 세션 시간
초과로 인해 요청이 거부될 수 있다는 점이다. 세션 시간 초과는 로그인하기 위해 세션이 필요하지 않을 것으로
예상되는 사용자에게 놀라운 일이다. 자세한 내용은 CSRF 및 세션 시간 초과를 참조하자.

기본 인증을 사용하는 응용 프로그램도 CSRF 공격에 취약하다. 이전 예제에서 JSESSIONID 쿠키를 보낸 것과
동일한 방식으로 브라우저가 모든 요청에 사용자 이름과 암호를 자동으로 포함하므로 응용 프로그램이 취약하다.

### 로그아웃

로그아웃 요청 위조를 방지하려면 로그아웃 HTTP 요청을 CSRF 공격으로부터 보호해야 한다. 악의적인 사용자가
피해자의 중요한 정보를 읽을 수 없도록 로그아웃 요청 위조로부터 보호해야 한다. 공격에 대한 자세한 내용은 이
[블로그 게시물](https://labs.detectify.com/2017/03/15/loginlogout-csrf-time-to-reconsider/)을
참조하자.

로그아웃 HTTP 요청이 CSRF 공격으로부터 보호되도록 하는 데 문제가 될 수 있는 것은 사용자가 세션 시간
초과로 인해 요청이 거부될 수 있다는 것이다. 세션 시간 초과는 로그아웃할 세션이 없을 것으로 예상되는
사용자에게 놀라운 일이다. 자세한 내용은 CSRF 및 세션 시간 초과를 참조하자.

# CSRF 및 세션 시간 초과

예상 CSRF 토큰이 세션에 저장되는 경우가 많다. 즉, 세션이 만료되는 즉시 서버는 예상된 CSRF 토큰을 찾지
못하고 HTTP 요청을 거부한다. 시간 초과를 해결하기 위한 여러 가지 옵션(각각의 옵션은 트레이드오프와 함께
제공됨)이 있다:

- 시간 초과를 줄이는 가장 좋은 방법은 양식 제출 시 자바스크립트를 사용하여 CSRF 토큰을 요청하는 것이다.
그런 다음 양식이 CSRF 토큰으로 업데이트되고 제출된다.
- 또 다른 옵션은 세션이 곧 만료된다는 것을 사용자에게 알리는 자바스크립트를 사용하는 것이다. 사용자는
버튼을 클릭하여 세션을 계속하고 새로 고칠 수 있다.
- 마지막으로 예상되는 CSRF 토큰을 쿠키에 저장할 수 있다. 이렇게 하면 예상 CSRF 토큰이 세션보다 오래
사용될 수 있다.
- 예상 CSRF 토큰이 기본적으로 쿠키에 저장되지 않는 이유를 물을 수 있다. 이는 다른 도메인에서 헤더(예:
쿠키 지정)를 설정할 수 있는 알려진 공격이 있기 때문이다. 이것은 Ruby on Rails가
`X-Requested-With` 헤더가 있을 때 CSRF 검사를 건너뛰지 않는 것과 같은 이유이다. 공격을 수행하는
방법에 대한 자세한 내용은 이 [webappsec.org 스레드](https://web.archive.org/web/20210221120355/https://lists.webappsec.org/pipermail/websecurity_lists.webappsec.org/2011-February/007533.html)를
참조하자. 또 다른 단점은 상태(즉, 시간 초과)를 제거함으로써 토큰이 손상된 경우 토큰을 강제로 무효화하는
기능을 잃게 된다는 것이다.

# 멀티파트(파일 업로드)

CSRF 공격으로부터 다중 파트 요청(파일 업로드)을 보호하면 [치킨 또는 에그 문제](https://en.wikipedia.org/wiki/Chicken_or_the_egg)가
발생한다. CSRF 공격이 발생하지 않도록 하려면 HTTP 요청 본문을 읽어 실제 CSRF 토큰을 얻어야 한다.
그러나 본문을 읽는다는 것은 파일이 업로드되었음을 의미하며, 이는 외부 사이트에서 파일을 업로드할 수 있음을
의미한다.

`multipart/form-data`와 함께 CSRF 보호를 사용하는 두 가지 옵션이 있다:

- 본문에 CSRF 토큰 배치
- URL에 CSRF 토큰 배치

각 옵션에는 트레이드오프가 있다.

> 스프링 시큐리티의 CSRF 보호를 멀티파트 파일 업로드와 통합하기 전에 먼저 CSRF 보호 없이 업로드할 수
> 있는지 확인해야 한다. 스프링과 함께 multipart forms 사용에 대한 자세한 내용은 스프링 참조의
> [1.1.11. Multipart Resolver](https://docs.spring.io/spring-framework/docs/5.2.x/spring-framework-reference/web.html#mvc-multipart)와
> [MultipartFilter Javadoc](https://docs.spring.io/spring-framework/docs/5.2.x/javadoc-api/org/springframework/web/multipart/support/MultipartFilter.html)
> 섹션을 참조하자.

### 본문에 CSRF 토큰 배치

첫 번째 옵션은 요청 본문에 실제 CSRF 토큰을 포함하는 것이다. CSRF 토큰을 본문에 배치하면 승인이
수행되기 전에 본문을 읽었다. 즉, 모든 사용자가 서버에 임시 파일을 저장할 수 있다. 그러나 인증된 사용자만
응용 프로그램에서 처리한 파일을 제출할 수 있다. 일반적으로 이 방법은 권장되는 방법이다. 임시 파일 업로드는
대부분의 서버에 거의 영향을 미치지 않기 때문이다.

### URL에 CSRF 토큰 포함

권한 없는 사용자가 임시 파일을 업로드하도록 허용할 수 없는 경우 양식의 작업 속성에 예상 CSRF 토큰을 쿼리
매개 변수로 포함하는 방법이 있다. 이 방법의 단점은 쿼리 매개 변수가 유출될 수 있다는 것이다. 일반적으로
중요한 데이터가 유출되지 않도록 본문 또는 헤더 내에 배치하는 것이 가장 좋은 방법으로 간주된다. URI의
[RFC 2616 섹션 15.1.3](https://www.w3.org/Protocols/rfc2616/rfc2616-sec15.html#sec15.1.3)
중요한 정보 인코딩에서 추가 정보를 찾을 수 있다.

### 숨겨진 Http 메서드 필터

일부 응용 프로그램은 폼 매개 변수를 사용하여 HTTP 메서드를 재정의할 수 있다. 예를 들어, 다음 양식은
HTTP 메소드를 `post`가 아닌 `delete`로 처리할 수 있다.

```html
<form action="/process" method="post">
	<!-- ... -->
	<input type="hidden" name="_method" value="delete"/>
</form>
```

HTTP 메서드를 재정의하는 작업은 필터에서 수행된다. 해당 필터는 스프링 시큐리티의 지원보다 먼저 배치해야
한다. 재정의는 `post`에서만 발생하므로 실제 문제가 발생할 가능성은 거의 없다. 그러나 스프링 시큐리티의
필터 앞에 배치하는 것이 가장 좋다.

# 보안 HTTP 응답 헤더 [#](https://docs.spring.io/spring-security/reference/features/exploits/headers.html)

> 문서의 이 부분에서는 보안 HTTP 응답 헤더의 일반적인 항목에 대해 설명한다. 서블릿 및 WebFlux 기반
> 응용 프로그램의 보안 HTTP 응답 헤더에 대한 자세한 내용은 관련 섹션을 참조하자.

HTTP 응답 헤더를 여러 가지 방법으로 사용하여 웹 응용 프로그램의 보안을 강화할 수 있다. 이 섹션에서는
스프링 시큐리티가 명시적으로 지원하는 다양한 HTTP 응답 헤더에 대해 설명한다. 필요한 경우 사용자 정의
헤더를 제공하도록 스프링 시큐리티를 구성할 수도 있다.

# 기본 보안 헤더

> 서블릿 기반 및 웹 플럭스 기반 응용 프로그램의 기본값을 사용자 정의하는 방법은 관련 섹션을 참조하자.

스프링 시큐리티는 보안 기본값을 제공하기 위해 보안 관련 HTTP 응답 헤더의 기본 설정을 제공한다.

스프링 시큐리티의 기본값은 다음 헤더를 포함하는 것이다:

```
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
X-Frame-Options: DENY
X-XSS-Protection: 0
```

> Strict-Transport-Security는 HTTPS 요청에만 추가된다.

기본값이 사용자의 필요를 충족하지 못하는 경우 이러한 기본값에서 헤더를 쉽게 제거, 수정 또는 추가할 수 있다.
각 헤더에 대한 자세한 내용은 해당 섹션을 참조하자.:

- Cache Control
- Content Type Options
- HTTP Strict Transport Security
- X-Frame-Options
- X-XSS-Protection

# Cache Control

> 서블릿 및 웹 플럭스 기반 응용 프로그램의 기본값을 사용자 지정하는 방법은 관련 섹션을 참조하자.

스프링 시큐리티의 기본값은 캐시를 사용하지 않도록 설정하여 사용자의 콘텐츠를 보호하는 것이다.

사용자가 중요한 정보를 보기 위해 인증한 다음 로그아웃하는 경우 악의적인 사용자가 중요한 정보를 보기 위해
뒤로가기 버튼을 클릭하지 못하도록 한다. 기본적으로 전송되는 캐시 제어 헤더는 다음과 같다:

```
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
```

기본적으로 보안을 유지하기 위해 스프링 시큐리티는 이러한 헤더를 기본적으로 추가한다. 그러나 응용 프로그램이
자체 캐시 제어 헤더를 제공하는 경우 스프링 시큐리티는 방해가 되지 않는다. 이렇게 하면 응용 프로그램에서
정적 리소스(예: CSS 및 JavaScript)를 캐시할 수 있다.

# Content Type Options

> 서블릿 및 웹 플럭스 기반 응용 프로그램의 기본값을 사용자 지정하는 방법은 관련 섹션을 참조하자.

과거에는 인터넷 익스플로러를 포함한 브라우저가 콘텐츠 스니핑을 사용하여 요청의 콘텐츠 유형을 추측하려고 했다.
이를 통해 브라우저는 콘텐츠 유형을 지정하지 않은 리소스의 콘텐츠 유형을 추측하여 사용자 환경을 개선할 수
있다. 예를 들어 브라우저에서 콘텐츠 유형이 지정되지 않은 자바스크립트 파일이 발견된 경우 콘텐츠 유형을
추측하여 실행할 수 있다.

> 내용 업로드를 허용할 때 수행해야 하는 추가 작업은 여러 가지가 있다(예: 문서를 별도의 도메인에
> 표시하거나, 내용 유형 헤더가 설정되었는지 확인하거나, 문서를 검사하거나, 기타 작업). 그러나 이러한
> 조치는 스프링 시큐리티에서 제공하는 범위를 벗어난다. 또한 내용 스니핑을 사용하지 않도록 설정할 때 내용이
> 제대로 작동하려면 내용 유형을 지정해야 한다.

콘텐츠 스니핑의 문제는 이를 통해 악의적인 사용자가 다중 글로트(즉, 여러 콘텐츠 유형으로 유효한 파일)를
사용하여 XSS 공격을 수행할 수 있다는 것이다. 예를 들어, 일부 사이트에서는 사용자가 유효한 포스트스크립트
문서를 웹 사이트에 제출하고 볼 수 있다. 악의적인 사용자는 유효한 자바스크립트 파일이기도 한 포스트스크립트
문서를 만들고 이를 사용하여 XSS 공격을 수행할 수 있다.

기본적으로 스프링 시큐리티는 HTTP 응답에 다음 헤더를 추가하여 내용 스니핑을 비활성화한다:

```
X-Content-Type-Options: nosniff
```

# HTTP Strict Transport Security (HSTS)

> 서블릿 및 웹 플럭스 기반 응용프로그램의 기본값을 사용자 지정하는 방법은 관련 섹션을 참조하자.

당신이 당신의 은행 웹사이트에 입력할 때, 당신은 `http://mybank.example.com`을 입력합니까 아니면
`https://mybank.example.com`을 입력합니까? `https` 프로토콜을 생략하면 중간 사용자 공격에
취약해질 수 있다. 웹 사이트가 `https://mybank.example.com` 으로 리디렉션을 수행하는 경우에도
악의적인 사용자가 초기 HTTP 요청을 가로채 응답을 조작할 수 있다(예: `https://mibank.example.com`
로 리디렉션하고 자격 증명을 도용).

많은 사용자가 `https` 프로토콜을 생략하기 때문에 HTTP HSTS(Strict Transport Security)가
만들어졌다. `http://mybank.example.com`가 HSTS 호스트로 추가되면 브라우저는 `mybank.example.com`에
대한 모든 요청이 `https://mybank.example.com`로 해석되어야 한다는 것을 미리 알 수 있다. 이렇게
하면 중간자 공격이 발생할 가능성이 크게 줄어든다.

> [RFC6797](https://datatracker.ietf.org/doc/html/rfc6797#section-7.2)에 따라
> HSTS 헤더는 HTTPS 응답에만 주입된다. 브라우저가 헤더를 승인하려면 먼저 연결에 사용된 SSL 인증서에
> 서명한 CA를 신뢰해야 한다(SSL 인증서뿐만 아니라).

사이트를 HSTS 호스트로 표시하는 한 가지 방법은 호스트를 브라우저에 미리 로드하는 것이다. 다른 방법은
응답에 `Strict-Transport-Security` 헤더를 추가하는 것이다. 예를 들어 스프링 시큐리티의 기본
동작은 다음 헤더를 추가하는 것이다. 이 헤더는 브라우저가 도메인을 1년 동안 HSTS 호스트로 처리하도록
지시한다(leap year가 아닌 경우 31536000초):

```
Strict-Transport-Security: max-age=31536000 ; includeSubDomains ; preload
```

선택적 `includeSubDomains` 지시사항은 브라우저에 하위 도메인(예: `secure.mybank.example.com` )도
HSTS 도메인으로 처리하도록 지시한다.

선택적 `preload` 지시문은 도메인을 브라우저에 HSTS 도메인으로 미리 로드하도록 브라우저에 지시한다.
HSTS 사전 로드에 대한 자세한 내용은 [hstspreload.org](https://hstspreload.org/)를
참조하자.

# HTTP Public Key Pinning (HPKP)

> 수동적인 상태를 유지하기 위해 스프링 시큐리티는 서블릿 환경에서 HPKP를 계속 지원한다. 그러나 앞에
> 나열된 이유로 인해 HPKP는 스프링 시큐리티 팀에 의해 더 이상 권장되지 않는다.

HTTP 공용 키 피닝(HPKP)은 위조된 인증서로 MITM(Man-in-the-Middle) 공격을 방지하기 위해 특정
웹 서버와 함께 사용할 공용 키를 웹 클라이언트에 지정한다. 올바르게 사용할 경우 HPKP는 손상된 인증서에
대한 보호 계층을 추가할 수 있다. 그러나 HPKP의 복잡성 때문에 많은 전문가들이 더 이상 사용을 권장하지
않으며 크롬은 이에 대한 지원마저 제거했다.

HPKP가 더 이상 권장되지 않는 이유에 대한 자세한 내용은 "[HTTP 공용 키 피닝이 중단되었습니까?](https://blog.qualys.com/product-tech/2016/09/06/is-http-public-key-pinning-dead)"와
"[HPKP 포기합니다](https://scotthelme.co.uk/im-giving-up-on-hpkp/)"를 참조하자.

# X-Frame-Options

> 서블릿 및 웹 플럭스 기반 응용프로그램의 기본값을 사용자 정의하는 방법은 관련 섹션을 참조하자.

웹 사이트를 프레임에 추가하도록 허용하는 것은 보안 문제가 될 수 있다. 예를 들어, 영리한 CSS 스타일링을
사용함으로써 사용자는 의도하지 않은 것을 클릭하도록 속을 수 있다. 예를 들어 자신의 은행에 로그인한 사용자가
다른 사용자에게 액세스 권한을 부여하는 버튼을 클릭할 수 있다. 이런 종류의 공격을 [클릭재킹](https://en.wikipedia.org/wiki/Clickjacking)이라고
한다.

> 클릭재킹을 처리하는 또 다른 현대적인 방법은 CSP(Content Security Policy)를 사용하는 것이다.

클릭재킹 공격을 완화하는 여러 가지 방법이 있다. 예를 들어 기존 브라우저를 클릭 재킹 공격으로부터 보호하려면
프레임 차단 코드를 사용할 수 있다. 완벽하지는 않지만 프레임 깨짐 코드는 기존 브라우저에 대해 할 수 있는
최선의 방법이다.

클릭재킹을 해결하는 보다 현대적인 방법은 X-Frame-Options 헤더를 사용하는 것이다. 기본적으로 스프링
시큐리티는 다음 헤더를 사용하여 iframe 내에서 페이지 렌더링을 비활성화한다:

```
X-Frame-Options: DENY
```

# X-XSS-Protection

> 서블릿 및 웹 플럭스 기반 응용프로그램의 기본값을 사용자 정의하는 방법은 관련 섹션을 참조하자.

일부 브라우저에는 반사된 XSS 공격을 필터링하는 기능이 내장되어 있다. 이 필터는 주요 브라우저에서 더 이상
사용되지 않으며 현재 [OWASP 권장 사항](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-xss-protection)은
헤더를 명시적으로 0으로 설정하는 것이다.

기본적으로 스프링 시큐리티는 다음 헤더를 사용하여 내용을 차단한다:

```
X-XSS-Protection: 0
```

# Content Security Policy (CSP)

> 서블릿 및 웹 플럭스 기반 응용프로그램을 모두 구성하는 방법은 관련 섹션을 참조하자.

[CSP(콘텐츠 보안 정책)](https://www.w3.org/TR/CSP2/)는 웹 응용 프로그램이 XSS(사이트 간
스크립팅)와 같은 콘텐츠 주입 취약성을 완화하기 위해 사용할 수 있는 메커니즘이다. CSP는 웹 응용 프로그램
작성자가 웹 응용 프로그램이 리소스를 로드할 것으로 예상되는 소스를 선언하고 최종적으로 클라이언트(사용자
에이전트)에게 알릴 수 있는 기능을 제공하는 선언 정책이다.

내용 보안 정책이 일부 내용 주입 취약성을 해결하기 위한 것은 아니다. 대신 CSP를 사용하여 콘텐츠 주입
공격으로 인한 피해를 줄일 수 있다. 첫 번째 방어선으로 웹 응용 프로그램 작성자는 입력 내용을 검증하고
출력을 인코딩해야 한다.

웹 응용 프로그램은 응답에 다음 HTTP 헤더 중 하나를 포함하여 CSP를 사용할 수 있다:

- `Content-Security-Policy`
- `Content-Security-Policy-Report-Only`

이러한 각 헤더는 클라이언트에 보안 정책을 전달하는 메커니즘으로 사용된다. 보안 정책에는 특정 리소스 표현에
대한 제한을 선언하는 일련의 보안 정책 지시자가 포함된다.

예를 들어, 웹 응용 프로그램은 응답에 다음 헤더를 포함하여 신뢰할 수 있는 특정 소스의 스크립트를 로드할
것으로 예상한다고 선언할 수 있다:

```
Content-Security-Policy: script-src https://trustedscripts.example.com
```

`script-src` 지침에 선언된 것이 아닌 다른 소스에서 스크립트를 로드하려는 시도는 사용자 에이전트에 의해
차단된다. 또한 보안 정책에서 `report-uri` 지시어가 선언된 경우 사용자 에이전트가 위반 내용을 선언된
URL로 보고한다.

예를 들어 웹 응용 프로그램이 선언된 보안 정책을 위반하는 경우 다음 응답 헤더는 사용자 에이전트에게 정책의
`report-uri` 지시사항에 지정된 URL로 위반 보고서를 보내도록 지시한다.

```
Content-Security-Policy: script-src https://trustedscripts.example.com; report-uri /csp-report-endpoint/
```

위반 보고서는 웹 애플리케이션의 자체 API 또는 `report-uri.io/`와 같은 공개 호스팅된 CSP 위반 보고
서비스를 통해 캡처할 수 있는 표준 JSON 구조이다.

`Content-Security-Policy-Report-Only` 헤더는 웹 응용 프로그램 작성자 및 관리자가 보안 정책을
시행하는 대신 모니터링할 수 있는 기능을 제공한다. 이 헤더는 일반적으로 사이트에 대한 보안 정책을 실험하거나
개발할 때 사용된다. 정책이 효과적이라고 판단되면 대신 `Content-Security-Policy` 헤더 필드를
사용하여 정책을 시행할 수 있다.

다음 응답 헤더를 지정하면 정책은 가능한 두 가지 소스 중 하나에서 스크립트를 로드할 수 있다고 선언한다.

```
Content-Security-Policy-Report-Only: script-src 'self' https://trustedscripts.example.com; report-uri /csp-report-endpoint/
```

사이트가 `evil.example.com`에서 스크립트를 로드하려고 시도하여 이 정책을 위반하는 경우 사용자
에이전트는 `report-uri` 지시에 의해 지정된 선언된 URL로 위반 보고서를 보내지만 위반 리소스가
로드되도록 허용한다.

웹 응용 프로그램에 내용 보안 정책을 적용하는 것은 종종 간단한 작업이 아니다. 다음 리소스는 사이트에 대한
효과적인 보안 정책을 개발하는 데 도움이 될 수 있다:

- [An Introduction to Content Security Policy](https://web.dev/csp/)
- [CSP Guide - Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [W3C Candidate Recommendation](https://www.w3.org/TR/CSP2/)

# Referrer Policy

> 서블릿 및 웹 플럭스 기반 응용프로그램을 모두 구성하는 방법은 관련 섹션을 참조하자.

Referrer Policy는 웹 응용 프로그램이 레퍼러 필드를 관리하는 데 사용할 수 있는 메커니즘으로, 사용자가
마지막으로 방문한 페이지를 포함한다.

스프링 시큐리티의 접근 방식은 서로 다른 정책을 제공하는 Referrer Policy 헤더를 사용하는 것이다:

```
Referrer-Policy: same-origin
```

Referrer-Policy 응답 헤더는 대상이 사용자가 이전에 있었던 소스를 알도록 브라우저에 지시다.

# Feature Policy

> 서블릿 및 웹 플럭스 기반 응용프로그램을 모두 구성하는 방법은 관련 섹션을 참조하자.

기능 정책은 웹 개발자가 브라우저에서 특정 API 및 웹 기능의 동작을 선택적으로 활성화, 비활성화 및 수정할
수 있도록 하는 메커니즘이다.

```
Feature-Policy: geolocation 'self'
```

기능 정책을 사용하여 개발자는 브라우저가 사이트 전체에서 사용되는 특정 기능에 적용할 수 있도록 "정책"
집합을 선택할 수 있다. 이러한 정책은 사이트에서 액세스할 수 있는 API를 제한하거나 특정 기능에 대한
브라우저의 기본 동작을 수정한다.

# Permissions Policy

> 서블릿 및 웹 플럭스 기반 응용프로그램을 모두 구성하는 방법은 관련 섹션을 참조하자.

권한 정책은 웹 개발자가 브라우저에서 특정 API 및 웹 기능의 동작을 선택적으로 활성화, 비활성화 및 수정할
수 있도록 하는 메커니즘이다.

```
Permissions-Policy: geolocation=(self)
```

사용 권한 정책을 사용하여 개발자는 브라우저가 사이트 전체에서 사용되는 특정 기능에 적용할 수 있도록 "정책"
집합을 선택할 수 있다. 이러한 정책은 사이트에서 액세스할 수 있는 API를 제한하거나 특정 기능에 대한
브라우저의 기본 동작을 수정한다.

# Clear Site Data

> 서블릿 및 웹 플럭스 기반 응용프로그램을 모두 구성하는 방법은 관련 섹션을 참조하자.

사이트 데이터 지우기는 HTTP 응답에 다음 헤더가 포함된 경우 브라우저 측 데이터(쿠키, 로컬 저장소 등)를
제거할 수 있는 메커니즘이다:

```
Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"
```

로그아웃 시 수행할 수 있는 정리 작업이다.

# Custom Headers

> 서블릿 기반 응용프로그램을 구성하는 방법은 관련 섹션을 참조하자.

스프링 시큐리티에는 응용 프로그램에 보다 일반적인 보안 헤더를 편리하게 추가할 수 있는 메커니즘이 있다.
그러나 사용자 정의 헤더를 추가할 수 있는 후크도 제공한다.

# HTTP [#](https://docs.spring.io/spring-security/reference/features/exploits/http.html)

정적 리소스를 포함한 모든 HTTP 기반 통신은 TLS를 사용하여 보호해야 한다.

기본적으로 스프링 시큐리티는 HTTP 연결을 처리하지 않으므로 HTTPS를 직접 지원하지 않는다. 그러나 HTTPS
사용에 도움이 되는 여러 기능을 제공한다.

# HTTPS로 리디렉션

클라이언트가 HTTP를 사용하는 경우 서블릿 및 WebFlux 환경 모두에서 HTTPS로 리디렉션하도록 스프링
시큐리티를 구성할 수 있다.

# 엄격한 운송 보안

스프링 시큐리티는 엄격한 전송 보안을 지원하며 기본적으로 활성화한다.

# 프록시 서버 구성

프록시 서버를 사용할 때는 응용 프로그램을 올바르게 구성했는지 확인하는 것이 중요하다. 예를 들어 대부분의
애플리케이션에는 `192.168.1:8080`에 있는 애플리케이션 서버로 요청을 전달하여 `example.com/`에
대한 요청에 응답하는 로드 밸런서가 있다. 적절한 구성이 없으면 애플리케이션 서버는 로드 밸런서가 존재하는지
알 수 없으며 클라이언트가 요청한 `192.168.1:8080`과 동일하게 요청을 처리한다.

이 문제를 해결하려면 [RFC 7239](https://datatracker.ietf.org/doc/html/rfc7239)를
사용하여 로드 밸런서가 사용 중임을 지정할 수 있다. 응용 프로그램이 이를 인식하도록 하려면
`X-Forwarded` 헤더를 인식하도록 응용 프로그램 서버를 구성해야 한다. 예를 들어 `Tomcat`은
`RemoteIpValve`를 사용하고 `Jetty`는 `ForwardedRequestCustomizer`를 사용한다. 또는
스프링 사용자는 `ForwardedHeaderFilter`를 사용할 수 있다.

스프링 부트 사용자는 `server.use-forward-headers` 속성을 사용하여 애플리케이션을 구성할 수 있다.
자세한 내용은 [스프링 Boot 설명서](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-use-tomcat-behind-a-proxy-server)를
참조하자.