#!/usr/bin/env node

'use strict';

var argparse = require('argparse');
var path = require('path');
var fetchRetry = require('fetch-retry');
var fs = require('fs');
var zod = require('zod');
var zodValidationError = require('zod-validation-error');

var version = "1.0.3";
var description = "NPM module to upload your JS sourcemaps files to Logbun.";

const fetch = fetchRetry(global.fetch);
const optionsSchema = zod.z.object({
  apiKey: zod.z.string(),
  release: zod.z.string().optional(),
  endpoint: zod.z.string(),
  assetUrl: zod.z.string().url(),
  silent: zod.z.boolean().optional()
});
const uploadSourceMaps = async (sourcemaps, options) => {
  const opts = optionsSchema.safeParse(options);
  if (!opts.success) {
    throw new Error(zodValidationError.fromZodError(opts.error).toString());
  }
  const { apiKey, release, endpoint, assetUrl, silent } = opts.data;
  if (!silent && !sourcemaps.length) {
    console.warn("Could not find any sourcemaps in the bundle. Nothing will be uploaded.");
    return null;
  }
  const uploadPromises = sourcemaps.map(async (sourcemap) => {
    const form = new FormData();
    const minifiedUrl = new URL(assetUrl);
    minifiedUrl.pathname = path.join(minifiedUrl.pathname, sourcemap.jsFilename);
    const sourcemapFile = await fs.promises.readFile(sourcemap.sourcemapFilePath);
    const sourcemapBlob = new Blob([sourcemapFile], { type: "application/json" });
    form.append("api_key", apiKey);
    form.append("minified_url", minifiedUrl.href);
    form.append("sourcemap", sourcemapBlob, sourcemap.sourcemapFilename);
    form.append("release", release ?? "");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: form,
        redirect: "follow",
        retries: 2,
        retryDelay: 1e3
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
      const { message } = error;
      throw new Error(
        `Failed to upload ${sourcemap.sourcemapFilename} (${minifiedUrl.href}) to Logbun. Error: ${message}`
      );
    }
  });
  const results = await Promise.allSettled(uploadPromises);
  const isFulfilled = (p) => p.status === "fulfilled";
  const isRejected = (p) => p.status === "rejected";
  const fulfilled = results.filter(isFulfilled);
  const rejected = results.filter(isRejected);
  if (!silent && fulfilled.length > 0) {
    console.info(`${fulfilled.length} sourcemap file(s) successfully uploaded to Logbun`);
  }
  if (rejected.length > 0) {
    const reasons = rejected.map(({ reason }) => reason).join("\n");
    throw new Error(`Failed to upload ${rejected.length} sourcemap file(s) to Logbun
${reasons}`);
  }
  return fulfilled.map(({ value }) => value);
};

const parser = new argparse.ArgumentParser({ description });
parser.add_argument("-v", "--version", { action: "version", version });
parser.add_argument("-k", "--api-key", {
  help: "API key",
  required: true
});
parser.add_argument("-r", "--release", {
  help: "Unique release key",
  required: false
});
parser.add_argument("-e", "--sourcemap-endpoint", {
  help: "API server URL for upload"
});
parser.add_argument("-s", "--sourcemap-file-path", {
  help: "Local path to the sourcemap file",
  required: true
});
parser.add_argument("-m", "--minified-file-path", {
  help: "URL to the minified js file",
  required: true
});
const { api_key, release, endpoint, sourcemap_file_path, minified_file_path } = parser.parse_args();
uploadSourceMaps(
  [
    {
      sourcemapFilePath: sourcemap_file_path,
      sourcemapFilename: path.basename(sourcemap_file_path),
      jsFilePath: minified_file_path,
      jsFilename: path.basename(minified_file_path)
    }
  ],
  { apiKey: api_key, release, endpoint, assetUrl: "TODO" }
).then(() => {
  console.log("Sourcemaps uploaded successfully");
}).catch((error) => {
  console.error(`Sourcemap upload error: ${error}`);
});
