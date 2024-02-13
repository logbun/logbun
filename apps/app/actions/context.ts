import { fetchFile, fileExists, generateBucketKey, isValidHttpUrl } from '@logbun/server-utils';
import { RawSourceMap, SourceMapConsumer } from 'source-map-js';
import { env } from '../env.mjs';
import { EventStacktraceResult, Line } from '../types';

type ContextGetter = {
  sdk: string;
  projectId: string;
  stacktrace: EventStacktraceResult[];
  release?: string;
  maxLines?: number;
};

export const getContexts = async (options: ContextGetter) => {
  let results: EventStacktraceResult[] = [];

  const trimCode = (content: string, line: number, maxLines = 5) => {
    const rows = content.split('\n');

    const lines: Line[] = rows.map((line, index) => [index + 1, line]);

    return lines.slice(Math.max(line - maxLines, 0), line + maxLines);
  };

  const { projectId, release, stacktrace, maxLines, sdk } = options;

  try {
    for (const stack of stacktrace) {
      const sourcemapBucket = env.S3_SOURCEMAPS_BUCKET;

      const { source, lineNumber, columnNumber, fileName } = stack;

      if (!lineNumber || !fileName) continue;

      const pushPreview = (preview: Line[]) => {
        results.push({ ...stack, preview });
      };

      const addPreview = (content: string, line = lineNumber) => {
        const preview = trimCode(content, line, maxLines);
        pushPreview(preview);
      };

      /** Check for sourcemaps first since any package could send sourcemaps */
      const sourcemapKey = generateBucketKey({ projectId, release, url: fileName });

      const sourcemapExists = await fileExists(sourcemapKey, sourcemapBucket);

      if (sourcemapExists && columnNumber) {
        const sourcemap = await fetchFile(sourcemapKey, sourcemapBucket);

        const code = JSON.parse(sourcemap) as RawSourceMap;

        const consumer = new SourceMapConsumer(code);

        const original = consumer.originalPositionFor({ line: lineNumber, column: columnNumber });

        if (original.source) {
          const content = consumer.sourceContentFor(original.source, true);

          if (content) {
            const preview = trimCode(content, original.line, maxLines);
            results.push({
              functionName: original.name,
              columnNumber: original.column,
              lineNumber: original.line,
              fileName: original.source,
              preview,
            });
            continue;
          }
        }
      }

      console.log('Getting extra');

      /** NodeJS comes shipped with a snippet of the code under source */
      if (sdk.endsWith('node') && source) {
        pushPreview(JSON.parse(source));
        continue;
      }

      /** Things like browser apps, you can directly fetch the code from filename */
      if (isValidHttpUrl(fileName)) {
        const request = await fetch(fileName);

        const jsFile = await request.text();

        addPreview(jsFile);

        continue;
      }
      /** When all fails, then no preview */
      pushPreview([]);
    }

    return results;
  } catch (error) {
    console.error(error);
    return stacktrace;
  }
};
