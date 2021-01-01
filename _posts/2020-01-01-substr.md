# substr
```c
char *substr(char const *s, unsigned int start, size_t len)
```

substr 함수는 입력 받은 문자열의 일부를 새로운 문자열로 만드는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s     : 문자열의 시작 주소
##### 2. start : 복사를 시작할 위치
##### 3. len   : 복사할 길이

### 반환값
생성된 문자열의 시작 주소<br/>

## 입력값에 따른 결과값
#### 기본
```
s : aabaa | start : 2 | len : 1,3
b
baa
```
#### s이 NULL인 경우
```
0x0
```
#### len이 0인 경우
```
s : aaaa | start : - | len : 0
0이 들어간 길이 1짜리 문자열
```
#### start가 s의 길이와 같거나 큰 경우
```
s : aaaa | start : 6 | len : -
0이 들어간 길이 1짜리 문자열
```
## 주의사항
생성된 문자열을 초기화하기 위해 memcpy나 strlcpy 등을 사용하는 경우가 있을 것이다.<br/>

memcpy의 경우 len값이 큰 경우 의도했던 것보다 더 많은 길이를 초기화하는 경우가 발생할 수 있다.<br/>

strlcpy의 경우 src의 길이만큼 필수적으로 반복문이 돌게되어 src가 긴만큼 효율이 떨어진다는 단점이 생길 수 있다.<br/>
