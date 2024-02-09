/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@logbun/eslint-config/sdk.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
};
