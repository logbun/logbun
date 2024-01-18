import { z } from 'zod';

export const eventHeaderSchema = z.object({
  ['user-agent']: z.string().optional(),
  ['x-api-key']: z.string(),
});

export const eventSchema = z.object({
  name: z.string(),
  message: z.string(),
  timestamp: z.number(),
  sdk: z.object({
    name: z.string(),
    url: z.string(),
    version: z.string(),
  }),
  stacktrace: z.array(
    z.object({
      fileName: z.string().optional(),
      functionName: z.string().optional(),
      lineNumber: z.number().optional(),
      columnNumber: z.number().optional(),
      source: z.string().optional(),
    })
  ),
  level: z.string().default('error'),
  release: z.string().optional(),
  handled: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).default({}),
  screenWidth: z.number().default(0),
});

export const sourcemapSchema = z.object({
  api_key: z.string(),
  release: z.string().optional(),
  minified_file: z.instanceof(File),
  sourcemap_file: z.instanceof(File),
});

export type SourcemapType = z.infer<typeof sourcemapSchema>;

export type EventType = z.infer<typeof eventSchema>;

export type EventTypeResult = EventType & {
  key: string;
  sign: number;
  count: number;
};
