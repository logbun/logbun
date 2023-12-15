module.exports = {
  apps: [
    {
      name: 'logbun',
      script: 'npm start',
      args: 'start',
      instances: 1,
      cwd: "./apps/app",
      watch: false,
      autorestart: true,
    },
  ],
};