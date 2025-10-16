import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '@/lib/env';
import * as schema from './schema';

const { Pool } = pg;

// Configuration for Node.js PostgreSQL pool
const poolConfig = {
  connectionString: env.DATABASE_URL,

  // Connection pool settings from environment
  max: env.DB_MAX_CONNECTIONS,
  min: env.DB_MIN_CONNECTIONS,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT,

  // SSL configuration based on environment
  ssl: env.NODE_ENV === 'production'
    ? {
        rejectUnauthorized: true,
        ca: env.DB_SSL_CA,
        cert: env.DB_SSL_CERT,
        key: env.DB_SSL_KEY,
      }
    : env.DATABASE_URL.includes('localhost')
      ? false
      : { rejectUnauthorized: false },
};

// Create PostgreSQL connection pool
let pool: pg.Pool | null = null;
let isPoolClosed = false;

function getPool(): pg.Pool {
  if (!pool || isPoolClosed) {
    pool = new Pool(poolConfig);
    isPoolClosed = false;

    // Set up event listeners for monitoring
    pool.on('connect', (client) => {
      if (env.NODE_ENV === 'development') {
        console.log(`✅ Database pool connection established. Total: ${pool.totalCount}`);
      }

      // Set connection-level optimizations
      client.query(`
        SET statement_timeout = '${env.DB_STATEMENT_TIMEOUT}ms';
        SET idle_in_transaction_session_timeout = '10s';
        SET search_path = public;
      `).catch(err => {
        console.warn('Failed to set connection optimizations:', err.message);
      });
    });

    pool.on('error', (err) => {
      console.error('❌ Unexpected database pool error:', err.message);
      if (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND') {
        console.log('🔄 Pool will attempt to reconnect automatically...');
      }
    });

    pool.on('remove', () => {
      if (env.NODE_ENV === 'development') {
        console.log(`📤 Connection removed from pool. Idle: ${pool.idleCount}/${pool.totalCount}`);
      }
    });
  }

  return pool;
}

// Create Drizzle instance with pg pool
// This is optimized for Node.js environments (CLI, migrations, scripts)
export const db = drizzle(getPool(), {
  schema,
  logger: env.NODE_ENV === 'development',
});

// Export the database type
export type Database = typeof db;

// Export schema for convenience
export { schema };

// Pool statistics for monitoring
export function getPoolStats() {
  const currentPool = pool;
  if (!currentPool) {
    return {
      total: 0,
      idle: 0,
      waiting: 0,
      max: poolConfig.max,
      min: poolConfig.min,
      isHealthy: false,
    };
  }

  return {
    total: currentPool.totalCount,
    idle: currentPool.idleCount,
    waiting: currentPool.waitingCount,
    max: poolConfig.max,
    min: poolConfig.min,
    isHealthy: currentPool.totalCount > 0,
  };
}

// Health check function
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  timestamp?: Date;
  version?: string;
  poolStats?: ReturnType<typeof getPoolStats>;
  error?: string;
}> {
  try {
    const currentPool = getPool();
    const client = await currentPool.connect();

    const result = await client.query(`
      SELECT NOW() as current_time,
             version() as db_version,
             current_database() as database_name
    `);

    client.release();

    return {
      healthy: true,
      timestamp: result.rows[0].current_time,
      version: result.rows[0].db_version,
      poolStats: getPoolStats(),
    };
  } catch (error) {
    const err = error as Error;
    return {
      healthy: false,
      error: err.message,
      poolStats: getPoolStats(),
    };
  }
}

// Close the pool gracefully
export async function closePool(): Promise<void> {
  if (!pool || isPoolClosed) return;

  try {
    await pool.end();
    isPoolClosed = true;
    console.log('✅ Database pool closed successfully');
  } catch (error) {
    const err = error as Error;
    console.warn('⚠️ Error closing database pool:', err.message);
  }
}

// Transaction helper with proper typing
export async function transaction<T>(
  fn: (tx: typeof db) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    // Create a transaction-scoped db instance
    const txDb = drizzle(client, { schema, logger: false });
    const result = await fn(txDb);

    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, closing database pool...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing database pool...');
  await closePool();
  process.exit(0);
});

// Prevent unhandled promise rejections from crashing the process
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});