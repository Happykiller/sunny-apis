const base = require('./jest.config.base');

module.exports = {
  ...base,
  testRegex: '.*\\.spec\\.ts$', // exclut .e2e-spec.ts
};