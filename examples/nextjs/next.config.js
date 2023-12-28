/** @type {import('next').NextConfig} */
const moduleExports = {};

const logbunConfig = {
  silent: true,
};

const { withLogbunConfig } = require('@logbun/nextjs');

module.exports = withLogbunConfig(moduleExports, logbunConfig);
