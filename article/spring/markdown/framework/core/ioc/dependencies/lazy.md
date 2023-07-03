# 지연 초기화된 빈 [#](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-lazy-init.html)

기본적으로 `ApplicationContext` 구현은 초기화 프로세스의 일부로 모든 [싱글톤](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton) 빈을 열심히 만들고 구성한다. 일반적으로 몇 시간 또는 며칠이 지난 후가 아니라 구성 또는 주변 환경의 오류가 즉시 발견되기 때문에 이러한 사전 인스턴스화가 바람직하다. 이 동작이 바람직하지 않은 경우 빈 정의를 지연 초기화로 표시하여 싱글톤 빈의 사전 인스턴스화를 방지할 수 있다. 지연 초기화된 빈은 시작할 때가 아니라 처음 요청될 때 빈 인스턴스를 만들라고 IoC 컨테이너에 말한다.

XML에서 이 동작은 다음 예제에서 볼 수 있듯이 `<bean/>` 요소의 `lazy-init` 특성에 의해 제어된다:

```xml
<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>
```

이전 구성이 `ApplicationContext`에 의해 사용될 때 `lazy` 빈은 `ApplicationContext`이 시작될 때 열심히 사전 조사되지 않는 반면, `not.lazy` 빈은 열심히 사전 조사된다.

그러나 지연 초기화된 빈이 지연 초기화되지 않은 싱글톤 빈의 의존성일 때, `ApplicationContext`는 시작할 때 지연 초기화된 빈을 만든다. 왜냐하면 싱글톤의 의존성을 만족시켜야 하기 때문이다. 지연 초기화된 빈은 지연 초기화되지 않은 다른 곳에서 싱글톤 빈에 주입된다.

또한 다음 예와 같이 `<beans/>` 요소의 `default-lazy-init` 특성을 사용하여 컨테이너 수준에서 지연 초기화를 제어할 수 있다:

```xml
<beans default-lazy-init="true">
	<!-- no beans will be pre-instantiated... -->
</beans>
```