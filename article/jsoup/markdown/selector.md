# Class Selector [#](https://jsoup.org/apidocs/org/jsoup/select/Selector.html)

## Selector Syntax

selector는 콤비네이터로 구분된 단순 selectors의 체인이며, 대소문자를 구분하지 않는다.
(요소, 속성 및 속성 값 포함)

범용 selector(*)는 요소 selector가 제공되지 않았을 때 기본값으로 사용된다. 예를
들면, *.header와 .header는 동일하다.

| Method                                                        | Description |
|---------------------------------------------------------------|------------|
| static Elements select(String query, Iterable<Element> roots) |            |
| static Elements select(String query, Element root)            ||
| static Elements select(Evaluator evaluator, Element root)     ||
| static Element selectFirst(String cssQuery, Element root)     ||

selector에서 사용하는 패턴과 의미는 다음과 같다.

| Pattern               | Matches  | Example |
|-----------------------|----------|---------|
| *                     | 임의의 요소   | *       |
| tag                   | html 태그명 | div     |
| * &#124; E            |||
| ns &#124; E           |||
| #id                   |||
| .class                |||
| [attr]                |||
| [^attrPrefix]         |||
| [attr=val]            |||
| [attr="val"]          |||
| [attr^=valPrefix]     |||
| [attr$=valSuffix]     |||
| [attr*=valContaining] |||
| [attr~=regex]         |||