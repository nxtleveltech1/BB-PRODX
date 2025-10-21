# 🚀 Quick Start: Neon Database Migration

**Since the Neon API requires organization ID configuration, I recommend this streamlined manual approach:**

---

## ⚡ Fast Track Migration (2-3 hours)

### Prerequisites ✅
- ✅ Neon CLI installed (neonctl)
- ✅ Vercel CLI installed
- ✅ PostgreSQL client (psql) installed
- ✅ Current database credentials (you have these)
- ✅ Vercel project access

---

## Step 1: Create New Neon Project (5 minutes)

### Via Neon Console (Easiest):

1. **Go to:** https://console.neon.tech
2. **Click:** "New Project"
3. **Configure:**
   - **Name:** `better-being-production`
   - **Region:** `eu-central-1` (AWS Frankfurt - same as current)
   - **PostgreSQL Version:** 16
   - **Compute:**
     - Min: 0.25 CU
     - Max: 4 CU
     - Auto-suspend: 5 minutes
4. **Click:** "Create Project"

5. **Get Connection Strings:**
   After creation, click "Connection Details":
   ```
   Pooled connection (for app):
   postgresql://[user]:[password]@[host]-pooler.eu-central-1.aws.neon.tech/neondb

   Direct connection (for migrations):
   postgresql://[user]:[password]@[host].eu-central-1.aws.neon.tech/neondb
   ```

6. **Save these to `.env.neon.new`:**
   ```env
   DATABASE_URL="[POOLED_CONNECTION_STRING]"
   DATABASE_URL_DIRECT="[DIRECT_CONNECTION_STRING]"
   NEON_PROJECT_ID="[PROJECT_ID from URL]"
   ```

---

## Step 2: Create Development Branch (Shadow DB) (2 minutes)

1. **In Neon Console:** Go to your project → Branches
2. **Click:** "Create Branch"
3. **Configure:**
   - Name: `development`
   - Parent: `main`
4. **Click:** "Create"
5. **Get connection string** for this branch
6. **Add to `.env.neon.new`:**
   ```env
   SHADOW_DATABASE_URL="[DEV_BRANCH_CONNECTION_STRING]"
   ```

---

## Step 3: Backup & Migrate Schema (10 minutes)

```bash
# Create backup directory
mkdir -p backup/schema backup/data

# Backup current schema
pg_dump "postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb" \
  --schema-only \
  --no-owner \
  --no-privileges \
  -f backup/schema/schema_backup.sql

# Load environment variables from new file
cat .env.neon.new >> .env

# Generate Drizzle migrations
pnpm drizzle-kit generate

# Apply to new database
pnpm drizzle-kit migrate
```

---

## Step 4: Create Performance Indexes (5 minutes)

```bash
# Apply performance indexes
psql "$DATABASE_URL_DIRECT" << 'SQL'
-- Products
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search
  ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Orders
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Reviews
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Cart
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
SQL
```

---

## Step 5: Migrate Data (30-60 minutes)

```bash
# Export and import in one go (for each table group)
OLD_DB="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb"

# Users & Auth
pg_dump "$OLD_DB" --data-only --disable-triggers \
  --table=users --table=user_sessions --table=accounts \
  --table=sessions --table=verification_tokens \
  | psql "$DATABASE_URL_DIRECT"

# Products
pg_dump "$OLD_DB" --data-only --disable-triggers \
  --table=categories --table=subcategories --table=products \
  --table=product_benefits --table=product_ingredients \
  --table=product_tags --table=product_sizes \
  | psql "$DATABASE_URL_DIRECT"

# Orders
pg_dump "$OLD_DB" --data-only --disable-triggers \
  --table=orders --table=order_items \
  | psql "$DATABASE_URL_DIRECT"

# Reviews
pg_dump "$OLD_DB" --data-only --disable-triggers \
  --table=reviews --table=review_votes \
  | psql "$DATABASE_URL_DIRECT"

# Cart
pg_dump "$OLD_DB" --data-only --disable-triggers \
  --table=cart --table=wishlist \
  | psql "$DATABASE_URL_DIRECT"

# Social
pg_dump "$OLD_DB" --data-only --disable-triggers \
  --table=instagram_posts \
  | psql "$DATABASE_URL_DIRECT" 2>/dev/null || echo "No instagram_posts table"
```

---

## Step 6: Verify Data (5 minutes)

