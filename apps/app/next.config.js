const { withLogbunConfig } = require('@logbun/nextjs');

/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: ['@logbun/ui'],
};

/** @type {import('@logbun/nextjs').LogbunConfig} */
const logbunConfig = {
  silent: true,
  disableSourceMapUpload: false,
  webpackPluginOptions: {
    assetUrl: `${process.env.NEXT_PUBLIC_LOGBUN_ASSET_URL}/_next`,
    apiKey: process.env.NEXT_PUBLIC_LOGBUN_API_KEY,
    release: process.env.NEXT_PUBLIC_LOGBUN_RELEASE,
  },
};

module.exports = withLogbunConfig(moduleExports, logbunConfig);
