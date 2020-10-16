#!/usr/bin/env node

var { watch } = require("gulp");

/**
 * 
 * 
 * Needs to be made configurable with an input directory and output directory.
 * Probably should be done through through user-provided config file (their project package.json?)
 * 
 */



exports.print = function() {
  console.log("running lol");
}

exports.print();

let inputDir = "";
let outputDir = "";

exports.setInputDir = function(dir) {
  if (verifyInputDir(dir)) {
    inputDir = dir;
    console.log("Set input dir to: " + inputDir);
    return;
  }

  throw new Error("Input directory not properly set.")
}

exports.setOutputDir = function(dir) {
  if (verifyOutputDir(dir)) {
    outputDir = dir;
    console.log("Set output dir to: " + outputDir);
    return;
  }

  throw new Error("Output directory not properly set.")
}

/**
 * Verifies that valid Python files exist in this dir.
 */
function verifyInputDir() {
  return true;
}

/**
 * Verifies that
 */
function verifyOutputDir() {
  return true;
}

/**
 * Invokes the transpiler
 */
function compile() {
  return Promise((resolve, reject) => {
    console.log("i am so compiling right now");
  })
}

/**
 * Watches inputDir for changes.
 * On change, call compile on inputDir and rewrite file specified
 */
exports.watchAndCompile = function(done) {
  watch(["" + inputDir + "/*.py"], function() {
    compile()
    .then(done);
  })
}