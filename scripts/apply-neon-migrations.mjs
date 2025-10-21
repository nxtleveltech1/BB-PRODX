#!/usr/bin/env node

/**
 * Apply Drizzle migrations to Neon database
 * Uses direct connection string for migrations
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const { Pool } = pg;

// Use direct connection for migrations (not pooled)
const DATABASE_URL = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or DATABASE_URL_DIRECT not found in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to Neon database...');
console.log(`   Using: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

async function applyMigrations() {
  const client = await pool.connect();

  try {
    console.log('✅ Connected to database\n');

    // Check if database is empty
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `);

    console.log(`📊 Current tables in database: ${tablesResult.rows.length}`);
    if (tablesResult.rows.length > 0) {
      console.log('   Tables:', tablesResult.rows.map(r => r.table_name).join(', '));
    }

    // Check for migration tracking table
    const migrationTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'drizzle'
          AND table_name = '__drizzle_migrations__'
      )
    `);

    const hasMigrations = migrationTableExists.rows[0].exists;
    console.log(`\n🔍 Migration tracking table exists: ${hasMigrations}`);

    if (hasMigrations) {
      const appliedMigrations = await client.query(`
        SELECT * FROM drizzle.__drizzle_migrations__ ORDER BY created_at DESC LIMIT 5
      `);
      console.log(`   Applied migrations: ${appliedMigrations.rows.length}`);
      appliedMigrations.rows.forEach(m => {
        console.log(`   - ${m.hash} (${new Date(m.created_at).toISOString()})`);
      });
    }

    // Read the migration file
    const migrationPath = resolve(__dirname, '../db/migrations/0000_thick_ricochet.sql');
    console.log(`\n📖 Reading migration file: ${migrationPath}`);

    const migrationSQL = readFileSync(migrationPath, 'utf8');
    const statements = migrationSQL.split('--> statement-breakpoint').filter(s => s.trim());

    console.log(`   Found ${statements.length} SQL statements`);

    // Check if migration was already applied
    if (hasMigrations) {
      const migrationHash = '0000_thick_ricochet'; // This should match the migration filename
      const alreadyApplied = await client.query(
        `SELECT EXISTS (
          SELECT 1 FROM drizzle.__drizzle_migrations__
          WHERE hash = $1
        )`,
        [migrationHash]
      );

      if (alreadyApplied.rows[0].exists) {
        console.log('\n⏭️  Migration already applied, skipping...');
        return;
      }
    }

    // Apply migration in a transaction
    console.log('\n🚀 Applying migration...');
    await client.query('BEGIN');

    try {
      // Create migration tracking schema if it doesn't exist
      await client.query('CREATE SCHEMA IF NOT EXISTS drizzle');

      // Create migration tracking table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations__ (
          id SERIAL PRIMARY KEY,
          hash TEXT NOT NULL,
          created_at BIGINT
        )
      `);

      // Execute each statement
      let executed = 0;
      for (const statement of statements) {
        const trimmed = statement.trim();
        if (trimmed) {
          try {
            await client.query(trimmed);
            executed++;
            if (executed % 50 === 0) {
              console.log(`   Executed ${executed}/${statements.length} statements...`);
            }
          } catch (error) {
            // Skip errors for tables/indexes that already exist
            if (error.code === '42P07' || error.code === '42710') {
              console.log(`   ⚠️  Skipped (already exists): ${trimmed.substring(0, 60)}...`);
            } else {
              throw error;
            }
          }
        }
      }

      // Record migration
      await client.query(
        `INSERT INTO drizzle.__drizzle_migrations__ (hash, created_at)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        ['0000_thick_ricochet', Date.now()]
      );

      await client.query('COMMIT');
      console.log(`\n✅ Migration applied successfully! (${executed} statements executed)`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    // Verify tables were created
    const finalTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log(`\n📊 Final table count: ${finalTablesResult.rows.length}`);
    console.log('   Tables created:');
    finalTablesResult.rows.forEach(r => {
      console.log(`   ✓ ${r.table_name}`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
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
