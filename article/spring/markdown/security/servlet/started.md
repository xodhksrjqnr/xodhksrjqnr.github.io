# Hello 스프링 시큐리티 [#](https://docs.spring.io/spring-security/reference/servlet/getting-started.html)

이 섹션에서는 스프링 시큐리티를 스프링 부트와 함께 사용하는 방법에 대한 최소 설정에 대해 설명하고 그 이후의 다음 단계를 안내한다.

> 완료된 스타터 응용 프로그램은 [샘플 저장소](https://github.com/spring-projects/spring-security-samples/tree/main/servlet/spring-boot/java/hello-security)에서 찾을 수 있다. 스프링 Initializr에서 준비한 미니멀한 스프링 부트 + 스프링 시큐리티 어플리케이션을 다운로드하면 편리하다.

# 종속성 업데이트

먼저 응용 프로그램의 클래스 경로에 스프링 시큐리티를 추가해야 한다. 이를 위한 두 가지 방법은 `Maven` 또는 `Gradle`을 사용하는 것이다.

# Hello 스프링 시큐리티 부트 시작하기

클래스 경로에서 스프링 시큐리티를 사용하면 이제 스프링 부트 응용 프로그램을 실행할 수 있다. 다음 스니펫은 응용 프로그램에서 스프링 시큐리티가 활성화되었음을 나타내는 출력 중 일부를 보여준다:

### 빌드 툴 별 실행 명령어

```
//spring-security-samples/servlet/spring-boot/java/hello-security 경로로 이동

$ ./mvnw spring-boot:run
$ ./gradlew :bootRun
$ java -jar target/myapplication-0.0.1.jar
...
INFO 23689 --- [  restartedMain] .s.s.UserDetailsServiceAutoConfiguration :

Using generated security password: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

...
```

이제 실행 중이므로 엔드포인트를 눌러 결과를 확인할 수 있다. 다음과 같은 자격 증명이 없는 엔드포인트에 도달하는 경우:

```
$ curl -i http://localhost:8080/some/path
HTTP/1.1 401
...
```

그러면 스프링 시큐리티가 `401 Unauthorized`와의 액세스를 거부한다.

> 브라우저에 동일한 URL을 제공하면 기본 로그인 페이지로 리디렉션된다.

콘솔 출력에 있는 자격 증명(이전에 프로그램 실행 후 출력된 Using generated security password 참조)으로 엔드포인트를 누른 경우 다음과 같다:

```
$ curl -i -u user:8e557245-73e2-4286-969a-ff57fe326336 http://localhost:8080/some/path
HTTP/1.1 404
...
```

그러면 스프링 부트가 요청을 처리하며 `/some/path`가 존재하지 않으므로 이 경우 `404 Not Found`를 반환한다.

여기서 다음 작업을 수행할 수 있다:

- 스프링 시큐리티에서 스프링 부트가 기본적으로 무엇을 활성화하는지 더 잘 이해한다.
- 스프링 시큐리티가 도움이 되는 일반적인 사용 사례에 대해 알아보기
- [인증](https://docs.spring.io/spring-security/reference/servlet/authentication/index.html) 구성 시작

# 런타임 기대치

스프링 부트 및 스프링 시큐리티의 기본 배열은 런타임에 다음과 같은 동작을 제공한다:

- [모든 엔드포인트](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html) (부트의 `/error` 엔드포인트 포함)에 대해 인증된 사용자가 필요하다.
- 시작할 때 생성된 암호로 [기본 사용자를 등록](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html)한다. (암호는 콘솔에 기록된다. 앞의 예에서 암호는 8e557245-73e2-4286-969a-ff57fe326336이다)
- [`BCrypt` 및 기타 암호 스토리지](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html) 보호
- 양식 기반 [로그인](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html) 및 [로그아웃](https://docs.spring.io/spring-security/reference/servlet/authentication/logout.html) 흐름을 제공
- [양식 기반](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html) 로그인 및 [HTTP Basic](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/basic.html) 인증
- 콘텐츠 협상을 제공한다. 웹 요청의 경우 로그인 페이지로 리디렉션하고, 서비스 요청의 경우 `401 Unauthorized`를 반환한다.
- [CSRF 공격](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html) 완화
- [Session Fixation](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html#ns-session-fixation) 공격 완화
- [HTTPS를 보장](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)하기 위해 [`Strict-Transport-Security`](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-hsts) 쓰기
- [`X-Content-Type-Options`](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-content-type-options)를 작성하여 [스니핑 공격](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-content-type-options) 완화
- 인증된 리소스를 보호하는 [캐시 제어 헤더](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-cache-control) 쓰기
- [`X-Frame-Options`](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html#servlet-headers-frame-options)를 작성하여 [클릭재킹](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-frame-options) 완화
- [`HttpServletRequest`의 인증 방법](https://docs.spring.io/spring-security/reference/servlet/integrations/servlet-api.html)과 통합
- [인증 성공 및 실패 이벤트](https://docs.spring.io/spring-security/reference/servlet/authentication/events.html)를 게시

이를 위해 스프링 부트가 스프링 시큐리티와 어떻게 협력하고 있는지 이해하는 것이 도움이 될 수 있다. 부트의 보안 자동 구성을 보면 다음과 같은 작업이 수행된다(그림에서 단순화됨):

```java
@EnableWebSecurity //(1)
@Configuration
public class DefaultSecurityConfig {
    @Bean
    @ConditionalOnMissingBean(UserDetailsService.class)
    InMemoryUserDetailsManager inMemoryUserDetailsManager() { //(2)
        String generatedPassword = // ...;
        return new InMemoryUserDetailsManager(User.withUsername("user")
                .password(generatedPassword).roles("ROLE_USER").build());
    }

    @Bean
    @ConditionalOnMissingBean(AuthenticationEventPublisher.class)
    DefaultAuthenticationEventPublisher defaultAuthenticationEventPublisher(ApplicationEventPublisher delegate) { //(3)
        return new DefaultAuthenticationEventPublisher(delegate);
    }
}
```

1. `@EnableWebSecurity` 주석을 추가한다. (무엇보다도, 이것은 스프링 시큐리티의 기본 `@Bean` 체인을 `Filter`로 게시한다.
2. `user`의 사용자 이름과 콘솔에 기록된 임의로 생성된 암호를 사용하여 `UserDetailsService` `@Bean`을 게시한다.
3. 인증 이벤트 게시를 위한 `AuthenticationEventPublisher` `@Bean`을 게시한다.

> 스프링 부트는 `@Bean`로 게시된 `Filter`를 응용 프로그램의 필터 체인에 추가한다. 즉, `@EnableWebSecurity`를 스프링 부트와 함께 사용하면 모든 요청에 대해 스프링 시큐리티의 필터 체인이 자동으로 등록된다.

# 보안 사용 사례

여기서 가보고 싶은 곳이 많이 있다. 귀하와 귀하의 애플리케이션에 다음과 같은 이점이 있는지 알아보려면 스프링 시큐리티에서 다음과 같은 일반적인 사용 사례를 고려해 보자:

- REST API를 구축 중이며 [JWT](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html) 또는 [다른 bearer 토큰](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/opaque-token.html)을 인증해야 한다.
- 웹 애플리케이션, API 게이트웨이 또는 BFF를 구축하고 있고,
  - [OAuth 2.0 또는 OIDC를 사용하여 로그인](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html)해야 한다.
  - [SAML 2.0을 사용하여 로그인](https://docs.spring.io/spring-security/reference/servlet/saml2/login/index.html)해야 한다.
  - [CAS를 사용하여 로그인](https://docs.spring.io/spring-security/reference/servlet/authentication/cas.html)해야 한다.
- 다음을 관리해야 한다.
  - [LDAP](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/ldap.html) 또는 [Active Directory](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/ldap.html#_active_directory), [스프링 데이터](https://docs.spring.io/spring-security/reference/servlet/integrations/data.html) 또는 [JDBC](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/jdbc.html)의 사용자
  - [암호](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/storage.html)

이 중 원하는 것과 일치하는 것이 없는 경우 다음 순서로 응용 프로그램을 고려해 보자:

1. 프로토콜: 먼저 응용 프로그램이 통신에 사용할 프로토콜을 고려한다. 서블릿 기반 응용 프로그램의 경우 스프링 시큐리티는 HTTP와 [웹 소켓](https://docs.spring.io/spring-security/reference/servlet/integrations/websocket.html)을 지원한다.
2. 인증: 다음으로 사용자가 [인증](https://docs.spring.io/spring-security/reference/servlet/authentication/index.html)하는 방법과 인증이 상태 저장 또는 상태 비저장 여부를 고려한다.
3. 권한 부여: 그런 다음 [사용자에게 권한이 부여된 작업](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)을 결정하는 방법을 고려한다.
4. 방어: 마지막으로 [스프링 시큐리티의 기본 보호 기능과 통합](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-considerations)하여 [필요한 추가 보호 기능](https://docs.spring.io/spring-security/reference/servlet/exploits/headers.html)을 고려한다.