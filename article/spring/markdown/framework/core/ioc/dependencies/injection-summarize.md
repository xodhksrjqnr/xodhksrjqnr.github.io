# 의존성 주입

DI(Dependency Injection)는 생성자 인수, 팩토리 메서드에 대한 인수 또는 팩토리 메서드에서 생성되거나 반환된 후 개체 인스턴스에 설정된 속성을 통해서만 개체(즉, 개체가 작업하는 다른 개체)의 의존성을 정의하는 프로세스이다. 그런 다음 컨테이너는 빈을 생성할 때 이러한 의존성을 주입한다. 이 프로세스는 기본적으로 직접 클래스 구성 또는 서비스 로케이터 패턴을 사용하여 의존성의 인스턴스화 또는 위치를 자체적으로 제어하는 빈 자체의 역(즉, 제어의 역)이다.

코드는 DI 원칙으로 더 깨끗하고, 디커플링은 객체가 의존성과 함께 제공될 때 더 효과적이다. 개체는 의존성을 조회하지 않으며 의존성의 위치나 클래스를 알지 못한다. 그 결과, 특히 의존성이 인터페이스 또는 추상 기본 클래스에 있을 때는 클래스를 테스트하기가 쉬워지며, 이를 통해 단위 테스트에 스텁 또는 모의 구현을 사용할 수 있다.

DI는 두 가지 주요 변형으로 존재한다: 생성자 기반 의존성 주입 및 setter 기반 의존성 주입.

# 생성자 기반 의존성 주입

생성자 기반 DI는 컨테이너가 각각 의존성을 나타내는 여러 인수로 생성자를 호출하여 수행된다. 특정 인수를 사용하여 `static` 팩토리 메서드를 호출하는 것은 거의 동등하며, 이 논의는 생성자 및 `static` 팩토리 메서드와 유사하게 인수를 처리한다. 다음 예제에서는 생성자 주입으로만 의존성 주입할 수 있는 클래스를 보여 준다:

```java
public class SimpleMovieLister {

	// the SimpleMovieLister has a dependency on a MovieFinder
	private final MovieFinder movieFinder;

	// a constructor so that the Spring container can inject a MovieFinder
	public SimpleMovieLister(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// business logic that actually uses the injected MovieFinder is omitted...
}
```

이 클래스에는 특별한 것이 없다. 컨테이너별 인터페이스, 기본 클래스 또는 주석에 대한 의존성이 없는 POJO이다.

## 생성자 인수 확인

생성자 인수 확인 일치는 인수 유형을 사용하여 발생한다. 빈 정의의 생성자 인수에 잠재적인 모호성이 없는 경우, 생성자 인수가 빈 정의에서 정의되는 순서는 빈이 인스턴스화될 때 해당 인수가 적절한 생성자에게 제공되는 순서이다. 다음 클래스를 고려한다:

```java
package x.y;

public class ThingOne {

	public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
		// ...
	}
}
```

`ThingTwo` 클래스와 `ThingThree` 클래스가 상속에 의해 관련되지 않는다고 가정하면 잠재적인 모호성이 존재하지 않는다. 따라서 다음 구성은 정상적으로 작동하며 생성자 인수 인덱스 또는 유형을 `<constructor-arg/>` 요소에 명시적으로 지정할 필요가 없다.

```xml
<beans>
	<bean id="beanOne" class="x.y.ThingOne">
		<constructor-arg ref="beanTwo"/>
		<constructor-arg ref="beanThree"/>
	</bean>

	<bean id="beanTwo" class="x.y.ThingTwo"/>

	<bean id="beanThree" class="x.y.ThingThree"/>
</beans>
```

다른 빈이 참조되면 유형이 알려져 일치가 발생할 수 있다(앞의 예와 동일). `<value>true</value>`와 같은 단순 유형이 사용되는 경우 스프링은 값 유형을 확인할 수 없으므로 도움 없이 유형별로 일치시킬 수 없다. 다음 클래스를 고려한다:

```java
package examples;

public class ExampleBean {

	// Number of years to calculate the Ultimate Answer
	private final int years;

	// The Answer to Life, the Universe, and Everything
	private final String ultimateAnswer;

	public ExampleBean(int years, String ultimateAnswer) {
		this.years = years;
		this.ultimateAnswer = ultimateAnswer;
	}
}
```

앞의 시나리오에서 컨테이너는 다음 예제와 같이 `type` 특성을 사용하여 생성자 인수의 유형을 명시적으로 지정하는 경우 단순 유형과 유형 일치를 사용할 수 있다:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<constructor-arg type="int" value="7500000"/>
	<constructor-arg type="java.lang.String" value="42"/>
