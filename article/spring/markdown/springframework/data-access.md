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
