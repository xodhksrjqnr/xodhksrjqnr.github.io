# 컨테이너 개요 [#](https://docs.spring.io/spring-framework/reference/core/beans/basics.html)

`org.springframework.context.ApplicationContext` 인터페이스는 스프링 IoC 컨테이너를
나타내며 빈의 인스턴스화, 구성 및 조립을 담당한다. 컨테이너는 구성 메타데이터를 읽어 어떤 개체를 인스턴스화,
구성 및 조립할지에 대한 지침을 얻는다. 구성 메타데이터는 XML, Java 주석 또는 Java 코드로 표시된다. 응용
프로그램을 구성하는 개체와 해당 개체 간의 풍부한 상호 의존성을 표현할 수 있다.

`ApplicationContext` 인터페이스의 여러 구현체는 스프링과 함께 제공된다. 독립 실행형 애플리케이션에서는
`ClassPathXmlApplicationContext` 또는 `FileSystemXmlApplicationContext`의 인스턴스를
생성하는 것이 일반적이다. XML은 구성 메타데이터를 정의하는 전통적인 형식이지만 이러한 추가 메타데이터 형식을
지원하기 위해 소량의 XML 구성을 제공하여 컨테이너에 Java 주석 또는 코드를 메타데이터 형식으로 사용하도록
지시할 수 있다.

