/** @type {import('next').NextConfig} */

const { withLogbunConfig } = require('@logbun/nextjs');

const moduleExports = {};

const logbunConfig = {
  silent: true,
  disableSourceMapUpload: false,
  webpackPluginOptions: {
    apiKey: process.env.NEXT_PUBLIC_LOGBUN_API_KEY,
    endpoint: process.env.NEXT_PUBLIC_LOGBUN_SOURCEMAPS_URL,
    release: process.env.NEXT_PUBLIC_LOGBUN_RELEASE,
  },
};

module.exports = withLogbunConfig(moduleExports, logbunConfig);
