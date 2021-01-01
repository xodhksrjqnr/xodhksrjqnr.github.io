# memmove
```c
void *memmove(void *dest, const void *src, size_t n)
```

memmove 함수는 memcpy 함수에 중복성을 고려한 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. dest : 복사될 메모리의 시작 주소
##### 2. src  : 복사(참조)할 메모리의 시작 주소
##### 3. n    : 복사할 메모리의 길이(바이트 수)

### 반환값
dest <br/>

## 입력값에 따른 결과값
#### 기본
```
dest : "aaaaaa" | src : "bbbb" | n : 3,4
dest : .bbbaaa ('.' : return address)
dest : .bbbbaa ('.' : return address)
```
#### n이 0인 경우
```
dest : "aaaaaa" | src : - | n : 0
dest : .aaaaaa ('.' : return address)

dest : NULL | src : - | n : 0
0x0
```
#### dest와 src가 모두 NULL인 경우
```
dest : NULL | src : NULL | n : !0
0x0
```
#### dest나 src가 NULL이고 n이 0이 아닌 경우
```
dest : NULL | src : !NULL | n : !0
segmentation fault

dest : !NULL | src : NULL | n : !0
segmentation fault
```
#### dest나 src보다 n이 긴 경우
```
dest : "aaa" | src : "bbbbb" | n : 5 (dest와 src 이후로는 0으로 초기화되었다고 가정)
dest : .bbbbb ('.' : return address)
```
## 주의사항
memmove 함수는 앞서 말했듯이 memcpy의 중복성을 고려한 함수이다. 기본적으로 결과값은 memcpy와 같지만 특수한 경우(dest와 src가 몇 바이트 차이가 없는 경우, dest와 src가 서로 중복이 생길만큼 n의 길이가 큰 경우)에 대한 처리가 필수적이다.<br/>
