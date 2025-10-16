import { sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

// Helper for case-insensitive search
export function ilike(column: PgColumn, value: string) {
  return sql`${column} ILIKE ${`%${value}%`}`;
}

// Helper for pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function createPaginationResult<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> {
  const { page, limit } = getPaginationParams(params);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Helper for batch operations
export async function batchInsert<T extends Record<string, any>>(
  table: any,
  data: T[],
  batchSize = 1000
): Promise<void> {
  const { db } = await import('./client-node');

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await db.insert(table).values(batch);
  }
}

// Helper for safe JSON parsing from JSONB columns
export function parseJsonbField<T>(value: unknown): T | null {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value as T;
}

// Helper for building dynamic where conditions
export function buildWhereConditions(filters: Record<string, any>) {
  const conditions: any[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle different filter types
      if (Array.isArray(value)) {
        // For array values, use IN operator
        conditions.push(sql`${sql.identifier(key)} = ANY(${value})`);
      } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
        // For range queries
        conditions.push(sql`${sql.identifier(key)} BETWEEN ${value.min} AND ${value.max}`);
      } else {
        // For exact match
        conditions.push(sql`${sql.identifier(key)} = ${value}`);
      }
    }
  });

  return conditions;
}

// Helper for generating slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

// Helper for retry logic
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    shouldRetry = (error) => 
      // Retry on connection errors
       error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT'
    ,
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Helper for soft deletes (if needed in future)
export interface SoftDeletable {
  deletedAt: Date | null;
}

export function excludeDeleted<T extends SoftDeletable>(query: any) {
  return sql`${query} AND deleted_at IS NULL`;
}

// Helper for database health check
export async function checkDatabaseConnection(): Promise<{
  isConnected: boolean;
  error?: string;
  latency?: number;
}> {
  try {
    const startTime = Date.now();
    const { db } = await import('./client-node');

    // Simple query to check connection
    await db.execute(sql`SELECT 1`);

    const latency = Date.now() - startTime;

    return {
      isConnected: true,
      latency,
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}