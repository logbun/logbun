import * as client from '@clickhouse/client';

export const createClient = () =>
  client.createClient({
    host: process.env.CLICKHOUSE_HOST,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DB,
    username: process.env.CLICKHOUSE_USER,
    clickhouse_settings: {
      allow_experimental_object_type: 1,
    },
  });
