import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { create, update } from '@logbun/clickhouse/queries';
import { errorMessage, generateMinifiedKey, generateSourceMapKey, shortid } from '@logbun/utils';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UAParser } from 'ua-parser-js';
import { eventHeaderSchema, eventSchema, sourcemapSchema } from './schema';
import { generateKey, getEventByKey, getEvents, getProjectByApiKey } from './utils';

const app = new Hono();

app.use('*', logger());

app.use('*', cors());

app.get('/', async (c) => c.text('Hello Logbun'));

app.post('/event', zValidator('json', eventSchema), zValidator('header', eventHeaderSchema), async (c) => {
  const data = c.req.valid('json');

  const header = c.req.valid('header');

  const userAgent = header['user-agent'];

  const apiKey = header['x-api-key'];

  const project = await getProjectByApiKey(apiKey);

  if (!project) throw new Error('Project with API Key not found');

  const key = generateKey(data, project.id);

  const { os, browser, device } = UAParser(userAgent);

  const { name, message, timestamp, level, handled, metadata, stacktrace, sdk, release } = data;

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
    release,
  };

  const events = await getEvents(project.id);

  // TODO: Remove this restriction later
  if (events.length >= 50) {
    throw new Error('Only 50 event max during beta');
  }

  const previous = await getEventByKey(key);

  if (previous) {
    await update(previous, {
      ...current,
      count: previous.count + 1,
      updatedAt: timestamp,
    });
  } else {
    await create({
      ...current,
      id: shortid()(),
      count: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
  return c.json({ message: 'Successfully created event' }, 200);
});

app.post('/sourcemaps', zValidator('form', sourcemapSchema), async (c) => {
  try {
    const { api_key, release, minified_file: minifiedFile, sourcemap_file: sourcemapFile } = c.req.valid('form');

    const project = await getProjectByApiKey(api_key);

    if (!project) throw new Error('Invalid API Key');

    const endpoint = process.env.S3_ENDPOINT;

    const bucket = process.env.S3_SOURCEMAPS_BUCKET;

    const accessKeyId = process.env.S3_ACCESS_KEY_ID;

    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    const region = process.env.S3_REGION;

    if (!accessKeyId || !secretAccessKey) throw new Error('Environment unavailable');

    const client = new S3Client({
      region,
      endpoint,
      tls: false,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });

    const putMinifiedFile = new PutObjectCommand({
      Bucket: bucket,
      Key: generateMinifiedKey({ id: project.id, release }),
      Body: Buffer.from(await minifiedFile.arrayBuffer()),
    });

    const putSourcemapFile = new PutObjectCommand({
      Bucket: bucket,
      Key: generateSourceMapKey({ id: project.id, release }),
      Body: Buffer.from(await sourcemapFile.arrayBuffer()),
    });

    await Promise.all([await client.send(putMinifiedFile), await client.send(putSourcemapFile)]);

    return c.json({ message: 'Sourcemap uploaded' }, 200);
  } catch (error) {
    return c.json({ message: errorMessage(error) }, 400);
  }
});

const port = 8000;

console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });
