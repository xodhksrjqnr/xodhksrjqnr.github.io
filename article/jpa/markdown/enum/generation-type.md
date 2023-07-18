# GenerationType [#](https://jakarta.ee/specifications/persistence/2.2/apidocs/javax/persistence/generationtype)

`기본 키 생성 전략의 유형을 정의`하며 종류는 5가지가 있다.

- `AUTO` : 영속성 provider가 특정 DB에 적합한 전략을 선택
- `IDENTITY` : 영속성 provider가 DB identity 열을 사용하여 엔티티의 기본 키를 할당 (DB에 위임)
- `SEQUENCE` : 영속성 provider가 DB 시퀀스를 사용하여 엔티티의 기본 키를 할당
- `TABLE` : 고유성을 보장하기 위해 영속성 provider가 기본 DB 테이블을 사용하는 엔티티의 기본 키를 할당
- `UUID` : 영속성 provider가 RFC 4122 Universally Unique IDentifier를 생성하여 엔티티의 기본 키를 할당