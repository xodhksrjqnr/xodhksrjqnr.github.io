# memccpy
```c
void *memccpy(void *s, const void *src, int c, size_t n)
```

memccpy 함수는 dest에 src의 특정 문자까지 복사하는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. dest : 복사될 메모리의 시작 주소
##### 2. src  : 복사할 메모리의 시작 주소
##### 2. c    : 복사를 멈출 src의 문자
##### 3. n    : 복사할 바이트 수

### 반환값
c를 찾은 경우 : c가 복사된 메모리의 다음 주소<br/>
c를 찾지 못한 경우 : 0

## 입력값에 따른 결과값
#### 기본
```
dest : aaaaa | src : bbc | c : c | n : 3
dest : bbc.aa ('.' : return address)
```
#### c가 src의 n 바이트 안에 없는 경우
```
dest : aaaaa | src : bbct | c : y | n : 3
dest : bbcaa
0

dest : aaaaa | src : bbcy | c : y | n : 3
dest : bbcaa
0
```
#### n의 길이가 dest나 src보다 긴 경우
```
dest : aaaaa | src : bbct | c : y | n : 7
dest : bbct???
0

dest : aaaaa | src : bbcy | c : y | n : 7
dest : bbcy.a ('.', return address)
```
#### n이 0인 경우
```
dest : - | src : - | c : - | n : 0
0
```
#### dest나 src에 NULL 이 오는 경우
```
dest : NULL or src : NULL | c : - | n : !0
segmentation fault
```
## 주의사항
memccpy 역시 메모리 연산으로 1byte씩 읽고 쓰는 과정을 진행한다. 따라서 형변환을 기억해야 한다.<br/>
