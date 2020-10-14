#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');

const appContainerDirectory = "./../";
const containerAppName = 'app-container';


// Use this in the future, since this will become a module
// const appDir = `./../${containerAppName}`;
const appDir = `${appContainerDirectory}${containerAppName}`;

if (fs.existsSync(appDir)) {
  console.log('Directory exists! Good to go.');
} else {
  console.log('Directory not found. Create your app container.');

}