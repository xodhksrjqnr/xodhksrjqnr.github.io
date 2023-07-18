# @TableGenerator [#](https://jakarta.ee/specifications/persistence/3.0/apidocs/jakarta.persistence/jakarta/persistence/tablegenerator)

`@GeneratedValue`에 대해 generator를 지정할 때 이름으로 참조 가능한 generator를 정의한다. 엔티티 클래스 또는 기본 키 필드나 속성에 지정할 수 있다. generator 이름의 스코프는 영속성 단위(모든 generator 유형)에 대해 전역적이다.

import 문과 구현 형태는 다음과 같다.

```java
@Repeatable(TableGenerators.class)
@Target({TYPE,METHOD,FIELD})
@Retention(RUNTIME)
public @interface TableGenerator {}
```

## 옵션 설정

`@TableGenerator`의 옵션은 다음과 같다.

- `name` : 하나 이상의 클래스에서 참조하여 id 값의 genrator가 될 수 있는 고유한 이름 (필수)
- `allocationSize` : id 번호를 할당할 때 증가시킬 사이즈, default는 50
- `catalog` : 테이블의 카탈로그 이름, default는 ""
- `initialValue` : 마지막으로 생성된 값을 저장하는 열을 초기화하는 데 사용할 초기 값, default는 0
- `schema` : 테이블의 스키마 이름, default는 ""
- `indexs` : 테이블의 인덱스들, default는 {}
- `pkColumnName` : 해당 기본키를 소유한 테이블을 표시하는 컬럼 이름, default는 ""
- `pkColumnValue` : 해당 기본키를 소유한 테이블 이름, default는 ""
- `table` : 생성된 id 값을 저장하고 있는 테이블 이름, default는 ""
- `uniqueConstraints` : 테이블에 적용할 고유 제약 조건, default는 {}
- `valueColumnName` : 마지막으로 생성된 값을 저장하는 열의 이름, default는 ""

> ### allocationSize는 왜 기본값이 50일까?(수정 필요)
> `DB 접근 횟수를 줄여 성능을 개선`하기 위함이다. 테이블 전략은 총 3번의 DB 접근 (`마지막으로 업데이트된 기본키 조회`와 `마지막으로 업데이트된 기본키 수정`, `데이터 저장`)이 이루어진다. 즉, 데이터 저장 시 기본 키 처리를 위해 2번씩 DB 접근이 발생한다. 이를 개선하기 위해 정한 size만큼 미리 DB에서 생성 후 메모리에 할당한 뒤 id 조회를 메모리 접근으로 변경함으로써 DB 접근 횟수를 줄일 수 있다. 여기서 언급한 `정한 size`가 `allocationSize`를 의미한다. (추가적으로 시퀀스를 미리 선점하기 때문에 여러 JVM에서 동시에 접근에도 기본키 값의 유일성을 보장한다.)
>
> 무턱대고 `allocationSize`를 높게 잡는다고 좋은 것은 아니다. 메모리에 시퀀스를 할당한 상태이기 때문에 사용되지 않는 시퀀스가 많을수록 메모리 누수가 발생하게 된다. 따라서 상황에 따라 적절한 값을 설정해주어야 한다. 예를 들며, 데이터 저장이 드문 경우 allocationSize를 낮게 잡는 것이 유리할 수 있다.

## 클래스 선언

```java
import jakarta.persistence.*;

@Entity
@TableGenerator(name = "tmp_seq", allocationSize = 10)
public class Member {

    @Id
    @GeneratedValue(generator = "tmp_seq")
    private Integer id;
}
```

## 필드 선언

```java
import jakarta.persistence.*;

@Entity
public class Member {

    @Id
    @GeneratedValue(generator = "tmp_seq")
    @TableGenerator(name = "tmp_seq", allocationSize = 10)
    private Integer id;
}
```

## 메서드 선언

```java
import jakarta.persistence.*;

@Entity
@Setter //lombok
public class Member {

    private Integer id;

    @Id
    @GeneratedValue(generator = "tmp_seq")
    @TableGenerator(name = "tmp_seq", allocationSize = 10)
    public Integer getId() {
        return id;
    }
    
    //직접 구현
    public void setId(Integer id) {
        this.id = id;
    }
}
```

메서드 선언 시 주의할 점이 있다. 선언한 필드의 타입과 메서드의 반환 타입이 다른 경우이다. 자세한 예시는 다음과 같다.

```java
import jakarta.persistence.*;

@Entity
@Setter
public class Member {
    
    private Integer id;

    @Id
    @GeneratedValue(generator = "tmp_seq")
    @TableGenerator(name = "tmp_seq", allocationSize = 10)
    public int getId() {
        return id;
    }
}
```

선언한 필드의 타입이 래퍼 클래스이며 반환 타입은 기본 타입이다. 래퍼 클래스의 경우 null인 경우 위험성이 발생할 수 있기 때문에 다음 에러가 발생한다.

```
IllegalStateException: Failed to load ApplicationContext
```

## @GeneratedValue의 옵션을 설정하지 않는 경우 우선순위는?

위의 예제들은 @GeneratedValue의 generator를 설정한 경우였다. 그렇다면 generator를 설정하지 않는다면 결과는 어떻게 될까? 결과는 클래스, 필드, 프로퍼티 위치 상관없이 @GeneratedValue의 우선순위가 높다. 간단한 테스트를 작성하고 실행하면 `@TableGenerator`의 옵션이 반영되지 않은 것을 확인할 수 있다.

```java
import jakarta.persistence.*;

@Entity
@TableGenerator(name = "tmp_seq", allocationSize = 10, initialValue = 2)
public class Member {

    @Id
    @GeneratedValue
    private Integer id;
}
```

# 참고자료

- [[JPA] 기본키 매핑 @GeneratedValue의 사용법과 종류](https://choiseonjae.github.io/jpa/jpa-%EA%B8%B0%EB%B3%B8%ED%82%A4%EC%A0%84/)