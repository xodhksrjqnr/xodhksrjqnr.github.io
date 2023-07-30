# 스프링 REST Docs [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#introduction)

스프링 MVC Test 또는 `WebTestClient`에서 생성된 자동 생성 스니펫과 수기 문서를 결합하여 RESTful 서비스를 문서화한다.

# 소개 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#introduction)

스프링 REST Docs의 목적은 RESTful 서비스를 위한 정확하고 판독 가능한 문서를 생성하는 데 도움이 되는 것이다.

고품질의 문서를 작성하는 것은 어렵다. 이러한 어려움을 완화하는 한 가지 방법은 작업에 적합한 도구를 사용하는 것이다. 이를 위해 스프링 REST Docs는 기본적으로 [`Asciidoctor`](https://asciidoctor.org/)를 사용한다. `Asciidoctor`는 일반 텍스트를 처리하고 필요에 따라 HTML을 생성하고 스타일 및 레이아웃을 생성한다. 원하는 경우 스프링 REST Docs를 구성하여 Markdown을 사용할 수도 있다.

스프링 REST Docs는 스프링 MVC의 테스트 프레임워크, 스프링 WebFlux의 WebTestClient 또는 [`REST Assured 5`](https://rest-assured.io/)로 작성된 테스트에서 생성된 스니펫을 사용한다. 이 테스트 기반 접근 방식은 서비스 문서의 정확성을 보장하는 데 도움이 된다. 스니펫이 올바르지 않으면 생성된 테스트가 실패한다.

RESTful 서비스를 문서화하는 것은 주로 리소스를 설명하는 것이다. 각 리소스 설명의 두 가지 핵심 부분은 리소스가 소비하는 HTTP 요청과 생성하는 HTTP 응답의 세부 사항이다. 스프링 REST Docs를 사용하면 이러한 리소스와 HTTP 요청 및 응답을 작업하여 서비스 구현의 내부 세부 사항으로부터 문서를 보호할 수 있다. 이렇게 분리하면 서비스의 구현 대신 API를 문서화하는 데 도움이 된다. 또한 문서를 재작업할 필요 없이 구현을 발전시킬 수 있다.

# 시작하기 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started)

이 섹션에서는 스프링 REST Docs를 시작하는 방법을 설명한다.

# 간단한 애플리케이션 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-sample-applications)

일부를 스킵하고 싶다면 [여러 샘플 응용 프로그램](https://github.com/spring-projects/spring-restdocs-samples)을 사용할 수 있다.

# 요구 사항 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-requirements)

스프링 REST Docs에는 다음과 같은 최소 요구 사항이 있다:

- java 17
- spring framework 6

또한 `spring-restdocs-restassured` 모듈에는 REST Assured 5.2가 필요하다.

# 빌드 설정 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-build-configuration)

스프링 REST Docs를 사용하는 첫 번째 단계는 프로젝트의 빌드를 구성하는 것이다. 스프링 HATEOAS 및 스프링 Data REST 샘플에는 각각 참조로 사용할 수 있는 `build.gradle`와 `pom.xml`가 포함되어 있다. 구성의 주요 부분은 다음 목록에 설명되어 있다:

```
plugins { //1
	id "org.asciidoctor.jvm.convert" version "3.3.2"
}

configurations {
	asciidoctorExt //2
}

dependencies {
	asciidoctorExt 'org.springframework.restdocs:spring-restdocs-asciidoctor:{project-version}' //3
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc:{project-version}' //4
}

ext { //5
	snippetsDir = file('build/generated-snippets')
}

test { //6
	outputs.dir snippetsDir
}

asciidoctor { //7
	inputs.dir snippetsDir //8
	configurations 'asciidoctorExt' //9
	dependsOn test //10
}
```

1. Asciodector 플러그인을 적용한다.
2. Asciodector를 확장하는 종속성에 대해 asciidotorExt 구성을 선언한다.
3. asciidotorExt 구성에서 spring-restdocs-asciidotor에 종속성을 추가한다. 이렇게 하면 `.adoc` 파일에서 사용할 스니펫 속성이 빌드/생성된 스니펫을 가리키도록 자동으로 구성된다. 작업 블록 매크로를 사용할 수도 있다.
4. 테스트 구현 구성에서 spring-restdocs-mockmvc에 종속성을 추가한다. MockMvc 대신 WebTestClient 또는 REST Assured를 사용하려면 대신 spring-restdocs-webtestclient 또는 spring-restdocs-rested에 종속성을 추가한다.
5. 생성된 조각 모음의 출력 위치를 정의할 속성을 구성한다.
6. 스니펫 디렉터리를 출력으로 추가하도록 테스트 작업을 구성한다.
7. 연관 의사 작업을 구성한다.
8. 스니펫 디렉터리를 입력으로 구성합니다.
9. 확장에 대한 acciidotorExt 구성 사용을 구성한다.
10. 문서를 작성하기 전에 테스트가 실행되도록 태스크를 테스트 태스크에 종속시킨다.

# 설명서 패키징 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-build-configuration-packaging-the-documentation)

생성된 문서를 프로젝트의 jar 파일에 패키지할 수 있다. 예를 들어 스프링 부트에 의해 [정적 내용](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-spring-mvc-static-content)으로 제공되도록 하려면 프로젝트 빌드를 구성해야 한다:

1. 문서는 jar를 만들기 전에 생성된다.
2. 생성된 문서가 jar에 포함되어 있다.

다음 목록은 Maven과 Gradle 모두에서 이를 수행하는 방법을 보여준다:

### Gradle

```
bootJar {
	dependsOn asciidoctor //1 
	from ("${asciidoctor.outputDir}/html5") { //2 
		into 'static/docs'
	}
}
```

1. jar를 작성하기 전에 설명서가 생성되었는지 확인한다.
2. 생성된 문서를 jar의 `static/docs` 디렉토리에 복사한다.

# 문서 스니펫 생성 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-documentation-snippets)

스프링 REST Docs는 스프링 MVC의 테스트 프레임워크, 스프링 WebFlux의 WebTestClient 또는 REST Assured를 사용하여 문서화 중인 서비스에 요청을 수행한다. 그런 다음 요청과 결과 응답에 대한 문서 스니펫을 생성한다.

# 테스트 설정 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-documentation-snippets-setup)

사용하는 테스트 프레임워크에 따라 설정 방법이 다르며, JUnit 5와 JUnit 4를 지원하며 JUnit 5가 권장된다. TestNG와 같은 다른 프레임워크도 지원되며 추가적인 설정을 필요로 한다.

# JUnit 5 테스트 설정 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-documentation-snippets-setup-junit-5)

JUnit 5를 사용할 때 문서 스니펫을 생성하는 첫 번째 단계는 테스트 클래스에 `RestDocumentationExtension`을 적용하는 것이다. 다음 예제에서는 이를 수행하는 방법을 보여 준다:

```java
@ExtendWith(RestDocumentationExtension.class)
public class JUnit5ExampleTests {}
```

일반적인 스프링 애플리케이션을 테스트할 때는 `SpringExtension`도 적용해야 한다:

```java
@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
public class JUnit5ExampleTests {}
```

`RestDocumentationExtension`은 프로젝트의 빌드 도구를 기반으로 한 출력 디렉토리로 자동 구성된다:

| Build tool | Output directory            |
|------------|-----------------------------|
| Maven      | `target/generated-snippets` |
| Gradle     | `build/generated-snippets`  |

JUnit 5.1을 사용하는 경우 확장자를 테스트 클래스에 필드로 등록하고 생성할 때 출력 디렉터리를 제공하여 기본값을 재정의할 수 있다. 다음 예제에서는 이를 수행하는 방법을 보여 준다:

```java
public class JUnit5ExampleTests {

	@RegisterExtension
	final RestDocumentationExtension restDocumentation = new RestDocumentationExtension ("custom");

}
```

그런 다음 MockMvc 또는 WebTestClient 또는 REST Assured를 구성하기 위한 `@BeforeEach` 방법을 제공해야 한다. 다음 목록은 방법을 보여준다:

### MockMvc

```java
private MockMvc mockMvc;

@BeforeEach
void setUp(WebApplicationContext webApplicationContext, RestDocumentationContextProvider restDocumentation) {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
			.apply(documentationConfiguration(restDocumentation)) (1)
			.build();
}
```

1. `MockMvc` 인스턴스는 `MockMvcRestDocumentationConfigurer`를 사용하여 구성된다. `org.springframework.restdocs.mockmvc.MockMvcRestDocumentation`의 정적 `documentationConfiguration()` 메서드에서 이 클래스의 인스턴스를 가져올 수 있다.

### WebTestClient

```java
private WebTestClient webTestClient;

@BeforeEach
void setUp(ApplicationContext applicationContext, RestDocumentationContextProvider restDocumentation) {
	this.webTestClient = WebTestClient.bindToApplicationContext(applicationContext).configureClient()
			.filter(documentationConfiguration(restDocumentation)) (1)
			.build();
}
```

1. `WebTestClient` 인스턴스는 `WebTestClientRestDocumentationConfigurer`를 `ExchangeFilterFunction`로 추가하여 구성된다. `org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation`의 정적 `documentationConfiguration()` 메서드에서 이 클래스의 인스턴스를 가져올 수 있다.

### REST Assured

```java
private RequestSpecification spec;

@BeforeEach
void setUp(RestDocumentationContextProvider restDocumentation) {
	this.spec = new RequestSpecBuilder().addFilter(documentationConfiguration(restDocumentation)) (1)
			.build();
}
```

1. REST Assured는 `RestAssuredRestDocumentationConfigurer`를 `Filter`로 추가하여 구성된다. `org.springframework.restdocs.restassured` 패키지의 `RestAssuredRestDocumentation`에 있는 정적 `documentationConfiguration()` 에서 이 클래스의 인스턴스를 가져올 수 있다.

구성 관리자는 합리적인 기본값을 적용하고 구성을 사용자 지정하는 API도 제공합니다. 자세한 내용은 구성 섹션을 참조하자.

# JUnit 4 테스트 설정 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-documentation-snippets-setup-junit)

JUnit 4를 사용하는 경우 문서 스니펫을 생성하는 첫 번째 단계는 JUnit `@Rule`로 주석이 달린 `public` `JUnitRestDocumentation` 필드를 선언하는 것이다. 다음 예제에서는 이를 수행하는 방법을 보여 준다:

```java
@Rule
public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation();
```

기본적으로 `JUnitRestDocumentation` 규칙은 프로젝트의 빌드 도구에 기반한 출력 디렉토리로 자동 구성된다:

| Build tool | Output directory            |
|------------|-----------------------------|
| Maven      | `target/generated-snippets` |
| Gradle     | `build/generated-snippets`  |

`JUnitRestDocumentation` 인스턴스를 생성할 때 출력 디렉토리를 제공하여 기본값을 재정의할 수 있다. 다음 예제에서는 이러한 방법을 보여 준다:

```java
@Rule
public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation("custom");
```

그런 다음 MockMvc 또는 WebTestClient 또는 REST Assured를 구성하는 `@Before` 방법을 제공해야 한다. 다음 예제에서는 이러한 방법을 보여 준다:

### MockMvc

```java
private MockMvc mockMvc;

@Autowired
private WebApplicationContext context;

@Before
public void setUp() {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
			.apply(documentationConfiguration(this.restDocumentation)) (1)
			.build();
}
```

MockMvc 인스턴스는 `MockMvcRestDocumentationConfigurer`를 사용하여 구성된다. `org.springframework.restdocs.mockmvc.MockMvcRestDocumentation`의 정적 `documentationConfiguration()` 메서드에서 이 클래스의 인스턴스를 가져올 수 있다.

### WebTestClient

```java
private WebTestClient webTestClient;

@Autowired
private ApplicationContext context;

@Before
public void setUp() {
	this.webTestClient = WebTestClient.bindToApplicationContext(this.context).configureClient()
			.filter(documentationConfiguration(this.restDocumentation)) (1)
			.build();
}
```

WebTestClient 인스턴스는 `WebTestclientRestDocumentationConfigurer`를 `ExchangeFilterFunction`로 추가하여 구성된다. `org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation`의 정적 `documentationConfiguration()` 메서드에서 이 클래스의 인스턴스를 가져올 수 있다.

### REST Assured

```java
private RequestSpecification spec;

@Before
public void setUp() {
	this.spec = new RequestSpecBuilder().addFilter(documentationConfiguration(this.restDocumentation)) (1)
			.build();
}
```

REST Assured는 `RestAssuredRestDocumentationConfigurer`를 `Filter`로 추가하여 구성된다. `org.springframework.restdocs.restassured` 패키지의 `RestAssuredRestDocumentation`에 있는 정적 `documentationConfiguration()` 에서 이 클래스의 인스턴스를 가져올 수 있다.

구성 관리자는 합리적인 기본값을 적용하고 구성을 사용자 지정하는 API도 제공한다. 자세한 내용은 구성 섹션을 참조하자.

# JUnit 없이 테스트 설정 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-documentation-snippets-setup-manual)

JUnit이 사용되지 않을 때의 구성은 JUnit이 사용될 때와 대체로 유사하다. 이 절에서는 주요 차이점을 설명한다. [TestNG 샘플](https://github.com/spring-projects/spring-restdocs-samples/tree/main/testng)은 또한 접근 방식을 설명한다.

첫 번째 차이점은 `JUnitRestDocumentation` 대신 `ManualRestDocumentation`을 사용해야 한다는 것이다. 또한 `@Rule` 주석이 필요하지 않다. 다음 예제에서는 `ManualRestDocumentation`를 사용하는 방법을 보여 준다:

```java
private ManualRestDocumentation restDocumentation = new ManualRestDocumentation();
```

두 번째로, 각 테스트 전에 `ManualRestDocumentation.beforeTest(Class, String)`를 호출해야 한다. MockMvc, WebTestClient 또는 REST Assured를 구성하는 방법의 일부로 호출할 수 있다. 다음 예제에서는 이 방법을 보여 준다:

### MocMvc

```java
private MockMvc mockMvc;

@Autowired
private WebApplicationContext context;

@BeforeMethod
public void setUp(Method method) {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
			.apply(documentationConfiguration(this.restDocumentation)).build();
	this.restDocumentation.beforeTest(getClass(), method.getName());
}
```

### WebTestClient

```java
private WebTestClient webTestClient;

@Autowired
private ApplicationContext context;

@BeforeMethod
public void setUp(Method method) {
	this.webTestClient = WebTestClient.bindToApplicationContext(this.context).configureClient()
			.filter(documentationConfiguration(this.restDocumentation)) (1)
			.build();
	this.restDocumentation.beforeTest(getClass(), method.getName());
}
```

### REST Assured

```java
private RequestSpecification spec;

@BeforeMethod
public void setUp(Method method) {
	this.spec = new RequestSpecBuilder().addFilter(documentationConfiguration(this.restDocumentation)).build();
	this.restDocumentation.beforeTest(getClass(), method.getName());
}
```

마지막으로 각 테스트가 끝나면 `ManualRestDocumentation.afterTest`를 호출해야 한다. 다음 예제에서는 TestNG를 사용하여 호출하는 방법을 보여 준다:

```java
@AfterMethod
public void tearDown() {
	this.restDocumentation.afterTest();
}
```

# RESTful 서비스 호출 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-documentation-snippets-invoking-the-service)

테스트 프레임워크를 구성했으므로 이를 사용하여 RESTful 서비스를 호출하고 요청 및 응답을 문서화할 수 있다. 다음 예제에서는 이러한 방법을 보여 준다:

### MockMvc

```java
//import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;

this.mockMvc.perform(get("/").accept(MediaType.APPLICATION_JSON)) (1)
		.andExpect(status().isOk()) (2)
		.andDo(document("index")); (3)
```

1. 서비스의 루트(/)를 호출, `application/json` 응답이 필요
2. 서비스가 예상된 응답을 생성했는 지 확인
3. 구성된 출력 디렉터리 아래에 있는 인덱스라는 디렉터리에 스니펫을 기록하여 서비스 호출을 문서화 (스니펫은 `RestDocumentationResultHandler`에 의해 작성)

### WebTestClient

```java
//import static org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation.document;

this.webTestClient.get().uri("/").accept(MediaType.APPLICATION_JSON) (1)
		.exchange().expectStatus().isOk() (2)
		.expectBody().consumeWith(document("index")); (3)
```

1. 서비스의 루트(/)를 호출, `application/json` 응답이 필요
2. 서비스가 예상된 응답을 생성했는 지 확인
3. 호출을 서비스에 문서화하여 구성된 출력 디렉터리 아래에 있는 인덱스라는 디렉터리에 스니펫을 기록 (스니펫은 `ExchangeResult`의 `Consumer`에 의해 작성)

### REST Assured

```java
//import static org.springframework.restdocs.restassured.RestAssuredRestDocumentation.document;
RestAssured.given(this.spec) (1)
		.accept("application/json") (2)
		.filter(document("index")) (3)
		.when().get("/") (4)
		.then().assertThat().statusCode(is(200)); (5)
```

1. `@Before` 방식으로 초기화된 사양을 적용
2. `application/json` 응답이 필요
3. 서비스 호출을 문서화하여 구성된 출력 디렉터리 아래에 있는 `index`라는 디렉터리에 스니펫을 기록 (스니펫은 `RestDocumentationFilter`에 의해 작성)
4. 서비스의 루트(/)를 호출
5. 서비스가 예상된 응답을 생성했는 지 확인

기본적으로 6개의 스니펫이 작성된다:

- `<output-directory>/index/put-request.adoc`
- `<output-directory>/index/put-request.adoc`
- `<output-directory>/index/put-response.adoc`
- `<output-directory>/index/putpie-request.adoc`
- `<output-directory>/index/request-body.adoc`
- `<output-directory>/index/response-body.adoc`

스프링 REST Docs에서 생성할 수 있는 이러한 및 기타 스니펫에 대한 자세한 내용은 API 문서화를 참조하자.

# 스니펫 사용 [#](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/#getting-started-using-the-snippets)

생성된 스니펫을 사용하기 전에 `.adoc` 원본 파일을 만들어야 한다. 파일에 `.adoc` 접미사가 있으면 원하는 대로 이름을 지정할 수 있다. 결과 HTML 파일의 이름은 같지만 `.html` 접미사가 있다. 원본 파일과 결과 HTML 파일의 기본 위치는 Maven과 Gradle 중 어느 것을 사용하는지에 따라 달라진다:

| Build tool | Source files               | Generated files                |
|------------|----------------------------|--------------------------------|
| Maven      | `src/main/asciidoc/*.adoc` | `target/generated-docs/*.html` |
| Gradle     | `src/docs/asciidoc/*.adoc` | `build/asciidoc/html5/*.html`  |

그런 다음 include 매크로를 사용하여 수동으로 생성된 Asciidoc 파일에 생성된 스니펫을 포함할 수 있다. 빌드 구성에서 구성된 spring-restdocs-asciidoctor에 의해 자동으로 설정되는 `snippets` 특성을 사용하여 스니펫 출력 디렉터리를 참조할 수 있다. 다음 예제에서는 이를 수행하는 방법을 보여 준다:

```
include::{snippets}/index/curl-request.adoc[]
```

