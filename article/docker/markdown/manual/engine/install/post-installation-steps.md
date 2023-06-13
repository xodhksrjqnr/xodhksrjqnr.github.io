# Docker Engine에 대한 리눅스 사후 설치 단계 [#](https://docs.docker.com/engine/install/linux-postinstall/)

이러한 설치 후 절차(선택 사항)는 Linux 호스트 시스템이 Docker와 더 잘 작동하도록 구성하는 방법을
보여준다.

## Docker를 루트가 아닌 사용자로 관리

Docker 데몬은 TCP 포트가 아닌 Unix 소켓에 바인딩된다. 기본적으로 유닉스 소켓을 소유한 것은 루트
사용자이며, 다른 사용자는 `sudo`를 통해서만 액세스할 수 있다. Docker 데몬은 항상 루트 사용자로
실행된다.

Docker 명령 앞에 `sudo`를 추가하지 않으려면 Docker라는 유닉스 그룹을 만들고 여기에 사용자를 추가해야
한다. Docker 데몬이 시작되면 Docker 그룹의 구성원이 액세스할 수 있는 유닉스 소켓을 생성한다. 일부
리눅스 배포판에서는 패키지 관리자를 사용하여 Docker Engine을 설치할 때 시스템이 자동으로 이 그룹을
생성한다. 이 경우 그룹을 수동으로 만들 필요가 없다.

> Docker 그룹은 루트 수준 권한을 사용자에게 부여한다. 이것이 시스템의 보안에 미치는 영향에 대한 자세한
> 내용은 [Docker Daemon Attack Surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)를
> 참조하자.

> 루트 권한 없이 Docker를 실행하려면 Docker 데몬을 루트가 아닌 사용자로 실행([루트리스 모드](https://docs.docker.com/engine/security/rootless/))을
> 참조하자.

Docker 그룹을 만들고 사용자를 추가하려면 다음과 같이 하십시오:

1. docker 그룹을 만듭니다.

```
$ sudo groupadd docker
```

2. 사용자를 Docker 그룹에 추가한다.

```
$ sudo usermod -aG docker $USER
```

3. 로그아웃했다가 다시 로그인하여 그룹 구성원 자격을 재평가한다.

> 가상 시스템에서 Linux를 실행하는 경우 변경 내용을 적용하려면 가상 시스템을 다시 시작해야 할 수 있다.

다음 명령을 실행하여 그룹에 대한 변경 사항을 활성화할 수도 있다:

```
$ newgrp docker
```

4. sudo 없이 도커 명령을 실행할 수 있는지 확인한다.

```
$ docker run hello-world
```

이 명령은 테스트 이미지를 다운로드하여 컨테이너에서 실행한다. 컨테이너가 실행되면 메시지가 인쇄되고 종료된다.

사용자를 Docker 그룹에 추가하기 전에 `sudo`를 사용하여 Docker CLI 명령을 처음 실행한 경우 다음
오류가 표시될 수 있다:

```
WARNING: Error loading config file: /home/user/.docker/config.json -
stat /home/user/.docker/config.json: permission denied
```

이 오류는 이전에 `sudo` 명령을 사용했기 때문에 `~/.docker/` 디렉터리에 대한 권한 설정이 잘못되었음을
나타낸다.

이 문제를 해결하려면 다음 명령을 사용하여 `~/.docker/` 디렉토리(자동으로 재생성되지만 사용자 지정 설정이
손실됨)를 제거하거나 소유권 및 사용 권한을 변경한다:

```
$ sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
$ sudo chmod g+rwx "$HOME/.docker" -R
```

## systemd로 부팅할 때 시작하도록 Docker 구성

대부분의 현대 리눅스 배포판은 systemd를 사용하여 시스템 부팅 시 시작되는 서비스를 관리한다. Debian 및
Ubuntu에서 Docker 서비스는 기본적으로 부팅 시 시작된다. systemd를 사용하여 다른 리눅스 배포판에서
Docker 및 containerd를 부팅할 때 자동으로 시작하려면 다음 명령을 실행한다:

```
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

이 동작을 중지하려면 대신 `disable`를 사용하자.

```
$ sudo systemctl disable docker.service
$ sudo systemctl disable containerd.service
```

HTTP 프록시를 추가하거나 Docker 런타임 파일에 대해 다른 디렉터리 또는 파티션을 설정하거나 다른 사용자
지정을 수행해야 하는 경우 systemd [Docker 데몬 옵션 사용자 지정](https://docs.docker.com/config/daemon/systemd/)을
참조하자.

## 기본 로깅 드라이버 구성

Docker는 호스트에서 실행되는 모든 컨테이너에서 로그 데이터를 수집하고 볼 수 있는 로깅 드라이버를
제공한다. 기본 로깅 드라이버인 `json-file`은 호스트 파일 시스템의 JSON 형식 파일에 로그 데이터를
쓴다. 시간이 지남에 따라 이러한 로그 파일의 크기가 확장되어 디스크 리소스가 고갈될 수 있다.

로그 데이터에 디스크를 과도하게 사용하는 문제를 방지하려면 다음 옵션 중 하나를 고려하자:

- 로그 순환을 설정하도록 json-file 로깅 드라이버를 구성한다.
- 기본적으로 로그 순환을 수행하는 "로컬" 로그 드라이버와 같은 대체 로그 드라이버를 사용한다.
- 로그를 원격 로깅 애그리게이터로 보내는 로깅 드라이버를 사용한다.