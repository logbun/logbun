import { serve } from '@hono/node-server';
import crypto from 'crypto';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string(),
  message: z.string(),
  timestamp: z.number(),
  screenWidth: z.number().optional(),
});

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', async (c) => c.text('Hello Logbun'));

app.post('/event', async (c) => {
  const rawBody = await c.req.json();

  const userAgent = c.req.header('user-agent');

  const body = eventSchema.safeParse(rawBody);

  if (body.success) {
    const { name, message, timestamp } = body.data;

    const { os, browser, device } = UAParser(userAgent);

    const key = `${body.data.message}${os}`;

    const fingerprint = crypto.createHash('md5').update(key).digest('hex');

    const options = {
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
      device: device.type || 'desktop',
      fingerprint,
      name,
      message,
      timestamp,
    };

    console.log(options);

    return c.json(options, 200);
  } else {
    return c.json({}, 200);
  }
});

const port = 8000;

console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
