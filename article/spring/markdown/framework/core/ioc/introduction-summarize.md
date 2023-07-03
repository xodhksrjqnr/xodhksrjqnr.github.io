# 스프링 IoC 컨테이너 및 빈 소개

이 파트에선 `제어 반전(IoC:Inversion of Control)`과 `빈(Bean)`에 대해 자세히 알아볼 것이다. 우선 해당 용어에 대한 개념을 간략히 정리해보자. 

<br>

## IoC (제어 반전)

`IoC`는 `의존성 주입(DI:Dependency Injection)`이라고도 하며, 수정적으로 의존성을 정의하는 프로세스이다. 이렇게 정의된 의존성은 컨테이너가 빈을 생성할 때 주입한다. 이 프로세스는 기본적으로 서비스 로케이터 패턴과 같은 메커니즘 또는 클래스의 직접 구성을 사용하여 의존성의 인스턴스화 또는 위치를 제어하는 빈 자체의 역전(즉, `제어의 역전`)이다.

<img width="919" alt="스크린샷 2023-06-27 오후 7 01 48" src="https://github.com/xodhksrjqnr/toyProject-Smart/assets/48250370/57708dc9-80a1-4877-8e23-81603a8943b5">

`org.springframework.beans` 및 `org.springframework.context` 패키지는 스프링 프레임워크의 IoC 컨테이너의 기본이다. `BeanFactory`는 구성 프레임워크와 기본 기능을 제공하고, `ApplicationContext`는 `BeanFactory`를 상속받고 더 많은 엔터프라이즈 별 기능을 추가한 형태이다. 추가되는 기능 목록은 다음과 같다.:

- 스프링의 AOP 기능과의 손쉬운 통합
- 메시지 리소스 처리(국제화에 사용)
- 이벤트 게시
- 웹 응용 프로그램에서 사용하기 위한 WebApplicationContext와 같은 응용 프로그램 계층별 컨텍스트

`BeanFactory`에 대한 더 자세한 내용은 [여기](https://docs.spring.io/spring-framework/reference/core/beans/beanfactory.html)를 참조하자.

<br>

## Bean

스프링 IoC 컨테이너에 의해 관리(`인스턴스화`, `조립` 등)되는 객체를 `빈`이라고 한다. 빈과 빈 사이의 의존성은 컨테이너에서 사용하는 구성 메타데이터에 반영된다.