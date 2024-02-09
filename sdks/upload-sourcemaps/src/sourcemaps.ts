import fetchRetry from 'fetch-retry';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Options, Sourcemap } from './types';

const fetch = fetchRetry(global.fetch);

const optionsSchema = z.object({
  apiKey: z.string(),
  release: z.string().optional(),
  endpoint: z.string(),
  assetUrl: z.string().url(),
  silent: z.boolean().optional(),
});

export const uploadSourceMaps = async (sourcemaps: Sourcemap[], options: Options) => {
  const opts = optionsSchema.safeParse(options);

  if (!opts.success) {
    throw new Error(fromZodError(opts.error).toString());
  }

  const { apiKey, release, endpoint, assetUrl, silent } = opts.data;

  if (!silent && !sourcemaps.length) {
    console.warn('Could not find any sourcemaps in the bundle. Nothing will be uploaded.');
    return null;
  }

  const uploadPromises = sourcemaps.map(async (sourcemap) => {
    const form = new FormData();

    const minifiedUrl = new URL(assetUrl);

    minifiedUrl.pathname = path.join(minifiedUrl.pathname, sourcemap.jsFilename);

    const sourcemapFile = await fs.readFile(sourcemap.sourcemapFilePath);

    const sourcemapBlob = new Blob([sourcemapFile], { type: 'application/json' });

    form.append('api_key', apiKey);

    form.append('minified_url', minifiedUrl.href);

    form.append('sourcemap', sourcemapBlob, sourcemap.sourcemapFilename);

    form.append('release', release ?? '');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: form,
        redirect: 'follow',
        retries: 2,
        retryDelay: 1000,
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.message || `${res.status} ${res.statusText}`);
      }

      if (!silent) {
        console.info(`Successfully uploaded ${sourcemap.sourcemapFilename} (${minifiedUrl.href}) to Logbun`);
      }

      return res;
    } catch (error) {
      const { message } = error as Error;

      throw new Error(
        `Failed to upload ${sourcemap.sourcemapFilename} (${minifiedUrl.href}) to Logbun. Error: ${message}`
      );
    }
  });

  const results = await Promise.allSettled(uploadPromises);

  const isFulfilled = <T>(p: PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

  const isRejected = <T>(p: PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === 'rejected';

  const fulfilled = results.filter(isFulfilled);

  const rejected = results.filter(isRejected);

  if (!silent && fulfilled.length > 0) {
    console.info(`${fulfilled.length} sourcemap file(s) successfully uploaded to Logbun`);
  }

  if (rejected.length > 0) {
    const reasons = rejected.map(({ reason }) => reason).join('\n');

    throw new Error(`Failed to upload ${rejected.length} sourcemap file(s) to Logbun\n${reasons}`);
  }

  return fulfilled.map(({ value }) => value);
};
