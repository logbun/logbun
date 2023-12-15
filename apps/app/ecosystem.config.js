module.exports = {
  apps: [
    {
      name: 'logbun',
      script: 'npm',
      args: 'start',
      instances: 1,
      watch: false,
      autorestart: true,
    },
  ],
};