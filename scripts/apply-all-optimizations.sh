#!/usr/bin/env bash

# Apply all database optimizations to Neon
# This script applies migrations, indexes, functions, and materialized views

set -e  # Exit on error

echo "🚀 Better Being - Database Optimization Script"
echo "================================================"
echo ""

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
  echo "✅ Loaded environment variables from .env.local"
else
  echo "❌ .env.local not found!"
  exit 1
fi

# Use direct connection for migrations
DATABASE_URL="${DATABASE_URL_DIRECT:-$DATABASE_URL}"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set in environment"
  exit 1
fi

echo "📡 Database: ${DATABASE_URL//:[^:@]*@/:****@}"
echo ""

# Function to execute SQL file
execute_sql_file() {
  local file=$1
  local description=$2

  if [ ! -f "$file" ]; then
    echo "⚠️  File not found: $file (skipping)"
    return
  fi

  echo "📄 $description"
  echo "   File: $file"

  # Use psql if available, otherwise try Node.js
  if command -v psql &> /dev/null; then
    psql "$DATABASE_URL" -f "$file" -v ON_ERROR_STOP=1 --quiet
    echo "   ✅ Executed successfully"
  else
    echo "   ⚠️  psql not available, will need to apply manually"
  fi

  echo ""
}

# 1. Apply base migration
echo "📦 Step 1: Applying base schema migration"
echo "=========================================="
execute_sql_file "db/migrations/0000_thick_ricochet.sql" "Base schema (tables, indexes, constraints)"

# 2. Apply additional indexes
echo "📦 Step 2: Creating performance indexes"
echo "========================================"
execute_sql_file "db/optimizations/001_additional_indexes.sql" "Additional performance indexes"

# 3. Apply database functions
echo "📦 Step 3: Creating database functions"
echo "======================================="
execute_sql_file "db/optimizations/002_database_functions.sql" "Database functions"

# 4. Apply materialized views
echo "📦 Step 4: Creating materialized views"
echo "======================================="
execute_sql_file "db/optimizations/003_materialized_views.sql" "Materialized views for analytics"

# 5. Verify installation
echo "📦 Step 5: Verification"
echo "======================="

if command -v psql &> /dev/null; then
  echo "   Checking tables..."
  TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'" | tr -d ' ')
  echo "   ✅ Tables created: $TABLE_COUNT"

  echo "   Checking indexes..."
  INDEX_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'" | tr -d ' ')
  echo "   ✅ Indexes created: $INDEX_COUNT"

  echo "   Checking functions..."
  FUNCTION_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public'" | tr -d ' ')
  echo "   ✅ Functions created: $FUNCTION_COUNT"

  echo "   Checking materialized views..."
  MVIEW_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pg_matviews WHERE schemaname = 'public'" | tr -d ' ')
  echo "   ✅ Materialized views: $MVIEW_COUNT"
fi

echo ""
echo "🎉 Database optimization completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Update Vercel environment variables with DATABASE_URL"
echo "   2. Set up periodic materialized view refresh (hourly/daily)"
echo "   3. Monitor query performance with pg_stat_statements"
echo ""
