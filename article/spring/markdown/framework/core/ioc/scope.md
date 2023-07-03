# 빈 스코프 [#](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html)

빈 정의를 만들 때 해당 빈 정의로 정의된 클래스의 실제 인스턴스를 만들 수 있는 레시피를 만든다. 빈 정의가 레시피라는 개념은 중요하다. 클래스와 마찬가지로 단일 레시피에서 많은 개체 인스턴스를 만들 수 있기 때문이다.

특정 빈 정의에서 생성된 개체에 연결할 다양한 의존성 및 구성 값을 제어할 수 있을 뿐만 아니라 특정 빈 정의에서 생성된 개체의 스코프도 제어할 수 있다. 이 접근 방식은 Java 클래스 수준에서 개체 스코프를 생성할 필요 없이 구성을 통해 생성한 개체 스코프를 선택할 수 있으므로 강력하고 유연하다. 빈은 여러 스코프 중 하나에 배치되도록 정의할 수 있다. 스프링 프레임워크는 6개의 스코프를 지원하며, 그 중 4개는 웹 인식 `ApplicationContext`를 사용하는 경우에만 사용할 수 있다. 사용자 정의 스코프를 생성할 수도 있다.

다음 표에서는 지원되는 스코프를 설명한다:

| Scope       | Description                                                                                                                               |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| singleton   | (기본값) 각 스프링 IoC 컨테이너에 대해 단일 빈 정의를 단일 개체 인스턴스로 스코프를 지정한다.                                                                                  |
| prototype   | 단일 빈 정의의 스코프를 개체 인스턴스의 수에 관계없이 지정한다.                                                                                                      |
| request     | 단일 HTTP 요청의 수명 주기에 대한 단일 정의 스코프를 지정한다. 즉, 각 HTTP 요청에는 단일 빈 정의의 뒷면에서 만들어진 고유한 빈 인스턴스가 있다. 웹 인식 스프링 `ApplicationContext`의 컨텍스트에서만 사용할 수 있다. |
| session     | HTTP `Session`의 수명 주기에 대한 단일 정의 스코프를 지정한다. 웹 인식 스프링 `ApplicationContext`의 컨텍스트에서만 사용할 수 있다.                                               |
| application | `ServletContext`의 수명 주기에 대한 단일 정의 스코프를 지정한다. 웹 인식 스프링 `ApplicationContext`의 컨텍스트에서만 사용할 수 있다.                                             |
| websocket   | `WebSocket`의 수명 주기에 대한 단일 정의 스코프를 지정한다. 웹 인식 스프링 `ApplicationContext`의 컨텍스트에서만 사용할 수 있다.                                                  |

> 스레드 스코를 사용할 수 있지만 기본적으로 등록되지 않는다. 자세한 내용은 `SimpleThreadScope` 설명서를 참조하자. 이 스코프 또는 다른 사용자 지정 스코프를 등록하는 방법에 대한 지침은 사용자 지정 스코프 사용을 참조하자.

# 싱글톤 스코프

싱글톤 빈의 공유 인스턴스 하나만 관리되고 해당 빈 정의와 일치하는 ID를 가진 빈에 대한 모든 요청은 스프링 컨테이너에서 특정 빈 인스턴스 하나를 반환한다.

즉, 빈 정의를 정의하고 싱글톤으로 스코프를 지정하면 스프링 IoC 컨테이너는 해당 빈 정의에 의해 정의된 개체의 인스턴스를 정확히 하나만 만든다. 이 단일 인스턴스는 이러한 싱글톤 빈의 캐시에 저장되며, 명명된 빈에 대한 이후의 모든 요청 및 참조는 캐시된 개체를 반환한다. 다음 이미지는 싱글톤 스코프의 작동 방식을 보여준다:

