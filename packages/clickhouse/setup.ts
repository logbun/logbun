import { ClickHouseClient, createClient } from '@clickhouse/client';

export const setupClickhouseDb = async (client: ClickHouseClient) => {
  await client.exec({
    query: 'CREATE DATABASE IF NOT EXISTS logbun',
  });

  await client.exec({
    query: `CREATE TABLE IF NOT EXISTS logbun.event (
            id String,
            name String,
            message String,
            timestamp DateTime,
            level String,
            handled UInt8,
            metadata String,
            stacktrace Array(String),
            stack String,
            sdk String,
            os String,
            browser String,
            device String,
            fingerprint String
        ) ENGINE = MergeTree()
        ORDER BY (id, timestamp)`,
  });
};

async function main() {
  const client = createClient({
    host: process.env.CLICKHOUSE_HOST,
    password: process.env.CLICKHOUSE_PASSWORD,
    database: process.env.CLICKHOUSE_DB,
    username: process.env.CLICKHOUSE_USER,
  });

  await setupClickhouseDb(client);
}

main();
