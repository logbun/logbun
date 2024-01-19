#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { S3 } = require('@aws-sdk/client-s3');

const packageDir = process.cwd();
const packageJson = require(packageDir + '/package.json');
const packageVersion = packageJson.version;
const files = process.argv.slice(2);

const endpoint = process.env.S3_ENDPOINT;

const bucket = process.env.S3_CDN_BUCKET;

const accessKeyId = process.env.S3_ACCESS_KEY_ID;

const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

const region = process.env.S3_REGION;

const cdnUrl = process.env.CDN_URL;

const cdnAccessKey = process.env.CDN_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) throw new Error('Environment unavailable');

const s3Client = new S3({
  region,
  endpoint,
  tls: false,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

const upload = async (localPath, remotePath) => {
  const relativePath = path.relative('..', localPath);

  console.log(`uploading ${relativePath} -> ${remotePath}`);

  const fileStream = await fs.createReadStream(localPath);

  const response = await s3Client.putObject({
    Bucket: bucket,
    Key: remotePath,
    Body: fileStream,
    CacheControl: 'public, max-age=315360000',
    ContentType: 'application/javascript',
    ACL: 'public-read',
  });

  return response;
};

const invalidate = async () => {
  console.log(`Purging cache on: ${cdnUrl}`);

  try {
    await fetch(`https://api.bunny.net/purge?url=${cdnUrl}&async=false`, {
      method: 'POST',
      headers: { AccessKey: cdnAccessKey },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const run = async () => {
  for (const file of files) {
    const localPath = `${packageDir}/${file}`;
    const uploadPath = `v${packageVersion}/${path.basename(file)}`;
    await upload(localPath, uploadPath);
  }

  const isUnstable = semver.prerelease(packageVersion) !== null;

  if (!isUnstable) {
    // if this is a release (as opposed to a prerelease), update the major/minor aliases
    const major = `v${semver.major(packageVersion)}`;

    for (const file of files) {
      const localPath = `${packageDir}/${file}`;
      const uploadPath = `${major}/${path.basename(file)}`;
      await upload(localPath, uploadPath);
    }

    const minor = `${major}.${semver.minor(packageVersion)}`;

    for (const file of files) {
      const localPath = `${packageDir}/${file}`;
      const uploadPath = `${minor}/${path.basename(file)}`;
      await upload(localPath, uploadPath);
    }
  }

  // Update latest
  const latest = 'latest';

  for (const file of files) {
    const localPath = `${packageDir}/${file}`;
    const uploadPath = `${latest}/${path.basename(file)}`;
    await upload(localPath, uploadPath);
  }

  if (cdnAccessKey) await invalidate();
};

run();
