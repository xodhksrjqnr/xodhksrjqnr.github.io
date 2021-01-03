---
layout: post
title:  "File Descriptor"
date:   2021-01-02T12:00:00-00:00
author: Taewan Kim
categories: Dummy
---

# File Descriptor

#### 정의
파일 서술자(=파일 기술자)는 일반적으로 POSIX 운영 체제에서 쓰이는 특정한 파일에 접근하기 위한 추상적인 키를 말한다. 0~2번까지는 미리 할당되어있으며 이후 낮은 숫자부터 할당된다.<br/>
- 0 (standard input)
- 1 (standard output)
- 2 (standard error)

#### 동작방식
먼저 동작방식에 대해 설명하기 전 i-node란 용어에 대해 정리가 필요하다.<br/>

#### i-node
아이노드란 정규 파일, 디렉터리 등 파일 시스템에 관한 정보를 가진 유닉스 계통 파일 시스템에서 사용하는 자료구조이다. 파일마다 1개의 아이노드를 가지고 있어 파일 시스템 내의 파일들은 고유한 아이노드 숫자를 통해 식별이 가능하다. 아래 사진은 아이노드에 포함된 정보이다.<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103450039-dfc62200-4cf3-11eb-851a-3bf87bd6a54d.png" width="300">
</p>

다시 본론으로 돌아와 fd의 동작 방식이다. 아래 사진과 함께 이해하면 편하다.<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103449891-ec497b00-4cf1-11eb-81a0-34f04902c751.png" width="600">
</p>
fd table은 할당받은 fd가 저장되는 공간, open file table은 현재 열려있는 파일들의 공간, active inode table은 열린 파일들의 고유한 inode가 저장되있는 공간을 의미한다. open 함수를 이용한 시스템 호출을 통해 위와 같은 구조로 fd를 할당받게 된다.<br/>

#### 파일 관련 시스템 호출
fd를 사용하는 함수들은 다음과 같다.<br/>
- open() : 열기
- creat() : 파일 생성
- close() : 닫기
- read() : 읽기
- write() : 쓰기
- lseek() : 이동

#### open()
open 함수는 파일을 열어 fd를 할당받는 역할을 수행한다.<br/>
* 헤더

```
fcntl.h
```
* 형태

```c
int open(const char *name, int flags, [mode_t mode]);
```
open 함수는 열어줄 파일의 이름(name)과 어떤 형태로 열것인지(flags)를 정할 수 있다. flags 중 파일을 열 때 선택할 모드는 반드시 하나 지정해주어야 한다.<br/>
```
O_RDONLY : 읽기 모드
O_WRONLY : 쓰기 모드
O_RDWR   : 읽고 쓰기모드
```
open 함수를 사용함에 있어 위 모드 중 하나는 반드시 필요로 한다. 아래 파라미터는 선택적인 지정이 가능한 요소들이다.<br/>
```
O_APPEND : 파일의 맨 끝에 내용 추가
O_CREAT  : 파일이 없는 경우 생성
O_EXCL   : O_EXCL 옵션과 함께 사용, 기존에 없는 파일이면 생성, 이미 있으면 오류 메시지 출력
```
* 반환값

```
성공시 : 할당된 fd
실패시 : -1
```

#### creat()
creat 함수는 새로운 파일을 생성한다.<br/>
* 헤더

```
fcntl.h
```
* 형태

```c
int creat(const char *name, [mode_t mode]);
```
* 반환값

```
성공시 : 할당된 fd
실패시 : -1
```

#### close()
close 함수는 작업이 끝난 후 파일을 닫는다.<br/>
* 헤더

```
unistd.h
```
* 형태

```c
int close(int fd);
```
* 반환값

```
성공시 : 0
실패시 : -1
```

#### read()
read 함수를 fd가 나타내는 파일에서 데이터를 읽는다.<br/>
* 헤더

```
unistd.h
```
* 형태

```c
ssize_t read(int fd, void *buf, size_t nbytes);
```
ssize_t : signed integer
read 함수는 읽을 데이터가 충분하면 한 번에 nbytes 만큼 읽으며 읽을 데이터가 nbytes보다 적으면 더 적게 읽는다.<br/>

* 반환값

```
성공시 : 읽은 바이트 수
파일의 끝을 만난 경우 : 0
실패시 : -1
```

#### write()
write 함수는 fd가 나타내는 파일에 데이터를 쓴다.<br/>
* 헤더

```
unistd.h
```
* 형태

```c
ssize_t write(int fd, void *buf, size_t nbytes);
```
* 반환값

```
성공시 : 파일에 쓰여진 데이터의 바이트 수
실패시 : -1
```


#### lseek()
lseek 함수는 파일을 열었을 때의 시작 위치를 이동한다.<br/>
* 헤더

```
unistd.h
```
* 형태

```c
off_t write(int fd, off_t offset, int whence);
```
whence : 위치 기준점
```
SEEK_SET : 파일의 시작점을 기준으로 이동
SEEK_CUR : 현재 위치를 기준으로 이동
SEEK_END : 파일의 끝을 기준으로 이동
```
offset : 기준점에서의 상대적인 거리 (byte 단위)
```
SEEK_CUR, SEEK_END 와 같이 쓰일 때는 음수도 가능
```

* 반환값

```
성공시 : 현재 위치
실패시 : -1
```

#### 참고자료
https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC_%EC%84%9C%EC%88%A0%EC%9E%90<br/>
https://twofootdog.tistory.com/51<br/>
http://cs.sookmyung.ac.kr/~chang/lecture/sp/chap2.pdf<br/>
https://ko.wikipedia.org/wiki/%EC%95%84%EC%9D%B4%EB%85%B8%EB%93%9C<br/>
https://m.blog.naver.com/PostView.nhn?blogId=bestheroz&logNo=113881732&proxyReferer=https:%2F%2Fwww.google.com%2F<br/>
