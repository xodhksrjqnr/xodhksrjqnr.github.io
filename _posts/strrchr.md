# strrchr
```c
char *strrchr(const char *s, int c)
```

strrchr 함수는 strchr 함수와는 다르게 뒤에서 부터 찾는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s : 문자를 찾을 메모리의 시작 주소
##### 2. c : 찾을 문자

### 반환값
c를 찾은 경우 : c의 메모리 주소<br/>
c를 찾지 못한 경우 : 0

## 입력값에 따른 결과값
#### 기본
```
s : aabaa | c : b
s : aa.baa ('.' : return address)

s : aabab | c : b
s : aaba.b ('.' : return address)
```
#### s가 NULL인 경우
```
s : NULL | c : -
segmentation fault
```
#### s가 NULL이 아니고 c가 0인 경우
```
s : aaca | c : c
s : aa.ca ('.' : return address)
```
#### s의 마지막에 NULL이 없는 경우
```
s : aaaa | c : c (s 이후로는 메모리가 0으로 초기화되어 있다고 가정)
s : aaaa. ('.' : return address)
```
## 주의사항
strchr와 동일<br/>
