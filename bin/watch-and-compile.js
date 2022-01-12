#! /usr/bin/env node

/**
 * This file will call an instance of 'chokidar'
 * to watch an input directory for changes
 * and then compile files on change
 *
 */

const fs = require("fs");
const chokidar = require("chokidar");
const compiler = require("./compiler");
const files = require("./files");

compiler.setup({
  os: process.platform,
  version: "0.1",
});

/**
 * Appends a slash to a directory path if the path does not already end with a slash
 */
const withDirSlash = (dir) => {
  return dir.substring(dir.length - 1, dir.length) !== "/" ? "/" : "";
};

new Promise((resolve, reject) => {
  let rawConfig = fs.readFileSync("react-python-config.json");
  let configData = JSON.parse(rawConfig);
  resolve(configData);
})
  .then((configData) => {
    // should be read from json
    if (!files.directoryExists(`${configData.inDir}`)) {
      throw new Error("invalid input dir, run react-python-setup again");
    }
    if (!files.directoryExists(`${configData.inDir}`)) {
      throw new Error("invalid output dir, run react-python-setup again");
    }
    return configData;
  })
  .then((configData) => {
    console.log(`input directory: ${configData.inDir}`);
    console.log(`output directory: ${configData.outDir}`);

    const inDir = configData.inDir + withDirSlash(configData.inDir);
    const outDir = configData.outDir + withDirSlash(configData.outDir);

    if (inDir === outDir) {
      // avoid cycles
      throw new Error("Input and output directories are the same");
    }

    if (compiler.supportedOs(process.platform)) {
      chokidar.watch(`${configData.inDir}`).on("all", function (event, path) {
        const inPattern = `${inDir}`;
        const root = `${configData.inDir}`;

        if (path !== inPattern && path !== root) {
          const pathInDir = path.replace(inPattern, "");

          console.log(`${event}: (${inDir}) ${pathInDir}`);

          if (event === "add" || event === "change") {
            compiler.transpile(inDir, outDir, pathInDir);
          } else if (event === "addDir") {
            compiler.addDirectory(outDir, pathInDir);
          } else if (event === "unlink") {
            console.log(
              "Sorry, deleted files and directories are coming soon!"
            );
          }
        }
      });
    } else {
      throw new Error("Unsupported OS: " + process.platform);
    }
  })
  .catch((err) => {
    console.log(err);
  });
