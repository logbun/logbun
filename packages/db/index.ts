import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ?? '';

const sql = postgres(connectionString);

export const db = drizzle(sql, { schema });

export { nanoid } from 'nanoid';

export * from 'drizzle-orm';