```bash
# Check row counts
OLD_DB="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb"

echo "OLD DATABASE:"
psql "$OLD_DB" -c "
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'cart', COUNT(*) FROM cart;"

echo ""
echo "NEW DATABASE:"
psql "$DATABASE_URL_DIRECT" -c "
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'cart', COUNT(*) FROM cart;"
```

**These counts should match!**

---

## Step 7: Update Vercel Environment Variables (10 minutes)

### Option A: Via Vercel Dashboard
1. Go to: https://vercel.com/better-beings-projects/bb-prodx/settings/environment-variables
2. Add/Update `DATABASE_URL`:
   - **Production:** Your new `DATABASE_URL` (pooled)
   - **Preview:** Leave as placeholder (Neon integration will auto-inject)
   - **Development:** Your `SHADOW_DATABASE_URL`

### Option B: Via CLI
```bash
# Login to Vercel
vercel login

# Link project
vercel link --project bb-prodx --yes

# Add production DATABASE_URL
vercel env add DATABASE_URL production
# Paste your new DATABASE_URL when prompted

# Add development DATABASE_URL
vercel env add DATABASE_URL development
# Paste your SHADOW_DATABASE_URL when prompted
```

---

## Step 8: Test Preview Deployment (10 minutes)

```bash
# Create a test branch
git checkout -b test/new-database

# Deploy to preview
vercel

# Test the preview URL
# Check: products, cart, auth, etc.
```

---

## Step 9: Production Deployment (10 minutes)

### When everything tests OK:

```bash
# Merge to main
git checkout main
git merge test/new-database
git push origin main

# This triggers automatic Vercel deployment
# Monitor at: https://vercel.com/better-beings-projects/bb-prodx
```

---

## Step 10: Post-Deployment Verification (15 minutes)

### Check Critical Paths:
1. **Health:** https://bb-prodx.vercel.app/api/health
2. **Products:** https://bb-prodx.vercel.app/api/products
3. **Auth:** Login/logout
4. **Cart:** Add/remove items
5. **Checkout:** Complete a test order

### Monitor:
- **Vercel Logs:** `vercel logs --follow`
- **Neon Dashboard:** https://console.neon.tech/app/projects/[YOUR_PROJECT_ID]
- **Sentry:** Check for errors

---

## 🚨 If Something Goes Wrong - ROLLBACK

### Quick Rollback (< 5 minutes):

**Option 1: Vercel Dashboard**
1. Go to: https://vercel.com/better-beings-projects/bb-prodx/deployments
2. Find last working deployment
3. Click ⋯ → "Promote to Production"

**Option 2: Environment Variable Rollback**
1. Vercel Dashboard → Settings → Environment Variables
2. Update `DATABASE_URL` back to:
   ```
   postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb
   ```
3. Redeploy: `vercel --prod`

---

## ✅ Success Checklist

After migration, verify:
- [ ] All products load correctly
- [ ] User authentication works
- [ ] Cart operations work
- [ ] Orders display correctly
- [ ] Checkout completes
- [ ] Admin dashboard accessible
- [ ] No console errors
- [ ] No Sentry errors
- [ ] Database metrics looking good
- [ ] Response times acceptable

---

## 📊 Expected Results

### Performance:
- Query latency: <100ms (p95)
- Page load: <2s (p95)
- API response: <500ms (p95)

### Cost:
- Database: $23-45/month (vs $50 current)
- Total: $53-75/month

### Features Enabled:
- ✅ Autoscaling (0.25-4 CU)
- ✅ Connection pooling
- ✅ Performance indexes
- ✅ 7-day point-in-time recovery
- ✅ Shadow DB for safe migrations

---

## 🔮 Next Steps (Phase 2)

After successful migration, implement:
1. **Vercel KV caching** (70% DB load reduction)
2. **Edge Functions** (40% latency reduction)
3. **ISR for product pages** (90% faster loads)
4. **Preview branches per PR**
5. **Read replicas for analytics**

**Full guide:** `NEON_VERCEL_OPPORTUNITIES.md`

---

## 📞 Need Help?

- **During migration:** Check `NEON_MIGRATION_PLAN.md`
- **Troubleshooting:** Check `scripts/neon-migration/README.md`
- **Features:** Check `NEON_VERCEL_OPPORTUNITIES.md`
- **Neon Discord:** https://neon.tech/discord
- **Vercel Support:** https://vercel.com/support

---

**Estimated Total Time:** 2-3 hours
**Risk Level:** 🟢 Low (multiple rollback options)
**Recommended Time:** Weekend, low-traffic hours

**Ready to start? Begin with Step 1!** 🚀
