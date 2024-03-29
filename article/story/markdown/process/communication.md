# 프로세스 간 통신

우리가 협업을 하듯이 프로세스 간에도 데이터를 주고 받으며 통신(IPC : Inter-Process Communication)할 수 있다. 그렇다면 프로세스 간 통신은 어떤 상황에서 어떤 방법으로 처리할 수 있을까? 이번 파트를 통해 이 질문에 대해 답변할 수 있도록 노력해보자.

## 프로세스 간 통신의 종류

통신 방식은 크게 `운영체제가 제공하는 통신 방식`과 `사용자가 직접 구현하는 통신 방식`이 존재한다. `운영체제가 제공하는 통신 방식`에는 `파이프`, `소켓`, `원격 프로시저 호출(RPC)`이 있고, `사용자가 직접 구현하는 통신 방식`에는 `전역 변수`, `파일`이 있다. 이에 대한 자세한 내용은 뒤에서 다루며 지금은 어떤 방법이 운영체제가 제공하는 방식인지 구분할 수 있을 정도만 알아두자.

프로세스 간 통신 종류에는 `프로세스 내부 데이터 통신`, `프로세스 간 데이터 통신`, `네트워크를 이용한 데이터 통신`이 존재한다. 이해를 위해 각 통신에 대해 더 자세히 알아보자.

- `프로세스 내부 데이터 통신` : 하나의 프로세스 내의 2개 이상의 스레드가 존재하는 경우로, 스레드는 `전역 변수`나 `파일`을 이용해 통신한다.
- `프로세스 간 데이터 통신` : 같은 컴퓨터 내에 프로세스끼리 통신하는 경우로, 공용 `파일` 또는 `파이프`를 이용해 통신한다.
- `네트워크를 이용한 데이터 통신` : 네트워크로 연결된 여러 컴퓨터 내의 프로세스끼리 통신하는 경우로, `소켓`이나 `RPC`를 이용해 통신한다.

> ### 어떤 통신 방식을 선택해야 할까?
> 통신 방식 선정에 있어 우리는 오버헤드를 고려해야 한다. `프로세스 간 데이터 통신`에도 소켓을 이용할 수 있지만 소켓 방식은 많은 전처리를 필요로 하기 때문에 속도가 상대적으로 느려 거의 사용하지 않는다.

## 프로세스 간 통신의 분류

프로세스 간 통신은 크게 `통신 방향`과 `통신 구현 방식`으로 분류할 수 있다. 각 분류 방법을 자세히 알아보자.

먼저 `통신 방향에 따른 분류`는 데이터 전송 방향에 따라 분류하는 방식으로 다음 3가지로 분류할 수 있다.

- `양방향 통신(duplex communication)` : 양쪽 방향으로 데이터 전송이 가능한 구조, 일반적인 통신들이 해당되며 소켓 통신은 양방향 통신에 해당한다.
- `반양방향 통신(half-duplex communication)` : 양쪽 방향으로 데이터 전송이 가능하지만 동시 전송은 불가능한 특정 시점에 한쪽 방향으로 전송할 수 있는 구조, 대표적으로 무전기가 있다.
- `단방향 통신(simplex communication)` : 한쪽 방향으로만 데이터 전송이 가능한 구조, 모스 신호, 전역 변수와 파이프가 해당한다.

`통신 구현 방식에 따른 분류`는 받는 쪽에서 `바쁜 대기(busy waiting)`를 하는 지 여부에 따라 분류하는 방식이다. 받는 쪽은 데이터가 언제 오는 지 알 수 없기 때문에 데이터 도착 여부를 확인해야 한다. 이 과정에서 수시로 확인하는 방법을 (반복문을 무한으로 실행하며 기다리는) `바쁜 대기`라고 한다. `바쁜 대기`는 시스템 자원을 낭비하므로 이를 해결하기 위해 데이터가 도착했음을 운영체제가 알려주는 `동기화(synchronization)`를 사용한다. 이 동기화 여부에 따라 다음 2가지로 분류할 수 있다.
- `동기화 통신(blocking communication)` : 동기화를 지원하는 통신 방식으로, 받는 쪽은 데이터가 도착할 때까지 대기 상태로 머문다.
- `비동기화 통신(non-blocking communication)` : 동기화를 지원하지 않는 통신 방식으로, 받는 쪽은 바쁜 대기를 사용해 도착 여부를 직접 확인한다.

> ### 전역 변수는 왜 단방향 통신일까?
> 하나의 전역 변수는 한 번에 하나의 데이터만을 가질 수 있기 때문이다. 통신의 목적은 데이터를 상대에게 전달하는 것이다. 전역 변수의 경우 양쪽에서 데이터를 저장하게 되면 한쪽의 데이터가 지워지게 된다.

## 프로세스 간 통신의 방법

앞서 언급했던 통신 방식들에 대해 자세히 알아보자.