</bean>
```

다음 예제에서 볼 수 있듯이 `index` 특성을 사용하여 생성자 인수의 인덱스를 명시적으로 지정할 수 있다:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<constructor-arg index="0" value="7500000"/>
	<constructor-arg index="1" value="42"/>
</bean>
```

여러 단순 값의 모호성을 해결할 수 있을 뿐만 아니라 인덱스를 지정하면 생성자가 동일한 유형의 두 인수를 갖는 모호성을 해결할 수 있다.

> 인덱스는 0을 시작으로 한다.

다음 예제에서 볼 수 있듯이 생성자 매개 변수 이름을 값의 모호성 해제에 사용할 수도 있다:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<constructor-arg name="years" value="7500000"/>
	<constructor-arg name="ultimateAnswer" value="42"/>
</bean>
```

이 작업을 즉시 수행하려면 스프링이 생성자에서 매개 변수 이름을 조회할 수 있도록 디버그 플래그를 활성화한 상태로 코드를 컴파일해야 한다. 디버그 플래그로 코드를 컴파일할 수 없거나 컴파일하지 않으려면 `@ConstructorProperties` JDK 주석을 사용하여 생성자 인수의 이름을 명시적으로 지정할 수 있다. 그러면 샘플 클래스는 다음과 같이 표시되어야 한다:

```java
package examples;

public class ExampleBean {

	// Fields omitted

	@ConstructorProperties({"years", "ultimateAnswer"})
	public ExampleBean(int years, String ultimateAnswer) {
		this.years = years;
		this.ultimateAnswer = ultimateAnswer;
	}
}
```

# Setter 기반 의존성 주입

Setter 기반 DI는 빈을 인스턴스화하기 위해 무인자 생성자 또는 무인자 `static` 팩토리 메서드를 호출한 후 빈에 대한 컨테이너 호출 setter 메서드를 통해 수행된다.

다음 예제에서는 순수 setter 주입을 사용하여 의존성 주입만 수행할 수 있는 클래스를 보여 준다. 이 클래스는 기존 Java이다. 컨테이너별 인터페이스, 기본 클래스 또는 주석에 대한 의존성이 없는 POJO이다.

```java
public class SimpleMovieLister {

	// the SimpleMovieLister has a dependency on the MovieFinder
	private MovieFinder movieFinder;

