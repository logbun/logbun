import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { sql } from './index';

const connectionString = process.env.DATABASE_URL ?? '';

const migrationsClient = postgres(connectionString, { max: 1 });

console.log('🚚 Starting migration...');

migrate(drizzle(migrationsClient), { migrationsFolder: './migrations' })
  .then(() => {
    sql.end().then(() => {
      console.log('✅ Migrations complete!');
      process.exit(0);
    });
  })
  .catch((err) => {
    sql.end().then(() => {
      console.error('🚨 Migrations failed!', err);
      process.exit(1);
    });
  });
