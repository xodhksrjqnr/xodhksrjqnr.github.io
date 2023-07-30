# 스프링 REST Docs

스프링 REST Docs는 RESTful 서비스를 위한 정확한 문서를 자동으로 생성하는 것을 목표하며 다음과 같은 특징이 있다.

- 기본적으로 `Asciidoctor` 사용
- 테스트 기반 접근 방식으로 문서의 정확성 보장 (`mvc test framework`, `WebTestClient`, `REST Assured 5`로 작성된 테스트의 스니펫 사용)
- 서비스 구현에 따른 API 자동 문서화 및 갱신 가능

# 기본 셋팅

미리 구현된 예제들을 사용하려면 [여기](https://github.com/spring-projects/spring-restdocs-samples)를 참고하고, 직접 테스트하기 위한 요구 사항은 다음과 같다.

- Java 17
- Spring Framework 6
- REST Assured 5.2 (spring-restdocs-restassured 모듈 사용 시)

### Gradle

```
plugins { //(1) Asciodector 플러그인을 적용
	id "org.asciidoctor.jvm.convert" version "3.3.2"
}

configurations {
	asciidoctorExt //(2) Asciodector를 확장하는 종속성에 대해 asciidotorExt 구성을 선언
}

dependencies {
    //(3) asciidotorExt 구성에서 spring-restdocs-asciidotor에 종속성 추가
	// `.adoc` 파일에서 사용할 스니펫 속성이 빌드/생성된 스니펫을 가리키도록 자동으로 구성 및 작업 블록 매크로 사용 가능
	asciidoctorExt 'org.springframework.restdocs:spring-restdocs-asciidoctor:{project-version}'
	//(4) 테스트 구현 구성에서 spring-restdocs-mockmvc에 종속성 추가
	// mockMvc 외 종속성 추가는 아래 이
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc:{project-version}'
	//testImplementation 'org.springframework.restdocs:spring-restdocs-webtestclient:{project-version}'
	//testImplementation 'org.springframework.restdocs:spring-restdocs-rested:{project-version}'
}

ext { //(5) 생성된 조각 모음의 출력 위치를 정의할 속성 구성
	snippetsDir = file('build/generated-snippets')
}

test { //(6) 스니펫 디렉터리를 출력으로 추가하도록 테스트 작업 구성
	outputs.dir snippetsDir
}

asciidoctor { //(7) 연관 의사 작업 구성
	inputs.dir snippetsDir //(8) 스니펫 디렉터리를 입력으로 구성
	configurations 'asciidoctorExt' //(9) 확장에 대한 acciidotorExt 구성 사용을 구성
	dependsOn test //(10) 문서를 작성하기 전에 테스트가 실행되도록 태스크를 테스트 태스크에 종속
}

// jar 파일에 패키지 하기위한 빌드 구성
bootJar {
	dependsOn asciidoctor //(1) jar를 작성하기 전에 설명서가 생성되었는지 확인
	from ("${asciidoctor.outputDir}/html5") { //(2) 생성된 문서를 jar의 static/docs 디렉토리에 복사
		into 'static/docs'
	}
}
```

# 테스트 설정하기

JUnit 5가 권장되지만 JUnit 4와 TestNG와 같은 다른 프레임워크도 지원된다.

### JUnit 5 테스트 설정

문서 스니펫 생성을 위해 다음과 같이 `RestDocumentationExtension`을 적용한다. `RestDocumentationExtension`은 프로젝트 빌드 도구를 기반으로 한 출력 디렉토리로 자동 구성된다. 일반적으로 테스트 시에는 `SpringExtension`도 적용해야 한다.

```java
@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
public class JUnit5ExampleTests {}
```

JUnit 5.1을 사용하는 경우 다음과 같이 테스트 클래스에 필드로 등록하고 생성 시 제공하여 출력 디렉토리를 재정의할 수 있다.

```java
public class JUnit5ExampleTests {

	@RegisterExtension
	final RestDocumentationExtension restDocumentation = new RestDocumentationExtension ("custom");

}
```

이제 사용하는 테스트 기반 접근 방식에 따라 `@BeforeEach` 방법을 제공해야 한다.

#### MockMvc

```java
//import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;

private MockMvc mockMvc;

@BeforeEach
void setUp(WebApplicationContext webApplicationContext, RestDocumentationContextProvider restDocumentation) {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
			.apply(documentationConfiguration(restDocumentation))
			.build();
}
```

#### WebTestClient

```java
//import static org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation;

private WebTestClient webTestClient;

@BeforeEach
void setUp(ApplicationContext applicationContext, RestDocumentationContextProvider restDocumentation) {
	this.webTestClient = WebTestClient.bindToApplicationContext(applicationContext).configureClient()
			.filter(documentationConfiguration(restDocumentation))
			.build();
}
```

#### REST Assured

```java
//import static org.springframework.restdocs.restassured.RestAssuredRestDocumentation;

private RequestSpecification spec;

@BeforeEach
void setUp(RestDocumentationContextProvider restDocumentation) {
	this.spec = new RequestSpecBuilder().addFilter(documentationConfiguration(restDocumentation))
			.build();
}
```

### JUnit 4 테스트 설정

문서 스니펫을 생성하기 위해 `@Rule` 주석이 달린 `public` `JUnitRestDocumentation` 필드를 선언해야 한다. `JUnitRestDocumentation` 규칙은 프로젝트의 빌드 도구에 기반한 출력 디렉토리로 자동 구성된다.

```java
@Rule
public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation();
```

다음과 같이 JUnit 4도 인스턴스 생성 시 출력 디렉토리를 재정의할 수 있다.

```java
@Rule
public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation("custom");
```

이제 사용하는 테스트 기반 접근 방식에 따라 `@Before` 방법을 제공해야 한다.

#### MockMvc

```java
//import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;

private MockMvc mockMvc;

@Autowired
private WebApplicationContext context;

@Before
public void setUp() {
	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
			.apply(documentationConfiguration(this.restDocumentation))
			.build();
}
```

#### WebTestClient

```java
//import static org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation;

private WebTestClient webTestClient;

@Autowired
private ApplicationContext context;

@Before
public void setUp() {
        this.webTestClient = WebTestClient.bindToApplicationContext(this.context).configureClient()
        .filter(documentationConfiguration(this.restDocumentation))
        .build();
        }
```

#### REST Assured

```java
//import static org.springframework.restdocs.restassured.RestAssuredRestDocumentation;

private RequestSpecification spec;

@Before
public void setUp() {
	this.spec = new RequestSpecBuilder().addFilter(documentationConfiguration(this.restDocumentation))
			.build();
}
```

### JUnit 없이 테스트 설정

JUnit을 사용하지 않는 경우도 대체도 유사하다. 여기선 차이점에 대해서 알아보자.

`JUnitRestDocumentation` 대신 `ManualRestDocumentation`을 사용하며 `@Rule` 주석이 필요없다.

```java
private ManualRestDocumentation restDocumentation = new ManualRestDocumentation();
```

또한 각 테스트 전에 `ManualRestDocumentation.beforeTest(Class, String)`를 호출해야 하며 각 테스트 기반 접근 방식에 따른 설정은 다음과 같다.

#### MockMvc

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

#### WebTestClient

```java
private WebTestClient webTestClient;

@Autowired
private ApplicationContext context;

@BeforeMethod
public void setUp(Method method) {
	this.webTestClient = WebTestClient.bindToApplicationContext(this.context).configureClient()
			.filter(documentationConfiguration(this.restDocumentation))
			.build();
	this.restDocumentation.beforeTest(getClass(), method.getName());
}
```

#### REST Assured

```java
private RequestSpecification spec;

@BeforeMethod
public void setUp(Method method) {
	this.spec = new RequestSpecBuilder().addFilter(documentationConfiguration(this.restDocumentation)).build();
	this.restDocumentation.beforeTest(getClass(), method.getName());
}
```

각 테스트가 끝나면 `ManualRestDocumentation.afterTest`를 호출해야 한다.

```java
@AfterMethod
public void tearDown() {
	this.restDocumentation.afterTest();
}
```

# RESTful 서비스 호출 및 스니펫 사용하기

이제 테스트 프레임워크 구성이 완료되었으며 이를 이용해 RESTful 서비스를 호출하고 요청 및 응답을 문서화할 수 있다. 테스트 기반 접근 방식 별 간단한 예제를 확인해보자.

#### MockMvc

```java
//import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;

this.mockMvc.perform(get("/").accept(MediaType.APPLICATION_JSON)) //(1) 루트 호출, application/json 응답 필요
		.andExpect(status().isOk()) //(2) 예상된 응답인 지 확인
		.andDo(document("index")); //(3) 출력 디렉토리 하위에 index 디렉토리에 스니펫 기록 (RestDocumentationResultHandler에 의해 작성)
```

#### WebTestClient

```java
//import static org.springframework.restdocs.webtestclient.WebTestClientRestDocumentation.document;

this.webTestClient.get().uri("/").accept(MediaType.APPLICATION_JSON) //(1) 루트 호출, application/json 응답 필요
		.exchange().expectStatus().isOk() //(2) 예상된 응답인 지 확인
		.expectBody().consumeWith(document("index")); //(3) 출력 디렉토리 하위에 index 디렉토리에 스니펫 기록 (ExchangeResult의 Consumer에 의해 작성)
```

#### REST Assured

```java
//import static org.springframework.restdocs.restassured.RestAssuredRestDocumentation.document;
RestAssured.given(this.spec) //(1) @Before 방식으로 초기화된 사양을 적용
		.accept("application/json") //(2) application/json 응답 필요
		.filter(document("index")) //(3) 호출을 서비스에 문서화하여 구성된 출력 디렉터리 아래에 있는 인덱스라는 디렉터리에 스니펫을 기록 (RestDocumentationFilter에 의해 작성)
		.when().get("/") //(4) 루트 호출
		.then().assertThat().statusCode(is(200)); //(5) 예상된 응답인 지 확인
```

테스트 실행 후 기본적으로 다음과 같은 6개의 스니펫이 작성된다.

- `<output-directory>/index/put-request.adoc`
- `<output-directory>/index/put-request.adoc`
- `<output-directory>/index/put-response.adoc`
- `<output-directory>/index/putpie-request.adoc`
- `<output-directory>/index/request-body.adoc`
- `<output-directory>/index/response-body.adoc`

생성된 스니펫을 사용하기 위해 `.adoc` 원본 파일을 만들어야 한다. 예제는 다음과 같으며 파일 작성에 대한 자세한 내용은 Asciidoctor를 참고하자.

```
include::{snippets}/index/http-request.adoc[]

operation::index[snippets='curl-request,http-request,https-response,httpie-request,request-body,response-body']
```

include 매크로를 사용해 단일 스니펫을 포함할 수 있으며, operation 매크로를 사용해 다중 스니펫을 포함할 수 있다. 스니펫 출력 디렉터리는 spring-restdocs-asciidoctor에 의해 자동으로 설정된 snippets 특성을 사용한다.

| Build tool | Source files               | Generated files                |
|------------|----------------------------|--------------------------------|
| Maven      | `src/main/asciidoc/*.adoc` | `target/generated-docs/*.html` |
| Gradle     | `src/docs/asciidoc/*.adoc` | `build/asciidoc/html5/*.html`  |

자세한 구현 예시는 [여기](https://github.com/xodhksrjqnr/spring/tree/main/rest-doc)에서 확인하자.