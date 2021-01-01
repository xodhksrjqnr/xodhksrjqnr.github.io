# bzero
```c
void bzero(void *s, size_t n)
```

bzero 함수는 메모리를 0으로 초기화하는 기능이다. 즉, memset(s, 0, n)과 동일하다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s : 초기화 시킬 메모리의 시작 주소
##### 2. n : 초기화 시킬 메모리의 길이(바이트 수)

### 반환값
none<br/>

## 입력값에 따른 결과값
#### 기본
```
s : aaaaa | n : 0,3
aaaaa
000aa
```
#### s의 범위를 넘어선 n 값이 들어온 경우
```
s : aaaaa | n : 7
00000.00 ('.' : 기존 s의 범위)
```
#### s가 NULL이 들어온 경우
```
s : NULL | n : -
segmentation fault
```
## 주의사항
none<br/>
