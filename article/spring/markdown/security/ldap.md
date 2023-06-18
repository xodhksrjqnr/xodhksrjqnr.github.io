# LDAP 인증 [#](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/ldap.html)

LDAP(Lightweight Directory Access Protocol)는 조직에서 사용자 정보의 중앙 저장소 및 인증
서비스로 자주 사용된다. 응용 프로그램 사용자의 역할 정보를 저장하는 데도 사용할 수 있다.

Spring Security의 LDAP 기반 인증은 인증을 위해 사용자 이름/암호를 허용하도록 구성된 경우 Spring
Security에서 사용된다. 그러나 인증에 사용자 이름과 암호를 사용하더라도 바인딩 인증에서 LDAP 서버는
암호를 반환하지 않으므로 응용 프로그램에서 암호 유효성 검사를 수행할 수 없기 때문에 `UserDetailsService`를
사용하지 않는다.

LDAP 서버를 구성하는 방법에는 여러 가지 시나리오가 있으므로 Spring Security의 LDAP 공급자는 완전히
구성할 수 있다. 인증 및 역할 검색을 위해 별도의 전략 인터페이스를 사용하고 광범위한 상황을 처리하도록 구성할
수 있는 기본 구현을 제공한다.

## 전제 조건

Spring Security와 함께 사용하기 전에 LDAP에 대해 잘 알고 있어야 한다. 다음 링크에서는 관련된 개념에
대한 좋은 소개와 무료 LDAP 서버인 OpenLDAP: [www.zytrax.com/books/ldap/](https://www.zytrax.com/books/ldap/)를
사용하여 디렉토리를 설정하는 방법을 안내한다. Java에서 LDAP에 액세스하는 데 사용되는 JNDI API에 대한
일부 지식도 유용할 수 있다. LDAP 공급자에서 타사 LDAP 라이브러리(Mozilla, JLDAP 등)를 사용하지
않지만 Spring LDAP를 광범위하게 사용하므로 자체 사용자 정의를 추가할 계획인 경우 해당 프로젝트에 대한
익숙함이 유용할 수 있다.

LDAP 인증을 사용할 때는 LDAP 연결 풀링을 올바르게 구성해야 한다. 방법에 익숙하지 않은 경우 [Java
LDAP 설명서](https://docs.oracle.com/javase/jndi/tutorial/ldap/connect/config.html)를
참조하자.

## 내장된 LDAP 서버 설정

먼저 구성을 지정할 LDAP 서버가 있는지 확인해야 한다. 단순화를 위해 내장된 LDAP 서버로 시작하는 것이 가장
좋다. Spring Security는 다음 중 하나를 사용할 수 있다:

- 내장된 UnboundID 서버
- 내장된 Apache DS 서버

다음 예제에서는 `users.ldif`를 클래스 경로 리소스로 노출하여 암호가 암호인 사용자와 관리자 두 명의
사용자로 포함된 LDAP 서버를 초기화한다:

```
dn: ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: groups

dn: ou=people,dc=springframework,dc=org
objectclass: top
objectclass: organizationalUnit
ou: people

dn: uid=admin,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Rod Johnson
sn: Johnson
uid: admin
userPassword: password

dn: uid=user,ou=people,dc=springframework,dc=org
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: Dianne Emu
sn: Emu
uid: user
userPassword: password

dn: cn=user,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfNames
cn: user
uniqueMember: uid=admin,ou=people,dc=springframework,dc=org
uniqueMember: uid=user,ou=people,dc=springframework,dc=org

dn: cn=admin,ou=groups,dc=springframework,dc=org
objectclass: top
objectclass: groupOfNames
cn: admin
uniqueMember: uid=admin,ou=people,dc=springframework,dc=org
```

## 내장된 UnboundID 서버

UnboundID를 사용하려면 다음 종속성을 지정하자:

### Maven

```
<dependency>
	<groupId>com.unboundid</groupId>
	<artifactId>unboundid-ldapsdk</artifactId>
	<version>6.0.8</version>
	<scope>runtime</scope>
</dependency>
```

### Gradle

```
depenendencies {
	runtimeOnly "com.unboundid:unboundid-ldapsdk:6.0.8"
}
```

그런 다음 EmbeddedLdapServerContextSourceFactoryBean을 사용하여 EmbeddedLDAP 서버를
구성할 수 있다. 그러면 Spring Security에서 메모리 내 LDAP 서버를 시작하도록 지시한다:

```java
@Bean
public EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean() {
	return EmbeddedLdapServerContextSourceFactoryBean.fromEmbeddedLdapServer();
}
```

또는 Embedded LDAP 서버를 수동으로 구성할 수 있다. 이 방법을 선택할 경우, 사용자는 내장된 LDAP
서버의 수명 주기를 관리해야 한다.

```java
@Bean
UnboundIdContainer ldapContainer() {
	return new UnboundIdContainer("dc=springframework,dc=org",
				"classpath:users.ldif");
}
```

## 내장된 ApacheDS 서버

> Spring Security는 더 이상 유지 관리되지 않는 ApacheDS 1.x를 사용한다. 안타깝게도 ApacheDS
> 2.x는 안정적인 릴리스가 없는 마일스톤 버전만 릴리스했다. ApacheDS 2.x의 안정적인 릴리스를 사용할 수
> 있게 되면 업데이트를 고려해 보겠다.

ApacheDS를 사용하려면 다음 종속성을 지정하자:

### Maven

```
<dependency>
	<groupId>org.apache.directory.server</groupId>
	<artifactId>apacheds-core</artifactId>
	<version>1.5.5</version>
	<scope>runtime</scope>
</dependency>
<dependency>
	<groupId>org.apache.directory.server</groupId>
	<artifactId>apacheds-server-jndi</artifactId>
	<version>1.5.5</version>
	<scope>runtime</scope>
</dependency>
```

### Gradle

```
depenendencies {
	runtimeOnly "org.apache.directory.server:apacheds-core:1.5.5"
	runtimeOnly "org.apache.directory.server:apacheds-server-jndi:1.5.5"
}
```

그런 다음 내장된 LDAP 서버를 구성할 수 있다:

```java
@Bean
ApacheDSContainer ldapContainer() {
	return new ApacheDSContainer("dc=springframework,dc=org",
				"classpath:users.ldif");
}
```

## LDAP 컨텍스트 소스

구성을 지정할 LDAP 서버가 있는 경우 사용자 인증확인에 사용할 LDAP 서버를 지정하도록 Spring Security를
구성해야 한다. 이렇게 하려면 LDAP `ContextSource`(JDBC `DataSource`와 동일)를 작성한다.
`EmbeddedLdapServerContextSourceFactoryBean`를 이미 구성한 경우 Spring Security는
내장된 LDAP 서버를 가리키는 LDAP `ContextSource`를 작성한다.

```java
@Bean
public EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean() {
	EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean =
			EmbeddedLdapServerContextSourceFactoryBean.fromEmbeddedLdapServer();
	contextSourceFactoryBean.setPort(0);
	return contextSourceFactoryBean;
}
```

또는 제공된 LDAP 서버에 연결하도록 LDAP `ContextSource`를 명시적으로 구성할 수 있다:

```java
ContextSource contextSource(UnboundIdContainer container) {
	return new DefaultSpringSecurityContextSource("ldap://localhost:53389/dc=springframework,dc=org");
}
```

## 인증

LDAP 바인딩 인증은 클라이언트가 암호 또는 해시된 버전의 암호를 읽을 수 없도록 하기 때문에 Spring
Security의 LDAP 지원은 `UserDetailsService`를 사용하지 않는다. 즉, Spring Security에서
암호를 읽고 인증할 수 없다.

이러한 이유로 LDAP 지원은 `LdapAuthenticator` 인터페이스를 통해 구현된다. `LdapAuthenticator`
인터페이스는 필요한 사용자 특성을 검색하는 역할도 한다. 이는 사용 중인 인증 유형에 따라 특성에 대한 사용
권한이 달라질 수 있기 때문이다. 예를 들어 사용자로 바인딩된 경우 사용자 자신의 권한으로 속성을 읽어야 할
수 있다.

Spring Security는 두 가지 `LdapAuthenticator` 구현을 제공한다:

- 바인드 인증 사용
- 암호 인증 사용

## 바인드 인증 사용

바인딩 인증은 LDAP으로 사용자를 인증하는 가장 일반적인 메커니즘이다. 바인딩 인증에서는 사용자의 자격
증명(사용자 이름 및 암호)이 LDAP 서버에 제출되어 인증된다. 바인딩 인증을 사용하면 사용자의 비밀(암호)이
클라이언트에 노출될 필요가 없으므로 클라이언트가 유출되지 않도록 보호할 수 있다.

다음은 바인딩 인증 구성의 예이다:

```java
@Bean
AuthenticationManager authenticationManager(BaseLdapPathContextSource contextSource) {
	LdapBindAuthenticationManagerFactory factory = new LdapBindAuthenticationManagerFactory(contextSource);
	factory.setUserDnPatterns("uid={0},ou=people");
	return factory.createAuthenticationManager();
}
```

위의 간단한 예에서는 제공된 패턴의 사용자 로그인 이름을 대체하고 로그인 암호로 해당 사용자로 바인딩하여
사용자의 DN을 얻는다. 모든 사용자가 디렉토리의 단일 노드에 저장되어 있는 경우에는 이 옵션을 사용할 수
있다. 대신 사용자를 찾도록 LDAP 검색 필터를 구성하려는 경우 다음을 사용할 수 있다:

```java
@Bean
AuthenticationManager authenticationManager(BaseLdapPathContextSource contextSource) {
	LdapBindAuthenticationManagerFactory factory = new LdapBindAuthenticationManagerFactory(contextSource);
	factory.setUserSearchFilter("(uid={0})");
	factory.setUserSearchBase("ou=people");
	return factory.createAuthenticationManager();
}
```

앞에 표시된 `ContextSource` 정의와 함께 사용하는 경우 `(uid={0})`를 필터로 사용하여 DN
`ou=people,dc=springframework,dc=org`에서 검색을 수행한다. 다시 필터 이름의 매개 변수 대신
사용자 로그인 이름이 사용자 이름과 동일한 `uid` 특성을 가진 항목을 검색한다. 사용자 검색 기준이 제공되지
않으면 루트에서 검색이 수행된다.

## 암호 인증 사용

비밀번호 비교는 사용자가 제공한 비밀번호를 저장소에 저장된 비밀번호와 비교하는 것이다. 이 작업은 비밀번호
특성의 값을 검색하여 로컬에서 확인하거나, 제공된 비밀번호가 비교를 위해 서버로 전달되고 실제 비밀번호 값이
검색되지 않는 LDAP "비교" 작업을 수행하여 수행할 수 있다. 암호가 임의의 데이터로 적절하게 해시된 경우
LDAP 비교를 수행할 수 없다.

```java
@Bean
AuthenticationManager authenticationManager(BaseLdapPathContextSource contextSource) {
	LdapPasswordComparisonAuthenticationManagerFactory factory = new LdapPasswordComparisonAuthenticationManagerFactory(
			contextSource, NoOpPasswordEncoder.getInstance());
	factory.setUserDnPatterns("uid={0},ou=people");
	return factory.createAuthenticationManager();
}
```

다음 예제에서는 일부 사용자 지정을 사용한 고급 구성을 보여 준다:

```java
@Bean
AuthenticationManager authenticationManager(BaseLdapPathContextSource contextSource) {
	LdapPasswordComparisonAuthenticationManagerFactory factory = new LdapPasswordComparisonAuthenticationManagerFactory(
			contextSource, new BCryptPasswordEncoder());
	factory.setUserDnPatterns("uid={0},ou=people");
	factory.setPasswordAttribute("pwd"); //암호 특성을 pwd로 지정한다.
	return factory.createAuthenticationManager();
}
```

## LdapAuthoritiesPopulator

Spring Security의 `LdapAuthoritiesPopulator`는 사용자에게 반환되는 권한을 결정하는 데
사용된다. 다음 예는 `LdapAuthoritiesPopulator`를 구성하는 방법을 보여 준다:

```java
@Bean
LdapAuthoritiesPopulator authorities(BaseLdapPathContextSource contextSource) {
	String groupSearchBase = "";
	DefaultLdapAuthoritiesPopulator authorities =
		new DefaultLdapAuthoritiesPopulator(contextSource, groupSearchBase);
	authorities.setGroupSearchFilter("member={0}");
	return authorities;
}

@Bean
AuthenticationManager authenticationManager(BaseLdapPathContextSource contextSource, LdapAuthoritiesPopulator authorities) {
	LdapBindAuthenticationManagerFactory factory = new LdapBindAuthenticationManagerFactory(contextSource);
	factory.setUserDnPatterns("uid={0},ou=people");
	factory.setLdapAuthoritiesPopulator(authorities);
	return factory.createAuthenticationManager();
}
```

## Active Directory

Active Directory는 자체 비표준 인증 옵션을 지원하며 일반적인 사용 패턴이 표준 `LdapAuthenticationProvider`와
잘 맞지 않는다. 일반적으로 인증확인은 LDAP 고유 이름 대신 도메인 사용자 이름( `user@domain` 형식)을
사용하여 수행된다. Spring Security에는 일반적인 Active Directory 설정에 맞게 사용자 지정된 인증
공급자가 있다.

`ActiveDirectoryLdapAuthenticationProvider`를 구성하는 것은 매우 간단하다. 도메인 이름과
서버의 주소를 제공하는 LDAP URL만 제공하면 된다.

> DNS 조회를 사용하여 서버의 IP 주소를 얻을 수도 있다. 현재 지원되지 않지만 향후 버전에서 지원될
> 예정이다.

다음 예제에서는 Active Directory를 구성한다:

```java
@Bean
ActiveDirectoryLdapAuthenticationProvider authenticationProvider() {
	return new ActiveDirectoryLdapAuthenticationProvider("example.com", "ldap://company.example.com/");
}
```