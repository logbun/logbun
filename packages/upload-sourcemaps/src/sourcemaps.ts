import assert from 'assert';
import fetchRetry from 'fetch-retry';
import FormData from 'form-data';
import { promises as fs } from 'fs';
import nodeFetch from 'node-fetch';
import { Options, Sourcemap } from './types';

const fetch = fetchRetry(nodeFetch as unknown as typeof fetch);

export const uploadSourcemaps = async (sourcemaps: Sourcemap[], opts: Options) => {
  const { apiKey, endpoint = process.env.LOGBUN_API_ENDPOINT } = opts;

  assert(typeof apiKey === 'string' || apiKey === undefined, "'apiKey' must be a string or undefined");

  assert(typeof endpoint === 'string' || "'endpoint' must be a string");

  for (const sourcemap of sourcemaps) {
    const jsFile = await fs.readFile(sourcemap.jsFilePath);

    const sourceFile = await fs.readFile(sourcemap.sourcemapFilePath);

    const form = new FormData();

    form.append('api_key', apiKey);

    form.append('minified_file', jsFile, {
      filename: sourcemap.jsFilename,
      contentType: 'application/javascript',
    });

    form.append('source_map', sourceFile, {
      filename: sourcemap.sourcemapFilePath,
      contentType: 'application/octet-stream',
    });

    try {
      const res = await fetch(opts.endpoint || '', {
        method: 'POST',
        body: form as unknown as BodyInit,
        redirect: 'follow',
        retries: 2,
        retryDelay: 1000,
      });

      return res;
    } catch (error) {
      throw new Error('Upload sourcemap failed');
    }
  }
};
