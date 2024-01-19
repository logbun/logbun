'use server';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { generateMinifiedKey, generateSourceMapKey } from '@logbun/utils';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';
import { EventStacktraceResult, Line } from '../types';

type SourcemapGetter = {
  id: string;
  stacktrace: EventStacktraceResult[];
  release?: string;
  maxLines?: number;
};

export const getSourcemaps = async (options: SourcemapGetter) => {
  const { id, release = '', stacktrace, maxLines = 5 } = options;

  try {
    const sourcemapKey = generateSourceMapKey({ id, release });

    const minifiedKey = generateMinifiedKey({ id, release });

    const accessKeyId = process.env.S3_ACCESS_KEY_ID;

    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) throw new Error('Environment unavailable');

    const client = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      tls: false,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    });

    const getFile = async (key: string) => {
      try {
        const { Body } = await client.send(
          new GetObjectCommand({
            Bucket: process.env.S3_SOURCEMAPS_BUCKET,
            Key: key,
          })
        );

        const content = Body ? await Body.transformToString() : '';

        return content;
      } catch (error) {
        return '';
      }
    };

    const sourcemap = await getFile(sourcemapKey);

    if (!sourcemap) throw new Error('No sourcemap');

    const results: EventStacktraceResult[] = [];

    if (sourcemap) {
      const code = JSON.parse(sourcemap) as RawSourceMap;

      const consumer = new SourceMapConsumer(code);

      for (const stack of stacktrace) {
        let preview: Line[] = [];

        if (stack.lineNumber && stack.columnNumber) {
          const original = consumer.originalPositionFor({ line: stack.lineNumber, column: stack.columnNumber });

          if (original.source) {
            const content = consumer.sourceContentFor(original.source, true);

            console.log(content.substring(0, 50));

            if (content) {
              const lines: Line[] = content.split('\n').map((line, index) => [index + 1, line]);

              const start = original.line < maxLines ? 0 : original.line - maxLines;

              // preview = lines.slice(start, original.line + maxLines);
              preview = lines.slice(start, original.line + maxLines);
            }
          }

          // Enhanced stack based on sourcemap
          results.push({
            functionName: original.name,
            columnNumber: original.column,
            lineNumber: original.line,
            fileName: original.source,
            preview,
          });
        } else {
          results.push(stack);
        }
      }
    }

    const hasMissingPreviews = results.some(({ preview }) => !preview?.length);

    if (!hasMissingPreviews) return results;

    // If has missing previews, lets try to get preview from the minified JS file
    const minified = await getFile(minifiedKey);

    if (!minified) return results;

    const fullResults: EventStacktraceResult[] = [];

    for (const stack of results) {
      const { preview, lineNumber = 1, columnNumber = 1 } = stack;

      if (preview && preview.length) {
        fullResults.push(stack);
      } else {
        let generatedStack: EventStacktraceResult = stack;

        const lines = minified.split('\n');

        const line = lines.length === 1 ? lineNumber - 1 : Math.min(lineNumber - 1, lines.length - 1);

        const selected = lines[line];

        if (selected) {
          const column = Math.min(columnNumber - 1, selected.length - 1);

          const preview = [lineNumber, selected.slice(Math.max(0, column - maxLines), column + maxLines + 1)] as Line;

          generatedStack = { ...generatedStack, preview: [preview] };
        }

        fullResults.push(generatedStack);
      }
    }

    return fullResults;
  } catch (error) {
    return stacktrace;
  }
};
