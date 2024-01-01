#!/usr/bin/env node
/* eslint-disable turbo/no-undeclared-env-vars */
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { S3 } = require('@aws-sdk/client-s3');

const packageDir = process.cwd();
const packageJson = require(packageDir + '/package.json');
const packageName = packageJson.name;
const packageVersion = packageJson.version;

const bucketName = process.env.AWS_BUCKET;
const endpointUrl = process.env.AWS_ENDPOINT;

const bunnyUrl = process.env.BUNNY_URL;
const bunnyAccessKey = process.env.BUNNY_ACCESS_KEY;
// const callerReference = `${packageName}@${packageVersion}`;
const files = process.argv.slice(2);

const s3Client = new S3({
  endpoint: endpointUrl,
  tls: false,
  forcePathStyle: true,
});

const upload = async (localPath, remotePath) => {
  const relativePath = path.relative('..', localPath);

  console.log(`uploading ${relativePath} -> ${remotePath}`);

  const fileStream = await fs.createReadStream(localPath);

  const response = await s3Client.putObject({
    Bucket: bucketName,
    Key: remotePath,
    Body: fileStream,
    CacheControl: 'public, max-age=315360000',
    ContentType: 'application/javascript',
    ACL: 'public-read',
  });

  return response;
};

const invalidate = async () => {
  console.log(`Purging cache on: ${bunnyUrl}`);

  try {
    await fetch(`https://api.bunny.net/purge?url=${bunnyUrl}&async=false`, {
      method: 'POST',
      headers: { AccessKey: bunnyAccessKey },
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

  await invalidate();
};

run();
