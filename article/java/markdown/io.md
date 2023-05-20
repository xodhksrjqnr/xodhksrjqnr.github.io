# JAVA

## 15. 입출력 I/O

### 15.1. 자바에서의 입출력

### 15.1.1. I/O

I/O(Input, Output의 약자)는 입출력을 의미하며, 컴퓨터 내부 또는 외부의 장치와 프로그램간의 데이터를
주고 받는 것을 의미한다. 키보드로 데이터를 입력하거나, System.out.println()을 이용해 화면에 출력하
는 것이 가장 기본적인 입출력의 예이다.

### 15.1.2. 스트림 Stream

스트림이란 자바에서 데이터를 운반하는데 사용되는 연결통로이다. stream이라는 단어의 의미와 유사하게
단방향통신만 가능하기 때문에 입력과 출력을 동시에 수행하기 위해선 입력 스트림과 출력 스트림 두 가지가
필요하다.

스트림은 큐(Queue)와 같은 [FIFO](http://www.ktword.co.kr/test/view/view.php?m_temp1=1626)
구조처럼 먼저 보낸 데이터를 먼저 받게 되고, 중간에 건너띔 없이 연속적으로 데이터를 주고받는다는 특징이 있다.

✲ 여기서 설명하는 스트림은 람다와 스트림에서의 스트림과는 다른 개념이다. 

### 15.2. 바이트기반 스트림

### 15.2.1. InputStream, OutputStream

InputStream과 OutputStream은 모든 바이트기반 스트림의 조상이며 다음과 같은 메서드가 선언되어 있다.

<img width="702" alt="스크린샷 2023-04-30 오후 5 47 08" src="https://user-images.githubusercontent.com/48250370/235344219-607f7e7c-b97f-4ef5-a841-8057f1426120.png">

| 메서드명                                       | 설명                                                                                                              |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| abstract int read()                        | 1 byte를 읽어 온다(0-255 사이의 값). 더 이상 읽어 올 데이터가 없으면 -1을 반환한다. 추상메서드로 자손들은 자신의 상황에 알맞게 구현해야 한다.                       |
| int read(byte[] b)                         | 배열 b의 크기만큼 읽어서 배열을 채우고 읽어 온 데이터의 수를 반환한다. 반환하는 값은 항상 배열의 크기보다 작거나 같다.                                           |
| int read(byte[] b, int off, int len)       | 최대 len개의 byte를 읽어서, 배열 b의 지정된 위치(off)부터 저장한다. 실제로 읽어 올 수 있는 데이터가 len개보다 적을 수 있다.                                |
| byte[] readNBytes(int len)                 | 스트림으로부터 최대 len개의 byte를 읽어서 반환한다.                                                                                |
| byte[] readAllBytes()                      | 스트림으로부터 읽어 올 수 있는 모든 byte를 반환한다.                                                                                |
| int readNBytes(byte[] b, int off, int len) | 스트림으로부터 off번째부터 최대 len개의 byte를 읽어서 배열 b에 채운다.                                                                   |
| int available()                            | 스트림으로부터 읽어 올 수 있는 데이터의 크기를 반환한다.                                                                                |
| void close()                               | 스트림을 닫음으로써 사용하고 있던 자원을 반환한다.                                                                                    |
| boolean markSupported()                    | mark()와 reset()을 지원하는 지를 알려준다. mark()와 reset() 기능을 지원하는 것은 선택적이므로, mark()와 reset()을 사용하기 전에 호출하여 지원여부를 확인해야 한다. |
| void mark(int readlimit)                   | 현재 위치를 표시해 놓는다. 후에 reset()에 의해서 표시해 놓은 위치로 다시 돌아갈 수 있다. readlimit은 되돌아갈 수 있는 byte의 수이다.                         |
| void reset()                               | 스트림에서의 위치를 마지막으로 mark()이 호출되었던 위치로 되돌린다.                                                                        |
| long skip(long n)                          | 스트림에서 주어진 길이(n)만큼을 건너뛴다.                                                                                        |
| long transferTo(OutputStream out)          | InputStream의 데이터를 매개변수로 받은 OutputStream에 읽은 순서대로 채운다.                                                           |
| InputStream nullInputStream()              | 데이터가 비어있는 InputStream 인스턴스를 생성하고 반환한다.                                                                          |

| 메서드명                                   | 설명                                                   |
|----------------------------------------|------------------------------------------------------|
| abstract void write(int b)             | 주어진 값을 출력소스에 쓴다. 추상메서드로 자손들은 자신의 상황에 알맞게 구현해야 한다.    |
| void write(byte[] b)                   | 주어진 배열 b에 저장된 모든 내용을 출력소스에 쓴다.                       |
| void write(byte[] b, int off, int len) | 주어진 배열 b에 저장된 내용 중에서 off번째부터 len개 만큼만을 읽어서 출력소스에 쓴다. |
| void flush()                           | 스트림의 버퍼에 있는 모든 내용을 출력소스에 쓴다.                         |
| void close()                           | 입력소스를 닫음으로써 사용하고 있던 자원을 반환한다.                        |
| OutputStream nullOutputStream()        | 데이터가 비어있는 OutputStream 인스턴스를 생성하고 반환한다.              |

스트림의 종류에 따라서 mark()와 reset()을 사용하여 이미 읽은 데이터를 다시 읽을 수 있으며, 해당 기능의
지원 여부는 markSupported()를 이용한다.

flush()는 버퍼가 있는 출력스트림의 경우에만 있으며, OutputStream에 정의된 flush()는 아무런 일도 하지 않는다.

프로그램이 종료될 때, 사용하고 닫지 않은 스트림을 JVM이 자동적으로 닫아 주지만, 작업을 마친 후에는 반드시
close()를 호출해서 사용한 자원을 반환해주어야 한다. 그러나 ByteArrayInputStream과 같이 메모리를
사용하는 스트림과 System.in, System.out과 같은 표준 입출력 스트림은 닫아주지 않아도 된다. 해당 이유는
각 파트에서 다루는 내용을 살펴보자.

### 15.2.2. 바이트기반 스트림의 종류

스트림은 바이트단위로 데이터를 전송하며 입출력 대상에 따라 종류가 구분된다.

| 입력스트림                | 출력스트림                 | 입출력 대상의 종류      |
|----------------------|-----------------------|-----------------|
| FileInputStream      | FileOutputStream      | 파일              |
| ByteArrayInputStream | ByteArrayOutputStream | 메모리(byte 배열)    |
| PipedInputStream     | PipedOutputStream     | 프로세스(프로세스간의 통신) |
| AudioInputStream     | AudioOutputStream     | 오디오 장치          |

이들 모두 InputStream, OutputStream의 자손들이며, 각각 읽고 쓰는데 필요한 추상메서드를 자신에
맞게 구현해 놓았다.

자바에선 java.io 패키지를 통해 많은 종류의 입출력관련 클래스들과 입출력 처리를 위한 표준화된 방법을
제공함으로써 입출력 대상이 달라져도 동일한 방법으로 입출력이 가능하다.

### 15.2.3. ByteArrayInputStream과 ByteArrayOutputStream

바이트 배열에 데이터를 입출력하는데 사용되는 스트림으로 주로 다른 곳에 입출력하기 전에 데이터를 임시로
바이트 배열에 담아 변환 등의 작업을 하는데 사용된다.

바이트 배열의 경우 메모리 자원만 사용하기 때문에 가비지컬렉터에 의해 자동적으로 자원을 반환한다. 따라서
앞서 설명한 close()를 이용해 스트림을 닫지 않아도 된다.

배열을 이용한 입출력은 작업의 효율을 증가시키므로 되도록 입출력 대상에 따라 알맞은 크기의 배열을 사용하는
것이 좋다.

여기서 [ByteArrayInputStream](https://github.com/xodhksrjqnr/practice/blob/main/java/src/test/java/io/ByteArrayInputStreamTest.java)과
[ByteArrayOutputStream](https://github.com/xodhksrjqnr/practice/blob/main/java/src/test/java/io/ByteArrayOutputStreamTest.java)
테스트 코드를 확인하자. 

### 15.2.4. FileInputStream과 FileOutputStream

파일에 입출력을 하기위한 스트림으로 파일 접근을 위한 다양한 생성자가 존재한다.

| 생성자                                           | 설명                                                                                                                    |
|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| FileInputStream(String name)                  | 지정된 파일명(name)을 가진 실제 파일과 연결된 FileInputStream을 생성한다.                                                                   |
| FileInputStream(File file)                    | 파일명이 아닌 File 인스턴스를 이용하여 FileInputStream을 생성한다.                                                                        |
| FileInputStream(FileDescriptor fdObj)         | 파일 디스크립터(fdObj)로 FileInputStream을 생성한다.                                                                               |
| FileOutputStream(String name)                 | 지정된 파일명(name)을 가진 실제 파일과 연결된 FileOutputStream을 생성한다.                                                                  |
| FileOutputStream(String name, boolean append) | 지정된 파일명(name)을 가진 실제 파일과 연결된 FileOutputStream을 생성한다. append가 true인 경우 출력 시 기존 파일 내용에 덧붙이고, false인 경우 기존 파일의 내용을 덮어쓴다. |
| FileOutputStream(File file)                   | 파일명이 아닌 File 인스턴스를 이용하여 FileOutputStream을 생성한다.                                                                       |
| FileOutputStream(File file, boolean append)   | 파일명이 아닌 File 인스턴스를 이용하여 FileInputStream을 생성한다.  append가 true인 경우 출력 시 기존 파일 내용에 덧붙이고, false인 경우 기존 파일의 내용을 덮어쓴다.      |
| FileOutputStream(FileDescriptor fdObj)        | 파일 디스크립터(fdObj)로 FileOutputStream을 생성한다.                                                                              |

ByteArrayInputStream, ByteArrayOutputStream과는 다르게 데이터를 읽거나 저장할 때 파일에
대한 접근 과정이 필요하며 추가적인 자원(FileChannel, FileDescriptor)이 필요하게 된다. 해당 자원을
사용하고 close()를 하지 않는 경우 제거되지 않고 사용량을 차지하고 있어 메모리가 점차 부족해질 수 있다.
따라서 사용이 끝난 경우 반드시 close() 메서드 호출하여 자원을 반환해 주어야 한다.

여기서 [FileInputStream]()과
[FileOutputStream]()
테스트 코드를 확인하자.

텍스트 파일을 다루는 경우에는 FileInputStream, FileOutputStream 대신 FileReader, FileWriter를
사용하는 것이 좋으며 이에 대한 자세한 내용은 문자기반 스트림에서 다루도록 한다.

### 15.1.4. 보조 스트림

앞서 언급한 스트림 외에도 스트림의 기능을 보완하기 위한 보조 스트림이 존재한다. 보조 스트림은 실제 데이터를
주고받는 스트림이 아니기 때문에 데이터를 입출력할 수 있는 기능은 없지만, 스트림의 기능을 향상시키거나 새로운
기능을 추가할 수 있다. 보조 스트림은 다음과 같이 먼저 생성한 스트림을 이용해 생성하는 방식을 사용한다.

```java
FileInputStream fis = new FileInputStream("test.txt");
BufferedInputStream bis = new BufferedInputStream(fis);
bis.read();
```

다음은 FilterInputStream과 그 자손들이다.

| 입력                    | 출력                   | 설명                                                  |
|-----------------------|----------------------|-----------------------------------------------------|
| FilterInputStream     | FilterOutputStream   | 필터를 이용한 입출력 처리                                      |
| BufferedInputStream   | BufferedOutputStream | 버퍼를 이용한 입출력 성능향상                                    |
| DataInputStream       | DataOutputStream     | int, float와 같은 기본형 단위(primitive type로 데이터를 처리하는 기능) |
| SequenceInputStream   | x                    | 두 개의 스트림을 하나로 연결                                    |
| LineNumberInputStream | x                    | 읽어 온 데이터의 라인 번호를 카운트(JDK1.1부터 LineNumberReader로 대체) |
| ObjectInputStream     | ObjectOutputStream   | 데이터를 객체단위로 읽고 쓰는데 사용. 주로 파일을 이용하며 객체 직렬화와 관련있음      |
| x                     | PrintStream          | 버퍼를 이용하며, 추가적인 print 관련 기능                          |
| PushbackInputStream   | x                    | 버퍼를 이용해서 읽어 온 데이터를 다시 되돌리는 기능                       |

### 15.1.5. 문자기반 스트림 - Reader, Writer

자바에서는 한 문자를 의미하는 char형이 2 byte이기 때문에 바이트기반의 스트림으로 문자를 처리하는 데는 어려움이
있다. 이 점을 보완하기 위해 문자기반의 스트림이 제공된다. 간단하게 기존 InputStream은 Reader, OutputStream은
Writer로 변경되었다고 생각하면 된다.

| 바이트기반 스트림                                                           | 문자기반 스트림                           |
|---------------------------------------------------------------------|------------------------------------|
| FileInputStream<br>FileOutputStream                                 | FileReader<br>FileWriter           |
| ByteArrayInputStream<br>ByteArrayOutputStream                       | CharArrayReader<br>CharArrayWriter |
| PipedInputStream<br>PipedOutputStream                               | PipedReader<br>PipedWriter         |
| StringBufferInputStream<br>StringBufferOutputStream (둘 다 더 이상 사용 x) | StringReader<br>StringWriter       |

바이트기반 스트림의 구성과 비교해도 큰 차이는 없으면 매개변수로 byte[]대신 char[]를 사용한다는 차이가
있다.

보조 스트림 또한 다음과 같이 이름의 일부가 바뀌는 정도이다.

| 바이트기반 보조 스트림                                | 문자기반 보조 스트림                      |
|---------------------------------------------|----------------------------------|
| BufferedInputStream<br>BufferedOutputStream | BufferedReader<br>BufferedWriter |
| FilterInputStream<br>FilterOutputStream     | FilterReader<br>FilterWriter     |
| LineNumberInputStream (더 이상 사용 x)           | LineNumberReader                 |
| PrintStream                                 | PrintWriter                      |
| PushbackInputStream                         | PushbackReader                   |

### 15.2. 바이트기반 스트림