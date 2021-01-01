# strchr
```c
char *strchr(const char *s, int c)
```

strchr 함수는 s에서 특정 문자를 찾는 기능이다.<br/>
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
결과값 3번째의 경우 c가 0인 경우에도 반환되는 s의 주소값이 바뀌는 점을 유의해야 한다. 이 경우 반환되는 주소값을 통해 c가 있는 지 s에서 찾아보는 과정이 실행된 후 c가 0인지를 판단하는 것을 알 수 있다.<br/>

결과값의 마지막 경우는 입력받은 문자열의 끝에 null이 없는 경우이다. 즉, arr = malloc(5 * sizeof(char))로 동적 할당 후 memset(arr, 'a', 5) 를 실행한 결과라고 생각하면 이해하기 쉽다. 이 경우 동적 할당된 arr의 arr + 5 번 주소가 가리키는 메모리에 담긴 데이터가 결과값을 정하게 된다. 이러한 일이 발생하는 경우는 쓰레기값이 원인이 된다.<br/>

