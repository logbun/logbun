import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

type S3File = {
  prefix: string;
  key: string;
};

const client = new S3Client({
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  tls: false,
  forcePathStyle: true,
});

export async function listFiles(prefix: string, bucket: string): Promise<S3File[]> {
  const command = new ListObjectsCommand({ Bucket: bucket, Prefix: prefix });
  const results = await client.send(command);
  const content = results.Contents ? results.Contents : [];
  return content.map((item) => ({ key: item.Key!.replace(prefix, ''), prefix })).filter((item) => item.key !== '');
}

export async function fetchFile(key: string, bucket: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  const result = await client.send(command);

  return result.Body ? result.Body.transformToString() : '';
}

export async function uploadFile(key: string, file: Buffer, bucket: string) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: file });
  await client.send(command);
}

export async function fileExists(key: string, bucket: string): Promise<boolean> {
  const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
  try {
    await client.send(command);
    return true;
  } catch (error) {
    const { name } = error as Error;
    if (name === 'NotFound') return false;
    throw error;
  }
}

export async function deleteFile(key: string, bucket: string) {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await client.send(command);
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}
