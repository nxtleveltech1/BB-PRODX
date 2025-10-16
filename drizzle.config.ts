import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env';

export default defineConfig({
  schema: './lib/db/schema',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  // Table prefix for migrations tracking
  migrations: {
    table: '__drizzle_migrations__',
    schema: 'drizzle',
  },
  // Include shadow database for safe migrations if configured
  ...(env.SHADOW_DATABASE_URL && {
    dbCredentials: {
      url: env.DATABASE_URL,
      shadowDatabaseUrl: env.SHADOW_DATABASE_URL,
    },
  }),
});