## 애플리케이션 공유하기

이제 이미지를 구축했으므로 공유할 수 있다. Docker 이미지를 공유하려면 Docker 레지스트리를 사용해야
한다. 기본 레지스트리는 Docker Hub이며 사용한 모든 이미지의 원본이다.

## 레포지토리 생성하기

이미지를 푸시하려면 먼저 Docker Hub에 리포지토리를 만들어야 한다.

1. Docker Hub에 가입하거나 로그인한다.
2. Create Repository 버튼을 선택한다.
3. repo name은 getting-started를 사용한다. 가시성이 Public인지 확인한다.
4. Create 버튼을 선택한다.

아래 이미지를 보시면 Docker 명령의 예를 볼 수 있다. 이 명령은 이 보고서를 푸시한다.

![](https://docs.docker.com/get-started/images/push-command.png)

## 이미지 푸시하기

1. 명령줄에서 Docker Hub에 표시되는 push 명령을 실행해 보자. 명령은 "docker"가 아닌
   네임스페이스를 사용한다.

```
docker push docker/getting-started
The push refers to repository [docker.io/docker/getting-started]
An image does not exist locally with the tag: docker/getting-started
```

왜 실패했을까? 푸시 명령에서 docker/getting-started이라는 이름의 이미지를 찾고 있었지만 찾지
못했다. 당신이 `docker image ls`를 실행해도 마찬가지이다.

이 문제를 해결하려면 빌드한 기존 이미지에 다른 이름을 붙이기 위해 "태그"를 지정해야 한다.

2. `docker login -u YOUR-USER-NAME` 명령을 사용하여 Docker Hub에 로그인한다.

3. `docker tag` 명령을 사용하여 `getting-started` 이미지에 새 이름을 지정한다.
   `YOUR-USER-NAME`를 도커 ID로 교체해야 한다.

```
docker tag getting-started YOUR-USER-NAME/getting-started
```

`docker tag` 명령에 대한 자세한 내용은 [docker tag](https://docs.docker.com/engine/reference/commandline/tag/)를
참조하자.

4. 이제 푸시 명령을 다시 시도하자. Docker Hub에서 값을 복사하는 경우 이미지 이름에 태그를 추가하지
   않았으므로 `tagname` 부분을 삭제할 수 있다. 태그를 지정하지 않으면 도커에서 `latest`라는 태그를
   사용한다.

```
docker push YOUR-USER-NAME/getting-started
```

## 새로운 인스턴스에서 이미지 실행하기

이미지가 빌드되어 레지스트리에 푸시되었으니 이 컨테이너 이미지를 본 적이 없는 완전히 새로운 인스턴스에서
앱을 실행해 보자. 이렇게 하려면 Play with Docker를 사용해야 한다.

> Play with Docker는 amd64 플랫폼을 사용한다. Apple Silicon과 함께 ARM 기반 Mac을
사용하는 경우 Play with Docker와 호환되도록 이미지를 재구성하고 새 이미지를 저장소에 푸시해야 한다.
>
> amd64 플랫폼용 이미지를 빌드하려면 `--platform` 플래그를 사용합니다.
>
> ```
> docker build --platform linux/amd64 -t YOUR-USER-NAME/getting-started .
> ```
>
> Docker buildx는 다중 플랫폼 이미지 구축도 지원한다. 자세한 내용은 다중 플랫폼 이미지를 참조하자.

1. 브라우저를 열어 [Play with Docker](https://labs.play-with-docker.com/)에 접속한다.
2. 로그인을 선택한 다음 드롭다운 목록에서 Docker를 선택한다.
3. Docker hub 계정으로 연결한다.
4. 로그인한 후 왼쪽 사이드바에서 새 인스턴스 추가 옵션을 선택한다. 보이지 않으면 브라우저를 조금 더
   넓게 만든다. 몇 초 후 브라우저에 터미널 창이 열린다.

![](https://docs.docker.com/get-started/images/pwd-add-new-instance.png)

5. 터미널에서 새로 푸시한 앱을 시작한다.

```
docker run -dp 3000:3000 YOUR-USER-NAME/getting-started
```

이미지가 아래로 내려지고 결국 시작되는 것을 볼 수 있다.

6. OPEN PORT 버튼 옆에 3000 버튼이 뜨면 해당 버튼을 클릭해 수정된 내용이 포함된 앱을 볼 수 있다.
   3000 버튼이 나타나지 않으면 OPEN PORT 버튼을 선택하고 3000을 입력하면 된다.
