# Testing

## 5.Spring TestContext Framework

### 5.10. Executing SQL Scripts [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql)

관계형 데이터베이스와 관련된 통합 테스트를 작성할 때, SQL 스크립트를 실행해 스키마를 수정하거나
테이블에 테스트 데이터를 삽입하는 방식은 매우 유용하다. Spring-jdbc 모듈은 Spring 
ApplicationContext가 로드될 때 SQL 스크립트를 실행하여 내장형 또는 기존 데이터베이스를
초기할 수 있도록 지원한다. 자세한 내용은 [내장형 데이터베이스 지원](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-embedded-database-support)
및 [내장형 데이터베이스를 사용한 데이터 액세스 로직 테스트](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-embedded-database-dao-testing)를 참조하자.

ApplicationContext가 로드될 때 테스트를 위해 데이터베이스를 초기화하는 것이 매우 유용하지만,
통합 테스트 중에 데이터베이스를 수정할 수 있어야 하는 경우도 있다. 다음 섹션에서는 통합 테스트 중에
SQL 스크립트를 프로그래밍 방식으로 선언적으로 실행하는 방법을 설명한다.

### 5.10.1. Executing SQL scripts programmatically [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-programmatically)

Spring은 통합 테스트 방법 내에서 SQL 스크립트를 프로그래밍 방식으로 실행할 수 있는 다음과 같은
옵션을 제공한다.

- org.springframework.jdbc.datasource.init.ScriptUtils
- org.springframework.jdbc.datasource.init.ResourceDatabasePopulator
- org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests
- org.springframework.test.context.testng.AbstractTransactionalTestNGSpringContextTests

ScriptUtils는 SQL 스크립트로 작업하기 위한 정적 유틸리티 메서드 모음을 제공하며 주로 프레임워크
내에서 내부적으로 사용하기 위한 것이다. 그러나 SQL 스크립트의 구문 분석 및 실행 방법을 완벽하게
제어해야 하는 경우 ScriptUtils가 나중에 설명하는 다른 방법보다 사용자의 요구에 더 적합할 수 있다.
자세한 내용은 ScriptUtils의 개별 메서드에 대한 [javadoc](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/jdbc/datasource/init/ScriptUtils.html)을 참조하자.

ResourceDatabasePopulator는 외부 리소스에 정의된 SQL 스크립트를 사용하여 데이터베이스를
프로그래밍 방식으로 채우거나 초기화하거나 정리할 수 있는 개체 기반 API를 제공합니다.
ResourceDatabasePopulator는 스크립트를 구문 분석하고 실행할 때 사용되는 문자 인코딩, 문
구분 기호, 주석 구분 기호 및 오류 처리 플래그를 구성하는 옵션을 제공한다. 각 구성 옵션에는 적절한
기본값이 있습니다. 기본값에 대한 자세한 내용은 [javadoc](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/jdbc/datasource/init/ResourceDatabasePopulator.html)을 참조하십시오.
ResourceDatabasePopulator에 구성된 스크립트를 실행하려면, java.sql.Connetion에 대해
populate(Connetion) 메서드나, "javax.sql.DataSource"에 대해 execute(DataSource)
메서드를 호출하여 사용하자. 다음 예제에서는 테스트 스키마 및 테스트 데이터에 대한 SQL 스크립트를
지정하고 문 구분 기호를 @@로 설정한 다음 DataSource에 대해 스크립트를 실행한다.

```java
@Test
void databaseTest() {
    ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
    populator.addScripts(
            new ClassPathResource("test-schema.sql"),
            new ClassPathResource("test-data.sql"));
    populator.setSeparator("@@");
    populator.execute(this.dataSource);
    // run code that uses the test schema and data
}
```

