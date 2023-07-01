# 인증 [#](https://docs.spring.io/spring-security/reference/features/authentication/index.html)

스프링 시큐리티는 인증에 대한 포괄적인 지원을 제공한다. 인증은 특정 리소스에 액세스하려는 사용자의 신원을 확인하는 방법으로 사용자를 인증하는 일반적인 방법은 사용자에게 사용자 이름과 암호를 입력하도록 요구하는 것이다. 인증이 수행되면 ID를 알고 인증을 수행할 수 있다.

스프링 시큐리티는 사용자 인증을 위한 기본 지원 기능을 제공한다. 이 섹션에서는 서블릿 및 WebFlux 환경 모두에 적용되는 일반 인증 지원에 대해 설명한다. 각 스택에서 지원되는 항목에 대한 자세한 내용은 서블릿 및 WebFlux 인증 섹션을 참조하자.

# 암호 저장소 [#](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)

스프링 시큐리티의 `PasswordEncoder` 인터페이스는 암호를 단방향으로 변환하여 암호를 안전하게 저장하는 데 사용된다. `PasswordEncoder`는 단방향 변환이므로 암호 변환이 양방향(예: 데이터베이스 인증에 사용되는 자격 증명 저장)이어야 할 경우에는 유용하지 않다. 일반적으로 `PasswordEncoder`는 인증 시 사용자가 제공한 암호와 비교해야 하는 암호를 저장하는 데 사용된다.

# 암호 저장소 히스토리

수년에 걸쳐 암호를 저장하는 표준 메커니즘이 발전해 왔다. 처음에는 암호가 일반 텍스트로 저장되었다. 데이터 저장소에서 암호에 액세스하는 데 필요한 자격 증명에 암호를 저장했기 때문에 암호는 안전한 것으로 간주되었다. 그러나 악의적인 사용자는 SQL Injection과 같은 공격을 사용하여 사용자 이름과 암호의 대규모 "데이터 덤프"를 가져올 수 있는 방법을 찾을 수 있었다. 점점 더 많은 사용자 자격 증명이 공개됨에 따라 보안 전문가들은 사용자의 암호를 보호하기 위해 더 많은 작업이 필요하다는 것을 깨달았다.

개발자들은 SHA-256과 같은 단방향 해시를 통해 암호를 실행한 후 암호를 저장하도록 권장되었다. 사용자가 인증을 시도할 때 해시된 암호는 입력한 암호의 해시와 비교된다. 이는 시스템이 암호의 단방향 해시만 저장하면 된다는 것을 의미한다. 위반이 발생한 경우 암호의 단방향 해시만 노출되었다. 해시가 일방적이고 해시가 주어진 암호를 추측하는 것이 계산적으로 어려웠기 때문에 시스템의 각 암호를 파악하는 것은 가치가 없다. 이 새로운 시스템에 대응하기 위해, 악의적인 사용자들은 레인보우 테이블로 알려진 룩업 테이블을 만들기로 결정했다. 매번 비밀번호를 맞히는 작업을 하지 않고 비밀번호를 한 번 계산해 조회 테이블에 저장했다.

레인보우 테이블의 효율성을 줄이기 위해 개발자들에게 비밀번호를 변경하도록 권장했다. 해시 함수에 대한 입력으로 암호만 사용하는 대신 모든 사용자의 암호에 대해 임의 바이트(salt)가 생성된다. 임의 바이트와 사용자의 암호는 고유한 해시를 생성하기 위해 해시 함수를 통해 실행된다. 임의 바이트는 사용자의 암호와 함께 일반 텍스트로 저장된다. 그런 다음 사용자가 인증을 시도할 때 해시된 암호는 저장된 임의 바이트의 해시와 입력한 암호와 비교된다. 고유한 임의 바이트는 모든 임의 바이트와 비밀번호 조합에 대해 해시가 다르기 때문에 레인보우 테이블이 더 이상 효과적이지 않다는 것을 의미했다.