![](https://docs.spring.io/spring-framework/reference/_images/singleton.png)

스프링의 싱글톤 빈 개념은 Gang of Four(GoF) 패턴북에 정의된 싱글톤 패턴과 다르다. GoF 싱글턴은 특정 클래스의 인스턴스가 ClassLoader당 하나씩만 생성되도록 객체의 스코프를 하드 코딩한다. 스프링 싱글톤의 스코프는 컨테이너당 및 빈당으로 가장 잘 설명된다. 즉, 단일 스프링 컨테이너에서 특정 클래스에 대해 하나의 빈을 정의하는 경우 스프링 컨테이너는 해당 빈 정의에 의해 정의된 클래스의 하나의 인스턴스만 생성한다. 싱글톤 스코프는 스프링의 기본 스코프이다. XML에서 빈을 싱글톤으로 정의하려면 다음 예제와 같이 빈을 정의할 수 있다:

```xml
<bean id="accountService" class="com.something.DefaultAccountService"/>

<!-- the following is equivalent, though redundant (singleton scope is the default) -->
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>
```

# 프로토타입 스코프

빈 배치의 싱글톤이 아닌 프로토타입 스코프는 해당 빈에 대한 요청이 발생할 때마다 새로운 빈 인스턴스를 생성한다. 즉, 빈을 다른 빈에 주입하거나 컨테이너에 `getBean()` 방식으로 요청한다. 일반적으로 모든 상태 저장 빈에는 프로토타입 스코프를 사용하고 상태 저장 빈에는 싱글톤 스코프를 사용해야 한다.

다음 다이어그램은 스프링 프로토타입 스코프를 보여준다:

![](https://docs.spring.io/spring-framework/reference/_images/prototype.png)

(DAO(데이터 액세스 개체)는 일반적으로 프로토타입으로 구성되지 않는다. 일반적인 DAO는 대화 상태를 유지하지 않기 때문이다. 싱글톤 다이어그램의 코어를 재사용하는 것이 더 쉬웠다.)

다음 예제에서는 XML에서 빈을 프로토타입으로 정의한다:

```xml
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

다른 스코프와 달리 스프링은 프로토타입 빈의 전체 라이프사이클을 관리하지 않는다. 컨테이너는 프로토타입 개체를 인스턴스화, 구성 및 조립하고 클라이언트에 전달하며, 추가적인 프로토타입 인스턴스 기록은 없다. 따라서 초기화 라이프사이클 콜백 방법은 스코프에 관계없이 모든 개체에 대해 호출되지만 프로토타입의 경우 구성된 파괴 라이프사이클 콜백은 호출되지 않는다. 클라이언트 코드는 프로토타입 스코프의 개체를 정리하고 프로토타입 빈이 보유한 값비싼 리소스를 해제해야 한다. 스프링 컨테이너가 프로토타입 스코프의 빈이 보유한 자원을 방출하도록 하려면 정리해야 하는 빈에 대한 참조를 보관하는 사용자 지정 [빈 포스트 프로세서](https://docs.spring.io/spring-framework/reference/core/beans/factory-extension.html#beans-factory-extension-bpp)를 사용해 보자.

어떤 면에서, 프로토타입 스코프 빈과 관련된 스프링 컨테이너의 역할은 Java `new` 연산자를 대체하는 것이다. 해당 시점 이후의 모든 라이프사이클 관리는 클라이언트가 처리해야 한다. (스프링 컨테이너에 있는 빈의 라이프사이클에 대한 자세한 내용은 [Lifecycle Callback](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-lifecycle)을 참조하자.

# 프로토타입 빈 의존성이 있는 싱글톤 빈

프로토타입 빈에 의존성이 있는 싱글톤 스코프 빈을 사용하는 경우 의존성은 인스턴스화 시 해결된다. 따라서 싱글톤 스코프 빈에 의존성을 주입하면 새로운 프로토타입 빈이 인스턴스화된 다음 싱글톤 스코프 빈에 의존성을 주입한다. 프로토타입 인스턴스는 싱글톤 스코프 빈에 공급되는 유일한 인스턴스이다.

그러나 싱글톤 스코프 빈이 런타임에 반복적으로 프로토타입 스코프 빈의 새 인스턴스를 획득하도록 가정한다. 스프링 컨테이너가 싱글톤 빈을 인스턴스화하고 그 의존성을 확인하고 주입할 때 해당 주입은 한 번만 수행되기 때문에 프로토타입 스코프의 빈을 싱글톤 빈에 주입할 수 없다. 런타임에 프로토타입 빈의 새 인스턴스가 두 번 이상 필요한 경우 [메서드 주입](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-method-injection.html)을 참조하자.

# 요청, 세션, 응용 프로그램 및 웹 소켓 스코프

`request`, `session`, `application` 및 `websocket` 스코프는 웹 인식 스프링 `ApplicationContext` 구현(예: `XmlWebApplicationContext`)을 사용하는 경우에만 사용할 수 있다. 이러한 스코프를 `ClassPathXmlApplicationContext`와 같은 일반 스프링 IoC 컨테이너와 함께 사용하면 알 수 없는 빈 스코프에 대한 불만을 나타내는 `IllegalStateException`가 느려진다.

## 초기 웹 구성

`request`, `session`, `application`, 그리고 `websocket` 수준(웹 스코프 빈)에서 빈의 스코프 지정을 지원하려면 빈을 정의하기 전에 몇 가지 사소한 초기 구성이 필요하다. (표준 스코프 싱글톤과 프로토타입에는 이 초기 설정이 필요하지 않다.)

이 초기 설정을 수행하는 방법은 특정 서블릿 환경에 따라 다르다.

스프링 웹 MVC 내에서 스코프가 지정된 빈에 액세스하는 경우, 사실상 스프링 `DispatcherServlet`에 의해 처리되는 요청 내에서 특별한 설정이 필요하지 않다. `DispatcherServlet`는 이미 모든 관련 상태를 표시한다.

스프링의 `DispatcherServlet` 외부에서 처리된 요청(예: JSF 사용 시)과 함께 `Servlet` 웹 컨테이너를 사용하는 경우 `org.springframework.web.context.request.RequestContextListener` `ServletRequestListener`를 등록해야 한다. 이 작업은 `WebApplicationInitializer` 인터페이스를 사용하여 프로그래밍 방식으로 수행할 수 있다. 또는 다음 선언을 웹 응용 프로그램의 `web.xml` 파일에 추가한다:

```xml
<web-app>
	...
	<listener>
		<listener-class>
			org.springframework.web.context.request.RequestContextListener
		</listener-class>
	</listener>
	...
</web-app>
```

또는 수신기 설정에 문제가 있는 경우 스프링의 `RequestContextFilter`를 사용하는 것이 좋다. 필터 매핑은 주변 웹 응용 프로그램 구성에 따라 다르므로 적절히 변경해야 한다. 다음 목록은 웹 응용 프로그램의 필터 부분을 보여준다:

```xml
<web-app>
	...
	<filter>
		<filter-name>requestContextFilter</filter-name>
		<filter-class>org.springframework.web.filter.RequestContextFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>requestContextFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	...
</web-app>
```

`DispatcherServlet`, `RequestContextListener` 및 `RequestContextFilter`는 모두 정확히 동일한 작업을 수행한다. 즉, HTTP 요청 개체를 해당 요청을 처리하는 `Thread`에 바인딩한다. 이를 통해 요청 및 세션 스코프가 지정된 빈을 콜 체인 아래에서 사용할 수 있다.

## Request 스코프

빈 정의에 대해 다음 XML 구성을 고려한다:

```xml
<bean id="loginAction" class="com.something.LoginAction" scope="request"/>
```

스프링 컨테이너는 각 HTTP 요청에 대해 `loginAction` 빈 정의를 사용하여 `LoginAction` 빈의 새 인스턴스를 만든다. 즉, `loginAction` 빈은 HTTP 요청 수준에서 스코프가 지정된다. 동일한 `loginAction` 빈 정의에서 생성된 다른 인스턴스는 이러한 변경 사항을 상태로 볼 수 없으므로 생성된 인스턴스의 내부 상태를 얼마든지 변경할 수 있다. 그들은 개별적인 요청에 특별하다. 요청 처리가 완료되면 요청 스코프가 지정된 빈이 삭제된다.

주석 기반 구성 요소 또는 Java 구성을 사용하는 경우 `@RequestScope` 주석을 사용하여 구성 요소를 요청 스코프에 할당할 수 있다. 다음 예제에서는 이 작업을 수행하는 방법을 보여 준다:

```java
@RequestScope
@Component
public class LoginAction {
	// ...
}
```

## Session 스코프

빈 정의에 대해 다음 XML 구성을 고려한다:

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session"/>
```

스프링 컨테이너는 단일 HTTP `Session`의 수명 동안 `userPreferences` 빈 정의를 사용하여 `UserPreferences` 빈의 새 인스턴스를 만든다. 즉, 사용자 환경설정 빈은 HTTP `Session` 수준에서 효과적으로 스코프를 지정한다. 요청 스코프 빈과 마찬가지로 동일한 `userPreferences` 빈 정의에서 생성된 인스턴스를 사용하는 다른 HTTP `Session` 인스턴스는 개별 HTTP `Session`에 한정되기 때문에 이러한 변경 내용이 상태에 있지 않음을 알고 생성된 인스턴스의 내부 상태를 원하는 만큼 변경할 수 있다. HTTP `Session`이 삭제되면 특정 HTTP `Session`으로 스코프가 지정된 빈도 삭제된다.

주석 기반 구성 요소 또는 Java 구성을 사용하는 경우 `@SessionScope` 주석을 사용하여 구성 요소를 `session` 스코프에 할당할 수 있다.

```java
@SessionScope
@Component
public class UserPreferences {
	// ...
}
```

## Application 스코프

빈 정의에 대해 다음 XML 구성을 고려한다:

```xml
<bean id="appPreferences" class="com.something.AppPreferences" scope="application"/>
```

스프링 컨테이너는 전체 웹 응용 프로그램에 대해 `appPreferences` 빈 정의를 한 번 사용하여 `AppPreferences` 빈의 새 인스턴스를 만든다. 즉, `appPreferences` 빈은 `ServletContext` 수준에서 스코프가 지정되고 일반 `ServletContext` 속성으로 저장된다. 이것은 스프링 싱글톤 빈과 다소 비슷하지만 두 가지 중요한 점에서 다르다: 스프링 `ApplicationContext`(특정 웹 응용 프로그램에 여러 개가 있을 수 있음)가 아닌 `ServletContext`당 싱글톤이며 실제로 노출되므로 `ServletContext` 속성으로 볼 수 있다.

주석 기반 구성 요소 또는 Java 구성을 사용하는 경우 `@ApplicationScope` 주석을 사용하여 구성 요소를 `application` 스코프에 할당할 수 있다. 다음 예제에서는 이 작업을 수행하는 방법을 보여 준다:

```java
@ApplicationScope
@Component
public class AppPreferences {
	// ...
}
```

## WebSocket 스코프

`WebSocket` 스코프는 `WebSocket` 세션의 수명 주기와 관련되어 있으며 `WebSocket`을 통한 STOMP 응용 프로그램에 적용된다. 자세한 내용은 [`WebSocket` 스코프](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/scope.html)를 참조하자.

## 의존성으로서의 스코프 빈

스프링 IoC 컨테이너는 객체(빈)의 인스턴스화뿐만 아니라 공동작업자(또는 의존성)의 와이어링도 관리한다. HTTP request 스코프 빈을 더 오래 지속되는 스코프의 다른 빈에 주입하려면(예를 들어) 스코프 빈 대신 AOP 프록시를 주입하도록 선택할 수 있다. 즉, 스코프가 지정된 개체와 동일한 공용 인터페이스를 제공하지만 관련 스코프(예: HTTP 요청)에서 실제 대상 개체를 검색하고 메서드 호출을 실제 개체로 위임할 수 있는 프록시 개체를 주입해야 한다.

> 또한 `singleton`으로 스코프가 지정된 빈 사이에 `<aop:scoped-proxy/>`를 사용할 수 있으며, 참조는 직렬화된 중간 프록시를 통해 대상 싱글톤 빈을 역직렬화할 수 있다.
>
> 스코프 `prototype`의 빈에 대해 `<aop:scoped-proxy/>`를 선언할 때 공유 프록시의 모든 메서드 호출은 호출이 전달되는 새 대상 인스턴스를 생성한다.
>
> 또한, 스코프가 지정된 프록시가 라이프사이클 안전한 방식으로 더 짧은 스코프에서 빈에 액세스할 수 있는 유일한 방법은 아니다. 또한 주입 지점(즉, 생성자 또는 setter 인수 또는 autowired 필드)을 `ObjectFactory<MyTargetBean>`로 선언하여 `getObject()` 호출이 인스턴스를 보유하거나 별도로 저장하지 않고 필요할 때마다 현재 인스턴스를 검색할 수 있다.
>
> 확장 변형으로 `getIfAvailable` 및 `getIfUnique`를 포함한 몇 가지 추가 액세스 변형을 제공하는 `ObjectProvider<MyTargetBean>`를 선언할 수 있다.
>
> 이것의 JSR-330 변형은 `Provider`라고 불리며 모든 검색 시도에 대해 `Provider<MyTargetBean>` 선언 및 해당 `get()` 호출과 함께 사용된다. JSR-330에 대한 자세한 내용은 [여기](https://docs.spring.io/spring-framework/reference/core/beans/standard-annotations.html)를 참조하자.

다음 예제의 구성은 한 줄에 불과하지만 "이유"와 그 뒤에 있는 "방법"을 이해하는 것이 중요하다:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/aop
		https://www.springframework.org/schema/aop/spring-aop.xsd">

	<!-- an HTTP Session-scoped bean exposed as a proxy -->
	<bean id="userPreferences" class="com.something.UserPreferences" scope="session">
		<!-- instructs the container to proxy the surrounding bean -->
		<aop:scoped-proxy/> <!--(1)-->
	</bean>

	<!-- a singleton-scoped bean injected with a proxy to the above bean -->
	<bean id="userService" class="com.something.SimpleUserService">
		<!-- a reference to the proxied userPreferences bean -->
		<property name="userPreferences" ref="userPreferences"/>
	</bean>
</beans>
```

1) 프록시를 정의하는 행이다.

이러한 프록시를 만들려면 스코프 지정 빈 정의에 하위 `<aop:scoped-proxy/>` 요소를 삽입한다(생성할 프록시 유형 선택 및 XML 스키마 기반 구성 참조). `request`, `session` 및 맞춤형 스코프 수준에서 스코프가 지정된 빈의 정의에 `<aop:scoped-proxy/>` 요소가 필요한 이유는 무엇일까? 다음 싱글톤 정의를 고려하고 위에서 언급한 스코프에 대해 정의해야 하는 것과 비교한다(다음 `userPreferences` 빈 정의는 현재 상태로는 불완전하다):

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session"/>

<bean id="userManager" class="com.something.UserManager">
	<property name="userPreferences" ref="userPreferences"/>
</bean>
```

위의 예에서 싱글톤 빈(`userManager`)은 HTTP `Session` 스코프 빈(`userPreferences`)에 대한 참조로 주입된다. 여기서 중요한 점은 `userManager` 빈이 싱글톤이라는 것이다. 컨테이너당 정확히 한 번 인스턴스화되며, 그 의존성(이 경우에는 단 한 번, `userPreferences` 빈)도 한 번만 주입된다. 즉, `userManager` 빈은 정확히 동일한 `userPreferences` 개체(즉, 원래 삽입된 개체)에서만 작동한다.

이것은 수명이 짧은 스코프 빈을 수명이 긴 스코프 빈에 주입할 때 원하는 동작이 아니다(예: HTTP `Session` 스코프 협업 빈을 싱글톤 빈에 의존성으로 주입). 대신 단일 `userManager` 개체가 필요하며, HTTP `Session`의 수명 동안 HTTP `Session`에 특정한 `userPreferences` 개체가 필요하다. 따라서 컨테이너는 `UserPreferences` 클래스(`UserPreferences` 인스턴스인 개체 포함)와 정확히 동일한 공용 인터페이스를 제공하는 개체를 생성하며, 이 개체는 스코프 지정 메커니즘(HTTP `request`, `Session` 등)에서 실제 `UserPreferences` 개체를 가져올 수 있다. 컨테이너는 이 프록시 개체를 `userManager` 빈에 주입한다. 이 `UserPreferences` 참조가 프록시임을 인식하지 못한다. 이 예에서 `UserManager` 인스턴스는 의존성이 할당된 `UserPreferences` 개체에 대해 메서드를 호출할 때 실제로 프록시에서 메서드를 호출하는 것이다. 그런 다음 프록시는 HTTP `Session`에서 실제 `UserPreferences` 개체를 가져오고 검색된 실제 `UserPreferences` 개체에 메서드 호출을 위임한다.

따라서 협업 개체에 `request-` 및 `session-scoped` 빈을 주입할 때는 다음 예제와 같이 다음 구성(올바르고 완전한 구성)이 필요하다:

```xml
<bean id="userPreferences" class="com.something.UserPreferences" scope="session">
	<aop:scoped-proxy/>
</bean>

<bean id="userManager" class="com.something.UserManager">
	<property name="userPreferences" ref="userPreferences"/>
</bean>
```

### 만들 프록시 유형 선택

기본적으로 스프링 컨테이너가 `<aop:scoped-proxy/>` 요소로 표시된 빈에 대한 프록시를 생성하면 CGLIB 기반 클래스 프록시가 생성된다.

> CGLIB 프록시는 공개 메서드 호출만 가로채기한다! 이러한 프록시에서 비공용 메서드를 호출하지 말자. 실제 스코프 대상 개체에 위임되지 않는다.

또는 `<aop:scoped-proxy/>` 요소의 `proxy-target-class` 특성 값에 대한 `false`를 지정하여 스코프가 지정된 빈에 대한 표준 JDK 인터페이스 기반 프록시를 생성하도록 스프링 컨테이너를 구성할 수 있다. JDK 인터페이스 기반 프록시를 사용하면 응용 프로그램 클래스 경로에 이러한 프록시에 영향을 주는 추가 라이브러리가 필요하지 않다. 그러나 스코프 빈의 클래스는 적어도 하나의 인터페이스를 구현해야 하며 스코프 빈이 주입되는 모든 공동작업자는 인터페이스 중 하나를 통해 빈을 참조해야 한다. 다음 예제에서는 인터페이스 기반 프록시를 보여 준다:

```xml
<!-- DefaultUserPreferences implements the UserPreferences interface -->
<bean id="userPreferences" class="com.stuff.DefaultUserPreferences" scope="session">
	<aop:scoped-proxy proxy-target-class="false"/>
</bean>

<bean id="userManager" class="com.stuff.UserManager">
	<property name="userPreferences" ref="userPreferences"/>
</bean>
```

클래스 기반 또는 인터페이스 기반 프록시 선택에 대한 자세한 내용은 [프록시 메커니즘](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)을 참조하자.

# 사용자 지정 스코프

빈 스코프 지정 메커니즘은 확장 가능하다. 사용자가 직접 스코프를 정의하거나 기존 스코프를 재정의할 수도 있지만, 후자는 잘못된 관행으로 간주되며 기본 제공 `singleton` 및 `prototype` 스코프를 재정의할 수도 없다.

## 사용자 지정 스코프 생성

사용자 지정 스코프를 스코프 컨테이너에 통합하려면 이 섹션에서 설명하는 `org.springframework.beans.factory.config.Scope` 인터페이스를 구현해야 한다. 자체 범위를 구현하는 방법에 대한 자세한 내용은 스프링 프레임워크 자체와 함께 제공되는 `Scope` 구현 및 구현해야 하는 방법을 설명하는 `Scope` javadoc을 참조하자.

`Scope` 인터페이스에는 스코프에서 개체를 가져오고 스코프에서 개체를 제거한 후 삭제할 수 있는 네 가지 방법이 있다.

예를 들어 세션 스코프 구현은 세션 스코프 빈을 반환한다(존재하지 않는 경우 메서드는 나중에 참조할 수 있도록 세션에 바인딩한 후 빈의 새 인스턴스를 반환한다). 다음 메서드는 기본 스코프에서 개체를 반환한다:

```java
Object get(String name, ObjectFactory<?> objectFactory)
```

예를 들어 세션 스코프 구현은 기본 세션에서 세션 스코프 빈을 제거한다. 개체를 반환해야 하지만 지정한 이름의 개체를 찾을 수 없는 경우 `null`을(를) 반환할 수 있다. 다음 방법은 기본 스코프에서 개체를 제거한다:

```java
Object remove(String name)
```

다음 메서드는 스코프가 삭제되거나 스코프의 지정된 개체가 삭제될 때 호출해야 하는 콜백을 등록한다:

```java
void registerDestructionCallback(String name, Runnable destructionCallback)
```

파괴 콜백에 대한 자세한 내용은 [javadoc](https://docs.spring.io/spring-framework/docs/6.0.10/javadoc-api/org/springframework/beans/factory/config/Scope.html#registerDestructionCallback) 또는 스프링 스코프 구현을 참조하자.

다음 방법은 기본 스코프에 대한 대화 식별자를 가져온다:

```java
String getConversationId()
```

이 식별자는 스코프마다 다르다. 세션 스코프 구현의 경우 이 식별자가 세션 식별자가 될 수 있다.

## 사용자 지정 스코프 사용

하나 이상의 사용자 정의 `Scope` 구현을 작성하고 테스트한 후에는 스프링 컨테이너에 새 스코프를 알려야 한다. 다음 방법은 스프링 컨테이너에 새 `Scope`를 등록하는 중심 방법이다:

```java
void registerScope(String scopeName, Scope scope);
```

이 방법은 스프링과 함께 제공되는 대부분의 구체적인 `ApplicationContext` 구현에서 `BeanFactory` 속성을 통해 사용할 수 있는 `ConfigurableBeanFactory` 인터페이스에서 선언된다.

`registerScope(..)` 메서드의 첫 번째 인수는 스코프와 연결된 고유 이름이다. 스프링 컨테이너 자체에 있는 이러한 이름의 예로는 `singleton`과 `prototype`가 있다. `registerScope(..)` 메서드의 두 번째 인수는 등록하고 사용하려는 사용자 지정 `Scope` 구현의 실제 인스턴스이다.

사용자 정의 `Scope` 구현을 작성한 다음 다음 예제와 같이 등록한다고 가정한다.

> 다음 예제에서는 스프링에 포함되어 있지만 기본적으로 등록되지 않은 `SimpleThreadScope`를 사용한다. 사용자 지정 `Scope` 구현에 대한 지침은 동일하다.

```java
Scope threadScope = new SimpleThreadScope();
beanFactory.registerScope("thread", threadScope);
```

그런 다음 다음 사용자 정의 `Scope`의 범위 지정 규칙을 따르는 빈 정의를 생성할 수 있다:

```xml
<bean id="..." class="..." scope="thread">
```

사용자 지정 `Scope` 구현을 사용하면 스코프의 프로그래밍 방식 등록에 제한되지 않는다. 또한 다음 예제와 같이 `CustomScopeConfigurer` 클래스를 사용하여 `Scope` 등록을 선언적으로 수행할 수 있다:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/aop
		https://www.springframework.org/schema/aop/spring-aop.xsd">

	<bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
		<property name="scopes">
			<map>
				<entry key="thread">
					<bean class="org.springframework.context.support.SimpleThreadScope"/>
				</entry>
			</map>
		</property>
	</bean>

	<bean id="thing2" class="x.y.Thing2" scope="thread">
		<property name="name" value="Rick"/>
		<aop:scoped-proxy/>
	</bean>

	<bean id="thing1" class="x.y.Thing1">
		<property name="thing2" ref="thing2"/>
	</bean>

</beans>
```

> `FactoryBean` 구현을 위해 `<bean>` 선언 내에 `<aop:scoped-proxy/>`를 배치할 때 스코프가 지정되는 것은 팩토리에서 반환되는 개체가 아니라 `getObject()` 자체이다.