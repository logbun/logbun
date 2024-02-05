'use server';

import { fetchFile, generateBucketKey } from '@logbun/utils/server';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';
import { env } from '../env.mjs';
import { EventStacktraceResult, Line } from '../types';

type SourcemapGetter = {
  projectId: string;
  stacktrace: EventStacktraceResult[];
  release?: string;
  maxLines?: number;
};

export const offloadSourcemapsWithJS = async (maxLines: number, results: EventStacktraceResult[]) => {
  const newResults: EventStacktraceResult[] = [];

  for (const stack of results) {
    const { preview, fileName, lineNumber = 1, columnNumber = 1 } = stack;

    if (fileName) {
      const request = await fetch(fileName);

      const minifiedJS = await request.text();

      if (!minifiedJS) throw new Error('Minified JS not found');

      if (preview && preview.length) {
        newResults.push(stack);
      } else {
        let generatedStack: EventStacktraceResult = stack;

        const lines = minifiedJS.split('\n');

        const line = lines.length === 1 ? lineNumber - 1 : Math.min(lineNumber - 1, lines.length - 1);

        const selected = lines[line];

        if (selected) {
          const column = Math.min(columnNumber - 1, selected.length - 1);

          const preview = [lineNumber, selected.slice(Math.max(0, column - maxLines), column + maxLines + 1)] as Line;

          generatedStack = { ...generatedStack, preview: [preview] };
        }

        newResults.push(generatedStack);
      }
    }
  }

  return newResults;
};

export const getSourcemaps = async (options: SourcemapGetter) => {
  let results: EventStacktraceResult[] = [];

  const { projectId, release, stacktrace, maxLines = 5 } = options;

  try {
    for (const stack of stacktrace) {
      let preview: Line[] = [];

      if (!stack.fileName) throw new Error('Filename not fount to load sourcemaps');

      const sourcemapKey = generateBucketKey({ projectId, release, url: stack.fileName });

      const sourcemap = await fetchFile(sourcemapKey, env.S3_SOURCEMAPS_BUCKET);

      if (!sourcemap) throw new Error('No sourcemap');

      // Get original stacktrace
      const code = JSON.parse(sourcemap) as RawSourceMap;

      const consumer = new SourceMapConsumer(code);

      if (stack.lineNumber && stack.columnNumber) {
        const original = consumer.originalPositionFor({ line: stack.lineNumber, column: stack.columnNumber });

        if (original.source) {
          const content = consumer.sourceContentFor(original.source, true);

          if (content) {
            const lines: Line[] = content.split('\n').map((line, index) => [index + 1, line]);

            const start = original.line < maxLines ? 0 : original.line - maxLines;

            // preview = lines;
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
