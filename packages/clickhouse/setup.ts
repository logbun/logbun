import { createClient } from '.';

async function main() {
  try {
    const client = createClient();

    await client.exec({ query: 'CREATE DATABASE IF NOT EXISTS logbun' });

    if (process.env.NODE_ENV === 'development') {
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
              stacktrace JSON,
              stack String,
              sdk JSON,
              os String,
              osVersion String,
              browser String,
              browserVersion String,
              device String,
              key String,
              apiKey String,
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
