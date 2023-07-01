# GitHub Actions 이해 [#](https://docs.github.com/ko/github-ae@latest/actions/learn-github-actions/understanding-github-actions)

## 개요

GitHub Actions는 빌드, 테스트 및 구현 파이프라인을 자동화할 수 있는 CI/CD(Continuous Integration and Continuous Delivery) 플랫폼이다. 리포지토리에 대한 모든`pull request`를 빌드하고 테스트하는 workflow를 생성하거나 프로덕션에 병합된 `pull requests`를 배포할 수 있다.

GitHub Actions는 단순히 DevOps를 넘어 리포지토리에서 다른 이벤트가 발생할 때 workflow를 실행할 수 있도록 지원한다. 예를 들어, workflow를 실행하여 다른 사용자가 리포지토리에 새 이슈를 생성할 때마다 적절한 레이블을 자동으로 추가할 수 있다.

엔터프라이즈용 workflow를 실행하려면 고유한 Linux, 윈도우즈 또는 macOS 가상 시스템을 호스팅해야 한다. 자체 호스팅된 러너는 물리적, 가상, 컨테이너, 사내 또는 클라우드일 수 있다.

엔터프라이즈용 GitHub Actions를 소개하는 방법에 대한 자세한 내용은 "[엔터프라이즈용 GitHub Actions 소개](https://docs.github.com/ko/github-ae@latest/admin/github-actions/getting-started-with-github-actions-for-your-enterprise/introducing-github-actions-to-your-enterprise)"를 참조하자.

## GitHub Actions의 구성 요소

`pull request`가 열리거나 이슈가 생성되는 등의 이벤트가 리포지토리에 발생할 때 트리거되도록 GitHub Actions workflow를 구성할 수 있다. workflow에는 순차적으로 또는 병렬로 실행할 수 있는 하나 이상의 작업이 포함되어 있다. 각 작업은 자체 가상 시스템 실행자 내부 또는 컨테이너 내부에서 실행되며 사용자가 정의한 스크립트를 실행하거나 작업을 실행하는 하나 이상의 단계가 있으며, 이는 workflow를 단순화할 수 있는 재사용 가능한 확장이다.

