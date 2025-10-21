#!/bin/bash
# Script 5: Optimize Database Performance
# Better Being Production Migration
# Usage: ./05-optimize-performance.sh

set -e

echo "⚡ Better Being - Performance Optimization"
echo "==========================================="
echo ""

# Load configuration
if [ ! -f .env.neon.new ]; then
    echo "❌ .env.neon.new not found"
    exit 1
fi

source .env.neon.new

echo "1️⃣ Analyzing current query performance..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Enable pg_stat_statements for query analysis
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Get slowest queries (if any exist)
SELECT
  calls,
  mean_exec_time::numeric(10,2) as avg_ms,
  max_exec_time::numeric(10,2) as max_ms,
  SUBSTRING(query, 1, 100) as query_preview
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
EOSQL

echo "✅ Query analysis complete"
echo ""

echo "2️⃣ Optimizing PostgreSQL settings..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Connection pooling settings (already optimized by Neon)
-- These are informational only

SHOW max_connections;
SHOW shared_buffers;
SHOW effective_cache_size;
SHOW work_mem;

-- Query optimization
SET random_page_cost = 1.1;  -- For SSD storage
SET effective_io_concurrency = 200;  -- For SSD storage
EOSQL

echo "✅ PostgreSQL settings optimized"
echo ""

echo "3️⃣ Creating materialized views for analytics..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Product statistics (for dashboard)
CREATE MATERIALIZED VIEW IF NOT EXISTS product_stats AS
SELECT
  p.id,
  p.name,
  p.slug,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(oi.quantity) as total_sold,
  AVG(r.rating)::numeric(3,2) as avg_rating,
  COUNT(DISTINCT r.id) as review_count,
  MAX(o.created_at) as last_ordered_at
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, p.slug;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_stats_id ON product_stats(id);
CREATE INDEX IF NOT EXISTS idx_product_stats_total_sold ON product_stats(total_sold DESC);
CREATE INDEX IF NOT EXISTS idx_product_stats_avg_rating ON product_stats(avg_rating DESC);

-- Order statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS order_stats AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as order_count,
  SUM(total_amount) as revenue,
  AVG(total_amount)::numeric(10,2) as avg_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status != 'cancelled'
GROUP BY DATE_TRUNC('day', created_at);

CREATE INDEX IF NOT EXISTS idx_order_stats_date ON order_stats(date DESC);

-- Refresh views (should be done periodically)
REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats;
EOSQL

echo "✅ Materialized views created"
echo ""

echo "4️⃣ Setting up automatic statistics updates..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Analyze tables to update statistics
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE reviews;
ANALYZE users;

-- Enable auto-vacuum (should be enabled by default)
ALTER TABLE products SET (autovacuum_enabled = true);
ALTER TABLE orders SET (autovacuum_enabled = true);
ALTER TABLE order_items SET (autovacuum_enabled = true);
EOSQL

echo "✅ Statistics updated"
echo ""

echo "5️⃣ Creating database functions for common queries..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Function: Get product with all details (avoids N+1 queries)
CREATE OR REPLACE FUNCTION get_product_details(product_slug text)
RETURNS json AS $$
  SELECT json_build_object(
    'product', row_to_json(p.*),
    'category', row_to_json(c.*),
    'subcategory', row_to_json(sc.*),
    'sizes', COALESCE(
      (SELECT json_agg(row_to_json(ps.*))
       FROM product_sizes ps
       WHERE ps.product_id = p.id),
      '[]'::json
    ),
    'benefits', COALESCE(
      (SELECT json_agg(row_to_json(pb.*))
       FROM product_benefits pb
       WHERE pb.product_id = p.id),
      '[]'::json
    ),
    'ingredients', COALESCE(
      (SELECT json_agg(row_to_json(pi.*))
       FROM product_ingredients pi
       WHERE pi.product_id = p.id),
      '[]'::json
    ),
    'reviews', COALESCE(
      (SELECT json_agg(row_to_json(r.*))
       FROM reviews r
       WHERE r.product_id = p.id
       ORDER BY r.created_at DESC
       LIMIT 10),
      '[]'::json
    ),
    'stats', row_to_json(ps.*)
  )
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
  LEFT JOIN product_stats ps ON p.id = ps.id
  WHERE p.slug = product_slug;
$$ LANGUAGE sql STABLE;

-- Function: Search products with full-text search
CREATE OR REPLACE FUNCTION search_products(search_term text, limit_count int DEFAULT 20)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  image_url text,
  slug text,
  rank real
) AS $$
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    p.slug,
    ts_rank(
      to_tsvector('english', p.name || ' ' || p.description),
      plainto_tsquery('english', search_term)
    ) as rank
  FROM products p
  WHERE to_tsvector('english', p.name || ' ' || p.description)
    @@ plainto_tsquery('english', search_term)
  ORDER BY rank DESC
  LIMIT limit_count;
