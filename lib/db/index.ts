/**
 * Main database exports
 * Re-exports all database utilities and connections
 *
 * Usage:
 * - Server Components/Actions: import { db } from '@/lib/db' (uses Edge client)
 * - API Routes/Backend: import { db } from '@/lib/db/client-node' (uses Node pool)
 * - Authentication: import { db } from '@/lib/db/client-node' (requires transactions)
 */

// Export Edge client for Server Components and RSCs
// This is the default and safe for middleware/edge runtime
export { db, checkDatabaseConnection } from './client-edge';

// Export all schemas
export * from './schema';

// Export utilities
export * from './utils';

// Default export: Edge client (safe for middleware and edge runtime)
export { db as default } from './client-edge';

// Note: For Node.js pool-based client, import directly:
// import { db } from '@/lib/db/client-node'