import { createClient } from './index';

async function main() {
  try {
    const client = createClient();

    await client.exec({ query: 'CREATE DATABASE IF NOT EXISTS logbun' });

    if (process.env.NODE_ENV !== 'production') {
      await client.exec({ query: 'DROP TABLE IF EXISTS logbun.event' });
    }

    await client.exec({
      query: `CREATE TABLE IF NOT EXISTS logbun.event (
              id String,
              name String,
              message String,
              timestamp UInt64,
              level String,
              handled Boolean,
              resolved Boolean,
              metadata JSON,
              stacktrace Array(JSON),
              sdk JSON,
              os String,
              osVersion String,
              browser String,
              browserVersion String,
              device String,
              key String,
              projectId String,
              sign Int8
          ) ENGINE = CollapsingMergeTree(sign)
            ORDER BY (id, key, timestamp)`,
    });

    console.log('✅ Table created successfully');
  } catch (error) {
    console.error('🚨 Error during setup:', error);
  } finally {
    process.exit();
  }
}

main();
