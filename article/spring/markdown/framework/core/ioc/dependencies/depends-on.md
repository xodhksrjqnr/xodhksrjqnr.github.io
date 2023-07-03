# depends-on 사용 [#](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-dependson.html)

만약 빈이 다른 빈의 의존성이라면, 그것은 보통 한 빈이 다른 빈의 속성으로 설정된다는 것을 의미한다. 일반적으로 XML 기반 구성 메타데이터의 `<ref/>` 요소를 사용하여 이 작업을 수행한다. 하지만, 때때로 빈들 사이의 의존성은 덜 직접적이다. 데이터베이스 드라이버 등록과 같이 클래스의 정적 이니셜라이저를 트리거해야 하는 경우를 예로 들 수 있다. `depends-on` 속성은 이 요소를 사용하는 빈이 초기화되기 전에 하나 이상의 빈이 초기화되도록 명시적으로 강제할 수 있다. 다음 예제에서는 `depends-on` 특성을 사용하여 단일 빈에 대한 의존성을 나타낸다:

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager"/>
<bean id="manager" class="ManagerBean" />
```

여러 빈에 대한 의존성을 나타내려면 빈 이름 목록을 `depends-on` 속성 값으로 제공한다(숫자, 공백 및 세미콜론은 유효한 구분 기호이다):

```xml
<bean id="beanOne" class="ExampleBean" depends-on="manager,accountDao">
	<property name="manager" ref="manager" />
</bean>

<bean id="manager" class="ManagerBean" />
<bean id="accountDao" class="x.y.jdbc.JdbcAccountDao" />
```

> `depends-on` 특성은 초기화 시간 의존성과 [싱글톤](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton) 빈의 경우 해당 파괴 시간 의존성을 모두 지정할 수 있다. 주어진 빈과의 `depends-on` 관계를 정의하는 의존 빈은 주어진 빈 자체가 파괴되기 전에 먼저 파괴된다. 따라서 `depends-on`은 종료 순서도 제어할 수 있다.