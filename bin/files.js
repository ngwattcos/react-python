const fs = require("fs");
const shell = require("shelljs");

/**
 * Tools for checking whether a directory exists or to clean a directory
 */

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
  shell.exec(`mkdir ${outDir}`);
};

module.exports = { directoryExists, clean };
