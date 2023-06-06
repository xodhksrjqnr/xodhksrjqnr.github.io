## 애플리케이션 업데이트하기 [#](https://docs.docker.com/get-started/03_updating_app/)

파트 2에서는 작업관리 응용프로그램을 컨테이너화했다. 이 부분에서는 응용 프로그램 및 컨테이너 이미지를
업데이트한다. 또한 컨테이너를 중지하고 제거하는 방법도 배우게 된다.

## 소스 코드 업데이트하기

아래 단계에서 작업관리 목록 항목이 없을 때 "No items yet! Add one above!"을 "You have no
todo items yet! Add one above!"로 변경한다.

1. src/static/js/app.js 파일에서 56행을 업데이트하여 새 빈 텍스트를 사용한다.

```js
...
 -                <p className="text-center">No items yet! Add one above!</p>
 +                <p className="text-center">You have no todo items yet! Add one above!</p>
 ...
```

2. 파트 2에서 사용한 것과 동일한 `docker build` 명령을 사용하여 업데이트된 버전의 이미지를 빌드한다.

```
$ docker build -t getting-started .
```

3. 업데이트된 코드를 사용하여 새 컨테이너를 시작한다.

```
$ docker run -dp 3000:3000 getting-started
```

다음과 같은 오류가 발생했을 수 있다(ID는 다르다):

```
$ docker: Error response from daemon: driver failed programming external connectivity on endpoint laughing_burnell 
(bb242b2ca4d67eba76e79474fb36bb5125708ebdabd7f45c8eaf16caaabde9dd): Bind for 0.0.0.0:3000 failed: port is already allocated.
```

이전 컨테이너가 실행 중인 동안 새 컨테이너를 시작할 수 없기 때문에 오류가 발생했다. 그 이유는 이전
컨테이너가 이미 호스트의 포트 3000을 사용하고 있으며 시스템의 하나의 프로세스(컨테이너 포함)만 특정
포트를 수신할 수 있기 때문이다. 이 문제를 해결하려면 오래된 컨테이너를 제거해야 한다.

## 컨테이너 제거하기

컨테이너를 제거하려면 먼저 컨테이너를 중지해야 한다. 중지된 후에는 제거할 수 있다. CLI 또는 Docker
Desktop의 그래픽 인터페이스를 사용하여 이전 컨테이너를 제거할 수 있다. 가장 편한 옵션을 선택하자.

### CLI

```
$ docker ps
$ docker stop <the-container-id>
$ docker rm <the-container-id>
```

* `docker rm` 명령에 `force` 플래그를 추가하여 단일 명령으로 컨테이너를 중지 및 제거할 수 있다.
  예: `docker rm -f <the-container-id>`

### Docker Desktop

1. 컨테이너 보기로 Docker Desktop을 연다.
2. 삭제할 이전의 현재 실행 중인 컨테이너에 대한 액션 열 아래의 휴지통 아이콘을 선택한다.
3. 확인 대화 상자에서 영원히 삭제를 선택한다.

## 업데이트된 앱 컨테이너 실행하기

1. 이제 `docker run` 명령을 사용하여 업데이트된 앱을 시작한다.

```
$ docker run -dp 3000:3000 getting-started
```

2. http://localhost:3000에서 브라우저를 새로 고치면 업데이트된 도움말 텍스트가 표시된다.

![](https://docs.docker.com/get-started/images/todo-list-updated-empty-text.png)
