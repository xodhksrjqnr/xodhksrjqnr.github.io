---
layout: post
title:  "IP address"
date:   2021-01-08T12:00:00-00:00
author: Taewan Kim
categories: Dummy
---

# IP address

#### IP 주소란?
**컴퓨터 네트워크에서 장치들이 서로를 인식하고 통신을 하기 위해서 사용하는 특수한 번호**를 말한다. 좀 더 간단하게 설명하면 우리가 어딘가의 목적지를 찾아갈 때 주소를 활용하듯 네트워크상에서 특정 장치를 찾아가기 위해 부여된 주소이다. 주소는 옥테드 '.'을 찍어 구분한다.<br/>

IP 주소는 IPv4와 IPv6 두 가지로, 일반적인 IP 주소를 의미하는 IPv4와 IPv4가 거의 소진되었다는 한계점의 대안으로 제안된 IPv6가 있다.<br/>

#### IPv4
IPv4는 32비트 길이의 식별자로 8비트 단위 4부분으로 10진수로 표시되며 0.0.0.0 ~ 255.255.255.255까지의 범위를 갖는다.<br/>

<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103967259-f6152780-51a4-11eb-9cd7-c58f189e381a.png" width="500">
</p>

- 데이터가 정확하게 전달될 것을 보장하지 않는다.
- 중복된 패킷을 전달하거나 패킷의 순서를 잘못 전달할 가능성이 있다.

#### IPv6
IPv6는 128비트 길이의 식별자로 16비트 단위 8부분으로 16진수로 표현된다.<br/>

<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103967499-7c316e00-51a5-11eb-939a-8e5361cd410b.png" width="500">
</p>

- IP 주소의 확장
- 호스트 주소 자동 설정
- 패킷 크기 확장
- 효율적인 라우팅
- Flow Labeling
- 인증 및 보안 기능
- 이동성

#### 클래스
클래스란 **하나의 IP주소에서 네트워크 영역과 호스트 영역을 나누는 방법이자 약속**이다. 클래스는 A, B, C, D, E가 있으며 C와 E의 경우 멀티캐스트용, 연구용으로 사용된다.<br/>

<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103968465-3fff0d00-51a7-11eb-9b2e-b2e6782521cf.png" width="500">
</p>

##### A 클래스
A 클래스는 하나의 네트워크가 가질 수 있는 호스트 수가 제일 많은 클래스이다. 위 사진에서 보이듯 A 클래스는 맨 앞자리 수가 항상 0이다. 즉, 형태는 다음과 같다.
<pre>0xxx xxxx . xxxx xxxx . xxxx xxxx . xxxx xxxx</pre>
x는 0과 1을 의미하며 A 클래스가 가질 수 있는 범위를 십진수로 표현하면 0.0.0.0 ~ 127.255.255.255이다.<br/>

A 클래스에선 첫번째 옥테드까지가 네트워크 영역이며 이후부터 호스트 영역을 의미한다. 또한, 네트워크 영역 127은 제외되는데 이는 loopback으로 활용되기 때문이다. 이건 약속으로 기억해두면 된다.<br/>

그렇다면 A 클래스가 가질 수 있는 호스트 주소의 갯수에 대해 알아보자. 단순하게 2^24 개라고 생각하겠지만 2개의 주소를 빼주어야 한다. 이유는 호스트 영역이 전부 1인 경우 브로드캐스트 주소로 사용되고 모두 0인 경우 네트워크 주소로 사용되기 때문이다. 이를 공식으로 바꾼다면 다음과 같다.<br/>

<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103970367-7474c800-51ab-11eb-9f89-e6055c5f834e.png" width="400">
</p>

위 공식은 이후 설명할 다른 클래스에도 똑같이 적용된다.<br/>

##### B 클래스
B 클래스의 형태는 다음과 같다.
<pre>10xx xxxx . xxxx xxxx . xxxx xxxx . xxxx xxxx</pre>
B 클래스는 두번째 옥테드까지를 네트워크 영역으로 이후부터 호스트 영역으로 사용한다. B 클래스의 경우 가질 수 있는 호스트의 갯수는 2^16 - 2개이다.<br/>

##### C 클래스
C 클래스의 형태는 다음과 같다.
<pre>110x xxxx . xxxx xxxx . xxxx xxxx . xxxx xxxx</pre>
C 클래스는 세번째 옥테드까지를 네트워크 영역으로 이후부터 호스트 영역으로 사용한다. C 클래스의 경우 가질 수 있는 호스트의 갯수는 2^8 - 2개이다.<br/>

클래스별로 간단히 정리하면 다음과 같다.

<p align="center">
  <img src="https://user-images.githubusercontent.com/48250370/103971151-28c31e00-51ad-11eb-821a-c2fc527ee414.png" width="600">
</p>
참고 이미지 링크 : https://limkydev.tistory.com/168

#### 참고자료
https://ko.wikipedia.org/wiki/IPv4<br/>
https://ko.wikipedia.org/wiki/IPv6<br/>
https://m.blog.naver.com/PostView.nhn?blogId=hostinggodo&logNo=220589113088&proxyReferer=https:%2F%2Fwww.google.com%2F<br/>
https://velog.io/@hidaehyunlee/IP-address%EB%9E%80#1-what-is-ip-address<br/>
https://limkydev.tistory.com/168<br/>

