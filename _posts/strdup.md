# strdup
```c
char *strdup(const char *s)
```

strdup 함수는 s의 길이만큼 동적 할당후 s를 복사하는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s : 복사할 문자열의 시작 주소

### 반환값
동적 할당된 메모리의 시작 주소<br/>

## 입력값에 따른 결과값
#### 기본
```
s : "aabaa"
.aabaa ('.' : return address)

s : ""

```
#### s에 NULL이 오는 경우
```
s : NULL
segmentation fault
```
## 주의사항
none<br/>
