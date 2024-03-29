# 빈 개요

빈은 스프링 IoC 컨테이너에서 관리되며, 컨테이너에 제공하는 구성 메타데이터(예: XML `<bean/>` 정의 형식)로 생성된다. 빈 정의는 다음 메타데이터를 포함하는 `BeanDefinition` 개체로 표시된다:

- `실제 구현 클래스 이름`
- `빈 동작 구성 요소(스코프 라이프사이클 콜백 등)`
- `의존성(다른 빈에 대한 참조)`
- `새로 만든 개체에 설정할 기타 구성 설정`(예: 풀의 크기 제한 또는 연결 풀을 관리하는 빈에서 사용할 연결 수).

이 메타데이터는 각 빈 정의를 구성하는 속성 집합으로 변환된다. 다음 표에서는 이러한 속성에 대해 설명한다:

| Property                 | Explained in...          |
|--------------------------|--------------------------|
| Class                    | Instantiating Beans      |
| Name                     | Naming Beans             |
| Scope                    | Bean Scopes              |
| Constructor arguments    | Dependency Injection     |
| Properties               | Dependency Injection     |
| Autowiring mode          | Autowiring Collaborators |
| Lazy initialization mode | Lazy-initialized Beans   |
| Initialization method    | Initialization Callbacks |
| Destruction method       | Destruction Callbacks    |

특정 빈을 생성하는 방법에 대한 정보가 포함된 정의일 뿐만 아니라 `ApplicationContext` 구현을 통해 컨테이너 외부에서 생성된 기존 개체도 등록할 수 있다. 그러나 일반적인 애플리케이션은 일반적인 빈 정의 메타데이터를 통해 정의된 빈에서만 작동한다. 외부에서의 등록 방법은 간단하게 보고 넘어가자.

1) `getBeanFactory()` : `ApplicationContext`의 `BeanFactory`에 액세스
2) `DefaultListableBeanFactory` 반환
3) `DefaultListableBeanFactory`의 `registerSingleton(..)` 및 `registerBeanDefinition(..)` 메서드를 이요해 등록 

> ### 왜 런타임 중 새로운 빈을 등록하는 것은 공식적으로 지원하지 않을까?
>
> - 컨테이너가 autowiring 및 기타 검사 단계 중에 올바르게 추론할 수 있도록 빈 메타데이터 및 수동으로 제공된 싱글톤 인스턴스를 가능한 빨리 등록 필요
> - 동시 액세스 예외나 컨테이너의 일관성 문제 발생 가능성

<br>

# 빈 이름 짓기

식별자는 모든 빈이 하나 이상 가지며, 호스트하는 컨테이너 내에서 고유해야 한다. 보통은 하나의 식별자만 가지지만 둘 이상이 필요한 경우 추가 항목을 별칭으로 간주한다.

XML 기반 구성 메타데이터에서는 `id` 특성, `name` 특성 또는 둘 다를 사용하여 빈의 식별자를 지정한다. `id` 속성은 하나만 지정할 수 있으며, 일반적으로 영숫자('myBean', 'someService' 등)로 표현하지만 특수 문자도 포함할 수 있다. `id` 특성은 `xsd:string` 유형으로 정의되지만 빈 `id` 고유성은 XML 구문 분석기에 의해 적용되지 않는다. 별칭은 `name` 속성에서 쉼표(`,`), 세미콜론(`;`) 또는 공백으로 구분하여 지정할 수 있다.