현대에는 SHA-256과 같은 암호화 해시가 더 이상 안전하지 않다는 것을 알게 되었다. 그 이유는 최신 하드웨어를 사용하면 초당 수십억 개의 해시 계산을 수행할 수 있기 때문이다. 즉, 각 암호를 개별적으로 쉽게 크래킹할 수 있다.

이제 개발자들은 적응형 단방향 기능을 활용하여 암호를 저장하는 것이 좋다. 적응형 단방향 기능을 사용한 암호 검증은 의도적으로 리소스 집약적이다(CPU, 메모리 또는 기타 리소스를 의도적으로 많이 사용함). 적응형 단방향 기능을 사용하면 하드웨어가 개선됨에 따라 증가할 수 있는 "작업 요소"를 구성할 수 있다. 시스템에서 암호를 확인하는 데 약 1초가 걸리도록 "워크 팩터"를 조정하는 것이 좋다. 이러한 절충은 공격자가 암호를 해독하는 것을 어렵게 만들지만, 시스템에 과도한 부담을 주거나 사용자를 짜증나게 할 정도로 비용이 많이 들지는 않는다. 스프링 시큐리티는 "워크팩터"를 위한 좋은 출발점을 제공하기 위해 노력했지만, 시스템마다 성능이 크게 다르기 때문에 사용자가 자신의 시스템에 맞게 "워크팩터"를 사용자 지정할 것을 권장한다. 사용해야 하는 적응형 단방향 함수의 예로는 bcrypt, PBKDF2, scrypt 및 아르곤2가 있다.

적응형 단방향 함수는 의도적으로 리소스를 많이 사용하므로 모든 요청에 대한 사용자 이름과 암호를 검증하면 응용 프로그램의 성능이 크게 저하될 수 있다. 스프링 시큐리티(또는 다른 라이브러리)에서는 암호 유효성 검사를 가속화할 수 없다. 유효성 검사 리소스를 많이 사용하면 보안이 확보되기 때문이다. 사용자는 장기 자격 증명(즉, 사용자 이름 및 암호)을 단기 자격 증명(예: 세션 및 OAuth Token 등)과 교환하는 것이 좋다. 단기 자격 증명은 보안 손실 없이 신속하게 확인할 수 있다.

# 암호 인코더 위임

스프링 시큐리티 5.0 이전 버전에서는 일반 텍스트 암호가 필요한 기본 `PasswordEncoder`이 `NoOpPasswordEncoder`였다. 암호 기록 섹션에 따르면 이제 기본 `PasswordEncoder`이 `BCryptPasswordEncoder`와 비슷할 것으로 예상할 수 있다. 그러나 이는 세 가지 실제 문제를 무시한다:

- 대부분의 응용 프로그램은 쉽게 변환할 수 없는 이전 암호 인코딩을 사용한다.
- 암호 저장에 대한 모범 사례가 다시 변경된다.
- 기본적으로 스프링 시큐리티는 자주 변경할 수 없다.

대신 스프링 시큐리티는 다음과 같은 방법으로 모든 문제를 해결하는 `DelegatingPasswordEncoder`를 도입했다:

- 현재 암호 저장 권장 사항을 사용하여 암호가 인코딩되었는지 확인
- 최신 및 기존 형식의 암호 유효성 검사 허용
- 향후 인코딩 업그레이드 허용

`PasswordEncoderFactories`를 사용하여 `DelegatingPasswordEncoder` 인스턴스를 쉽게 구성할 수 있다:

```java
PasswordEncoder passwordEncoder =
    PasswordEncoderFactories.createDelegatingPasswordEncoder();
```

또는 고유한 사용자 정의 인스턴스를 생성할 수 있다:

