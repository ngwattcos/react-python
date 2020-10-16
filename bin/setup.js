#!/usr/bin/env node

// const clear = require('clear');
// const clui = require('clui');
const figlet = require('figlet');
// const inquirer = require('inquirer');
const fs = require('fs');


const fileName = './react-python-config.json';


const prompts = require('../lib/prompts');

const runSetup = async () => {
  console.log(
    figlet.textSync('React-Python', {
      horizontalLayout: 'default'
    }));

  const config = await prompts.initTranspiler();

  return config;
}


runSetup().then((config) => {
  console.log(config);
  fs.writeFile(fileName, JSON.stringify(config, null, 2), function writeJSON(err) {
    if (err) {
      return console.log(err)
    };
})});
