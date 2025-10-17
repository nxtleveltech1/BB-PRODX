import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load backend environment variables for database setup
config({ path: './server/.env' });

export default defineConfig({
  schema: './lib/db/schema',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  // Table prefix for migrations tracking
  migrations: {
    table: '__drizzle_migrations__',
    schema: 'drizzle',
  },
  // Include shadow database for safe migrations if configured
  ...(process.env.SHADOW_DATABASE_URL && {
    dbCredentials: {
      url: process.env.DATABASE_URL!,
      shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
    },
  }),
});