# 이미지 계층화

여러분은 이미지를 구성하는 것을 볼 수 있다는 것을 알고 있는가? `docker image history` 명령을
사용하면 이미지 내에 각 계층을 생성하는 데 사용된 명령을 볼 수 있다.

1. 자습서 앞부분에서 생성한 `getting-started` 이미지의 레이어를 보기위해 `docker image history`
명령을 사용한다.

```
$ docker image history getting-started
```

다음과 같은 출력이 표시된다(날짜/ID는 다를 수 있다).

```
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
 a78a40cbf866        18 seconds ago      /bin/sh -c #(nop)  CMD ["node" "src/index.j…    0B                  
 f1d1808565d6        19 seconds ago      /bin/sh -c yarn install --production            85.4MB              
 a2c054d14948        36 seconds ago      /bin/sh -c #(nop) COPY dir:5dc710ad87c789593…   198kB               
 9577ae713121        37 seconds ago      /bin/sh -c #(nop) WORKDIR /app                  0B                  
 b95baba1cfdb        13 days ago         /bin/sh -c #(nop)  CMD ["node"]                 0B                  
 <missing>           13 days ago         /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B                  
 <missing>           13 days ago         /bin/sh -c #(nop) COPY file:238737301d473041…   116B                
 <missing>           13 days ago         /bin/sh -c apk add --no-cache --virtual .bui…   5.35MB              
 <missing>           13 days ago         /bin/sh -c #(nop)  ENV YARN_VERSION=1.21.1      0B                  
 <missing>           13 days ago         /bin/sh -c addgroup -g 1000 node     && addu…   74.3MB              
 <missing>           13 days ago         /bin/sh -c #(nop)  ENV NODE_VERSION=12.14.1     0B                  
 <missing>           13 days ago         /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B                  
 <missing>           13 days ago         /bin/sh -c #(nop) ADD file:e69d441d729412d24…   5.59MB
```

각 선은 이미지의 레이어를 나타낸다. 위에 있을수록 최신 레이어를 보여준다. 이를 사용하면 각 레이어의 크기를
빠르게 확인할 수 있어 큰 이미지를 진단하는 데 도움이 된다.

2. 여러 줄이 잘린 것을 볼 수 있다. `--no-trunc` 플래그를 추가하면 전체 출력이 표시된다.

```
$ docker image history --no-trunc getting-started
```

# 계층 캐싱

이제 계층화의 실행을 살펴보았으니 컨테이너 이미지의 빌드 시간을 줄이는 방법을 배울 수 있는 중요한 교훈이
있다.

> 계층이 변경되면 모든 다운스트림 계층도 다시 생성해야 한다.

우리가 사용하던 도커 파일을 한 번 더 보자.

```
# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

이미지 히스토리 출력으로 돌아가서 Dockerfile의 각 명령이 이미지의 새 레이어가 되는 것을 알 수 있다.
이미지를 변경할 때 실 종속성을 다시 설치해야 했던 것을 기억하실 수 있다. 이것을 고칠 수 있는 방법이
있을까? 구축할 때마다 동일한 종속성으로 배송하는 것은 그다지 말이 되지 않는다.

이 문제를 해결하려면 종속성 캐싱을 지원하도록 Dockerfile을 재구성해야 한다. 노드 기반 애플리케이션의
경우 이러한 종속성은 `package.json` 파일에 정의된다. 먼저 해당 파일만 복사하고 종속성을 설치한 다음
다른 모든 파일을 복사하면 어떨까? 그런 다음 `package.json`에 변화가 있을 경우에만 실 의존성을
재현한다.

1. 먼저 `package.json`에서 복사할 Dockerfile를 업데이트하고 종속성을 설치한 다음 다른 모든 항목을
복사한다.

```
# syntax=docker/dockerfile:1
 FROM node:18-alpine
 WORKDIR /app
 COPY package.json yarn.lock ./
 RUN yarn install --production
 COPY . .
 CMD ["node", "src/index.js"]
