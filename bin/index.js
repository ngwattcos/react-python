#!/usr/bin/env node

/**
 * This file will call 'gulp'
 * 
 * Needs to be made configurable with an input directory and output directory.
 * Probably should be done through through user-provided config file (their project package.json?)
 * 
 */

const filewatcher = require('filewatcher');
 
const watcher = filewatcher();

// should be read from json
const input_dir = "input/";

watcher.add(input_dir);



watcher.on('change', function(file, stat) {
  console.log(`File modified: ${file}`);
  if (!stat) {
    console.log('deleted');
  }
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

