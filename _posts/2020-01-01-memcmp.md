# memcmp
```c
int memcmp(const void *s1, const void *s2, size_t n)
```

memcmp 함수는 입력 받은 두 문자열을 비교하여 같은지 판단하는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s1 : 문자열 1의 시작 주소
##### 2. s2 : 문자열 2의 시작 주소
##### 3. n  : 비교할 바이트 수

### 반환값
같은 경우 : 0<br/>
다른 경우 : *s1 - *s2
+
*s1 > *s2 : 1
*s1 < *s2 : -1

## 입력값에 따른 결과값
#### 기본
```
s1 : aaa | s2 : bbbsdfs
-1

s1 : aaa | s2 : abbsd
0

s1 : aaa | s2 : aca
-2

s1 : baa | s2 : aca
1

s1 : aaaaaa | s2 : aaaaa
65
```
#### s1이나 s2의 길이 보다 n이 더 긴 경우 (s1과 s2 이후 메모리는 0으로 초기화 되었다고 가정)
```
기본과 동일
```
#### n이 0인 경우
```
dest : - | c : - | n : 0
0
```
#### s1이나 s2에 NULL 이 오는 경우
```
s1 : NULL or s2 : NULL | c : - | n : !0
segmentation fault
```
## 주의사항
memchr 역시 메모리 연산으로 1byte씩 읽고 쓰는 과정을 진행한다. 따라서 형변환을 기억해야 한다.<br/>
