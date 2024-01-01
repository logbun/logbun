/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@logbun/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['*.config.js'],
};
