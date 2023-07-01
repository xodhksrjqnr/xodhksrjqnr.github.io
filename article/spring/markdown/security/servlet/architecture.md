# 아키텍처 [#](https://docs.spring.io/spring-security/reference/servlet/architecture.html)

이 섹션에서는 서블릿 기반 애플리케이션 내의 스프링 시큐리티의 고급 아키텍처에 대해 설명한다. 레퍼런스의 Authentication, Authorization 및 Protection Against Utility 섹션 내에서 이러한 높은 수준의 이해를 기반으로 한다.

# 필터 검토

스프링 시큐리티의 서블릿 지원은 서블릿 필터를 기반으로 하므로 필터의 역할을 일반적으로 먼저 살펴보는 것이 좋다. 다음 이미지는 단일 HTTP 요청에 대한 처리기의 일반적인 계층화를 보여준다.

![](https://docs.spring.io/spring-security/reference/_images/servlet/architecture/filterchain.png)

클라이언트가 애플리케이션에 요청을 보내고 컨테이너가 `HttpServletRequest` URI의 경로를 기반으로 `Filter`를 처리해야 하는 `Servlet` 인스턴스와 `FilterChain`을 포함하는 요청을 생성한다. 스프링 MVC 애플리케이션에서 `Servlet`은 `DispatcherServlet`의 인스턴스이다. 하나의 `Servlet`은 많아 봐야 단일 `HttpServletRequest` 및 `HttpServletResponse`를 처리할 수 있다. 그러나 둘 이상의 `Filter`를 사용하여 다음 작업을 수행할 수 있다:

- 다운스트림 `Filter` 인스턴스 또는 `Servlet`이 호출되지 않도록 한다. 이 경우 `Filter`는 일반적으로 `HttpServletResponse`를 작성한다.
- 다운스트림 `Filter` 인스턴스 및 `Servlet`에서 사용하는 `HttpServletRequest` 또는 `HttpServletResponse`를 수정한다.

`Filter`의 힘은 그 안으로 전달되는 `FilterChain`에서 나온다.

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
	// do something before the rest of the application
    chain.doFilter(request, response); // invoke the rest of the application
    // do something after the rest of the application
}
```

`Filter`는 다운스트림 `Filter` 인스턴스와 `Servlet`에만 영향을 미치기 때문에 각 `Filter`가 호출되는 순서가 매우 중요하다.

# DelegatingFilterProxy

스프링은 서블릿 컨테이너의 라이프사이클과 스프링의 `ApplicationContext` 사이를 연결할 수 있는 `DelegatingFilterProxy`라는 이름의 `Filter` 구현을 제공한다. `Servlet` 컨테이너는 자체 표준을 사용하여 `Filter` 인스턴스를 등록할 수 있지만 스프링 정의 빈은 인식하지 못한다. 표준 서블릿 컨테이너 메커니즘을 통해 `DelegatingFilterProxy`를 등록할 수 있지만 모든 작업을 `Filter`를 구현하는 스프링 빈에 위임할 수 있다.

다음은 `DelegatingFilterProxy`가 `Filter` 인스턴스와 `FilterChain`에 어떻게 적합한지 보여주는 그림이다.

![](https://docs.spring.io/spring-security/reference/_images/servlet/architecture/delegatingfilterproxy.png)

`DelegatingFilterProxy`는 `ApplicationContext`에서 빈 `Filter0`를 올려다보고 빈 `Filter0`를 호출한다. 다음 목록은 `DelegatingFilterProxy`의 유사 코드를 보여준다:

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
	Filter delegate = getFilterBean(someBeanName); //(1)
	delegate.doFilter(request, response); //(2)
}
```

1) 스프링 빈으로 등록된 `Filter`를 지연하여 얻는다. 예를 들어 `DelegatingFilterProxy`의 경우 대리자는 빈 `Filter0`의 인스턴스이다.
2) 스프링 빈에게 작업을 위임한다.

