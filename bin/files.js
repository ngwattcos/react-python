const fs = require('fs');
const shell = require('shelljs');


// copied from tutorial at:
// https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
const directoryExists = (filePath) => {
  return fs.existsSync(filePath);
};

const clean = async (outDir, path) => {
  if (shell.exec(`rm -rf ${outDir}`).code !== 0) {
      shell.echo(`Error in deleting ${path}`);
      shell.exit(1);
  }
}

module.exports = { directoryExists, clean };