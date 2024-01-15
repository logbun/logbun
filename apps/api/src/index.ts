import { serve } from '@hono/node-server';
import { createClient } from '@logbun/clickhouse';
import { db, eq, projects } from '@logbun/db';
import { shortid } from '@logbun/utils';
import crypto from 'crypto';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';

const client = createClient();

export const eventSchema = z.object({
  name: z.string(),
  message: z.string(),
  timestamp: z.number(),
  sdk: z.object({
    name: z.string(),
    url: z.string(),
    version: z.string(),
  }),
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
  metadata: z.record(z.string(), z.any()).default({}),
  screenWidth: z.number().default(0),
});

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', async (c) => c.text('Hello Logbun'));

app.post('/event', async (c) => {
  const rawBody = await c.req.json();

  const userAgent = c.req.header('user-agent');

  const apiKey = c.req.header('x-api-key');

  const body = eventSchema.safeParse(rawBody);

  if (body.success) {
    const { name, message, timestamp, level, handled, metadata, stacktrace, sdk } = body.data;

    const { os, browser, device } = UAParser(userAgent);

    const stack = stacktrace.reduce((acc, cur) => acc + cur.source, '');

    const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.apiKey, apiKey));

    if (!project) throw new Error('Project with API Key not found');

    const hex = `${project.id}${name}${message}${stack}`;

    const key = crypto.createHash('md5').update(hex).digest('hex');

    const values = {
      id: shortid(),
      projectId: project.id,
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
      device: device.type || 'desktop',
      key,
      name,
      message,
      timestamp,
      level,
      handled,
      metadata,
      stacktrace,
      sdk,
      sign: 1,
    };

    await client.insert({ table: 'logbun.event', values, format: 'JSONEachRow' });

    return c.json({ message: 'Successfully created event' }, 200);
  } else {
    return c.json({ message: 'Invalid request body' }, 400);
  }
});

app.post('/sourcemaps', async (c) => {
  const body = await c.req.parseBody();

  console.log(body['file']);
});

const port = 8000;

console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
