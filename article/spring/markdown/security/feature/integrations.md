# Integrations [#](https://docs.spring.io/spring-security/reference/features/integrations/index.html)

스프링 시큐리티는 다양한 프레임워크 및 API와의 통합을 제공한다. 이 섹션에서는 Servlet 또는 Reactive
환경에만 국한되지 않는 일반적인 통합에 대해 설명한다. 특정 통합을 보려면 서블릿 및 반응형 통합 섹션을
참조하자.

# 스프링 시큐리티 Crypto Module [#](https://docs.spring.io/spring-security/reference/features/integrations/cryptography.html)

스프링 시큐리티 Crypto 모듈은 대칭 암호화, 키 생성 및 암호 인코딩을 지원한다. 코드는 코어 모듈의 일부로
배포되지만 다른 스프링 시큐리티(또는 스프링) 코드에 종속되지 않는다.

# Encryptors

`Encryptors` 클래스는 대칭 암호화를 구성하기 위한 초기 방법을 제공한다. 이 클래스를 사용하여 원시
`byte[]` 형식으로 데이터를 암호화하는 `BytesEncryptor` 인스턴스를 생성할 수 있다.
[`TextEncryptor`](https://docs.spring.io/spring-security/site/docs/6.1.1/api/org/springframework/security/crypto/encrypt/TextEncryptor.html)
인스턴스를 구성하여 텍스트 문자열을 암호화할 수도 있다. `Encryptors`는 스레드 세이프이다.

> `BytesEncryptor`와 `TextEncryptor`는 모두 인터페이스이다. `BytesEncryptor`에는 여러
> 구현이 있다.

# BytesEncryptor

`Encryptors.stronger` 팩토리 메서드를 사용하여 `BytesEncryptor`를 구성할 수 있다:

```java
Encryptors.stronger("password", "salt");
```

`stronger` 암호화 방법은 GCM(Galois Counter Mode)과 함께 256비트 AES 암호화를 사용하여
암호화기를 생성한다. PKCS #5의 PBKDF2(Password-Based Key Derivation Function #2)를
이용하여 비밀키를 도출한다. 이 방법을 사용하려면 Java 6이 필요하다. `SecretKey`를 생성하는 데
사용되는 암호는 안전한 장소에 보관해야 하며 공유해서는 안 된다. 이 임의 데이터는 암호화된 데이터가 손상된
경우 키에 대한 사전 공격을 방지하는 데 사용된다. 암호화된 각 메시지가 고유하도록 16바이트 랜덤 초기화
벡터도 적용된다.

제공된 임의 데이터(salt)는 16진수로 인코딩된 문자열 형식이어야 하며 임의의 형식이어야 하며 길이는 8바이트
이상이어야 한다. `KeyGenerator`를 사용하여 이러한 임의 데이터를 생성할 수 있다:

```java
String salt = KeyGenerators.string().generateKey(); // generates a random 8-byte salt that is then hex-encoded
```

CBC(암호 블록 체인) 모드에서 256비트 AES인 `standard` 암호화 방법도 사용할 수 있다. 이 모드는
인증되지 않으며 데이터의 신뢰성을 보장하지 않는다. 보다 안전한 대안으로 `Encryptors.stronger`를
사용한다.

# TextEncryptor

`Encryptors.text` 팩토리 메서드를 사용하여 표준 `TextEncryptor`를 구성할 수 있다:

```java
Encryptors.text("password", "salt");
```

`TextEncryptor`는 표준 `BytesEncryptor`를 사용하여 텍스트 데이터를 암호화한다. 암호화된 결과는
파일 시스템 또는 데이터베이스에 쉽게 저장할 수 있도록 16진수로 인코딩된 문자열로 반환된다.

# Key Generators

`KeyGenerators` 클래스는 다양한 유형의 키 생성기를 구성하기 위한 다양한 편의 시설 방법을 제공한다. 이
클래스를 사용하여 `BytesKeyGenerator` 키를 생성하는 `byte[]`를 만들 수 있다.
`StringKeyGenerator`를 구성하여 문자열 키를 생성할 수도 있다. `KeyGenerators`은(는) 스레드
세이프 클래스이다.

# BytesKeyGenerator

`KeyGenerators.secureRandom` 반환 시 방법을 사용하여 `SecureRandom` 인스턴스에서 지원하는
`BytesKeyGenerator`를 생성할 수 있습니다:

```java
BytesKeyGenerator generator = KeyGenerators.secureRandom();
byte[] key = generator.generateKey();
```

기본 키 길이는 8바이트이다. `KeyGenerators.secureRandom` 변형 모델은 키 길이를 제어한다:

```java
KeyGenerators.secureRandom(16);
```

`KeyGenerators.shared` 반환 시 방법을 사용하여 호출할 때마다 항상 동일한 키를 반환하는
`BytesKeyGenerator`를 구성한다:

```java
KeyGenerators.shared(16);
```

# StringKeyGenerator

`KeyGenerators.string` 반환 시 방법을 사용하여 각 키를 `String`으로 16진수 인코딩하는 8바이트
`SecureRandom` `KeyGenerator`를 구성할 수 있다:

```java
KeyGenerators.string();
```

# 암호 인코딩

`spring-security-crypto` 모듈의 암호 패키지는 암호 인코딩을 지원한다. `PasswordEncoder`는
중앙 서비스 인터페이스이며 다음과 같은 서명이 있다:

```java
public interface PasswordEncoder {
	String encode(CharSequence rawPassword);

	boolean matches(CharSequence rawPassword, String encodedPassword);

	default boolean upgradeEncoding(String encodedPassword) {
		return false;
	}
}
```

`matches` 메서드는 일단 인코딩된 `rawPassword`가 `encodedPassword`와 같으면 `true`를
반환한다. 이 방법은 암호 기반 인증 체계를 지원하도록 설계되었다.

`BCryptPasswordEncoder` 구현에서는 널리 지원되는 "bcrypt" 알고리즘을 사용하여 암호를 해시한다.
`Bcrypt`는 임의의 16바이트 임의 데이터 값을 사용하며 암호 크래커를 방지하기 위해 의도적으로 느린
알고리즘이다. 4에서 31 사이의 값을 갖는 `strength` 매개 변수를 사용하여 작업량을 조정할 수 있다.
값이 높을수록 해시를 계산하기 위해 더 많은 작업을 수행해야 한다. 기본값은 10이다. 이 값은 인코딩된
해시에도 저장되므로 기존 암호에 영향을 주지 않고 배포된 시스템에서 이 값을 변경할 수 있다. 다음 예제에서는
`BCryptPasswordEncoder`를 사용한다:

```java
// Create an encoder with strength 16
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
String result = encoder.encode("myPassword");
assertTrue(encoder.matches("myPassword", result));
```

`Pbkdf2PasswordEncoder` 구현에서는 PBKDF2 알고리즘을 사용하여 암호를 해시한다. 암호 크래킹을
방지하기 위해 PBKDF2는 의도적으로 느린 알고리즘이므로 시스템에서 암호를 확인하는 데 약 0.5초가 걸리도록
조정해야 한다. 다음 시스템은 `Pbkdf2PasswordEncoder`를 사용한다:

```java
// Create an encoder with all the defaults
Pbkdf2PasswordEncoder encoder = Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();
String result = encoder.encode("myPassword");
assertTrue(encoder.matches("myPassword", result));
```

# 스프링 데이터 통합 [#](https://docs.spring.io/spring-security/reference/features/integrations/data.html)

스프링 시큐리티는 쿼리 내에서 현재 사용자를 참조할 수 있는 스프링 데이터 통합 기능을 제공한다. 나중에
결과를 필터링하면 크기가 조정되지 않으므로 페이지 결과를 지원하기 위해 쿼리에 사용자를 포함시키는 것이
유용할 뿐만 아니라 필요하다.

# 스프링 데이터 및 스프링 시큐리티 구성

이 지원을 사용하려면 `org.springframework.security:spring-security-data` 종속성을
추가하고 `SecurityEvaluationContextExtension` 유형의 빈을 제공해야 한다. Java 구성에서 이는
다음과 같다:

```java
@Bean
public SecurityEvaluationContextExtension securityEvaluationContextExtension() {
	return new SecurityEvaluationContextExtension();
}
```

XML 구성에서 이는 다음과 같다:

```xml
<bean class="org.springframework.security.data.repository.query.SecurityEvaluationContextExtension"/>
```

# @Query 내의 보안 식

이제 쿼리 내에서 스프링 시큐리티를 사용할 수 있다. 예:

```java
@Repository
public interface MessageRepository extends PagingAndSortingRepository<Message,Long> {
	@Query("select m from Message m where m.to.id = ?#{ principal?.id }")
	Page<Message> findInbox(Pageable pageable);
}
```

이는 `Authentication.getPrincipal().getId()`가 `Message`의 수신자와 동일한지 확인한다.
이 예에서는 주체를 ID 속성을 가진 개체로 사용자 지정했다고 가정한다.
`SecurityEvaluationContextExtension` 빈을 노출하면 쿼리 내에서 모든 [공통 보안 식](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html#authorization-expressions)을
사용할 수 있다.

# 동시성 지원 [#](https://docs.spring.io/spring-security/reference/features/integrations/concurrency.html)

대부분의 환경에서 보안은 `Thread` 단위로 저장된다. 이것은 새로운 `Thread`에서 작업이 완료되면
`SecurityContext`가 손실된다는 것을 의미한다. 스프링 시큐리티는 사용자가 이를 훨씬 쉽게 할 수
있도록 몇 가지 인프라를 제공한다. 스프링 시큐리티는 멀티 스레드 환경에서 스프링 시큐리티와 함께 작업하기
위한 낮은 수준의 추상화를 제공한다. 실제로 스프링 시큐리티는 [`AsyncContext.start(Runnable)`](https://docs.spring.io/spring-security/reference/servlet/integrations/servlet-api.html#servletapi-start-runnable)
및 [`SpringMVC Async Integration`](https://docs.spring.io/spring-security/reference/servlet/integrations/mvc.html#mvc-async)과의
통합을 기반으로 한다.

# DelegatingSecurityContextRunnable

스프링 시큐리티의 동시성 지원에서 가장 기본적인 구성 요소 중 하나는
`DelegatingSecurityContextRunnable`이다. 대표로 지정된 `SecurityContext`로
`SecurityContextHolder`를 초기화하기 위해 대표 `Runnable`을 래핑한다. 그런 다음 나중에
`SecurityContextHolder`를 삭제할 수 있도록 대표 `Runnable`을 호출한다.
`DelegatingSecurityContextRunnable`은 다음과 같다:

```java
public void run() {
try {
	SecurityContextHolder.setContext(securityContext);
	delegate.run();
} finally {
	SecurityContextHolder.clearContext();
}
}
```

매우 간단하지만 한 스레드에서 다른 스레드로 `SecurityContext`를 원활하게 전송할 수 있다. 대부분의
경우 `SecurityContextHolder`는 스레드 단위로 작동하기 때문에 이것이 중요하다. 예를 들어 스프링
시큐리티의 `<global-method-security>` 지원을 사용하여 서비스 중 하나를 보호했을 수 있다. 이제
현재 `Thread`의 `SecurityContext`를 보안 서비스를 호출하는 `Thread`로 쉽게 전송할 수 있다.
이 작업을 수행하는 방법의 예는 다음과 같다:

```java
Runnable originalRunnable = new Runnable() {
public void run() {
	// invoke secured service
}
};

SecurityContext context = SecurityContextHolder.getContext();
DelegatingSecurityContextRunnable wrappedRunnable =
	new DelegatingSecurityContextRunnable(originalRunnable, context);

new Thread(wrappedRunnable).start();
```

위의 코드는 다음 단계를 수행한다:

- 보안 서비스를 호출할 `Runnable`를 만든다. 스프링 시큐리티를 인식하지 못한다.
- `SecurityContextHolder`에서 사용할 `SecurityContext`를 가져오고
`DelegatingSecurityContextRunnable`을 초기화한다.
- `DelegatingSecurityContextRunnable`를 사용하여 스레드를 생성한다.
- 만든 스레드 시작한다.

`SecurityContextHolder`에서 `SecurityContext`를 사용하여
`DelegatingSecurityContextRunnable`를 작성하는 것은 매우 일반적이기 때문에 이를 위한 바로
가기 생성자가 있다. 다음 코드는 위의 코드와 동일하다:

```java
Runnable originalRunnable = new Runnable() {
public void run() {
	// invoke secured service
}
};

DelegatingSecurityContextRunnable wrappedRunnable =
	new DelegatingSecurityContextRunnable(originalRunnable);

new Thread(wrappedRunnable).start();
```

우리가 가지고 있는 코드는 사용하기 쉽지만, 여전히 스프링 시큐리티를 사용하고 있다는 것을 알아야 한다. 다음
섹션에서는 스프링 시큐리티를 사용한다는 사실을 숨기기 위해 `DelegatingSecurityContextExecutor`를
활용하는 방법에 대해 살펴보자.

# DelegatingSecurityContextExecutor

이전 섹션에서는 `DelegatingSecurityContextRunnable`를 사용하기 쉽다는 것을 알았지만, 사용하기
위해서는 스프링 시큐리티에 대해 알고 있어야 했기 때문에 이상적이지 않다. 이제
`DelegatingSecurityContextExecutor`가 스프링 시큐리티를 사용하고 있다는 사실을 알지 못하도록
코드를 보호하는 방법에 대해 살펴본다.

`DelegatingSecurityContextExecutor` 설계는 위임 `Runnable` 대신 위임 `Executor`을
수락한다는 점을 제외하면 `DelegatingSecurityContextRunnable` 설계와 매우 유사하다. 아래에서
사용 방법의 예를 볼 수 있다:

```java
SecurityContext context = SecurityContextHolder.createEmptyContext();
Authentication authentication =
	UsernamePasswordAuthenticationToken.authenticated("user","doesnotmatter", AuthorityUtils.createAuthorityList("ROLE_USER"));
context.setAuthentication(authentication);

SimpleAsyncTaskExecutor delegateExecutor =
	new SimpleAsyncTaskExecutor();
DelegatingSecurityContextExecutor executor =
	new DelegatingSecurityContextExecutor(delegateExecutor, context);

Runnable originalRunnable = new Runnable() {
public void run() {
	// invoke secured service
}
};

executor.execute(originalRunnable);
```

코드는 다음 단계를 수행한다:

- `DelegatingSecurityContextExecutor`에 사용할 `SecurityContext`를 만든다. 이 예에서는
`SecurityContext`를 손으로 작성하기만 하면 된다. 그러나 `SecurityContext`를 어디서 어떻게
얻는지는 중요하지 않다(즉, 원한다면 `SecurityContextHolder`에서 얻을 수 있다).

- 제출된 `Runnables` 실행을 담당하는 `delegateExecutor`를 만든다.

- 마지막으로, 우리는 실행 방법으로 전달되는 모든 실행 테이블을
`DelegatingSecurityContextRunnable`로 래핑하는 것을 담당하는
`DelegatingSecurityContextExecutor`를 만든다. 그런 다음 래핑된 `Runnable`을
`delegateExecutor`에 전달한다. 이 경우, `DelegatingSecurityContextExecutor`에 제출된
모든 `Runnable`에 대해 동일한 `SecurityContext`가 사용된다. 권한이 높은 사용자가 실행해야 하는
백그라운드 작업을 실행하는 경우 유용하다.

- 이 시점에서 여러분은 스스로에게 "어떻게 이것이 스프링 시큐리티에 대한 지식으로부터 내 코드를 보호합니까?"
라고 물을 수도 있다. `SecurityContext`와 `DelegatingSecurityContextExecutor`를 자체
코드로 만드는 대신 이미 초기화된 `DelegatingSecurityContextExecutor` 인스턴스를 주입할 수
있다.

```java
@Autowired
private Executor executor; // becomes an instance of our DelegatingSecurityContextExecutor

public void submitRunnable() {
Runnable originalRunnable = new Runnable() {
	public void run() {
	// invoke secured service
	}
};
executor.execute(originalRunnable);
}
```

이제 코드는 `SecurityContext`가 `Thread`로 전파되는 것을 인식하지 못하고 `originalRunnable`이
실행된 다음 `SecurityContextHolder`가 삭제된다. 이 예에서는 각 스레드를 실행하는 데 동일한
사용자가 사용되고 있다. `originalRunnable`를 실행할 때 `SecurityContextHolder`의 사용자(즉,
현재 로그한 사용자)를 사용하여 `executor.execute(Runnable)`를 처리하려면 어떻게 해야 할까? 이
작업은 `DelegatingSecurityContextExecutor` 생성자에서 `SecurityContext` 인수를 제거하여
수행할 수 있다. 예:

```java
SimpleAsyncTaskExecutor delegateExecutor = new SimpleAsyncTaskExecutor();
DelegatingSecurityContextExecutor executor =
	new DelegatingSecurityContextExecutor(delegateExecutor);
```

이제 `executor.execute(Runnable)`이 실행될 때마다 `SecurityContext`가 먼저
`SecurityContextHolder`에서 얻은 다음 해당 `SecurityContext`를 사용하여
`DelegatingSecurityContextRunnable`를 만든다. 즉, `executor.execute(Runnable)`
코드를 호출하는 데 사용된 사용자와 동일한 사용자로 `Runnable`를 실행하고 있다.

# 스프링 시큐리티 동시성 클래스

Java 동시 API 및 스프링 Task 추상화와의 추가 통합은 Java 문서를 참조하자. 이전 코드를 이해하면
이들은 상당히 자명하다.

- `DelegatingSecurityContextCallable`
- `DelegatingSecurityContextExecutor`
- `DelegatingSecurityContextExecutorService`
- `DelegatingSecurityContextRunnable`
- `DelegatingSecurityContextScheduledExecutorService`
- `DelegatingSecurityContextSchedulingTaskExecutor`
- `DelegatingSecurityContextAsyncTaskExecutor`
- `DelegatingSecurityContextTaskExecutor`
- `DelegatingSecurityContextTaskScheduler`

# Jackson 지원

스프링 시큐리티는 Jackson이 스프링 시큐리티 관련 클래스를 지속할 수 있도록 지원한다. 이렇게 하면 분산
세션(예: 세션 복제, 스프링 세션 등)으로 작업할 때 스프링 시큐리티 관련 클래스를 직렬화하는 성능이 향상될
수 있다.

이를 사용하려면 `ObjectMapper`를 `SecurityJackson2Modules.getModules(ClassLoader)`에
등록해야 한다([syslog-incind](https://github.com/FasterXML/jackson-databind)):

```java
ObjectMapper mapper = new ObjectMapper();
ClassLoader loader = getClass().getClassLoader();
List<Module> modules = SecurityJackson2Modules.getModules(loader);
mapper.registerModules(modules);

// ... use ObjectMapper as normally ...
SecurityContext context = new SecurityContextImpl();
// ...
String json = mapper.writeValueAsString(context);
```

> 다음 스프링 시큐리티 모듈은 Jackson을 지원한다:
>
> - spring-security-core `(CoreJackson2Module)`
> - spring-security-web `(WebJackson2Module, WebServletJackson2Module, WebServerJackson2Module)`
> - [spring-security-oauth2-client](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/index.html#oauth2client) `(OAuth2ClientJackson2Module)`
> - spring-security-cas `(CasJackson2Module)`

# 현지화

다른 로케일을 지원해야 하는 경우 이 섹션에 필요한 모든 내용이 나와 있다.

인증 실패 및 액세스 거부(인증 실패)와 관련된 메시지를 포함하여 모든 예외 메시지를 현지화할 수 있다.
개발자 또는 시스템 배포자에 초점을 맞춘 예외 및 로깅 메시지(잘못된 특성, 인터페이스 계약 위반, 잘못된
생성자 사용, 시작 시간 유효성 검사, 디버그 수준 로깅 포함)는 현지화되지 않고 스프링 시큐리티의 코드
내에서 영어로 하드 코딩된다.

`spring-security-core-xx.jar`에서 배송되는 `org.springframework.security` 패키지에는
`messages.properties` 파일과 일부 공통 언어용 현지화된 버전이 포함되어 있다. 스프링 시큐리티
클래스는 스프링의 `MessageSourceAware` 인터페이스를 구현하고 응용 프로그램 컨텍스트 시작 시 종속성이
주입될 것으로 예상하므로 `ApplicationContext`에서 이를 참조해야 한다. 일반적으로 메시지를 참조하기
위해 응용 프로그램 컨텍스트 내에 빈을 등록하기만 하면 된다. 예는 다음과 같다:

```xml
<bean id="messageSource"
	class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
<property name="basename" value="classpath:org/springframework/security/messages"/>
</bean>
```

`messages.properties`의 이름은 표준 리소스 번들에 따라 지정되며 스프링 시큐리티 메시지에서 지원하는
기본 언어를 나타낸다. 이 기본 파일은 영어이다.

`messages.properties` 파일을 사용자 정의하거나 다른 언어를 지원하려면 파일을 복사하고 그에 따라
이름을 바꾼 다음 위의 빈 정의 내에 등록해야 한다. 이 파일에는 메시지 키가 많지 않으므로 현지화를 주요
이니셔티브로 간주해서는 안 된다. 이 파일의 현지화를 수행하는 경우 JIRA 작업을 기록하고 적절한 이름의
현지화된 버전의 `messages.properties`를 연결하여 커뮤니티와 작업을 공유하는 것이 좋다.

스프링 시큐리티는 스프링의 현지화 지원에 의존하여 해당 메시지를 실제로 찾는다. 이 작업을 수행하려면 수신
요청의 로케일이 스프링의 `org.springframework.context.i18n.LocaleContextHolder`에
저장되어 있는지 확인해야 한다. 스프링 MVC의 `DispatcherServlet`은 응용 프로그램에 대해 이 작업을
자동으로 수행하지만 스프링 시큐리티의 필터는 이 작업 전에 호출되므로 필터를 호출하기 전에 올바른 로케일을
포함하도록 `LocaleContextHolder`를 설정해야 한다. 필터에서 직접 이 작업을 수행하거나(이 작업은
`web.xml`의 스프링 시큐리티 필터보다 먼저 수행해야 함) 스프링의 `RequestContextFilter`를 사용할
수 있다. 스프링과 함께 현지화를 사용하는 방법에 대한 자세한 내용은 스프링 프레임워크 문서를 참조하.

연락처 샘플 응용 프로그램은 현지화된 메시지를 사용하도록 설정된다.