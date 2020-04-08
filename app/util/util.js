const path = require('path');

const getMainDirectory = path.join(process.mainModule.filename, '..', '..').toString();

const cutFilePath = (multerFilePath) => multerFilePath
    .split('\\')
    .filter(s => { if (s !== '..' && s !== 'public') return s })
    .join("\\");

exports.getMainDirectory = getMainDirectory;
exports.cutFilePath = cutFilePath;