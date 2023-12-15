module.exports = {
  apps: [
    {
      name: 'logbun',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      watch: false,
      autorestart: true,
    },
  ],
};