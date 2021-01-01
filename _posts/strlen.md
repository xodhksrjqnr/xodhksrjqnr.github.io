# strlen
```c
size_t *strlen(const char *s)
```

strlen 함수는 s의 길이는 구하는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. s : 길이를 구할 문자의 시작 주소

### 반환값
s의 길이

## 입력값에 따른 결과값
#### 기본
```
s : aabaa
5
```
#### s가 NULL인 경우
```
s : NULL
segmentation fault
```
## 주의사항
none<br/>
