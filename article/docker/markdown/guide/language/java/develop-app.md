# 개발을 위한 컨테이너 사용 [#](https://docs.docker.com/language/java/develop/)

## 전제 조건

이미지를 컨테이너로 실행하고 이미지를 빌드하고 컨테이너형 응용 프로그램으로 실행하는 단계를 수행한다.

## 소개

이 모듈에서는 이전 모듈에서 구축한 애플리케이션의 로컬 개발 환경을 설정하는 과정을 살펴본다. Docker를
사용하여 이미지를 빌드하고 Dcoker Compose를 사용하여 모든 것을 훨씬 쉽게 만들 것이다.

## 컨테이너에서 데이터베이스 실행

먼저 컨테이너에서 데이터베이스를 실행하고 볼륨 및 네트워킹을 사용하여 데이터를 유지하고 애플리케이션이
데이터베이스와 통신할 수 있도록 하는 방법에 대해 살펴본다. 그런 다음 모든 것을 하나의 명령으로 로컬 개발
환경을 설정하고 실행할 수 있는 Compose 파일로 가져온다. 마지막으로 컨테이너 내부에서 실행되는 응용
프로그램에 디버거를 연결하는 방법을 살펴본다.

MySQL을 다운로드하고 MySQL 데이터베이스를 서비스로 설치, 구성 및 실행하는 대신 Docker Official
Image for MySQL을 사용하여 컨테이너에서 실행할 수 있다.

컨테이너에서 MySQL을 실행하기 전에 Docker가 영구 데이터 및 구성을 저장할 수 있는 몇 개의 볼륨을
생성한다. 바인딩 마운트를 사용하는 대신 Docker에서 제공하는 관리되는 볼륨 기능을 사용한다. 볼륨 사용에
대한 자세한 내용은 설명서를 참조하자.

이제 볼륨을 생성한다. 하나는 데이터용으로, 하나는 MySQL 구성용으로 만들겠다.

```
$ docker volume create mysql_data
$ docker volume create mysql_config
```

이제 애플리케이션과 데이터베이스가 서로 통신하는 데 사용할 네트워크를 만들 것이다. 네트워크를 사용자 정의
브리지 네트워크라고 하며 연결 문자열을 만들 때 사용할 수 있는 멋진 DNS 조회 서비스를 제공한다.

```
$ docker network create mysqlnet
```

이제 MySQL을 컨테이너에서 실행하고 위에서 만든 볼륨과 네트워크에 연결해 보자. Docker는 허브에서 이미지를
가져와 로컬로 실행한다.

```
$ docker run -it --rm -d -v mysql_data:/var/lib/mysql \
-v mysql_config:/etc/mysql/conf.d \
--network mysqlnet \
--name mysqlserver \
-e MYSQL_USER=petclinic -e MYSQL_PASSWORD=petclinic \
-e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=petclinic \
-p 3306:3306 mysql:8.0
```

이제 실행 중인 MySQL이 있으므로 Docker 파일을 업데이트하여 응용 프로그램에 정의된 MySQL Spring
프로파일을 활성화하고 메모리 내 H2 데이터베이스에서 방금 만든 MySQL 서버로 전환해 보자.

MySQL 프로파일을 인수로 CMD 정의에 추가하기만 하면 된다.

```
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.profiles=mysql"]
```

우리의 이미지를 구축한다.

```
$ docker build --tag java-docker .
```

이제 컨테이너를 가동해 보자. 이번에는 애플리케이션이 데이터베이스에 액세스하는 데 사용할 연결 문자열을 알 수
있도록 `MYSQL_URL` 환경 변수를 설정해야 한다. `docker run` 명령을 사용하여 이 작업을 수행한다.

```
$ docker run --rm -d \
--name springboot-server \
--network mysqlnet \
-e MYSQL_URL=jdbc:mysql://mysqlserver/petclinic \
-p 8080:8080 java-docker
```

애플리케이션이 데이터베이스에 연결되어 있고 수의사를 나열할 수 있는지 테스트해 보자.

