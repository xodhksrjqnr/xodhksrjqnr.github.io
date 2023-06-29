# 전제조건 [#](https://docs.spring.io/spring-security/reference/prerequisites.html)

Spring Security를 사용하려면 `Java 8` 이상의 런타임 환경이 필요하다.

Spring Security는 독립적인 방식으로 작동하는 것을 목표로 하므로 Java Runtime Environment에
특별한 구성 파일을 배치할 필요가 없다. 특히 특수 JAAS(Java Authentication and Authorization
Service) 정책 파일을 구성하거나 Spring Security를 공통 클래스 경로 위치에 배치할 필요가 없다.

마찬가지로, EJB 컨테이너 또는 서블릿 컨테이너를 사용하는 경우, 특별한 구성 파일을 아무 곳에나 둘 필요도
없고 서버 클래스 로더에 Spring Security를 포함할 필요도 없다. 필요한 모든 파일이 응용 프로그램에
포함되어 있다.

이 설계는 JAR, WAR 또는 EAR 등의 대상 아티팩트를 시스템 간에 복사할 수 있으므로 배포 시간이 최대한
유연하다.