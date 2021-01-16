const path = require('path');
const assign = require('assign-deep')
const { loadFilesSync } = require('@graphql-tools/load-files');

const modelsArray = loadFilesSync(path.join(__dirname, './**/*.model.*'));

module.exports = assign(...modelsArray)