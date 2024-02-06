'use server';

import { env } from '@logbun/app/env.mjs';
import { isValidHttpUrl, isValidNumber } from '@logbun/utils';
import { fetchFile, fileExists, generateBucketKey } from '@logbun/utils/server';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';
import { EventStacktraceResult, Line } from '../types';

type SourcemapGetter = {
  projectId: string;
  stacktrace: EventStacktraceResult[];
  release?: string;
  maxLines?: number;
};

export const contentToPreview = (content: string, lineNumber: number, maxLines: number) => {
  const lines: Line[] = content.split('\n').map((line, index) => [index + 1, line]);

  // const start = lineNumber < maxLines ? 0 : lineNumber - maxLines;

  const start = Math.max(lineNumber - maxLines, 0);

  const end = lineNumber + maxLines;

  return lines.slice(start, end);
};

export const offloadSourcemapsWithJS = async (maxLines: number, stacktrace: EventStacktraceResult[]) => {
  const newResults: EventStacktraceResult[] = [];

  for (const stack of stacktrace) {
    const { preview, fileName, lineNumber } = stack;

    const noPreview = !preview || preview.length <= 0;

    if (fileName && noPreview && isValidNumber(lineNumber)) {
      const request = await fetch(fileName);

      const minifiedJS = await request.text();

      const preview = contentToPreview(minifiedJS, lineNumber!, maxLines);

      newResults.push({ ...stack, preview });
    } else {
      newResults.push(stack);
    }
  }

  return newResults;
};

export const getSourcemaps = async (options: SourcemapGetter) => {
  let results: EventStacktraceResult[] = [];

  const { projectId, release, stacktrace, maxLines = 5 } = options;

  try {
    for (const stack of stacktrace) {
      const { fileName, lineNumber, columnNumber } = stack;

      if (fileName && isValidHttpUrl(fileName)) {
        const sourcemapKey = generateBucketKey({ projectId, release, url: fileName });

        const sourcemapExists = await fileExists(sourcemapKey, env.S3_SOURCEMAPS_BUCKET);

        if (sourcemapExists && isValidNumber(lineNumber) && columnNumber) {
          const sourcemap = await fetchFile(sourcemapKey, env.S3_SOURCEMAPS_BUCKET);

          if (!sourcemap) throw new Error('No sourcemap');

          const code = JSON.parse(sourcemap) as RawSourceMap;

          const consumer = new SourceMapConsumer(code);

          const original = consumer.originalPositionFor({ line: lineNumber!, column: columnNumber });

          let preview: Line[] = [];

          if (original.source) {
            const content = consumer.sourceContentFor(original.source, true);

            if (content) {
              preview = contentToPreview(content, original.line, maxLines);
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
      } else {
        results.push(stack);
      }
    }

    const missingPreviews = results.some(({ preview }) => {
      return !preview || preview.length === 0;
    });

    if (!missingPreviews) return results;

    try {
      results = await offloadSourcemapsWithJS(maxLines, results);
    } catch (error) {
      /* This is to ensure that results is returned instead on stacktrace*/
    }

    return results;
  } catch (error) {
    console.error(error);
    return stacktrace;
  }
};
