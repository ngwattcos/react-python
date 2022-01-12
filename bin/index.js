#! /usr/bin/env node

/**
 * This file will call an instance of 'chokidar'
 * to watch an input directory for changes
 *
 */

const fs = require("fs");
const compiler = require("./compiler");
const files = require("./files");

compiler.setup({
  os: process.platform,
  version: "0.1",
});

const optionalSlash = (dir) => {
  return dir.substring(dir.length - 1, dir.length) !== "/" ? "/" : "";
};

const withoutSlash = (dir) => {
  if (dir.substring(dir.length - 1, dir.length) === "/") {
    return dir.substring(0, dir.length - 1);
  } else {
    return dir;
  }
};

/** Recursively reads a directory and calls callbacks on files and directories */
const traverseAllFiles = (dir, cbFile, cbDir, root) => {
  fs.readdir(dir, (err, files) => {
    files.forEach((path) => {
      const fullPath = `${dir}/${path}`;
      const pathInDir = fullPath.replace(root, "");

      if (fs.statSync(`${dir}/${path}`).isDirectory()) {
        cbDir(pathInDir);
        traverseAllFiles(`${dir}/${path}`, cbFile, cbDir, root);
      } else {
        if (
          pathInDir.substring(pathInDir.length - 4, pathInDir.length) === ".pyx"
        ) {
          cbFile(pathInDir);
        }
      }
    });
  });
};

const main = async () => {
  try {
    let rawConfig = fs.readFileSync("react-python-config.json");
    let configData = JSON.parse(rawConfig);

    // should be read from json
    if (!files.directoryExists(`${configData.inDir}`)) {
      throw new Error("invalid input dir, run react-python-setup again");
    }
    if (!files.directoryExists(`${configData.inDir}`)) {
      throw new Error("invalid output dir, run react-python-setup again");
    }

    const inDir = withoutSlash(configData.inDir);
    const outDir = withoutSlash(configData.outDir);
    const inDirSlash = configData.inDir + optionalSlash(configData.inDir);
    const outDirSlash = configData.outDir + optionalSlash(configData.outDir);
    const root = `${inDir}/`;

    console.log(`input directory: ${inDir}`);
    console.log(`output directory: ${outDir}`);

    if (inDir === outDir) {
      // avoid cycles
      throw new Error("Input and output directories are the same");
    }

    await files.clean(outDirSlash);

    if (compiler.supportedOs(process.platform)) {
      traverseAllFiles(
        `${inDir}`,
        (fName) => {
          console.log(fName);
          compiler.transpile(inDirSlash, outDirSlash, fName);
        },
        (dirName) => {
          compiler.addDirectory(outDirSlash, dirName);
        },
        root
      );
    } else {
      throw new Error("Unsupported OS: " + process.platform);
    }
  } catch (err) {
    console.log(err);
  }
};

main();
