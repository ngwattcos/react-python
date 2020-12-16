#! /usr/bin/env node

// const clear = require('clear');
// const clui = require('clui');
const figlet = require('figlet');
// const inquirer = require('inquirer');
const fs = require('fs');

const files = require('./files');


// probably change this to ./../react-python-config.json?
const fileName = 'react-python-config.json';
const filePath = `${fileName}`;


const prompts = require('../lib/prompts');

const runSetup = async () => {
  console.log(
    figlet.textSync('React-Python', {
      horizontalLayout: 'default'
    })
  );

  const config = await prompts.initTranspiler();

  return config;
}


runSetup()
.then(promptResult => {
  const { OCamlInstalled, ...config } = promptResult;

  if (!OCamlInstalled) {
    throw 'Please install OCaml in the meantime.';
  }

  if (!files.directoryExists(`${config.inDir}`)) {
    throw 'Input directory does not exist.';
  }
  if (!files.directoryExists(`${config.outDir}`)) {
    throw 'Output directory does not exist.';
  }

  return config;
})
.then(config => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(config, null, 2), function writeJSON(err) {
      if (err) {
        reject(err);
      };
      resolve(`Wrote to configuration file: ${fileName}`);
  })
})})
.then(successMsg => {
  console.log(successMsg);
})
.catch(err => {
  console.log(err);
  process.exit();
});
