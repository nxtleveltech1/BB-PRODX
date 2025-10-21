# Neon Database Migration Scripts
## Better Being Production Migration

Complete automated migration from current Neon database to new optimized setup with full Vercel integration.

---

## 📋 Prerequisites

Before running the migration, ensure you have:

- [ ] **Neon CLI** installed: `npm install -g neonctl`
- [ ] **Vercel CLI** installed: `npm install -g vercel`
- [ ] **PostgreSQL client** (psql) installed
- [ ] **pnpm** installed (v10.18.3)
- [ ] **Access to Neon account** (authenticated)
- [ ] **Access to Vercel account** (authenticated)
- [ ] **Backup of current database** (will be created automatically)
- [ ] **Scheduled maintenance window** (recommended: weekend, low traffic)

---

## 🚀 Migration Steps

### Step 1: Create New Neon Database
```bash
./01-create-new-database.sh
```

**What it does:**
- Creates new Neon project with optimal configuration
- Sets up main branch for production
- Creates development branch for shadow DB
- Configures autoscaling (0.25-4 CU)
- Generates connection strings
- Saves configuration to `.env.neon.new`

**Duration:** ~5 minutes
**Manual steps:** Configure history retention (30 days)

---

### Step 2: Migrate Schema
```bash
./02-migrate-schema.sh
```

**What it does:**
- Backs up current schema
- Generates fresh migrations with Drizzle
- Applies schema to new database
- Creates performance indexes
- Adds full-text search indexes
- Verifies schema integrity

**Duration:** ~10 minutes
**Manual steps:** None (fully automated)

---

### Step 3: Migrate Data
```bash
./03-migrate-data.sh
```

**What it does:**
- Exports all data from old database
- Imports data to new database in correct order
- Verifies row counts match
- Checks foreign key integrity
- Updates sequences (auto-increment)
- Generates migration report

**Duration:** ~20-60 minutes (depending on data size)
**Manual steps:** None (fully automated)

**⚠️ Important:** This script can be run multiple times if needed (idempotent).

---

### Step 4: Configure Vercel Integration
```bash
./04-configure-vercel.sh
```

**What it does:**
- Sets up Neon Vercel integration
- Configures environment variables (prod/preview/dev)
- Updates `vercel.json`
- Creates GitHub Actions workflows
- Sets up preview branch automation
- Tests preview deployment

**Duration:** ~15 minutes
**Manual steps:**
- Install Neon Vercel integration (via Neon Console)
- Add `NEON_API_KEY` to GitHub secrets

---

### Step 5: Optimize Performance
```bash
./05-optimize-performance.sh
```

**What it does:**
- Enables `pg_stat_statements` for query analysis
- Optimizes PostgreSQL settings
- Creates materialized views for analytics
- Sets up database functions (avoid N+1 queries)
- Configures connection pooling
- Creates query performance monitoring
- Sets up analytics refresh cron job

**Duration:** ~10 minutes
**Manual steps:**
- Add `CRON_SECRET` to Vercel environment variables

---

### Step 6: Production Deployment
```bash
./06-production-deployment.sh
```

**What it does:**
- Runs pre-deployment checklist
- Creates final backup of old database
- Updates local `.env` files
- Tests build with new database
- Runs test suite
- Deploys to Vercel production
- Verifies deployment
- Sets up monitoring alerts
- Creates operations runbook

**Duration:** ~20 minutes
**Manual steps:** Monitor production for 24 hours

---

## 📊 Migration Timeline

| Day | Tasks | Duration |
|-----|-------|----------|
| **Day 1** | Steps 1-3 (Database setup & data migration) | 2-3 hours |
| **Day 2** | Step 4 (Vercel integration) | 1-2 hours |
| **Day 3** | Step 5 (Performance optimization) | 1 hour |
| **Day 4** | Testing & validation | 2-4 hours |
| **Day 5** | Step 6 (Production deployment) | 2 hours |
| **Days 6-7** | Monitoring & optimization | Ongoing |

**Total estimated time:** 1-2 weeks (including testing and validation)

---

## 🔄 Rollback Plan

If issues occur after deployment:

### Option 1: Vercel Rollback (Fastest)
```bash
vercel rollback
```

### Option 2: Environment Variable Rollback
```bash
# In Vercel Dashboard:
# 1. Go to Project Settings → Environment Variables
# 2. Update DATABASE_URL to old connection string:
#    postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb
# 3. Redeploy
```

### Option 3: Full Rollback
```bash
# Restore from backup
pg_restore -d "$OLD_DATABASE_URL" backup/final_backup_*.dump

# Revert environment variables
cp .env.backup.* .env

# Redeploy
vercel --prod
```

---

## 🧪 Testing Checklist

Before production deployment, verify:

### Database Tests
- [ ] All tables exist with correct schema
- [ ] Row counts match old database
- [ ] Foreign key relationships intact
- [ ] Indexes created successfully
- [ ] Sequences updated correctly

### Application Tests
- [ ] Authentication works (login/logout)
- [ ] Product listing loads
- [ ] Product details page works
- [ ] Search functionality works
- [ ] Cart operations (add/remove/update)
- [ ] Checkout flow completes
- [ ] Order history displays
- [ ] Admin dashboard accessible
- [ ] Review submission works

