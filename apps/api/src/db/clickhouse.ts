import { createClient } from '@logbun/clickhouse';

console.log({
  host: process.env.CLICKHOUSE_HOST,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DB,
  username: process.env.CLICKHOUSE_USER,
});

export const client = createClient({
  host: process.env.CLICKHOUSE_HOST,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DB,
  username: process.env.CLICKHOUSE_USER,
});