```

2. Dockerfile와 동일한 폴더에 다음과 같은 내용의 `.dockerignore` 파일을 생성한다.

```
node_modules
```

`.dockerignore` 파일은 이미지 관련 파일만 선택적으로 복사할 수 있는 쉬운 방법이다. 자세한 내용은
[여기](https://docs.docker.com/engine/reference/builder/#dockerignore-file)를
참조하자. 이 경우 두 번째 `COPY` 단계에서 `node_modules` 폴더를 생략해야 한다. 그렇지 않으면 `RUN`
단계에서 명령으로 생성된 파일을 덮어쓸 수 있다. Node.js 응용 프로그램 및 기타 모범 사례에 권장되는
이유에 대한 자세한 내용은 [Node.js 웹 응용 프로그램 Dockerizing](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)에
대한 가이드를 참조하자.

3. `docker build`를 사용하여 새 이미지를 빌드한다.

```
$ docker build -t getting-started .
```

다음과 같은 출력이 표시된다.

```
[+] Building 16.1s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 175B
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [internal] load metadata for docker.io/library/node:18-alpine
 => [internal] load build context
 => => transferring context: 53.37MB
 => [1/5] FROM docker.io/library/node:18-alpine
 => CACHED [2/5] WORKDIR /app
 => [3/5] COPY package.json yarn.lock ./
 => [4/5] RUN yarn install --production
 => [5/5] COPY . .
 => exporting to image
 => => exporting layers
 => => writing image     sha256:d6f819013566c54c50124ed94d5e66c452325327217f4f04399b45f94e37d25
 => => naming to docker.io/library/getting-started
```

모든 도면층이 다시 작성된 것을 볼 수 있다. 우리가 Dockerfile을 꽤 많이 바꿨기 때문에 당연하다.

4. 이제 `src/static/index.html` 파일을 변경한다(예: `<title>`를 "The Awesome Todo
App"으로 변경).
5. `docker build -t getting-started .`를 다시 사용하여 지금 Docker 이미지를 빌드한다.
이번에는 출력이 조금 다르게 보일 것이다.

```
[+] Building 1.2s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 37B
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [internal] load metadata for docker.io/library/node:18-alpine
 => [internal] load build context
 => => transferring context: 450.43kB
 => [1/5] FROM docker.io/library/node:18-alpine
 => CACHED [2/5] WORKDIR /app
 => CACHED [3/5] COPY package.json yarn.lock ./
 => CACHED [4/5] RUN yarn install --production
 => [5/5] COPY . .
 => exporting to image
 => => exporting layers
 => => writing image     sha256:91790c87bcb096a83c2bd4eb512bc8b134c757cda0bdee4038187f98148e2eda
 => => naming to docker.io/library/getting-started
```

먼저, 여러분은 빌드가 훨씬 더 빨랐다는 것을 알아야 한다! 또한 여러 단계에서 이전에 캐시된 계층을 사용하고
있음을 알 수 있다. 드디어 빌드 캐시를 사용해봤다. 이 이미지를 밀고 당기고 업데이트하는 속도도 훨씬
빨라진다.

# 다단계 빌드

이 튜토리얼에서는 자세히 설명하지 않지만, 다단계 빌드는 여러 단계를 사용하여 이미지를 생성하는 데 도움이
되는 매우 강력한 도구이다. 다음과 같은 이점이 있다:

- 빌드 시간 종속성과 런타임 종속성 분리
- 앱에서 실행해야 하는 항목만 전달하여 전체 이미지 크기 감소

### Maven/Tomcat 예제
Java 기반 응용 프로그램을 빌드할 때 소스 코드를 Java 바이트 코드로 컴파일하려면 JDK가 필요하다.
그러나 생산에는 JDK가 필요없다. 또한 Maven이나 Gradle과 같은 도구를 사용하여 앱을 구축할 수도 있다.
그것들은 또한 우리의 최종 이미지에 필요없다. 다단계 빌드 도움말.

```
# syntax=docker/dockerfile:1
FROM maven AS build
WORKDIR /app
COPY . .
RUN mvn package

FROM tomcat
COPY --from=build /app/target/file.war /usr/local/tomcat/webapps
```

이 예에서는 `build`라고 하는 한 단계를 사용하여 Maven을 사용하여 실제 Java 빌드를 수행한다. 두 번째
단계( `FROM tomcat`에서 시작)에서는 `build` 단계에서 파일을 복사한다. 최종 이미지는 생성되는 마지막
단계(이 단계는 `--target` 플래그를 사용하여 재정의할 수 있음)일 뿐이다.

### React 예제

React 애플리케이션을 빌드할 때 JS 코드(일반적으로 JSX), SAS 스타일시트 등을 정적 HTML, JS,
CSS로 컴파일하기 위한 Node 환경이 필요하다. 서버 측 렌더링을 수행하지 않으면 프로덕션 빌드에 노드
환경이 필요없다. 정적 nginx 컨테이너에 정적 리소스를 전달하는 것은 어떨까?

```
# syntax=docker/dockerfile:1
FROM node:18 AS build
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

여기서는 `node:18` 이미지를 사용하여 빌드(레이어 캐싱 동기화)를 수행한 다음 출력을 nginx 컨테이너에
복사한다.