```java
String idForEncode = "bcrypt";
Map encoders = new HashMap<>();
encoders.put(idForEncode, new BCryptPasswordEncoder());
encoders.put("noop", NoOpPasswordEncoder.getInstance());
encoders.put("pbkdf2", Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_5());
encoders.put("pbkdf2@SpringSecurity_v5_8", Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8());
encoders.put("scrypt", SCryptPasswordEncoder.defaultsForSpringSecurity_v4_1());
encoders.put("scrypt@SpringSecurity_v5_8", SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8());
encoders.put("argon2", Argon2PasswordEncoder.defaultsForSpringSecurity_v5_2());
encoders.put("argon2@SpringSecurity_v5_8", Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8());
encoders.put("sha256", new StandardPasswordEncoder());

PasswordEncoder passwordEncoder =
    new DelegatingPasswordEncoder(idForEncode, encoders);
```

# 암호 저장소 형식

암호의 일반적인 형식은 다음과 같다:

```text
//DelegatingPasswordEncoder Storage Format

{id}encodedPassword
```

`id`는 사용할 `PasswordEncoder`를 검색하는 데 사용되는 식별자이며 `encodedPassword`는 선택한 `PasswordEncoder`의 원래 인코딩된 암호이다. `id`는 암호의 시작 부분, `{`로 시작하고 `}`로 끝나야 한다. `id`를 찾을 수 없는 경우 `id`는 null로 설정된다. 예를 들어, 다음은 다른 `id` 값을 사용하여 인코딩된 암호 목록일 수 있다. 원래 암호는 모두 `password`이다.

```text
//DelegatingPasswordEncoder Encoded Passwords Example

{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG  (1)
{noop}password  (2)
{pbkdf2}5d923b44a6d129f3ddf3e3c8d29412723dcbde72445e8ef6bf3b508fbf17fa4ed4d6b99ca763d8dc  (3)
{scrypt}$e0801$8bWJaSu2IKSn9Z9kM+TPXfOc/9bdYSrN1oD9qfVThWEwdRTnO7re7Ei+fUZRJ68k9lTyuTeUp4of4g24hHnazw==$OAOec05+bXxvuu/1qZ6NUR+xQYvYv7BeL1QxwRpY5Pc=  (4)
{sha256}97cde38028ad898ebc02e690819fa220e88c62e0699403e94fff291cfffaf8410849f27605abcbc0  (5)
```

1) 첫 번째 암호의 `PasswordEncoder id`는 `bcrypt`이고 `encodedPassword` 값은 `$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG`이다. 일치하는 경우 `BCryptPasswordEncoder`에 위임한다.
2) 두 번째 암호의 `PasswordEncoder id`는 `noop`이고, `encodedPassword` 값은 `password`이다. 일치하는 경우 `NoOpPasswordEncoder`에 위임한다.
3) 세 번째 암호의 `PasswordEncoder id`는 `pbkdf2`이고 `encodedPassword` 값은 `5d923b44a6d129f3ddf3e3c8d29412723dcbde72445e8ef6bf3b508fbf17fa4ed4d6b99ca763d8dc`이다. 일치하는 경우 `Pbkdf2PasswordEncoder`에 위임한다.
4) 네 번째 암호의 `PasswordEncoder id`는 `scrypt`이고 `encodedPassword` 값은 `$e0801$8bWJaSu2IKSn9Z9kM+TPXfOc/9bdYSrN1oD9qfVThWEwdRTnO7re7Ei+fUZRJ68k9lTyuTeUp4of4g24hHnazw==$OAOec05+bXxvuu/1qZ6NUR+xQYvYv7BeL1QxwRpY5Pc=`이다. 일치하는 경우 `SCryptPasswordEncoder`에 위임한다.
5) 최종 암호의 `PasswordEncoder id`는 `sha256`이고 `encodedPassword` 값은 `97cde38028ad898ebc02e690819fa220e88c62e0699403e94fff291cfffaf8410849f27605abcbc0`이다. 일치하는 경우 `StandardPasswordEncoder`에 위임한다.

