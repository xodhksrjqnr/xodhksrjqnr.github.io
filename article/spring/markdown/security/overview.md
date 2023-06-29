# 스프링 시큐리티 [#](https://docs.spring.io/spring-security/reference/index.html)

스프링 시큐리티는 일반적인 공격에 대한 인증, 권한 부여 및 보호 기능을 제공하는 프레임워크이다. 명령형
애플리케이션과 반응형 애플리케이션 모두를 보호하기 위한 최고 수준의 지원을 통해 스프링 기반 애플리케이션을
보호하기 위한 사실상의 표준이다.

전체 기능 목록은 참조의 기능 섹션을 참조하자.

# 시작하기

응용 프로그램 보안을 시작할 준비가 된 경우 서블릿 및 대응형에 대한 시작 섹션을 참조하자. 이 섹션에서는 첫
번째 스프링 시큐리티 응용 프로그램을 만드는 과정을 안내한다.

스프링 시큐리티의 작동 방식을 이해하려면 아키텍처 섹션을 참조하자.

만약 여러분이 질문이 있다면, 여러분을 돕고 싶은 멋진 커뮤니티가 있다!

# 전제조건 [#](https://docs.spring.io/spring-security/reference/prerequisites.html)

스프링 시큐리티를 사용하려면 `Java 8` 이상의 런타임 환경이 필요하다.

스프링 시큐리티는 독립적인 방식으로 작동하는 것을 목표로 하므로 Java 런타임 환경에 특별한 구성 파일을
배치할 필요가 없다. 특히 특수 JAAS(Java Authentication and Authorization Service) 정책
파일을 구성하거나 스프링 시큐리티를 공통 클래스 경로 위치에 배치할 필요가 없다.

마찬가지로, EJB 컨테이너 또는 서블릿 컨테이너를 사용하는 경우, 특별한 구성 파일을 아무 곳에나 둘 필요도
없고 서버 클래스 로더에 스프링 시큐리티를 포함할 필요도 없다. 필요한 모든 파일이 응용 프로그램에
포함되어 있다.

이 설계는 JAR, WAR 또는 EAR 등의 대상 아티팩트를 시스템 간에 복사할 수 있으므로, 최대한 배포 시간
유연성을 제공한다.

# 스프링 시큐리티 커뮤니티 [#](https://docs.spring.io/spring-security/reference/community.html)

스프링 시큐리티 커뮤니티에 오신 것을 환영한다! 이 섹션에서는 광대한 커뮤니티를 최대한 활용할 수
있는 방법에 대해 설명한다.

# 도움말 보기

스프링 시큐리티에 대해 도움이 필요하면 다음과 같이 좋은 방법들이 있다.:

- 이 설명서를 끝까지 읽어 보자.
- 많은 샘플 애플리케이션 중 하나를 사용해 보자.
- 스프링 시큐리티 태그를 사용하여 `https://stackoverflow.com` 에서 질문하자.
- `github.com/spring-projects/spring-security/issues` 에서 버그 및 개선 요청 보고하자.

# 참여하기

