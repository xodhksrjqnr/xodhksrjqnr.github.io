function set (path) {
    $(document).ready( function() {$("#header").load("../../../component/header.html");});
    $(document).ready( function() {$("#side").load("../side.html");});
    $.get(path, function(data) {
        const htmlContent = document.createElement("div");
        var converter = new showdown.Converter();
        htmlContent.innerHTML = converter.makeHtml(data);
        document.getElementById('main').appendChild(htmlContent)
    })
}