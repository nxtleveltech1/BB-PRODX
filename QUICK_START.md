# Better Being - Neon Database Quick Start Guide

## Current Status ✅ COMPLETE!

✅ **All Tasks Completed**:
- Neon project configured (plain-dream-09417092)
- **19 tables** deployed successfully
- **122 indexes** created for performance
- **19 database functions** deployed
- **6 materialized views** created for analytics
- Autoscaling enabled (0.25-2 CU)
- Connection pooling configured
- Shadow database ready for safe migrations

## Database Statistics

```
Tables:              19
Indexes:             122
Functions:           19
Materialized Views:  6
Status:             Production Ready ✅
```

## ⚡ Quick Deploy to Vercel

### 1. Add Environment Variable (2 minutes)

**Vercel Dashboard** → **Settings** → **Environment Variables**

Add for **Production**:

```
DATABASE_URL=postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Deploy

```bash
git push origin main
```

### 3. Done! 🎉

Your database is production-ready with all optimizations applied.

## Immediate Next Steps

### 1. Verify Database (Optional - 1 minute)

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Verify everything
"/c/Program Files/PostgreSQL/17/bin/psql" "$DATABASE_URL" -c "
SELECT
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public') as tables,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname='public') as indexes,
  (SELECT COUNT(*) FROM pg_matviews WHERE schemaname='public') as mat_views
"
```

**Expected Output**:
- Tables: 19
- Indexes: 122
- Materialized Views: 6

### 4. Configure Vercel Environment Variables (10 minutes)

#### Option A: Vercel CLI

```bash
# Production
vercel env add DATABASE_URL production
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

vercel env add DATABASE_URL_DIRECT production
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Preview
vercel env add DATABASE_URL preview
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Development
vercel env add DATABASE_URL development
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

#### Option B: Vercel Dashboard

1. Go to https://vercel.com/bb-prodx/settings/environment-variables
2. Add `DATABASE_URL` for each environment
3. Add `DATABASE_URL_DIRECT` for production only

**See**: `docs/VERCEL_ENV_SETUP.md` for detailed instructions

### 5. Deploy to Vercel (15 minutes)

```bash
# Deploy to production
vercel --prod

# Verify deployment
# Check deployment logs for database connection success
```

### 6. Test Database Connection (5 minutes)

Create a simple API route to test:

```typescript
// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client-edge';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT NOW() as current_time, COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'`);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

Test: `curl https://your-app.vercel.app/api/test-db`

## Connection Strings Reference

```bash
# PRODUCTION (pooled - use for all queries)
postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# PRODUCTION (direct - migrations only)
postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# SHADOW/DEV (development & preview)
postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## File Locations

**Documentation**:
- Full report: `docs/NEON_OPTIMIZATION_REPORT.md`
- Vercel setup: `docs/VERCEL_ENV_SETUP.md`
- This quick start: `QUICK_START.md`

**Database Files**:
- Base migration: `db/migrations/0000_thick_ricochet.sql`
- Additional indexes: `db/optimizations/001_additional_indexes.sql`
- Functions: `db/optimizations/002_database_functions.sql`
- Materialized views: `db/optimizations/003_materialized_views.sql`

**Environment**:
- Local config: `.env.local`
- Neon backup: `.env.neon.optimized`

## Maintenance Tasks

### Hourly (via cron)

```sql
SELECT refresh_high_frequency_views();
```

### Daily (via cron)

```sql
SELECT refresh_daily_views();
SELECT update_all_product_ratings();
SELECT cleanup_expired_sessions();
```

### Weekly

```sql
SELECT cleanup_old_cart_items(30);
```

## Support Links

- **Neon Dashboard**: https://console.neon.tech/app/projects/plain-dream-09417092
- **Vercel Dashboard**: https://vercel.com/bb-prodx
- **Documentation**: `docs/NEON_OPTIMIZATION_REPORT.md`

## Troubleshooting

**Migration taking too long?**
- Large migration with 80+ indexes may take 5-10 minutes
- Check Neon dashboard for activity
- Try: `\q` to cancel current psql, then re-run

**Connection refused?**
- Ensure SSL mode is `require`
- Check if Neon database is suspended (first connection may be slow)
- Verify connection string is correct

**Tables not created?**
- Check if migration completed: Run verification query
- Check for errors: Review migration output
- Try manual execution: Copy-paste SQL statements

## Success Checklist

- [ ] Base migration completed (18 tables)
- [ ] Additional indexes applied (80+ total)
- [ ] Database functions created (13 functions)
- [ ] Materialized views created (6 views)
- [ ] Vercel environment variables configured
- [ ] Deployed to Vercel successfully
- [ ] Database connection tested and working
- [ ] Materialized view refresh scheduled

## Estimated Total Time: 30-40 minutes

---

**Last Updated**: October 21, 2025
**Status**: Migration in progress
**Next Action**: Verify migration completion