> 일부 사용자는 잠재적인 해커를 위해 저장소 형식이 제공되는 것을 우려할 수 있다. 암호의 저장은 알고리즘이 암호인지 여부에 의존하지 않기 때문에 이는 문제가 되지 않는다. 또한 대부분의 형식은 공격자가 접두사 없이 쉽게 파악할 수 있다. 예를 들어 `BCrypt` 암호는 종종 `$2a$`로 시작한다.

# 암호 인코딩

생성자에게 전달된 `idForEncode`는 암호화에 사용되는 `PasswordEncoder`를 결정한다. 앞에서 구성한 `DelegatingPasswordEncoder`에서는 암호 인코딩 결과가 `BCryptPasswordEncoder`에 위임되고 `{bcrypt}`로 접두사가 붙는다. 최종 결과는 다음과 같다:

```text
//DelegatingPasswordEncoder Encode Example

{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
```

# 암호 일치

일치는 `{id}` 및 생성자에서 제공하는 `id`에 대한 `PasswordEncoder`의 매핑을 기반으로 한다. 암호 저장소 형식의 예제는 이 작업을 수행하는 방법에 대한 작업 예제를 제공한다. 기본적으로 암호와 매핑되지 않은 `id`(null ID 포함)를 사용하여 `matches(CharSequence, String)`를 호출하면 `IllegalArgumentException`가 발생한다. 이 동작은 `DelegatingPasswordEncoder.setDefaultPasswordEncoderForMatches(PasswordEncoder)`를 사용하여 사용자 지정할 수 있다.

`id`를 사용하여 임의의 암호 인코딩과 일치 시킬 수 있지만, 최신 암호 인코딩을 사용하여 암호를 인코딩할 수도 있다. 이 점은 암호화와 달리 암호 해시는 일반 텍스트를 복구하는 간단한 방법이 없도록 설계되었기 때문에 중요하다. 일반 텍스트를 복구할 방법이 없으므로 암호를 변환하기가 어렵다. 사용자가 `NoOpPasswordEncoder`를 변환하는 것은 간단하지만, 기본적으로 포함하기로 선택하여 사용자 환경을 간소화했다.

# 시작해보기

데모나 샘플을 작성하는 경우 사용자의 암호를 해시하는 데 시간을 들이는 것이 다소 번거롭다. 이를 더 쉽게 하기 위한 편의 장치가 있지만, 여전히 생산을 위한 것은 아니다.

```java
//withDefaultPasswordEncoder Example

UserDetails user = User.withDefaultPasswordEncoder()
  .username("user")
  .password("password")
  .roles("user")
  .build();
System.out.println(user.getPassword());
// {bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
```

여러 사용자를 작성하는 경우 builder를 다시 사용할 수도 있다:

```java
//withDefaultPasswordEncoder Reusing the Builder

UserBuilder users = User.withDefaultPasswordEncoder();
UserDetails user = users
  .username("user")
  .password("password")
  .roles("USER")
  .build();
UserDetails admin = users
  .username("admin")
  .password("password")
  .roles("USER","ADMIN")
  .build();
```

이렇게 하면 저장된 암호가 해시되지만 암호는 여전히 메모리와 컴파일된 소스 코드에 노출된다. 따라서 프로덕션 환경에서는 여전히 안전하지 않은 것으로 간주된다. 프로덕션의 경우 암호를 외부에서 해시해야 한다.

# 스프링 부트 CLI로 인코딩

