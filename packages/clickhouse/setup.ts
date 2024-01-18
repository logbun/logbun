import { createClient } from './client';

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
              createdAt UInt64,
              updatedAt UInt64,
              level String,
              release Nullable(String),
              handled Boolean,
              resolved Boolean,
              metadata JSON,
              trend Array(JSON),
              stacktrace Array(JSON),
              sdk JSON,
              os String,
              osVersion String,
              browser String,
              browserVersion String,
              device String,
              key String,
              projectId String,
              count Int32,
              sign Int8
          ) ENGINE = CollapsingMergeTree(sign)
            ORDER BY (key)`,
    });

    console.log('✅ Table created successfully');
  } catch (error) {
    console.error('🚨 Error during setup:', error);
  } finally {
    process.exit();
  }
}

main();
