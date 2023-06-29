# Spring Security를 가져오는 중 [#](https://docs.spring.io/spring-security/reference/getting-spring-security.html)

이 섹션에서는 Spring Security 바이너리를 가져오는 방법에 대해 설명한다. 소스 코드를 얻는 방법은 소스
코드를 참조하자.

## 릴리스 번호 지정

Spring Security 버전은 다음과 같이 MAJOR.MINOR.PATCH로 포맷된다:

- `MAJOR` 버전에는 변경 사항이 포함될 수 있다. 일반적으로 이러한 작업은 최신 보안 관행에 맞게 향상된
보안을 제공하기 위해 수행된다.
- `MINOR` 버전에는 향상된 기능이 포함되어 있지만 수동 업데이트로 간주된다.
- `PATCH` 수준은 버그를 수정하는 변경 사항을 제외하고 전방과 후방에서 완벽하게 호환되어야 한다.

## Maven과 함께 사용

대부분의 오픈 소스 프로젝트처럼 Spring Security는 종속성을 Maven 아티팩트로 배포한다. 이 섹션의
항목에서는 Maven을 사용할 때 Spring Security를 사용하는 방법에 대해 설명한다.

## Spring Boot with Maven

Spring Boot은 Spring Security 관련 종속성을 집계하는 `spring-boot-starter-security`
스타터를 제공한다. 스타터를 사용하는 가장 간단하고 선호되는 방법은 (이클립스 또는 IntelliJ, NetBeans)
또는 `start.spring.io` 를 통해 IDE 통합을 사용하여 스프링 이니셜라이저를 사용하는 것이다. 또는 다음
예와 같이 스타터를 수동으로 추가할 수 있다:

```
<dependencies>
	<!-- ... other dependency elements ... -->
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-security</artifactId>
	</dependency>
</dependencies>
```

Spring Boot은 종속성 버전을 관리하기 위한 Maven BOM을 제공하므로 버전을 지정할 필요가 없다.
Spring Security 버전을 재정의하려면 Maven 속성을 제공하여 이를 수행할 수 있다:

```
<properties>
	<!-- ... -->
	<spring-security.version>6.1.1</spring-security.version>
</properties>
```

Spring Security는 주요 릴리스에서만 변경 사항을 적용하므로 Spring Security의 최신 버전을
Spring Boot과 함께 안전하게 사용할 수 있다. 그러나 때로는 Spring Framework 버전도 업데이트해야 할
수 있다. Maven 속성을 추가하여 이를 수행할 수 있다:

```
<properties>
	<!-- ... -->
	<spring.version>6.0.10</spring.version>
</properties>
```

LDAP, OAuth2 등의 추가 기능을 사용하는 경우 적절한 프로젝트 모듈 및 종속성도 포함해야 한다.

## Maven Without Spring Boot

Spring Security를 Spring Boot 없이 사용할 경우 Spring Security의 BOM을 사용하여 프로젝트
전체에서 일관된 버전의 Spring Security가 사용되도록 하는 것이 좋다. 다음 예제에서는 이 작업을 수행하는
방법을 보여 준다:

```
<dependencyManagement>
	<dependencies>
		<!-- ... other dependency elements ... -->
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-bom</artifactId>
			<version>{spring-security-version}</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
```

일반적으로 최소 Spring Security Maven 종속성 집합은 다음과 같다:

```
<dependencies>
	<!-- ... other dependency elements ... -->
	<dependency>
		<groupId>org.springframework.security</groupId>
		<artifactId>spring-security-web</artifactId>
	</dependency>
	<dependency>
		<groupId>org.springframework.security</groupId>
		<artifactId>spring-security-config</artifactId>
	</dependency>
</dependencies>
```

LDAP, OAuth2 등의 추가 기능을 사용하는 경우 적절한 프로젝트 모듈 및 종속성도 포함해야 한다.

Spring Security는 Spring Framework 6.0.10을 기반으로 빌드되지만 일반적으로 Spring
Framework 5.x의 최신 버전과 함께 작동해야 한다. 많은 사용자가 Spring Security의 과도 종속성으로
인해 Spring Framework 6.0.10이 해결되므로 이상한 클래스 경로 문제가 발생할 수 있다. 이 문제를
해결하는 가장 쉬운 방법은 `pom.xml`의 `<dependencyManagement>` 섹션에 있는
`spring-framework-bom`을 사용하는 것이다:

```
<dependencyManagement>
	<dependencies>
		<!-- ... other dependency elements ... -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-framework-bom</artifactId>
			<version>6.0.10</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
```

위의 예에서는 Spring Security의 모든 과도 종속성이 Spring 6.0.10 모듈을 사용하도록 보장한다.

> 이 접근 방식은 Maven의 "BOM(Bill of Materials)" 개념을 사용하며, Maven 2.0.9+에서만
> 사용할 수 있다. 종속성 해결 방법에 대한 자세한 내용은 [Maven의 종속성 메커니즘 소개 문서](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)를
> 참조하자.

## Maven Repositories

모든 GA 릴리스(즉, `.REASE`로 끝나는 버전)는 Maven Central에 배포되므로 POM에 추가 Maven
저장소를 선언할 필요가 없다.

