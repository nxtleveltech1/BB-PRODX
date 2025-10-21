import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db/client-edge';
import { env } from '@/lib/env';

/**
 * Database health check endpoint
 * Returns database connectivity status and basic info
 *
 * GET /api/health/db
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Check if DATABASE_URL is configured
    if (!env.DATABASE_URL) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'DATABASE_URL not configured',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Test database connection
    const isConnected = await checkDatabaseConnection();
    const responseTime = Date.now() - startTime;

    if (!isConnected) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Connection successful
    return NextResponse.json({
      status: 'healthy',
      message: 'Database connection successful',
      database: {
        type: 'neon-postgres',
        driver: 'neon-http',
        runtime: 'edge',
      },
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Health Check] Database error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database health check failed',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

// Optional: Add runtime config for Edge runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
