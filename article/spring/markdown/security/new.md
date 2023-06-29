# 새로운 기능 [#](https://docs.spring.io/spring-security/reference/whats-new.html)

Spring Security 6.1은 여러 가지 새로운 기능을 제공한다. 다음은 릴리스의 주요
내용이다.

## Core

- [gh-12233](https://github.com/spring-projects/spring-security/issues/12233)
\- 보안권한 부여 관리자를 통해 기본 권한 부여 관리자를 사용자 지정할 수 있다

- [gh-12231](https://github.com/spring-projects/spring-security/issues/12231)
\- 권한 수집 권한 관리자 추가

## OAuth 2.0

[gh-10309](https://github.com/spring-projects/spring-security/issues/10309)
/- (docs) - 님버스 추가(반응)발행자 위치가 있는 JwtDecoder#
[gh-12907](https://github.com/spring-projects/spring-security/issues/12907)
/- ReactiveJwt에서 주 클레임 이름 구성인증 변환기

## SAML 2.0

[gh-12604](https://github.com/spring-projects/spring-security/issues/12604)
/- AuthnRequestSigned 메타데이터 특성 지원
[gh-12846](https://github.com/spring-projects/spring-security/issues/12846)
/- 메타데이터가 여러 엔티티 및 엔티티 설명자 지원
[gh-11828](https://github.com/spring-projects/spring-security/issues/11828)
/- (docs) - DSL에 saml2Metadata 추가
[gh-12843](https://github.com/spring-projects/spring-security/issues/12843)
/- (docs) - 로그아웃 요청에서 의존 당사자 추론 허용
[gh-10243](https://github.com/spring-projects/spring-security/issues/10243)
/- (docs) - SAML 응답에서 의존 당사자 추론 허용
[gh-12842](https://github.com/spring-projects/spring-security/issues/12842)
/- RelingPartyRegistration 자리 표시자 확인 구성 요소 추가
[gh-12845](https://github.com/spring-projects/spring-security/issues/12845)
/- 이미 로그아웃한 후 Logout Response 발급 지원

## Observability

[gh-12534](https://github.com/spring-projects/spring-security/issues/12534)
/- 인증 및 권한 부여 관찰 규칙 사용자 정의

## Web

[gh-12751](https://github.com/spring-projects/spring-security/issues/12751)
/- RequestMatchers 공장 클래스 추가
[gh-12847](https://github.com/spring-projects/spring-security/issues/12847)
/- And 및 OrRequestMatcher를 통해 변수 전파

## Docs

Spring Security의 문서를 업데이트하기 위한 지속적인 노력으로 몇 개의 추가 섹션이
완전히 다시 작성되었다:

[gh-13088](https://github.com/spring-projects/spring-security/issues/13088)
/- (docs) - 인증 문서 다시 보기
[gh-12681](https://github.com/spring-projects/spring-security/issues/12681)
/- (docs) - 세션 관리 문서 다시 보기
[gh-13062](https://github.com/spring-projects/spring-security/issues/13062)
/- (docs) - 로그아웃 문서 다시 보기
[gh-13089](https://github.com/spring-projects/spring-security/issues/13089)
/- CSRF 설명서 다시 보기