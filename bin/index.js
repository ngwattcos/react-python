#!/usr/bin/env node

/**
 * This file will call 'gulp'
 * 
 * Needs to be made configurable with an input directory and output directory.
 * Probably should be done through through user-provided config file (their project package.json?)
 * 
 */

const fs = require("fs");
const chokidar = require("chokidar");

// probably canges this to ./../react-python-config.json
new Promise((resolve, reject) => {
  let rawConfig = fs.readFileSync('./react-python-config.json');
  let configData = JSON.parse(rawConfig);
  resolve(configData);
}).then(configData => {
  // should be read from json
  if (!verifyInputDir(configData.inDir)) {
    throw new Error("invalid input dir, run react-python-setup again");
  }
  if (!verifyOutputDir(configData.inDir)) {
    throw new Error("invalid output dir, run react-python-setup again");
  }
  return configData;
}).then(configData => {
  console.log(`input directory: ${configData.inDir}`);
  console.log(`output directory: ${configData.outDir}`);

  chokidar.watch(configData.inDir).on('all', function(event, path) {
    console.log(`${event}: ${path}`);
  });
}).catch(err => {
  console.log(err);
});





/**
 * Verifies that input dir exists
 */
function verifyInputDir() {
  return true;
}

/**
 * Verifies that output dir exists
 */
function verifyOutputDir() {
  return true;
}

