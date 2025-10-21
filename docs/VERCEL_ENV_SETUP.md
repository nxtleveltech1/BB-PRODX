# Vercel Environment Variable Configuration

## Overview
This document provides the complete configuration for Vercel environment variables to connect to the optimized Neon PostgreSQL database.

## Database Connection Strings

The Neon project provides three connection strings for different purposes:

1. **Pooled Connection** (`DATABASE_URL`) - For application queries in production
2. **Direct Connection** (`DATABASE_URL_DIRECT`) - For migrations and admin tasks
3. **Shadow Database** (`SHADOW_DATABASE_URL`) - For safe schema diffing in preview environments

## Environment Configuration

### Production Environment

```bash
# Primary pooled connection (use for all application queries)
DATABASE_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Direct connection (for migrations, use in build process)
DATABASE_URL_DIRECT="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

### Preview Environment

Neon can automatically provision branch databases for each preview deployment. Configure the Neon Vercel integration to handle this automatically.

Alternatively, use the shadow database for all preview deployments:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

### Development Environment

Use the shadow database for local development to avoid conflicts with production:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
SHADOW_DATABASE_URL="postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

## Vercel CLI Commands

### Add Production Environment Variables

```bash
# Production database (pooled)
vercel env add DATABASE_URL production
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Production database (direct - for migrations)
vercel env add DATABASE_URL_DIRECT production
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Add Preview Environment Variables

```bash
# Preview database (use shadow database or Neon integration)
vercel env add DATABASE_URL preview
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Add Development Environment Variables

```bash
# Development database
vercel env add DATABASE_URL development
# Paste: postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-curly-cloud-agl6xcxt.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Vercel Dashboard Configuration

Alternatively, add these variables through the Vercel Dashboard:

1. Go to https://vercel.com/bb-prodx/settings/environment-variables
2. Click "Add New"
3. Add each variable with the appropriate environment scope:
   - **Production**: Use pooled connection
   - **Preview**: Use shadow database or Neon integration
   - **Development**: Use shadow database

## Connection Configuration

### Database Connection Pool Settings

These are managed automatically by Neon's connection pooler, but you can override them if needed:

```bash
DB_MAX_CONNECTIONS=20
DB_MIN_CONNECTIONS=2
DB_IDLE_TIMEOUT=10000
DB_CONNECTION_TIMEOUT=2000
DB_STATEMENT_TIMEOUT=30000
```

### SSL Configuration

Neon requires SSL. The connection string includes `?sslmode=require`, which is handled automatically.

## Neon Project Details

- **Project ID**: plain-dream-09417092
- **Region**: aws-eu-central-1 (Frankfurt)
- **Organization ID**: org-red-scene-43902393
- **Main Branch**: br-flat-voice-agb520bl
- **Shadow Branch**: br-rapid-mountain-agacvoek

## Autoscaling Configuration

Your Neon database is configured with:
- **Minimum Compute**: 0.25 CU (compute units)
- **Maximum Compute**: 2 CU
- **Autosuspend**: Enabled (auto-suspend after inactivity)
- **Connection Pooling**: Enabled (PgBouncer)

## Best Practices

1. **Always use the pooled connection** (`DATABASE_URL`) for application queries
2. **Use direct connection** (`DATABASE_URL_DIRECT`) only for migrations
3. **Never expose database credentials** to the client-side code
4. **Use Neon branching** for preview deployments when possible
5. **Monitor connection usage** to ensure you're within Neon's limits
6. **Set up Vercel-Neon integration** for automatic branch database provisioning

## Verification

After setting environment variables, verify the configuration:

```bash
# Check environment variables are set
vercel env ls

# Verify database connection during build
# (Add this to your build logs)
echo "DATABASE_URL is set: ${DATABASE_URL:+YES}"
```

## Troubleshooting

### Connection Timeouts

If you experience connection timeouts:
1. Ensure you're using the pooled connection string
2. Check that SSL mode is set to `require`
3. Verify that the Neon project is not suspended
4. Check Vercel function timeout limits (serverless functions have a 10s timeout by default)

### Migration Failures

If migrations fail during deployment:
1. Use `DATABASE_URL_DIRECT` for migrations
2. Ensure migration scripts have proper error handling
3. Check Neon logs for detailed error messages
4. Verify schema changes don't conflict with existing data

### Preview Deployment Issues

If preview deployments have database issues:
1. Set up Neon-Vercel integration for automatic branch databases
2. Alternatively, use a dedicated preview database
3. Ensure migrations are applied in the correct order
4. Check that preview environment variables are set correctly

## Security Notes

⚠️ **IMPORTANT**: The connection strings in this document contain actual credentials and should be treated as secrets.

- ✅ Store in Vercel environment variables (encrypted)
- ✅ Add to `.gitignore` (already done for `.env*` files)
- ✅ Use Vercel's environment variable encryption
- ❌ Never commit to version control
- ❌ Never expose to client-side code
- ❌ Never log in production

## Next Steps

After configuring environment variables:

1. Deploy to Vercel: `vercel --prod`
2. Verify database connection in deployment logs
3. Run a test query to ensure connectivity
4. Monitor query performance with Neon's dashboard
5. Set up periodic materialized view refresh
6. Configure monitoring and alerts

## Support

- **Neon Documentation**: https://neon.tech/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Project Dashboard**: https://console.neon.tech/app/projects/plain-dream-09417092