![](https://docs.github.com/assets/cb-25535/mw-1440/images/help/actions/overview-actions-simple.webp)

### workflows

workflow는 하나 이상의 작업을 실행하는 구성 가능한 자동 프로세스이다. workflow는 리포지토리에 체크인된 YAML 파일에 의해 정의되며 리포지토리의 이벤트에 의해 트리거될 때 실행되거나 수동으로 또는 정의된 일정에 따라 트리거될 수 있다.

workflow는 리포지토리의 `.github/workflows` 디렉토리에 정의되며, 리포지토리에는 각각 다른 태스크 집합을 수행할 수 있는 여러 workflow가 있을 수 있다. 예를 들어, 꺼내기 요청을 작성하고 테스트하는 workflow가 하나 있고, 릴리스가 생성될 때마다 응용 프로그램을 배포하는 workflow가 하나 있으며, 다른 사용자가 새 이슈를 열 때마다 레이블을 추가하는 workflow가 하나 더 있을 수 있다.

다른 workflow 내의 workflow를 참조할 수 있다. 자세한 내용은 "[workflow 재사용](https://docs.github.com/ko/github-ae@latest/actions/using-workflows/reusing-workflows)"을 참조하자."

workflow에 대한 자세한 내용은 "[workflow 사용](https://docs.github.com/ko/github-ae@latest/actions/using-workflows)"을 참조하자.

### events

event는 리포지토리에서 workflow 실행을 트리거하는 특정 활동이다. 예를 들어, 누군가가 `pull request`를 만들거나, 이슈를 열거나, 리포지토리에 커밋을 푸시할 때 GitHub에서 활동을 시작할 수 있다. [REST API](https://docs.github.com/en/github-ae@latest/rest/repos#create-a-repository-dispatch-event)에 게시하거나 수동으로 workflow를 트리거하여 예약에 따라 실행할 수도 있다.

workflow를 트리거하는 데 사용할 수 있는 event의 전체 목록은 workflow를 트리거하는 [event](https://docs.github.com/en/github-ae@latest/actions/using-workflows/events-that-trigger-workflows)를 참조하자.

### jobs

job은 동일한 runner에서 실행되는 workflow의 단계 집합이다. 각 단계는 실행될 셸 스크립트이거나 실행될 작업이다. 단계는 순서대로 실행되며 서로 종속된다. 각 단계는 동일한 runner에서 실행되므로 한 단계에서 다른 단계로 데이터를 공유할 수 있다. 예를 들어, 응용 프로그램을 빌드하는 단계와 빌드한 응용 프로그램을 테스트하는 단계를 수행할 수 있다.

다른 job과의 job 종속성을 구성할 수 있다. 기본적으로 job에는 종속성이 없으며 서로 병렬로 실행된다. job이 다른 job에 종속되면 종속된 job이 실행되기 전에 완료될 때까지 기다린다. 예를 들어 종속성이 없는 여러 아키텍처에 대한 여러 빌드 job과 해당 job에 종속된 패키징 job이 있을 수 있다. 빌드 job이 병렬로 실행되고, 모든 job이 성공적으로 완료되면 패키징 job이 실행된다.

job에 대한 자세한 내용은 "[job 사용](https://docs.github.com/en/github-ae@latest/actions/using-jobs)"을 참조하자.

### actions

action은 복잡하지만 자주 반복되는 작터을 수행하는 GitHub Actions 플랫폼용 사용자 지정 애플리케이션이다. action을 사용하여 workflow 파일에 기록하는 반복 코드의 양을 줄일 수 있다. action을 통해 GitHub에서 Git 리포지토리를 가져오거나 빌드 환경에 적합한 툴체인을 설정하거나 클라우드 공급자에 대한 인증을 설정할 수 있다.

직접 action을 작성하거나 GitHub Marketplace의 workflow에서 사용할 action을 찾을 수 있다.

action을 공개적으로 게시하지 않고 기업 전체에서 action을 공유하려면 action을 내부 리포지토리에 저장한 다음 동일한 조직 또는 기업의 모든 조직이 소유한 다른 리포지토리의 GitHub Actions workflow에 액세스할 수 있도록 리포지토리를 구성할 수 있다. 자세한 내용은 "[기업과 수행 및 workflow 공유](https://docs.github.com/ko/github-ae@latest/actions/creating-actions)"를 참조하자."

자세한 내용은 "[Creating actions](https://docs.github.com/en/github-ae@latest/actions/creating-actions)"을 참조하자.

### runners

runner는 workflow가 트리거될 때 workflow를 실행하는 서버이다. 각 runner는 한 번에 하나의 작업을 실행할 수 있다. GitHub AE를 위해 자신의 runner를 호스트해야 한다. 자세한 내용은 "[자신의 주자 호스팅](https://docs.github.com/en/github-ae@latest/actions/hosting-your-own-runners)"을 참조하자.

## 예제 workflow 생성

GitHub Actions는 YAML 구문을 사용하여 workflow를 정의한다. 각 workflow는 코드 리포지토리의 `.github/workflows` 디렉토리에 별도의 YAML 파일로 저장된다.

코드를 푸시할 때마다 일련의 명령을 자동으로 트리거하는 예제 workflow를 리포지토리에 만들 수 있다. 이 workflow에서 GitHub Actions는 푸시된 코드를 체크아웃하고 Bats 테스트 프레임워크를 설치한 후 Bats 버전인 `bats -v`를 출력하는 기본 명령을 실행한다.

1. 리포지토리에서 workflow 파일을 저장할 `.github/workflows/` 디렉터리를 생성한다.

2. `.github/workflows/` 디렉토리에서 `learn-github-actions.yml`라는 새 파일을 만들고 다음 코드를 추가한다.

```yaml
name: learn-github-actions
on: [push]
jobs:
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '14'
      - run: npm install -g bats
      - run: bats -v
```

3. 이러한 변경 사항을 커밋하고 GitHub 리포지토리에 푸시한다.

이제 새 GitHub Actions workflow 파일이 리포지토리에 설치되어 다른 사용자가 리포지토리를 변경할 때마다 자동으로 실행된다. workflow의 실행 내역에 대한 자세한 내용을 보려면 이후 나오는 "workflow 실행에 대한 활동 보기" 파트를 참조하자.

## workflow 파일 이해

YAML 구문이 workflow 파일을 만드는 데 사용되는 방법을 이해하는 데 도움이 되도록 이 절에서는 소개의 각 줄에 대해 설명한다:

| 코드                                                           | 설명                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ```name: learn-github-actions```                             | 선택사항 - GitHub 리포지토리의 "Actions" 탭에 나타나는 workflow의 이름이다.                                                                                                                                                                                                                                                                                                                              |
| ```on: [push]```                                             | 이 workflow의 트리거를 지정한다. 이 예제에서는 푸시 이벤트를 사용하므로 다른 사용자가 리포지토리 변경을 푸시하거나 pull request를 병합할 때마다 workflow 실행이 트리거된다. 이는 모든 분기에 대한 푸시에 의해 트리거된다. 특정 분기, 경로 또는 태그에 대한 푸시에서만 실행되는 구문의 예는 "[GitHub 작업에 대한 workflow 구문](https://docs.github.com/en/github-ae@latest/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)"을 참조하자. |
| ```jobs:```                                                  | `learn-github-actions` workflow에서 실행되는 모든 작업을 그룹화한다.                                                                                                                                                                                                                                                                                                                                |
| ```check-bats-version:```                                    | 이름이 `check-bats-version`인 작업을 정의한다. 하위 키는 작업의 속성을 정의한다.                                                                                                                                                                                                                                                                                                                             |
| ```runs-on: ubuntu-latest```                                 | Ubuntu 리눅스 실행기의 최신 버전에서 실행할 작업을 구성한다. 즉, GitHub에서 호스팅하는 새 가상 시스템에서 작업이 실행된다. 다른 실행자를 사용하는 구문 예제는 "[GitHub 작업에 대한 workflow 구문](https://docs.github.com/en/github-ae@latest/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idruns-on)"을 참조하자.                                                                                                                     |
| ```steps:```                                                 | `check-bats-version` 작업에서 실행되는 모든 단계를 함께 그룹화한다. 이 섹션 아래에 중첩된 각 항목은 별도의 작업 또는 셸 스크립트이다.                                                                                                                                                                                                                                                                                              |
| ```- uses: actions/checkout@v3```                            | `uses` 키워드는 이 단계가 `actions/checkout@v3` 작업을 실행하도록 지정한다. 이것은 리포지토리를 러너에 체크아웃하는 작업으로, 코드(예: 빌드 및 테스트 도구)에 대해 스크립트 또는 기타 작업을 실행할 수 있다. workflow가 리포지토리 코드에 대해 실행될 때마다 체크아웃 작업을 사용해야 한다.                                                                                                                                                                                                |
| ```- uses: actions/setup-node@v3 with: node-version: '14'``` | 이 단계에서는 `actions/setup-node@v3` 작업을 사용하여 지정된 버전의 Node.js(이 예에서는 v14 사용)를 설치한다. 이렇게 하면 `node`와 `npm` 명령이 모두 `PATH`에 저장된다.                                                                                                                                                                                                                                                            |
| ```- run: npm install -g bats```                             | `run` 키워드는 runner에서 명령을 실행하도록 작업에 지시한다. 이 경우 `npm`을 사용하여 `bats` 소프트웨어 테스트 패키지를 설치한다.                                                                                                                                                                                                                                                                                                |
| ```- run: bats -v```                                         | 마지막으로 소프트웨어 버전을 출력하는 매개 변수를 사용하여 `bats` 명령을 실행한다.                                                                                                                                                                                                                                                                                                                                   |

### workflow 파일 시각화

이 다이어그램에서는 방금 생성한 workflow 파일과 GitHub Actions 구성 요소가 계층 구조로 구성되는 방법을 볼 수 있다. 각 단계는 단일 작업 또는 셸 스크립트를 실행한다. 1단계와 2단계는 작업을 실행하고 3단계와 4단계는 셸 스크립트를 실행한다. workflow에 대한 추가적인 미리 작성된 action을 찾으려면 "[action 찾기 및 사용자 정의](https://docs.github.com/en/github-ae@latest/actions/learn-github-actions/finding-and-customizing-actions)"를 참조하자.

![](https://docs.github.com/assets/cb-33882/mw-1440/images/help/actions/overview-actions-event.webp)

## workflow 실행에 대한 활동 보기

workflow가 트리거되면 workflow를 실행하는 workflow 실행이 생성된다. workflow 실행이 시작되면 실행 진행률의 시각화 그래프를 보고 GitHub에서 각 단계의 활동을 볼 수 있다.

1. enterprise에서 리포지토리의 기본 페이지로 이동한다.

2. 리포지토리 이름에서 Actions를 클릭한다.

![](https://docs.github.com/assets/cb-21779/mw-1440/images/help/repository/actions-tab.webp)

3. 왼쪽 사이드바에서 보려는 workflow를 누른다.

![](https://docs.github.com/assets/cb-40551/mw-1440/images/help/actions/superlinter-workflow-sidebar.webp)

4. workflow 실행 목록에서 실행 이름을 눌러 workflow 실행 요약을 확인한다.

5. 왼쪽 사이드바 또는 시각화 그래프에서 보려는 작업을 클릭한다.

6. 단계의 결과를 보려면 단계를 클릭한다.