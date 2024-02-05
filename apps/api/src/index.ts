import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { create, update } from '@logbun/clickhouse/src/queries';
import { errorMessage, isValidHttpUrl, shortid } from '@logbun/utils';
import { generateBucketKey, uploadFile } from '@logbun/utils/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { isbot } from 'isbot';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { UAParser } from 'ua-parser-js';
import { eventHeaderSchema, eventSchema, sourcemapSchema } from './schema';
import { generateFingerprint, getEventByFingerprint, getProjectByApiKey } from './utils';

const rateLimit = new RateLimiterMemory({ points: 1, duration: 1 });

const app = new Hono();

app.use('*', logger());

app.use('*', cors());

app.get('/', async (c) => c.text('Hello Logbun'));

app.post('/event', zValidator('json', eventSchema), zValidator('header', eventHeaderSchema), async (c) => {
  try {
    const data = c.req.valid('json');

    const header = c.req.valid('header');

    const userAgent = header['user-agent'];

    const apiKey = header['x-api-key'];

    const fingerprint = generateFingerprint(data);

    if (isbot(userAgent)) {
      throw new Error('🤖 Bot');
    }

    try {
      await rateLimit.consume(fingerprint, 1);
    } catch (error) {
      throw new Error('Requests too fast');
    }

    const project = await getProjectByApiKey(apiKey);

    if (!project) throw new Error('Project with API Key not found');

    const { os, browser, device } = UAParser(userAgent);

    const { name, message, timestamp, level, handled, metadata, stacktrace, sdk, release } = data;

    const current = {
      projectId: project.id,
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
      device: device.type || 'desktop',
      fingerprint,
      name,
      message,
      level,
      handled,
      metadata,
      stacktrace,
      sdk,
      release,
      updatedAt: timestamp,
    };

    const previous = await getEventByFingerprint(fingerprint);

    if (previous) {
      // TODO: Remove this restriction later
      if (previous.count >= 20) {
        throw new Error('Only 20 event max during beta');
      }

      await update(previous, {
        ...current,
        count: previous.count + 1,
      });
    } else {
      await create({
        ...current,
        id: shortid()(),
        count: 1,
        createdAt: timestamp,
      });
    }
    return c.json({ message: 'Successfully created event' }, 200);
  } catch (error) {
    console.error(error);

    return c.json({ message: errorMessage(error) }, 400);
  }
});

app.post('/sourcemaps', zValidator('form', sourcemapSchema), async (c) => {
  try {
    const { api_key, release, minified_url, sourcemap } = c.req.valid('form');

    // TODO: use zod
    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) throw new Error('Environment unavailable');

    if (!process.env.S3_SOURCEMAPS_BUCKET) {
      throw new Error('Environment missing sourcemap bucket name');
    }

    if (!isValidHttpUrl(minified_url)) {
      throw new Error('"minified_url" is not a valid url');
    }

    const project = await getProjectByApiKey(api_key);

    if (!project) {
      throw new Error('Invalid API Key');
    }

    const key = generateBucketKey({ projectId: project.id, release, url: minified_url });

    const body = Buffer.from(await sourcemap.arrayBuffer());

    await uploadFile(key, body, process.env.S3_SOURCEMAPS_BUCKET);

    return c.json({ message: 'Sourcemap uploaded' }, 200);
  } catch (error) {
    return c.json({ message: errorMessage(error) }, 400);
  }
});

const port = 8000;

console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
