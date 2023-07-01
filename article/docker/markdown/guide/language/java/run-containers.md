# 이미지를 컨테이너로 실행

## 전제 조건
[자바 이미지 빌드]에서 Java 이미지를 빌드하는 단계를 수행한다.

## 개요

이전 모듈에서는 샘플 애플리케이션을 만든 다음 이미지를 만드는 데 사용하는 Dockerfile을 만들었다.`docker build` 명령을 사용하여 이미지를 생성했다. 이제 이미지가 생겼으니 해당 이미지를 실행하고 애플리케이션이 올바르게 실행되고 있는지 확인할 수 있다.

컨테이너는 일반적인 운영 체제 프로세스이다. 단, 이 프로세스는 분리되어 있으며 자체 파일 시스템, 자체 네트워킹 및 호스트에서 분리된 자체 프로세스 트리를 가지고 있다.

컨테이너 내부에서 이미지를 실행하려면 `docker run` 명령을 사용한다. `docker run` 명령에는 이미지의 이름인 하나의 매개 변수가 필요하다. 이미지를 시작하고 이미지가 올바르게 실행되고 있는지 확인한다. 터미널에서 다음 명령을 실행한다:

```
docker run java-docker
```

이 명령을 실행하면 명령 프롬프트로 돌아가지 않았다는 것을 알 수 있다. 이것은 우리의 애플리케이션이 REST 서버이고 컨테이너를 멈출 때까지 OS에 제어권을 다시 돌려주지 않고 들어오는 요청을 기다리는 루프에서 실행되기 때문이다.

새 터미널을 열고 `curl` 명령을 사용하여 서버에 `GET` 요청을 하겠다.

```
curl --request GET \
--url http://localhost:8080/actuator/health \
--header 'content-type: application/json'
curl: (7) Failed to connect to localhost port 8080: Connection refused
```

보시다시피 서버에 대한 연결이 거부되어 `curl` 명령에 실패했다. 즉, 포트 8080의 로컬 호스트에 연결할 수 없다. 이는 컨테이너가 네트워킹을 포함하여 독립적으로 실행되고 있기 때문에 예상되는 문제이다. 컨테이너를 중지하고 로컬 네트워크에 게시된 포트 8080으로 다시 시작하자.

컨테이너를 중지하려면 `ctrl-c`를 누르자. 터미널 프롬프트로 돌아간다.

컨테이너의 포트를 게시하려면 `docker run` 명령에 `--publish` 플래그(약칭 `-p`)를 사용한다. `--publish` 명령의 형식은 `[host port]:[container port]`이다. 따라서 컨테이너 내부의 포트 8000을 컨테이너 외부의 포트 8080에 노출시키려면 `8080:8000` 플래그에 `--publish`를 전달해야 한다.

컨테이너를 시작하고 호스트의 포트 8080에 포트 8080을 표시한다.

```
docker run --publish 8080:8080 java-docker
```

이제 위에서 `curl` 명령을 다시 실행하자.

```
curl --request GET \
--url http://localhost:8080/actuator/health \
--header 'content-type: application/json'
{"status":"UP"}
```

성공했다! 포트 8080에서 컨테이너 내부에서 실행 중인 애플리케이션에 연결할 수 있었다.

이제 `ctrl-c`를 눌러 컨테이너를 중지하자.

## 분리 모드에서 실행

아직까지는 좋지만, 샘플 애플리케이션은 웹 서버이므로 컨테이너에 연결할 필요가 없다. Docker는 컨테이너를 분리 모드 또는 백그라운드에서 실행할 수 있다. 이것을 하기 위해, 우리는 `--detach`이나 `-d`를 짧게 사용할 수 있다. Docker는 이전과 같이 컨테이너를 시작하지만, 이번에는 컨테이너에서 "분리"되어 터미널 프롬프트로 돌아간다.

```
$ docker run -d -p 8080:8080 java-docker
5ff83001608c7b787dbe3885277af018aaac738864d42c4fdf5547369f6ac752
```

Docker는 우리 컨테이너를 백그라운드에서 시작하고 터미널에 컨테이너 ID를 출력했다.

다시 한 번, 우리 컨테이너가 제대로 작동하는지 확인해 보자. 위에서 동일한 `curl` 명령을 실행한다.

```
$ curl --request GET \
--url http://localhost:8080/actuator/health \
--header 'content-type: application/json'
{"status":"UP"}
```

## 컨테이너 리스트

컨테이너를 백그라운드에서 실행할 때 컨테이너가 실행 중인지 또는 다른 어떤 컨테이너가 기계에서 실행 중인지 어떻게 확인할까? `docker ps` 명령을 실행하면 된다. Linux에서 `ps` 명령을 실행하여 시스템의 프로세스 목록을 확인하는 방법과 마찬가지로 `docker ps` 명령을 실행하여 시스템에서 실행 중인 컨테이너 목록을 볼 수 있다.

```
$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED              STATUS              PORTS                    NAMES
5ff83001608c   java-docker      "./mvnw spring-boot:…"   About a minute ago   Up About a minute   0.0.0.0:8080->8080/tcp   trusting_beaver
```

`docker ps` 명령은 실행 중인 컨테이너에 대한 많은 정보를 제공한다. 컨테이너 ID, 컨테이너 내부에서 실행 중인 이미지, 컨테이너를 시작하는 데 사용된 명령, 컨테이너가 생성된 시점, 상태, 노출된 포트 및 컨테이너 이름을 볼 수 있다.

