# strmapi
```c
char *strmapi(char const *s, char (*f)(unsigned int, char))
```

strmapi 함수는 입력 받은 문자열의 요소마다 f함수를 적용한 새로운 문자열을 만드는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s : 문자열의 시작 주소
##### 2. f : 문자열의 요소에 적용시킬 함수

### 반환값
생성된 문자열의 시작 주소<br/>

## 입력값에 따른 결과값
#### 기본
```
s : aaa | f : add + 1
.bbb ('.' : return address)
```
#### s가 NULL인 경우
```
s : NULL | f : add + 1
0
```
#### f가 NULL인 경우
```
(조사 필요)
```
## 주의사항
<br/>
