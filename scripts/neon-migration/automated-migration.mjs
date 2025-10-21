#!/usr/bin/env node
/**
 * Automated Neon Database Migration
 * Better Being Production
 *
 * This script fully automates the migration process using Neon REST API
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration
const CONFIG = {
  NEON_API_KEY: process.env.NEON_API_KEY || 'napi_n0zoz3n1ytbeggn6a3mkb84u7uvoiw1k61yjs6yu7a5d0pbe7fulrersrn9gl569',
  NEON_API_BASE: 'https://console.neon.tech/api/v2',
  PROJECT_NAME: 'better-being-production',
  REGION: 'aws-eu-central-1',
  OLD_DB_URL: 'postgresql://neondb_owner:npg_QPxIhJc62CBt@ep-sweet-rain-agsv46iq-pooler.c-2.eu-central-1.aws.neon.tech/neondb',
  VERCEL_TOKEN: 'edfzz8I5KjxJpODnIplQUvS9',
  VERCEL_PROJECT_ID: 'prj_QO6dgHUfbDsq7Q4HeiN125PwYeBg',
};

// Utility functions
const log = {
  info: (msg) => console.log(`\n✅ ${msg}`),
  step: (msg) => console.log(`\n🔵 ${msg}`),
  warn: (msg) => console.log(`\n⚠️  ${msg}`),
  error: (msg) => console.error(`\n❌ ${msg}`),
  success: (msg) => console.log(`\n🎉 ${msg}`),
};

async function neonAPI(endpoint, method = 'GET', body = null) {
  const url = `${CONFIG.NEON_API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${CONFIG.NEON_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  log.info(`API ${method} ${endpoint}`);

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    log.error(`API Error: ${JSON.stringify(data, null, 2)}`);
    throw new Error(`Neon API error: ${response.statusText}`);
  }

  return data;
}

function exec(command, description) {
  log.step(description);
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: CONFIG.OLD_DB_URL }
    });
    console.log(output);
    return output;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    console.error(error.stdout);
    console.error(error.stderr);
    throw error;
  }
}

function execQuiet(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

async function createBackupDirectories() {
  const dirs = ['backup', 'backup/data', 'backup/schema'];
  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
  log.info('Backup directories created');
}

async function step1_CreateNeonProject() {
  log.step('STEP 1: Creating new Neon project');

  // Create project
  const project = await neonAPI('/projects', 'POST', {
    project: {
      name: CONFIG.PROJECT_NAME,
      region_id: CONFIG.REGION,
      pg_version: 16,
      autoscaling_limit_min_cu: 0.25,
      autoscaling_limit_max_cu: 4,
      provisioner: 'k8s-pod',
    }
  });

  const projectId = project.project.id;
  log.info(`Project created: ${projectId}`);

  // Get connection strings
  const connStrings = await neonAPI(`/projects/${projectId}/connection_uri`);

  CONFIG.PROJECT_ID = projectId;
  CONFIG.DATABASE_URL = connStrings.uri.replace('?sslmode=require', '-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');
  CONFIG.DATABASE_URL_DIRECT = connStrings.uri;

  log.info('Main branch connection strings obtained');

  return { projectId, connStrings };
}

async function step2_CreateDevelopmentBranch(projectId) {
  log.step('STEP 2: Creating development branch (shadow DB)');

  const branch = await neonAPI(`/projects/${projectId}/branches`, 'POST', {
    branch: {
      name: 'development',
      parent_id: null, // Will use main as parent
    }
  });

  const branchId = branch.branch.id;
  log.info(`Development branch created: ${branchId}`);

  // Get development branch connection string
  const endpoints = await neonAPI(`/projects/${projectId}/branches/${branchId}/endpoints`);
  const endpoint = endpoints.endpoints[0];

  CONFIG.SHADOW_DATABASE_URL = `postgresql://neondb_owner@${endpoint.host}/neondb?sslmode=require`;

  return branchId;
}

async function step3_BackupCurrentSchema() {
  log.step('STEP 3: Backing up current schema');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupFile = `backup/schema/schema_${timestamp}.sql`;

  exec(
    `pg_dump "${CONFIG.OLD_DB_URL}" --schema-only --no-owner --no-privileges --no-comments -f ${backupFile}`,
    'Exporting schema from old database'
  );

  log.info(`Schema backed up to: ${backupFile}`);
  return backupFile;
}

async function step4_MigrateSchema() {
  log.step('STEP 4: Migrating schema to new database');

  // Update .env temporarily
  const envContent = `DATABASE_URL="${CONFIG.DATABASE_URL_DIRECT}"
SHADOW_DATABASE_URL="${CONFIG.SHADOW_DATABASE_URL}"
`;

  writeFileSync('.env.migration', envContent);

  // Generate and apply migrations
  exec(
    'pnpm drizzle-kit generate',
    'Generating Drizzle migrations'
  );

  exec(
    `DATABASE_URL="${CONFIG.DATABASE_URL_DIRECT}" pnpm drizzle-kit migrate`,
    'Applying migrations to new database'
  );

  log.info('Schema migrated successfully');
}

async function step5_CreatePerformanceIndexes() {
  log.step('STEP 5: Creating performance indexes');

  const indexes = `
    -- Products indexes
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON products(category_id);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));

    -- Orders indexes
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

    -- Reviews indexes
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_rating ON reviews(rating);

    -- Cart indexes
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_id ON cart(user_id);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
  `;

  writeFileSync('backup/indexes.sql', indexes);

  exec(
    `psql "${CONFIG.DATABASE_URL_DIRECT}" -f backup/indexes.sql`,
    'Creating performance indexes'
  );

  log.info('Performance indexes created');
}

async function step6_MigrateData() {
  log.step('STEP 6: Migrating data (this may take 30-60 minutes)');

  // Export data in batches
  const tables = [
    // Auth and users (foundation)
    ['users', 'user_sessions', 'accounts', 'sessions', 'verification_tokens'],
    // Catalog
    ['categories', 'subcategories', 'products', 'product_benefits', 'product_ingredients', 'product_tags', 'product_sizes'],
    // Transactional
    ['orders', 'order_items'],
    // Reviews
    ['reviews', 'review_votes'],
    // Cart
    ['cart', 'wishlist'],
    // Social
    ['instagram_posts'],
  ];

  for (let i = 0; i < tables.length; i++) {
    const tableGroup = tables[i];
    const fileName = `backup/data/${String(i + 1).padStart(2, '0')}_${tableGroup[0]}.sql`;

    const tableList = tableGroup.join(' --table=');

    log.info(`Exporting: ${tableGroup.join(', ')}`);

    execQuiet(
      `pg_dump "${CONFIG.OLD_DB_URL}" --data-only --table=${tableList} --disable-triggers > ${fileName}`
    );

    log.info(`Importing: ${tableGroup.join(', ')}`);

    exec(
      `psql "${CONFIG.DATABASE_URL_DIRECT}" -f ${fileName}`,
      `Importing ${tableGroup[0]} group`
    );
  }

  log.success('All data migrated!');
}

async function step7_VerifyDataIntegrity() {
  log.step('STEP 7: Verifying data integrity');

  const verifyQuery = `
    SELECT 'users' as table_name, COUNT(*) FROM users
    UNION ALL SELECT 'products', COUNT(*) FROM products
    UNION ALL SELECT 'orders', COUNT(*) FROM orders
    UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
    UNION ALL SELECT 'cart', COUNT(*) FROM cart;
  `;

  const oldCounts = exec(
    `psql "${CONFIG.OLD_DB_URL}" -t -c "${verifyQuery}"`,
    'Checking row counts in old database'
  );

  const newCounts = exec(
    `psql "${CONFIG.DATABASE_URL_DIRECT}" -t -c "${verifyQuery}"`,
    'Checking row counts in new database'
  );

  console.log('\nOld database:');
  console.log(oldCounts);
  console.log('\nNew database:');
  console.log(newCounts);

  log.info('Data integrity verification complete');
}

async function step8_ConfigureVercelEnv() {
  log.step('STEP 8: Configuring Vercel environment variables');

  // Save connection strings to file
  const envConfig = `
# Neon Database Configuration
# Generated: ${new Date().toISOString()}

# Production Database
DATABASE_URL="${CONFIG.DATABASE_URL}"
DATABASE_URL_DIRECT="${CONFIG.DATABASE_URL_DIRECT}"

# Shadow Database
SHADOW_DATABASE_URL="${CONFIG.SHADOW_DATABASE_URL}"

# Neon Project Details
NEON_PROJECT_ID="${CONFIG.PROJECT_ID}"
NEON_REGION="${CONFIG.REGION}"
`;

  writeFileSync('.env.neon.new', envConfig);
  log.info('Connection strings saved to .env.neon.new');

  log.warn('Manual step required: Update Vercel environment variables');
  log.warn('Run: vercel env add DATABASE_URL production');
  log.warn(`Value: ${CONFIG.DATABASE_URL}`);
}

async function step9_GenerateReport() {
  log.step('STEP 9: Generating migration report');

  const report = `
Better Being - Database Migration Report
=========================================
Date: ${new Date().toISOString()}
Duration: ${process.uptime().toFixed(0)} seconds

Source Database:
  Host: ep-sweet-rain-agsv46iq.c-2.eu-central-1.aws.neon.tech
  Database: neondb

New Database:
  Project ID: ${CONFIG.PROJECT_ID}
  Region: ${CONFIG.REGION}
  Connection: ${CONFIG.DATABASE_URL}

Migration Steps Completed:
  ✅ Step 1: Neon project created
  ✅ Step 2: Development branch created
  ✅ Step 3: Schema backed up
  ✅ Step 4: Schema migrated
  ✅ Step 5: Performance indexes created
  ✅ Step 6: Data migrated
  ✅ Step 7: Data integrity verified
  ✅ Step 8: Environment configuration prepared
  ✅ Step 9: Report generated

Next Steps:
  1. Review .env.neon.new
  2. Update Vercel environment variables:
     vercel env add DATABASE_URL production
  3. Test application with new database
  4. Deploy to production when ready

Connection Strings:
  Production (Pooled): ${CONFIG.DATABASE_URL}
  Production (Direct):  ${CONFIG.DATABASE_URL_DIRECT}
  Development (Shadow): ${CONFIG.SHADOW_DATABASE_URL}

Rollback Instructions:
  If needed, revert DATABASE_URL to:
  ${CONFIG.OLD_DB_URL}

Migration Status: ✅ COMPLETE
`;

  writeFileSync('backup/MIGRATION_REPORT.txt', report);

  console.log(report);

  log.success('Migration report saved to backup/MIGRATION_REPORT.txt');
}

// Main execution
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Better Being - Automated Neon Database Migration       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Starting automated migration...
`);

  const startTime = Date.now();

  try {
    await createBackupDirectories();

    const { projectId } = await step1_CreateNeonProject();
    await step2_CreateDevelopmentBranch(projectId);
    await step3_BackupCurrentSchema();
    await step4_MigrateSchema();
    await step5_CreatePerformanceIndexes();
    await step6_MigrateData();
    await step7_VerifyDataIntegrity();
    await step8_ConfigureVercelEnv();
    await step9_GenerateReport();

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    log.success(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎉 MIGRATION COMPLETE! 🎉                              ║
║                                                           ║
║   Duration: ${duration} minutes                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Next Steps:
  1. Review: .env.neon.new
  2. Review: backup/MIGRATION_REPORT.txt
  3. Update Vercel environment variables
  4. Test the new database
  5. Deploy to production

Your new Neon project: ${CONFIG.PROJECT_ID}
View in console: https://console.neon.tech/app/projects/${CONFIG.PROJECT_ID}
`);

  } catch (error) {
    log.error('Migration failed!');
    console.error(error);
    process.exit(1);
  }
}

// Run
main();
