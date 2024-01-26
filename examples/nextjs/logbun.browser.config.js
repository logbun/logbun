import Logbun from '@logbun/nextjs';

Logbun.init({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:8000/event',
});