스프링 시큐리티 프로젝트에 참여하신 것을 환영한다. 스택 오버플로우에 대한 질문에 대한 답변, 새 코드 작성,
기존 코드 개선, 문서 작성 지원, 샘플 또는 튜토리얼 개발, 버그 보고, 단순 제안 등 다양한 방법으로 기여할
수 있다. 자세한 내용은 [Contributing](https://github.com/spring-projects/spring-security/blob/main/CONTRIBUTING.adoc)
설명서를 참조하자.

# 소스 코드

스프링 시큐리티의 소스 코드는 GitHub([github.com/spring-projects/spring-security/](https://github.com/spring-projects/spring-security/)
에서 확인할 수 있다.

# Apache 2 라이센스

스프링 시큐리티는 Apache 2.0 라이센스로 출시된 오픈 소스 소프트웨어이다.

# 소셜 미디어

Twitter에서 `@SpringSecurity` 및 `SpringSecurity` 팀을 팔로우하여 최신 뉴스를 확인할 수 있다.
또한 `@SpringCentral`에 따라 전체 스프링 포트폴리오를 최신 상태로 유지할 수 있다.

# 새로운 기능 [#](https://docs.spring.io/spring-security/reference/whats-new.html)

스프링 시큐리티 6.1은 여러 가지 새로운 기능을 제공한다. 다음은 릴리스의 주요 내용이다.

# Core

- [gh-12233](https://github.com/spring-projects/spring-security/issues/12233)
  \- 보안권한 부여 관리자를 통해 기본 권한 부여 관리자를 사용자 지정할 수 있다.

- [gh-12231](https://github.com/spring-projects/spring-security/issues/12231)
  \- 권한 수집 권한 관리자 추가

# OAuth 2.0

[gh-10309](https://github.com/spring-projects/spring-security/issues/10309)
/- (docs) - 님버스 추가(반응)발행자 위치가 있는 JwtDecoder#
[gh-12907](https://github.com/spring-projects/spring-security/issues/12907)
/- ReactiveJwt에서 주 클레임 이름 구성인증 변환기

# SAML 2.0

[gh-12604](https://github.com/spring-projects/spring-security/issues/12604)
/- AuthnRequestSigned 메타데이터 특성 지원
[gh-12846](https://github.com/spring-projects/spring-security/issues/12846)
/- 메타데이터가 여러 엔티티 및 엔티티 설명자 지원
[gh-11828](https://github.com/spring-projects/spring-security/issues/11828)
/- (docs) - DSL에 saml2Metadata 추가
[gh-12843](https://github.com/spring-projects/spring-security/issues/12843)
/- (docs) - 로그아웃 요청에서 의존 당사자 추론 허용
[gh-10243](https://github.com/spring-projects/spring-security/issues/10243)
/- (docs) - SAML 응답에서 의존 당사자 추론 허용
[gh-12842](https://github.com/spring-projects/spring-security/issues/12842)
/- RelingPartyRegistration 자리 표시자 확인 구성 요소 추가
[gh-12845](https://github.com/spring-projects/spring-security/issues/12845)
/- 이미 로그아웃한 후 Logout Response 발급 지원

# Observability

[gh-12534](https://github.com/spring-projects/spring-security/issues/12534)
/- 인증 및 권한 부여 관찰 규칙 사용자 정의

# Web

[gh-12751](https://github.com/spring-projects/spring-security/issues/12751)
/- RequestMatchers 공장 클래스 추가
[gh-12847](https://github.com/spring-projects/spring-security/issues/12847)
/- And 및 OrRequestMatcher를 통해 변수 전파

# Docs

스프링 시큐리티의 문서를 업데이트하기 위한 지속적인 노력으로 몇 개의 추가 섹션이
완전히 다시 작성되었다:

[gh-13088](https://github.com/spring-projects/spring-security/issues/13088)
/- (docs) - 인증 문서 다시 보기
[gh-12681](https://github.com/spring-projects/spring-security/issues/12681)
/- (docs) - 세션 관리 문서 다시 보기
[gh-13062](https://github.com/spring-projects/spring-security/issues/13062)
/- (docs) - 로그아웃 문서 다시 보기
[gh-13089](https://github.com/spring-projects/spring-security/issues/13089)
/- CSRF 설명서 다시 보기

# 7.0 준비 [#](https://docs.spring.io/spring-security/reference/migration-7/index.html)

스프링 시큐리티 7.0은 아직 출시일이 없지만 지금부터 준비를 시작하는 것이 중요하다.

이 준비 가이드는 스프링 시큐리티 7.0의 가장 큰 변경 사항을 요약하고 이를 준비하기 위한 단계를 제공하기
위해 설계되었다.

응용 프로그램을 최신 스프링 시큐리티 6 및 Spring Boot 3 릴리스로 최신 상태로 유지하는 것이 중요하다.

# 구성 마이그레이션 [#](https://docs.spring.io/spring-security/reference/migration-7/configuration.html)

다음 단계는 `HttpSecurity`, `WebSecurity` 및 관련 구성 요소를 구성하는 방법에 대한 변경과
관련되어 있다.

# 람다 DSL 사용

람다 DSL은 버전 5.2부터 스프링 시큐리티에 있으며, 람다를 사용하여 HTTP 보안을 구성할 수 있다.

이러한 유형의 구성은 스프링 시큐리티 문서 또는 샘플에서 확인할 수 있다. HTTP 보안의 람다 구성이 이전
구성 스타일과 어떻게 비교되는지 살펴보자.

```java
//Configuration using lambdas
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/blog/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(formLogin -> formLogin
                .loginPage("/login")
                .permitAll()
            )
            .rememberMe(Customizer.withDefaults());

        return http.build();
    }
}
```

```java
//Equivalent configuration without using lambdas
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests()
                .requestMatchers("/blog/**").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .rememberMe();

        return http.build();
    }
}
```

람다 DSL은 스프링 시큐리티을 구성하는 기본 방법이며, 람다 DSL을 사용해야 하는 스프링 시큐리티 7에서는
이전 구성 스타일을 사용할 수 없다. 이 작업은 주로 몇 가지 이유로 수행되었다:

- 이전 방식에서는 반환 유형이 무엇인지 알지 못한 상태에서 어떤 개체가 구성되는지 명확하지 않았다. 중첩이
  깊어질수록 더 혼란스러워졌다. 경험이 많은 사용자도 자신의 구성이 실제로는 다른 작업을 수행하고 있다고
  생각할 것이다.
- 일관성. 많은 코드 베이스가 두 스타일 사이에서 전환되어 구성을 이해하는 것을 어렵게 만들고 종종 잘못된
  구성으로 이어졌다.

# 람다 DSL 구성 팁

위의 두 표본을 비교할 때 몇 가지 주요 차이점이 있음을 알 수 있다:

람다 DSL에서는 `.and()` 방법을 사용하여 구성 옵션을 체인으로 연결할 필요가 없다. 람다 메서드를 호출한
후 추가 구성을 위해 `HttpSecurity` 인스턴스가 자동으로 반환된다.

`Customizer.withDefaults()`는 스프링 시큐리티에서 제공하는 기본값을 사용하여 보안 기능을
활성화한다. 람다식 `it → {}`의 바로 가기이다.

# WebFlux 보안

비슷한 방법으로 lambdas를 사용하여 WebFlux 보안을 구성할 수 있다. 다음은 람다를 사용한 구성의 예이다.

```java
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/blog/**").permitAll()
                .anyExchange().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .formLogin(formLogin -> formLogin
                .loginPage("/login")
            );

        return http.build();
    }

}
```

# 람다 DSL의 목표

람다 DSL은 다음과 같은 목표를 달성하기 위해 만들어졌다:

- 자동 들여쓰기를 사용하면 구성을 보다 쉽게 읽을 수 있다.
- 에서는 `.and()`를 사용하여 구성 옵션을 체인으로 연결할 필요가 없다.
- 스프링 시큐리티 DSL은 스프링 인테그레이션 및 스프링 클라우드 게이트웨이와 같은 다른 스프링
DSL과 유사한 구성 스타일을 가지고 있다.

# 6.0으로 마이그레이션 [#](https://docs.spring.io/spring-security/reference/migration/index.html)

스프링 시큐리티 팀은 스프링 시큐리티 6.0으로의 업그레이드를 간소화하기 위해 5.8 릴리스를 준비했다. 5.8
및 준비 단계를 사용하여 6.0으로의 업데이트를 단순화한다.

5.8로 업데이트한 후 이 안내서에 따라 나머지 마이그레이션 또는 정리 단계를 수행한다.

문제가 발생할 경우 준비 가이드에는 5.x 동작으로 되돌리기 위한 옵트아웃 단계가 포함되어 있다.

# 스프링 시큐리티 6.0 업데이트

첫 번째 단계는 사용자가 스프링 부트 3.0의 최신 패치 릴리스인지 확인하는 것이다. 그런 다음 스프링 시큐리티
6.0의 최신 패치 릴리스를 사용해야 한다. 스프링 시큐리티 6.0으로 업데이트하는 방법에 대한 자세한 내용은
참조 가이드의 Getting 스프링 시큐리티 섹션을 참조하자.

# 패키지 이름 업데이트

이제 업데이트되었으므로 `javax` 가져오기를 `jakarta` 가져오기로 변경해야 한다.

# 애플리케이션별 단계 수행

다음으로, 서블릿 애플리케이션인지 반응형 애플리케이션인지에 따라 수행해야 하는 단계가 있다.

# 서블릿 마이그레이션

서블릿 응용프로그램에 대한 초기 마이그레이션 단계를 이미 수행한 경우, 이제 서블릿 응용프로그램 관련 단계를
수행할 준비가 되었다.

