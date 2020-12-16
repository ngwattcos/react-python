# react-python
An npm wrapper for pythonxyc, a compiler that translates Python(-like) code into React JSX.

### Compiler
pythonxyc (compiler) source code can be found at:
https://github.com/ngwattcos/pythonxyc

# Installation
`npm install --save-dev react-python`

# Usage
### Setup
Run the startup tool, which sets up references to input and output source directories:
`pyxyc-setup`or `react-python-setup`

### Transpiling
Compile all files in the input source directory:
`pyxyc`or `react-python-compile`

Alternatively, open a running instance of a file watcher on the input directory:
`pyxyc-watch-and-compile` or `react-python-watch-and-compile`


### Usage ideas!
1. Integrate `react-python`'s command-line calls`pyxyc-setup` and `pyxyc` into your app's workflow by referencing them in your package's `scripts`.
2. While your app is running (and gets dynamically hot-reloaded; i.e., running through `yarn start`or `npm start`), you can run `pyxyc-watch-and-compile`or `react-python-watch-and-compile`, where changes to the JavaScript source directories will trigger a reload