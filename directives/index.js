const path = require('path');
const assign = require('assign-deep')
const { loadFilesSync } = require('@graphql-tools/load-files');

const directivesArray = loadFilesSync(path.join(__dirname, './**/*.directive.*'));

module.exports = assign(...directivesArray)