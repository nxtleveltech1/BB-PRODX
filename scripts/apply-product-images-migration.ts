/**
 * Apply product_images migration
 *
 * Usage: tsx scripts/apply-product-images-migration.ts
 */

import { db } from '../lib/db/client-node';
import { sql } from 'drizzle-orm';

async function applyMigration() {
  console.log('🔧 Applying product_images migration...\n');

  try {
    // Create product_images table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "product_images" (
        "id" SERIAL PRIMARY KEY,
        "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "image_url" VARCHAR(500) NOT NULL,
        "display_order" INTEGER DEFAULT 0 NOT NULL
      )
    `);
    console.log('✓ Created product_images table');

    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "product_images_product_id_idx"
      ON "product_images" ("product_id")
    `);
    console.log('✓ Created product_id index');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "product_images_display_order_idx"
      ON "product_images" ("display_order")
    `);
    console.log('✓ Created display_order index');

    // Add comment
    await db.execute(sql`
      COMMENT ON TABLE "product_images" IS
      'Stores additional product images beyond the main imageUrl for product galleries'
    `);
    console.log('✓ Added table comment');

    console.log('\n✅ Migration applied successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
