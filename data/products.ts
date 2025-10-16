/**
 * Product data
 * This module re-exports the actual product catalog for client-side use
 * The actual product data is in src/data/products.ts
 */

// Re-export everything from the actual products module
export {
  products,
  categories,
  getProductsByCategory,
  getFeaturedProducts,
  getPopularProducts,
  searchProducts,
  getProductById,
  getProductsByTag,
  getRelatedProducts,
  type Product,
  type Category
} from "@/src/data/products";