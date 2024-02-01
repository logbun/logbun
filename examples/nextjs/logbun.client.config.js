import { Logbun } from '@logbun/nextjs';

console.log('Client ->', Logbun);

Logbun.init({
  apiKey: process.env.NEXT_PUBLIC_LOGBUN_API_KEY,
  endpoint: 'http://localhost:8000/event',
});
