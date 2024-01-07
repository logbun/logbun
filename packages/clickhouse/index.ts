import { createClient } from '@clickhouse/client';

export const clickhouseClient = () =>
  createClient({
    host: process.env.CLICKHOUSE_HOST,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DB,
    username: process.env.CLICKHOUSE_USER,
  });
