## 다중 컨테이너 앱

지금까지 당신은 단일 컨테이너 앱으로 작업해 왔다. 그러나 이제 MySQL을 응용 프로그램 스택에 추가하자.
다음과 같은 질문이 자주 나온다. "MySQL은 어디서 실행하는가? 동일한 컨테이너에 설치하거나 별도로 실행하는가?"
일반적으로 각 컨테이너는 한 가지 일을 잘 해야 한다. 컨테이너를 별도로 실행해야 하는 몇 가지 이유는 다음과
같다:

- API와 프런트 엔드를 데이터베이스와 다르게 확장해야 할 가능성이 높다.
- 별도의 컨테이너를 사용하여 버전 및 업데이트 버전을 분리할 수 있다.
- 로컬에서 데이터베이스에 대한 컨테이너를 사용할 수 있지만 프로덕션 데이터베이스에 대해 관리 서비스를 사용할
수도 있다. 그러면 당신은 당신의 앱과 함께 당신의 데이터베이스 엔진을 선적하고 싶지 않을 것이다.
- 여러 프로세스를 실행하려면 프로세스 관리자(컨테이너가 하나의 프로세스만 시작함)가 필요하므로 컨테이너
시작/종료가 복잡해진다.

그리고 더 많은 이유들이 있다. 따라서 다음 다이어그램과 같이 앱을 여러 컨테이너에서 실행하는 것이 가장 좋다.

