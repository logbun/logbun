import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number().optional(),

    DATABASE_URL: z.string().url(),
    EMAIL_SERVER: z.string().min(1),
    EMAIL_FROM: z.string().min(1),

    CLICKHOUSE_HOST: z.string().url(),
    CLICKHOUSE_DB: z.string().min(1),
    CLICKHOUSE_PASSWORD: z.string().min(1),
    CLICKHOUSE_USER: z.string().min(1),

    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_ENDPOINT: z.string().url(),
    S3_SOURCEMAPS_BUCKET: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,

    DATABASE_URL: process.env.DATABASE_URL,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,

    CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
    CLICKHOUSE_DB: process.env.CLICKHOUSE_DB,
    CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD,
    CLICKHOUSE_USER: process.env.CLICKHOUSE_USER,

    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_SOURCEMAPS_BUCKET: process.env.S3_SOURCEMAPS_BUCKET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
