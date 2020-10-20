#!/usr/bin/env node

// const clear = require('clear');
// const clui = require('clui');
const figlet = require('figlet');
// const inquirer = require('inquirer');
const fs = require('fs');


// probably canges this to ./../react-python-config.json
const fileName = './react-python-config.json';


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
    throw 'Please install OCaml in the meantime.'
  }

  return config;
})
.then(config => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(config, null, 2), function writeJSON(err) {
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
});