![](https://docs.docker.com/get-started/images/multi-app-architecture.png)

## 컨테이너 네트워킹

컨테이너는 기본적으로 독립적으로 실행되며 동일한 시스템의 다른 프로세스 또는 컨테이너에 대해 아무것도 알지
못 한다. 그렇다면, 어떻게 한 컨테이너가 다른 컨테이너와 대화하도록 허용할까? 정답은 네트워킹이다. 두
컨테이너를 동일한 네트워크에 배치하면 서로 통신할 수 있다.

## MySQL 시작하기

네트워크에 컨테이너를 배치하는 두 가지 방법이 있다:

- 컨테이너를 시작할 때 네트워크를 할당한다.
- 이미 실행 중인 컨테이너를 네트워크에 연결한다.

다음 단계에서 네트워크를 먼저 만든 다음 시작할 때 MySQL 컨테이너를 연결한다.

1. 네트워크를 생성한다.

```
$ docker network create todo-app
```

2. MySQL 컨테이너를 시작하여 네트워크에 연결한다. 또한 데이터베이스를 초기화하는 데 사용할 몇 가지 환경
변수도 정의한다. MySQL 환경 변수에 대한 자세한 내용은 [MySQL Docker Hub 목록](https://hub.docker.com/_/mysql/?_gl=1*1t8h4hc*_ga*MTQ5MjkwOTgyOS4xNjg0NDY4ODcy*_ga_XJWPQMJYHQ*MTY4NTEwNjE3NC4xNC4xLjE2ODUxMDY3OTcuNjAuMC4w)의
"환경 변수" 섹션을 참조하자.

### Mac/Linux

```
$ docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:8.0
```

### Windows

```
$ docker run -d `
     --network todo-app --network-alias mysql `
     -v todo-mysql-data:/var/lib/mysql `
     -e MYSQL_ROOT_PASSWORD=secret `
     -e MYSQL_DATABASE=todos `
     mysql:8.0
```

위의 명령에서 `--network-alias` 플래그를 볼 수 있다. 이후 섹션에서는 이 플래그에 대해 자세히
설명한다.

>MySQL이 데이터를 저장하는 `/var/lib/mysql`에 마운트된 위 명령에서 `todo-mysql-data`라는
> 볼륨을 볼 수 있다. 그러나 `docker volume create` 명령을 실행한 적이 없다. Docker는 지정된
> 볼륨을 사용하려는 사용자를 인식하고 자동으로 볼륨을 만들기 때문이다.

3. 데이터베이스가 실행 중인지 확인하려면 데이터베이스에 연결하고 연결되었는지 확인한다.

```
$ docker exec -it <mysql-container-id> mysql -u root -p
```

암호 프롬프트가 나타나면 `secret`를 입력한다. MySQL 셸에서 데이터베이스를 나열하고 `todos`
데이터베이스가 표시되는지 확인한다.

```
mysql> SHOW DATABASES;
```

다음과 같은 출력이 표시된다:

```
+--------------------+
 | Database           |
 +--------------------+
 | information_schema |
 | mysql              |
 | performance_schema |
 | sys                |
 | todos              |
 +--------------------+
 5 rows in set (0.00 sec)
```

4. MySQL 셸을 종료하고 시스템의 셸로 돌아간다.

```
mysql> exit
```

이제 `todos` 데이터베이스를 사용할 수 있다.

## MySQL 연결하기

이제 MySQL이 실행되고 있다는 것을 알았으니 사용할 수 있다. 하지만, 어떻게 사용해야 할까? 동일한
네트워크에서 다른 컨테이너를 실행하는 경우 컨테이너를 어떻게 찾을까? 각 컨테이너에는 고유한 IP 주소가
있다.

위의 질문에 답하고 컨테이너 네트워킹을 더 잘 이해하려면 네트워킹 문제를 해결하거나 디버깅하는 데 유용한
많은 도구와 함께 제공되는 [nicolaka/netshoot](https://github.com/nicolaka/netshoot)
컨테이너를 사용해야 한다.

1. nicolaka/netshoot 이미지를 사용하여 새 컨테이너를 시작한다. 동일한 네트워크에 연결해야 한다.

```
docker run -it --network todo-app nicolaka/netshoot
```

2. 컨테이너 안에서 유용한 DNS 도구인 `dig` 명령을 사용한다. 호스트 이름 `mysql`의 IP 주소를
검색한다.

```
dig mysql
```

당신은 다음과 같은 출력을 받아야 한다.

```
; <<>> DiG 9.18.8 <<>> mysql
 ;; global options: +cmd
 ;; Got answer:
 ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 32162
 ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

 ;; QUESTION SECTION:
 ;mysql.				IN	A

 ;; ANSWER SECTION:
 mysql.			600	IN	A	172.23.0.2

 ;; Query time: 0 msec
 ;; SERVER: 127.0.0.11#53(127.0.0.11)
 ;; WHEN: Tue Oct 01 23:47:24 UTC 2019
 ;; MSG SIZE  rcvd: 44
```

"응답 섹션"에서 `172.23.0.2`로 확인되는 `mysql`에 대한 `A` 레코드를 볼 수 있다(IP 주소의 값이 다를
가능성이 높음). `mysql`는 일반적으로 올바른 호스트 이름이 아니지만 Docker는 해당 네트워크 별칭을 가진
컨테이너의 IP 주소로 확인할 수 있었다. 기억하자, 당신은 아까 `--network-alias`을 사용했다.

이것은 앱이 `mysql`라는 호스트에 연결하기만 하면 데이터베이스와 통신한다는 것을 의미한다.

## MySQL과 함께 앱 실행하기

작업관리 앱은 MySQL 연결 설정을 지정하기 위한 몇 가지 환경 변수 설정을 지원한다. 다음과 같다:

- `MYSQL_HOST` : 실행 중인 MySQL 서버의 호스트 이름
- `MYSQL_USER` : 연결에 사용할 사용자 이름
- `MYSQL_PASSWORD` : 연결에 사용할 암호
- `MYSQL_DB` : 연결되면 사용할 데이터베이스

> 환경 변수를 사용하여 연결 설정을 설정하는 것은 일반적으로 개발에 허용되지만 운영 환경에서 응용
> 프로그램을 실행할 때는 권장되지 않는다. Docker의 보안 책임자였던 Diogo Monica는 그 이유를
> 설명하는 환상적인 [블로그 게시물](https://blog.diogomonica.com//2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/)을
> 작성했다.
> 
> 보다 안전한 메커니즘은 컨테이너 오케스트레이션 프레임워크에서 제공하는 비밀 지원을 사용하는 것이다.
> 대부분의 경우 이러한 암호는 실행 중인 컨테이너에 파일로 마운트된다. MySQL 이미지 및 작업관리 앱을
> 포함한 많은 앱들이 변수가 포함된 파일을 가리키는 `_FILE` 접미사를 가진 변수를 지원한다.
>
> 예를 들어, `MYSQL_PASSWORD_FILE` var를 설정하면 앱이 참조된 파일의 내용을 연결 암호로
> 사용한다. Docker는 이러한 환경을 지원하기 위해 아무것도 하지 않는다. 변수를 찾고 파일 내용을
> 가져오려면 앱을 알아야 한다.

이제 개발 준비 컨테이너를 시작할 수 있다.

1. 위의 각 환경 변수를 지정하고 컨테이너를 앱 네트워크에 연결한다. 이 명령을 실행할 때는
`getting-started/app` 디렉토리에 있어야 한다.

### Mac/Linux

```
docker run -dp 3000:3000 \
   -w /app -v "$(pwd):/app" \
   --network todo-app \
   -e MYSQL_HOST=mysql \
   -e MYSQL_USER=root \
   -e MYSQL_PASSWORD=secret \
   -e MYSQL_DB=todos \
   node:18-alpine \
   sh -c "yarn install && yarn run dev"
```

### Windows

```
docker run -dp 3000:3000 `
   -w /app -v "$(pwd):/app" `
   --network todo-app `
   -e MYSQL_HOST=mysql `
   -e MYSQL_USER=root `
   -e MYSQL_PASSWORD=secret `
   -e MYSQL_DB=todos `
   node:18-alpine `
   sh -c "yarn install && yarn run dev"
```

2. 컨테이너(`docker logs -f <container-id>`)의 로그를 보면 mysql 데이터베이스를 사용하고
있음을 나타내는 다음과 유사한 메시지가 나타난다.

```
nodemon src/index.js
 [nodemon] 2.0.20
 [nodemon] to restart at any time, enter `rs`
 [nodemon] watching dir(s): *.*
 [nodemon] starting `node src/index.js`
 Connected to mysql db at host mysql
 Listening on port 3000
```

3. 브라우저에서 앱을 열고 작업관리 목록에 몇 가지 항목을 추가한다.

4. mysql 데이터베이스에 연결하여 항목이 데이터베이스에 기록되고 있는지 확인한다. 암호는 `secret`이다.

```
docker exec -it <mysql-container-id> mysql -p todos
```

그리고 mysql 셸에서 다음을 실행한다:

```
mysql> select * from todo_items;
+--------------------------------------+--------------------+-----------+
 | id                                   | name               | completed |
 +--------------------------------------+--------------------+-----------+
 | c906ff08-60e6-44e6-8f49-ed56a0853e85 | Do amazing things! |         0 |
 | 2912a79e-8486-4bc3-a4c5-460793a575ab | Be awesome!        |         0 |
 +--------------------------------------+--------------------+-----------+
```

당신의 테이블은 당신의 아이템이 있기 때문에 다르게 보일 것이다. 하지만, 당신은 그것들이 거기에 저장되어
있는 것을 봐야 한다.