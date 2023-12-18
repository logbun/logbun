module.exports = {
  apps: [
    {
      namespace: 'logbun',
      name: 'app',
      script: 'npm start -- --port 3000',
      instances: 1,
      cwd: './apps/app',
      watch: false,
      autorestart: true,
    },
  ],
};
