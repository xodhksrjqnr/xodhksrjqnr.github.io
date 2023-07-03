# 의존성 및 구성 세부 정보 [#](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-properties-detailed.html)

이전 섹션에서 설명한 대로 빈 속성 및 생성자 인수를 다른 빈(공동작업자)에 대한 참조 또는 인라인으로 정의된 값으로 정의할 수 있다. 스프링의 XML 기반 구성 메타데이터는 이를 위해 `<property/>` 및 `<constructor-arg/>` 요소 내에서 하위 요소를 지원한다.

# Straight Values (Primitives, Strings, and so on)

`<property/>` 요소의 `value` 특성은 속성 또는 생성자 인수를 사람이 읽을 수 있는 문자열 표현으로 지정한다. 스프링의 [변환 서비스](https://docs.spring.io/spring-framework/reference/core/validation/convert.html#core-convert-ConversionService-API)는 이러한 값을 `String`에서 속성 또는 인수의 실제 유형으로 변환하는 데 사용된다. 다음 예제에서는 다양한 값을 설정하는 방법을 보여준다:

```xml
<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
	<!-- results in a setDriverClassName(String) call -->
	<property name="driverClassName" value="com.mysql.jdbc.Driver"/>
	<property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
	<property name="username" value="root"/>
	<property name="password" value="misterkaoli"/>
</bean>
```

다음 예제에서는 `p-namespace`를 사용하여 더욱 간결한 XML 구성을 제공한다:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:p="http://www.springframework.org/schema/p"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
	https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="myDataSource" class="org.apache.commons.dbcp.BasicDataSource"
		destroy-method="close"
		p:driverClassName="com.mysql.jdbc.Driver"
		p:url="jdbc:mysql://localhost:3306/mydb"
		p:username="root"
		p:password="misterkaoli"/>

</beans>
```

앞의 XML이 더 간결하다. 그러나 빈 정의를 만들 때 자동 특성 완료를 지원하는 IDE(InteliJ IDEA 또는 이클립스용 스프링 툴)를 사용하지 않는 한 설계 시간이 아닌 런타임에 오타가 발견된다. 이러한 IDE 지원을 적극 권장한다.

다음과 같이 `java.util.Properties` 인스턴스를 구성할 수도 있다:

```xml
<bean id="mappings"
	class="org.springframework.context.support.PropertySourcesPlaceholderConfigurer">

	<!-- typed as a java.util.Properties -->
	<property name="properties">
		<value>
			jdbc.driver.className=com.mysql.jdbc.Driver
			jdbc.url=jdbc:mysql://localhost:3306/mydb
		</value>
	</property>
</bean>
```

스프링 컨테이너는 JavaBeans `PropertyEditor` 메커니즘을 사용하여 `<value/>` 요소 내부의 텍스트를 `java.util.Properties` 인스턴스로 변환한다. 이것은 손쉬운 방법이며, 스프링 팀이 `value` 특성 스타일보다 중첩된 `<value/>` 요소의 사용을 선호하는 몇 가지 장소 중 하나이다.

## idref 요소

`idref` 요소는 컨테이너에 있는 다른 빈의 `id`(기준이 아닌 문자열 값)을 `<constructor-arg/>` 또는 `<property/>` 요소로 전달하는 오류 방지 방법이다. 다음은 사용 방법을 보여주는 예이다:

```xml
<bean id="theTargetBean" class="..."/>

<bean id="theClientBean" class="...">
	<property name="targetName">
		<idref bean="theTargetBean"/>
	</property>
</bean>
```

앞의 빈 정의 스니펫은 (런타임 시) 다음 스니펫과 정확히 동일하다:

```xml
<bean id="theTargetBean" class="..." />

<bean id="client" class="...">
	<property name="targetName" value="theTargetBean"/>
</bean>
```

`idref` 태그를 사용하면 컨테이너가 배포 시, 명명된 빈이 실제로 참조될 때 존재하는지 확인할 수 있기 때문에 첫 번째 양식이 두 번째 양식보다 좋다. 두 번째 양식에서는 `client` 빈의 `targetName` 특성에 전달된 값에 대해 유효성 검사가 수행되지 않는다. 오타는 `client` 빈이 실제로 인스턴스화될 때만 발견된다(가장 치명적인 결과가 있을 가능성이 높다). `client` 빈이 [프로토타입](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html) 빈인 경우, 이 오타와 그에 따른 예외는 컨테이너가 배치된 후 한참이 지나서야 발견될 수 있다.

> `idref` 요소의 `local` 특성은 더 이상 일반 `bean` 참조보다 높은 값을 제공하지 않기 때문에 4.0 Beans XSD에서 더 이상 지원되지 않는다. 4.0 스키마로 업그레이드할 때 기존 `idref local` 참조를 `idref bean`으로 변경한다.

`<idref/>` 요소가 값을 가져오는 일반적인 위치(최소 스프링 2.0 이전 버전)는 `ProxyFactoryBean` 빈 정의의 [AOP 인터셉터](https://docs.spring.io/spring-framework/reference/core/aop-api/pfb.html#aop-pfb-1) 구성에 있다. 인터셉트가 이름을 지정할 때 `<idref/>` 요소를 사용하면 인터셉트가 ID의 철자를 잘못 쓰는 것을 방지할 수 있다.

# 다른 빈(공동작업자)에 대한 참조

`ref` 요소는 `<constructor-arg/>` 또는 `<property/>` 정의 요소 내의 최종 요소이다. 여기서 지정된 빈 속성의 값을 컨테이너에서 관리하는 다른 빈(공동작업자)에 대한 참조로 설정한다. 참조된 빈은 속성을 설정할 빈의 의존성이며, 속성을 설정하기 전에 필요에 따라 초기화된다. (공동작업자가 싱글톤 빈인 경우 컨테이너에서 이미 초기화될 수 있다.) 모든 참조는 궁극적으로 다른 개체에 대한 참조이다. 범위 지정 및 유효성 검사는 `bean` 또는 `parent` 특성을 통해 다른 개체의 ID 또는 이름을 지정하는지 여부에 따라 달라진다.

`<ref/>` 태그의 `bean` 특성을 통해 대상 빈을 지정하는 것이 가장 일반적인 형식이며 동일한 XML 파일에 있는지 여부에 관계없이 동일한 컨테이너 또는 상위 컨테이너에 있는 빈에 대한 참조를 만들 수 있다. `bean` 특성의 값은 대상 빈의 `id` 특성과 동일하거나 대상 빈의 `name` 특성에 있는 값 중 하나와 동일할 수 있다. 다음은 `ref` 요소를 사용하는 예이다:

```xml
<ref bean="someBean"/>
```

`parent` 특성을 통해 대상 빈을 지정하면 현재 컨테이너의 상위 컨테이너에 있는 빈에 대한 참조가 생성된다. `parent` 특성의 값은 대상 빈의 `id` 특성 또는 대상 빈의 이름 특성에 있는 값 중 하나와 같을 수 있다. 대상 빈은 현재 빈의 상위 컨테이너에 있어야 한다. 이 빈 참조 변형은 주로 컨테이너 계층이 있고 부모 빈과 이름이 같은 프록시를 사용하여 기존 빈을 상위 컨테이너에 래핑하려는 경우에 사용해야 한다. 다음 목록 쌍은 `parent` 특성을 사용하는 방법을 보여준다:

```xml
<!-- in the parent context -->
<bean id="accountService" class="com.something.SimpleAccountService">
	<!-- insert dependencies as required here -->
</bean>
```

```xml
<!-- in the child (descendant) context -->
<bean id="accountService" <!-- bean name is the same as the parent bean -->
	class="org.springframework.aop.framework.ProxyFactoryBean">
	<property name="target">
		<ref parent="accountService"/> <!-- notice how we refer to the parent bean -->
	</property>
	<!-- insert other configuration and dependencies as required here -->
</bean>
```

> `ref` 요소의 `local` 특성은 더 이상 일반 `bean` 참조보다 높은 값을 제공하지 않기 때문에 4.0 Beans XSD에서 더 이상 지원되지 않는다. 4.0 스키마로 업그레이드할 때 기존 `ref local` 참조를 `ref bean`으로 변경한다.

# 내부 빈

`<property/>` 또는 `<constructor-arg/>` 요소 내부의 `<bean/>` 요소는 다음 예와 같이 내부 빈을 정의한다:

```xml
<bean id="outer" class="...">
	<!-- instead of using a reference to a target bean, simply define the target bean inline -->
	<property name="target">
		<bean class="com.example.Person"> <!-- this is the inner bean -->
			<property name="name" value="Fiona Apple"/>
			<property name="age" value="25"/>
		</bean>
	</property>
</bean>
```

내부 빈 정의에는 정의된 ID 또는 이름이 필요하지 않다. 지정할 경우 컨테이너는 이러한 값을 식별자로 사용하지 않는다. 내부 빈은 항상 익명이고 항상 외부 빈과 함께 만들어지기 때문에 컨테이너는 생성 시 `scope` 플래도 무시한다. 내부 빈에 개별적으로 접근하거나, 내부 빈을 둘러싸는 빈이 아닌 다른 공동 빈에 주입하는 것은 불가능하다.

예를 들어 싱글톤 빈에 포함된 요청 스코프의 내부 빈과 같은 사용자 정의 스코프에서 파괴 콜백을 수신할 수 있다. 내부 빈 인스턴스의 작성은 빈을 포함하는 인스턴스와 연결되지만 파기 콜백을 통해 요청 스코프의 수명 주기에 참여할 수 있다. 이것은 일반적인 시나리오가 아니다. 안에 있는 빈은 일반적으로 단순히 빈을 포함하는 스코프를 공유한다.

# 컬렉션

`<list/>`, `<set/>`, `<map/>`, 그리고 `<props/>` 요소는 Java `Collection` 유형 `List`, `Set`, `Map`, 그리고 `Properties`의 속성과 인수를 각각 설정한다. 다음은 사용 방법을 보여주는 예이다:

```xml
<bean id="moreComplexObject" class="example.ComplexObject">
	<!-- results in a setAdminEmails(java.util.Properties) call -->
	<property name="adminEmails">
		<props>
			<prop key="administrator">administrator@example.org</prop>
			<prop key="support">support@example.org</prop>
			<prop key="development">development@example.org</prop>
		</props>
	</property>
	<!-- results in a setSomeList(java.util.List) call -->
	<property name="someList">
		<list>
			<value>a list element followed by a reference</value>
			<ref bean="myDataSource" />
		</list>
	</property>
	<!-- results in a setSomeMap(java.util.Map) call -->
	<property name="someMap">
		<map>
			<entry key="an entry" value="just some string"/>
			<entry key="a ref" value-ref="myDataSource"/>
		</map>
	</property>
	<!-- results in a setSomeSet(java.util.Set) call -->
	<property name="someSet">
		<set>
			<value>just some string</value>
			<ref bean="myDataSource" />
		</set>
	</property>
</bean>
```

map 키 또는 값 또는 set 값은 다음 요소 중 하나일 수도 있다:

```
bean | ref | idref | list | set | map | props | value | null
```

## 컬렉션 병합

스프링 컨테이너는 컬렉션 병합도 지원한다. 응용 프로그램 개발자는 상위 `<list/>`, `<map/>`, `<set/>` 또는 `<props/>` 요소를 정의하고 하위 `<list/>`, `<map/>`, `<set/>` 또는 `<props/>` 요소가 상위 컬렉션의 값을 상속하고 재정의하도록 할 수 있다. 즉, 자식 컬렉션의 값은 부모 컬렉션에 지정된 값을 재정의하는 자식 컬렉션 요소와 부모 및 자식 컬렉션의 요소를 병합한 결과이다.

이 섹션에서는 부모-자식 빈 메커니즘에 대해 설명한다. 상위 및 하위 빈 정의에 익숙하지 않은 독자는 계속하기 전에 [관련 섹션](https://docs.spring.io/spring-framework/reference/core/beans/child-bean-definitions.html)을 읽자.

다음 예제에서는 컬렉션 병합을 보여 준다:

```xml
<beans>
	<bean id="parent" abstract="true" class="example.ComplexObject">
		<property name="adminEmails">
			<props>
				<prop key="administrator">administrator@example.com</prop>
				<prop key="support">support@example.com</prop>
			</props>
		</property>
	</bean>
	<bean id="child" parent="parent">
		<property name="adminEmails">
			<!-- the merge is specified on the child collection definition -->
			<props merge="true">
				<prop key="sales">sales@example.com</prop>
				<prop key="support">support@example.co.uk</prop>
			</props>
		</property>
	</bean>
<beans>
```

`child` 빈 정의의 `adminEmails` 속성의 `<props/>` 요소에 `merge=true` 속성을 사용한다. `child` 빈이 확인되고 컨테이너에 의해 인스턴스화되면 결과 인스턴스에는 자식 `adminEmails` 컬렉션과 부모 `adminEmails` 컬렉션을 병합한 결과가 포함된 `adminEmails Properties` 컬렉션이 있다. 다음 목록은 결과를 보여준다:

```text
administrator=administrator@example.com
sales=sales@example.com
support=support@example.co.uk
```

하위 `Properties` 컬렉션의 값 집합은 상위 `<props/>`의 모든 속성 요소를 상속하며, `support` 값에 대한 하위 값은 상위 컬렉션의 값을 재정의한다.

이 병합 동작은 `<list/>`, `<map/>`, 그리고 `<set/>` 컬렉션 유형에도 유사하게 적용된다. `<list/>` 요소의 특정한 경우, `List` 컬렉션 유형(즉, `ordered` 값 컬렉션의 개념)과 관련된 의미론이 유지된다. 부모 값은 자식 목록의 모든 값보다 우선한다. `Map`, `Set`, 그리고 `Properties` 컬렉션 유형의 경우 순서가 없다. 따라서 컨테이너가 내부적으로 사용하는 관련 `Map`, `Set`, 그리고 `Properties` 구현 유형의 기초가 되는 컬렉션 유형에는 순서 지정 의미가 적용되지 않는다.

## 컬렉션 병합에 대한 제한 사항

서로 다른 컬렉션 유형(예: `Map` 및 `List`)은 병합할 수 없다. 이렇게 하면 적절한 `Exception`이 던져진다. `merge` 특성은 상속된 하위 자식 정의에 지정해야 한다. 상위 컬렉션 정의에 `merge` 특성을 지정하면 중복되므로 원하는 병합이 발생하지 않는다.

## 강력한 유형의 컬렉션

일반 유형에 대한 Java의 지원 덕분에 강력한 형식의 컬렉션을 사용할 수 있다. 즉, (예를 들어) `String` 요소만 포함할 수 있도록 `Collection` 유형을 선언할 수 있다. 스프링을 사용하여 강하게 결합된 `Collection`를 빈에 종속시키는 경우, 강하게 결합된 `Collection` 인스턴스의 요소가 `Collection`에 추가되기 전에 적절한 유형으로 변환되도록 스프링의 유형 변환 지원 기능을 활용할 수 있다. 다음 Java 클래스 및 빈 정의는 이를 수행하는 방법을 보여준다:

```java
public class SomeClass {

	private Map<String, Float> accounts;

	public void setAccounts(Map<String, Float> accounts) {
		this.accounts = accounts;
	}
}
```

```xml
<beans>
	<bean id="something" class="x.y.SomeClass">
		<property name="accounts">
			<map>
				<entry key="one" value="9.99"/>
				<entry key="two" value="2.75"/>
				<entry key="six" value="3.99"/>
			</map>
		</property>
	</bean>
</beans>
```

`something` 빈의 `accounts` 특성이 주입을 위해 준비되면 강한 결합을 가진 `Map<String, Float>`의 원소 유형에 대한 일반 정보를 반사를 통해 사용할 수 있다. 따라서 스프링의 유형 변환 인프라는 다양한 값 요소를 유형 `Float`의 것으로 인식하고 문자열 값(`9.99`, `2.75`, 그리고 `3.99`)을 실제 `Float` 유형으로 변환한다.

# null 및 빈 문자열 값

스프링은 속성 등에 대한 빈 인수를 빈 `Strings`로 처리한다. 다음 XML 기반 구성 메타데이터 스니펫은 `email` 속성을 빈 `String` 값("")으로 설정한다.

```xml
<bean class="ExampleBean">
	<property name="email" value=""/>
</bean>
```

위의 예는 다음 Java 코드와 동일하다:

```java
exampleBean.setEmail("");
```

`<null/>` 요소는 `null` 값을 처리한다. 다음 목록은 예를 보여준다:

```xml
<bean class="ExampleBean">
	<property name="email">
		<null/>
	</property>
</bean>
```

이전 구성은 다음 Java 코드와 동일하다:

```java
exampleBean.setEmail(null);
```

# p-namespace를 사용한 XML 방법

`p-namespace`를 사용하면 `bean` 요소의 속성(내포된 `<property/>` 요소의 속성)을 사용하여 상호협력하는 빈 또는 둘 다를 설명할 수 있다.

스프링은 XML 스키마 정의를 기반으로 하는 [네임스페이스](https://docs.spring.io/spring-framework/reference/core/appendix/xsd-schemas.html)로 확장 가능한 구성 형식을 지원한다. 이 장에서 설명하는 `beans` 구성 형식은 XML 스키마 문서에 정의되어 있다. 그러나 `p-namespace`는 XSD 파일에 정의되지 않으며 스프링의 코어에만 존재한다.

다음 예제에서는 동일한 결과로 확인되는 두 개의 XML 스니펫(첫 번째는 표준 XML 형식을 사용하고 두 번째는 `p-namespace`를 사용함)을 보여 준다:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:p="http://www.springframework.org/schema/p"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean name="classic" class="com.example.ExampleBean">
		<property name="email" value="someone@somewhere.com"/>
	</bean>

	<bean name="p-namespace" class="com.example.ExampleBean"
		p:email="someone@somewhere.com"/>
</beans>
```

예제에서는 빈 정의의 `email`이라는 `p-namespace`의 속성을 보여 준다. 이것은 스프링에게 재산 신고를 포함하라고 말한다. 앞에서 설명한 것처럼 `p-namespace`에는 스키마 정의가 없으므로 속성 이름으로 속성 이름을 설정할 수 있다.

이 다음 예제에는 두 가지 빈 정의가 더 포함되어 있다. 둘 다 다른 빈에 대한 참조를 가지고 있다:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:p="http://www.springframework.org/schema/p"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean name="john-classic" class="com.example.Person">
		<property name="name" value="John Doe"/>
		<property name="spouse" ref="jane"/>
	</bean>

	<bean name="john-modern"
		class="com.example.Person"
		p:name="John Doe"
		p:spouse-ref="jane"/>

	<bean name="jane" class="com.example.Person">
		<property name="name" value="Jane Doe"/>
	</bean>
</beans>
```

이 예에는 `p-namespace`를 사용하는 속성 값뿐만 아니라 속성 참조를 선언하는 특수 형식도 포함된다. 첫 번째 빈 정의가 빈 `john`에서 빈 `jane`으로의 참조를 만들기 위해 `<property name="spouse" ref="jane"/>`를 사용하는 반면, 두 번째 빈 정의는 정확히 같은 일을 하기 위해 `p:spouse-ref="jane"`을 속성으로 사용한다. 이 경우 `spouse`는 속성 이름이지만 `-ref` 부분은 이것이 직선 값이 아니라 오히려 다른 빈을 가리키는 것임을 나타낸다.

> `p-namespace`는 표준 XML 형식만큼 유연하지 않다. 예를 들어 속성 참조를 선언하는 형식은 `Ref`로 끝나는 속성과 충돌하지만 표준 XML 형식은 충돌하지 않는다. 세 가지 접근 방식을 모두 동시에 사용하는 XML 문서를 생성하지 않으려면 접근 방식을 신중하게 선택하고 팀원들에게 전달하는 것이 좋다.

# c-namespace를 사용한 XML 방법

`p-namespace`가 있는 XML 바로 가기와 유사하게, 스프링 3.1에 도입된 `c-namespace`는 중첩된 `constructor-arg` 요소가 아닌 생성자 인수를 구성하기 위한 인라인 특성을 허용한다.

다음 예제에서는 `c:` 네임스페이스를 사용하여 [생성자 기반 의존성 주입](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-constructor-injection)의 와 동일한 작업을 수행한다:

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:c="http://www.springframework.org/schema/c"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="beanTwo" class="x.y.ThingTwo"/>
	<bean id="beanThree" class="x.y.ThingThree"/>

	<!-- traditional declaration with optional argument names -->
	<bean id="beanOne" class="x.y.ThingOne">
		<constructor-arg name="thingTwo" ref="beanTwo"/>
		<constructor-arg name="thingThree" ref="beanThree"/>
		<constructor-arg name="email" value="something@somewhere.com"/>
	</bean>

	<!-- c-namespace declaration with argument names -->
	<bean id="beanOne" class="x.y.ThingOne" c:thingTwo-ref="beanTwo"
		c:thingThree-ref="beanThree" c:email="something@somewhere.com"/>

</beans>
```

`c:` 네임스페이스는 이름으로 생성자 인수를 설정하는 데 `p:` 네임스페이스(빈 참조의 뒤에 오는 `-ref`)와 동일한 규칙을 사용한다. 마찬가지로 XSD 스키마에 정의되지 않은 경우에도 XML 파일에 선언해야 한다(스프링 코어 내부에 존재함).

생성자 인수 이름을 사용할 수 없는 드문 경우(일반적으로 디버깅 정보 없이 바이트 코드가 컴파일된 경우)에는 다음과 같이 인수 인덱스에 대한 폴백을 사용할 수 있다:

```xml
<!-- c-namespace index declaration -->
<bean id="beanOne" class="x.y.ThingOne" c:_0-ref="beanTwo" c:_1-ref="beanThree"
	c:_2="something@somewhere.com"/>
```

> XML 문법 때문에 XML 특성 이름은 숫자로 시작할 수 없으므로 인덱스 표기법에는 선행 `_`가 있어야 한다(일부 IDE에서 허용하더라도). 해당 인덱스 표기법은 `<constructor-arg>` 요소에 대해서도 사용할 수 있지만 일반적으로 선언 순서가 충분하기 때문에 일반적으로 사용되지 않는다.

실제로 생성자 확인 [메커니즘](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-factory-ctor-arguments-resolution)은 인수를 일치시키는 데 매우 효율적이므로, 꼭 필요한 경우를 제외하고는 구성 전반에 걸쳐 이름 표기법을 사용하는 것이 좋다.

# 복합 특성 이름

빈 특성을 설정할 때 최종 특성 이름을 제외한 경로의 모든 구성 요소가 `null`이 아닌 한 복합 또는 중첩 특성 이름을 사용할 수 있다. 다음 정의를 고려한다:

```xml
<bean id="something" class="things.ThingOne">
	<property name="fred.bob.sammy" value="123" />
</bean>
```

`something` 빈에는 `fred` 속성이 있고 `sammy` 속성은 `bob` 속성이 있으며 최종 `123` 속성은 `sammy` 값으로 설정된다. 이것이 작동하기 위해서는 `something`의 `fred` 속성과 `fred`의 `bob` 속성이 빈이 만들어진 후에 `null`이되어서는 안 된다. 그렇지 않으면 `NullPointerException`가 던져진다.