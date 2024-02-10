import { Logbun } from '@logbun/nextjs';

Logbun.init({
  apiKey: process.env.NEXT_PUBLIC_LOGBUN_API_KEY,
  release: process.env.NEXT_PUBLIC_LOGBUN_RELEASE,
  endpoint: process.env.NEXT_PUBLIC_LOGBUN_EVENT_ENDPOINT,
});
