/**
 * Invokes the transpiler on a single file
 */

const shell = require('shelljs');
// const exists = require('./exists');

const transpile = (inDir, outDir, path) => {
    if (shell.exec(`./main.byte ${path} ${inDir} ${outDir}`).code !== 0) {
        shell.echo(`Error in compiling ${path}`);
        shell.exit(1);
    }
}

const addDirectory = (outDir, path) => {
    if (shell.exec(`mkdir -p ../${outDir}${path}`).code !== 0) {
        shell.echo(`Error in creating directory ${path}`);
        shell.exit(1);
    }
}

module.exports = { transpile, addDirectory };