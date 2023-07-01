# LDAP를 사용하여 사용자 인증 [#](https://spring.io/guides/gs/authenticating-ldap/)

이 안내서에서는 응용 프로그램을 만들고 Spring Security LDAP 모듈을 사용하여 응용 프로그램을 보호하는 프로세스를 안내한다.

## 이번 파트에서 배울 내용

Spring Security의 내장 Java 기반 LDAP 서버로 보호되는 간단한 웹 응용 프로그램을 작성한다. 사용자 집합이 포함된 데이터 파일로 LDAP 서버를 로드한다.

## 전제조건

- 15분 소요
- 즐겨찾기 텍스트 편집기 또는 IDE
- Java 17 이상
- Gradle 7.5+ 또는 Maven 3.5+
- IDE로 직접 코드를 가져올 수도 있다:
  - Spring Tool Suite (STS)
  - IntelliJ IDEA
  - VSCode

## 이 가이드를 완료하는 방법

대부분의 Spring 시작 안내서와 마찬가지로 처음부터 시작하여 각 단계를 완료하거나 이미 익숙한 기본 설정 단계를 생략할 수 있다. 어느 쪽이든, 작동 코드로 끝난다.

처음부터 시작하려면 Starting with Spring Initializr(스프링 이니셜라이저로 시작)으로 이동한다.

기본 사항을 건너뛰려면 다음을 수행한다:

- 이 가이드의 소스 저장소를 다운로드하여 압축을 풀거나 Git: `git clone https://github.com/spring-guides/gs-authenticating-ldap.git` 을 사용하여 복제한다.
- cd into `gs-authenticating-ldap/initial`
- 간단한 웹 컨트롤러를 만들 수 있다.

완료하면 `gs-authenticating-ldap/complete`의 코드와 비교하여 결과를 확인할 수 있습니다.

## Spring Initializr부터 시작

> 이 안내서의 목적은 보안되지 않은 웹 응용 프로그램을 보호하는 것이기 때문에 먼저 보안되지 않은 웹 응용
> 프로그램을 작성하고 안내서의 뒷부분에 Spring Security 및 LDAP 기능에 대한 종속성을 추가한다.

이 미리 초기화된 프로젝트를 사용하고 생성을 클릭하여 ZIP 파일을 다운로드할 수 있습니다. 이 프로젝트는 이 자습서의 예제에 맞게 구성되어 있습니다.

프로젝트를 수동으로 초기화하는 방법:

1. `https://start.spring.io` 으로 이동한다. 이 서비스는 응용 프로그램에 필요한 모든 종속성을 제공하고 대부분의 설정을 대신 수행한다.
2. Gradle 또는 Maven과 사용할 언어를 선택한다. 이 안내서에서는 사용자가 Java를 선택했다고 가정한다.
3. 종속성을 클릭하고 Spring Web을 선택한다.
4. 생성을 클릭한다.
5. 선택한 항목으로 구성된 웹 응용프로그램의 보관 파일인 ZIP 파일을 다운로드한다.

> IDE에 Spring Initializr 통합이 있는 경우 IDE에서 이 프로세스를 완료할 수 있다.

> 또한 Github에서 프로젝트를 포크하여 IDE 또는 다른 편집기에서 열 수 있다.

## 단순 웹 컨트롤러 만들기

Spring에서 REST 엔드포인트는 Spring MVC 컨트롤러이다. `src/main/java/com/example/authenticatingldap/HomeController.java`의 다음 스프링 MVC 컨트롤러는 간단한 메시지를 반환하여 `GET /` 요청을 처리한다:

```java
package com.example.authenticatingldap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

  @GetMapping("/")
  public String index() {
    return "Welcome to the home page!";
  }

}
```

Spring MVC가 내장된 검색 기능을 사용하여 컨트롤러를 자동으로 감지하고 필요한 웹 경로를 자동으로 구성할 수 있도록 전체 클래스가 `@RestController`로 표시된다.

`@RestController`는 또한 Spring MVC에 보기가 없으므로 텍스트를 HTTP 응답 본문에 직접 쓰라고 말한다. 대신 페이지를 방문하면 브라우저에 간단한 메시지가 나타난다(이 안내서의 초점은 LDAP로 페이지를 보호하는 것이기 때문).

## 보안되지 않은 웹 응용 프로그램 구축

웹 응용 프로그램을 보호하기 전에 작동하는지 확인해야 한다. 그러기 위해서는 응용 프로그램 클래스를 만들어 수행할 수 있는 몇 가지 주요 빈을 정의해야 한다. `src/main/java/com/example/authenticatingldap/AuthenticatingLdapApplication.java`의 다음 목록은 해당 클래스를 보여준다:

```java
package com.example.authenticatingldap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthenticatingLdapApplication {

  public static void main(String[] args) {
    SpringApplication.run(AuthenticatingLdapApplication.class, args);
  }

}
```

`@SpringBootApplication`은 다음을 모두 추가한 편리한 주석이다:

- `@Configuration`: 클래스를 응용 프로그램 컨텍스트에 대한 빈 정의의 원본으로 태그를 지정한다.
- `@EnableAutoConfiguration`: 클래스 경로 설정, 다른 bean 및 다양한 속성 설정을 기준으로 bean 추가를 시작하도록 spring boot에 알린다. 예를 들어 spring-webmvc가 클래스 경로에 있는 경우 이 주석은 응용 프로그램을 웹 응용 프로그램으로 플래그를 지정하고 `DispatcherServlet` 설정과 같은 주요 동작을 활성화한다.
- `@ComponentScan`: Spring에게 컨트롤러를 찾을 수 있도록 `com/example` 패키지에서 다른 구성 요소, 구성 및 서비스를 찾으라고 말한다.

`main()` 방법은 Spring Boot의 `SpringApplication.run()` 방법을 사용하여 응용 프로그램을 시작한다. XML이 한 줄도 없다는 것을 눈치챘는가? `web.xml` 파일도 없다. 이 웹 애플리케이션은 100% 순수 Java이므로 배관이나 인프라를 구성할 필요가 없다.

## 실행 파일 JAR 빌드

Gradle 또는 Maven을 사용하여 명령줄에서 응용 프로그램을 실행할 수 있다. 필요한 모든 종속성, 클래스 및 리소스가 포함된 단일 실행 파일 JAR 파일을 생성하여 실행할 수도 있다. 실행 파일 병을 구축하면 개발 라이프사이클 전반, 다양한 환경 등에 걸쳐 서비스를 애플리케이션으로 쉽게 배송, 버전 및 배포할 수 있다.

Gradle을 사용하는 경우 `./gradlew bootRun`를 사용하여 응용 프로그램을 실행할 수 있다. 또는 `./gradlew build`를 사용하여 JAR 파일을 작성한 다음 다음과 같이 JAR 파일을 실행할 수 있다:

```
java -jar build/libs/gs-authenticating-ldap-0.1.0.jar
```

Maven을 사용하는 경우 `./mvnw spring-boot:run`를 사용하여 애플리케이션을 실행할 수 있다. 또는 다음과 같이 `./mvnw clean package`를 사용하여 JAR 파일을 작성한 다음 JAR 파일을 실행할 수 있다:

```
java -jar target/gs-authenticating-ldap-0.1.0.jar
```

여기에 설명된 단계는 실행 가능한 JAR을 만든다. 클래식 WAR 파일을 작성할 수도 있다.

브라우저를 열고 `http://localhost:8080`을 방문하면 다음과 같은 일반 텍스트가 표시된다:

```
Welcome to the home page!
```

## Spring Security 설정

Spring Security를 구성하려면 먼저 빌드에 몇 가지 추가 종속성을 추가해야 한다.

Gradle 기반 빌드의 경우 `build.gradle` 파일에 다음 종속성을 추가한다:

```
implementation("org.springframework.boot:spring-boot-starter-security")
implementation("org.springframework.ldap:spring-ldap-core")
implementation("org.springframework.security:spring-security-ldap")
implementation("com.unboundid:unboundid-ldapsdk")
```

> Gradle의 아티팩트 해상도 문제로 인해 `spring-tx`를 끌어와야 한다. 그렇지 않으면 Gradle은 작동하지
> 않는 오래된 것을 가져온다.

Maven 기반 빌드의 경우 다음 종속성을 `pom.xml` 파일에 추가한다:

```
<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
		<groupId>org.springframework.ldap</groupId>
		<artifactId>spring-ldap-core</artifactId>
</dependency>
<dependency>
		<groupId>org.springframework.security</groupId>
		<artifactId>spring-security-ldap</artifactId>
</dependency>
<dependency>
		<groupId>com.unboundid</groupId>
		<artifactId>unboundid-ldapsdk</artifactId>
</dependency>
```

이러한 종속성은 Spring Security 및 오픈 소스 LDAP 서버인 UnboundId를 추가한다. 그런 다음 `src/main/java/com/example/authenticatingldap/WebSecurityConfig.java`의 다음 예에서 알 수 있듯이 이러한 종속성을 사용하여 순수 Java를 사용하여 보안 정책을 구성할 수 있다:

