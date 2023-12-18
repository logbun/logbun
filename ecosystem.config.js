module.exports = {
  apps: [
    {
      namespace: 'logbun',
      name: 'wwww',
      script: 'npm start -- --port 3000',
      instances: 1,
      cwd: './apps/wwww',
      watch: false,
      autorestart: true,
    },
  ],
};
