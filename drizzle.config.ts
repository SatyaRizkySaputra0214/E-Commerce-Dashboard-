import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

if (existsSync('.env')) process.loadEnvFile();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not set. Add it to your .env file.');

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
    ssl: 'require',
  },
});
