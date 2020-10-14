#!/usr/bin/env node

const fs = require('fs');
// const { exec } = require('child_process');

const containerAppName = 'app-container';


// Use this in the future, since this will become a module
// const appDir = `./../${containerAppName}`;
const appDir = `./${containerAppName}`;

if (fs.existsSync(appDir)) {
  console.log('Directory exists! Finishing.');
} else {
  console.log('Directory not found. Creating app container.');
  // exec(`npx create-react-app ${containerAppName} && npm start`);

}