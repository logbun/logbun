import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { env } from '../env';
import event from './event';
import sourcemap from './sourcemap';

const app = new Hono();

app.use('*', logger());

app.use('*', secureHeaders());

app.use('*', cors());

app.get('/', async (c) => c.text(`Hello Logbun from ${env.NODE_ENV}`));

app.route('/event', event);

app.route('/sourcemap', sourcemap);

const port = env.PORT || 8080;

console.log(`⚡️ Server is running on port ${port}`);

serve({ fetch: app.fetch, port });

process.on('uncaughtException', function (err) {
  if (env.NODE_ENV !== 'production') {
    console.error(err);
  }
});
