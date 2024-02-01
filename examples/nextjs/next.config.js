/** @type {import('next').NextConfig} */
const moduleExports = {};

const logbunConfig = {
  silent: true,
  disableSourceMapUpload: false,
  webpackPluginOptions: {
    apiKey: process.env.NEXT_PUBLIC_LOGBUN_API_KEY,
  },
};

const { withLogbunConfig } = require('@logbun/nextjs');

module.exports = withLogbunConfig(moduleExports, logbunConfig);