### Performance Tests
- [ ] Page load times < 2s
- [ ] API response times < 500ms
- [ ] Database queries < 100ms (p95)
- [ ] No connection pool exhaustion
- [ ] Cache hit ratio > 80%

### Integration Tests
- [ ] Vercel preview deployments work
- [ ] Preview branches auto-create
- [ ] GitHub Actions run successfully
- [ ] Monitoring alerts configured
- [ ] Cron jobs working

---

## 📈 Post-Migration Monitoring

### First 24 Hours
Monitor these metrics closely:

1. **Error Rate:** Should be < 0.1%
   - Check Sentry dashboard
   - Review Vercel logs

2. **Database Performance:**
   - Connection count (should be < 20)
   - Query latency (p95 < 100ms)
   - Slow queries (< 10/day)

3. **Application Performance:**
   - Page load time (p95 < 2s)
   - API response time (p95 < 500ms)
   - Cache hit ratio (> 80%)

4. **User Experience:**
   - No reported issues
   - All features working
   - Checkout completing successfully

### First Week
- Review slow query log daily
- Check error trends
- Monitor database size growth
- Optimize based on real usage patterns
- Gather user feedback

### First Month
- Analyze cost vs. old setup
- Review autoscaling patterns
- Optimize materialized view refresh schedule
- Fine-tune connection pool settings
- Plan for future optimizations

---

## 🛠️ Troubleshooting

### Issue: Connection timeout during migration
**Solution:**
```bash
# Increase connection timeout
export PGCONNECT_TIMEOUT=60

# Retry migration
./03-migrate-data.sh
```

### Issue: Schema mismatch errors
**Solution:**
```bash
# Regenerate migrations
pnpm drizzle-kit generate

# Review and apply
pnpm drizzle-kit migrate
```

### Issue: Foreign key violations
**Solution:**
```bash
# Disable triggers during import
# Edit 03-migrate-data.sh, add:
# psql ... --single-transaction --disable-triggers
```

### Issue: Vercel deployment fails
**Solution:**
```bash
# Check environment variables
vercel env ls

# Verify build locally
DATABASE_URL="$NEW_DB_URL" pnpm build

# Check Vercel logs
vercel logs --follow
```

### Issue: Slow queries after migration
**Solution:**
```bash
# Analyze queries
psql "$DATABASE_URL" -c "
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
"

# Add missing indexes as needed
```

---

## 📚 Additional Resources

### Documentation
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)

### Migration Plans
- `NEON_MIGRATION_PLAN.md` - Detailed migration strategy
- `NEON_VERCEL_OPPORTUNITIES.md` - All available features and optimizations
- `RUNBOOK.md` - Production operations guide (created after deployment)

### Support
- **Neon Discord:** https://neon.tech/discord
- **Vercel Discord:** https://vercel.com/discord
- **Better Being Team:** [Your internal contact]

---

## ✅ Success Criteria

Migration is considered successful when:

- ✅ All data migrated with 100% accuracy
- ✅ Zero data loss
- ✅ All application features working
- ✅ Performance metrics met or exceeded
- ✅ No increase in error rate
- ✅ User experience maintained or improved
- ✅ Cost optimized (20%+ reduction expected)
- ✅ Monitoring and alerts operational
- ✅ Team trained on new setup

---

## 🎯 Expected Outcomes

### Performance Improvements
- 40-50% reduction in database query latency
- 90% improvement in page load times (with ISR)
- 70% reduction in database load (with caching)
- Sub-50ms queries via edge functions

### Cost Optimization
- 60-80% reduction in database costs (autoscaling)
- Predictable, usage-based pricing
- Automatic scaling for traffic spikes
- No over-provisioning

### Developer Experience
- Preview database per PR
- Safe migrations with shadow DB
- Automated branch cleanup
- Better observability

### Operational Excellence
- 30-day point-in-time recovery
- Automated backups
- Comprehensive monitoring
- Incident response runbook

---

## 📞 Emergency Contacts

**During Migration (24/7 Support):**
- Migration Lead: [Your contact]
- Database Admin: [Contact]
- DevOps: [Contact]

**Post-Migration:**
- On-call Engineer: [Contact]
- Neon Support: support@neon.tech
- Vercel Support: https://vercel.com/support

---

## 📝 Migration Checklist

Print this and check off as you go:

- [ ] Prerequisites completed
- [ ] Team notified of migration schedule
- [ ] Maintenance window scheduled
- [ ] Step 1: New database created
- [ ] Step 2: Schema migrated
- [ ] Step 3: Data migrated
- [ ] Step 4: Vercel configured
- [ ] Step 5: Performance optimized
- [ ] Testing completed successfully
- [ ] Step 6: Production deployed
- [ ] Post-deployment verification
- [ ] Monitoring confirmed operational
- [ ] Team trained on new setup
- [ ] Documentation updated
- [ ] Old database backed up
- [ ] Migration retrospective scheduled

---

**Version:** 1.0
**Last Updated:** 2025-10-21
**Status:** Ready for execution
