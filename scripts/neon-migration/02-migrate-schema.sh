#!/bin/bash
# Script 2: Migrate Schema to New Neon Database
# Better Being Production Migration
# Usage: ./02-migrate-schema.sh

set -e

echo "📊 Better Being - Schema Migration"
echo "===================================="
echo ""

# Load new database credentials
if [ ! -f .env.neon.new ]; then
    echo "❌ .env.neon.new not found. Run ./01-create-new-database.sh first"
    exit 1
fi

source .env.neon.new

echo "🔍 Verifying database connection..."
if psql "$DATABASE_URL_DIRECT" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connection successful"
else
    echo "❌ Cannot connect to database"
    exit 1
fi
echo ""

echo "1️⃣ Backing up current schema..."
OLD_DB_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb"

pg_dump "$OLD_DB_URL" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --no-comments \
    > backup/schema_$(date +%Y%m%d_%H%M%S).sql

echo "✅ Schema backed up"
echo ""

echo "2️⃣ Generating fresh migrations with Drizzle..."

# Temporarily update drizzle.config.ts with new DATABASE_URL
export DATABASE_URL="$DATABASE_URL_DIRECT"
export SHADOW_DATABASE_URL="$SHADOW_DATABASE_URL"

pnpm drizzle-kit generate

echo "✅ Migrations generated"
echo ""

echo "3️⃣ Applying schema to new database..."
pnpm drizzle-kit migrate

echo "✅ Schema migrated"
echo ""

echo "4️⃣ Adding performance indexes..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Products indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id
  ON products(category_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_subcategory_id
  ON products(subcategory_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured
  ON products(featured) WHERE featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug
  ON products(slug);

-- Full-text search for products
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search
  ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Orders indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id
  ON orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status
  ON orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at
  ON orders(created_at DESC);

-- Order items indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id
  ON order_items(order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_id
  ON order_items(product_id);

-- Reviews indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_id
  ON reviews(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_rating
  ON reviews(rating);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_helpful
  ON reviews(helpful_count DESC);

-- Cart and wishlist indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_id
  ON cart(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_product_id
  ON cart(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_id
  ON wishlist(user_id);

-- User sessions index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id
  ON user_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at
  ON user_sessions(expires_at);

-- NextAuth indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_user_id
  ON accounts(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_user_id
  ON sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_expires
  ON sessions(expires);
EOSQL

echo "✅ Performance indexes created"
echo ""

echo "5️⃣ Verifying schema..."

# Get table count
TABLE_COUNT=$(psql "$DATABASE_URL_DIRECT" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "  Tables created: $TABLE_COUNT"

# Get index count
INDEX_COUNT=$(psql "$DATABASE_URL_DIRECT" -t -c "SELECT count(*) FROM pg_indexes WHERE schemaname = 'public';")
echo "  Indexes created: $INDEX_COUNT"

# List all tables
echo ""
echo "  Tables:"
psql "$DATABASE_URL_DIRECT" -c "\dt" | grep "public"

echo ""
echo "✅ Schema migration complete!"
echo ""
echo "📊 Next steps:"
echo "  1. Review schema in Drizzle Studio: pnpm db:studio"
echo "  2. Verify indexes in Neon Console"
echo "  3. Run: ./03-migrate-data.sh"
