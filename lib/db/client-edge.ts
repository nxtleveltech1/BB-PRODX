import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env';
import * as schema from './schema';

// Create Neon HTTP client for Edge runtime (RSC and Server Actions)
const sql = neon(env.DATABASE_URL);

// Create Drizzle instance with Neon HTTP driver
// This is optimized for serverless/edge environments
export const db = drizzle(sql, {
  schema,
  logger: env.NODE_ENV === 'development',
});

// Export the database type for use in other modules
export type Database = typeof db;

// Export schema for convenience
export { schema };

// Helper to check database connection (lightweight for edge)
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

// Transaction helper for edge runtime
export async function transaction<T>(
  fn: (tx: typeof db) => Promise<T>
): Promise<T> {
  // Note: Neon HTTP driver doesn't support transactions in edge runtime
  // This is a limitation of the HTTP protocol
  // For transaction support, use the Node.js client in API routes
  console.warn('Transactions are not supported in Edge runtime. Use Node.js client for transactions.');
  return fn(db);
}