`name` 또는 `id`를 명시적으로 제공하지 않으면 컨테이너는 해당 빈의 고유한 이름을 생성한다. 그러나 `ref` 요소 또는 서비스 로케이터 스타일 조회를 통해 빈을 이름으로 참조하려면 이름을 입력해야 한다. 이름을 제공하지 않는 이유는 [내부 빈즈](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-properties-detailed.html#beans-inner-beans) 사용 및 [autowiring 공동작업자](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-autowire.html)와 관련이 있다.

> ## 빈 명명 규칙
> 
> 빈 이름을 지정할 때 인스턴스 필드 이름에 표준 Java 규칙([camel-case](https://ko.wikipedia.org/wiki/%EC%B9%B4%EB%A9%9C_%ED%91%9C%EA%B8%B0%EB%B2%95))을 사용한다. 이러한 이름의 예로는 `accountManager`, `accountService`, `userDao`, `loginController` 등이 있다. 빈의 이름을 일관되게 지정하면 구성을 더 쉽게 읽고 이해할 수 있다. 또한 스프링 AOP를 사용하면 이름 별 관련 빈 세트에 조언을 적용할 때 많은 도움이 된다.

> 스프링은 클래스 경로에서 컴포넌트 스캔을 사용하여 명명되지 않은 컴포넌트에 대해 앞서 설명한 규칙을 이용해 빈 이름을 생성한다. 기본적으로 선언된 클래스 이름을 사용하고 초기 문자를 소문자로 전환한다. 그러나 둘 이상의 문자가 있고 첫 번째 문자와 두 번째 문자가 모두 대문자인 (비정상적인) 특수한 경우에는 원래 케이스가 보존된다. 이러한 규칙은 `java.beans.Introspector.decapitalize`(스프링이 여기서 사용)에서 정의한 규칙과 동일하다.

<br>

# 빈 정의 밖에 있는 빈에 별칭을 붙이기

빈 정의 자체에서 `id` 속성에 지정된 값과 `name` 속성에 지정된 값의 조합으로 빈에 대해 둘 이상의 이름을 제공할 수 있다. 이러한 이름은 동일한 빈에 해당하는 별칭이 될 수 있으며 일부 상황에서 유용합니다. 예를 들면, 응용 프로그램의 각 구성요소가 해당 구성 요소 자체에 고유한 빈 이름을 사용하여 공통 의존성을 참조한다.

때때로 다른 곳에서 정의된 빈에 대한 별칭을 고려해야 한다. 일반적으로 대규모 시스템에서 구성이 각 하위 시스템 간에 분할되고 각 하위 시스템에는 고유한 개체 정의 집합이 있다. XML 기반 구성 메타데이터에서 `<alias/>` 요소를 사용하여 이 작업을 수행할 수 있다. 다음 예제에서는 이 작업을 수행하는 방법을 보여 준다:

```xml
<alias name="fromName" alias="toName"/>
```

이 경우 동일한 컨테이너에 있는 `fromName`이라는 이름의 빈은 `toName`으로 참조할 수 있다.

예를 들어 하위 시스템 A의 구성 메타데이터는 데이터 소스를 `subsystemA-dataSource` 이름으로, 하위 시스템 B에 대한 구성 메타데이터는 데이터 소스를 `subsystemB-dataSource`로 나타낸다고 하자. 이 두 하위 시스템을 모두 사용하는 메인 애플리케이션을 구성할 때 메인 애플리케이션은 데이터 소스를 `myApp-dataSource`의 이름으로 참조한다. 세 개의 이름이 모두 동일한 개체를 참조하도록 하려면 다음 별칭 정의를 구성 메타데이터에 추가할 수 있다:

```xml
<alias name="myApp-dataSource" alias="subsystemA-dataSource"/>
<alias name="myApp-dataSource" alias="subsystemB-dataSource"/>
```

이제 각 구성 요소와 메인 애플리케이션은 고유하고 다른 정의와 충돌하지 않는 이름을 통해 데이터소스를 참조할 수 있다(효과적으로 네임스페이스를 생성함).

> ### Java 구성
>
> Java 구성을 사용하는 경우 `@Bean` 주석을 사용하여 별칭을 제공할 수 있다. 자세한 내용은 [`@Bean` 주석 사용](https://docs.spring.io/spring-framework/reference/core/beans/java/bean-annotation.html)을 참조하자.

<br>

# 빈 인스턴스화

빈 정의는 기본적으로 하나 이상의 개체를 만들기 위한 방법이다. 컨테이너는 요청 시 명명된 빈의 레시피를 살펴보고 해당 빈 정의에 의해 캡슐화된 구성 메타데이터를 사용하여 실제 개체를 생성(또는 획득)한다.

XML 기반 구성 메타데이터를 사용하는 경우 `<bean/>` 요소의 `class` 특성에 인스턴스화할 개체 유형(또는 클래스)을 지정한다. 일반적으로 이 `BeanDefinition` 특성(내부적으로 Class 인스턴스의 class 속성)은 필수이다. (예외에 대해서는 인스턴스 팩토리 방법을 사용한 인스턴스화 및 [빈 정의 상속](https://docs.spring.io/spring-framework/reference/core/beans/child-bean-definitions.html)을 참조하자.) `Class` 속성은 다음 두 가지 방법 중 하나로 사용할 수 있다:

- 일반적으로 컨테이너 자체가 생성자를 반사적으로 호출하여 빈을 직접 생성하는 경우에 생성할 빈 클래스를 지정하는 것은 `new` 연산자를 사용하는 Java 코드와 다소 동등하다.
- 개체를 생성하기 위해 호출되는 `static` 팩토리 메서드를 포함하는 실제 클래스를 지정할 때, 컨테이너가 클래스에서 `static` 팩토리 메서드를 호출하여 빈을 생성하는 경우는 거의 없다(싱글톤의 장점은 취하고 단점은 제거한 방식으로 구현). `static` 팩토리 메서드의 호출에서 반환된 개체 유형은 동일한 클래스이거나 완전히 다른 클래스일 수 있다.

> ### 중첩된 클래스 이름
>
> 중첩 클래스에 대한 빈 정의를 구성하려면 이진 이름 또는 중첩 클래스의 원본 이름을 사용할 수 있다.
>
> 예를 들어 `com.example` 패키지에 `SomeThing`이라는 클래스가 있고 이 `SomeThing` 클래스에 `OtherThing`라는 `static` 중첩 클래스가 있는 경우 달러 기호(`$`) 또는 점(`.`)으로 구분할 수 있다. 따라서 빈 정의에서 `class` 속성의 값은 `com.example.SomeThing$OtherThing` 또는 `com.example.SomeThing.OtherThing`이다.

<br>

# 생성자를 사용한 인스턴스화

생성자 접근 방식으로 빈을 작성하면 스프링에서 모든 일반 클래스를 사용할 수 있으며 호환된다. 즉, 개발 중인 클래스는 특정 인터페이스를 구현하거나 특정 방식으로 코딩할 필요가 없다. 단순히 빈 클래스를 지정하는 것으로 충분하다. 그러나 특정 빈에 사용하는 IoC 유형에 따라 기본(빈) 생성자가 필요할 수 있다.

> 스프링 IoC 컨테이너는 JavaBeans 뿐만 아니라 non-빈 스타일의 외부 클래스도 관리할 수 있다.

XML 기반 구성 메타데이터를 사용하여 다음과 같이 빈 클래스를 지정할 수 있다:

```xml
<bean id="exampleBean" class="examples.ExampleBean"/>

<bean name="anotherExample" class="examples.ExampleBeanTwo"/>
```

생성자에 인수를 제공하고(필요한 경우) 개체가 생성된 후 개체 인스턴스 속성을 설정하는 메커니즘에 대한 자세한 내용은 [의존성 주입](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)을 참조하자.

<br>

# 정적 팩토리 메서드를 사용한 인스턴스화

정적 팩토리 메서드를 사용하여 생성하는 빈을 정의하는 경우 `class` 특성을 사용하여 `static` 팩토리 메서드를 포함하는 클래스를 지정하고 `factory-method` 특성을 사용하여 팩토리 메서드 자체의 이름을 지정한다. 이 메서드를 호출하고(나중에 설명된 대로 선택적 인수 포함) 활성 개체를 반환할 수 있어야 하며, 이 개체는 나중에 생성자를 통해 생성된 것으로 간주된다. 이러한 빈 정의의 한 가지 용도는 레거시 코드로 `static` 팩토리를 호출하는 것이다.

다음 빈 정의는 팩토리 메서드를 호출하여 빈을 생성하도록 지정한다. 정의는 반환된 개체의 유형(클래스)을 지정하지 않고 팩토리 메서드를 포함하는 클래스를 지정한다. 이 예에서 `createInstance()` 방법은 `static` 방법이어야 한다. 다음은 출고 시 방법을 지정하는 예이다:

```xml
<bean id="clientService"
	class="examples.ClientService"
	factory-method="createInstance"/>
```

다음 예제는 앞의 빈 정의와 함께 작동하는 클래스를 보여준다:

```java
public class ClientService {
	private static ClientService clientService = new ClientService();
	private ClientService() {}

	public static ClientService createInstance() {
		return clientService;
	}
}
```

리턴 시 메서드에 인수(선택 사항)를 제공하고 개체가 리턴된 후 개체 인스턴스 속성을 설정하는 메커니즘에 대한 자세한 내용은 [의존성 및 구성](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-properties-detailed.html)을 참조하자.

<br>

# 인스턴스 팩토리 메서드를 사용한 인스턴스화

정적 팩토리 메서드를 통한 인스턴스화와 마찬가지로, 인스턴스 팩토리 메서드를 통한 인스턴스화는 컨테이너에서 기존 빈의 정적이 아닌 메서드를 호출하여 새 빈을 생성한다. 이 메커니즘을 사용하려면 `class` 특성을 비워두고 `factory-bean` 특성에서 개체를 생성하기 위해 호출할 인스턴스 메서드가 포함된 현재(또는 상위) 컨테이너의 빈 이름을 지정한다. `factory-method` 특성을 사용하여 리턴 시 메서드의 이름을 설정한다. 다음 예는 이러한 빈을 구성하는 방법을 보여준다:

```xml
<!-- the factory bean, which contains a method called createInstance() -->
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
	<!-- inject any dependencies required by this locator bean -->
</bean>

<!-- the bean to be created via the factory bean -->
<bean id="clientService"
	factory-bean="serviceLocator"
	factory-method="createClientServiceInstance"/>
```

다음은 해당 클래스를 보여주는 예이다:

```java
public class DefaultServiceLocator {

	private static ClientService clientService = new ClientServiceImpl();

	public ClientService createClientServiceInstance() {
		return clientService;
	}
}
```

다음 예제에서 볼 수 있듯이 하나의 팩토리 클래스에 둘 이상의 팩토리 메서드를 저장할 수도 있다:

```xml
<bean id="serviceLocator" class="examples.DefaultServiceLocator">
	<!-- inject any dependencies required by this locator bean -->
</bean>

<bean id="clientService"
	factory-bean="serviceLocator"
	factory-method="createClientServiceInstance"/>

<bean id="accountService"
	factory-bean="serviceLocator"
	factory-method="createAccountServiceInstance"/>
```

다음은 해당 클래스를 보여주는 예이다:

```java
public class DefaultServiceLocator {

	private static ClientService clientService = new ClientServiceImpl();

	private static AccountService accountService = new AccountServiceImpl();

	public ClientService createClientServiceInstance() {
		return clientService;
	}

	public AccountService createAccountServiceInstance() {
		return accountService;
	}
}
```

이 접근 방식은 의존성 주입(DI)을 통해 팩토리 자체를 관리하고 구성할 수 있음을 보여준다. 자세한 내용은 [의존성 및 구성](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-properties-detailed.html)을 참조하자.

> 스프링 설명서에서 "팩토리 빈"은 스프링 컨테이너에 구성되어 인스턴스 또는 정적 팩토리 메서드를 통해 객체를 생성하는 빈을 말한다. 대조적으로, `FactoryBean`(대문자와 소문자)를 스프링 별 `FactoryBean` 구현 클래스를 나타낸다.

<br>

# 빈의 런타임 유형 결정

특정 빈의 런타임 유형은 결정하기가 쉽지 않다. 빈 메타데이터 정의에서 지정된 클래스는 초기 클래스 참조일 뿐이며, 선언된 팩토리 메서드와 결합되거나 다른 런타임 유형의 빈으로 이어질 수 있는 `FactoryBean` 클래스이다. 인스턴스 수준 팩토리 메서드의 경우(지정된 `factory-bean` 이름으로 대신 해결됨) 전혀 설정되지 않은 경우도 있다. 또한 AOP 프록시는 대상 빈의 실제 유형(구현된 인터페이스만)에 대한 노출이 제한된 인터페이스 기반 프록시로 인스턴스를 래핑할 수 있다.

특정 빈의 실제 런타임 유형을 확인하는 권장 방법은 지정된 빈 이름에 대한 `BeanFactory.getType` 호출이다. 이것은 위의 모든 경우를 고려하고 `BeanFactory.getBean` 호출이 동일한 빈 이름에 대해 반환할 객체의 유형을 반환한다.