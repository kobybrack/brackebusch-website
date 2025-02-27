const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'post.md');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    const jsonString = JSON.stringify(data);
    console.log(jsonString);
});
