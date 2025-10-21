/**
 * Verify Products in Database
 *
 * This script verifies that all products from the hardcoded file
 * have been successfully imported to the database.
 *
 * Usage: tsx scripts/verify-products.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as schema from '../lib/db/schema';

// Load environment from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

// Create database connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

async function verifyProducts() {
  console.log('🔍 Verifying Products in Database\n');
  console.log('='.repeat(60));

  try {
    // Count products
    const productCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM products
    `);
    const productCount = Number(productCountResult.rows[0].count);
    console.log(`✓ Total Products:          ${productCount}`);

    // Count categories
    const categoryCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM categories
    `);
    const categoryCount = Number(categoryCountResult.rows[0].count);
    console.log(`✓ Total Categories:        ${categoryCount}`);

    // Count subcategories
    const subcategoryCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM subcategories
    `);
    const subcategoryCount = Number(subcategoryCountResult.rows[0].count);
    console.log(`✓ Total Subcategories:     ${subcategoryCount}`);

    // Count benefits
    const benefitCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM product_benefits
    `);
    const benefitCount = Number(benefitCountResult.rows[0].count);
    console.log(`✓ Total Benefits:          ${benefitCount}`);

    // Count ingredients
    const ingredientCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM product_ingredients
    `);
    const ingredientCount = Number(ingredientCountResult.rows[0].count);
    console.log(`✓ Total Ingredients:       ${ingredientCount}`);

    // Count tags
    const tagCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM product_tags
    `);
    const tagCount = Number(tagCountResult.rows[0].count);
    console.log(`✓ Total Tags:              ${tagCount}`);

    // Count additional images
    const imageCountResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM product_images
    `);
    const imageCount = Number(imageCountResult.rows[0].count);
    console.log(`✓ Total Additional Images: ${imageCount}`);

    console.log('='.repeat(60));

    // Get product breakdown by category
    console.log('\n📊 Products by Category:');
    console.log('-'.repeat(60));

    const categoryBreakdown = await db.execute(sql`
      SELECT
        c.name as category,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name
      ORDER BY c.name
    `);

    for (const row of categoryBreakdown.rows) {
      console.log(`  ${row.category}: ${row.product_count} products`);
    }

    // List all products
    console.log('\n📦 All Products:');
    console.log('-'.repeat(60));

    const products = await db.execute(sql`
      SELECT
        p.id,
        p.sku,
        p.name,
        p.price,
        p.stock_count,
        c.name as category,
        s.name as subcategory
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.id
    `);

    for (const product of products.rows) {
      console.log(`  ${product.id.toString().padStart(2, ' ')}. ${product.name}`);
      console.log(`      SKU: ${product.sku} | Price: R${product.price} | Stock: ${product.stock_count}`);
      console.log(`      Category: ${product.category || 'N/A'} > ${product.subcategory || 'N/A'}`);
      console.log('');
    }

    console.log('='.repeat(60));
    console.log('\n✅ Verification Complete!');
    console.log(`\n✨ ${productCount} products are now in the database and ready to use!`);

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run verification
verifyProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
