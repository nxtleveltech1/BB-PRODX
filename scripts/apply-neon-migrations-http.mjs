#!/usr/bin/env node

/**
 * Apply Drizzle migrations to Neon database using HTTP client
 * Uses direct connection string for migrations
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Use direct connection for migrations (not pooled)
const DATABASE_URL = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or DATABASE_URL_DIRECT not found in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to Neon database via HTTP...');
console.log(`   Using: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

const sql = neon(DATABASE_URL);

async function applyMigrations() {
  try {
    console.log('✅ Connected to database\n');

    // Check if database is empty
    const tablesResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `;

    console.log(`📊 Current tables in database: ${tablesResult.length}`);
    if (tablesResult.length > 0) {
      console.log('   Tables:', tablesResult.map(r => r.table_name).join(', '));
    }

    // Check for migration tracking table in drizzle schema
    const migrationTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'drizzle'
          AND table_name = '__drizzle_migrations__'
      ) as exists
    `;

    const hasMigrations = migrationTableCheck[0].exists;
    console.log(`\n🔍 Migration tracking table exists: ${hasMigrations}`);

    if (hasMigrations) {
      const appliedMigrations = await sql`
        SELECT * FROM drizzle.__drizzle_migrations__ ORDER BY created_at DESC LIMIT 5
      `;
      console.log(`   Applied migrations: ${appliedMigrations.length}`);
      appliedMigrations.forEach(m => {
        console.log(`   - ${m.hash} (${new Date(Number(m.created_at)).toISOString()})`);
      });
    }

    // Read the migration file
    const migrationPath = resolve(__dirname, '../db/migrations/0000_thick_ricochet.sql');
    console.log(`\n📖 Reading migration file: ${migrationPath}`);

    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Check if migration was already applied
    if (hasMigrations) {
      const migrationHash = '0000_thick_ricochet';
      const alreadyApplied = await sql`
        SELECT EXISTS (
          SELECT 1 FROM drizzle.__drizzle_migrations__
          WHERE hash = ${migrationHash}
        ) as exists
      `;

      if (alreadyApplied[0].exists) {
        console.log('\n⏭️  Migration already applied, skipping...');

        // Show final table count
        const finalTablesResult = await sql`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `;

        console.log(`\n📊 Current table count: ${finalTablesResult.length}`);
        console.log('   Tables:');
        finalTablesResult.forEach(r => {
          console.log(`   ✓ ${r.table_name}`);
        });

        return;
      }
    }

    // Apply migration
    console.log('\n🚀 Applying migration...');

    // Create migration tracking schema if it doesn't exist
    await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;

    // Create migration tracking table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations__ (
        id SERIAL PRIMARY KEY,
        hash TEXT NOT NULL,
        created_at BIGINT
      )
    `;

    // Execute the full migration SQL
    // Note: Neon HTTP doesn't support transactions, but this should be safe for initial schema creation
    try {
      await sql.unsafe(migrationSQL);
      console.log('   ✅ Migration SQL executed');
    } catch (error) {
      // If error is about existing objects, that's okay
      if (error.message.includes('already exists')) {
        console.log('   ⚠️  Some objects already exist, continuing...');
      } else {
        throw error;
      }
    }

    // Record migration
    await sql`
      INSERT INTO drizzle.__drizzle_migrations__ (hash, created_at)
      VALUES ('0000_thick_ricochet', ${Date.now()})
      ON CONFLICT DO NOTHING
    `;

    console.log('   ✅ Migration recorded');

    // Verify tables were created
    const finalTablesResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`\n📊 Final table count: ${finalTablesResult.length}`);
    console.log('   Tables created:');
    finalTablesResult.forEach(r => {
      console.log(`   ✓ ${r.table_name}`);
    });

    console.log('\n✅ Migration applied successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    throw error;
  }
}

// Run migration
applyMigrations()
  .then(() => {
    console.log('\n🎉 Database migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
