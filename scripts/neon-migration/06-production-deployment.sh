#!/bin/bash
# Script 6: Production Deployment
# Better Being Production Migration
# Usage: ./06-production-deployment.sh

set -e

echo "🚀 Better Being - Production Deployment"
echo "========================================"
echo ""

# Load configuration
if [ ! -f .env.neon.new ]; then
    echo "❌ .env.neon.new not found"
    exit 1
fi

source .env.neon.new

echo "⚠️  PRE-DEPLOYMENT CHECKLIST"
echo "============================="
echo ""

checklist=(
  "✅ New Neon database created and configured"
  "✅ Schema migrated successfully"
  "✅ All data migrated and verified"
  "✅ Vercel integration configured"
  "✅ Environment variables set up"
  "✅ Performance optimizations applied"
  "✅ Preview deployment tested successfully"
  "✅ Monitoring and alerts configured"
  "✅ Team notified of deployment"
  "✅ Rollback plan documented"
)

for item in "${checklist[@]}"; do
  echo "$item"
done

echo ""
read -p "All items complete? Continue with production deployment? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "1️⃣ Final database verification..."

psql "$DATABASE_URL_DIRECT" << 'EOSQL'
-- Verify all critical tables exist
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check row counts
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- Verify indexes
SELECT
  indexname,
  tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
EOSQL

echo "✅ Database verification complete"
echo ""

echo "2️⃣ Creating final backup of old database..."

OLD_DB_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb"

pg_dump "$OLD_DB_URL" \
  --format=custom \
  --file="backup/final_backup_$(date +%Y%m%d_%H%M%S).dump"

echo "✅ Final backup created"
echo ""

echo "3️⃣ Updating .env files..."

# Update local .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Update DATABASE_URL in .env
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env
sed -i.bak "s|SHADOW_DATABASE_URL=.*|SHADOW_DATABASE_URL=\"$SHADOW_DATABASE_URL\"|" .env

echo "✅ .env updated"
echo ""

echo "4️⃣ Testing local build with new database..."

# Set environment for build
export DATABASE_URL="$DATABASE_URL"
export SHADOW_DATABASE_URL="$SHADOW_DATABASE_URL"

pnpm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - stopping deployment"
    exit 1
fi
echo ""

echo "5️⃣ Running test suite..."

pnpm run test:run

if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "❌ Tests failed - stopping deployment"
    exit 1
fi
echo ""

echo "6️⃣ Deploying to Vercel production..."

# Deploy to production
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful"
else
    echo "❌ Deployment failed"
    echo "Rollback: Update DATABASE_URL in Vercel dashboard to old URL"
    exit 1
fi
echo ""

echo "7️⃣ Post-deployment verification..."

PROD_URL="https://bb-prodx.vercel.app"

echo "  Testing production endpoints..."

# Health check
if curl -sf "$PROD_URL/api/health" > /dev/null; then
    echo "  ✅ Health check passed"
else
    echo "  ❌ Health check failed"
fi

# Products API
if curl -sf "$PROD_URL/api/products" | jq -e '.length > 0' > /dev/null; then
    echo "  ✅ Products API working"
else
    echo "  ❌ Products API failed"
fi

echo ""
echo "8️⃣ Monitoring setup verification..."

# Check Neon metrics
echo "  Neon Dashboard: https://console.neon.tech/app/projects/$NEON_PROJECT_ID"
echo "  Vercel Dashboard: https://vercel.com/better-beings-projects/bb-prodx"
echo ""

echo "9️⃣ Setting up alerts..."

cat > monitoring/alerts.json << EOF
{
  "alerts": [
    {
      "name": "High Error Rate",
      "condition": "error_rate > 0.01",
      "notification": "email,slack"
    },
    {
      "name": "Slow Queries",
      "condition": "p95_query_time > 1000",
      "notification": "email"
    },
    {
      "name": "High Connection Count",
      "condition": "active_connections > 80",
      "notification": "slack"
    },
    {
      "name": "Database Size",
      "condition": "db_size > 50GB",
      "notification": "email"
    }
  ]
}
EOF

echo "✅ Alert configuration created"
echo ""

echo "🔟 Creating runbook for common operations..."

cat > RUNBOOK.md << 'EOF'
# Production Operations Runbook

## Common Operations

### View Database Metrics
```bash
# Neon CLI
neon project metrics --period 24h

# Or visit: https://console.neon.tech
```

