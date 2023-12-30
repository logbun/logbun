import { serve } from '@hono/node-server';
import crypto from 'crypto';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';

// columnNumber: 19;
// fileName: 'http://localhost:5173/src/App.tsx?t=1703878704178';
// functionName: 'handledError';
// lineNumber: 23;
// source: '    at handledError (http://localhost:5173/src/App.tsx?t=1703878704178:23:19)';

export const eventSchema = z.object({
  name: z.string(),
  message: z.string(),
  timestamp: z.number(),
  stacktrace: z.array(
    z.object({
      fileName: z.string().optional(),
      functionName: z.string().optional(),
      lineNumber: z.number().optional(),
      source: z.string().optional(),
    })
  ),
  level: z.string().default('error'),
  handled: z.boolean().default(false),
  metadata: z.any().default({}),
  screenWidth: z.number().default(0),
});

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', async (c) => c.text('Hello Logbun'));

app.post('/event', async (c) => {
  const rawBody = await c.req.json();

  const userAgent = c.req.header('user-agent');

  console.log(c.req.raw.headers);

  const apiKey = c.req.header('x-api-key');

  const body = eventSchema.safeParse(rawBody);

  if (body.success) {
    const { name, message, timestamp, level, handled, metadata, stacktrace } = body.data;

    const { os, browser, device } = UAParser(userAgent);

    const stack = stacktrace.reduce((acc, cur) => acc + cur.source, '');

    const key = `${name}${message}${stack}`;

    const fingerprint = crypto.createHash('md5').update(key).digest('hex');

    const options = {
      apiKey,
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
      device: device.type || 'desktop',
      fingerprint,
      name,
      message,
      timestamp,
      level,
      handled,
      metadata,
      stacktrace,
      stack,
    };

    // console.log(options);

    return c.json(options, 200);
  } else {
    return c.json({ message: 'Invalid request body' }, 400);
  }
});

const port = 8000;

console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