암호를 올바르게 인코딩하는 가장 쉬운 방법은 [스프링 부트 CLI](https://docs.spring.io/spring-boot/docs/current/reference/html/cli.html)를 사용하는 것이다.

예를 들어 다음 예제에서는 `DelegatingPasswordEncoder`에서 사용할 암호의 `password`를 인코딩한다:

```
//Spring Boot CLI encodepassword Example

spring encodepassword password
{bcrypt}$2a$10$X5wFBtLrL/kHcmrOGGTrGufsBX8CJ0WpQpF3pgeuxBB/H73BK1DW6
```

# 문제 해결

암호 저장소 형식에 설명된 대로 저장된 암호 중 하나에 `id`가 없으면 다음 오류가 발생한다.

```
java.lang.IllegalArgumentException: There is no PasswordEncoder mapped for the id "null"
	at org.springframework.security.crypto.password.DelegatingPasswordEncoder$UnmappedIdPasswordEncoder.matches(DelegatingPasswordEncoder.java:233)
	at org.springframework.security.crypto.password.DelegatingPasswordEncoder.matches(DelegatingPasswordEncoder.java:196)
```

이 문제를 해결하는 가장 쉬운 방법은 암호가 현재 어떻게 저장되어 있는지 파악하고 정확한 `PasswordEncoder`를 명시적으로 제공하는 것이다.

스프링 시큐리티 4.2.x에서 변환하는 경우 `NoOpPasswordEncoder` 빈을 노출하여 이전 동작으로 되돌릴 수 있다.

또는 모든 암호 앞에 올바른 `id`를 붙여 `DelegatingPasswordEncoder`를 계속 사용할 수 있다. 예를 들어 `BCrypt`를 사용하는 경우 다음과 같은 위치에서 암호를 변환할 수 있다:

```
$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
```

에서

```
{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
```

매핑의 전체 목록은 Javadoc의 [`PasswordEncoderFactories`](https://docs.spring.io/spring-security/site/docs/5.0.x/api/org/springframework/security/crypto/factory/PasswordEncoderFactories.html)를 참조하자.

# BCryptPasswordEncoder

`BCryptPasswordEncoder` 구현에서는 널리 지원되는 [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt) 알고리즘을 사용하여 암호를 해시한다. 암호 크래킹에 대한 저항력을 높이기 위해 `bcrypt` 속도가 의도적으로 느리다. 다른 적응형 단방향 기능과 마찬가지로 시스템에서 암호를 확인하는 데 약 1초가 걸리도록 조정해야 한다. `BCryptPasswordEncoder`의 기본 구현에서는 [`BCryptPasswordEncoder`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html)의 Javadoc에 언급된 강도 10을 사용한다. 암호를 확인하는 데 약 1초가 걸리도록 자체 시스템에서 강도 매개 변수를 조정하고 테스트하는 것이 좋다.

```java
// Create an encoder with strength 16
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
String result = encoder.encode("myPassword");
assertTrue(encoder.matches("myPassword", result));
```

# Argon2PasswordEncoder

`Argon2PasswordEncoder` 구현에서는 [`Argon2`](https://en.wikipedia.org/wiki/Argon2) 알고리즘을 사용하여 암호를 해시한다. `Argon2`는 암호 해싱 대회의 우승자이다. 사용자 지정 하드웨어에서 암호 크래킹을 방지하기 위해 `Argon2`는 대용량 메모리가 필요한 의도적으로 느린 알고리즘이다. 다른 적응형 단방향 기능과 마찬가지로 시스템에서 암호를 확인하는 데 약 1초가 걸리도록 조정해야 한다. 현재 `Argon2PasswordEncoder`를 구현하려면 `BouncyCastle`가 필요하다.

```java
// Create an encoder with all the defaults
Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
String result = encoder.encode("myPassword");
assertTrue(encoder.matches("myPassword", result));
```

# Pbkdf2PasswordEncoder

`Pbkdf2PasswordEncoder` 구현에서는 [`PBKDF2`](https://en.wikipedia.org/wiki/PBKDF2) 알고리즘을 사용하여 암호를 해시한다. 암호 크래킹을 방지하기 위한 `PBKDF2`는 의도적으로 느린 알고리즘이다. 다른 적응형 단방향 기능과 마찬가지로 시스템에서 암호를 확인하는 데 약 1초가 걸리도록 조정해야 한다. 이 알고리즘은 `FIPS` 인증이 필요한 경우에 적합하다.

```java
// Create an encoder with all the defaults
Pbkdf2PasswordEncoder encoder = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();
String result = encoder.encode("myPassword");
assertTrue(encoder.matches("myPassword", result));
```

# SCryptPasswordEncoder

`SCryptPasswordEncoder` 구현에서는 [`scrypt`](https://en.wikipedia.org/wiki/Scrypt) 알고리즘을 사용하여 암호를 해시한다. 사용자 지정 하드웨어의 암호 크래킹을 방지하기 위해 `scrypt`는 대용량 메모리가 필요한 의도적으로 느린 알고리즘이다. 다른 적응형 단방향 기능과 마찬가지로 시스템에서 암호를 확인하는 데 약 1초가 걸리도록 조정해야 한다.

```java
// Create an encoder with all the defaults
SCryptPasswordEncoder encoder = SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8();
String result = encoder.encode("myPassword");
assertTrue(encoder.matches("myPassword", result));
```

# 기타 PasswordEncoders

이전 버전과의 호환성을 위해 존재하는 다른 많은 `PasswordEncoder` 구현이 있다. 이들은 모두 더 이상 안전하지 않은 것으로 간주하기 위해 사용되지 않는다. 그러나 기존 레거시 시스템을 변환하는 것이 어렵기 때문에 제거할 계획은 없다.

# 암호 저장소 구성

스프링 시큐리티는 기본적으로 `DelegatingPasswordEncoder`를 사용한다. 그러나 `PasswordEncoder`를 스프링 빈으로 노출하여 사용자 정의할 수 있다.

스프링 시큐리티 4.2.x에서 변환하는 경우 `NoOpPasswordEncoder` 빈을 노출하여 이전 동작으로 되돌릴 수 있다.

> `NoOpPasswordEncoder`로 되돌리는 것은 안전하지 않은 것으로 간주된다. 대신 `DelegatingPasswordEncoder`를 사용하여 보안 암호 인코딩을 지원하는 것으로 변환해야 한다.

### java

```java
//NoOpPasswordEncoder

@Bean
public static NoOpPasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();
}
```

### xml

```
<b:bean id="passwordEncoder"
        class="org.springframework.security.crypto.password.NoOpPasswordEncoder" factory-method="getInstance"/>
```

> XML 구성을 사용하려면 `NoOpPasswordEncoder` been 이름이 `passwordEncoder`이어야 한다.

# 암호 구성 변경

사용자가 암호를 지정할 수 있는 대부분의 응용 프로그램에는 암호를 업데이트하는 기능도 필요하다.

[Well-known URL for Changing Passwords](https://w3c.github.io/webappsec-change-password-url/)는 암호 관리자가 지정된 응용 프로그램의 암호 업데이트 끝점을 검색할 수 있는 메커니즘을 나타낸다.

이 검색 끝점을 제공하도록 스프링 시큐리티를 구성할 수 있다. 예를 들어 응용 프로그램의 암호 변경 끝점이 `/change-password`인 경우 다음과 같이 스프링 시큐리티를 구성할 수 있다:

### java

```java
http
    .passwordManagement(Customizer.withDefaults())
```

### xml

```
<sec:password-management/>
```

그런 다음 암호 관리자가 `/.well-known/change-password`로 이동하면 스프링 시큐리티가 엔드포인트인 `/change-password`로 리디렉션한다.

또는 엔드포인트가 `/change-password`가 아닌 경우 다음과 같이 지정할 수도 있다:

### java

```java
http
    .passwordManagement((management) -> management
        .changePasswordPage("/update-password")
    )
```

### xml

```
<sec:password-management change-password-page="/update-password"/>
```

위의 구성을 사용하여 암호 관리자가 `/.well-known/change-password`로 이동하면 스프링 시큐리티가 `/update-password`로 리디렉션된다.