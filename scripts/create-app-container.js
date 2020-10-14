const fs = require('rs');
// const { exec } = require('child_process');

const containerAppName = 'app-container';

const appDir = `./${containerAppName}`;

if (fs.existsSync(appDir)) {
  console.log('Directory exists!');
} else {
  console.log('Directory not found.');
  // exec(`npx create-react-app ${containerAppName} && npm start`);

}