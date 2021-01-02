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

#### 역할
특정 파일에 접근하기 위한 단서이다. 

<p><img src="https://user-images.githubusercontent.com/48250370/103449891-ec497b00-4cf1-11eb-81a0-34f04902c751.png" width="700">
</p>

#### 참고자료
https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC_%EC%84%9C%EC%88%A0%EC%9E%90<br/>
https://twofootdog.tistory.com/51<br/>
http://cs.sookmyung.ac.kr/~chang/lecture/sp/chap2.pdf<br/>
