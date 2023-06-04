# Java 이미지 구축

## 전제 조건

- 기본적인 Docker 개념을 이해한다.
- Dockerfile 형식에 익숙하다.
- 컴퓨터에서 빌드킷을 사용하도록 설정했다.

## 개요
이제 컨테이너와 Docker 플랫폼에 대한 개요를 살펴보았다. 이제 첫 번째 이미지 구축에 대해 살펴보자.
이미지에는 응용 프로그램을 실행하는 데 필요한 코드 또는 이진, 런타임, 종속성 및 필요한 기타 파일 시스템
개체 등 모든 항목이 포함된다.

이 자습서를 완료하려면 다음이 필요하다:

- Docker가 로컬에서 실행 중입니다. 지침에 따라 Docker를 다운로드하고 설치한다.
- Git 클라이언트
- 파일을 편집하는 IDE 또는 텍스트 편집기이다. IntelliJ Community Edition을 사용하는 것이 좋다.

## 샘플적용
이 모듈에서 사용할 샘플 애플리케이션을 로컬 개발 시스템에 복제해 보자. 터미널에서 다음 명령을 실행하여
repo를 복제한다.

```
cd /path/to/working/directory
git clone https://github.com/spring-projects/spring-petclinic.git
cd spring-petclinic
```

## Docker 없이 응용 프로그램 테스트(선택 사항)
이 단계에서는 Docker를 사용하여 애플리케이션을 빌드하고 실행하기 전에 Docker 없이 로컬로 애플리케이션을
테스트한다. 이 섹션에서는 컴퓨터에 Java OpenJDK 버전 15 이상이 설치되어 있어야 한다.
[Java 다운로드 및 설치](https://jdk.java.net/)

컴퓨터에 Java를 설치하지 않으려면 이 단계를 건너뛰고 다음 섹션으로 바로 이동하면 된다. 이 섹션에서는
컴퓨터에 Java를 설치할 필요가 없는 Docker에서 응용 프로그램을 빌드하고 실행하는 방법을 설명한다.

응용 프로그램을 시작하고 제대로 실행되고 있는지 확인한다. Maven은 모든 프로젝트 프로세스(컴파일링, 테스트,
패키징 등)를 관리한다. 우리가 이전에 복제한 Spring Pets Clinic 프로젝트에는 Maven 버전이 포함되어
있다. 따라서 우리는 당신의 로컬 머신에 Maven을 별도로 설치할 필요가 없다.

터미널을 열고 만든 작업 디렉토리로 이동하여 다음 명령을 실행한다:

```
./mvnw spring-boot:run
```

그러면 종속성이 다운로드되고 프로젝트가 빌드되고 시작된다.

응용 프로그램이 제대로 작동하는지 테스트하려면 새 브라우저를 열고 http://localhost:8080으로 이동한다.

서버가 실행 중인 터미널로 다시 전환하면 서버 로그에 다음 요청이 표시된다. 당신의 기계에서 데이터가 다를
것이다.

```
o.s.s.petclinic.PetClinicApplication     : Started
PetClinicApplication in 11.743 seconds (JVM running for 12.364)
```

응용 프로그램이 작동하는지 확인했다. 이 단계에서는 서버 스크립트 로컬 테스트를 완료했다.

서버가 실행 중인 터미널 세션에서 `CTRL-c`를 눌러 중지한다.

이제 Docker에서 애플리케이션을 계속 빌드하고 실행할 것이다.

## Java용 Dockerfile 만들기

다음으로, 애플리케이션에 사용할 기본 이미지를 Docker에 알려주는 줄을 Dockerfile에 추가해야 한다.

```dockerfile
# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk-jammy
```

Docker 이미지는 다른 이미지에서 상속될 수 있다. 이 가이드를 위해 빌드 가능한 JDK가 포함된 가장 인기있는
공식 이미지 중 하나인 Eclipse Termurin을 사용한다.

나머지 명령을 쉽게 실행할 수 있도록 이미지의 작업 디렉터리를 설정한다. Docker가 이 경로를 모든 후속
명령의 기본 위치로 사용하도록 지시한다. 이렇게 하면 전체 파일 경로를 입력할 필요가 없고 작업 디렉터리를
기반으로 상대 경로를 사용할 수 있다.

```dockerfile
WORKDIR /app
```

일반적으로 프로젝트 관리를 위해 Maven을 사용하는 Java로 작성된 프로젝트를 다운로드한 후 가장 먼저
수행하는 작업은 종속성을 설치하는 것이다.

`mvnw dependency`를 실행하기 전에 `Maven wrapper`와 `pom.xml` 파일을 이미지로 가져와야 한다.
`COPY` 명령을 사용하여 이 작업을 수행한다. `COPY` 명령에는 두 가지 매개 변수가 사용된다. 첫 번째 매개
변수는 이미지에 복사할 파일을 Docker에 알려준다. 두 번째 매개 변수는 해당 파일을 복사할 위치를 Docker에
알려준다. 이러한 모든 파일과 디렉터리를 작업 디렉터리인 `/app`에 복사한다.

```dockerfile
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
```

이미지에 `pom.xml` 파일이 있으면 `RUN` 명령을 사용하여 명령 `mvnw dependency:resolve`을
실행할 수 있다. 이 방법은 컴퓨터에서 `mvn`(또는 `mvnw`) 종속성을 로컬로 실행하는 경우와 정확히
동일하게 작동하지만, 이번에는 종속성이 이미지에 설치된다.

```dockerfile
RUN ./mvnw dependency:resolve
```

이 시점에서 OpenJDK 버전 17을 기반으로 하는 Eclipse Termurin 이미지가 있으며 종속성도 설치했다.
다음으로 해야 할 일은 이미지에 소스 코드를 추가하는 것이다. 위의 `pom.xml` 파일과 마찬가지로 `COPY`
명령을 사용한다.

```dockerfile
COPY src ./src
```

이 `COPY` 명령은 현재 디렉터리에 있는 모든 파일을 가져와 이미지에 복사한다. 이제 이미지가 컨테이너
안에서 실행될 때 실행할 명령어를 Docker에게 알려주기만 하면 된다. 이 작업은 `CMD` 명령을 사용하여
수행한다.

```dockerfile
CMD ["./mvnw", "spring-boot:run"]
```

완전한 Dockerfile이다.

```dockerfile
# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:resolve

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]
```

## `.dockerignore` 파일 생성

빌드의 성능을 높이고 일반적인 모범 사례로 Dockerfile과 동일한 디렉터리에 `.dockerignore` 파일을
생성하는 것이 좋다. 이 튜토리얼의 경우 `.dockerignore` 파일에는 한 줄만 포함되어야 한다:

```
target
```

이 행은 Maven의 출력이 포함된 대상 디렉토리를 Docker 빌드 컨텍스트에서 제외한다. `.dockerignore`
파일을 신중하게 구성해야 하는 많은 좋은 이유가 있지만 현재로서는 이 한 줄짜리 파일로 충분하다.

## 이미지 빌드

이제 Dockerfile을 만들었으니 이미지를 구축해 보자. 이렇게 하려면 `docker build` 명령을 사용한다.
`docker build` 명령은 Dockerfile과 "Docker"에서 Docker 이미지를 빌드한다. 빌드의 컨텍스트는
지정된 PATH 또는 URL에 있는 파일 집합이다. Docker 빌드 프로세스는 이 컨텍스트에 있는 모든 파일에
액세스할 수 있다.

build 명령은 선택적으로 `--tag` 플래그를 사용한다. 태그는 이미지의 이름과 선택적 태그를 `name:tag`
형식으로 설정하는 데 사용된다. 단순화를 위해 선택적 `tag`는 일단 생략한다. 태그를 전달하지 않으면 Docker는
"latest"를 기본 태그로 사용한다. 빌드 출력의 마지막 줄에서 이를 확인할 수 있다.

첫 번째 Docker 이미지를 구축한다.

```
docker build --tag java-docker .
```

```
Sending build context to Docker daemon  5.632kB
Step 1/7 : FROM eclipse-temurin:17-jdk-jammy
Step 2/7 : WORKDIR /app
...
Successfully built a0bb458aabd0
Successfully tagged java-docker:latest
```

## 로컬 이미지 보기

로컬 컴퓨터에 있는 이미지 목록을 보려면 두 가지 옵션이 있다. 하나는 CLI를 사용하는 것이고 다른 하나는
Docker Desktop을 사용하는 것이다. 현재 터미널에서 작업 중이므로 CLI를 사용하여 이미지 목록을 살펴보자.

이미지를 나열하려면 `docker images` 명령을 실행하기만 하면 된다.

```
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED          SIZE
java-docker         latest              b1b5f29f74f0        47 minutes ago   567MB
```

당신은 적어도 우리가 방금 만든 `java-docker:latest`의 이미지를 봐야 한다.

## 태그 이미지

이미지 이름은 슬래시로 구분된 이름 구성 요소로 구성된다. 이름 구성 요소에는 소문자, 숫자 및 구분 기호가
포함될 수 있다. 구분 기호는 마침표, 하나 또는 두 개의 밑줄 또는 하나 이상의 대시로 정의된다. 이름 구성
요소는 구분 기호로 시작하거나 끝날 수 없다.

이미지는 매니페스트와 레이어 목록으로 구성된다. "tag"가 이러한 아티팩트의 조합을 가리키는 것 이외에는
이 시점에서 매니페스트와 레이어에 대해 너무 걱정하지 말자. 이미지에 대해 여러 태그를 사용할 수 있다. 이제
빌드한 이미지에 대한 두 번째 태그를 만들고 해당 계층을 살펴보자.

위에서 작성한 이미지에 대한 새 태그를 만들려면 다음 명령을 실행한다:

```
docker tag java-docker:latest java-docker:v1.0.0
```

`docker tag` 명령은 이미지에 대한 새 태그를 생성한다. 새 이미지는 생성되지 않는다. 태그는 동일한
이미지를 가리키며 이미지를 참조하는 또 다른 방법이다.

이제 `docker images` 명령을 실행하여 로컬 이미지 목록을 확인한다.

```
docker images
REPOSITORY    TAG      IMAGE ID		  CREATED		  SIZE
java-docker   latest   b1b5f29f74f0	  59 minutes ago	567MB
java-docker   v1.0.0   b1b5f29f74f0	  59 minutes ago	567MB
```

보시다시피 `java-docker`로 시작하는 두 개의 이미지가 있다. `IMAGE ID` 열을 보면 두 이미지의 값이
동일하다는 것을 알 수 있기 때문에 동일한 이미지라는 것을 알 수 있다.

방금 만든 태그를 제거하자. 이렇게 하려면 `rmi` 명령을 사용한다. `rmi` 명령은 "이미지 제거"를 나타낸다.

```
docker rmi java-docker:v1.0.0
Untagged: java-docker:v1.0.0
```

Docker의 응답은 이미지가 제거되지 않고 "untagged"만 제거되었음을 알려준다. `docker images`
명령을 실행하여 이를 확인할 수 있다.

```
docker images
REPOSITORY      TAG     IMAGE ID        CREATED              SIZE
java-docker    	latest	b1b5f29f74f0	59 minutes ago	     567MB
```

`:v1.0.0` 태그가 지정된 이미지는 제거되었지만 컴퓨터에서 `java-docker:latest` 태그를 사용할 수
있다.

