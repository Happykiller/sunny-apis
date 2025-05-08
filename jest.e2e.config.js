// jest.e2e.config.js
const base = require('./jest.config.base');

module.exports = {
  ...base,
  testRegex: '.*\\.e2e-spec\\.ts$',
};