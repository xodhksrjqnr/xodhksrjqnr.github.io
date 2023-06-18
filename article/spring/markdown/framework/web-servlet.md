# Web Servlet

## 1. Spring Web MVC [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc)

### 1.1. DispatcherServlet [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-servlet)



### 1.2. Filters [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters)

스프링 웹 모듈은 여러 유용한 필터를 제공한다.

- [Form Data](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-http-put)
- [Forwarded Headers](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-forwarded-headers)
- [Shallow ETag](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-shallow-etag)
- [CORS](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-cors)

### 1.2.1. Form Data [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-http-put)

브라우저는 HTTP GET 또는 HTTP POST를 통해서만 양식 데이터를 제출할 수 있지만 브라우저가 아닌 클라이언트는
HTTP PUT, PATCH 및 DELETE를 사용할 수 있다. 서블릿 API를 사용하려면 HTTP POST에 대해서만 양식
필드 액세스를 지원하는 ServletRequest.getParameter*() 메서드가 필요하다.

스프링 웹 모듈은 응용 프로그램/x-www-form-url이 인코딩된 HTTP PUT, PATCH 및 DELETE 요청을 가로채고,
요청 본문에서 양식 데이터를 읽고, 서블릿 요청을 래핑하여 ServletRequest.getParameter*() 메서드 제품군을
통해 양식 데이터를 사용할 수 있도록 한다.

### 1.2.2. Forwarded Headers [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-forwarded-headers)

요청이 프록시(예: 로드 밸런서)를 통과할 때 호스트, 포트 및 구성표가 변경될 수 있으므로 클라이언트 관점에서
올바른 호스트, 포트 및 구성표를 가리키는 링크를 만드는 것이 어렵다.

[RFC 7239](https://www.rfc-editor.org/rfc/rfc7239)는 프록시가 원래 요청에 대한 정보를
제공하는 데 사용할 수 있는 전달 HTTP 헤더를 정의한다. X-Forwarded-Host, X-Forwarded-Port,
X-Forwarded-Proto, X-Forwarded-Ssl 및 X-Forwarded-Prefix 등 다른 비표준 헤더도 있다.

ForwardedHeaderFilter는 a) 전달된 헤더를 기준으로 호스트, 포트 및 구성을 변경하고 b) 이러한
헤더를 제거하여 추가적인 영향을 제거하기 위해 요청을 수정하는 서블릿 필터이다. 필터는 요청을 래핑하는 데
의존하므로 요청을 원래 요청이 아닌 수정된 요청과 함께 작동해야 하는 RequestContextFilter와 같은
다른 필터보다 먼저 정렬해야 한다.

전달된 헤더는 응용 프로그램이 의도한 대로 프록시에 의해 추가되었는지 또는 악의적인 클라이언트에 의해
추가되었는지 알 수 없기 때문에 보안 고려 사항이 있다. 따라서 신뢰 경계의 프록시를 외부에서 오는 신뢰할
수 없는 전달 헤더를 제거하도록 구성해야 한다. removeOnly=true를 사용하여 ForwardedHeaderFilter를
구성할 수도 있으며, 이 경우 헤더는 제거되지만 사용되지 않는다.

[비동기 요청](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-async)
및 오류 발송을 지원하려면 이 필터를 DispatcherType.ASYNC 및 DispatcherType.ERROR와 매핑해야
한다. Spring Framework의 AbstractAnnotationConfigDispatcherServletInitializer를
사용하는 경우([Servlet 구성](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-container-config)
참조) 모든 필터가 모든 발송 유형에 대해 자동으로 등록된다. 그러나 web.xml을 통해 필터를 등록하거나
FilterRegistrationBean을 통해 Spring Boot에 필터를 등록하는 경우 DispatcherType.REQUEST
외에 DispatcherType.ASYNC와 DispatcherType.ERROR도 포함해야 한다.

### 1.2.3. Shallow ETag [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-shallow-etag)

ShallowEtagHeaderFilter 필터는 응답에 작성된 내용을 캐싱하고 응답에서 MD5 해시를 계산하여 "얕은"
ETag를 만든다. 다음 번에 클라이언트가 동일한 전송을 할 때도 계산된 값을 If-None-Match 요청 헤더와
비교하고 둘이 같을 경우 304(NOT_MODIFIED)를 반환한다.

이 전략은 각 요청에 대해 전체 응답을 계산해야 하므로 네트워크 대역폭은 절약되지만 CPU는 절약되지 않는다.
앞에서 설명한 컨트롤러 수준의 다른 전략은 계산을 피할 수 있다. [HTTP 캐싱](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-caching)을
참조하자.

