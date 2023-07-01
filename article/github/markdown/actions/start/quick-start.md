# GitHub Actions 빠른 시작 [#](https://docs.github.com/ko/github-ae@latest/actions/quickstart)

## 소개

GitHub Actions 워크플로우를 만들고 실행하려면 GitHub repository만 있으면 된다. 이 안내서에서는 GitHub Actions의 몇 가지 필수 기능을 보여주는 워크플로우를 추가한다.

다음 예제에서는 GitHub Actions 작업이 자동으로 트리거되는 방법, 작업이 실행되는 위치 및 저장소의 코드와 상호 작용하는 방법을 보여 준다.

## 첫 번째 워크플로우 만들기

1. GitHub의 리포지토리에 `.github/workflows` 디렉터리가 아직 없는 경우 이 디렉터리를 만든다.

2. `.github/workflows` 디렉토리에서 `github-actions-demo.yml`라는 이름의 파일을 생성한다.

3. 다음 YAML 내용을 `github-actions-demo.yml` 파일로 복사한다:

```
name: GitHub Actions Demo
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v3
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

4. 페이지 하단으로 스크롤하여 이 커밋에 대한 새 분기 만들기를 선택하고 꺼내기 요청을 시작한다. 그런 다음 꺼내기 요청을 만들려면 새 파일 제안을 클릭한다.

![](https://docs.github.com/assets/cb-67313/mw-1440/images/help/repository/actions-quickstart-commit-new-file.webp)

5. 워크플로 파일을 저장소의 분기에 커밋하면 push 이벤트가 트리거되고 워크플로가 실행됩니다.

## 워크플로 결과 보기

1. enterprise에서 저장소의 기본 페이지로 이동한다.

2. 리포지토리 이름에서 `Actions`를 클릭한다.

![](https://docs.github.com/assets/cb-21779/mw-1440/images/help/repository/actions-tab.webp)

3. 왼쪽 사이드바에서 표시할 워크플로(이 예제 "GitHub Actions Demo.")를 누른다.

![](https://docs.github.com/assets/cb-64036/mw-1440/images/help/repository/actions-quickstart-workflow-sidebar.webp)

4. 워크플로우 실행 목록에서 보려는 실행 이름을 클릭한다. 이 예에서는 "`USERNAME`이 GitHub Actions를 테스트하고 있다."

5. 워크플로 실행 페이지의 왼쪽 사이드바에 있는 Jobs에서 `Explore-GitHub-Actions` 작업을 누른다.

![](https://docs.github.com/assets/cb-53821/mw-1440/images/help/repository/actions-quickstart-job.webp)

6. 로그에는 각 단계가 처리된 방식이 표시된다. 단계를 확장하여 세부 정보를 본다.

![](https://docs.github.com/assets/cb-95213/mw-1440/images/help/repository/actions-quickstart-logs.webp)

예를 들어 저장소에 있는 파일 목록을 볼 수 있다:

![](https://docs.github.com/assets/cb-53979/mw-1440/images/help/repository/actions-quickstart-log-detail.webp)

방금 추가한 예제 워크플로우는 코드가 분기에 푸시될 때마다 트리거되며 GitHub Actions가 저장소의 내용과 함께 작동하는 방법을 보여준다. 자세한 자습서는 "[GitHub 수행 이해](https://docs.github.com/en/github-ae@latest/actions/learn-github-actions/understanding-github-actions)"를 참조하자.

## 추가 시작 워크플로우

GitHub은 사용자가 사용자 정의하여 자체적인 연속 통합 워크플로우를 만들 수 있는 사전 구성된 시작 워크플로우를 제공한다. GitHub AE는 코드를 분석하여 저장소에 유용할 수 있는 CI 시작 워크플로우를 보여준다. 예를 들어 저장소에 Node.js 코드가 있는 경우 Node.js 프로젝트에 대한 제안 사항이 표시된다. 시작 워크플로우를 사용하여 사용자 정의 워크플로우를 구축하거나 그대로 사용할 수 있다.

기업의 actions/starter-workflows 저장소에서 시작 워크플로우의 전체 목록을 찾아볼 수 있습니다.