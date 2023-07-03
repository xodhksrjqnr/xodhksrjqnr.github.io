# 메소드 주입 [#](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-method-injection.html)

대부분의 애플리케이션 시나리오에서 컨테이너에 있는 대부분의 빈은 [싱글톤](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton)이다. 싱글톤 빈이 다른 싱글톤 빈과 공동 작업해야 하거나 싱글톤이 아닌 빈이 다른 싱글톤이 아닌 빈과 공동 작업해야 하는 경우 일반적으로 한 빈을 다른 빈의 속성으로 정의하여 의존성을 처리한다. 빈의 라이프 사이클이 다를 때 문제가 발생한다. 싱글톤 빈 A가 싱글톤이 아닌(프로토타입) 빈 B를 사용해야 한다고 가정하자. 아마도 A의 각 방법 호출에 사용될 것이다. 컨테이너는 싱글톤 빈 A를 한 번만 생성하므로 속성을 설정할 수 있는 기회는 한 번뿐이다. 컨테이너는 A가 필요할 때마다 B의 새 인스턴스를 제공할 수 없다.

해결책은 통제의 반전을 막는 것이다. `ApplicationContextAware` 인터페이스를 구현하고 [컨테이너에 대한 `getBean("B")` 호출](https://docs.spring.io/spring-framework/reference/core/beans/basics.html#beans-factory-client)을 통해 빈 A가 필요로 할 때마다 빈 B 인스턴스(일반적으로 새로운)를 요청함으로써 [컨테이너를 A가 인식](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-aware)하도록 할 수 있다. 다음은 이 접근 방식을 보여주는 예이다:

```java
package fiona.apple;

// Spring-API imports
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * A class that uses a stateful Command-style class to perform
 * some processing.
 */
public class CommandManager implements ApplicationContextAware {

	private ApplicationContext applicationContext;

	public Object process(Map commandState) {
		// grab a new instance of the appropriate Command
		Command command = createCommand();
		// set the state on the (hopefully brand new) Command instance
		command.setState(commandState);
		return command.execute();
	}

	protected Command createCommand() {
		// notice the Spring API dependency!
		return this.applicationContext.getBean("command", Command.class);
	}

	public void setApplicationContext(
			ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}
}
```

비즈니스 코드가 스프링 프레임워크를 인식하고 연결되어 있기 때문에 앞의 것은 바람직하지 않다. 스프링 IoC 컨테이너의 다소 고급 기능인 Method Injection을 사용하면 이 사용 사례를 깨끗하게 처리할 수 있다.

> [이 블로그](https://spring.io/blog/2004/08/06/method-injection) 항목에서 메소드 주입 동기에 대해 자세히 알아볼 수 있다.

# Lookup 메서드 주입

Lookup 메서드 주입은 컨테이너 관리 빈에 대한 메서드를 재정의하고 컨테이너에 있는 다른 명명된 빈에 대한 조회 결과를 반환하는 컨테이너의 기능이다. 이전 섹션에서 설명한 시나리오와 같이 일반적으로 검색에는 프로토타입 빈이 포함된다. 스프링 프레임워크는 CGLIB 라이브러리의 바이트 코드 생성을 사용하여 메서드를 재정의하는 하위 클래스를 동적으로 생성하여 이 메서드 주입을 구현한다.

> - 이 동적 하위 분류가 작동하려면 스프링 빈 컨테이너 하위 클래스가 `final`일 수 없고 재정의할 메서드도 `final`일 수 없다.
> - `abstract` 메서드가 있는 클래스를 단위 테스트하려면 사용자가 직접 클래스를 하위 클래스로 분류하고 `abstract` 메서드의 스텁 구현을 제공해야 한다.
> - 구체적인 방법은 구성 요소 스캔에도 필요하며, 이를 위해서는 구체적인 클래스를 선택해야 한다.
> - 또 다른 주요 제한 사항은 Lookup 메서드가 팩토리 메서드와 함께 작동하지 않으며 특히 구성 클래스의 `@Bean` 메서드와 함께 작동하지 않는다는 것이다. 이 경우 컨테이너가 인스턴스 생성을 담당하지 않으므로 런타임 생성 하위 클래스를 즉시 생성할 수 없다.

이전 코드 스니펫의 `CommandManager` 클래스의 경우 스프링 컨테이너가 `createCommand()` 메서드의 구현을 동적으로 재정의한다. 재작업된 예에서 알 수 있듯이 `CommandManager` 클래스에는 스프링 의존성이 없다:

```java
package fiona.apple;

// no more Spring imports!

public abstract class CommandManager {

	public Object process(Object commandState) {
		// grab a new instance of the appropriate Command interface
		Command command = createCommand();
		// set the state on the (hopefully brand new) Command instance
		command.setState(commandState);
		return command.execute();
	}

	// okay... but where is the implementation of this method?
	protected abstract Command createCommand();
}
```

주입할 방법(이 경우 `CommandManager`)을 포함하는 클라이언트 클래스에서 주입할 방법에는 다음 형식의 서명이 필요하다:

```xml
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```

메서드가 `abstract`인 경우 동적으로 생성된 하위 클래스가 메서드를 구현한다. 그렇지 않으면 동적으로 생성된 하위 클래스가 원래 클래스에 정의된 구체적인 메서드를 재정의한다. 다음 예를 생각해 보자:

```xml
<!-- a stateful bean deployed as a prototype (non-singleton) -->
<bean id="myCommand" class="fiona.apple.AsyncCommand" scope="prototype">
	<!-- inject dependencies here as required -->
</bean>

<!-- commandProcessor uses statefulCommandHelper -->
<bean id="commandManager" class="fiona.apple.CommandManager">
	<lookup-method name="createCommand" bean="myCommand"/>
</bean>
```

`commandManager`로 식별된 빈은 `myCommand` 빈의 새로운 인스턴스가 필요할 때마다 자체적인 `createCommand()` 메서드를 부른다. 실제로 필요한 경우 `myCommand` 빈을 프로토타입으로 배포하도록 주의해야 한다. 싱글톤인 경우 매번 동일한 `myCommand` 빈 인스턴스가 반환된다.

또는 주석 기반 구성 요소 모델 내에서 다음 예제와 같이 `@Lookup` 주석을 통해 조회 방법을 선언할 수 있다:

```java
public abstract class CommandManager {

	public Object process(Object commandState) {
		Command command = createCommand();
		command.setState(commandState);
		return command.execute();
	}

	@Lookup("myCommand")
	protected abstract Command createCommand();
}
```

또는 보다 관용적으로, 선언된 조회 방법의 반환 유형에 대해 대상 빈이 확인되어야 한다:

```java
public abstract class CommandManager {

	public Object process(Object commandState) {
		Command command = createCommand();
		command.setState(commandState);
		return command.execute();
	}

	@Lookup
	protected abstract Command createCommand();
}
```

이러한 주석이 달린 조회 방법을 구체적인 스텁 구현과 함께 선언해야 추상 클래스가 기본적으로 무시되는 스프링의 구성 요소 검색 규칙과 호환된다. 이 제한은 명시적으로 등록되거나 명시적으로 가져온 빈 클래스에는 적용되지 않는다.

> 다른 범위의 대상 빈에 액세스하는 또 다른 방법은 `ObjectFactory`/`Provider` 주입 지점이다. 범위 빈을 의존성으로 참조하자.
>
> `org.springframework.beans.factory.config` 패키지의 `ServiceLocatorFactoryBean`도 유용할 수 있다.

# 임의 메서드 대체

조회 방법 주입보다 덜 유용한 방법 주입의 형태는 관리되는 빈에서 임의의 방법을 다른 방법 구현으로 대체하는 기능이다. 이 기능이 실제로 필요할 때까지 이 섹션의 나머지 부분을 안전하게 건너뛸 수 있다.

XML 기반 구성 메타데이터를 사용하면 `replaced-method` 요소를 사용하여 배포된 빈에 대한 기존 메서드 구현을 다른 메서드로 바꿀 수 있다. 재정의하려는 `computeValue`라는 메서드가 있는 다음 클래스를 생각해 보자:

```java
public class MyValueCalculator {

	public String computeValue(String input) {
		// some real code...
	}

	// some other methods...
}
```

`org.springframework.beans.factory.support.MethodReplacer` 인터페이스를 구현하는 클래스는 다음 예제와 같이 새 메서드 정의를 제공한다:

```java
/**
 * meant to be used to override the existing computeValue(String)
 * implementation in MyValueCalculator
 */
public class ReplacementComputeValue implements MethodReplacer {

	public Object reimplement(Object o, Method m, Object[] args) throws Throwable {
		// get the input value, work with it, and return a computed result
		String input = (String) args[0];
		...
		return ...;
	}
}
```

원래 클래스를 배포하고 메서드 재정의를 지정하는 빈 정의는 다음 예와 유사하다:

```xml
<bean id="myValueCalculator" class="x.y.z.MyValueCalculator">
	<!-- arbitrary method replacement -->
	<replaced-method name="computeValue" replacer="replacementComputeValue">
		<arg-type>String</arg-type>
	</replaced-method>
</bean>

<bean id="replacementComputeValue" class="a.b.c.ReplacementComputeValue"/>
```

`<replaced-method/>` 요소 내에서 하나 이상의 `<arg-type/>` 요소를 사용하여 재정의되는 메서드의 메서드 시그니처를 나타낼 수 있다. 메서드가 오버로드되고 클래스 내에 여러 변형이 있는 경우에만 인수에 대한 서명이 필요하다. 편의를 위해 인수 형식 문자열은 정규화된 형식 이름의 하위 문자열일 수 있다. 예를 들어 다음은 `java.lang.String`과 모두 일치한다.:

```java
java.lang.String
String
Str
```

인수 수가 각 가능한 선택 항목을 구분하기에 충분할 때가 많기 때문에 이 방법을 사용하면 인수 유형과 일치하는 가장 짧은 문자열만 입력할 수 있으므로 입력 작업을 많이 줄일 수 있다.