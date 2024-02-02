// import { errorMessage } from '@logbun/utils/helpers';
import fetchRetry from 'fetch-retry';
import { promises as fs } from 'fs';
import { Options, Sourcemap } from './types';

const fetch = fetchRetry(global.fetch);

export const uploadSourceMaps = async (sourcemaps: Sourcemap[], opts: Options) => {
  const { apiKey, release, endpoint } = opts;

  if (!apiKey) throw new Error("'apiKey' must be a string.");

  if (!endpoint) throw new Error("'endpoint' must be a string.");

  if (release && typeof release !== 'string') throw new Error("'release' must be a string.");

  for (const sourcemap of sourcemaps) {
    const jsFile = await fs.readFile(sourcemap.jsFilePath);

    const sourceFile = await fs.readFile(sourcemap.sourcemapFilePath);

    console.log({ apiKey, release, endpoint });

    const form = new FormData();

    form.append('api_key', apiKey);

    release && form.append('release', release);

    form.append('minified_file', new Blob([jsFile]), sourcemap.jsFilename);

    form.append('sourcemap_file', new Blob([sourceFile]), sourcemap.sourcemapFilePath);

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

      return body;
    } catch (error) {
      throw new Error((error as any).message);
    }
  }
};
