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

###### i-node
아이노드란 정규 파일, 디렉터리 등 파일 시스템에 관한 정보를 가진 유닉스 계통 파일 시스템에서 사용하는 자료구조이다. 파일마다 1개의 아이노드를 가지고 있어 파일 시스템 내의 파일들은 고유한 아이노드 숫자를 통해 식별이 가능하다. 아래 사진은 아이노드에 포함된 정보이다.<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103450039-dfc62200-4cf3-11eb-851a-3bf87bd6a54d.png" width="400">
</p>

다시 본론으로 돌아와 fd의 동작 방식이다. 아래 사진과 함께 이해하면 편하다.<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103449891-ec497b00-4cf1-11eb-81a0-34f04902c751.png" width="600">
</p>
fd table은 할당받은 fd가 저장되는 공간, open file table은 현재 열려있는 파일들의 공간, active inode table은 열린 파일들의 고유한 inode가 저장되있는 공간을 의미한다. open 함수를 이용한 시스템 호출을 통해 위와 같은 구조로 fd를 할당받게 된다.

#### 참고자료
https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC_%EC%84%9C%EC%88%A0%EC%9E%90<br/>
https://twofootdog.tistory.com/51<br/>
http://cs.sookmyung.ac.kr/~chang/lecture/sp/chap2.pdf<br/>
https://ko.wikipedia.org/wiki/%EC%95%84%EC%9D%B4%EB%85%B8%EB%93%9C<br/>

