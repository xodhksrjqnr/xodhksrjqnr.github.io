## 바인딩 마운트 사용 [#](https://docs.docker.com/get-started/06_bind_mounts/)

5부에서는 볼륨 마운트에 대해 이야기하고 데이터베이스의 데이터를 유지하기 위해 볼륨 마운트를 사용했다. 볼륨 마운트는 애플리케이션 데이터를 영구적으로 저장해야 하는 경우에 적합하다.

바인딩 마운트는 호스트의 파일 시스템에서 컨테이너로 디렉토리를 공유할 수 있는 마운트의 다른 유형이다. 응용 프로그램에서 작업할 때 바인딩 마운트를 사용하여 소스 코드를 컨테이너에 마운트할 수 있다. 컨테이너는 파일을 저장하는 즉시 코드에 대한 변경 내용을 확인한다. 즉, 컨테이너에서 파일 시스템 변경 사항을 감시하고 이에 응답하는 프로세스를 실행할 수 있다.

이 장에서는 바인딩 마운트와 nodemon라는 도구를 사용하여 파일 변경 사항을 확인한 다음 응용 프로그램을 자동으로 다시 시작하는 방법에 대해 설명한다. 대부분의 다른 언어와 프레임워크에는 동등한 도구가 있다.

## 빠른 볼륨 유형 비교

다음 표에서는 볼륨 마운트와 바인딩 마운트의 주요 차이점을 설명한다.

|                    | 볼륨 마운트                                             | 바인딩 마운트                                              |
|--------------------|----------------------------------------------------|------------------------------------------------------|
| 호스트 위치             | Docker 선택                                          | 사용자 선택                                               |
| 예시                 | `type=volume,src=my-volume,target=/usr/local/data` | `type=bind,src=/path/to/data,target=/usr/local/data` |
| 새 볼륨을 컨테이너 내용으로 채움 | yes                                                | no                                                   |
| 볼륨 드라이버 지원         | yes                                                | no                                                   |

## 바인딩 마운트 테스트

응용 프로그램 개발에 바인딩 마운트를 사용하는 방법을 살펴보기 전에 바인딩 마운트의 작동 방식을 실질적으로 이해하기 위해 간단한 실험을 실행해 보자.

Windows(윈도우)에서 이 단계를 수행하는 경우 명령 프롬프트(`cmd`)가 아닌 PowerShell을 사용해야 한다.

1. 터미널을 열고 현재 작업 디렉터리가 시작 저장소의 `app` 디렉터리에 있는지 확인한다.

2. 다음 명령을 실행하여 바인딩 마운트가 있는 `ubuntu` 컨테이너에서 `bash`를 시작한다.

Mac 또는 Linux 장치를 사용하는 경우 다음 명령을 사용한다.

```
$ docker run -it --mount type=bind,src="$(pwd)",target=/src ubuntu bash
```

Windows를 사용하는 경우 PowerShell에서 다음 명령을 사용한다.

```
$ docker run -it --mount "type=bind,src=$pwd,target=/src" ubuntu bash
```

`--mount` 옵션은 Docker에 바인딩 마운트를 생성하도록 지시한다. 여기서 `src`은 호스트 시스템 (`getting-started/app`)의 현재 작업 디렉토리이며, `target`는 해당 디렉토리가 컨테이너(`/src`) 내부에 표시되어야 하는 위치이다.

3. 명령을 실행한 후 Docker는 컨테이너 파일 시스템의 루트 디렉터리에서 대화형 `bash` 세션을 시작한다.

```
root@ac1237fad8db:/# pwd
/
root@ac1237fad8db:/# ls
bin   dev  home  media  opt   root  sbin  srv  tmp  var
boot  etc  lib   mnt    proc  run   src   sys  usr
```

4. 이제 `src` 디렉토리에서 디렉토리를 변경한다.

컨테이너를 시작할 때 마운트한 디렉터리이다. 이 디렉토리의 내용을 나열하면 호스트 시스템의 `getting-started/app` 디렉토리와 동일한 파일이 표시된다.

```
root@ac1237fad8db:/# cd src
root@ac1237fad8db:/src# ls
Dockerfile  node_modules  package.json  spec  src  yarn.lock
```

5. 이름이 `myfile.txt`인 새 파일을 생성한다.

```
root@ac1237fad8db:/src# touch myfile.txt
root@ac1237fad8db:/src# ls
Dockerfile  myfile.txt  node_modules  package.json  spec  src  yarn.lock
```

6. 이제 호스트에서 이 디렉터리를 열면 디렉터리에 `myfile.txt` 파일이 생성된 것을 볼 수 있다.