```
$ curl  --request GET \
  --url http://localhost:8080/vets \
  --header 'content-type: application/json'
```

당신은 우리 서비스로부터 다음과 같은 json을 돌려받아야 한다.

```json
{"vetList":[{"id":1,"firstName":"James","lastName":"Carter","specialties":[],"nrOfSpecialties":0,"new":false},{"id":2,"firstName":"Helen","lastName":"Leary","specialties":[{"id":1,"name":"radiology","new":false}],"nrOfSpecialties":1,"new":false},{"id":3,"firstName":"Linda","lastName":"Douglas","specialties":[{"id":3,"name":"dentistry","new":false},{"id":2,"name":"surgery","new":false}],"nrOfSpecialties":2,"new":false},{"id":4,"firstName":"Rafael","lastName":"Ortega","specialties":[{"id":2,"name":"surgery","new":false}],"nrOfSpecialties":1,"new":false},{"id":5,"firstName":"Henry","lastName":"Stevens","specialties":[{"id":1,"name":"radiology","new":false}],"nrOfSpecialties":1,"new":false},{"id":6,"firstName":"Sharon","lastName":"Jenkins","specialties":[],"nrOfSpecialties":0,"new":false}]}
```

## 개발을 위한 다단계 Dockerfile

이제 Dockerfile을 업데이트하여 제작 준비가 된 최종 이미지와 개발 이미지를 생성하는 전용 단계를
살펴보자.

또한 실행 중인 Java 프로세스에 디버거를 연결할 수 있도록 개발 컨테이너에서 응용 프로그램을 디버그 모드로
시작하도록 Dockerfile을 설정한다.

아래는 생산 이미지와 개발 이미지를 구축하는 데 사용할 다단계 Dockerfile이다. Dockerfile의 내용을
다음으로 바꾼다.

```
# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk-jammy as base
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:resolve
COPY src ./src

FROM base as development
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.profiles=mysql", "-Dspring-boot.run.jvmArguments='-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:8000'"]

FROM base as build
RUN ./mvnw package

FROM eclipse-temurin:17-jre-jammy as production
EXPOSE 8080
COPY --from=build /app/target/spring-petclinic-*.jar /spring-petclinic.jar
CMD ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/spring-petclinic.jar"]
```

먼저 `FROM eclipse-temurin:17-jdk-jammy` 문에 레이블을 추가한다. 이를 통해 다른 빌드 단계에서
이 빌드 단계를 참조할 수 있다. 그런 다음 `development`라는 새 빌드 단계를 추가했다.

디버거를 연결할 수 있도록 포트 8000을 노출하고 JVM에 대한 디버그 구성을 선언한다.

## Compose를 사용하여 로컬로 개발

이제 단일 명령을 사용하여 개발 컨테이너와 MySQL 데이터베이스를 시작하기 위한 Compose 파일을 만들 수
있다.

IDE 또는 텍스트 편집기에서 `petclinic`를 열고 이름이 `docker-compose.dev.yml`인 새 파일을
만든다. 다음 명령을 복사하여 파일에 붙여넣는다.

```yaml
version: '3.8'
services:
  petclinic:
    build:
      context: ../../../../../../../../../..
      target: development
    ports:
      - "8000:8000"
      - "8080:8080"
    environment:
      - SERVER_PORT=8080
      - MYSQL_URL=jdbc:mysql://mysqlserver/petclinic
    volumes:
      - ./:/app
    depends_on:
      - mysqlserver

  mysqlserver:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=
      - MYSQL_ALLOW_EMPTY_PASSWORD=true
      - MYSQL_USER=petclinic
      - MYSQL_PASSWORD=petclinic
      - MYSQL_DATABASE=petclinic
    volumes:
      - mysql_data:/var/lib/mysql
      - mysql_config:/etc/mysql/conf.d
volumes:
  mysql_data:
  mysql_config:
```

이 Compose 파일은 `docker run` 명령에 전달하기 위해 모든 매개 변수를 입력할 필요가 없기 때문에
매우 편리하다. Compose 파일을 사용하여 선언적으로 이 작업을 수행할 수 있다.

