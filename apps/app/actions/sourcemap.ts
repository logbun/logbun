'use server';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MappedPosition, SourceMapConsumer, type RawSourceMap } from 'source-map-js';

type PositionContent = MappedPosition & { content: string };

export const getSourcemaps = async (key: string, positions: Array<{ line: number; column: number }>) => {
  const endpoint = process.env.SOURCEMAP_SERVER_ENDPOINT;

  const bucket = process.env.SOURCEMAP_BUCKET;

  const client = new S3Client({ endpoint, tls: false, forcePathStyle: true });

  const { Body } = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  const sourcemap = Body ? await Body.transformToString() : '';

  const consumer = new SourceMapConsumer(sourcemap as unknown as RawSourceMap);

  const results: PositionContent[] = [];

  for (const position of positions) {
    const original = consumer.originalPositionFor(position);

    if (original.source) {
      const content = consumer.sourceContentFor(original.source, true);

      results.push({ ...original, content });
    }
  }

  return results;
};
