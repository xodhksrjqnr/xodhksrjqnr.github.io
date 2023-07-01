# Ubuntu에 Docker Engine 설치 [#](https://docs.docker.com/engine/install/ubuntu/)

Ubuntu에서 Docker Engine을 시작하려면 필수 구성 요소를 충족하는지 확인한 다음 설치 단계를 따르자.

## 전제 조건

> ufw 또는 방화벽을 사용하여 방화벽 설정을 관리하는 경우 Docker를 사용하여 컨테이너 포트를 노출하면 이러한 포트는 방화벽 규칙을 무시한다. 자세한 내용은 [Docker 및 ufw](https://docs.docker.com/network/packet-filtering-firewalls/#docker-and-ufw)를 참조하자.

### OS 요구 사항

Docker Engine을 설치하려면 다음 Ubuntu 버전 중 하나의 64비트 버전이 필요하다:

- Ubuntu Lunar 23.04
- Ubuntu Kinetic 22.10
- Ubuntu Jammy 22.04 (LTS)
- Ubuntu Focal 20.04 (LTS)
- Ubuntu Bionic 18.04 (LTS)

Docker Engine은 x86_64(또는 amd64), armhf, arm64 및 s390x 아키텍처와 호환된다.

### 이전 버전 제거

Docker Engine을 설치하려면 먼저 충돌하는 패키지가 제거되었는지 확인해야 한다.

Distro 유지 관리자는 APT에서 Docker 패키지의 비공식 배포를 제공한다. Docker Engine 공식 버전을 설치하려면 먼저 이러한 패키지를 제거해야 한다.

제거할 비공식 패키지는 다음과 같다:

- docker.io
- docker-compose
- docker-doc
- podman-docker

또한 Docker Engine은 `containerd`와 `runc`에 의존한다. Docker Engine은 이러한 종속성을 `containerd.io`와 같은 하나의 번들로 제공한다. 이전에 `containerd` 또는 `runc`를 설치한 적이 있는 경우 Docker Engine과 함께 번들로 제공된 버전과 충돌하지 않도록 해당 버전을 제거한다.

다음 명령을 실행하여 충돌하는 모든 패키지를 제거한다:

```
$ for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

`apt-get`에서 이러한 패키지가 설치되지 않았다고 보고할 수 있다.

Docker를 제거해도 `/var/lib/docker/`에 저장된 이미지, 컨테이너, 볼륨 및 네트워크는 자동으로 제거되지 않는다. 새로 설치를 시작하고 기존 데이터를 정리하려면 이후 Docker Engine 제거 섹션을 참조하자.

## 설치 방법

Docker Engine은 필요에 따라 다양한 방법으로 설치할 수 있다:

- Docker Engine은 Linux용 Docker Desktop과 함께 제공된다. 이것이 시작하는 가장 쉽고 빠른 방법이다.
- Docker의 적절한 저장소에서 Docker Engine을 설정하고 설치한다.
- 수동으로 설치하고 업그레이드를 수동으로 관리한다.
- 사용자 편의 스크립트를 사용한다. 테스트 및 개발 환경에만 권장된다.

### 적절한 리포지토리를 사용하여 설치

새 호스트 시스템에 Docker Engine을 처음 설치하기 전에 Docker 저장소를 설정해야 한다. 그런 다음 리포지토리에서 Docker를 설치하고 업데이트할 수 있다.

### 리포지토리 설정

1. `apt`가 HTTPS를 통해 저장소를 사용할 수 있도록 `apt` 패키지 인덱스를 업데이트하고 패키지를 설치한다:

```
$ sudo apt-get update
$ sudo apt-get install ca-certificates curl gnupg
```

2. Docker의 공식 GPG 키 추가:

```
$ sudo install -m 0755 -d /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

3. 다음 명령을 사용하여 리포지토리를 설정한다:

```
$ echo \
"deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
"$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
$ sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

> Linux Mint와 같은 Ubuntu 파생 디스트리뷰터를 사용하는 경우 `VERSION_CODENAME` 대신 `UBUNTU_CODENAME`를 사용해야 할 수도 있다.

### Docker Engine 설치

1. `apt` 패키지 색인을 업데이트한다:

```
$ sudo apt-get update
```

2. Docker Engine, containerd 및 Docker Compose을 설치한다.

```
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. `hello-world` 이미지를 실행하여 Docker Engine이 성공적으로 설치되었는지 확인한다.

```
$ sudo docker run hello-world
```

이 명령은 테스트 이미지를 다운로드하여 컨테이너에서 실행한다. 컨테이너가 실행되면 확인 메시지가 인쇄되고 종료된다.

이제 Docker Engine을 성공적으로 설치하고 시작했다.

> 루트 없이 실행하려고 할 때 오류가 발생하는가? Docker 사용자 그룹이 있지만 사용자가 없으므로 Docker 명령을 실행하려면 `sudo`를 사용해야 한다. 권한이 없는 사용자가 Docker 명령 및 기타 선택적 구성 단계를 실행할 수 있도록 하려면 [Linux postinstall](https://xodhksrjqnr.github.io/article/docker/post/manual/engine/install/post-installation-steps.html)을 계속한다.