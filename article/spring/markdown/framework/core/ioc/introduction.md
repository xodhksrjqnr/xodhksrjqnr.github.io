# 스프링 IoC 컨테이너 및 빈 소개 [#](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html)

이 장에서는 스프링 프레임워크의 구현인 제어 반전(IoC:Inversion of Control)의 원리에 대해 설명한다.
IoC는 의존성 주입(DI:Dependency Injection)이라고도 하며, 생성자 인자, 팩토리 메서드에 대한 인자
또는 팩토리 메서드에서 생성되거나 반환된 개체 인스턴스에 설정된 속성에 의해서 의존성을 정의하는 프로세스이다.
이렇게 정의된 의존성은 컨테이너가 빈을 생성할 때 주입한다. 이 프로세스는 기본적으로 서비스 로케이터 패턴과
같은 메커니즘 또는 클래스의 직접 구성을 사용하여 종속성의 인스턴스화 또는 위치를 제어하는 빈 자체의 역전(즉,
제어의 역전)이다.

<img width="919" alt="스크린샷 2023-06-27 오후 7 01 48" src="https://github.com/xodhksrjqnr/toyProject-Smart/assets/48250370/57708dc9-80a1-4877-8e23-81603a8943b5">

`org.springframework.beans` 및 `org.springframework.context` 패키지는 스프링 프레임워크의
IoC 컨테이너의 기본이다. `BeanFactory` 인터페이스는 모든 유형의 개체를 관리할 수 있는 고급 구성
메커니즘을 제공한다. `ApplicationContext`는 `BeanFactory`의 하위 인터페이스이며 다음이 추가된다.:

- 스프링의 AOP 기능과의 손쉬운 통합
- 메시지 리소스 처리(국제화에 사용)
- 이벤트 게시
- 웹 응용 프로그램에서 사용하기 위한 `WebApplicationContext`와 같은 응용 프로그램 계층별 컨텍스트

간단히 말해, `BeanFactory`는 구성 프레임워크와 기본 기능을 제공하며, `ApplicationContext`는 더
많은 엔터프라이즈별 기능을 추가한다. `ApplicationContext`는 `BeanFactory`의 완전한 상위 집합이며,
이 장에서는 스프링의 IoC 컨테이너에 대한 설명으로만 사용된다. `ApplicationContext` 대신
`BeanFactory`를 사용하는 방법에 대한 자세한 내용은 `BeanFactory` [API](https://docs.spring.io/spring-framework/reference/core/beans/beanfactory.html)에
대한 섹션을 참조하자.

스프링에는 애플리케이션의 중추를 형성하고 스프링 IoC 컨테이너에 의해 관리되는 객체를 빈이라고 한다. 빈은
스프링 IoC 컨테이너에 의해 인스턴스화, 조립 및 관리되는 객체이다. 그렇지 않으면 빈은 응용 프로그램의 많은
개체 중 하나일 뿐이다. 빈과 빈 사이의 종속성은 컨테이너에서 사용하는 구성 메타데이터에 반영된다.