	// a setter method so that the Spring container can inject a MovieFinder
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// business logic that actually uses the injected MovieFinder is omitted...
}
```

`ApplicationContext`는 관리하는 빈에 대해 생성자 기반 및 setter 기반 DI를 지원한다. 또한 일부 의존성이 이미 생성자 접근 방식을 통해 주입된 후에는 setter 기반 DI를 지원한다. `BeanDefinition` 인스턴스와 함께 사용하여 속성을 한 형식에서 다른 형식으로 변환하는 `PropertyEditor` 형식으로 의존성을 구성한다. 그러나 대부분의 스프링 사용자는 이러한 클래스를 직접(즉, 프로그래밍 방식으로) 사용하지 않고 XML 빈 정의, 주석이 달린 구성 요소(즉, `@Component`, `@Controller` 등으로 주석이 달린 클래스) 또는 Java 기반 `@Configuration` 클래스의 `@Bean` 메서드를 사용한다. 그런 다음 이러한 소스는 내부적으로 `BeanDefinition` 인스턴스로 변환되어 전체 스프링 IoC 컨테이너 인스턴스를 로드하는 데 사용된다.

> ## 생성자 기반 또는 설정자 기반 DI?
>
> 생성자 기반 DI와 setter 기반 DI를 혼합할 수 있으므로 필수 의존성에는 생성자를 사용하고 선택적 의존성에는 setter 메서드 또는 구성 메서드를 사용하는 것이 좋다. setter 방법에 대한 `@Autowired` 주석의 사용은 속성을 필수 의존성으로 만드는 데 사용될 수 있지만, 프로그래밍 방식의 인수 유효성 검사를 사용하는 생성자 주입이 선호된다.
> 
> 스프링 팀은 일반적으로 생성자 주입을 지지한다. 이는 애플리케이션 구성 요소를 불변 객체로 구현하고 필요한 의존성이 `null`이지 않도록 보장하기 때문이다. 또한 생성자가 주입한 구성 요소는 항상 완전히 초기화된 상태에서 클라이언트(호출) 코드로 반환된다. 참고로, 많은 수의 생성자 인수는 나쁜 코드의 냄새가 나며, 이는 클래스가 너무 많은 책임을 가지고 있으며 적절한 우려 분리를 더 잘 해결하기 위해 리팩터링되어야 한다는 것을 의미한다.
> 
> setter 주입은 주로 클래스 내에서 합리적인 기본값을 할당할 수 있는 선택적 의존성에만 사용해야 한다. 그렇지 않으면 코드가 의존성을 사용하는 모든 곳에서 `null`이 아닌 검사를 수행해야 한다. setter 주입의 한 가지 이점은 setter 방법이 해당 클래스의 객체를 나중에 재구성하거나 다시 주입할 수 있게 한다는 것이다. 따라서 [JMX MBeans](https://docs.spring.io/spring-framework/reference/integration/jmx.html)를 통한 관리는 setter 주입을 위한 강력한 사용 사례이다.
> 
> 특정 클래스에 가장 적합한 DI 스타일을 사용한다. 때때로 소스가 없는 타사 클래스를 처리할 때 사용자를 위해 선택이 이루어진다. 예를 들어, 타사 클래스가 setter 메서드를 노출하지 않는 경우 생성자 주입이 유일한 DI 형식일 수 있다.

# 의존성 해결 프로세스

컨테이너는 다음과 같이 빈 의존성 확인을 수행한다:

- `ApplicationContext`는 모든 빈을 설명하는 구성 메타데이터를 사용하여 생성되고 초기화된다. 구성 메타데이터는 XML, Java 코드 또는 주석으로 지정할 수 있다.
- 각 빈에 대한 의존성은 정적 팩토리 메서드에 대한 속성, 생성자 인수 또는 인수의 형태로 표시된다(일반 생성자 대신 이를 사용하는 경우). 이러한 의존성은 빈이 실제로 만들어졌을 때 빈에 제공된다.
- 각 속성 또는 생성자 인수는 설정할 값의 실제 정의이거나 컨테이너의 다른 빈에 대한 참이니다.
- 값인 각 속성 또는 생성자 인수는 지정된 형식에서 해당 속성 또는 생성자 인수의 실제 유형으로 변환된다. 기본적으로 스프링은 문자열 형식으로 제공된 값을 `int`, `long`, `boolean`, `String` 등의 모든 기본 제공 유형으로 변환할 수 있다.

스프링 컨테이너는 컨테이너가 생성될 때 각 빈의 구성을 확인한다. 그러나 실제로 빈이 만들어지기 전까지는 빈의 속성 자체가 설정되지 않는다. 싱글톤 범위이며 사전 인스턴스화(기본값)로 설정된 빈은 컨테이너가 생성될 때 만들어진다. 범위는 [빈 스코프](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html)에 정의되어 있다. 그렇지 않으면 요청이 있을 때만 빈이 만들어진다. 빈의 의존성과 빈의 의존성(등)이 생성되고 할당될 때 빈의 그래프가 잠재적으로 만들어진다. 이러한 의존성 간의 해상도 불일치가 늦게 나타날 수 있다. 즉, 영향을 받는 빈을 처음 만들 때이다.

> ## 순환 의존성
>
> 생성자 주입을 주로 사용하는 경우 확인할 수 없는 순환 의존성 시나리오를 만들 수 있다.
>
> 예를 들어 클래스 A에는 생성자 주입을 통한 클래스 B의 인스턴스가 필요하고 클래스 B에는 생성자 주입을 통한 클래스 A의 인스턴스가 필요하다. 클래스 A와 B가 서로 주입되도록 빈을 구성하는 경우 스프링 IoC 컨테이너는 런타임에 이 순환 참조를 감지하고 `BeanCurrentlyInCreationException`를 던진다.
>
> 가능한 한 가지 해결책은 생성자가 아닌 설정자가 구성할 일부 클래스의 소스 코드를 편집하는 것이다. 또는 생성자 주입을 피하고 setter 주입만 사용하자. 즉, 권장되지는 않지만 setter 주입을 사용하여 순환 의존성을 구성할 수 있다.
>
> 일반적인 경우(순환 의존성이 없음)와 달리, 빈 A와 빈 B 사이의 순환 의존성은 빈 자체가 완전히 초기화되기 전에 빈 중 하나가 다른 빈에 주입되도록 한다(고전적인 닭과 달걀 시나리오).

당신은 일반적으로 스프링이 옳은 일을 할 것이라고 믿을 수 있다. 존재하지 않는 빈에 대한 참조 및 순환 의존성과 같은 구성 문제를 컨테이너 로드 시간에 탐지한다. 스프링은 속성을 설정하고 빈이 실제로 생성될 때 가능한 늦게 의존성을 해결한다. 즉, 올바르게 로드된 스프링 컨테이너는 나중에 개체를 만들 때 해당 개체 또는 해당 의존성 중 하나를 만드는 데 문제가 있을 때 예외를 생성할 수 있다. 예를 들어 빈이 누락되거나 잘못된 속성으로 인해 예외를 던진다. 일부 구성 문제에 대한 잠재적인 가시성 지연은 기본적으로 `ApplicationContext` 구현이 싱글톤 빈을 사전 검증하는 이유이다. 실제로 필요하기 전에 이러한 빈을 생성하는 데 필요한 초기 시간과 메모리를 희생하여 나중이 아니라 `ApplicationContext`를 생성할 때 구성 문제를 발견할 수 있다. 이 기본 동작을 재정의하여 싱글톤 빈이 열심히 사전 인스턴스화되지 않고 느리게 초기화되도록 할 수 있다.

순환 의존성이 존재하지 않는 경우 하나 이상의 협력 빈이 종속 빈에 주입될 때 각 협력 빈은 종속 빈에 주입되기 전에 완전히 구성된다. 즉, 빈 A가 빈 B에 종속되어 있는 경우 스프링 IoC 컨테이너는 빈 A에서 setter 방법을 호출하기 전에 빈 B를 완전히 구성한다. 즉, 빈이 인스턴스화되고(사전 인스턴스화된 싱글톤이 아닌 경우), 의존성이 설정되며, 관련 라이프사이클 방법(예: [구성된 init 방법](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-lifecycle-initializingbean) 또는 [InitializingBean 콜백 방법](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-lifecycle-initializingbean))이 호출된다.

# 의존성 주입 예제

다음 예제에서는 setter 기반 DI에 XML 기반 구성 메타데이터를 사용한다. 스프링 XML 구성 파일의 일부는 다음과 같이 일부 빈 정의를 지정한다:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<!-- setter injection using the nested ref element -->
	<property name="beanOne">
		<ref bean="anotherExampleBean"/>
	</property>

	<!-- setter injection using the neater ref attribute -->
	<property name="beanTwo" ref="yetAnotherBean"/>
	<property name="integerProperty" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

다음은 해당 `ExampleBean` 클래스의 예이다:

```java
public class ExampleBean {