`DelegatingFilterProxy`의 또 다른 이점은 `Filter` 빈 인스턴스 조회를 지연할 수 있다는 것이다. 컨테이너를 시작하기 전에 컨테이너가 `Filter` 인스턴스를 등록해야 하므로 이 작업은 중요하다. 그러나 스프링은 일반적으로 `ContextLoaderListener`를 사용하여 스프링 빈을 로드한다. 이 작업은 `Filter` 인스턴스를 등록해야 할 때까지 수행되지 않는다.

# FilterChainProxy

스프링 시큐리티의 서블릿 지원은 `FilterChainProxy`에 포함되어 있다. `FilterChainProxy`는 스프링 시큐리티에서 제공하는 특수 `Filter`로, `SecurityFilterChain`을 통해 많은 `Filter` 인스턴스에 위임할 수 있다. `FilterChainProxy`는 빈이기 때문에, 일반적으로 `DelegatingFilterProxy`에 싸여 있다.

다음 이미지는 `FilterChainProxy`의 역할을 보여준다.

![](https://docs.spring.io/spring-security/reference/_images/servlet/architecture/filterchainproxy.png)

# SecurityFilterChain

`SecurityFilterChain`은 `FilterChainProxy`에서 현재 요청에 대해 호출할 스프링 시큐리티 `Filter` 인스턴스를 결정하는 데 사용된다.

다음 이미지는 `SecurityFilterChain`의 역할을 보여준다.

![](https://docs.spring.io/spring-security/reference/_images/servlet/architecture/securityfilterchain.png)

`SecurityFilterChain`의 시큐리티 `Filters`는 일반적으로 빈이지만 `DelegatingFilterProxy` 대신 `FilterChainProxy`에 등록되어 있다. `FilterChainProxy`는 `Servlet` 컨테이너 또는 `DelegatingFilterProxy`에 직접 등록할 수 있는 여러 가지 이점을 제공한다. 첫째, 스프링 시큐리티의 모든 `Servlet` 지원을 위한 출발점을 제공한다. 따라서 스프링 시큐리티의 `Servlet` 지원 문제를 해결하려는 경우 `FilterChainProxy`에 디버그 지점을 추가하는 것이 좋다.

둘째, `FilterChainProxy`는 스프링 시큐리티 사용의 핵심으로, 선택 사항으로 간주되지 않는 작업을 수행할 수 있다. 예를 들어, 메모리 누수를 방지하기 위해 `SecurityContext`를 삭제한다. 또한 스프링 시큐리티의 `HttpFirewall`를 적용하여 특정 유형의 공격으로부터 애플리케이션을 보호한다.

또한 `SecurityFilterChain`을 실행해야 하는 시기를 결정하는 데 있어 보다 유연성을 제공한다. `Servlet` 컨테이너에서 `Filter` 인스턴스는 URL을 기반으로 호출된다. 그러나 `FilterChainProxy`는 `RequestMatcher` 인터페이스를 사용하여 `HttpServletRequest`의 모든 항목을 기반으로 호출을 결정할 수 있다.

다음 이미지에서는 여러 `SecurityFilterChain` 인스턴스를 보여 준다:

![](https://docs.spring.io/spring-security/reference/_images/servlet/architecture/multi-securityfilterchain.png)

다중 `SecurityFilterChain` 그림에서 `FilterChainProxy`는 사용할 `SecurityFilterChain`을 결정한다. 일치하는 첫 번째 `SecurityFilterChain`만 호출된다. `/api/messages/`의 URL이 요청되면 먼저 `/api/**`의 `SecurityFilterChain₀` 패턴과 일치하므로 `SecurityFilterChain𝒏`에서 일치하더라도 `SecurityFilterChain₀`만 호출된다. `/messages/` URL이 요청되면 `/api/**`의 `SecurityFilterChain₀` 패턴과 일치하지 않으므로 `FilterChainProxy`에서 각 `SecurityFilterChain`을 계속 시도한다. 일치하는 다른 `SecurityFilterChain` 인스턴스가 없다고 가정하면 `SecurityFilterChain𝒏`이 호출된다.

`SecurityFilterChain₀`는 세 개의 시큐리티 `Filter` 인스턴스만 구성되어 있다. 그러나 `SecurityFilterChain𝒏`는 4개의 시큐리티 `Filter` 인스턴스가 구성되어 있다. 각 `SecurityFilterChain`은 고유할 수 있으며 개별적으로 구성할 수 있다. 실제로 응용 프로그램에서 스프링 시큐리티가 특정 요청을 무시하도록 하려면 `SecurityFilterChain`에 시큐리티 `Filter` 인스턴스가 없을 수 있다.

# 시큐리티 필터

시큐리티 `Filters`는 `SecurityFilterChain` API와 함께 `FilterChainProxy`에 삽입된다. `Filter` 인스턴스의 순서가 중요하다. 일반적으로 스프링 시큐리티의 `Filter` 인스턴스 순서를 알 필요가 없다. 하지만, 순서를 아는 것이 도움이 될 때가 있다.

다음은 스프링 시큐리티 `Filter` 순서의 포괄적인 목록이다:

- `ForceEagerSessionCreationFilter`
- `ChannelProcessingFilter`
- `WebAsyncManagerIntegrationFilter`
- `SecurityContextPersistenceFilter`
- `HeaderWriterFilter`
- `CorsFilter`
- `CsrfFilter`
- `LogoutFilter`
- `OAuth2AuthorizationRequestRedirectFilter`
- `Saml2WebSsoAuthenticationRequestFilter`
- `X509AuthenticationFilter`
- `AbstractPreAuthenticatedProcessingFilter`
- `CasAuthenticationFilter`
- `OAuth2LoginAuthenticationFilter`
- `Saml2WebSsoAuthenticationFilter`
- `UsernamePasswordAuthenticationFilter`
- `DefaultLoginPageGeneratingFilter`
- `DefaultLogoutPageGeneratingFilter`
- `ConcurrentSessionFilter`
- `DigestAuthenticationFilter`
- `BearerTokenAuthenticationFilter`
- `BasicAuthenticationFilter`
- `RequestCacheAwareFilter`
- `SecurityContextHolderAwareRequestFilter`
- `JaasApiIntegrationFilter`
- `RememberMeAuthenticationFilter`
- `AnonymousAuthenticationFilter`
- `OAuth2AuthorizationCodeGrantFilter`
- `SessionManagementFilter`
- `ExceptionTranslationFilter`
- `AuthorizationFilter`
- `SwitchUserFilter`

# 시큐리티 예외 처리

`ExceptionTranslationFilter`를 사용하면 `AccessDeniedException` 및 `AuthenticationException`을 HTTP 응답으로 변환할 수 있다.

`ExceptionTranslationFilter`는 시큐리티 `Filters` 중 하나로 `FilterChainProxy`에 삽입된다.

다음 이미지는 `ExceptionTranslationFilter`와 다른 구성 요소의 관계를 보여준다:

![](https://docs.spring.io/spring-security/reference/_images/servlet/architecture/exceptiontranslationfilter.png)

- 먼저 `ExceptionTranslationFilter`가 `FilterChain.doFilter(request, response)`를 호출하여 나머지 응용 프로그램을 호출한다.
- 사용자가 인증되지 않았거나 `AuthenticationException`인 경우 `Start Authentication`이다.
  - [`SecurityContextHolder`](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder)가 정리되었다.
  - 인증이 성공하면 원래 요청을 재생하는 데 사용할 수 있도록 `HttpServletRequest`가 저장된다.
  - `AuthenticationEntryPoint`는 클라이언트에서 자격 증명을 요청하는 데 사용된다. 예를 들어 로그인 페이지로 리디렉션하거나 `WWW-Authenticate` 헤더를 보낼 수 있다.
- 그렇지 않으면 `AccessDeniedException`으로 `Access Denied`이다. 액세스 거부를 처리하기 위해 `AccessDeniedHandler`이 호출된다.

> 응용 프로그램이 `AccessDeniedException` 또는 `AuthenticationException`을 던지지 않으면 `ExceptionTranslationFilter`는 아무 작업도 수행하지 않는다.

`ExceptionTranslationFilter`의 유사 코드는 다음과 같다:

```java
try {
	filterChain.doFilter(request, response); //(1)
} catch (AccessDeniedException | AuthenticationException ex) {
	if (!authenticated || ex instanceof AuthenticationException) {
		startAuthentication(); //(2)
	} else {
		accessDenied(); //(3)
	}
}
```

1) `Filters` 검토에서 설명한 바와 같이, `FilterChain.doFilter(request, response)`를 호출하는 것은 나머지 응용 프로그램을 호출하는 것과 같다. 즉, 응용 프로그램의 다른 부분(`FilterSecurityInterceptor` 또는 메서드 보안)이 `AuthenticationException` 또는 `AccessDeniedException`을 던지면 여기에서 이를 포착하여 처리한다.
2) 사용자가 인증되지 않았거나 `AuthenticationException`인 경우 `Start Authentication`이다.
3) 그렇지 않으면 `Access Denied`이다.

# 인증 간 요청 저장

시큐리티 예외 처리에서 설명한 것처럼, 인증이 필요한 리소스에 대한 요청인 경우 인증이 성공한 후 재요청할 인증된 리소스에 대한 요청을 저장해야 한다. 스프링 시큐리티에서는 `RequestCache` 구현을 사용하여 `HttpServletRequest`를 저장한다.

## RequestCache

`HttpServletRequest`는 `RequestCache`에 저장된다. 사용자가 성공적으로 인증되면 `RequestCache`가 원래 요청을 재생하는 데 사용된다. `RequestCacheAwareFilter`는 `RequestCache`를 구하기 위해 `HttpServletRequest`를 사용하는 것이다.

기본적으로 `HttpSessionRequestCache`가 사용된다. 아래 코드는 `continue`라는 매개 변수가 있는 경우 저장된 요청에 대한 `HttpSession`을 확인하는 데 사용되는 `RequestCache` 구현을 사용자 지정하는 방법을 보여준다.

### Java

```java
@Bean
DefaultSecurityFilterChain springSecurity(HttpSecurity http) throws Exception {
	HttpSessionRequestCache requestCache = new HttpSessionRequestCache();
	requestCache.setMatchingRequestParameterName("continue");
	http
		// ...
		.requestCache((cache) -> cache
			.requestCache(requestCache)
		);
	return http.build();
}
```

### Xml

```xml
<http auto-config="true">
	<!-- ... -->
	<request-cache ref="requestCache"/>
</http>

<b:bean id="requestCache" class="org.springframework.security.web.savedrequest.HttpSessionRequestCache"
	p:matchingRequestParameterName="continue"/>
```

## 요청 저장 방지

사용자의 인증되지 않은 요청을 세션에 저장하지 않는 이유는 여러 가지가 있다. 스토리지를 사용자의 브라우저로 오프로드하거나 데이터베이스에 저장할 수 있다. 또는 사용자가 로그인하기 전에 방문하려고 시도한 페이지 대신 홈 페이지로 사용자를 리디렉션하려는 경우 이 기능을 종료할 수 있다.

이를 위해 [`NullRequestCache`](https://docs.spring.io/spring-security/site/docs/6.1.1/api/org/springframework/security/web/savedrequest/NullRequestCache.html) 구현을 사용할 수 있다.

### Java

```java
@Bean
SecurityFilterChain springSecurity(HttpSecurity http) throws Exception {
    RequestCache nullRequestCache = new NullRequestCache();
    http
        // ...
        .requestCache((cache) -> cache
            .requestCache(nullRequestCache)
        );
    return http.build();
}
```

### Xml

```xml
<http auto-config="true">
	<!-- ... -->
	<request-cache ref="nullRequestCache"/>
</http>

<b:bean id="nullRequestCache" class="org.springframework.security.web.savedrequest.NullRequestCache"/>
```

# RequestCacheAwareFilter

[`RequestCacheAwareFilter`](https://docs.spring.io/spring-security/site/docs/6.1.1/api/org/springframework/security/web/savedrequest/RequestCacheAwareFilter.html)는 `RequestCache`를 사용하여 `HttpServletRequest`를 저장한다.