1.`전역 변수를 이용한 통신 방식`

공동으로 관리하는 메모리를 사용하여 데이터를 주고 받는 방식으로 데이터를 쓰는 write, 데이터를 읽는 read가 수행된다. 주로 직접적으로 관련이 있는 프로세스 간에 사용한다. 예를 들면, 부모 프로세스가 전역 변수를 선언 후 자식 프로세스를 만들면 두 프로세스 간 통신이 가능해진다. 받는 쪽은 데이터가 도착 여부를 판단하기 위해 바쁜 대기를 돌며 도착할 때까지 반복적으로 확인하게 된다.

전역 변수를 이용해 양방향 통신을 구현할 수도 있다. 다음 사진을 참고하자.

<img width="484" alt="스크린샷 2023-07-27 오후 10 09 55" src="https://github.com/xodhksrjqnr/need-backend/assets/48250370/629078c8-e218-46a0-9e3f-9276d185f9b1">

2.`파일을 이용한 통신 방식`

저장 장치에 파일을 읽고 쓰는 방식으로 사용할 파일을 여는 open, 데이터를 쓰는 write, 데이터를 쓰는 read, 사용한 파일을 닫는 close가 수행된다. open의 경우 저장 장치에 있는 파일에 대한 접근 권한을 얻기 위함이며, close는 사용이 끝난 파일을 메모리에서 내리는 작업이다. 운영체제 입장에선 저장 장치에 데이터를 읽고 쓰는 것도 일반 프로세스와 입출력 프로세스 간의 통신이다.

#### 데이터 쓰기
- 파일 권한 얻기(open)
- 파일에 데이터 쓰기(write)
- 파일 종료하기(close)

#### 데이터 읽기
- 파일 권한 얻기(open)
- 파일에 데이터 읽기(read)
- 파일 종료하기(close)

3.`파이프를 이용한 통신`

프로세스 동기화 문제를 해결하기 위한 방법 중 하나로 운영체제가 제공하는 방식이다. 파이프를 열기위한 open, 데이터를 쓰는 write, 데이터를 읽는 read, 파이프를 닫는 close가 수행된다.

다음과 같이 2개의 파이프를 사용하여 양방향 통신 구현이 가능하며, 프로세스 A가 write 하지 않은 상태에서 프로세스 B가 read를 호출한 경우 프로세스 A가 write할 때까지 프로세스 B는 대기 상태가 된다. 대기 상태는 프로세스 A가 데이터를 write하는 순간 자동으로 풀리게 되므로 프로세스 B는 바쁜 대기를 하지 않아도 된다.

<img width="480" alt="스크린샷 2023-07-27 오후 10 29 02" src="https://github.com/xodhksrjqnr/need-backend/assets/48250370/bb653c9a-7b58-425e-90f4-0f94bcecb09c">

파이프는 이름 없는 파이프(anonymous pipe)와 이름 있는 파이프(named pipe)로 나뉜다.

- `이름 없는 파이프` : 부모 자식 프로세스 간의 통신에 사용
- `이름 있는 파이프` : FIFO라 불리는 특수 파일을 이용하며 서로 관련 없는 프로세스 간 통신에 사용

4.`소켓을 이용한 통신`

여러 컴퓨터에 있는 프로세스끼리 데이터를 주고 받는 방식이다. `원격 프로시저 호출(RPC : Remote Procedure Call)나 소켓을 이용한 방식`을 `네트워킹`이라고 하며, 원격 프로시저 호출은 다른 컴퓨터에 있는 함수를 호출하는 방법이다.

일반적으로 RPC는 소켓을 이용해 구현하며, 통신을 위해선 대상 컴퓨터를 찾고 찾은 컴퓨터 내의 통신할 프로세스를 결정하는 과정이 필요하다. `통신하려는 프로세스 끼리는 자신들의 소켓을 연결`해야 하며 이 작업을 `바인딩(binding)`이라고 한다.

<img width="510" alt="스크린샷 2023-07-27 오후 10 47 53" src="https://github.com/xodhksrjqnr/need-backend/assets/48250370/a49a1b08-86b2-46ff-bd14-c1864d4f452a">

소켓은 프로세스 동기화를 지원하기 때문에 바쁜 대기를 하지 않아도 되며, 소켓을 하나만 사용해도 양방향 통신이 가능하다.

```
네트워킹의 기본이 소켓이기 때문에 네트워크 프로그래밍을 소켓 프로그래밍이라고 부른다.
```

## 표로 확인하기

<img width="400" alt="스크린샷 2023-07-27 오후 9 50 20" src="https://github.com/xodhksrjqnr/toyProject-Smart/assets/48250370/216887a2-f656-4cff-8d3c-0e0a01393e5b">

# 참고자료

- [쉽게 배우는 운영체제](https://www.yes24.com/Product/Goods/62054527)