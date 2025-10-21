/**
 * Complete Migration and Import Script
 *
 * This script:
 * 1. Creates the product_images table
 * 2. Imports all 37 products from hardcoded data
 *
 * Usage: tsx scripts/migrate-and-import.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql, eq } from 'drizzle-orm';
import * as schema from '../lib/db/schema';

// Load environment from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Import the hardcoded data
import { categories as sourceCategories, products as sourceProducts } from '../src/data/products';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  console.error('   Make sure you have a .env.local file with DATABASE_URL');
  process.exit(1);
}

// Create database connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

// Helper functions
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parsePrice(priceStr: string | undefined): string | null {
  if (!priceStr) return null;
  const match = priceStr.match(/R?\s*(\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
}

// Step 1: Create product_images table
async function createProductImagesTable() {
  console.log('\n🔧 Creating product_images table...');

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "product_images" (
        "id" SERIAL PRIMARY KEY,
        "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "image_url" VARCHAR(500) NOT NULL,
        "display_order" INTEGER DEFAULT 0 NOT NULL
      )
    `);
    console.log('  ✓ Table created');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "product_images_product_id_idx"
      ON "product_images" ("product_id")
    `);
    console.log('  ✓ Product ID index created');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "product_images_display_order_idx"
      ON "product_images" ("display_order")
    `);
    console.log('  ✓ Display order index created');

    return true;
  } catch (error) {
    console.error('  ❌ Failed to create table:', error);
    return false;
  }
}

// Step 2: Import categories
async function importCategories() {
  console.log('\n📦 Importing categories and subcategories...');

  const categoryMap = new Map<string, number>();
  const subcategoryMap = new Map<string, number>();

  for (const category of sourceCategories) {
    const [insertedCategory] = await db
      .insert(schema.categories)
      .values({
        name: category.name,
        slug: createSlug(category.id),
        description: category.description,
        icon: category.icon,
      })
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: {
          name: category.name,
          description: category.description,
          icon: category.icon,
        },
      })
      .returning();

    categoryMap.set(category.id, insertedCategory.id);
    console.log(`  ✓ ${category.name} (ID: ${insertedCategory.id})`);

    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        // Check if subcategory exists first
        const existingSubcategory = await db.query.subcategories.findFirst({
          where: (subcategories, { eq }) => eq(subcategories.slug, createSlug(subcategory.id)),
        });

        let insertedSubcategory;
        if (existingSubcategory) {
          // Update existing
          [insertedSubcategory] = await db
            .update(schema.subcategories)
            .set({
              categoryId: insertedCategory.id,
              name: subcategory.name,
              description: subcategory.description,
            })
            .where(eq(schema.subcategories.id, existingSubcategory.id))
            .returning();
        } else {
          // Insert new
          [insertedSubcategory] = await db
            .insert(schema.subcategories)
            .values({
              categoryId: insertedCategory.id,
              name: subcategory.name,
              slug: createSlug(subcategory.id),
              description: subcategory.description,
            })
            .returning();
        }

        subcategoryMap.set(subcategory.id, insertedSubcategory.id);
        console.log(`    ✓ ${subcategory.name} (ID: ${insertedSubcategory.id})`);
      }
    }
  }

  return { categoryMap, subcategoryMap };
}

// Step 3: Import products
async function importProducts(
  categoryMap: Map<string, number>,
  subcategoryMap: Map<string, number>
) {
  console.log('\n🛍️  Importing products...');
  let successCount = 0;
  let skipCount = 0;
  let imageCount = 0;

  for (const product of sourceProducts) {
    try {
      const price = parsePrice(product.price);
      if (!price) {
        console.log(`  ⚠️  Skipping ${product.name} - invalid price`);
        skipCount++;
        continue;
      }

      const originalPrice = parsePrice(product.originalPrice);
      const categoryId = product.categoryId ? categoryMap.get(product.categoryId) : null;
      const subcategoryId = product.subcategoryId ? subcategoryMap.get(product.subcategoryId) : null;

      const [insertedProduct] = await db
        .insert(schema.products)
        .values({
          sku: product.sku,
          name: product.name,
          slug: createSlug(product.name),
          description: product.description,
          longDescription: product.longDescription,
          price,
          originalPrice,
          rating: product.rating ? product.rating.toString() : '0',
          reviewsCount: product.reviews || 0,
          categoryId: categoryId || null,
          subcategoryId: subcategoryId || null,
          imageUrl: product.image,
          isPopular: product.popular || false,
          isFeatured: product.featured || false,
          inStock: product.inStock ?? true,
          stockCount: product.stockCount || 0,
          usageInstructions: product.usage,
          warnings: product.warnings,
        })
        .onConflictDoUpdate({
          target: schema.products.sku,
          set: {
            name: product.name,
            slug: createSlug(product.name),
            description: product.description,
            longDescription: product.longDescription,
            price,
            originalPrice,
            rating: product.rating ? product.rating.toString() : '0',
            reviewsCount: product.reviews || 0,
            categoryId: categoryId || null,
            subcategoryId: subcategoryId || null,
            imageUrl: product.image,
            isPopular: product.popular || false,
            isFeatured: product.featured || false,
            inStock: product.inStock ?? true,
            stockCount: product.stockCount || 0,
            usageInstructions: product.usage,
            warnings: product.warnings,
            updatedAt: new Date(),
          },
        })
        .returning();

      console.log(`  ✓ ${product.name} (${product.sku})`);

      // Import benefits
      if (product.benefits && product.benefits.length > 0) {
        await db.delete(schema.productBenefits).where(eq(schema.productBenefits.productId, insertedProduct.id));
        for (const benefit of product.benefits) {
          await db.insert(schema.productBenefits).values({
            productId: insertedProduct.id,
            benefit,
          });
        }
      }

      // Import ingredients
      if (product.ingredients && product.ingredients.length > 0) {
        await db.delete(schema.productIngredients).where(eq(schema.productIngredients.productId, insertedProduct.id));
        for (const ingredient of product.ingredients) {
          await db.insert(schema.productIngredients).values({
            productId: insertedProduct.id,
            ingredient,
          });
        }
      }

      // Import tags
      if (product.tags && product.tags.length > 0) {
        await db.delete(schema.productTags).where(eq(schema.productTags.productId, insertedProduct.id));
        for (const tag of product.tags) {
          await db.insert(schema.productTags).values({
            productId: insertedProduct.id,
            tag,
          });
        }
      }

      // Import additional images
      if (product.additionalImages && product.additionalImages.length > 0) {
        await db.execute(sql`
          DELETE FROM product_images WHERE product_id = ${insertedProduct.id}
        `);

        for (let i = 0; i < product.additionalImages.length; i++) {
          await db.execute(sql`
            INSERT INTO product_images (product_id, image_url, display_order)
            VALUES (${insertedProduct.id}, ${product.additionalImages[i]}, ${i + 1})
          `);
          imageCount++;
        }
      }

      successCount++;
    } catch (error) {
      console.error(`  ❌ Error importing ${product.name}:`, error);
      skipCount++;
    }
  }

  return { successCount, skipCount, imageCount };
}

// Main execution
async function main() {
  console.log('🚀 Starting Complete Migration and Import Process');
  console.log(`📊 Products to import: ${sourceProducts.length}`);

  try {
    // Step 1: Create product_images table
    const tableCreated = await createProductImagesTable();
    if (!tableCreated) {
      console.error('\n❌ Failed to create product_images table');
      process.exit(1);
    }

    // Step 2: Import categories
    const { categoryMap, subcategoryMap } = await importCategories();

    // Step 3: Import products
    const { successCount, skipCount, imageCount } = await importProducts(categoryMap, subcategoryMap);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total products:         ${sourceProducts.length}`);
    console.log(`Successfully imported:  ${successCount}`);
    console.log(`Skipped:                ${skipCount}`);
    console.log(`Categories:             ${categoryMap.size}`);
    console.log(`Subcategories:          ${subcategoryMap.size}`);
    console.log(`Additional images:      ${imageCount}`);
    console.log('='.repeat(60));

    if (successCount === sourceProducts.length) {
      console.log('\n✅ ALL PRODUCTS IMPORTED SUCCESSFULLY!');
    } else if (successCount > 0) {
      console.log(`\n⚠️  PARTIAL IMPORT: ${successCount}/${sourceProducts.length} products imported`);
    } else {
      console.log('\n❌ IMPORT FAILED - no products were imported');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main()
  .then(() => {
    console.log('\n✨ Process complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Unhandled error:', error);
    process.exit(1);
  });
