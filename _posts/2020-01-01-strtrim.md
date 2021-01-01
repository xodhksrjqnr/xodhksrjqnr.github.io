# strtrim
```c
char *strtrim(char const *s1, char const *set)
```

strtrim 함수는 문자열의 앞뒤에 있는 set을 제거하는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s1  : 문자열의 시작 주소
##### 2. set : 제거할 문자들

### 반환값
앞뒤로 문자셋이 제거된 문자열의 시작 주소<br/>

## 입력값에 따른 결과값
#### 기본
```
s1 : ....aa...a.a.... | set : .
aa...a.a

s1 : aaa | set : b
aaa

s1 : baaabb | set : b
aaa

s1 : cbdaaabcbd | set : bcd
aaa
```
#### s1에 NULL이 오는 경우
```
s1 : NULL | set : -
0
```
## 주의사항
이 함수에서 주의해야될 점은 문자열에 있는 모든 문자셋을 지우는 것이 아닌 문자열의 앞뒤에 있는 문자열만 제거하는 점이다.<br/>
