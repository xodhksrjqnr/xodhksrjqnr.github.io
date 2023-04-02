# Testing

<br>

## 5.10. Executing SQL Scripts [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql)

관계형 데이터베이스와 관련된 통합 테스트를 작성할 때, SQL 스크립트를 실행해 스키마를 수정하거나
테이블에 테스트 데이터를 삽입하는 방식은 매우 유용하다. Spring-jdbc 모듈은 Spring 
ApplicationContext가 로드될 때 SQL 스크립트를 실행하여 내장형 또는 기존 데이터베이스를
초기할 수 있도록 지원한다. 자세한 내용은 [내장형 데이터베이스 지원](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-embedded-database-support)
및 [내장형 데이터베이스를 사용한 데이터 액세스 로직 테스트](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc-embedded-database-dao-testing)를 참조하자.

ApplicationContext가 로드될 때 테스트를 위해 데이터베이스를 초기화하는 것이 매우 유용하지만,
통합 테스트 중에 데이터베이스를 수정할 수 있어야 하는 경우도 있다. 다음 섹션에서는 통합 테스트 중에
SQL 스크립트를 프로그래밍 방식으로 선언적으로 실행하는 방법을 설명한다.

<br>

## 5.10.1. Executing SQL scripts programmatically [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-programmatically)

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

## 5.10.2. Executing SQL scripts declaratively with @Sql [#](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-executing-sql-declaratively)

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

<br>

# Data Access

참조 문서의 이 부분은 데이터 액세스 및 데이터 액세스 계층과 비즈니스 또는 서비스 계층 간의 상호 작용에
관한 것이다.

Spring의 포괄적인 트랜잭션 관리 지원은 Spring Framework가 통합되는 다양한 데이터 액세스 프레임워크
및 기술에 대해 자세히 설명한다.

<br>

## Transaction Management [#](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)

포괄적인 트랜잭션 지원은 Spring Framework를 사용해야 하는 가장 강력한 이유 중 하나이다. Spring
Framework는 다음과 같은 이점을 제공하는 트랜잭션 관리를 위한 일관된 추상화를 제공한다.

- Java Transaction API(JTA), JDBC, Hibernate 및 Java Persistence API(JPA)와
- 같은 다양한 트랜잭션 API 간의 일관된 프로그래밍 모델이다.
- 선언적 트랜잭션 관리를 지원한다.
- JTA와 같은 복잡한 트랜잭션 API보다 프로그래밍 방식의 트랜잭션 관리를 위한 간단한 API이다.
- Spring의 데이터 액세스 추상화와 완벽하게 통합된다.

다음 섹션에서는 Spring Framework의 트랜잭션 기능과 기술에 대해 설명한다.

