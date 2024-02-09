import { zValidator } from '@hono/zod-validator';
import { errorMessage, generateBucketKey, isValidHttpUrl, uploadFile } from '@logbun/server-utils';
import { Hono } from 'hono';
import { env } from '../env';
import { getProjectByApiKey } from './utils';
import { sourcemapSchema } from './utils/schema';

const app = new Hono();

app.post('/', zValidator('form', sourcemapSchema), async (c) => {
  try {
    const { api_key, release, minified_url, sourcemap } = c.req.valid('form');

    if (!isValidHttpUrl(minified_url)) {
      throw new Error('"minified_url" is not a valid url');
    }

    const project = await getProjectByApiKey(api_key);

    if (!project) throw new Error('Invalid API Key');

    const key = generateBucketKey({ projectId: project.id, release, url: minified_url });

    const body = Buffer.from(await sourcemap.arrayBuffer());

    await uploadFile(key, body, env.S3_SOURCEMAPS_BUCKET);

    return c.json({ message: 'Sourcemap uploaded' }, 200);
  } catch (error) {
    return c.json({ message: errorMessage(error) }, 400);
  }
});

export default app;
