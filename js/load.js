function load(target) {
    $.get(target, function(data) {
        document.getElementById('content').innerText = "";
        const htmlContent = document.createElement("div");
        var converter = new showdown.Converter({extensions: ['table']});
        converter.setFlavor('github');
        htmlContent.innerHTML = converter.makeHtml(data);
        document.getElementById('content').appendChild(htmlContent);
        document.querySelectorAll('code').forEach(el => {
            hljs.highlightElement(el);
        });
    })
}