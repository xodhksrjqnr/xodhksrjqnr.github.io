# Docker Compose 사용하기 [#](https://docs.docker.com/get-started/08_using_compose/)

Docker Compose는 다중 컨테이너 응용 프로그램을 정의하고 공유하기 위해 개발된 도구이다. Compose를
사용하면 YAML 파일을 생성하여 서비스를 정의하고 명령 하나로 모든 것을 회전시키거나 모두 해체할 수 있다.

Compose를 사용하면 파일에서 응용 프로그램 스택을 정의하고 프로젝트 레포(현재 버전 제어)의 루트에 보관할
수 있으며 다른 사용자가 쉽게 프로젝트에 참여할 수 있다는 큰 장점이 있다. 누군가가 당신의 레포를 복제하고
작성 앱을 시작하기만 하면 된다. 실제로 GitHub/GitLab에서 이와 같은 작업을 수행하는 프로젝트가 많이
있다.

자, 어떻게 시작해야 할까?

# Docker Compose 설치하기

Windows, Mac 또는 Linux용 Docker Desktop을 설치한 경우 Docker Composite가 이미 설치되어
있다! Play-with-Docker 인스턴스에도 Docker Compose는 이미 설치되어 있다.

Docker Engine을 독립 실행형으로 설치하려면 Docker Compose를 별도의 패키지로 설치해야 한다. [구성
플러그인 설치](https://docs.docker.com/compose/install/linux/)를 참조하자.

설치 후 다음 명령어를 실행하면 버전 정보를 볼 수 있다.

```
$ docker compose version
```

# Compose 파일 생성하기

1. `/getting-started/app` 폴더의 루트에 `docker-compose.yml`라는 파일을 생성한다.
2. 먼저 작성 파일에서 응용 프로그램의 일부로 실행할 서비스(또는 컨테이너) 목록을 정의한다.

```yaml
services:
```

이제 서비스를 한 번에 구성 파일로 마이그레이션한다.

# 앱 서비스 정의하기

이 명령어는 앱 컨테이너를 정의하는 데 사용되었다.

```
$ docker run -dp 3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:18-alpine \
  sh -c "yarn install && yarn run dev"
```

1. 먼저 컨테이너에 대한 서비스 항목과 이미지를 정의한다. 우리는 서비스의 이름을 선택할 수 있다. 이 이름은
자동으로 네트워크 별칭이 되어 MySQL 서비스를 정의할 때 유용하다.

```yaml
services:
  app:
    image: node:18-alpine
```

2. 일반적으로 `image`는 `command` 정의에 가깝게 표시되지만 주문에 대한 요구 사항은 없다. 이제 파일로
이동해 보자.

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
```

3. 서비스의 `ports`을 정의하여 명령의 `-p 3000:3000` 부분을 마이그레이션한다. 여기서는 짧은 구문을
사용하겠지만, 보다 상세한 긴 구문도 사용할 수 있다.

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
```

4. 그런 다음 `working_dir` 및 `volumes` 정의를 사용하여 작업 디렉터리(`-w /app`)와 볼륨
매핑(`-v "$(pwd):/app"`)을 모두 마이그레이션한다. 또한 볼륨에는 짧고 긴 구문이 있다.

Docker Compose 볼륨 정의의 한 가지 장점은 현재 디렉토리에서 상대 경로를 사용할 수 있다는 것이다.

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
```

5. 마지막으로 `environment` 키를 사용하여 환경 변수 정의를 마이그레이션해야 한다.

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos
```

# MySQL 서비스 정의하기

이제 MySQL 서비스를 정의할 차례이다. 해당 컨테이너에 사용한 명령은 다음과 같다:

```
$ docker run -d \
  --network todo-app --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:8.0
```

1. 먼저 새 서비스를 정의하고 이름을 `mysql`로 지정하여 네트워크 별칭을 자동으로 가져온다. 사용할
이미지도 지정한다.

```yaml
services:
  app:
    # The app service definition
  mysql:
    image: mysql:8.0
```

2. 다음으로 볼륨 매핑을 정의한다. `docker run`를 사용하여 컨테이너를 실행하면 명명된 볼륨이 자동으로
생성된다. 그러나 Compose를 사용하여 실행하는 경우에는 이러한 현상이 발생하지 않는다. 최상위 `volumes`:
섹션에서 볼륨을 정의한 다음 서비스 구성에서 마운트 지점을 지정해야 한다. 볼륨 이름만 제공하면 기본 옵션이
사용된다. 하지만 더 많은 옵션이 있다.

```yaml
services:
  app:
    # The app service definition
  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql

volumes:
  todo-mysql-data:
```

3. 마지막으로 환경 변수만 지정하면 된다.

```yaml
services:
  app:
    # The app service definition
  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

이 시점에서 완전한 docker-compose.yml은 다음과 같다:

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

# 애플리케이션 스택 실행하기

이제 `docker-compose.yml` 파일이 생겼으니 시작할 수 있다!

먼저 실행 중인 다른 app/db 복사본(`docker ps` 및 `docker rm -f <ids>`)이 없는지 확인한다.

`docker compose up` 명령을 사용하여 애플리케이션 스택을 시작한다. `-d` 플래그를 추가하여
백그라운드에서 모든 것을 실행한다.

```
$ docker compose up -d
```

이를 실행하면 다음과 같은 출력이 표시된다:

```
Creating network "app_default" with the default driver
Creating volume "app_todo-mysql-data" with default driver
Creating app_app_1   ... done
Creating app_mysql_1 ... done
```

볼륨이 네트워크와 함께 생성되었음을 알 수 있다! 기본적으로 Docker Compose는 응용 프로그램 스택 전용
네트워크를 자동으로 생성한다. 이 때문에 Compose 파일에 네트워크를 정의하지 않는다.

3. 이제 `docker compose logs -f` 명령을 사용하여 로그를 살펴보자. 각 서비스의 로그가 단일 스트림에
인터리브되어 표시된다. 이 기능은 타이밍 관련 문제를 감시하려는 경우 매우 유용하다. `-f` 플래그는 로그를
"표시"하므로 로그가 생성될 때 실시간 출력을 제공된다.

명령을 이미 실행한 경우 다음과 같은 출력이 표시된다:

```
mysql_1  | 2019-10-03T03:07:16.083639Z 0 [Note] mysqld: ready for connections.
mysql_1  | Version: '8.0.31'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
app_1    | Connected to mysql db at host mysql
app_1    | Listening on port 3000
```

서비스 이름은 메시지를 쉽게 구분할 수 있도록 줄의 시작 부분에 표시된다(종종 색상). 특정 서비스의 로그를
보려면 logs 명령 끝에 서비스 이름(예: `docker compose logs -f app`)을 추가할 수 있다.

4. 이때 앱을 열고 실행 중인 것을 확인할 수 있다. 드디어 지휘권 하나를 잡았다!

# Docker Dashboard에서 앱 스택 보기

Docker Dashboard를 보면 앱이라는 그룹이 있다. 이것은 Docker Compose의 "프로젝트 이름"이며
컨테이너를 그룹화하는 데 사용된다. 기본적으로 프로젝트 이름은 `docker-compose.yml`가 있던
디렉터리의 이름이다.

![](https://docs.docker.com/get-started/images/dashboard-app-project-collapsed.png)

앱 옆에 있는 노출 화살표를 클릭하면 컴포지트 파일에 정의된 두 개의 컨테이너가 표시된다. 그 이름들은 또한
`<service-name>-<replica-number>`의 패턴을 따르기 때문에 조금 더 설명적이다. 따라서 어떤
컨테이너가 우리 앱이고 어떤 컨테이너가 mysql 데이터베이스인지 쉽게 확인할 수 있다.

![](https://docs.docker.com/get-started/images/dashboard-app-project-expanded.png)

# 모두 제거하기

모든 것을 해체할 준비가 되었으면 docker compose down를 실행하거나 전체 앱에 대한 Docker
Dashboard의 휴지통을 클릭하자. 컨테이너가 중지되고 네트워크가 제거된다.

> 볼륨 제거 중
> 기본적으로 `docker compose down`를 실행할 때 작성 파일의 명명된 볼륨은 제거되지 않는다. 볼륨을
> 제거하려면 `--volumes` 플래그를 추가해야 한다.
> 앱 스택을 삭제할 때 Docker Dashboard는 볼륨을 제거하지 않는다.

해체된 후에는 다른 프로젝트로 전환하여 `docker compose up`를 실행하고 해당 프로젝트에 참여할 준비를
할 수 있다!