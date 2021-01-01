# memchr
```c
void *memchr(const void *s, int c, size_t n)
```

memchr 함수는 s에서 특정 문자를 찾는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s : 문자를 찾을 메모리의 시작 주소
##### 2. c : 찾을 문자
##### 3. n : 찾는 길이

### 반환값
c를 찾은 경우 : c의 메모리 주소<br/>
c를 찾지 못한 경우 : 0

## 입력값에 따른 결과값
#### 기본
```
dest : aabaa | c : b | n : 3,5
dest : aa.baa ('.' : return address)
```
#### s의 길이보다 n이 더 긴 경우
```
dest : aaaba | c : b | n : 8
dest : aa.baa ('.' : return address)

dest : aaaaa | c : b | n : 8
0
```
#### n이 0인 경우
```
dest : - | c : - | n : 0
0
```
#### dest에 NULL 이 오는 경우
```
dest : NULL | c : - | n : !0
segmentation fault
```
## 주의사항
memchr 역시 메모리 연산으로 1byte씩 읽고 쓰는 과정을 진행한다. 따라서 형변환을 기억해야 한다.<br/>
