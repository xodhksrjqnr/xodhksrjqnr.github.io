# GitHub Actions 이해

## 개요

GitHub Actions는 CI/CD(Continuous Integration and Continuous Delivery) 플랫폼이다. CI/CD란 `애플리케이션 개발 단계를 자동화하여 애플리케이션을 더욱 짧은 주기로 고객에게 제공하는 방법`으로 GitHub Actions는 workflow를 이용해 이를 수행한다.

엔터프라이즈용 GitHub Actions는 [여기](https://docs.github.com/ko/github-ae@latest/admin/github-actions/getting-started-with-github-actions-for-your-enterprise/introducing-github-actions-to-your-enterprise)서 확인하자.

## 구성 요소

`pull request` 등의 이벤트가 리포지토리에서 발생할 때 트리거가 되도록 workflow를 구성할 수 있다. workflow와 workflow를 이루는 구성 요소에 대해 자세히 알아보자.

![](https://docs.github.com/assets/cb-25535/mw-1440/images/help/actions/overview-actions-simple.webp)

### workflows

- 하나 이상의 job을 실행하는 구성 가능한 자동 프로세스
- 리포지터리에 체크인된 YAML 파일에 의해 정의 (`.github/workflows` 디렉토리에 정의)
- 리포지터리의 이벤트에 발생 or 수동 or 정의된 일정에 따라 workflow 실행이 트리거
- 하나의 리포지토리에는 각각 다른 태스크 집합을 수행하는 여러 workflow가 존재 가능
- [workflow 재사용](https://docs.github.com/ko/github-ae@latest/actions/using-workflows/reusing-workflows) 가능
- 더 자세한 내용은 [여기](https://docs.github.com/ko/github-ae@latest/actions/using-workflows)

### events

- workflow 실행을 트리거하는 특정 활동 (`pull request`, `issue 오픈`, `commit push` 등)
- 더 자세한 내용은 [여기](https://docs.github.com/ko/github-ae@latest/actions/using-workflows/events-that-trigger-workflows)

### jobs

- 동일한 runner에서 실행되는 workflow의 단계 집합
- 각 단계는 실행될 셸 스크립트 or action을 의미
- 단계는 순차적으로 진행 및 서로 종속
- 한 단계에서 다른 단계로 데이터 공유 가능 (예: step1. 빌드 -> step2. 빌드한 프로그램 테스트)
- 기본적으로 job은 서로 병렬로 실행되지만 job 사이의 종속성 구성 가능(예: job이 특정 job이 끝날 때까지 대기)
- 자체 가상 시스템 실행자 내부 또는 컨테이너 내부에서 실행
- 더 자세한 내용은 [여기](https://docs.github.com/ko/github-ae@latest/actions/using-jobs)

### actions

- 자주 반복되는 작업을 수행하는 Github Actions 플랫폼용 사용자 지정 애플리케이션
- workflow 파일의 반복 코드를 줄임
- 빌드 환경에 적합한 툴체인 설정 or 클라우드 공급자 인증 설정 등 가능
- 직접 작성 or Github Marketplace에서 검색
- 더 자세한 내용은 [여기](https://docs.github.com/ko/github-ae@latest/actions/creating-actions)

### runners

- workflow를 실행하는 서버
- 한 번에 하나의 작업을 실행
- 더 자세한 내용은 [여기](https://docs.github.com/ko/github-ae@latest/actions/hosting-your-own-runners)

## 예제

목표 : 푸시된 코드를 체크아웃하고 Bats 테스트 프레임워크를 설치 후 Bats 버전인 `bats -v`를 출력

1. 리포지토리에 `.github/workflows/` 디렉토리 생성한다.
2. 생성한 디렉토리에 `learn-github-actions.yml` 파일을 생성 후 다음 코드를 추가한다.

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

<details>
<summary>‣ 코드 분석</summary>

```yaml
# name: [name] - 선택사항으로 "Actions" 탭에 나타나는 workflow의 이름
name: learn-github-actions
# on: [command] - workflow의 트리거 지정
on: [push]
# jobs: - 해당 workflow에서 실행되는 모든 작업을 그룹화
jobs:
  # check-bats-version: - 작업의 이름 정의
  check-bats-version:
    # runs-on: - 작업을 처리할 환경 정의 (작업은 Github에서 호스팅하는 새 가상 시스템에서 실행됨)
    runs-on: ubuntu-latest
    # steps: - 현재 작업에서 실행되는 모든 단계를 그룹화
    steps:
      # uses: actions/checkout@v3 - uses 키워드는 이 단계가 actions/checkout 작업의 v3를
      # 실행하도록 지정한다. 리포지토리를 runner에 체크아웃하는 작업으로 리포지토리에 저장된 코드에 대해
      # 스크립트 또는 기타 작업을 실행할 수 있게 된다. workflow가 리포지토리 코드에 대해 실행될 때마다
      # 체크아웃 작업을 사용해야 한다.
      - uses: actions/checkout@v3
      # uses: actions/setup-node@v3
      # with:
      #   node-version: '14'
      # 위와 비슷한 개념으로 Node.js v14를 설치한다. 이 경우 node, npm 명령이 모두 PATH에 저장된다.
      - uses: actions/setup-node@v3
        with:
          node-version: '14'
      # run: npm install -g bats - run 키워드는 runner에서 명령을 실행하도록 작업을 지시한다.
      # 이 경우 npm을 사용하여 bats 소프트웨어 테스트 패키지를 설치한다.
      - run: npm install -g bats
      # run: bats -v - 설치된 bats의 버전을 확인한다.
      - run: bats -v
```
</details>

3. 레포지토리에 변경 사항을 `commit`하고 `push`한다.

### workflow 파일 시각화

위에서 적성한 workflow 파일을 다이어그램으로 변화하면 다음과 같다. `uses:`에서 사용한 `action`에 대해 더 자세히 알고싶다면 [여기](https://docs.github.com/ko/github-ae@latest/actions/learn-github-actions/finding-and-customizing-actions)서 확인하자.

![](https://docs.github.com/assets/cb-33882/mw-1440/images/help/actions/overview-actions-event.webp)

## workflow 실행에 대한 활동 보기

1. workflow가 저장된 리포지토리 기본 페이지에서 `Actions`를 클릭한다.

![](https://docs.github.com/assets/cb-21779/mw-1440/images/help/repository/actions-tab.webp)

2. 왼쪽 사이드바에서 보려는 workflow를 누른다.

<img width="80%" alt="스크린샷 2023-06-06 오후 11 34 21" src="https://github.com/xodhksrjqnr/test/assets/48250370/c6e3e30a-7caa-41c0-94b1-e16ec9c78609">

3. workflow 실행 목록에서 실행명을 눌러 workflow 실행 요약을 확인한다.

4. 왼쪽 사이드바 또는 시각화 그래프에서 보려는 작업을 클릭한다.

5. 단계의 결과를 보려면 단계를 클릭한다.

<img width="80%" alt="스크린샷 2023-06-06 오후 11 37 17" src="https://github.com/xodhksrjqnr/test/assets/48250370/f5125428-017f-4e24-a911-1dfa723ab283">