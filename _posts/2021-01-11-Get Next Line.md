---
layout: post
title:  "Get Next Line"
date:   2021-01-11T12:00:00-00:00
author: Taewan Kim
categories: Dummy
---

# Get Next Line

#### 시작하기 전에
GNL에 대한 설명에 앞서 필요한 사전 지식에 대해 알아보도록 한다.<br/>

#### static (정적 변수)
정적 변수는 프로그램 실행 전반에 걸쳐 변수의 수명이 유지된다. 즉, 메인이 끝나기 전까지 살아있는 변수로 함수에 선언되어 있는 경우 호출 시마다 그 값을 기억하고 있게 된다. 컴파일시 메모리가 할당되므로 동적 할당과 자동 할당과는 다르다.<br/>

아래 코드는 정적 변수의 간단한 예시이다.<br/>

```c
void  addone()
{
    static int  num1 = 0;
    
    num1++;
    printf("%d\n", num1);
}

int   main(void)
{
    addone();
    addone();
    addone();
    return (0);
}
```
위와 같은 경우 출력은 아래와 같다.<br/>

```
1
2
3
```
즉, 정적 변수로 선언된 경우 이전 작업값을 기억하고 계속 살아있게 된다.<br/>

그렇다면 정적 변수는 gnl의 어느 부분에서 활용되는 것일까? gnl은 파일에서 내용을 읽어 반환하는 기능을 수행하는데 읽은 파일의 내용 중 반환되지 않는 파일의 내용이 남아있을 것이다. 이 경우 이 내용들을 기억해놓을 필요성이 있다. 이 부분에서 정적 변수가 활용되게 된다.<br/>

#### 개념
Get Next Line(GNL)의 기능은 파일을 내용을 읽어 개행 문자를 기준으로 한 줄씩 반환해주는 기능을 한다. 파일은 file descriptor 파트에서 설명했던 개념을 통해 open 함수로 열어 fd를 할당받아 접근하게 된다.<br/>

#### GNL 반환값
파일의 내용이 남은 경우 : 1<br/>
파일의 내용이 없는 경우 : 0<br/>
오류가 발생한 경우 : -1<br/>

#### 알고리즘
당연히 구현은 사람마다 다르기 때문에 정해진 방식은 없다. 여기선 내가 구현한 GNL을 구현으로 설명이 진행될 것이고 구현에 있어 2가지 방법에 대해 제시할 것이다.<br/>

먼저, GNL의 전체적인 알고리즘이다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/104038595-a8d29d80-5218-11eb-9413-89d5b7a89ec1.png" width="500">
</p>

#### 참고자료
https://ko.wikipedia.org/wiki/%EC%A0%95%EC%A0%81_%EB%B3%80%EC%88%98<br/>

