const path = require('path');


const getMainDirectory = path.join(process.mainModule.filename, '..', '..').toString();


exports.getMainDirectory = getMainDirectory;