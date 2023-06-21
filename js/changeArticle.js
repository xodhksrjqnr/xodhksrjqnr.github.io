function changeArticle(content, side) {
    document.getElementById('side').replaceChildren();
    document.getElementById('content').replaceChildren();
    $("#side").load(side);
    load(content);
}