function createPage(path, flag) {
    document.getElementById('type').replaceChildren();

    const path1 = '/article/' + path + '.md';
    const path2 = '/article/' + path + '-summarize.md';

    const button1 = document.createElement('button');

    button1.addEventListener('click', () => load(path1));
    button1.innerText = '번역';
    document.getElementById('type').appendChild(button1);

    if (flag) {
        const button2 = document.createElement('button');

        button2.addEventListener('click', () => load(path2));
        button2.innerText = '정리';
        document.getElementById('type').appendChild(button2);
    }

    load(path1);
}