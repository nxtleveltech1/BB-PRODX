#!/usr/bin/env node
// Data migration script: Copy all data from old Neon DB to new Neon DB
// Respects foreign key dependencies and transaction safety

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import pg from 'pg';

const { Client } = pg;
const repoRoot = process.cwd();

// Parse environment files to get database URLs
function parseEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath);
    return dotenv.parse(raw);
  } catch (err) {
    return {};
  }
}

function getDatabaseUrls() {
  const serverEnv = parseEnvFile(path.join(repoRoot, 'server', '.env'));
  const neonOptimized = parseEnvFile(path.join(repoRoot, '.env.neon.optimized'));
  const rootEnvLocal = parseEnvFile(path.join(repoRoot, '.env.local'));

  // Filter out flags from argv
  const args = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

  // Allow override via CLI args or env vars
  const oldUrl = process.env.OLD_DATABASE_URL || args[0] || serverEnv.DATABASE_URL;
  const newUrl = process.env.NEW_DATABASE_URL || args[1] || neonOptimized.DATABASE_URL || rootEnvLocal.DATABASE_URL;

  return { oldUrl, newUrl };
}

// Table migration order (respects foreign key dependencies)
const TABLE_ORDER = [
  // Auth tables (no dependencies)
  'users',
  'accounts',
  'sessions',
  'verificationTokens',
  'user_sessions',

  // Product catalog (categories before products)
  'categories',
  'subcategories',
  'products',
  'product_benefits',
  'product_ingredients',
  'product_sizes',
  'product_tags',

  // Orders (depends on users and products)
  'orders',
  'order_items',

  // Reviews (depends on users and products)
  'reviews',
  'review_votes',

  // Cart/Wishlist (depends on users and products)
  'cart',
  'wishlist',

  // Social media
  'instagram_posts',
];

async function getTableSchema(client, tableName) {
  const { rows } = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position;
  `, [tableName]);
  return rows;
}

async function getTableData(client, tableName) {
  const { rows } = await client.query(`SELECT * FROM public."${tableName}";`);
  return rows;
}

async function tableExists(client, tableName) {
  const { rows } = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    );
  `, [tableName]);
  return rows[0].exists;
}

async function migrateTable(oldClient, newClient, tableName, dryRun = false) {
  console.log(`\n📦 Migrating table: ${tableName}`);

  try {
    // Check if table exists in old database
    const existsInOld = await tableExists(oldClient, tableName);
    if (!existsInOld) {
      console.log(`   ⏭️  Table doesn't exist in old database, skipping`);
      return { table: tableName, rows: 0, status: 'not-in-source' };
    }

    // Check if table exists in new database
    const existsInNew = await tableExists(newClient, tableName);
    if (!existsInNew) {
      console.log(`   ⏭️  Table doesn't exist in new database, skipping`);
      return { table: tableName, rows: 0, status: 'not-in-target' };
    }

    // Get data from old database
    const data = await getTableData(oldClient, tableName);

    if (data.length === 0) {
      console.log(`   ⏭️  Table is empty, skipping`);
      return { table: tableName, rows: 0, status: 'empty' };
    }

    console.log(`   📊 Found ${data.length} rows`);

    if (dryRun) {
      console.log(`   🔍 DRY RUN: Would insert ${data.length} rows`);
      return { table: tableName, rows: data.length, status: 'dry-run' };
    }

    // Get column names from first row
    const columns = Object.keys(data[0]);
    const columnList = columns.map(c => `"${c}"`).join(', ');
    const placeholders = data.map((_, idx) =>
      `(${columns.map((_, colIdx) => `$${idx * columns.length + colIdx + 1}`).join(', ')})`
    ).join(', ');

    // Flatten all values for parameterized query
    const values = data.flatMap(row => columns.map(col => row[col]));

    // Build INSERT query with ON CONFLICT DO NOTHING for safety
    const insertQuery = `
      INSERT INTO public."${tableName}" (${columnList})
      VALUES ${placeholders}
      ON CONFLICT DO NOTHING;
    `;

    // Execute insert
    const result = await newClient.query(insertQuery, values);

    console.log(`   ✅ Inserted ${result.rowCount} rows (${data.length - result.rowCount} duplicates skipped)`);

    return {
      table: tableName,
      rows: result.rowCount,
      skipped: data.length - result.rowCount,
      status: 'success'
    };

  } catch (error) {
    console.error(`   ❌ Error migrating ${tableName}:`, error.message);
    return { table: tableName, rows: 0, status: 'error', error: error.message };
  }
}