	private AnotherBean beanOne;

	private YetAnotherBean beanTwo;

	private int i;

	public void setBeanOne(AnotherBean beanOne) {
		this.beanOne = beanOne;
	}

	public void setBeanTwo(YetAnotherBean beanTwo) {
		this.beanTwo = beanTwo;
	}

	public void setIntegerProperty(int i) {
		this.i = i;
	}
}
```

위의 예에서 설정자는 XML 파일에 지정된 속성과 일치하도록 선언된다. 다음 예제에서는 생성자 기반 DI를 사용한다:

```xml
<bean id="exampleBean" class="examples.ExampleBean">
	<!-- constructor injection using the nested ref element -->
	<constructor-arg>
		<ref bean="anotherExampleBean"/>
	</constructor-arg>

	<!-- constructor injection using the neater ref attribute -->
	<constructor-arg ref="yetAnotherBean"/>

	<constructor-arg type="int" value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

다음은 해당 `ExampleBean` 클래스의 예이다:

```java
public class ExampleBean {

	private AnotherBean beanOne;

	private YetAnotherBean beanTwo;

	private int i;

	public ExampleBean(
		AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {
		this.beanOne = anotherBean;
		this.beanTwo = yetAnotherBean;
		this.i = i;
	}
}
```

빈 정의에 지정된 생성자 인수는 `ExampleBean` 생성자에 대한 인수로 사용된다.

이제 생성자를 사용하는 대신 스프링이 `static` 팩토리 메서드를 호출하여 객체의 인스턴스를 반환하도록 하는 이 예제의 변형을 생각해 보자:

```xml
<bean id="exampleBean" class="examples.ExampleBean" factory-method="createInstance">
	<constructor-arg ref="anotherExampleBean"/>
	<constructor-arg ref="yetAnotherBean"/>
	<constructor-arg value="1"/>
</bean>

<bean id="anotherExampleBean" class="examples.AnotherBean"/>
<bean id="yetAnotherBean" class="examples.YetAnotherBean"/>
```

다음은 해당 `ExampleBean` 클래스의 예이다:

```java
public class ExampleBean {

	// a private constructor
	private ExampleBean(...) {
		...
	}

	// a static factory method; the arguments to this method can be
	// considered the dependencies of the bean that is returned,
	// regardless of how those arguments are actually used.
	public static ExampleBean createInstance (
		AnotherBean anotherBean, YetAnotherBean yetAnotherBean, int i) {

		ExampleBean eb = new ExampleBean (...);
		// some other operations...
		return eb;
	}
}
```

`static` 팩토리 메서드에 대한 인수는 생성자가 실제로 사용된 것과 정확히 동일한 `<constructor-arg/>` 요소에 의해 제공된다. 리턴 시 방법으로 반환되는 클래스의 유형은 `static` 리턴 시 방법을 포함하는 클래스와 동일한 유형일 필요는 없다(그러나 이 예에서는 그렇다). 인스턴스(비정적) 팩토리 메서드는 기본적으로 동일한 방식으로 사용할 수 있으므로(이는 `class` 속성 대신 `factory-bean` 속성을 사용하여) 여기서는 이러한 세부 정보에 대해 설명하지 않는다.