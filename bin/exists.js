const fs = require('fs');
const path = require('path');


// copied from tutorial at:
// https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
module.exports.directoryExists = (filePath) => {
  return fs.existsSync(filePath);
};