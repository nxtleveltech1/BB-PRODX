/**
 * Product data utilities
 * This module provides product-related data functions
 * Server-only module - handles database queries
 */

'use server';

import { db as dbNode } from "@/lib/db/client-node";
import { products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { mockProducts } from "./mock-products";

// Get all products from database
export async function getAllProducts() {
  try {
    const allProducts = await dbNode
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));

    return allProducts.length > 0 ? allProducts : mockProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return mock data as fallback
    return mockProducts;
  }
}

// Get product by ID
export async function getProductById(id: string) {
  try {
    const product = await dbNode
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (product.length > 0) {
      return product[0];
    }

    // Fallback to mock data
    return mockProducts.find(p => p.id === id) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return mockProducts.find(p => p.id === id) || null;
  }
}

// Get products by category
export async function getProductsByCategory(category: string) {
  try {
    const categoryProducts = await dbNode
      .select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));

    return categoryProducts.length > 0
      ? categoryProducts
      : mockProducts.filter(p => p.category === category);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return mockProducts.filter(p => p.category === category);
  }
}

// Re-export mock products for backward compatibility
export { mockProducts };

// Export default for backward compatibility
export default mockProducts;