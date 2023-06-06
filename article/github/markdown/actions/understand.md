# GitHub Actions 이해 [#](https://docs.github.com/ko/github-ae@latest/actions/learn-github-actions/understanding-github-actions)

## 개요

GitHub Actions는 빌드, 테스트 및 구현 파이프라인을 자동화할 수 있는
CI/CD(Continuous Integration and Continuous Delivery) 플랫폼이다. 저장소에 대한 모든
`pull request`를 빌드하고 테스트하는 workflow를 생성하거나 프로덕션에 `merged pull requests`를
배포할 수 있다.

GitHub Actions는 단순히 DevOps를 넘어 저장소에서 다른 이벤트가 발생할 때 워크플로우를 실행할 수
있도록 지원한다. 예를 들어, workflow를 실행하여 다른 사용자가 리포지토리에 새 이슈를 생성할 때마다 적절한
레이블을 자동으로 추가할 수 있다.

엔터프라이즈용 workflow를 실행하려면 고유한 Linux, 윈도우즈 또는 macOS 가상 시스템을 호스팅해야 한다.
자체 호스팅된 러너는 물리적, 가상, 컨테이너, 사내 또는 클라우드일 수 있다.

기업에 GitHub Actions를 소개하는 방법에 대한 자세한 내용은 "[기업에 GitHub Actions 소개](https://docs.github.com/en/github-ae@latest/admin/github-actions/getting-started-with-github-actions-for-your-enterprise/introducing-github-actions-to-your-enterprise)"를
참조하자.

## GitHub Actions의 구성 요소

`pull request`가 열리거나 이슈가 생성되는 등의 이벤트가 저장소에 발생할 때 트리거되도록 GitHub
Actions workflow를 구성할 수 있다. workflow에는 순차적으로 또는 병렬로 실행할 수 있는 하나 이상의
작업이 포함되어 있다. 각 작업은 자체 가상 시스템 실행자 내부 또는 컨테이너 내부에서 실행되며 사용자가
정의한 스크립트를 실행하거나 작업을 실행하는 하나 이상의 단계가 있으며, 이는 workflow를 단순화할 수 있는
재사용 가능한 확장이다.

![](https://docs.github.com/assets/cb-25535/mw-1440/images/help/actions/overview-actions-simple.webp)

### workflows

workflow는 하나 이상의 작업을 실행하는 구성 가능한 자동 프로세스이다. workflow는 리포지토리에
체크인된 YAML 파일에 의해 정의되며 리포지토리의 이벤트에 의해 트리거될 때 실행되거나 수동으로 또는 정의된
일정에 따라 트리거될 수 있다.

workflow는 저장소의 `.github/workflows` 디렉토리에 정의되며, 리포지토리에는 각각 다른 태스크
집합을 수행할 수 있는 여러 workflow가 있을 수 있다. 예를 들어, 꺼내기 요청을 작성하고 테스트하는
workflow가 하나 있고, 릴리스가 생성될 때마다 응용 프로그램을 배포하는 workflow가 하나 있으며, 다른
사용자가 새 이슈를 열 때마다 레이블을 추가하는 workflow가 하나 더 있을 수 있다.

다른 workflow 내의 workflow를 참조할 수 있다. 자세한 내용은 "[workflow 재사용](https://docs.github.com/en/github-ae@latest/actions/using-workflows/reusing-workflows)"을
참조하자."

workflow에 대한 자세한 내용은 "[workflow 사용](https://docs.github.com/en/github-ae@latest/actions/using-workflows)"을
참조하자.

### events

event는 저장소에서 workflow 실행을 트리거하는 특정 활동이다. 예를 들어, 누군가가 `pull request`를
만들거나, 이슈를 열거나, 저장소에 커밋을 푸시할 때 GitHub에서 활동을 시작할 수 있다. [REST API](https://docs.github.com/en/github-ae@latest/rest/repos#create-a-repository-dispatch-event)에
게시하거나 수동으로 workflow를 트리거하여 예약에 따라 실행할 수도 있다.

workflow를 트리거하는 데 사용할 수 있는 event의 전체 목록은 workflow를 트리거하는 [event](https://docs.github.com/en/github-ae@latest/actions/using-workflows/events-that-trigger-workflows)를
참조하자.

### jobs

job은 동일한 runner에서 실행되는 워크플로의 단계 집합이다. 각 단계는 실행될 셸 스크립트이거나 실행될
작업이다. 단계는 순서대로 실행되며 서로 종속된다. 각 단계는 동일한 runner에서 실행되므로 한 단계에서 다른
단계로 데이터를 공유할 수 있다. 예를 들어, 응용 프로그램을 빌드하는 단계와 빌드한 응용프로그램을 테스트하는
단계를 수행할 수 있다.

다른 job과의 job 종속성을 구성할 수 있다. 기본적으로 job에는 종속성이 없으며 서로 병렬로 실행된다.
job이 다른 job에 종속되면 종속된 job이 실행되기 전에 완료될 때까지 기다린다. 예를 들어 종속성이 없는
여러 아키텍처에 대한 여러 빌드 job과 해당 job에 종속된 패키징 job이 있을 수 있다. 빌드 job이 병렬로
실행되고, 모든 job이 성공적으로 완료되면 패키징 job이 실행된다.

job에 대한 자세한 내용은 "[job 사용](https://docs.github.com/en/github-ae@latest/actions/using-jobs)"을
참조하자.

### actions

action은 복잡하지만 자주 반복되는 action을 수행하는 GitHub Actions 플랫폼용 사용자 지정
애플리케이션이다. action을 사용하여 workflow 파일에 기록하는 반복 코드의 양을 줄일 수 있다. action을
통해 GitHub에서 Git 저장소를 가져오거나 빌드 환경에 적합한 툴체인을 설정하거나 클라우드 공급자에 대한
인증을 설정할 수 있다.

직접 action을 작성하거나 GitHub Marketplace의 workflow에서 사용할 action을 찾을 수 있다.

action을 공개적으로 게시하지 않고 기업 전체에서 action을 공유하려면 action을 내부 저장소에 저장한
다음 동일한 조직 또는 기업의 모든 조직이 소유한 다른 리포지토리의 GitHub Actions workflow에
액세스할 수 있도록 저장소를 구성할 수 있다. 자세한 내용은 "[기업과 수행 및 워크플로우 공유](https://docs.github.com/en/github-ae@latest/actions/creating-actions/sharing-actions-and-workflows-with-your-enterprise)"를
참조하자."

자세한 내용은 "[Creating actions](https://docs.github.com/en/github-ae@latest/actions/creating-actions)"을
참조하자.

### runners

runner는 workflow가 트리거될 때 workflow를 실행하는 서버이다. 각 runner는 한 번에 하나의 작업을
실행할 수 있다. GitHub AE를 위해 자신의 runner를 호스트해야 한다. 자세한 내용은 "[자신의 주자 호스팅](https://docs.github.com/en/github-ae@latest/actions/hosting-your-own-runners)"을
참조하자.

