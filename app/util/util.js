const path = require('path');


const getMainDirectory = path.join(process.mainModule.filename, '..');


exports.getMainDirectory = getMainDirectory;