import { z } from 'zod';

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
  handled: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).default({}),
  screenWidth: z.number().default(0),
});

export type EventType = z.infer<typeof eventSchema>;

export type EventTypeResult = EventType & {
  key: string;
  sign: number;
  count: number;
};
