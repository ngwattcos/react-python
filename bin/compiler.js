/**
 * Invokes the transpiler on a single file
 */

const shell = require("shelljs");
const files = require("./files");

const versionOfOs = {
  linux: "pyxyc-linux.byte",
  darwin: "pyxyc-darwin.byte",
};

let _compiler = "";

let _version = "";

const setup = ({ os, version }) => {
  _compiler = versionOfOs[os];
  _version = version;
};

const supportedOs = (os) => {
  return os in versionOfOs;
};

/**
 * Transpiles a file in the inDir directory in a given path, and with a given output directory
 */
const transpile = (inDir, outDir, path) => {
  if (
    shell.exec(`${__dirname}/../${_compiler} ${path} ${inDir} ${outDir}`)
      .code !== 0
  ) {
    shell.echo(`Error in compiling ${path}`);
    shell.exit(1);
  }
};

const addDirectory = (outDir, path) => {
  if (shell.exec(`mkdir -p ${outDir}${path}`).code !== 0) {
    shell.echo(`Error in creating directory ${path}`);
    shell.exit(1);
  }
};

module.exports = { transpile, addDirectory, setup, supportedOs };
