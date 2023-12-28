import * as Logbun from '@logbun/nextjs';

Logbun.init({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:2000/api/log',
});
