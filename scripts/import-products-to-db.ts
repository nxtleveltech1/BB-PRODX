/**
 * Product Data Import Script
 *
 * This script imports the 37 hardcoded products from src/data/products.ts
 * into the Neon PostgreSQL database.
 *
 * It handles:
 * - Categories and subcategories insertion
 * - Product details with pricing and metadata
 * - Related data (benefits, ingredients, tags)
 * - Product images (main + additional)
 *
 * Usage: tsx scripts/import-products-to-db.ts
 */

import { db } from '../lib/db/client-node';
import {
  categories,
  subcategories,
  products,
  productBenefits,
  productIngredients,
  productTags
} from '../lib/db/schema/product';
import { productImages } from '../lib/db/schema/product-images';
import { eq, and } from 'drizzle-orm';

// Import the hardcoded data
import { categories as sourceCategories, products as sourceProducts } from '../src/data/products';

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to parse price string to decimal
function parsePrice(priceStr: string | undefined): string | null {
  if (!priceStr) return null;
  // Extract numeric value from "R199" format
  const match = priceStr.match(/R?\s*(\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
}

async function importCategories() {
  console.log('📦 Importing categories...');

  const categoryMap = new Map<string, number>();
  const subcategoryMap = new Map<string, number>();

  for (const category of sourceCategories) {
    // Insert category
    const [insertedCategory] = await db
      .insert(categories)
      .values({
        name: category.name,
        slug: createSlug(category.id),
        description: category.description,
        icon: category.icon,
      })
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          name: category.name,
          description: category.description,
          icon: category.icon,
        },
      })
      .returning();

    categoryMap.set(category.id, insertedCategory.id);
    console.log(`  ✓ Category: ${category.name} (ID: ${insertedCategory.id})`);

    // Insert subcategories
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const [insertedSubcategory] = await db
          .insert(subcategories)
          .values({
            categoryId: insertedCategory.id,
            name: subcategory.name,
            slug: createSlug(subcategory.id),
            description: subcategory.description,
          })
          .onConflictDoUpdate({
            target: subcategories.slug,
            set: {
              categoryId: insertedCategory.id,
              name: subcategory.name,
              description: subcategory.description,
            },
          })
          .returning();

        subcategoryMap.set(subcategory.id, insertedSubcategory.id);
        console.log(`    ✓ Subcategory: ${subcategory.name} (ID: ${insertedSubcategory.id})`);
      }
    }
  }

  return { categoryMap, subcategoryMap };
}

async function importProducts(
  categoryMap: Map<string, number>,
  subcategoryMap: Map<string, number>
) {
  console.log('\n🛍️  Importing products...');
  let successCount = 0;
  let skipCount = 0;

  for (const product of sourceProducts) {
    try {
      // Parse price
      const price = parsePrice(product.price);
      if (!price) {
        console.log(`  ⚠️  Skipping ${product.name} - invalid price: ${product.price}`);
        skipCount++;
        continue;
      }

      const originalPrice = parsePrice(product.originalPrice);

      // Get category and subcategory IDs
      const categoryId = product.categoryId ? categoryMap.get(product.categoryId) : null;
      const subcategoryId = product.subcategoryId ? subcategoryMap.get(product.subcategoryId) : null;

      // Insert product
      const [insertedProduct] = await db
        .insert(products)
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
          target: products.sku,
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

      console.log(`  ✓ Product: ${product.name} (SKU: ${product.sku}, ID: ${insertedProduct.id})`);

      // Import benefits
      if (product.benefits && product.benefits.length > 0) {
        // Delete existing benefits for this product
        await db.delete(productBenefits).where(eq(productBenefits.productId, insertedProduct.id));

        for (const benefit of product.benefits) {
          await db.insert(productBenefits).values({
            productId: insertedProduct.id,
            benefit,
          });
        }
        console.log(`    ✓ Benefits: ${product.benefits.length}`);
      }

      // Import ingredients
      if (product.ingredients && product.ingredients.length > 0) {
        // Delete existing ingredients for this product
        await db.delete(productIngredients).where(eq(productIngredients.productId, insertedProduct.id));

        for (const ingredient of product.ingredients) {
          await db.insert(productIngredients).values({
            productId: insertedProduct.id,
            ingredient,
          });
        }
        console.log(`    ✓ Ingredients: ${product.ingredients.length}`);
      }

      // Import tags
      if (product.tags && product.tags.length > 0) {
        // Delete existing tags for this product
        await db.delete(productTags).where(eq(productTags.productId, insertedProduct.id));

        for (const tag of product.tags) {
          await db.insert(productTags).values({
            productId: insertedProduct.id,
            tag,
          });
        }
        console.log(`    ✓ Tags: ${product.tags.length}`);
      }

      // Import additional images
      if (product.additionalImages && product.additionalImages.length > 0) {
        // Delete existing additional images for this product
        await db.delete(productImages).where(eq(productImages.productId, insertedProduct.id));

        for (let i = 0; i < product.additionalImages.length; i++) {
          await db.insert(productImages).values({
            productId: insertedProduct.id,
            imageUrl: product.additionalImages[i],
            displayOrder: i + 1, // Main image is 0, additional start at 1
          });
        }
        console.log(`    ✓ Additional Images: ${product.additionalImages.length}`);
      }

      successCount++;
    } catch (error) {
      console.error(`  ❌ Error importing ${product.name}:`, error);
      skipCount++;
    }
  }

  return { successCount, skipCount };
}

async function main() {
  console.log('🚀 Starting product data import...\n');
  console.log(`Total products to import: ${sourceProducts.length}\n`);

  try {
    // Step 1: Import categories and subcategories
    const { categoryMap, subcategoryMap } = await importCategories();

    // Step 2: Import products
    const { successCount, skipCount } = await importProducts(categoryMap, subcategoryMap);

    // Summary
    console.log('\n📊 Import Summary:');
    console.log('─'.repeat(50));
    console.log(`Total products:     ${sourceProducts.length}`);
    console.log(`Successfully imported: ${successCount}`);
    console.log(`Skipped:            ${skipCount}`);
    console.log(`Categories:         ${categoryMap.size}`);
    console.log(`Subcategories:      ${subcategoryMap.size}`);
    console.log('─'.repeat(50));

    if (successCount === sourceProducts.length) {
      console.log('\n✅ All products imported successfully!');
    } else if (successCount > 0) {
      console.log(`\n⚠️  Partial import: ${successCount}/${sourceProducts.length} products imported`);
    } else {
      console.log('\n❌ Import failed - no products were imported');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the import
main()
  .then(() => {
    console.log('\n✨ Import process complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Unhandled error:', error);
    process.exit(1);
  });
