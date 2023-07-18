# @GeneratedValue [#](https://jakarta.ee/specifications/persistence/2.2/apidocs/javax/persistence/generatedvalue)

`기본 키 값에 대한 생성 전략을 지정`하는 어노테이션으로 엔티티 또는 매핑된 수퍼 클래스의 기본 키 속성 또는 필드에 적용할 수 있다. `@GeneratedValue`는 파생되지 않은 `단순 기본 키에 대해서만 지원`되어야 한다.

기본 키 값을 직접 할당하는 경우 `@Id`만을 사용하지만, 데이터베이스에서 자동으로 할당하는 경우 해당 어노테이션을 사용한다.

import 문과 구현 형태는 다음과 같다.

```java
import jakarta.persistence.GeneratedValue;

@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface GeneratedValue {}
```

## 옵션 설정

사용하는 DB에 따라 기본 키를 어떻게 생성할 지 방법을 지정할 수 있다. 예를 들면, 기본 키를 위한 테이블을 따로 생성하여 관리할 수 있고, Oracle, PostgreSQL 등의 경우 시퀀스 오브젝트를 이용해 이를 처리할 수도 있다. `@GeneratedValue`의 옵션은 이런 다양한 방법 중 어떤 방법을 사용할 지를 나타낸다.

- `generator` : 사용할 기본키 generator를 지정, default는 `""`로 `영속성 provider`가 제공하는 generator 사용
- `strategy` : `영속성 provider`가 사용해야 하는 `기본 키 생성 전략을 지정`, default는 `AUTO`

더 자세한 내용은 [@SequenceGenerator](), [@TableGenerator](), [strategy]()를 참고하자.

## 필드 선언

기본 키 생성 전략을 의미하기 때문에 `@Id`와 같이 적용하여 사용한다.

```java
import jakarta.persistence.*;

@Entity
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.AUTO, generator = "")
    private Integer id;
}
```

## 메서드 선언

`@GeneratedValue`의 대상은 메서드도 포함된다. 다음과 같이 `@Id`가 적용된 메서드에 같이 사용한다.

```java
import jakarta.persistence.*;

@Entity
@Setter //lombok 사용
public class Member {

    private Integer id;
    
    @Id @GeneratedValue(strategy = GenerationType.AUTO, generator = "")
    public Integer getId() {
        return id;
    }

    //직접 구현
    public void setId(Integer id) {
        this.id = id;
    }
}
```

## 생성 결과

위 두 경우 모두 생성 전략은 `AUTO`이다. 테스트 환경은 `Spring`, `MySQL`로 `test_seq` 테이블이 생성되는 것을 확인할 수 있다.

```
만약 생성되지 않는 경우 application.properties or application.yml에 ddl-auto: create 설정을 추가하자.
```

필드 선언, 메서드 선언에 상관없이 `@Id`없이 `@GeneratedValue`만 독립적으로 선언할 순 있다. 하지만 DB에는 등록되지 않기 때문에 아무런 의미가 없어진다.