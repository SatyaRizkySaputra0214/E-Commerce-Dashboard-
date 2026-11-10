import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/schema';

export type Db = PostgresJsDatabase<typeof schema>;

interface DbGlobal {
  __lokaDb?: Db;
  __lokaDbUrl?: string;
}

const globalStore = globalThis as typeof globalThis & DbGlobal;

/** Returns the shared Drizzle database instance, creating it on first use. */
export function useDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Database connection is not configured. Set DATABASE_URL in your environment.');
  }
  if (globalStore.__lokaDb && globalStore.__lokaDbUrl === url) {
    return globalStore.__lokaDb;
  }
  const pooled = url.includes('-pooler');
  const client = postgres(url, {
    prepare: !pooled,
    max: pooled ? 1 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  const db = drizzle(client, { schema });
  globalStore.__lokaDb = db;
  globalStore.__lokaDbUrl = url;
  return db;
}
