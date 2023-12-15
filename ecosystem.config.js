module.exports = {
  apps: [
    {
      namespace: "logbun",
      name: "app",
      script: "npm start",
      instances: 1,
      cwd: "./apps/app",
      watch: false,
      autorestart: true,
    },
  ],
};