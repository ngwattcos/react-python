/**
 * 
 * 
 * Needs to me made configurable with an input directory and output directory.
 * 
 * Needs to use nodemon to watch Python source files to call compile directly
 */



exports.print = function() {
  console.log("running lol");
}


let inputDir = "";
let outputDir = "";

exports.setInputDir = function(dir) {
  if (verifyInputDir(dir)) {
    inputDir = dir;
  }

  // else, we should throw an exception
}

exports.setOutputDir = function(dir) {
  if (verifyOutputDir(dir)) {
    outputDir = dir;
  }

  // else, we should throw an exception
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

}

/**
 * Watches inputDir for changes.
 * On change, call compile on inputDir and rewrite file specified
 */
exports.watchAndCompile = function() {

}