ResourceDatabasePopulator는 내부적으로 ScriptUtils에 SQL 스크립트를 구문 분석하고
실행하도록 위임한다. 마찬가지로, AbstractTransactional의 executeSqlScript(...)
메서드는Junit4SpringContextTests 및 AbstractTransactionTestNGSpringContextTests는
내부적으로 ResourceDatabasePopulator를 사용하여 SQL 스크립트를 실행한다.
자세한 내용은 다양한 executeSqlScript(...) 메서드에 대한 [Javadoc](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/r2dbc/connection/init/ScriptUtils.html#executeSqlScript(io.r2dbc.spi.Connection,org.springframework.core.io.support.EncodedResource))을 참조하자.

### 5.10.2. Executing SQL scripts declaratively with @Sql [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively)

SQL 스크립트를 프로그래밍 방식으로 실행하기 위한 위의 메커니즘 외에도 Spring TestContext
Framework에서 SQL 스크립트를 선언적으로 구성할 수 있다. 특히 테스트 클래스 또는 테스트 메서드에
@Sql 주석을 선언하여 통합 테스트 메서드 전후에 지정된 데이터베이스에 대해 실행해야 하는 개별 SQL 문
또는 SQL 스크립트에 대한 리소스 경로를 구성할 수 있다. @Sql에 대한 지원은 기본적으로 활성화된
SqlScriptsTestExecutionListener에 의해 제공된다.

메서드 수준 @Sql 선언은 기본적으로 클래스 수준 선언을 재정의한다. 그러나 Spring Framework
5.2에서 이 동작은 @SqlMergeMode를 통해 테스트 클래스 또는 테스트 방법별로 구성할 수 있다.
자세한 내용은 [@SqlMergeMode와 구성 병합 및 재정의](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-script-merging)를 참조하자.

### Path Resource Semantics [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-script-resources)

각 경로는 Spring Resource로 해석된다. 일반 경로(예: "schema.sql")는 테스트 클래스가 정의된
패키지와 관련된 클래스 경로 리소스로 처리된다. 슬래시로 시작하는 경로는 절대 클래스 경로
리소스(예: "/org/example/schema.sql")로 처리된다. URL을 참조하는 경로(예: classpath:,
file:, http:)는 지정된 리소스 프로토콜을 사용하여 로드된다.

다음 예는 Junit Jupiter 기반 통합 테스트 클래스 내에서 클래스 수준 및 메서드 수준에서 @Sql을
사용하는 방법을 보여준다.

```java
@SpringJUnitConfig
@Sql("/test-schema.sql")
class DatabaseTests {

    @Test
    void emptySchemaTest() {
        // run code that uses the test schema without any test data
    }

    @Test
    @Sql({"/test-schema.sql", "/test-user-data.sql"})
    void userTest() {
        // run code that uses the test schema and test data
    }
}
```

### Default Script Detection [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-script-detection)

SQL 스크립트 또는 문이 지정되지 않은 경우 @Sql이 선언된 위치에 따라 기본 스크립트를 검색하려고
시도한다. 기본값을 탐지할 수 없는 경우 불법 상태 예외가 발생한다.

- 클래스 수준 선언: 주석이 달린 테스트 클래스가 com.example인 경우.MyTest, 해당하는 기본
  스크립트는 classpath:com/example/MyTest.sql이다.
- 메서드 수준 선언: 주석이 달린 테스트 방법의 이름이 testMethod()이고 com.example 클래스에
  정의되어 있는 경우.MyTest, 해당하는 기본 스크립트는 classpath:com/example/MyTest.testMethod.sql이다.

### Declaring Multiple @Sql Sets [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-multiple-annotations)

지정된 테스트 클래스 또는 테스트 방법에 대해 여러 SQL 스크립트 세트를 구성해야 하지만 구문 구성,
오류 처리 규칙 또는 세트당 실행 단계가 다른 경우 @Sql의 여러 인스턴스를 선언할 수 있다.
Java 8에서는 @Sql을 반복 가능한 주석으로 사용할 수 있다. 그렇지 않으면 @SqlGroup 주석을
@Sql의 여러 인스턴스를 선언하는 명시적 컨테이너로 사용할 수 있다.

다음 예제에서는 Java 8에서 @Sql을 반복 가능한 주석으로 사용하는 방법을 보여 준다.

```java
@Test
@Sql(scripts = "/test-schema.sql", config = @SqlConfig(commentPrefix = "`"))
@Sql("/test-user-data.sql")
void userTest() {
// run code that uses the test schema and test data
}
```

위의 예에 제시된 시나리오에서 test-schema.sql 스크립트는 한 줄 주석에 대해 다른 구문을
사용한다.

다음 예는 @Sql 선언이 @SqlGroup 내에서 함께 그룹화된다는 점을 제외하고는 위의 예와 동일한다.
Java 8 이상에서는 @SqlGroup을 선택적으로 사용할 수 있지만 Kotlin과 같은 다른 JVM 언어와의
호환성을 위해 @SqlGroup을 사용해야 할 수도 있다.

```java
@Test
@SqlGroup({
  @Sql(scripts = "/test-schema.sql", config = @SqlConfig(commentPrefix = "`")),
  @Sql("/test-user-data.sql")
)}
void userTest() {
// run code that uses the test schema and test data
}
```

### Script Execution Phases [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-script-execution-phases)

기본적으로 SQL 스크립트는 해당 테스트 메서드보다 먼저 실행된다. 그러나 테스트 메서드(예: 데이터베이스
상태 정리) 후에 특정 스크립트 집합을 실행해야 하는 경우 다음 예제에서 볼 수 있듯이 @Sql의
executionPhase 속성을 사용하자.

```java
@Test
@Sql(
  scripts = "create-test-data.sql",
  config = @SqlConfig(transactionMode = ISOLATED)
)
@Sql(
  scripts = "delete-test-data.sql",
  config = @SqlConfig(transactionMode = ISOLATED),
  executionPhase = AFTER_TEST_METHOD
)
void userTest() {
// run code that needs the test data to be committed
// to the database outside of the test's transaction
}
```

ISOLATED와 AFTER_TEST_METHOD는 각각 Sql.TransactionMode와 Sql.ExecutionPhase에서
정적으로 가져온다.

### Script Configuration with @SqlConfig [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-script-configuration)

@SqlConfig 주석을 사용하여 스크립트 구문 분석 및 오류 처리를 구성할 수 있다. 통합 테스트 클래스에서
클래스 수준 주석으로 선언된 경우 @SqlConfig는 테스트 클래스 계층 내의 모든 SQL 스크립트에 대한
글로벌 구성 역할을 한다. @Sql 주석의 구성 특성을 사용하여 직접 선언하는 경우 @SqlConfig는 동봉된
@Sql 주석 내에서 선언된 SQL 스크립트에 대한 로컬 구성 역할을 한다. @SqlConfig의 모든 특성에는
해당 특성의 javadoc에 문서화된 암묵적 기본값이 있다. Java 언어 사양의 주석 속성에 대해 정의된
규칙으로 인해 주석 속성에 null 값을 할당할 수 없다. 따라서 상속된 글로벌 구성의 재정의를 지원하기 위해
@SqlConfig 특성의 명시적 기본값은 ""(문자열의 경우), {}(어레이의 경우) 또는 DEFAULT( 열거의
경우)다. 이 접근 방식을 사용하면 @SqlConfig의 로컬 선언이 "" {} 또는 DEFAULT 이외의 값을 제공하여
@SqlConfig의 글로벌 선언에서 개별 속성을 선택적으로 재정의할 수 있다. Global @SqlConfig 특성은
로컬 @SqlConfig 특성이 ", {} 또는 DEFAULT" 이외의 명시적 값을 제공하지 않을 때마다 상속된다.
따라서 명시적 로컬 구성은 글로벌 구성을 재정의한다.

@Sql 및 @SqlConfig에서 제공하는 구성 옵션은 ScriptUtils 및 ResourceDatabasePopulator에서
지원하는 구성 옵션과 동일하지만 <jdbc:initialize-database/> XML 네임스페이스 요소에서 제공하는
구성 옵션의 상위 집합이다. 자세한 내용은 [@Sql](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/context/jdbc/Sql.html)
및 [@SqlConfig](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/context/jdbc/SqlConfig.html)의
개별 특성 javadoc을 참조하자.

#### Transaction management for @Sql

기본적으로 SqlScriptsTestExecutionListener는 @Sql을 사용하여 구성된 스크립트에 대해 원하는
트랜잭션 의미를 유추한다. 특히 SQL 스크립트는 트랜잭션 없이 기존의 Spring 관리 트랜잭션(예: @Transactional로
주석이 달린 테스트에 대해 TransactionalTestExecutionListener가 관리하는 트랜잭션) 또는 @SqlConfig에서
transactionMode 특성의 구성된 값과 테스트의 ApplicationContext에 PlatformTransactionManager가
있는지 여부에 따라 달라지는 격리된 트랜잭션 내에서 실행된다. 그러나 최소한 테스트의 ApplicationContext 내에
javax.sql.DataSource가 존재해야 한다.

DataSource 및 PlatformTransactionManager를 검색하고 트랜잭션 의미를 유추하는 SqlScriptsTestExecutionListener
에서 사용하는 알고리즘이 사용자의 요구와 맞지 않는 경우, @SqlConfig의 dataSource 및 transactionManager
요소를 명시적인 이름으로 설정할 수 있다. 또한 @SqlConfig의 transactionMode를 설정하여 트랜잭션
전파 동작을 제어(예: 스크립트를 분리된 트랜잭션에서 실행할지 여부)할 수 있다. @Sql을 사용한 트랜잭션
관리에 지원되는 모든 옵션에 대한 자세한 설명은 이 참조 매뉴얼의 범위를 벗어나지만, [@SqlConfig](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/context/jdbc/SqlConfig.html)
및 [SqlScriptsTestExecutionListener](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/context/jdbc/SqlScriptsTestExecutionListener.html)의
javadoc은 자세한 정보를 제공하며, 다음 예는 Junit Jupiter 및 @Sql로 트랜잭션 테스트를 사용하는
일반적인 테스트 시나리오를 보여준다.

```java
@SpringJUnitConfig(TestDatabaseConfig.class)
@Transactional
class TransactionalSqlScriptsTests {

    final JdbcTemplate jdbcTemplate;

    @Autowired
    TransactionalSqlScriptsTests(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Test
    @Sql("/test-data.sql")
    void usersTest() {
        // verify state in test database:
        assertNumUsers(2);
        // run code that uses the test data...
    }

    int countRowsInTable(String tableName) {
        return JdbcTestUtils.countRowsInTable(this.jdbcTemplate, tableName);
    }

    void assertNumUsers(int expected) {
        assertEquals(expected, countRowsInTable("user"),
            "Number of rows in the [user] table.");
    }
}
```

usersTest() 메서드를 실행한 후 데이터베이스를 정리할 필요가 없다. 데이터베이스가 변경된 경우(테스트
메서드 내 또는 /test-data 내).SQL 스크립트)는 TransactionalTestExecutionListener에
의해 자동으로 롤백된다(자세한 내용은 [트랜잭션 관리](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-tx)
참조).

### Merging and Overriding Configuration with @SqlMergeMode [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively-script-merging)

Spring Framework 5.2에서는 메서드 수준의 @Sql 선언을 클래스 수준의 선언과 병합할 수 있다.
예를 들어 테스트 클래스당 한 번씩 데이터베이스 스키마 또는 일부 공통 테스트 데이터에 대한 구성을
제공한 다음 테스트 방법당 사용 사례별 테스트 데이터를 추가로 제공할 수 있다. @Sql 병합을 사용하려면
@SqlMergeMode(MERGE)를 사용하여 테스트 클래스 또는 테스트 방법에 주석을 달아야 한다. 특정
테스트 방법(또는 특정 테스트 하위 클래스)에 대해 병합을 비활성화하려면 @SqlMergeMode(OVERRIDE)를
통해 기본 모드로 다시 전환할 수 있다. 예제 및 자세한 내용은 [@SqlMergeMode 주석 문서 섹션](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-testing-annotation-sqlmergemode)을
참조하자.

## 6.WebTestClient [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient)

WebTestClient는 서버 응용 프로그램을 테스트하기 위해 설계된 HTTP 클라이언트이다. Spring의
WebClient를 래핑하여 요청을 수행하는 데 사용하지만 응답을 확인하기 위한 테스트 외관을 노출한다.
WebTestClient를 사용하여 종단 간 HTTP 테스트를 수행할 수 있다. 또한 모의 서버 요청 및 응답
개체를 통해 실행 중인 서버 없이 Spring MVC 및 Spring WebFlux 응용 프로그램을 테스트하는데
사용할 수 있다.

### 6.1. Setup [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-setup)

WebTestClient를 설정하려면 바인딩할 서버 설정을 선택해야 한다. 이것은 여러 모의 서버 설정 선택사항
중 하나이거나 활성 서버에 대한 연결일 수 있다.

### 6.1.1. Bind to Controller [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-controller-config)

이 설정을 사용하면 실행 중인 서버 없이 모의 요청 및 응답 개체를 통해 특정 컨트롤러를 테스트할 수
있다.

WebFlux 응용 프로그램의 경우 다음을 사용하여 [WebFlux Java 구성](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-config)과
동일한 인프라를 로드하고, 지정된 컨트롤러를 등록하고, 요청을 처리할 [WebHandler 체인](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-web-handler-api)을 만든다.

```java
WebTestClient client =
        WebTestClient.bindToController(new TestController()).build();
```

SpringMVC의 경우 다음을 사용하여 [StandaloneMockMvcBuilder](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/web/servlet/setup/StandaloneMockMvcBuilder.html)에
위임하여 [WebMvc Java 구성](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config)과
동일한 인프라를 로드하고, 지정된 컨트롤러를 등록하고, [MockMvc](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-framework)
인스턴스를 생성하여 요청을 처리한다.

```java
WebTestClient client =
        MockMvcWebTestClient.bindToController(new TestController()).build();
```

### 6.1.2. Bind to ApplicationContext [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-context-config)

이 설정을 사용하면 Spring MVC 또는 Spring WebFlux 인프라 및 컨트롤러 선언과 함께 Spring 구성을
로드하고 실행 중인 서버 없이 모의 요청 및 응답 개체를 통해 요청을 처리하는 데 사용할 수 있다.

WebFlux의 경우 Spring ApplicationContext가 [WebHttpHandlerBuilder](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/web/server/adapter/WebHttpHandlerBuilder.html#applicationContext-org.springframework.context.ApplicationContext-)로
전달되는 다음 위치를 사용하여 요청을 처리할 [WebHandler 체인](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-web-handler-api)을 만든다.

```java
@SpringJUnitConfig(WebConfig.class) (1)
class MyTests {

    WebTestClient client;

    @BeforeEach
    void setUp(ApplicationContext context) {  (2)
        client = WebTestClient.bindToApplicationContext(context).build(); (3) 
    }
}
```

- (1) Specify the configuration to load
- (2) Inject the configuration
- (3) Create the WebTestClient

Spring MVC의 경우 Spring ApplicationContext가 [MockMvcBuilders.webAppContextSetup](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/web/servlet/setup/MockMvcBuilders.html#webAppContextSetup-org.springframework.web.context.WebApplicationContext-)로
전달되는 다음 위치를 사용하여 요청을 처리할 [MockMvc](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-framework) 인스턴스를 만든다.

```java
@ExtendWith(SpringExtension.class)
@WebAppConfiguration("classpath:META-INF/web-resources") (1)
@ContextHierarchy({
    @ContextConfiguration(classes = RootConfig.class),
    @ContextConfiguration(classes = WebConfig.class)
})
class MyTests {

    @Autowired
    WebApplicationContext wac; (2)

    WebTestClient client;

    @BeforeEach
    void setUp() {
        client = MockMvcWebTestClient.bindToApplicationContext(this.wac).build(); (3) 
    }
}
```

- (1) Specify the configuration to load
- (2) Inject the configuration
- (3) Create the WebTestClient

### 6.1.3. Bind to Router Function [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-fn-config)

이 설정을 사용하면 실행 중인 서버 없이 모의 요청 및 응답 개체를 통해 [기능 끝점](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-fn)을
테스트할 수 있다.

WebFlux의 경우 다음을 사용하여 RouterFunctions.toWebHandler에 위임하여 요청을 처리하는 서버
설정을 작성한다.

```java
RouterFunction<?> route = ...
client = WebTestClient.bindToRouterFunction(route).build();
```

Spring MVC의 경우 현재 WebMVC [기능 끝점](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#webmvc-fn)을
테스트하는 옵션이 없다.

### 6.1.4. Bind to Server [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-server-config)

이 설정은 실행 중인 서버에 연결하여 전체 종단 간 HTTP 테스트를 수행한다.

```java
client = WebTestClient.bindToServer().baseUrl("http://localhost:8080").build();
```

### 6.1.5. Client Config [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-client-config)

앞에서 설명한 서버 설정 옵션 외에도 기본 URL, 기본 헤더, 클라이언트 필터 등을 포함한 클라이언트 옵션을
구성할 수도 있다. 이러한 옵션은 bindToServer() 이후에 쉽게 사용할 수 있다. 다른 모든 구성 옵션의
경우 다음과 같이 configureClient()를 사용하여 서버에서 클라이언트로 구성을 전환해야 한다.

```java
client = WebTestClient.bindToController(new TestController())
        .configureClient()
        .baseUrl("/test")
        .build();
```

### 6.2. Writing Tests [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-tests)

WebTestClient는 exchange()를 사용하여 요청을 수행할 때까지 [WebClient](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client)와
동일한 API를 제공한다. 양식 데이터, 다중 부분 데이터 등을 포함한 모든 내용으로 요청을 준비하는 방법에 대한 예는 [WebClient](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client-body)
설명서를 참조하자.

exchange() 호출 후 WebTestClient는 WebClient에서 분리되고 대신 응답을 확인하는 워크플로우를
계속한다.

응답 상태 및 헤더를 할당하려면 다음을 사용한다.

```java
client.get().uri("/persons/1")
    .accept(MediaType.APPLICATION_JSON)
    .exchange()
    .expectStatus().isOk()
    .expectHeader().contentType(MediaType.APPLICATION_JSON);
```

둘 중 하나가 실패하더라도 모든 예상을 보장하려면 연결된 여러 expect*(...) 호출 대신 expectAll(...)을
사용할 수 있다. 이 기능은 AssertJ의 소프트 어설션 지원 및 Junit Jupiter의 assertAll() 지원과
유사하다.

```java
client.get().uri("/persons/1")
    .accept(MediaType.APPLICATION_JSON)
    .exchange()
    .expectAll(
        spec -> spec.expectStatus().isOk(),
        spec -> spec.expectHeader().contentType(MediaType.APPLICATION_JSON)
    );
```

다음 중 하나를 통해 응답 본문을 디코딩하도록 선택할 수 있다.

- expectBody(Class&#60;T&#62;): 단일 개체로 디코딩한다.
- expectBodyList(Class&#60;T&#62;): List&#60;T&#62;로 개체를 디코딩하고 수집한다.
- expectBody(): [JSON 콘텐츠](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-json)
  또는 빈 본문에 대해 byte[]로 디코딩한다.

그리고 결과적으로 더 높은 수준의 개체에 대해 어설션을 수행한다.

```java
client.get().uri("/persons")
        .exchange()
        .expectStatus().isOk()
        .expectBodyList(Person.class).hasSize(3).contains(person);
```

기본 제공 어설션이 부족한 경우 개체를 대신 사용하고 다른 어설션을 수행할 수 있다.

```java
client.get().uri("/persons/1")
        .exchange()
        .expectStatus().isOk()
        .expectBody(Person.class)
        .consumeWith(result -> {
            // custom assertions (e.g. AssertJ)...
        });
```

또는 워크플로우를 종료하고 EntityExchangeResult를 가져올 수 있다.

```java
EntityExchangeResult<Person> result = client.get().uri("/persons/1")
        .exchange()
        .expectStatus().isOk()
        .expectBody(Person.class)
        .returnResult();
```

제네릭을 사용하여 대상 유형으로 디코딩해야 할 경우 Class&#60;T&#62; 대신 [ParameterizedTypeReference](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/core/ParameterizedTypeReference.html)를
수락하는 오버로드된 메서드를 찾는다.

### 6.2.1. No Content [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-no-content)

응답에 내용이 없을 경우 다음과 같이 선언할 수 있다.

```java
client.post().uri("/persons")
        .body(personMono, Person.class)
        .exchange()
        .expectStatus().isCreated()
        .expectBody().isEmpty();
```

응답 내용을 무시하려는 경우 다음은 아무 어설션 없이 내용을 릴리스한다.

```java
client.get().uri("/persons/123")
        .exchange()
        .expectStatus().isNotFound()
        .expectBody(Void.class);
```

### 6.2.2. JSON Content [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-json)

대상 유형 없이 expectBody()를 사용하여 상위 수준의 개체를 사용하는 대신 원시 콘텐츠에 대해 어설션을
수행할 수 있다.

[JSONAssert](https://jsonassert.skyscreamer.org/)를 사용하여 전체 JSON 콘텐츠를 확인하는
방법.

```java
client.get().uri("/persons/1")
        .exchange()
        .expectStatus().isOk()
        .expectBody()
        .json("{\"name\":\"Jane\"}")
```

[JSONPath](https://github.com/json-path/JsonPath)를 사용하여 JSON 콘텐츠를 확인하는
방법.

```java
client.get().uri("/persons")
        .exchange()
        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$[0].name").isEqualTo("Jane")
        .jsonPath("$[1].name").isEqualTo("Jason");
```

### 6.2.3. Streaming Responses [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-stream)

"text/event-stream" 또는 "application/x-ndjson"과 같은 잠재적으로 무한한 스트림을 테스트하려면
먼저 응답 상태 및 헤더를 확인한 다음 FluxExchangeResult를 가져온다.

```java
FluxExchangeResult<MyEvent> result = client.get().uri("/events")
        .accept(TEXT_EVENT_STREAM)
        .exchange()
        .expectStatus().isOk()
        .returnResult(MyEvent.class);
```

이제 'reactor-test'의 StepVerifier로 응답 스트림을 사용할 준비가 되었다.

```java
Flux<Event> eventFlux = result.getResponseBody();

StepVerifier.create(eventFlux)
        .expectNext(person)
        .expectNextCount(4)
        .consumeNextWith(p -> ...)
        .thenCancel()
        .verify();
```

### 6.2.4. MockMvc Assertions [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-mockmvc)

WebTestClient는 HTTP 클라이언트이므로 상태, 헤더 및 본문을 포함하여 클라이언트 응답의 내용만 확인할 수 있습니다.

MockMVC 서버 설정으로 SpringMVC 응용프로그램을 테스트할 때 서버 응답에 대한 추가 어설션을 수행할 수
있다. 본문을 할당한 후 ExchangeResult를 얻는 것으로 시작하려면 다음과 같이 하자:

```java
// For a response with a body
EntityExchangeResult<Person> result = client.get().uri("/persons/1")
        .exchange()
        .expectStatus().isOk()
        .expectBody(Person.class)
        .returnResult();

// For a response without a body
EntityExchangeResult<Void> result = client.get().uri("/path")
        .exchange()
        .expectBody().isEmpty();
```

그런 다음 MockMvc 서버 응답 어설션으로 전환한다.

```java
MockMvcWebTestClient.resultActionsFor(result)
        .andExpect(model().attribute("integer", 3))
        .andExpect(model().attribute("string", "a string value"));
```

## 7.MockMvc [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-framework)

MockMvc라고도 하는 Spring MVC Test 프레임워크는 Spring MVC 애플리케이션 테스트를 지원한다.
실행 중인 서버 대신 모의 요청 및 응답 개체를 통해 전체 Spring MVC 요청 처리를 수행한다.

MockMvc는 자체적으로 요청을 수행하고 응답을 확인하는 데 사용할 수 있다. MockMvc가 요청을 처리할
서버로 연결된 WebTestClient를 통해 사용할 수도 있다. WebTestClient의 장점은 원시 데이터 대신
상위 수준의 개체로 작업할 수 있는 옵션과 라이브 서버에 대한 전체 엔드 투 엔드 HTTP 테스트로 전환하고
동일한 테스트 API를 사용할 수 있다는 것이다.

### 7.1. Overview [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server)

컨트롤러를 인스턴스화하고 종속성을 주입한 다음 해당 메서드를 호출하여 Spring MVC에 대한 일반 단위 검정을
작성할 수 있다. 그러나 이러한 테스트는 요청 매핑, 데이터 바인딩, 메시지 변환, 유형 변환, 유효성 검사를
수행하지 않으며 지원되는 @InitBinder, @ModelAttribute 또는 @ExceptionHandler 메서드도
포함하지 않는다.

MockMvc라고도 하는 Spring MVC Test 프레임워크는 실행 중인 서버가 없는 Spring MVC 컨트롤러에 대해
보다 완벽한 테스트를 제공하는 것을 목표로 한다. 이는 DispatcherServlet을 호출하고 실행 중인 서버 없이
전체 Spring MVC 요청 처리를 복제하는 스프링 테스트 모듈에서 [Servlet API의 "mock" 구현](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#mock-objects-servlet)을
전달함으로써 수행된다.

MockMvc는 경량 및 표적 테스트를 사용하여 Spring MVC 응용프로그램의 대부분의 기능을 확인할 수 있는 서버
측 테스트 프레임워크이다. 요청을 수행하고 응답을 확인하기 위해 자체적으로 사용하거나 MockMvc가 연결된 상태에서
[WebTestClient](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient)
API를 통해 요청을 처리할 서버로 사용할 수도 있다.

### 7.2. Static Imports [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-static-imports)

MockMvc를 직접 사용하여 요청을 수행하는 경우 다음에 대한 정적 가져오기가 필요하다.

- MockMvcBuilders.*
- MockMvcRequestBuilders.*
- MockMvcResultMatchers.*
- MockMvcResultHandlers*

기억하기 쉬운 방법은 MockMvc*를 검색하는 것이다. Eclipse를 사용하는 경우 Eclipse 환경설정에서 위의
내용을 "즐겨찾기 정적 멤버"로 추가해야 한다.

[WebTestClient](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient)를
통해 MockMvc를 사용하는 경우 정적 가져오기가 필요하지 않습니다. WebTestClient는 정적 가져오기 없이
유창한 API를 제공한다.

### 7.3. Setup Choices [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-setup-options)

MockMvc는 두 가지 방법 중 하나로 설정할 수 있다. 하나는 테스트할 컨트롤러를 직접 가리키고 Spring MVC
인프라를 프로그래밍 방식으로 구성하는 것이다. 두 번째는 스프링 MVC와 컨트롤러 인프라가 포함된 스프링 구성을
가리키는 것이다.

특정 컨트롤러를 테스트하기 위해 MockMvc를 설정하려면 다음을 사용한다.

```java
class MyWebTests {

    MockMvc mockMvc;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(new AccountController()).build();
    }

    // ...

}
```

또는 위와 같은 작성자에게 위임하는 [WebTestClient](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-controller-config)를
통해 테스트할 때 이 설정을 사용할 수도 있다.

Spring을 통한 MockMvc 구성을 설정하려면 다음을 사용한다.

```java
@SpringJUnitWebConfig(locations = "my-servlet-context.xml")
class MyWebTests {

    MockMvc mockMvc;

    @BeforeEach
    void setup(WebApplicationContext wac) {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    // ...

}
```

또는 위와 같은 작성자에게 위임하는 [WebTestClient](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-context-config)를
통해 테스트할 때 이 설정을 사용할 수도 있다.

어떤 설정 옵션을 사용해야 할까?

webAppContextSetup은 실제 Spring MVC 구성을 로드하여 보다 완벽한 통합 테스트를 수행한다.
TestContext 프레임워크는 로드된 Spring 구성을 캐시하므로 테스트 제품군에 더 많은 테스트를 도입하는
경우에도 테스트를 빠르게 실행할 수 있다. 또한 Spring 구성을 통해 모의 서비스를 컨트롤러에 주입하여 웹
계층 테스트에 집중할 수 있다. 다음 예제에서는 Mockito를 사용하여 모의 서비스를 선언한다.

```xml
<bean id="accountService" class="org.mockito.Mockito" factory-method="mock">
    <constructor-arg value="org.example.AccountService"/>
</bean>
```

그런 다음 모의 서비스를 테스트에 주입하여 다음 예와 같이 기대치를 설정하고 확인할 수 있다.

```java
@SpringJUnitWebConfig(locations = "test-servlet-context.xml")
class AccountTests {

    @Autowired
    AccountService accountService;

    MockMvc mockMvc;

    @BeforeEach
    void setup(WebApplicationContext wac) {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    // ...

}
```

반면 standaloneSetup은 단위 테스트에 조금 더 가깝다. 한 번에 하나의 컨트롤러를 테스트한다. 수동으로
컨트롤러에 모의 종속성을 주입할 수 있으며, 스프링 구성을 로드할 필요가 없다. 이러한 테스트는 스타일에 더
중점을 두고 있으며 테스트 중인 컨트롤러, 특정 Spring MVC 구성이 작동해야 하는지 등을 쉽게 확인할 수 있다.
또한 standaloneSetup는 특정 동작을 확인하거나 문제를 디버그하기 위해 임시 테스트를 작성하는 매우 편리한
방법이다.

대부분의 "통합 대 단위 테스트" 논쟁과 마찬가지로 정답도 오답도 없다. 그러나 standaloneSetup를 사용하면
Spring MVC 구성을 확인하기 위해 추가 webAppContextSetup 테스트가 필요하다. 또는 webAppContextSetup으로
모든 테스트를 작성하여 실제 Spring MVC 구성에 대해 항상 테스트할 수 있다.

### 7.4. Setup Features [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-setup-steps)

어떤 MockMvc 빌더를 사용하든 모든 MockMvcBuilder 구현은 몇 가지 공통적이고 매우 유용한 기능을 제공한다.
예를 들어, 다음과 같이 모든 요청에 대해 Accept 헤더를 선언하고 상태를 200으로 예상하고 모든 응답에 Content-Type
헤더를 지정할 수 있다.

```java
// static import of MockMvcBuilders.standaloneSetup

MockMvc mockMvc = standaloneSetup(new MusicController())
    .defaultRequest(get("/").accept(MediaType.APPLICATION_JSON))
    .alwaysExpect(status().isOk())
    .alwaysExpect(content().contentType("application/json;charset=UTF-8"))
    .build();
```

또한 타사 프레임워크(및 애플리케이션)는 MockMvcConfigurer와 같은 설정 지침을 사전 패키지화할 수
있다. Spring Framework에는 요청 간에 HTTP 세션을 저장하고 재사용하는 데 도움이 되는 이러한 기본
제공 구현이 있다. 다음과 같이 사용할 수 있다.

```java
// static import of SharedHttpSessionConfigurer.sharedHttpSession

MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new TestController())
        .apply(sharedHttpSession())
        .build();

// Use mockMvc to perform requests...
```

모든 MockMvc 빌더 기능 목록은 javadoc에 [ConfigurableMockMvcBuilder](https://docs.spring.io/spring-framework/docs/6.0.7/javadoc-api/org/springframework/test/web/servlet/setup/ConfigurableMockMvcBuilder.html)를
참조하거나 IDE를 사용하여 사용 가능한 옵션을 탐색한다.

### 7.5. Performing Requests [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-performing-requests)

이 섹션에서는 MockMvc를 자체적으로 사용하여 요청을 수행하고 응답을 확인하는 방법을 보여준다다. WebTestClient를
통해 MockMvc를 사용하는 경우 대신 [Writing Tests](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient-tests)의
해당 섹션을 참조하자.

다음 예제와 같이 HTTP 방법을 사용하는 요청을 수행한다.

```java
// static import of MockMvcRequestBuilders.*

mockMvc.perform(post("/hotels/{id}", 42).accept(MediaType.APPLICATION_JSON));
```

또한 MockMultipartHttpServletRequest를 내부적으로 사용하는 파일 업로드 요청을 수행하여 다중 파트
요청의 실제 구문 분석을 수행할 수 있다. 대신 다음 예제와 유사하게 설정해야 한다.

```java
mockMvc.perform(multipart("/doc").file("a1", "ABC".getBytes("UTF-8")));
```

다음 예제에서 알 수 있듯이 URI 템플릿 스타일로 쿼리 매개 변수를 지정할 수 있다.

```java
mockMvc.perform(get("/hotels?thing={thing}", "somewhere"));
```

또한 다음 예제와 같이 쿼리 또는 양식 매개 변수를 나타내는 Servlet 요청 매개 변수를 추가할 수 있다.

```java
mockMvc.perform(get("/hotels").param("thing", "somewhere"));
```

응용 프로그램 코드가 서블릿 요청 매개 변수에 의존하고 쿼리 문자열을 명시적으로 확인하지 않는 경우(대부분의
경우처럼), 사용하는 옵션은 중요하지 않다. 그러나 URI 템플릿과 함께 제공된 쿼리 매개 변수는 디코딩되지만
매개 변수(…) 메서드를 통해 제공된 요청 매개 변수는 이미 디코딩된다.

대부분의 경우 컨텍스트 경로와 서블릿 경로는 요청 URI에서 제외하는 것이 좋다. 전체 요청 URI를 사용하여
테스트해야 하는 경우 다음 예제와 같이 요청 매핑이 작동하도록 contextPath 및 servletPath를 적절하게
설정해야 한다.

```java
mockMvc.perform(get("/app/main/hotels/{id}").contextPath("/app").servletPath("/main"))
```

위의 예에서는 수행된 모든 요청에 대해 contextPath 및 servletPath를 설정하는 것이 번거로울 수 있다.
대신 다음 예제와 같이 기본 요청 속성을 설정할 수 있다.

```java
class MyWebTests {

  MockMvc mockMvc;

  @BeforeEach
  void setup() {
    mockMvc = standaloneSetup(new AccountController())
            .defaultRequest(get("/")
                    .contextPath("/app").servletPath("/main")
                    .accept(MediaType.APPLICATION_JSON)).build();
  }
}
```

앞의 속성은 MockMvc 인스턴스를 통해 수행되는 모든 요청에 영향을 준다. 동일한 속성이 지정된 요청에도 지정된
경우 기본값을 재정의한다. HTTP 메서드와 기본 요청의 URI는 모든 요청에 대해 지정되어야 하기 때문에 중요하지
않다.

### 7.6. Defining Expectations [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-defining-expectations)

다음 예제에서 볼 수 있듯이 요청을 수행한 후 하나 이상의 andExpect(..) 호출을 추가하여 기대치를 정의할
수 있다. 하나의 기대가 실패하는 순간, 다른 기대는 주장되지 않는다.

```java
// static import of MockMvcRequestBuilders.* and MockMvcResultMatchers.*

mockMvc.perform(get("/accounts/1")).andExpect(status().isOk());
```

다음 예제에서 볼 수 있듯이 요청을 수행한 후 andExpectAll(..)을 추가하여 여러 기대치를 정의할 수
있다. andExpect(..)와 달리 andExpectAll(..)는 제공된 모든 기대 사항이 보장되고 모든 장애가
추적 및 보고된다.

```java
// static import of MockMvcRequestBuilders.* and MockMvcResultMatchers.*

mockMvc.perform(get("/accounts/1")).andExpectAll(
    status().isOk(),
    content().contentType("application/json;charset=UTF-8"));
```

MockMvcResultMatchers.*는 다양한 기대 사항을 제공하며, 그 중 일부는 더 자세한 기대 사항으로 중첩된다.

기대는 두 가지 일반적인 범주로 나뉜다. 첫 번째 범주의 어설션은 응답의 속성(예: 응답 상태, 헤더 및 내용)을
확인한다. 이것들은 주장해야 할 가장 중요한 결과이다.

두 번째 범주의 주장은 응답을 넘어선다. 이러한 주장을 통해 요청을 처리하는 컨트롤러 방법, 예외 발생 및 처리
여부, 모델의 내용, 선택된 보기, 추가된 플래시 특성 등과 같은 Spring MVC 관련 측면을 검사할 수 있다.
또한 요청 및 세션 속성과 같은 서블릿의 특정 측면을 검사할 수 있다.

다음 테스트에서는 바인딩 또는 유효성 검사에 실패했다고 주장한다.

```java
mockMvc.perform(post("/persons"))
    .andExpect(status().isOk())
    .andExpect(model().attributeHasErrors("person"));
```

대부분의 경우 테스트를 작성할 때 수행된 요청의 결과를 출력하는 것이 유용하다. 다음과 같이 할 수 있다.
여기서 print()은 MockMvcResultHandlers에서 정적으로 가져온 것이다.

```java
mockMvc.perform(post("/persons"))
    .andDo(print())
    .andExpect(status().isOk())
    .andExpect(model().attributeHasErrors("person"));
```

요청 처리로 인해 처리되지 않은 예외가 발생하지 않는 한 print() 메서드는 사용 가능한 모든 결과 데이터를
System.out에 출력한다. 또한, log() 메서드를 이용하거나 OutputStream이나 Writer를 이용하는
print() 메서드와는 다른 두 가지 추가적인 방법이 존재한다. 예를 들어 print(System.err)를 호출하면
결과 데이터가 System.err에 출력되고 print(myWriter)를 호출하면 결과 데이터가 사용자 정의 writer에
출력된다. 결과 데이터를 출력하는 대신 기록하려면 결과 데이터를 org.springframework.test.web.servlet.result
로깅 범주 아래에 단일 DEBUG 메시지로 기록하는 log() 메서드를 호출하면 된다.

경우에 따라 결과에 직접 액세스하여 확인할 수 없는 내용을 확인해야 할 수도 있다. 이는 다음 예에서 알 수
있듯이 다른 모든 예상 후에 .andReturn()를 추가하여 달성할 수 있다.

```java
MvcResult mvcResult = mockMvc.perform(post("/persons")).andExpect(status().isOk()).andReturn();
// ...
```

모든 테스트가 동일한 기대치를 반복하는 경우 다음 예에서 볼 수 있듯이 MockMvc 인스턴스를 구축할 때 공통
기대치를 한 번 설정할 수 있다.

```java
standaloneSetup(new SimpleController())
    .alwaysExpect(status().isOk())
    .alwaysExpect(content().contentType("application/json;charset=UTF-8"))
    .build()
```

공통 기대치는 항상 적용되며 별도의 MockMvc 인스턴스를 만들지 않고는 재정의할 수 없다.

JSON 응답 콘텐츠에 [Spring HATEOAS](https://github.com/spring-projects/spring-hateoas)로
생성된 하이퍼미디어 링크가 포함되어 있는 경우 다음 예제와 같이 JsonPath 식을 사용하여 결과 링크를 확인할
수 있다.

```java
mockMvc.perform(get("/people").accept(MediaType.APPLICATION_JSON))
    .andExpect(jsonPath("$.links[?(@.rel == 'self')].href").value("http://localhost:8080/people"));
```

XML 응답 콘텐츠에 [Spring HATEOAS](https://github.com/spring-projects/spring-hateoas)로
생성된 하이퍼미디어 링크가 포함된 경우 XPath 식을 사용하여 결과 링크를 확인할 수 있다.

```java
Map<String, String> ns = Collections.singletonMap("ns", "http://www.w3.org/2005/Atom");
mockMvc.perform(get("/handle").accept(MediaType.APPLICATION_XML))
    .andExpect(xpath("/person/ns:link[@rel='self']/@href", ns).string("http://localhost:8080/people"));
```

### 7.7. Async Requests [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-async-requests)

이 섹션에서는 MockMvc를 자체적으로 사용하여 비동기 요청 처리를 테스트하는 방법을 보여 준다. [WebTestClient](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient)를
통해 MockMvc를 사용하는 경우 WebTestClient가 이 절에 설명된 작업을 자동으로 수행하므로 비동기 요청이
작동하도록 하기 위해 특별히 수행할 작업은 없다.

[Spring MVC에서 지원](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-async)되는
서블릿 비동기 요청은 서블릿 컨테이너 스레드를 종료하고 응용 프로그램이 응답을 비동기적으로 계산하도록 허용하는
방식으로 작동하며, 그 후 서블릿 컨테이너 스레드에서 처리를 완료하기 위해 비동기 디스패치가 수행된다.

Spring MVC Test에서는 먼저 생성된 비동기 값을 어설션한 다음 비동기 디스패치를 수동으로 수행하고 마지막으로
응답을 확인하여 비동기 요청을 테스트할 수 있다. 다음은 리액터 Mono와 같은 DeferredResult, Callable
또는 반응성 유형을 반환하는 컨트롤러 방법에 대한 테스트 예제이다.

```java
// static import of MockMvcRequestBuilders.* and MockMvcResultMatchers.*

@Test
void test() throws Exception {
    MvcResult mvcResult = this.mockMvc.perform(get("/path"))
            .andExpect(status().isOk()) (1)
            .andExpect(request().asyncStarted()) (2)
            .andExpect(request().asyncResult("body")) (3)
            .andReturn();

    this.mockMvc.perform(asyncDispatch(mvcResult)) (4)
            .andExpect(status().isOk()) (5)
            .andExpect(content().string("body"));
}
```

- (1) 응답 상태가 여전히 변경되지 않았는지 확인
- (2) 비동기 처리가 시작
- (3) 비동기 결과를 기다리고 확인
- (4) 실행 중인 컨테이너가 없으므로 수동으로 ASYNC 디스패치 수행
- (5) 최종 응답 확인

### 7.8. Streaming Responses [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-vs-streaming-response)

Server-Sent Events와 같은 스트리밍 응답을 테스트하는 가장 좋은 방법은 실행 중인 서버 없이 Spring
MVC 컨트롤러에서 테스트를 수행하기 위해 MockMvc 인스턴스에 연결하는 테스트 클라이언트로 사용할 수 있는
[WebTestClient](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#webtestclient)를
사용하는 것이다.

```java
WebTestClient client = MockMvcWebTestClient.bindToController(new SseController()).build();

FluxExchangeResult<Person> exchangeResult = client.get()
        .uri("/persons")
        .exchange()
        .expectStatus().isOk()
        .expectHeader().contentType("text/event-stream")
        .returnResult(Person.class);

// Use StepVerifier from Project Reactor to test the streaming response

StepVerifier.create(exchangeResult.getResponseBody())
        .expectNext(new Person("N0"), new Person("N1"), new Person("N2"))
        .expectNextCount(4)
        .consumeNextWith(person -> assertThat(person.getName()).endsWith("7"))
        .thenCancel()
        .verify();
```

또한 WebTestClient는 활성 서버에 연결하고 전체 종단 간 통합 테스트를 수행할 수 있다. [실행 중인 서버](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing.spring-boot-applications.with-running-server)를
테스트할 수 있는 Spring Boot에서도 지원된다.

### 7.9. Filter Registrations [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-filters)

MockMvc 인스턴스를 설정할 때 다음 예제와 같이 하나 이상의 Servlet Filter 인스턴스를 등록할 수 있다.

```java
mockMvc = standaloneSetup(new PersonController()).addFilters(new CharacterEncodingFilter()).build();
```

등록된 필터는 스프링 테스트부터 MockFilterChain을 통해 호출되며 마지막 필터는 DispatcherServlet에
위임된다.

### 7.10. MockMvc vs End-to-End Tests [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-vs-end-to-end-integration-tests)

MockMvc는 spring-test 모듈의 Servlet API 모의 구현을 기반으로 하며 실행 중인 컨테이너에 의존하지
않는다. 따라서 실제 클라이언트 및 실행 중인 활성 서버를 사용하는 전체 엔드 투 엔드 통합 테스트와 비교할
때 몇 가지 차이점이 있다.

이것에 대해 생각하는 가장 쉬운 방법은 비어있는 MockHttpServletRequest로 시작하는 것이다. 무엇을
추가하든 간에 요청이 된다. 기본적으로 컨텍스트 경로, jsessionid 쿠키, 전달, 오류 또는 비동기 발송이
없으므로 실제 JSP 렌더링이 없다. 대신, "전송" 및 "리다이렉트" URL은 MockHttpServletResponse에
저장되며 예상과 함께 할당될 수 있다.

즉, JSP를 사용하는 경우 요청이 전달된 JSP 페이지를 확인할 수 있지만 HTML은 렌더링되지 않는다. 즉,
JSP는 호출되지 않는다. 그러나 Thymeleaf 및 Freemarker와 같이 전달에 의존하지 않는 다른 모든 렌더링
기술은 예상대로 응답 본문에 HTML을 렌더링한다. @ResponseBody 메서드를 통해 JSON, XML 및 기타
형식을 렌더링하는 경우에도 마찬가지이다.

또는 @SpringBootTest를 사용한 SpringBoot의 전체 통합 테스트 지원을 고려할 수 있다.
[스프링 부트 참조 가이드](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)를
참조하자.

각 접근 방식에는 장단점이 있다. Spring MVC Test에 제공되는 옵션은 기존 단위 테스트에서 완전 통합
테스트에 이르기까지 스케일 상의 다양한 중단점이다. 확실히, Spring MVC Test의 어떤 옵션도 고전적인
단위 테스트의 범주에 속하지 않지만, 그것들은 단위 테스트의 범주에 조금 더 가깝다. 예를 들어, 모의 서비스를
컨트롤러에 주입하여 웹 계층을 분리할 수 있다. 이 경우 DispatcherServlet을 통해서만 웹 계층을
테스트하고 실제 Spring 구성을 사용하여 웹 계층을 테스트한다. 이 경우 데이터 액세스 계층을 위의 계층과
분리하여 테스트할 수 있다. 또한 독립 실행형 설정을 사용하여 한 번에 하나의 컨트롤러에 초점을 맞추고
작동하는 데 필요한 구성을 수동으로 제공할 수 있다.

Spring MVC Test를 사용할 때의 또 다른 중요한 차이점은 개념적으로 이러한 테스트가 서버 측이기 때문에
사용된 핸들러, HandlerExceptionResolver를 사용하여 예외를 처리한 경우 모델의 내용, 바인딩 오류
및 기타 세부 정보를 확인할 수 있다. 이는 서버가 실제 HTTP 클라이언트를 통해 테스트할 때처럼 불투명 상자가
아니기 때문에 예상치를 기록하는 것이 더 쉽다는 것을 의미한다. 이는 일반적으로 고전적인 단위 테스트의 장점이다:
쓰기, 추론 및 디버그가 더 쉽지만 전체 통합 테스트의 필요성을 대체하지는 않는다. 동시에, 대응이 가장 중요한
것이라는 사실을 간과하지 않는 것이 중요하다. 간단히 말해서, 여기에는 동일한 프로젝트 내에서도 여러 가지
스타일과 테스트 전략을 사용할 수 있는 여지가 있다.

### 7.11. Further Examples [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#spring-mvc-test-server-resources)

프레임워크 자체 테스트에는 자체적으로 또는 WebTestClient를 통해 MockMvc를 사용하는 방법을 보여주는
[많은 샘플 테스트](https://github.com/spring-projects/spring-framework/tree/main/spring-test/src/test/java/org/springframework/test/web/servlet/samples)가
포함된다. 자세한 아이디어는 다음 예제를 참조하자.

# Data Access

참조 문서의 이 부분은 데이터 액세스 및 데이터 액세스 계층과 비즈니스 또는 서비스 계층 간의 상호 작용에
관한 것이다.

Spring의 포괄적인 트랜잭션 관리 지원은 Spring Framework가 통합되는 다양한 데이터 액세스 프레임워크
및 기술에 대해 자세히 설명한다.

## Transaction Management [#](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)

포괄적인 트랜잭션 지원은 Spring Framework를 사용해야 하는 가장 강력한 이유 중 하나이다. Spring
Framework는 다음과 같은 이점을 제공하는 트랜잭션 관리를 위한 일관된 추상화를 제공한다.

- Java Transaction API(JTA), JDBC, Hibernate 및 Java Persistence API(JPA)와
- 같은 다양한 트랜잭션 API 간의 일관된 프로그래밍 모델이다.
- [선언적 트랜잭션 관리](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction-declarative)를
  지원한다.
- JTA와 같은 복잡한 트랜잭션 API보다 [프로그래밍 방식의 트랜잭션 관리](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction-programmatic)를
  위한 간단한 API이다.
- Spring의 데이터 액세스 추상화와 완벽하게 통합된다.

다음 섹션에서는 Spring Framework의 트랜잭션 기능과 기술에 대해 설명한다.

- [Spring Framework의 트랜잭션 지원 모델의 장점](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction-motivation)은
  EJB CMT(Container-Managed Transactions) 대신 Spring Framework의 트랜잭션 추상화를
  사용하거나 Hibernate와 같은 독점 API를 통해 로컬 트랜잭션을 구동하는 이유를 설명한다.
- Spring Framework 트랜잭션 추상화에 대한 이해는 핵심 클래스의 개요를 설명하고 다양한 소스에서
  데이터 소스 인스턴스를 구성하고 가져오는 방법을 설명한다.
- 리소스를 트랜잭션과 동기화하는 방법은 응용 프로그램 코드가 리소스를 생성, 재사용 및 정리하는 방법을
  설명한다.
- 선언적 트랜잭션 관리는 선언적 트랜잭션 관리에 대한 지원을 설명한다.
- 프로그래밍 방식 트랜잭션 관리에서는 프로그래밍 방식(즉, 명시적으로 코딩된) 트랜잭션 관리를 지원한다.
- 트랜잭션 바인딩 이벤트는 트랜잭션 내에서 응용 프로그램 이벤트를 사용하는 방법을 설명한다.

