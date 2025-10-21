import { db } from '@/lib/db/client-edge';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  products,
  categories,
  subcategories,
  productBenefits,
  productIngredients,
  productTags,
} from '@/lib/db/schema/product';
import { productImages } from '@/lib/db/schema/product-images';
import type { Product as FrontendProduct } from '@/types/product';

/**
 * Helper to fetch additional images for a product
 */
async function fetchAdditionalImages(productId: number) {
  const images = await db.select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.displayOrder);
  return images;
}

/**
 * Transform database product to frontend Product type
 */
function transformProductToFrontend(dbProduct: any): FrontendProduct {
  return {
    id: dbProduct.id,
    sku: dbProduct.sku,
    name: dbProduct.name,
    description: dbProduct.description || '',
    longDescription: dbProduct.longDescription || dbProduct.description || '',
    price: `R${parseFloat(dbProduct.price).toFixed(0)}`,
    originalPrice: dbProduct.originalPrice ? `R${parseFloat(dbProduct.originalPrice).toFixed(0)}` : undefined,
    rating: parseFloat(dbProduct.rating || '0'),
    reviews: dbProduct.reviewsCount || 0,
    benefits: dbProduct.benefits?.map((b: any) => b.benefit) || [],
    ingredients: dbProduct.ingredients?.map((i: any) => i.ingredient) || [],
    tags: dbProduct.tags?.map((t: any) => t.tag) || [],
    usage: dbProduct.usageInstructions || 'Follow package instructions or consult healthcare provider.',
    warnings: dbProduct.warnings || 'Consult your healthcare provider before use.',
    categoryId: dbProduct.category?.slug || '',
    subcategoryId: dbProduct.subcategory?.slug || '',
    image: dbProduct.imageUrl || '/products/placeholder.png',
    additionalImages: dbProduct.additionalImages?.map((img: any) => img.imageUrl) || [],
    popular: dbProduct.isPopular || false,
    featured: dbProduct.isFeatured || false,
    inStock: dbProduct.inStock ?? true,
    stockCount: dbProduct.stockCount || 0,
  };
}

/**
 * Get all products with full relations
 */
export async function getAllProducts(): Promise<FrontendProduct[]> {
  const result = await db.query.products.findMany({
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
    orderBy: [desc(products.isFeatured), desc(products.isPopular), desc(products.createdAt)],
  });

  // Fetch additional images for each product
  const productsWithImages = await Promise.all(
    result.map(async (product) => {
      const additionalImages = await fetchAdditionalImages(product.id);
      return { ...product, additionalImages };
    })
  );

  return productsWithImages.map(transformProductToFrontend);
}

/**
 * Get featured products (limit 8 by default)
 */
export async function getFeaturedProducts(limit = 8): Promise<FrontendProduct[]> {
  const result = await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
    orderBy: [desc(products.rating), desc(products.reviewsCount)],
    limit,
  });

  // Fetch additional images for each product
  const productsWithImages = await Promise.all(
    result.map(async (product) => {
      const additionalImages = await fetchAdditionalImages(product.id);
      return { ...product, additionalImages };
    })
  );

  return productsWithImages.map(transformProductToFrontend);
}

/**
 * Get popular products
 */
export async function getPopularProducts(limit = 8): Promise<FrontendProduct[]> {
  const result = await db.query.products.findMany({
    where: eq(products.isPopular, true),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
    orderBy: [desc(products.rating), desc(products.reviewsCount)],
    limit,
  });

  // Fetch additional images for each product
  const productsWithImages = await Promise.all(
    result.map(async (product) => {
      const additionalImages = await fetchAdditionalImages(product.id);
      return { ...product, additionalImages };
    })
  );

  return productsWithImages.map(transformProductToFrontend);
}

/**
 * Get product by ID
 */
export async function getProductById(id: number): Promise<FrontendProduct | null> {
  const result = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
  });

  if (!result) return null;

  const additionalImages = await fetchAdditionalImages(result.id);
  const productWithImages = { ...result, additionalImages };

  return transformProductToFrontend(productWithImages);
}

/**
 * Get product by SKU
 */
export async function getProductBySku(sku: string): Promise<FrontendProduct | null> {
  const result = await db.query.products.findFirst({
    where: eq(products.sku, sku),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
  });

  if (!result) return null;

  const additionalImages = await fetchAdditionalImages(result.id);
  const productWithImages = { ...result, additionalImages };

  return transformProductToFrontend(productWithImages);
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<FrontendProduct | null> {
  const result = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
  });

  if (!result) return null;

  const additionalImages = await fetchAdditionalImages(result.id);
  const productWithImages = { ...result, additionalImages };

  return transformProductToFrontend(productWithImages);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categorySlug: string): Promise<FrontendProduct[]> {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (!category) return [];

  const result = await db.query.products.findMany({
    where: eq(products.categoryId, category.id),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
    orderBy: [desc(products.isFeatured), desc(products.isPopular), desc(products.rating)],
  });

  // Fetch additional images for each product
  const productsWithImages = await Promise.all(
    result.map(async (product) => {
      const additionalImages = await fetchAdditionalImages(product.id);
      return { ...product, additionalImages };
    })
  );

  return productsWithImages.map(transformProductToFrontend);
}

/**
 * Get products by subcategory
 */
export async function getProductsBySubcategory(subcategorySlug: string): Promise<FrontendProduct[]> {
  const subcategory = await db.query.subcategories.findFirst({
    where: eq(subcategories.slug, subcategorySlug),
  });

  if (!subcategory) return [];

  const result = await db.query.products.findMany({
    where: eq(products.subcategoryId, subcategory.id),
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
    orderBy: [desc(products.isFeatured), desc(products.isPopular), desc(products.rating)],
  });

  // Fetch additional images for each product
  const productsWithImages = await Promise.all(
    result.map(async (product) => {
      const additionalImages = await fetchAdditionalImages(product.id);
      return { ...product, additionalImages };
    })
  );

  return productsWithImages.map(transformProductToFrontend);
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<FrontendProduct[]> {
  const result = await db.query.products.findMany({
    where: sql`${products.name} ILIKE ${'%' + query + '%'} OR ${products.description} ILIKE ${'%' + query + '%'}`,
    with: {
      category: true,
      subcategory: true,
      benefits: true,
      ingredients: true,
      tags: true,
    },
    orderBy: [desc(products.isFeatured), desc(products.rating)],
  });

  // Fetch additional images for each product
  const productsWithImages = await Promise.all(
    result.map(async (product) => {
      const additionalImages = await fetchAdditionalImages(product.id);
      return { ...product, additionalImages };
    })
  );

  return productsWithImages.map(transformProductToFrontend);
}

/**
 * Get all categories with product counts
 */
export async function getCategoriesWithProductCounts() {
  return db.query.categories.findMany({
    with: {
      subcategories: true,
      products: {
        columns: {
          id: true,
        },
      },
    },
  });
}
