import { zValidator } from '@hono/zod-validator';
import { query } from '@logbun/clickhouse';
import { errorMessage, shortid } from '@logbun/server-utils';
import { Hono } from 'hono';
import { isbot } from 'isbot';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { UAParser } from 'ua-parser-js';
import { generateFingerprint, getEventByFingerprint, getProjectByApiKey } from './utils';
import { eventHeaderSchema, eventSchema } from './utils/schema';

const app = new Hono();

const rateLimit = new RateLimiterMemory({ points: 1, duration: 1 });

app.post('/', zValidator('json', eventSchema), zValidator('header', eventHeaderSchema), async (c) => {
  try {
    const data = c.req.valid('json');

    const header = c.req.valid('header');

    const userAgent = header['user-agent'];

    const apiKey = header['x-api-key'];

    if (isbot(userAgent)) {
      throw new Error('🤖 Bot');
    }

    const fingerprint = generateFingerprint({ name: data.name, stacktrace: data.stacktrace });

    try {
      await rateLimit.consume(fingerprint, 1);
    } catch (error) {
      throw new Error('Requests too fast');
    }

    const project = await getProjectByApiKey(apiKey);

    if (!project) throw new Error('Project not found');

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

    if (process.env.NODE_ENV === 'production' && previous && previous.count > 20) {
      throw new Error('Only 20 events max allowed during beta');
    }

    if (previous) {
      await query.update(previous, { ...current, count: previous.count + 1 });
    } else {
      await query.create({ ...current, id: shortid()(), count: 1, createdAt: timestamp });
    }

    return c.json({ message: 'Successfully created event' }, 200);
  } catch (error) {
    return c.json({ message: errorMessage(error) }, 400);
  }
});

export default app;