![](https://docs.docker.com/get-started/images/bind-mount-newfile.png)

7. 호스트에서 `myfile.txt` 파일을 삭제한다.
8. 컨테이너에서 `app` 디렉터리의 내용을 다시 한 번 나열한다. 이제 파일이 없어진 것을 확인할 수 있다.

```
root@ac1237fad8db:/src# ls
Dockerfile  node_modules  package.json  spec  src  yarn.lock
```

9. `Ctrl + D`를 사용하여 대화형 컨테이너 세션을 중지한다.

이상으로 마운트 바인딩에 대한 간단한 소개를 마친다. 이 절차에서는 호스트와 컨테이너 간에 파일을 공유하는 방법과 변경 사항이 양쪽에 즉시 반영되는 방법을 보여주었다. 이제 바인딩 마운트를 사용하여 소프트웨어를 개발하는 방법을 살펴보자.

## 개발 컨테이너에서 앱 실행

다음 단계에서는 다음 작업을 수행하는 바인딩 마운트로 개발 컨테이너를 실행하는 방법을 설명한다:

- 소스 코드를 컨테이너에 마운트한다
- 모든 종속성 설치
- 파일 시스템 변경 사항을 확인하기 위해 `nodemon` 시작

자, 해자!

1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인한다.
2. `getting-started/app` 디렉토리에서 다음 명령을 실행한다.

Mac 또는 Linux 장치를 사용하는 경우 다음 명령을 사용한다.

```
$ docker run -dp 3000:3000 \
    -w /app --mount type=bind,src="$(pwd)",target=/app \
    node:18-alpine \
```

Windows를 사용하는 경우 PowerShell에서 다음 명령을 사용한다.

```
$ docker run -dp 3000:3000 `
    -w /app --mount "type=bind,src=$pwd,target=/app" `
    node:18-alpine `
    sh -c "yarn install && yarn run dev"
```

* `-dp 3000:3000` : 분리(백그라운드) 모드로 실행 및 포트 매핑 생성
* `-w /app` : 명령을 실행할 '작업 디렉토리' 또는 '현재 디렉토리'를 설정한다.
* `--mount type=bind,src="$(pwd)",target=/app` : 호스트의 현재 디렉토리를 컨테이너의 `/app` 디렉토리에 바인딩 마운트`
* `node:18-alpine` : 사용할 이미지로 Dockerfile의 앱 기본 이미지이다.
* `sh -c "yarn install && yarn run dev"` : `sh`(하드웨어에 `bash`이 없음)를 사용하여 셸을 시작하고 `yarn install`를 실행하여 패키지를 설치한 다음 `yarn run dev`를 실행하여 개발 서버를 시작한다. `package.json`를 보면 `dev` 스크립트가 `nodemon` 시작하는 것을 볼 수 있다.

3. `docker logs <container-id>`를 사용하여 로그를 볼 수 있다. 다음과 같은 정보를 확인하면 준비가 완료되었음을 알 수 있다:

```
$ docker logs -f <container-id>
nodemon src/index.js
[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] starting `node src/index.js`
Using sqlite database at /etc/todos/todo.db
Listening on port 3000
```

로그 보기를 마쳤으면 `Ctrl+C`를 눌러 종료한다.

4. 이제 앱을 변경한다. 109행의 `src/static/js/app.js` 파일에서 "Add Item" 버튼을 변경하여 "Add"라고 간단히 말한다:

```
- {submitting ? 'Adding...' : 'Add Item'}
+ {submitting ? 'Adding...' : 'Add'}
```

파일을 저장한다.

5. 웹 브라우저에서 페이지를 새로 고치면 변경사항이 거의 즉시 반영된다. 노드 서버를 다시 시작하는 데 몇 초 정도 걸릴 수 있다. 오류가 발생하면 몇 초 후에 새로 고쳐 보자.

![](https://docs.docker.com/get-started/images/updated-add-button.png)

6. 다른 변경 사항이 있으면 언제든지 변경할 수 있다. 파일을 변경하고 저장할 때마다 nodemon 프로세스는 컨테이너 내부의 앱을 자동으로 다시 시작한다. 작업이 완료되면 다음을 사용하여 컨테이너를 중지하고 새 이미지를 작성한다:

```
$ docker build -t getting-started .
```

로컬 개발 설정에서는 바인딩 마운트를 사용하는 것이 일반적이다. 장점은 개발 기계가 모든 빌드 도구와 환경을 설치할 필요가 없다는 것이다. 단일 `docker run` 명령을 사용하면 종속성과 도구를 사용할 수 있다. 명령을 단순화하는 데 도움이 되는 Docker Compose에 대해서는 향후 단계에서 설명한다(이미 많은 플래그가 표시됨).

Docker는 볼륨 마운트 및 바인딩 마운트 외에도 더 복잡하고 전문화된 사용 사례를 처리하기 위한 다른 마운트 유형 및 스토리지 드라이버도 지원한다. 고급 스토리지 개념에 대한 자세한 내용은 Docker에서 [데이터 관리](https://docs.docker.com/storage/)를 참조하자.