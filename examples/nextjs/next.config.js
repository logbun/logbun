const { withLogbunConfig } = require('@logbun/nextjs');

/** @type {import('next').NextConfig} */
const moduleExports = {};

/** @type {import('@logbun/nextjs').LogbunConfig} */
const logbunConfig = {
  silent: true,
  disableSourceMapUpload: false,
  webpackPluginOptions: {
    assetUrl: `${process.env.NEXT_PUBLIC_LOGBUN_ASSET_URL}/_next`,
    apiKey: process.env.NEXT_PUBLIC_LOGBUN_API_KEY,
    release: process.env.NEXT_PUBLIC_LOGBUN_RELEASE,
    endpoint: process.env.NEXT_PUBLIC_LOGBUN_SOURCEMAPS_ENDPOINT,
  },
};

module.exports = withLogbunConfig(moduleExports, logbunConfig);
