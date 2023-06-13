# Java 이미지 구축

## 학습을 위한 전제 조건

- 기본적인 Docker 개념을 이해하고 있어야 한다.
- Dockerfile 형식에 대해 이해하고 있어야 한다.
- 빌드킷(Docker 사용자를 위한 기본 빌더, Docker Desktop을 설치했다면 이미 설치된 상태)이 설치되어
있어야한다.

## 필요사항

- Docker가 로컬에서 실행 중이어야 한다.
- Git 가입
- IDE 또는 텍스트 편집기 필요 (Intellij Community Edition 사용 추천)

## 샘플

해당 챕터에서 사용할 샘플 애플리케이션을 로컬에 복제할 필요가 있다. 다음과 명령을 실행하여 repo를 복제하자.
복제 후에는 복제된 디렉토리로 이동한다.

```
git clone https://github.com/spring-projects/spring-petclinic.git
cd spring-petclinic
```

## Dockerfile 만들기

먼저 해당 애플리케이션을 빌드하기 위해 JDK가 포함된 Eclipse Termrin을 추가한다.

```
# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk-jammy
```

작업 디렉토리를 설정하여 Docker의 모든 후속 명령의 기본 위치로 적용한다. 이 경우 작업 디렉토리를 기반으로
상대 경로를 사용할 수 있다.

```
WORKDIR /app
```