당신은 아마 우리 컨테이너의 이름이 어디서 왔는지 궁금할 것이다. 컨테이너를 시작할 때 컨테이너의 이름을 제공하지 않았기 때문에 Docker는 임의의 이름을 생성했다. 잠시 후에 고쳐지겠지만, 먼저 컨테이너를 멈춰야 한다. 컨테이너를 중지하려면 `docker stop` 명령을 실행하여 컨테이너를 중지한다. 우리는 컨테이너 이름을 전달하거나 컨테이너 아이디를 사용할 수 있다.

```
$ docker stop trusting_beaver
trusting_beaver
```

이제 `docker ps` 명령을 다시 실행하여 실행 중인 컨테이너 목록을 확인한다.

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

## 컨테이너 중지, 시작 및 이름 지정

Docker 컨테이너를 시작, 중지 및 재시작할 수 있다. 우리가 컨테이너를 정지하면 제거되지 않고, 상태가 정지로 변경되고 컨테이너 내부의 공정이 정지된다. 이전 모듈에서 `docker ps` 명령을 실행했을 때 기본 출력에는 실행 중인 컨테이너만 표시된다. `--all` 또는 `-a`를 간단히 설명하면 시작 또는 중지 상태에 관계없이 모든 컨테이너가 기계에 표시된다.

```
$ docker ps -a
CONTAINER ID   IMAGE               COMMAND                  CREATED          STATUS                        PORTS                    NAMES
5ff83001608c   java-docker         "./mvnw spring-boot:…"   5 minutes ago    Exited (143) 18 seconds ago                            trusting_beaver
630f2872ddf5   java-docker         "./mvnw spring-boot:…"   11 minutes ago   Exited (1) 8 minutes ago                               modest_khayyam
a28f9d587d95   java-docker         "./mvnw spring-boot:…"   17 minutes ago   Exited (1) 11 minutes ago                              lucid_greider
```

이제 몇 개의 컨테이너가 나열된다. 이것들은 우리가 시작하고 멈추었지만 제거되지 않은 컨테이너들이다.

우리가 방금 멈춘 컨테이너를 다시 시작하자. 방금 중지한 컨테이너의 이름을 찾은 후 `restart` 명령을 사용하여 아래의 컨테이너 이름을 바꾼다.

```
$ docker restart trusting_beaver
```

이제 `docker ps` 명령을 사용하여 모든 컨테이너를 다시 나열한다.

```
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                      PORTS                    NAMES
5ff83001608c   java-docker   "./mvnw spring-boot:…"   10 minutes ago   Up 2 seconds                0.0.0.0:8080->8080/tcp   trusting_beaver
630f2872ddf5   java-docker   "./mvnw spring-boot:…"   16 minutes ago   Exited (1) 13 minutes ago                            modest_khayyam
a28f9d587d95   java-docker   "./mvnw spring-boot:…"   22 minutes ago   Exited (1) 16 minutes ago                            lucid_greider
```

방금 다시 시작한 컨테이너는 분리 모드에서 시작되었으며 포트 8080이 노출되어 있다. 또한 컨테이너의 상태가 "위로 X초"인지 확인한다. 컨테이너를 재시작하면 컨테이너는 원래 시작했던 것과 동일한 플래그 또는 명령으로 시작된다.

이제 모든 컨테이너를 중지 및 제거하고 임의 명명 문제를 해결해 보자. 실행 중인 컨테이너의 이름을 찾고 아래 명령의 이름을 시스템의 컨테이너 이름으로 바꾼다.

```
$ docker stop trusting_beaver
trusting_beaver
```

이제 우리의 컨테이너가 멈췄으니, 그것을 제거하자. 컨테이너를 제거하면 컨테이너 내부의 프로세스가 중지되고 컨테이너에 대한 메타데이터가 제거된다.

컨테이너를 제거하려면 컨테이너 이름을 전달하는 `docker rm` 명령을 실행하기만 하면 된다. 단일 명령을 사용하여 여러 컨테이너 이름을 명령에 전달할 수 있다. 다시 다음 명령의 컨테이너 이름을 시스템의 컨테이너 이름으로 바꾼다.

```
$ docker rm trusting_beaver modest_khayyam lucid_greider
trusting_beaver
modest_khayyam
lucid_greider
```

`docker ps --all` 명령을 다시 실행하여 모든 컨테이너가 제거되었는지 확인한다.

이제 랜덤 명명 문제를 살펴보자. 일반적으로 컨테이너 이름을 지정하는 것은 컨테이너에서 실행 중인 항목과 관련된 응용 프로그램 또는 서비스를 쉽게 식별할 수 있기 때문이다.

컨테이너 이름을 지정하려면 `docker run` 플래그를 `--name` 명령에 전달하기만 하면 된다.

```
$ docker run --rm -d -p 8080:8080 --name springboot-server java-docker
2e907c68d1c98be37d2b2c2ac6b16f353c85b3757e549254de68746a94a8a8d3
$ docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS                    NAMES
2e907c68d1c9   java-docker   "./mvnw spring-boot:…"   8 seconds ago   Up 8 seconds   0.0.0.0:8080->8080/tcp   springboot-server
```

그게 더 낫다! 우리는 이제 이름을 기반으로 우리의 컨테이너를 쉽게 식별할 수 있다.