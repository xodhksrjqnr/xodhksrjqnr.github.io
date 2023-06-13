# 응용 프로그램에 대한 CI/CD 구성 [#](https://docs.docker.com/language/java/configure-ci-cd/)

## GitHub Actions 시작하기

이 자습서에서는 Docker 이미지를 빌드하고 이미지를 Docker 허브로 푸시하기 위해 Docker GitHub
Actions을 설정 및 사용하는 과정을 안내한다. 다음 단계를 완료한다:

- GitHub에 새 리포지토리를 만든다.
- GitHub Actions 워크플로우를 정의한다.
- 워크플로를 실행한다.

이 튜토리얼을 따르려면 Docker ID와 GitHub 계정이 필요하다.

## 1단계: 리포지토리 만들기
GitHub 저장소를 만들고 Docker 허브 암호를 구성한다.

이 [템플릿 리포지토리](https://github.com/dvdksn/clockbox/generate)를 사용하여 새 GitHub
리포지토리를 만든다.

1. 리포지토리에는 간단한 Dockerfile이 들어 있으며, 그 외에는 아무것도 없다. 원하는 경우 작동 중인
Dockerfile이 들어 있는 다른 리포지토리를 사용하자.

2. 저장소 Setting을 열고 [Secrets and variables] > [Actions]으로 이동한다.

3. `DOCKERHUB_USERNAME`이라는 이름의 새 secret과 `DOCKER ID`를 값으로 생성한다.

4. Docker 허브에 대한 새 개인 액세스 토큰(PAT)을 만든다. 이 토큰의 이름을 `clockboxci`로 지정할
수 있다.

5. GitHub 저장소에 `DOCKERHUB_TOKEN`이라는 이름의 두 번째 secret으로 PAT를 추가한다.

저장소가 생성되고 암호가 구성되므로 이제 실행할 준비가 되었다!

## 2단계: 워크플로 설정
이미지를 빌드하고 Docker 허브로 푸시하기 위한 GitHub Actions 워크플로우를 설정한다.

1. GitHub의 저장소로 이동한 다음 Actions 탭을 선택한다.
2. 워크플로우 설정을 직접 선택한다.

그러면 저장소에 새 GitHub 작업 워크플로우 파일을 만드는 페이지가 기본적으로
`.github/workflows/main.yml`가 된다.

3. Editor 창에서 다음과 같은 YAML 구성을 복사하여 붙여넣는다.

```
name: ci

on:
  push:
    branches:
      - "main"

jobs:
  build:
    runs-on: ubuntu-latest
```

- `name` : 이 워크플로의 이름이다.
- `on.push.branches` : 이 워크플로는 목록의 분기에 대한 모든 푸시 이벤트에서 실행되도록 지정한다.
- `jobs` : 작업 ID(`build`)를 생성하고 작업을 실행할 시스템 유형을 선언한다.

여기서 사용되는 YAML 구문에 대한 자세한 내용은 GitHub 작업에 대한 [워크플로우 구문](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)을
참조하자.

## 3단계: 워크플로 단계 정의

이제 핵심은 실행할 단계와 실행 순서이다.

```
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v3
      -
        name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      -
        name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      -
        name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/clockbox:latest
```

이전 YAML 스니펫에는 다음과 같은 일련의 단계가 포함되어 있다:

1. 빌드 시스템에서 리포지토리를 체크아웃한다.
2. Docker 로그인 작업과 Docker 허브 자격 증명을 사용하여 Docker 허브에 로그인한다.
3. Docker Setup Buildx 액션을 사용하여 BuildKit Builder 인스턴스를 만든다.
4. 컨테이너 이미지를 빌드하고 빌드 및 푸시 Docker 이미지를 사용하여 Docker 허브 저장소로 푸시한다.

`with` 키에는 단계를 구성하는 여러 입력 파라미터가 나열된다:

- `context` : 빌드 컨텍스트이다.
- `file` : Docker 파일의 파일 경로이다.
- `push` : 이미지를 빌드한 후 레지스트리에 업로드하는 작업을 알려준다.
- `tags` : 이미지를 푸시할 위치를 지정하는 태그이다.

다음 단계를 워크플로 파일에 추가한다. 전체 워크플로 구성은 다음과 같다:

```
name: ci

on:
  push:
    branches:
      - "main"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v3
      -
        name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      -
        name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      -
        name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/clockbox:latest
```

## 워크플로 실행

워크플로 파일을 저장하고 작업을 실행한다.

1. `Commit changes...`를 선택한다... 변경 사항을 main 분기에 푸시한다.
커밋을 누르면 워크플로가 자동으로 시작된다.

2. Actions 탭으로 이동한다. 워크플로가 표시된다. 워크플로우를 선택하면 모든 단계의 내역이 표시된다.

3. 워크플로우가 완료되면 Docker Hub의 리포지토리로 이동한다. 목록에 새 리포지토리가 표시되면 GitHub
Actions가 이미지를 Docker Hub로 성공적으로 푸시했음을 의미한다!