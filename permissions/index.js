const { shield } = require("graphql-shield");
const path = require('path');
const assign = require('assign-deep')
const { loadFilesSync } = require('@graphql-tools/load-files');

const permissionsArray = loadFilesSync(path.join(__dirname, './**/*.permissions.*'));

module.exports = shield(assign(...permissionsArray), { fallbackError: new Error('Vous n\'avez pas les permissions nécessaire.')})