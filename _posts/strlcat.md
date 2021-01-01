# strlcat
```c
size_t strlcat(char *dest, const char *src, size_t size)
```

strlcat 함수는 dest 뒤에 src를 복사하여 붙이는 기능이다.<br/>
입력받는 매개변수는 아래와 같다.<br/>

##### 1. dest : 복사될 문자열의 시작 주소
##### 2. src  : 복사할 문자열의 시작 주소
##### 3. size : 복사할 바이트 수

### 반환값
dest의 길이가 size보다 크거나 같은 경우 : size + src 길이<br/>
dest의 길이가 sizq보다 작은 경우 : dest + src 길이

## 입력값에 따른 결과값
#### 기본
```
dest : aaaaa | src : bbb | size : 3
dest : aaaaa
6

dest : aaaaa | src : bbb | size : 1
dest : aaaaa
4
```
#### size가 dest나 src보다 클 때
```
dest : aaaaa | src : bbb | size : 7
dest : aaaaab
8

dest : aaaaa | src : bbb | size : 10
dest : aaaaabbb
8
```
#### dest나 src가 NULL인 경우
```
dest : NULL or src : NULL | size : -
segmentation fault
```
## 주의사항 ()
strlcat 또한 널값 자리를 보장하는 함수이다. 이에 따라 입력받은 size에서 미리 널값의 자리를 생각하고 코드를 구현해야 한다.<br/>

다양한 테스터기를 돌려보며 오류를 발견하게 되었다. 최신 버전의 테스트기에서는 문제 없었지만 구버젼 테스터기의 경우 아래 코드에서 dest 끝에 NULL이 없는 문자열이 들어온 경우, abort error가 발생한 것을 확인하였다.
```c
size_t		ft_strlcat(char *dest, const char *src, size_t size)
{
	size_t		dest_count;
	size_t		src_count;
	size_t		result;

	dest_count = 0;
	while (*dest)
	{
		dest++;
		dest_count++;
	}
	src_count = 0;
	while (src_count + dest_count + 1 < size && *src)
	{
		*dest++ = *src++;
		src_count++;
	}
	*dest = 0;
	while (*src++)
		src_count++;
	result = (dest_count >= size) ? size : dest_count;
	result += src_count;
	return (result);
}
```
구글에서 검색을 통해 abort error에 대해 찾으면 비슷한 문제가 발생한 사례를 찾을 수 있었다. 아래 코드는 유사 사례의 코드이다. 이 경우 두번째 반복문에서 리터럴의 값을 변경하려하기 때문에 오류가 발생하였다.
```c
char    *ft_strcat(char *dest, char *src)
{
    int i;
    int k;

    i = 0;
    k = 0;
    while (dest[i])
        i++;
    while (src[k])
    {
        dest[i + k] = src[k];//오류 발생
        k++;
    }
    dest[i + k] = '\0';
    return (dest);
}

int main(){
    char str[] = "Hello, "; //const
    char str2[] = "World!"; //const
    printf("%s", ft_strcat(str, str2));
    return 0;
}
```
리터럴이란 const 로 선언된 변수이다. 즉, 값이 바뀌지 않게 시스템에 의해 보호되고 있는 값들이다. 위에 코드에선  dest[i + k] = src[k] 부분에서 const 형의 변수값을 변경하려는 의도로 abort error가 발생하였다.<br/>

다시 내가 구현한 코드로 돌아가보면 첫번째 while문으로 dest는 dest 문자열의 마지막 값을 가리키는 형태에서 멈추게 된다. 두번째 while문이 진행된 경우 현재 dest가 가리키는 위치의 값을 변경하게 되고 이는 유사 사례에서와 마찬가지로 리터럴 값을 변경하려는 의도로 판단되어 abort error가 발생하게 된다.<br/>

아래 코드는 dest와 src의 길이를 미리 구한 뒤 이를 비교하여 dest의 길이가 size보다 크거나 같은 경우 조건문으로 함수를 종료함과 이후 진행에서 dest += d_count를 통해 dest의 범위를 벗어나 abort error를 방지하였다.
```c
size_t		ft_strlcat(char *dest, const char *src, size_t size)
{
	size_t		d_count;
	size_t		s_count;
	size_t		count;

	d_count = ft_strlen(dest);
	s_count = ft_strlen(src);
	if (d_count >= size)
		return (size + s_count);
	count = 0;
	dest += d_count;
	while (count++ + d_count + 1 < size && *src)
		*dest++ = *src++;
	*dest = 0;
	return (s_count + d_count);
}
```

##### 참고 자료
https://stackoverflow.com/questions/45937212/c-zsh-abort-error<br/>
https://modoocode.com/33