스냅샷 버전을 사용하는 경우 Spring 스냅샷 저장소가 정의되어 있는지 확인해야 한다:

```
<repositories>
	<!-- ... possibly other repository elements ... -->
	<repository>
		<id>spring-snapshot</id>
		<name>Spring Snapshot Repository</name>
		<url>https://repo.spring.io/snapshot</url>
	</repository>
</repositories>
```

마일스톤 또는 릴리스 후보 버전을 사용하는 경우 다음 예와 같이 스프링 마일스톤 저장소가 정의되어 있는지
확인해야 한다:

```
<repositories>
	<!-- ... possibly other repository elements ... -->
	<repository>
		<id>spring-milestone</id>
		<name>Spring Milestone Repository</name>
		<url>https://repo.spring.io/milestone</url>
	</repository>
</repositories>
```

## Gradle

대부분의 오픈 소스 프로젝트와 마찬가지로 Spring Security는 종속성을 Maven 아티팩트로 배포하여 1등급
Gradle 지원을 가능하게 한다. 다음 항목에서는 Gradle을 사용할 때 Spring Security를 사용하는
방법에 대해 설명한다.

## Spring Boot with Gradle

Spring Boot은 Spring Security 관련 종속성을 집계하는 `spring-boot-starter-security`
스타터를 제공한다. 스타터를 사용하는 가장 간단하고 선호되는 방법은 (이클립스 또는 IntelliJ, NetBeans)
또는 `start.spring.io` 를 통해 IDE 통합을 사용하여 스프링 이니셜라이저를 사용하는 것이다.

또는 스타터를 수동으로 추가할 수 있다:

```
dependencies {
	compile "org.springframework.boot:spring-boot-starter-security"
}
```

Spring Boot은 종속성 버전을 관리하기 위한 Maven BOM을 제공하므로 버전을 지정할 필요가 없다.
Spring Security 버전을 재정의하려면 Gradle 속성을 제공하여 이를 수행할 수 있다:

```
ext['spring-security.version']='6.1.1'
```

Spring Security는 주요 릴리스에서만 변경 사항을 적용하므로 Spring Security의 최신 버전을
Spring Boot와 함께 안전하게 사용할 수 있다. 그러나 때로는 Spring Framework 버전도 업데이트해야
할 수 있다. Gradle 속성을 추가하여 이를 수행할 수 있다:

```
ext['spring.version']='6.0.10'
```

LDAP, OAuth2 등의 추가 기능을 사용하는 경우 적절한 프로젝트 모듈 및 종속성도 포함해야 한다.

## Gradle Without Spring Boot

Spring Security를 Spring Boot 없이 사용할 경우 Spring Security의 BOM을 사용하여 프로젝트
전체에서 일관된 버전의 Spring Security가 사용되도록 하는 것이 좋다. 종속성 관리 플러그인을 사용하여
이 작업을 수행할 수 있다:

```
plugins {
	id "io.spring.dependency-management" version "1.0.6.RELEASE"
}

dependencyManagement {
	imports {
		mavenBom 'org.springframework.security:spring-security-bom:6.1.1'
	}
}
```

일반적으로 최소 Spring Security Maven 종속성 집합은 다음과 같다:

```
dependencies {
	compile "org.springframework.security:spring-security-web"
	compile "org.springframework.security:spring-security-config"
}
```

LDAP, OAuth2 등의 추가 기능을 사용하는 경우 적절한 프로젝트 모듈 및 종속성도 포함해야 한다.

Spring Security는 Spring Framework 6.0.10을 기반으로 빌드되지만 일반적으로 Spring
Framework 5.x의 최신 버전과 함께 작동해야 한다. 많은 사용자가 Spring Security의 과도 종속성으로
인해 Spring Framework 6.0.10이 해결되므로 이상한 클래스 경로 문제가 발생할 수 있다. 이 문제를
해결하는 가장 쉬운 방법은 `build.gradle`의 `dependencyManagement` 섹션에 있는
`spring-framework-bom`을 사용하는 것이다. 종속성 관리 플러그인을 사용하여 이 작업을 수행할 수
있다:

```
plugins {
	id "io.spring.dependency-management" version "1.0.6.RELEASE"
}

dependencyManagement {
	imports {
		mavenBom 'org.springframework:spring-framework-bom:6.0.10'
	}
}
```

위의 예에서는 Spring Security의 모든 과도 종속성이 Spring 6.0.10 모듈을 사용하도록 보장한다.

## Gradle Repositories

모든 GA 릴리스(즉, `.REASE`로 끝나는 버전)는 Maven Central에 배포되므로 GA 릴리스에는
`mavenCentral()` 저장소를 사용하면 충분하다. 다음 예제에서는 이 작업을 수행하는 방법을 보여 준다:

```
repositories {
	mavenCentral()
}
```

스냅샷 버전을 사용하는 경우 Spring 스냅샷 저장소가 정의되어 있는지 확인해야 한다:

```
repositories {
	maven { url 'https://repo.spring.io/snapshot' }
}
```

마일스톤 또는 릴리스 후보 버전을 사용하는 경우 스프링 마일스톤 저장소가 정의되어 있는지 확인해야 한다:

```
repositories {
	maven { url 'https://repo.spring.io/milestone' }
}
```