이 필터에는 W/"02a2d595e6ed9a0b24f027f2b63b134d6"([RFC 7232](https://www.rfc-editor.org/rfc/rfc7232#section-2.3)
섹션 2.3에 정의됨)와 유사한 약한 ETag를 기록하도록 필터를 구성하는 writeWeakETag 매개 변수가 있다.

[비동기 요청](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-async)을
지원하려면 필터가 마지막 비동기 전송이 끝날 때까지 지연되고 성공적으로 ETag를 생성할 수 있도록 이 필터를
DispatcherType.ASYNC로 매핑해야 한다. Spring Framework의
AbstractAnnotationConfigDispatcherServletInitializer를 사용하는 경우([Servlet Config](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-container-config)
참조) 모든 필터가 모든 발송 유형에 대해 자동으로 등록된다. 그러나 web.xml을 통해 필터를 등록하거나
FilterRegistrationBean을 통해 Spring Boot에 필터를 등록하는 경우 DispatcherType.ASYNC를
포함해야 한다.

### 1.2.4. CORS [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#filters-cors)

Spring MVC는 컨트롤러의 주석을 통해 CORS 구성을 세부적으로 지원한다. 그러나 Spring Security와
함께 사용할 경우 Spring Security의 필터 체인보다 먼저 정렬해야 하는 내장 CorsFilter를 사용하는
것이 좋다.

자세한 내용은 [CORS](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors)
및 [CORS 필터](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-filter)
섹션을 참조하자.

### 1.7. CORS [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors)

Spring MVC를 사용하면 CORS(Cross-Origin Resource Sharing)를 처리할 수 있다. 이 절에서는
관련 방법을 설명한다.

### 1.7.1. Introduction [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-intro)

보안상의 이유로 브라우저는 현재 오리진 외부의 리소스에 대한 AJAX 호출을 금지한다. 예를 들어 한 탭에는
은행 계정이 있고 다른 탭에는 evil.com이 있을 수 있다. evil.com의 스크립트는 귀하의 자격 증명으로
은행 API에 AJAX 요청을 할 수 없다. 예를 들어, 귀하의 계좌에서 돈을 인출할 수 없다!

CORS(Cross-Origin Resource Sharing)는 대부분의 브라우저에서 구현된 W3C 사양으로, IFRAME
또는 JSONP에 기반한 보안 및 강력한 해결 방법을 사용하지 않고 도메인 간 요청의 유형을 지정할 수 있다.

### 1.7.2. Processing [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-processing)

CORS 사양은 preflight 요청, 단순 요청 및 실제 요청을 구분한다. CORS의 작동 방식에 대해 알아보려면
[이 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)를 읽거나 자세한
내용은 사양을 참조하자.

Spring MVC HandlerMapping 구현은 CORS에 대한 기본 지원을 제공한다. 요청을 처리기에 매핑한 후
HandlerMapping 구현은 지정된 요청 및 처리기에 대한 CORS 구성을 확인하고 추가 작업을 수행한다.
Preflight 요청은 직접 처리되고, 단순 및 실제 CORS 요청은 가로채고, 유효성을 검사하며, 필수 CORS
응답 헤더가 설정되어 있다.

교차 오리진 요청(즉, 오리진 헤더가 존재하고 요청의 호스트와 다름)을 활성화하려면 몇 가지 명시적으로 선언된
CORS 구성이 있어야 한다. 일치하는 CORS 구성을 찾을 수 없으면 preflight 요청이 거부된다. 단순하고
실제적인 CORS 요청의 응답에 CORS 헤더가 추가되지 않으므로 브라우저는 이 헤더를 거부한다.

각 HandlerMapping는 URL 패턴 기반 CorsConfiguration 매핑을 사용하여 개별적으로 [구성](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/web/servlet/handler/AbstractHandlerMapping.html#setCorsConfigurations-java.util.Map-)할
수 있다. 대부분의 경우 애플리케이션은 MVC Java 구성 또는 XML 네임스페이스를 사용하여 이러한 매핑을
선언하므로 단일 글로벌 맵이 모든 HandlerMapping 인스턴스에 전달된다.

HandlerMapping 수준에서 글로벌 CORS 구성을 보다 세분화된 핸들러 수준의 CORS 구성과 결합할 수 있다.
예를 들어 주석이 달린 컨트롤러는 클래스 또는 메서드 수준의 @CrossOrigin 주석을 사용할 수 있다(다른
핸들러는 CorsConfigurationSource를 구현할 수 있음).

글로벌 구성과 로컬 구성을 결합하는 규칙은 일반적으로 추가적이다. 예를 들어, 모든 글로벌 구성과 모든 로컬
구성을 결합한다. allowCredentials 및 maxAge와 같이 단일 값만 허용되는 속성의 경우 로컬은 글로벌
값을 재정의한다. 자세한 내용은 [CorsConfiguration#combine(CorsConfiguration)](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/web/cors/CorsConfiguration.html#combine-org.springframework.web.cors.CorsConfiguration-)를
참조하자.

소스에서 자세히 알아보거나 고급 사용자 지정을 수행하려면 다음 코드를 확인하자:

- CorsConfiguration
- CorsProcessor, DefaultCorsProcessor
- AbstractHandlerMapping

### 1.7.3. @CrossOrigin [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-controller)

@CrossOrigin 주석은 다음 예제에서 볼 수 있듯이 주석이 달린 컨트롤러 메서드에 대한 교차 오리진 요청을
활성화한다.

```java
@RestController
@RequestMapping("/account")
public class AccountController {

    @CrossOrigin
    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

기본적으로 @CrossOrigin은 다음을 허용한다.

- 모든 오리진
- 모든 헤더
- 컨트롤러 메서드가 매핑된 모든 HTTP 메서드

allowCredentials는 중요한 사용자별 정보(예: 쿠키 및 CSRF 토큰)를 노출하는 신뢰 수준을 설정하므로
기본적으로 사용되지 않으며 적절한 경우에만 사용해야 한다. 활성화된 경우 allowOrigins를 하나 이상의
특정 도메인(특수 값 "*"은 아님)으로 설정해야 한다. 또는 allowOriginPatterns 속성을 사용하여 동적
오리진 집합과 일치시킬 수 있다.

maxAge는 디폴트 30분으로 설정되어 있다.

@CrossOrigin은 클래스 수준에서도 지원되며 다음 예제에서 볼 수 있듯이 모든 메서드에서 상속된다.

```java
@CrossOrigin(origins = "https://domain2.com", maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

다음 예제에서 볼 수 있듯이 클래스 수준과 메서드 수준 모두에서 @CrossOrigin을 사용할 수 있다.

```java
@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

    @CrossOrigin("https://domain2.com")
    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

### 1.7.4. Global Configuration [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-global)

세분화된 컨트롤러 메소드 수준 구성 외에도 일부 글로벌 CORS 구성도 정의해야 할 수 있다. 모든
HandlerMapping에서 URL 기반 CorsConfiguration 매핑을 개별적으로 설정할 수 있다. 그러나 대부분의
응용 프로그램은 MVC Java 구성 또는 MVC XML 네임스페이스를 사용한다.

기본적으로 @CrossOrigin은 다음을 활성화한다.

- 모든 오리진
- 모든 헤더
- GET, HEAD 및 POST 메서드

allowCredentials는 중요한 사용자별 정보(예: 쿠키 및 CSRF 토큰)를 노출하는 신뢰 수준을 설정하므로
기본적으로 사용되지 않으며 적절한 경우에만 사용해야 한다. 활성화된 경우 allowOrigins를 하나 이상의
특정 도메인(특수 값 "*"은 아님)으로 설정해야 한다. 또는 allowOriginPatterns 속성을 사용하여 동적
오리진 집합과 일치시킬 수 있다.

maxAge는 디폴트 30분으로 설정되어 있다.

### Java Configuration [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-global-java)

MVC Java 구성에서 CORS를 활성화하려면 다음 예와 같이 CorsRegistry 콜백을 사용할 수 있다.

```Java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
            .allowedOrigins("https://domain2.com")
            .allowedMethods("PUT", "DELETE")
            .allowedHeaders("header1", "header2", "header3")
            .exposedHeaders("header1", "header2")
            .allowCredentials(true).maxAge(3600);

        // Add more mappings...
    }
}
```

### XML Configuration [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-global-xml)

XML 네임스페이스에서 CORS를 활성화하려면 다음 예제와 같이 &#60;mvc:cors&#62; 요소를 사용할 수 있다.

```xml
<mvc:cors>

    <mvc:mapping path="/api/**"
        allowed-origins="https://domain1.com, https://domain2.com"
        allowed-methods="GET, PUT"
        allowed-headers="header1, header2, header3"
        exposed-headers="header1, header2" allow-credentials="true"
        max-age="123" />

    <mvc:mapping path="/resources/**"
        allowed-origins="https://domain1.com" />

</mvc:cors>
```

### 1.7.5. CORS Filter [#](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors-filter)

내장된 CorsFilter를 통해 CORS 지원을 적용할 수 있다.

Spring Security와 함께 CorsFilter를 사용하려는 경우 Spring Security는 CORS를 기본적으로
지원한다.

필터를 구성하려면 다음 예와 같이 CorsConfigurationSource를 생성자에게 전달한다.

```java
CorsConfiguration config = new CorsConfiguration();

// Possibly...
// config.applyPermitDefaultValues()

config.setAllowCredentials(true);
config.addAllowedOrigin("https://domain1.com");
config.addAllowedHeader("*");
config.addAllowedMethod("*");

UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/**", config);

CorsFilter filter = new CorsFilter(source);
```