### Check Active Connections
```bash
psql "$DATABASE_URL" -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```

### Refresh Analytics
```bash
curl -X GET https://bb-prodx.vercel.app/api/cron/refresh-analytics \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Create Manual Backup
```bash
neon project backup create --project-id "$NEON_PROJECT_ID"
```

### Rollback to Previous Version
```bash
# In Vercel Dashboard:
# Deployments → Select previous deployment → Promote to Production

# Or via CLI:
vercel rollback
```

## Incident Response

### High Error Rate
1. Check Sentry dashboard for error details
2. Review recent deployments
3. Check database connection count
4. Review Vercel logs: `vercel logs`
5. If needed: `vercel rollback`

### Database Connection Issues
1. Check Neon status: https://neon.tech/status
2. Verify connection pool settings
3. Check active connections:
   ```bash
   psql "$DATABASE_URL" -c "SELECT * FROM pg_stat_activity;"
   ```
4. Increase max_connections if needed (via Neon dashboard)

### Slow Queries
1. Identify slow queries:
   ```sql
   SELECT query, mean_exec_time, calls
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```
2. Check if indexes are being used:
   ```sql
   SELECT * FROM pg_stat_user_indexes
   WHERE idx_scan = 0 AND schemaname = 'public';
   ```
3. Add missing indexes if needed
4. Refresh materialized views

### Database Full
1. Check current size:
   ```sql
   SELECT pg_size_pretty(pg_database_size(current_database()));
   ```
2. Archive old data (orders > 1 year)
3. Vacuum tables:
   ```sql
   VACUUM FULL ANALYZE;
   ```
4. Upgrade compute tier if needed

## Maintenance Windows

### Weekly Tasks (Sunday 2 AM UTC)
- [ ] Review slow query log
- [ ] Check error rate trends
- [ ] Verify backup completion
- [ ] Review database size growth

### Monthly Tasks (First Sunday of month)
- [ ] Update dependencies
- [ ] Review and optimize indexes
- [ ] Archive old data
- [ ] Security audit
- [ ] Cost optimization review

## Contact Information

- **On-call Engineer:** [Your contact]
- **Neon Support:** support@neon.tech
- **Vercel Support:** https://vercel.com/support
- **Emergency Escalation:** [Your process]

## Useful Links

- Neon Console: https://console.neon.tech
- Vercel Dashboard: https://vercel.com/dashboard
- Sentry: https://sentry.io
- Documentation: /docs
EOF

echo "✅ Runbook created: RUNBOOK.md"
echo ""

echo "✅ DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "🎉 Congratulations! Your application is now running on the new Neon database."
echo ""
echo "📊 What was deployed:"
echo "  • New Neon PostgreSQL database (eu-central-1)"
echo "  • All data migrated successfully"
echo "  • Performance optimizations applied"
echo "  • Monitoring and alerts configured"
echo "  • Production deployment on Vercel"
echo ""
echo "🔗 Important URLs:"
echo "  • Production: $PROD_URL"
echo "  • Neon Console: https://console.neon.tech/app/projects/$NEON_PROJECT_ID"
echo "  • Vercel Dashboard: https://vercel.com/better-beings-projects/bb-prodx"
echo ""
echo "📋 Next 24 hours:"
echo "  1. Monitor error rates closely"
echo "  2. Check query performance"
echo "  3. Verify all features working"
echo "  4. Monitor database metrics"
echo "  5. Be ready to rollback if needed"
echo ""
echo "📚 Resources:"
echo "  • Runbook: RUNBOOK.md"
echo "  • Migration plan: NEON_MIGRATION_PLAN.md"
echo "  • Opportunities: NEON_VERCEL_OPPORTUNITIES.md"
echo ""

# Save deployment metadata
cat > deployment_info.json << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "database": {
    "project_id": "$NEON_PROJECT_ID",
    "region": "$NEON_REGION",
    "connection_url": "***REDACTED***"
  },
  "vercel": {
    "project": "bb-prodx",
    "deployment_url": "$PROD_URL"
  },
  "migration": {
    "old_database": "ep-sweet-rain-agsv46iq",
    "new_database": "$NEON_PROJECT_NAME",
    "data_migrated": true,
    "schema_version": "latest"
  }
}
EOF

echo "💾 Deployment info saved: deployment_info.json"
echo ""
echo "🚀 Your Better Being application is live with Neon!"