```java
package com.example.authenticatingldap;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;


@Configuration
public class WebSecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
        .anyRequest().fullyAuthenticated()
        .and()
      .formLogin();

    return http.build();
  }

  @Autowired
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
      .ldapAuthentication()
        .userDnPatterns("uid={0},ou=people")
        .groupSearchBase("ou=groups")
        .contextSource()
          .url("ldap://localhost:8389/dc=springframework,dc=org")
          .and()
        .passwordCompare()
          .passwordEncoder(new BCryptPasswordEncoder())
          .passwordAttribute("userPassword");
  }

}

//@Configuration
//public class WebSecurityConfig {

//  @Bean
//  public SecurityFilterChain configure(HttpSecurity http) throws Exception {
//    return http
//      .authorizeRequests()
//      .anyRequest().authenticated()
//      .and()
//      .formLogin(Customizer.withDefaults())
//      .build();
//  }
//}
```

보안 설정을 사용자 지정하려면 WebSecurityConfigurer를 사용한다. 위의 예에서는 WebSecurityConfigurer 인터페이스를 구현하는 WebSecurityConfigurerAdapter의 메서드를 재정의하여 이 작업을 수행한다.

LDAP 서버도 필요하다. Spring Boot은 이 안내서에 사용되는 순수 Java로 작성된 내장 서버에 대한 자동 구성을 제공한다. `LDAPAuthentication()` 메서드는 LDAP 서버에서 `uid={0},ou=people,dc=springframework,dc=message`를 검색하도록 로그인 양식의 사용자 이름이 `{0}`에 연결되도록 구성한다. 또한 `passwordCompare()` 메서드는 인코더와 암호의 속성 이름을 구성한다.

## 사용자 데이터 설정

LDAP 서버는 LDIF(LDAP 데이터 교환 형식) 파일을 사용하여 사용자 데이터를 교환할 수 있다. `application.properties`의 `spring.ldap.embedded.ldif` 속성을 통해 Spring Boot은 LDIF 데이터 파일을 가져올 수 있다. 따라서 데모 데이터를 쉽게 사전 로드할 수 있다. `src/main/resources/test-server.ldif`의 다음 목록은 이 예제에서 작동하는 LDIF 파일을 보여준다:

```
dn: dc=springframework,dc=org
objectclass: top
objectclass: domain
objectclass: extensibleObject
dc: springframework

dn: ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: groups

dn: ou=subgroups,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: subgroups

dn: ou=people,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: people

dn: ou=space cadets,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: space cadets

dn: ou=\"quoted people\",dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: "quoted people"

dn: ou=otherpeople,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: otherpeople

dn: uid=ben,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Ben Alex
sn: Alex
uid: ben
userPassword: $2a$10$c6bSeWPhg06xB1lvmaWNNe4NROmZiSpYhlocU/98HNr2MhIOiSt36

dn: uid=bob,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Bob Hamilton
sn: Hamilton
uid: bob
userPassword: bobspassword

dn: uid=joe,ou=otherpeople,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Joe Smeth
sn: Smeth
uid: joe
userPassword: joespassword

dn: cn=mouse\, jerry,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Mouse, Jerry
sn: Mouse
uid: jerry
userPassword: jerryspassword

dn: cn=slash/guy,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: slash/guy
sn: Slash
uid: slashguy
userPassword: slashguyspassword

dn: cn=quote\"guy,ou=\"quoted people\",dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: quote\"guy
sn: Quote
uid: quoteguy
userPassword: quoteguyspassword

dn: uid=space cadet,ou=space cadets,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Space Cadet
sn: Cadet
uid: space cadet
userPassword: spacecadetspassword



dn: cn=developers,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfUniqueNames
cn: developers
ou: developer
uniqueMember: uid=ben,ou=people,dc=springframework,dc=org
uniqueMember: uid=bob,ou=people,dc=springframework,dc=org

dn: cn=managers,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfUniqueNames
cn: managers
ou: manager
uniqueMember: uid=ben,ou=people,dc=springframework,dc=org
uniqueMember: cn=mouse\, jerry,ou=people,dc=springframework,dc=org

dn: cn=submanagers,ou=subgroups,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfUniqueNames
cn: submanagers
ou: submanager
uniqueMember: uid=ben,ou=people,dc=springframework,dc=org
```

LDIF 파일을 사용하는 것은 프로덕션 시스템의 표준 구성이 아니다. 그러나 테스트 목적이나 가이드에 유용한다.

사이트 `http://localhost:8080`을 방문하는 경우 Spring Security에서 제공하는 로그인 페이지로 리디렉션되어야 한다.

사용자 이름인 `ben`과 비밀번호인 `benspassword`를 입력한다. 브라우저에 다음 메시지가 표시된다:

```
Welcome to the home page!
```