대부분의 애플리케이션 시나리오에서는 스프링 IoC 컨테이너의 인스턴스 하나 이상을 인스턴스화하는 데 명시적인
사용자 코드가 필요하지 않다. 예를 들어, 웹 응용 프로그램 시나리오에서 응용 프로그램의 `web.xml` 파일에
있는 단순한 8줄 정도의 상용 웹 설명자 XML로 충분하다([웹 응용 프로그램의 편리한 응용 프로그램 컨텍스트
인스턴스화 참조](https://docs.spring.io/spring-framework/reference/core/beans/context-introduction.html#context-create)).
[Spring Tools for Eclipse](https://spring.io/tools)(Eclipse 기반 개발 환경)를 사용하는
경우 몇 번의 마우스 클릭이나 키 입력만으로 이 상용판 구성을 쉽게 만들 수 있다.

다음 다이어그램은 스프링 작동 방식을 개략적으로 보여준다. 애플리케이션 클래스가 구성 메타데이터와 결합되므로
`ApplicationContext`가 생성 및 초기화된 후에는 완전히 구성되고 실행 가능한 시스템 또는 애플리케이션이
생성된다.

![](https://docs.spring.io/spring-framework/reference/_images/container-magic.png)

# 구성 메타데이터

위의 다이어그램에서 볼 수 있듯이 스프링 IoC 컨테이너는 구성 메타데이터의 한 형태를 사용한다. 이 구성
메타데이터는 응용 프로그램 개발자가 스프링 컨테이너에 응용 프로그램의 개체를 인스턴스화, 구성 및 조립하도록
지시하는 방법을 나타낸다.

구성 메타데이터는 전통적으로 간단하고 직관적인 XML 형식으로 제공되며, 이 장에서는 스프링 IoC 컨테이너의
주요 개념과 기능을 전달하는 데 사용한다.

> XML 기반 메타데이터만이 허용되는 구성 메타데이터 형식은 아니다. 스프링 IoC 컨테이너 자체는 이 구성
> 메타데이터가 실제로 작성되는 형식과 완전히 분리되어 있다. 요즘 많은 개발자들이 스프링 응용 프로그램을
> 위해 Java 기반 구성을 선택한다.

스프링 컨테이너와 함께 다른 형태의 메타데이터를 사용하는 방법에 대한 자세한 내용은 다음을 참조하자:

- [주석 기반 구성](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config.html):
주석 기반 구성 메타데이터를 사용하여 빈을 정의한다.
- [Java 기반 구성](https://docs.spring.io/spring-framework/reference/core/beans/java.html):
XML 파일이 아닌 Java를 사용하여 응용 프로그램 클래스 외부의 빈을 정의한다. 이러한 기능을 사용하려면
`@Configuration`, `@Bean`, `@Import` 및 `@DependsOn` 주석을 참조하자.

스프링 구성은 컨테이너가 관리해야 하는 적어도 하나 이상의 빈 정의로 구성된다. XML 기반 구성 메타데이터는
이러한 빈을 최상위 `<beans/>` 요소 내의 `<bean/>` 요소로 구성한다. Java 구성은 일반적으로
`@Configuration` 클래스 내에서 `@Bean` 할당 메서드를 사용한다.

이러한 빈 정의는 응용 프로그램을 구성하는 실제 개체에 해당한다. 일반적으로 서비스 계층 개체, 저장소 또는
DAO(데이터 액세스 개체)와 같은 지속성 계층 개체, 웹 컨트롤러와 같은 프레젠테이션 개체, JPA
`EntityManagerFactory`, JMS 대기열 등의 인프라 개체를 정의한다. 일반적으로 도메인 개체를 만들고
로드하는 것은 일반적으로 리포지토리와 비즈니스 로직의 책임이기 때문에 컨테이너에 세부적인 도메인 개체를
구성하지 않는다.

다음 예제에서는 XML 기반 구성 메타데이터의 기본 구조를 보여 준다:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="..." class="..."> (1) (2)
		<!-- collaborators and configuration for this bean go here -->
	</bean>

	<bean id="..." class="...">
		<!-- collaborators and configuration for this bean go here -->
	</bean>

	<!-- more bean definitions go here -->

</beans>
```

1) id 특성은 개별 빈 정의를 식별하는 문자열이다.
2) 클래스 속성은 빈의 유형을 정의하고 정규화된 클래스 이름을 사용한다.

`id` 특성 값은 상호협력 개체를 참조하는 데 사용할 수 있다. 협업 개체를 참조하기 위한 XML은 이 예에 나와
있지 않다. 자세한 내용은 [의존성](https://docs.spring.io/spring-framework/reference/core/beans/dependencies.html)을
참조하자.

# 컨테이너 인스턴스화

`ApplicationContext` 생성자에 제공되는 위치 경로는 컨테이너가 로컬 파일 시스템, Java `CLASSPATH`
등과 같은 다양한 외부 리소스의 구성 메타데이터를 로드할 수 있도록 하는 리소스 문자열이다.

```java
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
```

> 스프링의 IoC 컨테이너에 대해 배운 후에는 URI 구문에 정의된 위치에서 InputStream을 읽기 위한
> 편리한 메커니즘을 제공하는 스프링의 `Resource` 추상화([Resources](https://docs.spring.io/spring-framework/reference/web/webflux-webclient/client-builder.html#webflux-client-builder-reactor-resources)에서
> 설명됨)에 대해 자세히 알고 싶을 수 있다. 특히 `Resource` 경로는 [응용 프로그램 컨텍스트 및 리소스
> 경로](https://docs.spring.io/spring-framework/reference/core/resources.html#resources-app-ctx)에
> 설명된 대로 응용 프로그램 컨텍스트를 구성하는 데 사용된다.

다음은 서비스 계층 개체(`services.xml`) 구성 파일의 예이다:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<!-- services -->

	<bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
		<property name="accountDao" ref="accountDao"/>
		<property name="itemDao" ref="itemDao"/>
		<!-- additional collaborators and configuration for this bean go here -->
	</bean>

	<!-- more bean definitions for services go here -->

</beans>
```

다음은 데이터 액세스 개체 `daos.xml` 파일의 예이다:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="accountDao"
		class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
		<!-- additional collaborators and configuration for this bean go here -->
	</bean>

	<bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
		<!-- additional collaborators and configuration for this bean go here -->
	</bean>

	<!-- more bean definitions for data access objects go here -->

</beans>
```

위의 예에서 서비스 계층은 `PetStoreServiceImpl` 클래스와 `JpaAccountDao` 및 `JpaItemDao`
유형의 두 개의 데이터 액세스 개체(JPA 개체-관계 매핑 표준 기반)로 구성된다. `property name` 요소는
JavaBean 속성의 이름을 나타내고 `ref` 요소는 다른 빈 정의의 이름을 나타낸다. `id` 요소와 `ref`
요소 간의 이러한 연결은 상호협력 개체 간의 의존성을 나타낸다. 개체의 의존성 구성에 대한 자세한 내용은
[의존성](https://docs.spring.io/spring-framework/reference/core/beans/dependencies.html)을
참조하자.

# XML 기반 구성 메타데이터 작성

정의가 여러 XML 파일에 걸쳐 있으면 유용할 수 있다. 각 개별 XML 구성 파일은 종종 아키텍처의 논리 계층
또는 모듈을 나타낸다.

응용 프로그램 컨텍스트 생성자를 사용하여 이러한 모든 XML 조각에서 빈 정의를 로드할 수 있다. 이 생성자는
이전 섹션에 표시된 것처럼 여러 `Resource` 위치를 사용한다. 또는 하나 이상의 `<import/>` 요소를
사용하여 다른 파일 또는 파일에서 빈 정의를 로드한다. 다음 예제에서는 이 작업을 수행하는 방법을 보여 준다:

```xml
<beans>
	<import resource="services.xml"/>
	<import resource="resources/messageSource.xml"/>
	<import resource="/resources/themeSource.xml"/>

	<bean id="bean1" class="..."/>
	<bean id="bean2" class="..."/>
</beans>
```

위의 예에서는 외부 빈 정의가 `services.xml`, `messageSource.xml` 및 `themeSource.xml`의
세 파일에서 로드된다. 모든 위치 경로는 가져오기를 수행하는 정의 파일에 상대적이므로 `services.xml`는
가져오기를 수행하는 파일과 동일한 디렉토리 또는 클래스 경로 위치에 있어야 하고, `messageSource.xml`
및 `themeSource.xml`는 가져오기 파일 위치 아래의 `resources` 위치에 있어야 한다. 보시다시피
선행 슬래시는 무시된다. 그러나 이러한 경로는 상대적이므로 슬래시를 전혀 사용하지 않는 것이 좋다. 최상위
`<beans/>` 요소를 포함하여 가져올 파일의 내용은 스프링 스키마에 따라 유효한 XML 빈 정의여야 한다.

> 상대적인 " ../" 경로를 사용하여 상위 디렉토리의 파일을 참조할 수 있지만 권장되지는 않는다. 이렇게 하면
> 현재 응용 프로그램 외부에 있는 파일에 대한 의존성이 생성된다. 특히 이 참조는 `classpath:` URL(예:
> `classpath:../services.xml`)에는 권장되지 않는다. 여기서 런타임 확인 프로세스는 "가장 가까운"
> 클래스 경로 루트를 선택한 다음 상위 디렉터리를 조사한다. 클래스 경로 구성을 변경하면 다른 디렉토리를
> 잘못 선택할 수 있다.
>
> 항상 상대 경로 대신 정규화된 리소스 위치(예: `file:C:/config/services.xml` 또는
> `classpath:/config/services.xml`)를 사용할 수 있다. 그러나 응용 프로그램의 구성을 특정
> 절대 위치에 연결하고 있다. 일반적으로 런타임에 JVM 시스템 속성에 대해 확인된 "${…}" 자리 표시자를
> 통해 이러한 절대 위치에 대해 간접적으로 유지하는 것이 좋다.

네임스페이스 자체는 가져오기 지시 기능을 제공한다. 분명한 빈 정의 이외의 추가 구성 기능은 스프링에서
제공하는 XML 네임스페이스 선택 항목(예: `context` 및 `util` 네임스페이스)에서 사용할 수 있다.

# The Groovy Bean Definition DSL

외부화된 구성 메타데이터의 또 다른 예로, 그레일 프레임워크에서 알려진 바와 같이 스프링의 그루비 빈 정의
DSL에서도 빈 정의를 표현할 수 있다. 일반적으로 이러한 구성은 다음 예제에 표시된 구조의 ".groovy"
파일에 저장된다:

```
beans {
	dataSource(BasicDataSource) {
		driverClassName = "org.hsqldb.jdbcDriver"
		url = "jdbc:hsqldb:mem:grailsDB"
		username = "sa"
		password = ""
		settings = [mynew:"setting"]
	}
	sessionFactory(SessionFactory) {
		dataSource = dataSource
	}
	myService(MyService) {
		nestedBean = { AnotherBean bean ->
			dataSource = dataSource
		}
	}
}
```

이 구성 스타일은 XML 빈 정의와 거의 동일하며 스프링의 XML 구성 네임스페이스도 지원한다. 또한
`importBeans` 지시어를 통해 XML 빈 정의 파일을 가져올 수 있다.

# 컨테이너 사용

`ApplicationContext`는 다양한 빈과 그 의존성의 레지스트리를 유지할 수 있는 고급 팩토리의
인터페이스이다. `T getBean(String name, Class requiredType)` 메서드를 사용하여 빈
인스턴스를 검색할 수 있다.

다음 예제에서 볼 수 있듯이 `ApplicationContext`를 사용하여 빈 정의를 읽고 액세스할 수 있다:

```java
// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// use configured instance
List<String> userList = service.getUsernameList();
```

Groovy 구성에서는 부트스트래핑이 매우 유사하다. Groovy를 인식하는 다른 컨텍스트 구현 클래스가 있다(XML 빈
정의도 이해한다). 다음은 Groovy 구성의 예이다:

```java
ApplicationContext context = new GenericGroovyApplicationContext("services.groovy", "daos.groovy");
```

가장 유연한 변형은 판독기 대리인과 결합한 `GenericApplicationContext`이다. 예를 들어 다음 예에서
볼 수 있듯이 XML 파일용 `XmlBeanDefinitionReader`이다:

```java
GenericApplicationContext context = new GenericApplicationContext();
new XmlBeanDefinitionReader(context).loadBeanDefinitions("services.xml", "daos.xml");
context.refresh();
```

다음 예제와 같이 Groovy 파일용 `GroovyBeanDefinitionReader`를 사용할 수도 있다:

```java
GenericApplicationContext context = new GenericApplicationContext();
new GroovyBeanDefinitionReader(context).loadBeanDefinitions("services.groovy", "daos.groovy");
context.refresh();
```

다양한 구성 소스의 빈 정의를 읽으며 동일한 `ApplicationContext`에서 이러한 판독기 대리자를 혼합하고
일치시킬 수 있다.

그런 다음 `getBean`을 사용하여 빈 인스턴스를 검색할 수 있다. `ApplicationContext` 인터페이스에는
빈을 검색하는 몇 가지 다른 방법이 있지만, 이상적으로는 응용 프로그램 코드에서 빈을 사용하지 않는 것이 좋다.
실제로, 당신의 애플리케이션 코드는 `getBean()` 메서드에 대한 호출이 전혀 없어야 하며 따라서 스프링
API에 대한 의존성이 전혀 없어야 한다. 예를 들어, 스프링의 웹 프레임워크 통합은 컨트롤러 및 JSF 관리
빈과 같은 다양한 웹 프레임워크 구성 요소에 대한 의존성 주입을 제공하여 메타데이터(예: 자동 배선 주석)를
통해 특정 빈에 대한 의존성을 선언할 수 있다.