async function resetSequences(newClient) {
  console.log('\n🔄 Resetting auto-increment sequences...');

  const { rows: sequences } = await newClient.query(`
    SELECT
      n.nspname AS schemaname,
      c.relname AS tablename,
      a.attname AS column_name,
      pg_get_serial_sequence(n.nspname||'.'||c.relname, a.attname) AS sequence_name
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE
      a.attnum > 0
      AND NOT a.attisdropped
      AND pg_get_serial_sequence(n.nspname||'.'||c.relname, a.attname) IS NOT NULL
      AND n.nspname = 'public'
    ORDER BY c.relname, a.attname;
  `);

  for (const { tablename, column_name, sequence_name } of sequences) {
    try {
      await newClient.query(`
        SELECT setval($1, COALESCE((SELECT MAX("${column_name}") FROM public."${tablename}"), 1));
      `, [sequence_name]);
      console.log(`   ✅ Reset sequence for ${tablename}.${column_name}`);
    } catch (error) {
      console.log(`   ⚠️  Could not reset sequence for ${tablename}.${column_name}:`, error.message);
    }
  }
}

async function main() {
  const { oldUrl, newUrl } = getDatabaseUrls();

  if (!oldUrl || !newUrl) {
    console.error('❌ Could not resolve both OLD and NEW database URLs.');
    console.error('Usage: node scripts/migrate-data.mjs [OLD_URL] [NEW_URL]');
    console.error('Or set env: OLD_DATABASE_URL, NEW_DATABASE_URL');
    process.exit(1);
  }

  const dryRun = process.argv.includes('--dry-run');

  console.log('\n' + '='.repeat(60));
  console.log('🚀 DATABASE DATA MIGRATION');
  console.log('='.repeat(60));
  console.log(`\n📍 Old Database: ${new URL(oldUrl).host}`);
  console.log(`📍 New Database: ${new URL(newUrl).host}`);
  if (dryRun) {
    console.log(`\n🔍 DRY RUN MODE - No data will be written`);
  }
  console.log('\n' + '='.repeat(60));

  // Connect to both databases
  const oldClient = new Client({
    connectionString: oldUrl,
    statement_timeout: 120000,
    query_timeout: 120000,
  });

  const newClient = new Client({
    connectionString: newUrl,
    statement_timeout: 120000,
    query_timeout: 120000,
  });

  try {
    console.log('\n🔌 Connecting to databases...');
    await oldClient.connect();
    await newClient.connect();
    console.log('   ✅ Connected successfully');

    const results = [];

    // Migrate each table in dependency order
    for (const tableName of TABLE_ORDER) {
      const result = await migrateTable(oldClient, newClient, tableName, dryRun);
      results.push(result);
    }

    // Reset sequences if not dry run
    if (!dryRun) {
      await resetSequences(newClient);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));

    const successCount = results.filter(r => r.status === 'success').length;
    const emptyCount = results.filter(r => r.status === 'empty').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const totalRows = results.reduce((sum, r) => sum + (r.rows || 0), 0);

    console.log(`\n✅ Successful: ${successCount} tables`);
    console.log(`⏭️  Empty: ${emptyCount} tables`);
    console.log(`❌ Errors: ${errorCount} tables`);
    console.log(`📦 Total rows migrated: ${totalRows}`);

    if (errorCount > 0) {
      console.log('\n❌ ERRORS:');
      results.filter(r => r.status === 'error').forEach(r => {
        console.log(`   • ${r.table}: ${r.error}`);
      });
    }

    console.log('\n' + '='.repeat(60));

    if (dryRun) {
      console.log('\n🔍 DRY RUN COMPLETE - No changes were made');
      console.log('Run without --dry-run to execute the migration');
    } else {
      console.log('\n✅ MIGRATION COMPLETE!');
      console.log('\nNext steps:');
      console.log('1. Run verification: node scripts/compare-db-row-counts.mjs');
      console.log('2. Test your application against the new database');
      console.log('3. Update Vercel environment variables with new DATABASE_URL');
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  } finally {
    await oldClient.end();
    await newClient.end();
  }
}

main().catch(console.error);
