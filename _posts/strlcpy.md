# strlcpy
```c
size_t strlcpy(char *dest, const char *src, size_t size)
```

strlcpy 함수는 dest에 src를 복사하는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. dest : 복사될 문자열의 시작 주소
##### 2. src  : 복사할 문자열의 시작 주소
##### 3. size : 복사할 바이트 수

### 반환값
src의 길이<br/>

## 입력값에 따른 결과값
#### 기본
```
dest : aaaaa | src : bbb | size : 3
dest : bbbaa
3

dest : aaaaa | src : bbb | size : 1
dest : baaaa
3

dest : aaaaa | src : bbb | size : 2
dest : bbaaa
3
```
#### size가 dest나 src보다 클 때
```
dest : aaaaa | src : bbb | size : 7
dest : bbbaa
3

dest : aaaaa | src : bbb | size : 8
dest : bbbaa
3
```
#### dest나 src가 NULL인 경우
```
dest : NULL or src : NULL | size : -
0
```
#### size가 0인 경우
```
dest : !NULL or src : !NULL | size : 0
3
```
## 주의사항
strlcpy의 경우 null의 자리를 보장한다는 특징이 있다. 이전에 구현했던 memcpy와 기능이 유사하지만 차이점은 명확하다. memcpy의 경우 입력받은 n만큼 계속 복사를 진행하지만 strlcpy의 경우 src가 null이 나오는 경우와 size 만큼 반복문이 실행되면 종료되게 된다. 즉, memcpy보다 복사하는 제한조건이 더 많은 셈이다.<br/>
