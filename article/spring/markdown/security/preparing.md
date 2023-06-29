# 7.0 준비 [#](https://docs.spring.io/spring-security/reference/migration-7/index.html)

Spring Security 7.0은 아직 출시일이 없지만 지금부터 준비를 시작하는 것이 중요하다.

이 준비 가이드는 Spring Security 7.0의 가장 큰 변경 사항을 요약하고 이를 준비하기 위한 단계를
제공하기 위해 설계되었다.

응용 프로그램을 최신 Spring Security 6 및 Spring Boot 3 릴리스로 최신 상태로 유지하는 것이
중요하다.

## 구성 마이그레이션 [#](https://docs.spring.io/spring-security/reference/migration-7/configuration.html)

다음 단계는 `HttpSecurity`, `WebSecurity` 및 관련 구성 요소를 구성하는 방법에 대한 변경과
관련되어 있다.

## 람다 DSL 사용

람다 DSL은 버전 5.2부터 Spring Security에 있으며, 람다를 사용하여 HTTP 보안을 구성할 수 있다.

이러한 유형의 구성은 Spring Security 문서 또는 샘플에서 확인할 수 있다. HTTP 보안의 람다 구성이
이전 구성 스타일과 어떻게 비교되는지 살펴보자.

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

람다 DSL은 Spring Security을 구성하는 기본 방법이며, 람다 DSL을 사용해야 하는 Spring Security
7에서는 이전 구성 스타일을 사용할 수 없다. 이 작업은 주로 몇 가지 이유로 수행되었다:

- 이전 방식에서는 반환 유형이 무엇인지 알지 못한 상태에서 어떤 개체가 구성되는지 명확하지 않았다. 중첩이
깊어질수록 더 혼란스러워졌다. 경험이 많은 사용자도 자신의 구성이 실제로는 다른 작업을 수행하고 있다고
생각할 것이다.
- 일관성. 많은 코드 베이스가 두 스타일 사이에서 전환되어 구성을 이해하는 것을 어렵게 만들고 종종 잘못된
구성으로 이어졌다.

## 람다 DSL 구성 팁

위의 두 표본을 비교할 때 몇 가지 주요 차이점이 있음을 알 수 있다:

람다 DSL에서는 `.and()` 방법을 사용하여 구성 옵션을 체인으로 연결할 필요가 없다. 람다 메서드를 호출한
후 추가 구성을 위해 `HttpSecurity` 인스턴스가 자동으로 반환된다.

`Customizer.withDefaults()`는 Spring Security에서 제공하는 기본값을 사용하여 보안 기능을
활성화한다. 람다 식 `it → {}`의 바로 가기이다.

## WebFlux 보안

비슷한 방법으로 lambdas를 사용하여 WebFlux 보안을 구성할 수도 마찬가지다. 다음은 람다를 사용한 구성의
예이다.

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

## 람다 DSL의 목표

람다 DSL은 다음과 같은 목표를 달성하기 위해 만들어졌다:

- 자동 들여쓰기를 사용하면 구성을 보다 쉽게 읽을 수 있다.
- 에서는 `.and()`를 사용하여 구성 옵션을 체인으로 연결할 필요가 없다.
- Spring Security DSL은 Spring Integration 및 Spring Cloud Gateway와 같은 다른
Spring DSL과 유사한 구성 스타일을 가지고 있다.