Compose 파일을 사용하는 또 다른 멋진 기능은 서비스 이름을 사용하도록 서비스 해결 방법을 설정했다는
것이다. 따라서 이제 연결 문자열에 `mysqlserver`를 사용할 수 있다. 우리가 `mysqlserver`를
사용하는 이유는 그것이 우리의 MySQL 서비스를 Compose 파일에 있는 것처럼 명명했기 때문이다.

이제 응용 프로그램을 시작하고 제대로 실행되고 있는지 확인하자.

```
$ docker-compose -f docker-compose.dev.yml up --build
```

Docker가 이미지를 컴파일한 다음 컨테이너를 시작할 수 있도록 `--build` 플래그를 전달한다. 성공적으로
실행될 경우 유사한 출력이 표시된다:

![](https://docs.docker.com/language/java/images/java-compose-output.png)

이제 API 끝점을 테스트해 보자. 다음 curl 명령을 실행한다:

```
$ curl  --request GET \
  --url http://localhost:8080/vets \
  --header 'content-type: application/json'
```

다음과 같은 응답이 표시된다:

```json
{"vetList":[{"id":1,"firstName":"James","lastName":"Carter","specialties":[],"nrOfSpecialties":0,"new":false},{"id":2,"firstName":"Helen","lastName":"Leary","specialties":[{"id":1,"name":"radiology","new":false}],"nrOfSpecialties":1,"new":false},{"id":3,"firstName":"Linda","lastName":"Douglas","specialties":[{"id":3,"name":"dentistry","new":false},{"id":2,"name":"surgery","new":false}],"nrOfSpecialties":2,"new":false},{"id":4,"firstName":"Rafael","lastName":"Ortega","specialties":[{"id":2,"name":"surgery","new":false}],"nrOfSpecialties":1,"new":false},{"id":5,"firstName":"Henry","lastName":"Stevens","specialties":[{"id":1,"name":"radiology","new":false}],"nrOfSpecialties":1,"new":false},{"id":6,"firstName":"Sharon","lastName":"Jenkins","specialties":[],"nrOfSpecialties":0,"new":false}]}
```

## 디버거 연결

IntelliJ IDEA와 함께 제공되는 디버거를 사용한다. 이 IDE의 커뮤니티 버전을 사용할 수 있다.
IntelliJ IDEA에서 프로젝트를 열고 실행 메뉴 > 구성 편집으로 이동한다. 다음과 유사한 새 원격 JVM
디버그 구성을 추가한다:

![](https://docs.docker.com/language/java/images/connect-debugger.png)

중단점을 설정한다

다음 파일 `src/main/java/org/springframework/samples/petclinic/vet/VetController.java`를
열고 `showResourcesVetList` 함수 내부에 중단점을 추가한다.

디버그 세션을 시작하자. (실행 메뉴를 선택한 다음 디버그 NameOfYourConfiguration)

![](https://docs.docker.com/language/java/images/debug-menu.png)

이제 Compose 응용 프로그램의 로그에 연결이 표시된다.

![](https://docs.docker.com/language/java/images/compose-logs.png)

이제 서버 엔드포인트를 호출할 수 있다.

```
$ curl --request GET --url http://localhost:8080/vets
```

당신은 표시된 줄에서 코드가 끊기는 것을 봤어야 했고 이제 당신은 당신이 평소처럼 디버거를 사용할 수 있다.
또한 변수를 검사 및 관찰하고, 조건부 중단점을 설정하고, 스택 추적을 보고, 여러 가지 작업을 수행할 수
있다.

![](https://docs.docker.com/language/java/images/debugger-breakpoint.png)

또한 SpringBoot Dev Tools에서 제공하는 라이브 다시 로드 옵션을 활성화할 수 있다. 원격 응용 프로그램에
연결하는 방법에 대한 자세한 내용은 [SpringBoot 설명서](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools.remote-applications)를
참조하자.