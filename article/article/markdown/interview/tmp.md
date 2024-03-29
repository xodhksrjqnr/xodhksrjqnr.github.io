# Docker 사용 이유

- 동일한 개발 환경을 보장하기 위해 
- 서버 증설 시 의존성 걱정없이 빠르게 셋팅하기 위해

***

# Web Server와 WAS(Web Application Server)

`Web Server`는 `정적인 컨텐츠`를 제공하며 `아파치`, `Nginx` 등이 있다.

`WAS`는 `DB나 로직 처리`를 요구하는 `동적인 컨텐츠`를 제공하며 `톰캣`, `Jeus` 등이 있다.

***

# Cookie, Session, JWT(Json Web Token)

[LINK](https://hahahoho5915.tistory.com/32)
[LINK](https://velog.io/@znftm97/JWT-Session-Cookie-%EB%B9%84%EA%B5%90-sphsi9yh)

`쿠키`는 `서버에서 생성되고, 웹 브라우저에 저장하는 기록 정보 파일`이며, 서버로 보내 `사용자 식별`에 사용된다.

- 이름, 값, 만료일(저장 기간 설정), 경로 정보로 구성
- 클라이언트에 총 300개의 쿠키를 저장
- 하나의 도메인 당 20개의 쿠키를 보유 가능
- 하나의 쿠키는 4KB(=4096byte)까지 저장 가능

`세션`은 `방문자가 웹 서버에 접속해 있는 상태를 하나의 단위로 보고, 그 상태를 유지하는 기술`이다.

- 상태 정보 저장
- 웹 브라우저에 저장할 세션 쿠키(클라이언트 고유 Session ID 포함) 발급
- 브라우저를 닫거나, 서버에서 세션을 삭제했을때만 삭제가 되므로, 쿠키보다 비교적 보안이 좋음
- 저장 데이터에 제한 없음 (서버 용량에 의존)

HTTP 프로토콜의 `stateless`와 `connectionless`의 한계를 보완하기 위해 쿠키와 세션을 사용하였다. 즉, `클라이언트와의 정보 유지`를 위함이다. 

`JWT`는 `전자 서명을 URL 세이프하게 표현한 Json`이며, 마이크로 서비스 환경에서의 `쿠키`, `세션`의 한계를 보완하기 위해 등장하였다. 

[JWT](https://velog.io/@znftm97/JWT-Session-Cookie-%EB%B9%84%EA%B5%90-sphsi9yh)

[정리 다시하기]