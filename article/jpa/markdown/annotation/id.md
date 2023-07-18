# @Id [#](https://jakarta.ee/specifications/persistence/2.2/apidocs/javax/persistence/id)

`엔티티의 기본 키를 지정`하는 어노테이션으로 매핑된 필드는 테이블의 기본 키로 간주된다. `@Column`을 따로 설정하지 않은 경우 필드명을 기본 키 이름으로 사용한다. `@Id`는 다음과 같은 타입에 적용할 수 있다.

- Java 기본 타입 (`int`, `boolean`, `char`, ...)
- Java 래퍼 타입 (`Integer`, `Boolean`, `Charater`, ...)
- 그외 타입 (`String`, `java.util.Date`, `java.sql.Date`, `BigInteger`, `BigDecimal`)

import 문과 구현 형태는 다음과 같다.

```java
import jakarta.persistence.Id;

@Target({METHOD,FIELD})
@Retention(RUNTIME)
public @interface Id {}
```

## 필드 선언

해당 어노테이션을 어떻게 사용하는 지 알아보자(Spring을 사용한 테스트). 다음 예시는 위에서 언급한 `@Id`를 적용할 수 있는 타입들이다.

```java
import jakarta.persistence.*;

@Entity
public class Member {
    @Id private byte id1;
    @Id private short id2;
    @Id private int id3;
    @Id private long id4;
    @Id private float id5;
    @Id private double id6;
    @Id private char id7;
    @Id private boolean id8;
    @Id private Byte id11;
    @Id private Short id12;
    @Id private Integer id13;
    @Id private Long id14;
    @Id private Float id15;
    @Id private Double id16;
    @Id private Character id17;
    @Id private Boolean id18;
    @Id private String id19;
    @Id private java.util.Date id20;
    @Id private java.sql.Date id21;
    @Id private BigInteger id22;
    @Id private BigDecimal id23;
}
```

사용하는 방법 자체는 매우 단순하다. 그렇다면 `기본 키가 여러 개인 경우`를 생각해보자. 기본 키를 여러 개 설정하려면 위의 예제와 같이 기본 키로 사용할 필드에 `@Id`를 적용해주면 된다. 하지만 주의할 점이 있다. 위의 예제를 그대로 실행하면 우리는 다음과 같은 에러를 마주하게 된다.

```
Too many key parts specified; max 16 parts allowed
```

기본 키의 설정은 최대 16개까지 가능하며 현재 상태는 16개를 초과한 상태기 때문에 에러가 발생한 것이다. `@Id`를 16개 이하로 적용하여 실행하면 정상적으로 테이블이 생성되는 것을 확인할 수 있다.

```
현재 테스트 환경이 Spring과 MySQL을 이용하기 때문에 DB에 따라 차이가 있을 수 있다.
```

자세한 확인을 위해 실제로 `MySQL`에서 테이블 생성 시 기본 키의 개수를 16개 이상으로 설정하게 되면 같은 에러가 발생하는 것을 확인할 수 있다.

```mysql
create table member (
    id1 int, id2 int, id3 int, id4 int, id5 int, id6 int, id7 int, id8 int,
    id9 int, id10 int, id11 int, id12 int, id13 int, id14 int, id15 int,
    id16 int, id17 int,
    primary key(id1, id2, id3, id4, id5, id6, id7, id8, id9, id10, id11, id12, id13, id14, id15, id16, id17)
 );
```

## 메서드 선언

`@Id`의 형태에서 `@Target`을 보면 메서드에도 적용이 가능한 것을 알 수 있다. 다음은 메서드에 적용한 예제이다.

```java
import jakarta.persistence.*;

@Entity
public class Member {

    private int id;

    @Id
    public int getId() { // 경고 발생!!
        return id;
    }
}
```

이 경우 `getId()` 메서드에 프로퍼티 기반 액세스에는 `setter`와 `getter`가 필요하다는 경고가 발생한다. 지금은 단순한 테스트이기 때문에 클래스에 `setter` 메서드만 추가하여 경고를 해결하자.

```java
import jakarta.persistence.*;

@Entity
@Setter //lombok 사용하는 경우
public class Member {

    private int id;

    @Id
    public int getId() { // 경고 발생!!
        return id;
    }

    //직접 setter 구현
    public void setId(int id) {
        this.id = id;
    }
}
```

이후 실행해보면 테이블이 정상적으로 생성된 것을 확인할 수 있다.