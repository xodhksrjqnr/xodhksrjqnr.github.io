# Mysql 외부 접근 설정

Mysql을 외부 IP에서 접근하기 위해선 몇 가지 설정이 필요하다. 해당 파트에선 이 설정
방법에 대해 알아보자.

## 관리자 생성

Mysql 설치 후 기본적으로 생성되어 있는 관리자들의 호스트 정보는 localhost이다. 따라서 해당 호스트에서만
접근이 가능하다. `update` 명령어를 사용해 설정을 변경할 수 있겠지만 보안에 있어 문제가 발생할 수 있기
때문에 새로운 관리자를 생성한다.

```
$ mysql -u root -p
Enter password: ******(처음 설치시 default는 root)
$ use mysql
$ SELECT host, user FROM user;
```

대략 다음과 비슷한 결과를 얻을 수 있다:

```
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
```

1. 관리자 생성하기

외부에서 접근 가능하도록 새로 생성하는 관리자의 호스트는 `%`로 설정해야 한다. 물론 `%`뿐만 아니라 더
자세한 설정도 가능하다. `192.120.0.161` 등과 같이 자세한 설정도 가능하다. 해당 파트에선 간단히
`%`만을 사용한다.

```
mysql> CREATE user 'admin'@'%' identified by 'admin1234';
```

이전 `SELECT` 명령어로 추가된 `admin`을 확인할 수 있다.

2. DB 생성하기

이제 생성한 관리자가 관리할 DB를 생성하자.

```
mysql> CREATE DATABASE test;
```

3. 권한 부여

이제 새로 생성한 DB에 대한 권한을 `admin`에 부여해야 한다.

```
mysql> GRANT ALL PRIVILEGES ON test.* TO 'admin'@'%' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
```

위의 명령어는 `test` 데이터베이스에 대한 모든 권한(SELECT, UPDATE, DELETE 등) 부여한다.

4. Mysql 설정 파일 수정

my.cnf 파일 내에 `bind-address = 127.0.0.1`을 접근을 허용하고자 하는 IP로 변경해 주어야 한다.
만약 외부 IP에 대해 구분없이 전부 허용하는 경우 `0.0.0.0`으로 변경해주자. my.cnf 파일의 경우 버전
정보와 설치 프로그램에 따라 경로가 달라질 수 있기 때문에 검색 엔진에 `mysql bind-address`를 검색해
보자.

5. Mysql 재시작

이제 모든 설정이 끝났으니 Mysql을 재시작해주자.

Mysql 외부 IP 접근을 위한 모든 설정 과정이 끝났다. 부족한 부분들에 대해선 이후 추가할 예정이다. 이제
구현한 애플리케이션에 따라 새로 생성했던 관리자를 이용해 접근을 시도해보자.