$$ LANGUAGE sql STABLE;

-- Function: Get user's cart with product details
CREATE OR REPLACE FUNCTION get_user_cart(user_uuid uuid)
RETURNS json AS $$
  SELECT json_build_object(
    'items', COALESCE(
      (SELECT json_agg(
        json_build_object(
          'cart_item', row_to_json(c.*),
          'product', row_to_json(p.*),
          'size', row_to_json(ps.*)
        )
      )
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_sizes ps ON c.size_id = ps.id
      WHERE c.user_id = user_uuid),
      '[]'::json
    ),
    'total', COALESCE(
      (SELECT SUM(c.quantity * p.price)
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = user_uuid),
      0
    )
  );
$$ LANGUAGE sql STABLE;
EOSQL

echo "✅ Database functions created"
echo ""

echo "6️⃣ Setting up connection pooling optimization..."

cat > lib/db/pool-config.ts << 'EOF'
// Optimized connection pool configuration for Neon
export const POOL_CONFIG = {
  // Development (local)
  development: {
    max: 5,
    min: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },

  // Preview (Vercel preview deployments)
  preview: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 3000,
  },

  // Production (Vercel production)
  production: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
  },
} as const

export function getPoolConfig() {
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
  return POOL_CONFIG[env as keyof typeof POOL_CONFIG] || POOL_CONFIG.development
}
EOF

echo "✅ Pool configuration created"
echo ""

echo "7️⃣ Creating query performance monitoring..."

mkdir -p lib/monitoring

cat > lib/monitoring/query-performance.ts << 'EOF'
// Query performance tracking
import { performance } from 'perf_hooks'

interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  success: boolean
  error?: string
}

const metrics: QueryMetrics[] = []
const MAX_METRICS = 1000

export async function trackQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  let success = true
  let error: string | undefined

  try {
    const result = await queryFn()
    return result
  } catch (err) {
    success = false
    error = err instanceof Error ? err.message : String(err)
    throw err
  } finally {
    const duration = performance.now() - start

    // Log slow queries (>1s)
    if (duration > 1000) {
      console.warn(`⚠️  Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`)
    }

    // Store metric
    metrics.push({
      query: queryName,
      duration,
      timestamp: new Date(),
      success,
      error,
    })

    // Keep only last 1000 metrics
    if (metrics.length > MAX_METRICS) {
      metrics.shift()
    }
  }
}

export function getQueryMetrics() {
  return {
    total: metrics.length,
    slowQueries: metrics.filter(m => m.duration > 1000).length,
    errors: metrics.filter(m => !m.success).length,
    avgDuration: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
    p95Duration: calculatePercentile(metrics.map(m => m.duration), 95),
    p99Duration: calculatePercentile(metrics.map(m => m.duration), 99),
  }
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[index] || 0
}
EOF

echo "✅ Query monitoring created"
echo ""

echo "8️⃣ Setting up cron job for materialized view refresh..."

cat > scripts/refresh-analytics.sh << 'EOF'
#!/bin/bash
# Refresh materialized views for analytics
# Run this via Vercel Cron: /api/cron/refresh-analytics

set -e

echo "Refreshing materialized views..."

psql "$DATABASE_URL" << 'EOSQL'
REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats;
EOSQL

echo "✅ Materialized views refreshed"
EOF

chmod +x scripts/refresh-analytics.sh

# Create API route for cron
mkdir -p app/api/cron

cat > app/api/cron/refresh-analytics/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client-node'
import { sql } from 'drizzle-orm'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Refresh materialized views
    await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats`)
    await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to refresh analytics:', error)
    return NextResponse.json(
      { error: 'Failed to refresh analytics' },
      { status: 500 }
    )
  }
}
EOF

echo "✅ Analytics refresh cron created"
echo ""

echo "✅ Performance optimization complete!"
echo ""
echo "📊 Summary:"
echo "  - Query analysis enabled (pg_stat_statements)"
echo "  - PostgreSQL settings optimized"
echo "  - Materialized views created"
echo "  - Database functions created"
echo "  - Connection pooling configured"
echo "  - Query monitoring set up"
echo "  - Analytics refresh cron created"
echo ""
echo "📋 Recommendations:"
echo "  1. Add CRON_SECRET to Vercel environment variables"
echo "  2. Monitor slow queries in production"
echo "  3. Refresh materialized views daily: /api/cron/refresh-analytics"
echo "  4. Review query performance metrics weekly"
echo ""
echo "📈 Next steps:"
echo "  Run: ./06-production-deployment.sh"
