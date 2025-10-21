#!/bin/bash
# Script 3: Migrate Data to New Neon Database
# Better Being Production Migration
# Usage: ./03-migrate-data.sh

set -e

echo "💾 Better Being - Data Migration"
echo "=================================="
echo ""

# Load configuration
if [ ! -f .env.neon.new ]; then
    echo "❌ .env.neon.new not found"
    exit 1
fi

source .env.neon.new

OLD_DB_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb"

echo "⚠️  WARNING: This will migrate all data from old to new database"
echo "  Source: ep-sweet-rain-agsv46iq (current production)"
echo "  Target: $NEON_PROJECT_NAME (new database)"
echo ""

read -p "Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Create backup directory
mkdir -p backup/data

echo ""
echo "1️⃣ Exporting data from old database..."
echo "  This may take several minutes..."
echo ""

# Export users and auth (foundation tables first)
echo "  → Exporting users and authentication..."
pg_dump "$OLD_DB_URL" \
    --data-only \
    --table=users \
    --table=user_sessions \
    --table=accounts \
    --table=sessions \
    --table=verification_tokens \
    --disable-triggers \
    > backup/data/01_users_auth.sql

# Export catalog data
echo "  → Exporting product catalog..."
pg_dump "$OLD_DB_URL" \
    --data-only \
    --table=categories \
    --table=subcategories \
    --table=products \
    --table=product_benefits \
    --table=product_ingredients \
    --table=product_tags \
    --table=product_sizes \
    --disable-triggers \
    > backup/data/02_products.sql

# Export transactional data
echo "  → Exporting orders..."
pg_dump "$OLD_DB_URL" \
    --data-only \
    --table=orders \
    --table=order_items \
    --disable-triggers \
    > backup/data/03_orders.sql

# Export reviews
echo "  → Exporting reviews..."
pg_dump "$OLD_DB_URL" \
    --data-only \
    --table=reviews \
    --table=review_votes \
    --disable-triggers \
    > backup/data/04_reviews.sql

# Export cart and wishlist
echo "  → Exporting cart and wishlist..."
pg_dump "$OLD_DB_URL" \
    --data-only \
    --table=cart \
    --table=wishlist \
    --disable-triggers \
    > backup/data/05_cart_wishlist.sql

# Export social media data
echo "  → Exporting social media posts..."
pg_dump "$OLD_DB_URL" \
    --data-only \
    --table=instagram_posts \
    --disable-triggers \
    > backup/data/06_social.sql 2>/dev/null || echo "  (no instagram_posts table found, skipping)"

echo "✅ Data export complete"
echo ""

echo "2️⃣ Importing data to new database..."
echo "  Importing in order to respect foreign keys..."
echo ""

# Import in correct order (respecting foreign keys)
echo "  → Importing users and authentication..."
psql "$DATABASE_URL_DIRECT" < backup/data/01_users_auth.sql

echo "  → Importing product catalog..."
psql "$DATABASE_URL_DIRECT" < backup/data/02_products.sql

echo "  → Importing orders..."
psql "$DATABASE_URL_DIRECT" < backup/data/03_orders.sql

echo "  → Importing reviews..."
psql "$DATABASE_URL_DIRECT" < backup/data/04_reviews.sql

echo "  → Importing cart and wishlist..."
psql "$DATABASE_URL_DIRECT" < backup/data/05_cart_wishlist.sql

echo "  → Importing social media..."
[ -f backup/data/06_social.sql ] && psql "$DATABASE_URL_DIRECT" < backup/data/06_social.sql || echo "  (skipped)"

echo "✅ Data import complete"
echo ""

echo "3️⃣ Verifying data integrity..."
echo ""

# Function to compare counts
compare_counts() {
    local table=$1
    echo "  Checking $table..."

    old_count=$(psql "$OLD_DB_URL" -t -c "SELECT count(*) FROM $table;" | xargs)
    new_count=$(psql "$DATABASE_URL_DIRECT" -t -c "SELECT count(*) FROM $table;" | xargs)

    if [ "$old_count" = "$new_count" ]; then
        echo "    ✅ $old_count rows (match)"
    else
        echo "    ❌ Old: $old_count, New: $new_count (MISMATCH)"
        return 1
    fi
}

# Verify all tables
compare_counts "users"
compare_counts "products"
compare_counts "categories"
compare_counts "orders"
compare_counts "order_items"
compare_counts "reviews"
compare_counts "cart"

echo ""
echo "4️⃣ Checking foreign key relationships..."

# Verify foreign keys
psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Orders should all have valid users
SELECT
  'Orders with invalid users' as check_name,
  COUNT(*) as invalid_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;

-- Order items should all have valid orders and products
SELECT
  'Order items with invalid orders' as check_name,
  COUNT(*) as invalid_count
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.id IS NULL;

SELECT
  'Order items with invalid products' as check_name,
  COUNT(*) as invalid_count
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
WHERE p.id IS NULL;

-- Reviews should have valid products and users
SELECT
  'Reviews with invalid products' as check_name,
  COUNT(*) as invalid_count
FROM reviews r
LEFT JOIN products p ON r.product_id = p.id
WHERE p.id IS NULL;
EOSQL

echo ""
echo "5️⃣ Updating sequences (auto-increment IDs)..."

# Reset all sequences to max ID + 1
psql "$DATABASE_URL_DIRECT" << 'EOSQL'
DO $$
DECLARE
    seq record;
BEGIN
    FOR seq IN
        SELECT sequence_name, table_name, column_name
        FROM information_schema.columns
        WHERE column_default LIKE 'nextval%'
        AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'SELECT setval(''%I'', COALESCE((SELECT MAX(%I) FROM %I), 1))',
            seq.sequence_name, seq.column_name, seq.table_name
        );
        RAISE NOTICE 'Reset sequence: %', seq.sequence_name;
    END LOOP;
END $$;
EOSQL

echo "✅ Sequences updated"
echo ""

echo "6️⃣ Generating data migration report..."

cat > backup/migration_report.txt << EOF
Better Being - Data Migration Report
=====================================
Date: $(date)
Source: ep-sweet-rain-agsv46iq
Target: $NEON_PROJECT_NAME

Row Counts:
-----------
EOF

# Add all table counts to report
for table in users products categories orders order_items reviews cart wishlist; do
    count=$(psql "$DATABASE_URL_DIRECT" -t -c "SELECT count(*) FROM $table;" 2>/dev/null | xargs || echo "0")
    printf "%-20s %10s rows\n" "$table:" "$count" >> backup/migration_report.txt
done

cat >> backup/migration_report.txt << EOF

Database Size:
--------------
EOF

psql "$DATABASE_URL_DIRECT" -c "
SELECT
    pg_size_pretty(pg_database_size(current_database())) as database_size,
    pg_size_pretty(pg_total_relation_size('products')) as products_size,
    pg_size_pretty(pg_total_relation_size('orders')) as orders_size,
    pg_size_pretty(pg_total_relation_size('order_items')) as order_items_size;
" >> backup/migration_report.txt

cat backup/migration_report.txt

echo ""
echo "✅ Data migration complete!"
echo ""
echo "📊 Summary:"
echo "  - All data exported and imported"
echo "  - Row counts verified"
echo "  - Foreign keys validated"
echo "  - Sequences updated"
echo "  - Report saved: backup/migration_report.txt"
echo ""
echo "📋 Next steps:"
echo "  1. Review migration report"
echo "  2. Test database queries"
echo "  3. Run: ./04-configure-vercel.sh"
