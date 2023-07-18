function changeUrl(title, url, state) {
    if (typeof (history.pushState) != "undefined") { //브라우저가 지원하는 경우
        history.pushState(state, title, url);
    }
    else {
        location.href = url; //브라우저가 지원하지 않는 경우 페이지 이동처리
    }
}