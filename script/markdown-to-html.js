const getContent = (content) => {
    const filePath = process.cwd() + content;
    const fileContents = fs.readFileSync(filePath, 'utf8');

    return fileContents;
}

