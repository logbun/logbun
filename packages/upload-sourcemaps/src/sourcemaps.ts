import { errorMessage } from '@logbun/utils';
import assert from 'assert';
import fetchRetry from 'fetch-retry';
import { promises as fs } from 'fs';
import { Options, Sourcemap } from './types';

const fetch = fetchRetry(global.fetch);

export const uploadSourcemaps = async (sourcemaps: Sourcemap[], opts: Options) => {
  const { apiKey, release, endpoint = process.env.LOGBUN_API_URL } = opts;

  assert(typeof apiKey === 'string', "'apiKey' must be a string or undefined.");

  assert(typeof endpoint === 'string' || "'endpoint' must be a string.");

  for (const sourcemap of sourcemaps) {
    const jsFile = await fs.readFile(sourcemap.jsFilePath);

    const sourceFile = await fs.readFile(sourcemap.sourcemapFilePath);

    const form = new FormData();

    form.append('api_key', apiKey);

    release && form.append('release', release);

    form.append('minified_file', new Blob([jsFile]), sourcemap.jsFilename);

    form.append('sourcemap_file', new Blob([sourceFile]), sourcemap.sourcemapFilePath);

    try {
      const res = await fetch(opts.endpoint!, {
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

      return body;
    } catch (error) {
      throw new Error(errorMessage(error));
    }
  }
};
