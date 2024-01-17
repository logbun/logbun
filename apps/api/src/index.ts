import { serve } from '@hono/node-server';
import { create, update } from '@logbun/clickhouse/queries';
import { shortid } from '@logbun/utils';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UAParser } from 'ua-parser-js';
import { getEventByKey, getProjectByApiKey } from './queries';
import { eventSchema } from './schema';
import { generateKey } from './utils';

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
    const project = await getProjectByApiKey(apiKey);

    if (!project) throw new Error('Project with API Key not found');

    const key = generateKey(body.data, project.id);

    const { os, browser, device } = UAParser(userAgent);

    const { name, message, timestamp, level, handled, metadata, stacktrace, sdk } = body.data;

    const current = {
      projectId: project.id,
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
      device: device.type || 'desktop',
      key,
      name,
      message,
      level,
      handled,
      metadata,
      stacktrace,
      sdk,
    };

    const previous = await getEventByKey(key);

    if (previous) {
      console.log({ previous, current });

      console.log(
        `📝 Updating key ${current.key} from count ${previous.count} to ${previous.count + 1} (${
          current.name
        })`.toUpperCase()
      );

      await update(previous, { ...current, count: previous.count + 1, updatedAt: timestamp });
    } else {
      console.log({ current });

      console.log(`✅ Creating new key ${current.key} with count 1 (${current.name})`.toUpperCase());

      await create({ ...current, id: shortid()(), count: 1, createdAt: timestamp, updatedAt: timestamp });
    }
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
