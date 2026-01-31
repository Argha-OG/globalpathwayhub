const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const readData = (fileName) => {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error parsing ${fileName}:`, err);
        return [];
    }
};

const writeData = (fileName, data) => {
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readData, writeData };
