#! /usr/bin/env node

/**
 * This file will call an instance of 'chokidar'
 * to watch an input directory for changes
 * 
 */

const fs = require("fs");
const chokidar = require("chokidar");
const compiler = require("./compiler");
const exists = require("./exists");

compiler.setup({
  os: process.platform,
  version: "0.1"
})

const optionalSlash = (dir) => {
  return dir.substring(dir.length - 1, dir.length) !== "/" ? "/" : "";
}

new Promise((resolve, reject) => {
  let rawConfig = fs.readFileSync('react-python-config.json');
  let configData = JSON.parse(rawConfig);
  resolve(configData);
}).then(configData => {
  // should be read from json
  if (!exists.directoryExists(`${configData.inDir}`)) {
    throw new Error("invalid input dir, run react-python-setup again");
  }
  if (!exists.directoryExists(`${configData.inDir}`)) {
    throw new Error("invalid output dir, run react-python-setup again");
  }
  return configData;
}).then(configData => {
  console.log(`input directory: ${configData.inDir}`);
  console.log(`output directory: ${configData.outDir}`);

  const inDir = configData.inDir + optionalSlash(configData.inDir);
  const outDir = configData.outDir + optionalSlash(configData.outDir);

  if (inDir === outDir) {
    // avoid cycles
    throw new Error("Input and output directories are the same")
  }

  if (compiler.supportedOs(process.platform)) {
    chokidar.watch(`${configData.inDir}`).on('all', function(event, path) {


      const inPattern = `${inDir}`;
      const root = `${configData.inDir}`;
      
      if (path !== inPattern && path !== root) {
        const pathInDir = path.replace(inPattern, "");
  
        console.log(`${event}: (${inDir}) ${pathInDir}`);
  
        if (event === "add") { 
          compiler.transpile(inDir, outDir, pathInDir);
        } else if (event === "addDir") {
          compiler.addDirectory(outDir, pathInDir);
        }
      }
    });
  } else {
    throw new Error("Unsupported OS: " + process.platform0);
  }

  
}).catch(err => {
  console.log(err);
});