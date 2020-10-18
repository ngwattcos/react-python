
const inquirer = require('inquirer');

module.exports = {
  initTranspiler: () => {
    const questions = [
      {
        name: 'inDir',
        type: 'input',
        message: 'Directory with Python files:',
        validate: () => {
          return true;
        }
      },
      {
        name: 'outDir',
        type: 'input',
        message: 'Directory with JSX files:',
        validate: () => {
          return true;
        }
      },
      {
        name: 'OCamlInstalled',
        type: 'confirm',
        message: 'Is OCaml installed on your machine?',
        validate: () => {
          return true;
        }
      }
    ];
    return inquirer.prompt(questions);
  },
}