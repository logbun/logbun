import { ClickHouseClient } from '@clickhouse/client';
import { clickhouseClient } from '.';

export const setupClickhouseDb = async (client: ClickHouseClient) => {
  await client.exec({
    query: 'CREATE DATABASE IF NOT EXISTS logbun',
  });

  await client.exec({
    query: 'DROP TABLE IF EXISTS logbun.event',
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
            stacktrace String,
            stack String,
            sdk String,
            os String,
            browser String,
            device String,
            fingerprint String,
            apiKey String,
            sign Int8
        ) ENGINE = CollapsingMergeTree(sign)
        ORDER BY (id, fingerprint, timestamp)`,
  });
};

async function main() {
  const client = clickhouseClient();

  await setupClickhouseDb(client);
}

main();
