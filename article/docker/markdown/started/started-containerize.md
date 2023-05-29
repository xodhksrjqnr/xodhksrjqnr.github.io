## 애플리케이션 컨테이너화 [#](https://docs.docker.com/get-started/02_our_app/)

이 안내서의 나머지 부분에서는 Node.js에서 실행되는 간단한 작업관리 목록 관리자와 함께 작업한다.
Node.js에 익숙하지 않은 경우에는 걱정할 필요없다. 이 안내서에는 JavaScript에 대한 이전의 경험이
필요하지 않다.

이 안내서를 완료하려면 다음이 필요하다:

- Docker가 로컬에서 실행 중이어야 한다. 지침에 따라 [Docker](https://docs.docker.com/get-docker/)를
  다운로드하고 설치하자.
- Git 가입
- 파일을 편집하는 IDE 또는 텍스트 편집기가 필요하다. Docker는 Visual Studio Code를 사용할 것을
  권장한다.
- 컨테이너 및 이미지에 대한 개념적 이해.

## 소스 코드 가져오기

응용 프로그램을 실행하려면 먼저 응용 프로그램 소스 코드를 컴퓨터로 가져와야 한다.

1. 다음 명령을 사용하여 시작 저장소를 복제하자:

```bash
git clone https://github.com/docker/getting-started.git
```

2. 복제된 리포지토리의 내용을 보자. `getting-started/app` 디렉터리 안에 `package.json`과 두
   개의 서브 디렉터리(`src`, `spec`)이 있을 것이다.

![](https://docs.docker.com/get-started/images/ide-screenshot.png)

## 컨테이너 이미지 빌드하기

컨테이너 이미지를 빌드하려면 Dockerfile을 사용해야 한다. Dockerfile은 명령 스크립트를 포함하는 파일
확장자가 없는 텍스트 기반 파일이다. Docker는 이 스크립트를 사용하여 컨테이너 이미지를 작성한다.

1. `package.json` 파일이 위치한 `app` 디렉터리 안에 Dockerfile이라는 이름의 파일을 생성하자. 아래
   명령을 사용하여 운영 체제에 따라 도커 파일을 만들 수 있다.

### Mac/Linux

```
cd /path/to/app
touch Dockerfile
```

## Windows

```
cd \path\to\app
type nul > Dockerfile
```

2. 텍스트 편집기 또는 코드 편집기를 사용하여 다음 내용을 Dockerfile에 추가하자:

```dockerfile
# syntax=docker/dockerfile:1
   
FROM node:18-alpine
WORKDIR /app
COPY ../../../../../../../.. .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```

3. 다음 명령을 사용하여 컨테이너 이미지를 빌드한다:

터미널에서 디렉토리를 `getting-started/app` 디렉토리로 변경한다. `/path/to/app`를
`getting-started/app` 디렉토리의 경로로 대체한다.

```
cd /path/to/app
docker build -t getting-started .
```

`docker build` 명령은 Dockerfile을 사용하여 새 컨테이너 이미지를 빌드한다. Docker가 "레이어"를
많이 다운로드한 것을 눈치챘을 것이다. 이는 사용자가 `node:18-alpine` 이미지에서 시작할 빌드를
지시했기 때문이다. 하지만, 당신의 컴퓨터에 그것이 없었기 때문에, Docker는 이미지를 다운로드했다.

Docker가 이미지를 다운로드한 후 Dockerfile의 지시사항이 응용프로그램에 복사되고 `yarn`을 사용하여
응용프로그램의 종속성을 설치한다. `CMD` 지시문은 이 이미지에서 컨테이너를 시작할 때 실행할 기본 명령을
지정한다.

마지막으로 `-t` 플래그는 이미지에 태그를 지정한다. 이것을 단순히 최종 이미지에 대한 사람이 읽을 수 있는
이름으로 생각한다. 이미지의 이름을 `getting-started`로 지정했으므로 컨테이너를 실행할 때 해당 이미지를
참조할 수 있다.

`docker build` 명령어 뒤에 있는 `.`은 Docker에게 현재 위치에서 `Dockerfile`을 찾아야 하는
것을 명시한다.

## 앱 컨테이너 실행하기

이제 이미지가 생겼으며 `docker run` 명령을 사용해 컨테이너에서 응용 프로그램을 실행할 수 있다.

1. `docker run` 명령을 사용하여 컨테이너를 시작하고 방금 만든 이미지의 이름을 지정하자:

```
docker run -dp 3000:3000 getting-started
```

`-d` 플래그를 사용하여 새 컨테이너를 백그라운드에서 "실행" 모드로 실행한다. 또한 `-p` 플래그를
사용하여 호스트의 포트 3000과 컨테이너의 포트 3000 간의 매핑을 생성할 수 있다. 포트 매핑이 없으면 응용
프로그램에 액세스할 수 없다.

2. 웹 브라우저를 열어 http://localhost:3000을 확인해보자.

![](https://docs.docker.com/get-started/images/todo-list-empty.png)

3. 한 두 가지 항목을 추가하여 예상대로 작동하는지 확인하자. 항목을 완료로 표시하고 제거할 수 있다.
   프런트 엔드가 백엔드에 항목을 성공적으로 저장하고 있다.

이 때 사용자가 작성한 몇 가지 항목으로 작업관리자를 실행해야 합니다.

컨테이너를 간단히 살펴보면 포트 `3000`에서 `getting-started` 이미지를 사용하는 컨테이너가 하나
이상 실행 중임을 알 수 있다. 컨테이너를 보려면 `CLI` 또는 `Docker Desktop`의 그래픽 인터페이스를
사용할 수 있다.

### CLI

```
docker ps
```