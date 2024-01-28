import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ?? '';

export const sql = postgres(connectionString);

export const db = drizzle(sql, { schema });

export * from 'drizzle-orm';

export * from './schema';
