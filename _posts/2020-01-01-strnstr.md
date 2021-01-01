# strnstr
```c
char	*ft_strnstr(const char *s1, const char *s2, size_t len)
```

strnstr 함수는 s1에서 s2 문자열이 있는지 찾는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s1  : 문자열의 시작 주소
##### 2. s2  : 찾을 문자열의 시작 주소
##### 3. len : 찾을 바이트 수

### 반환값
찾은 경우 : 찾은 문자열이 시작되는 s1의 주소<br/>
못 찾은 경우 : 0

## 입력값에 따른 결과값 (수정중)
#### 기본
```
s1 : aaaaa | s2 : bbb | len : 3, 5
0

s1 : aabba | s2 : bb | len : 3, 5
0
aa.bba ('.' : s1에서 s2가 있는 메모리 주소)
```
#### s2에 NULL이 오는 경우
```
s1 : - | s2 : NULL | len : -
segmentation fault
```
#### 입력 받은 
```
s1 : - | s2 : NULL | len : -
segmentation fault
```
## 주의사항
이 함수에서 주의해야될 점은 문자열에 있는 모든 문자셋을 지우는 것이 아닌 문자열의 앞뒤에 있는 문자열만 제거하는 점이다.<br/>
