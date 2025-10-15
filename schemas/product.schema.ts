import { z } from 'zod';

// Product category enum
export const productCategorySchema = z.enum([
  'supplements',
  'skincare',
  'wellness',
  'nutrition',
  'fitness',
  'mindfulness',
  'sleep',
  'immunity',
  'energy',
  'digestion',
  'beauty',
  'other',
]);

// Product status enum
export const productStatusSchema = z.enum(['active', 'draft', 'archived', 'out_of_stock']);

// Product type enum
export const productTypeSchema = z.enum(['physical', 'digital', 'subscription', 'service']);

// Price tier enum
export const priceTierSchema = z.enum(['budget', 'standard', 'premium', 'luxury']);

// Product dimension schema
export const productDimensionSchema = z.object({
  length: z.number().positive('Length must be positive').optional(),
  width: z.number().positive('Width must be positive').optional(),
  height: z.number().positive('Height must be positive').optional(),
  weight: z.number().positive('Weight must be positive').optional(),
  unit: z.enum(['cm', 'inch', 'kg', 'lb', 'oz', 'g']).default('cm'),
});

// Product image schema
export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().max(200, 'Alt text must be less than 200 characters').optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

// Product variant schema
export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Variant name is required').max(100),
  sku: z.string().min(1, 'SKU is required').max(50),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().nullable().optional(),
  costPrice: z.number().positive().nullable().optional(),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').default(0),
  trackQuantity: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  attributes: z.record(z.string()).optional(),
  images: z.array(productImageSchema).optional(),
  weight: z.number().positive().optional(),
  dimensions: productDimensionSchema.optional(),
  isDefault: z.boolean().default(false),
});

// Product SEO schema
export const productSeoSchema = z.object({
  title: z.string().max(70, 'SEO title must be less than 70 characters').optional(),
  description: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional(),
  ogImage: z.string().url().optional(),
});

// Product nutrition schema (for supplements/nutrition products)
export const nutritionFactsSchema = z.object({
  servingSize: z.string().optional(),
  servingsPerContainer: z.number().optional(),
  calories: z.number().optional(),
  totalFat: z.number().optional(),
  saturatedFat: z.number().optional(),
  transFat: z.number().optional(),
  cholesterol: z.number().optional(),
  sodium: z.number().optional(),
  totalCarbohydrate: z.number().optional(),
  dietaryFiber: z.number().optional(),
  sugars: z.number().optional(),
  protein: z.number().optional(),
  vitamins: z.record(z.number()).optional(),
  minerals: z.record(z.number()).optional(),
  otherIngredients: z.array(z.string()).optional(),
});

// Product review schema
export const productReviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100, 'Review title must be less than 100 characters').optional(),
  comment: z.string().max(1000, 'Review comment must be less than 1000 characters'),
  isVerifiedPurchase: z.boolean().default(false),
  helpfulCount: z.number().int().min(0).default(0),
  images: z.array(productImageSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Base product schema
const baseProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(5000, 'Description must be less than 5000 characters'),
  shortDescription: z.string().max(500, 'Short description must be less than 500 characters').optional(),
  category: productCategorySchema,
  subcategory: z.string().max(50).optional(),
  tags: z.array(z.string().max(30)).optional().default([]),
  brand: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  status: productStatusSchema.default('draft'),
  type: productTypeSchema.default('physical'),
  priceTier: priceTierSchema.optional(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  images: z.array(productImageSchema).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
  seo: productSeoSchema.optional(),
  nutritionFacts: nutritionFactsSchema.optional(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  benefits: z.array(z.string().max(200)).optional(),
  usage: z.string().max(1000).optional(),
  warnings: z.string().max(500).optional(),
  shippingInfo: z.object({
    weight: z.number().positive().optional(),
    dimensions: productDimensionSchema.optional(),
    freeShipping: z.boolean().default(false),
    shippingClass: z.string().optional(),
  }).optional(),
  metadata: z.record(z.any()).optional().default({}),
});

// Create product schema
export const createProductSchema = baseProductSchema.extend({
  // Ensure at least one variant or base price
  price: z.number().positive('Price must be positive').optional(),
  compareAtPrice: z.number().positive().optional(),
  quantity: z.number().int().min(0).default(0),
  sku: z.string().min(1, 'SKU is required').max(50).optional(),
}).refine(
  (data) => data.price || (data.variants && data.variants.length > 0),
  {
    message: 'Product must have either a base price or at least one variant',
    path: ['price'],
  }
);

// Product schema (for database/API responses)
export const productSchema = baseProductSchema.extend({
  id: z.string().uuid(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  quantity: z.number().int().min(0).default(0),
  sku: z.string(),
  soldCount: z.number().int().min(0).default(0),
  viewCount: z.number().int().min(0).default(0),
  averageRating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().nullable().optional(),
  deletedAt: z.string().datetime().nullable().optional(),
});

// Update product schema
export const updateProductSchema = baseProductSchema.partial().extend({
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
  quantity: z.number().int().min(0).optional(),
  sku: z.string().min(1).max(50).optional(),
});

// Product list query schema
export const productListQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('12'),
  search: z.string().optional(),
  category: productCategorySchema.optional(),
  subcategory: z.string().optional(),
  status: productStatusSchema.optional(),
  type: productTypeSchema.optional(),
  priceTier: priceTierSchema.optional(),
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().positive()).optional(),
  brand: z.string().optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  isNew: z.string().transform(val => val === 'true').optional(),
  isBestseller: z.string().transform(val => val === 'true').optional(),
  inStock: z.string().transform(val => val === 'true').optional(),
  tags: z.string().transform(val => val.split(',')).optional(),
  sortBy: z.enum([
    'name',
    'price',
    'createdAt',
    'updatedAt',
    'soldCount',
    'viewCount',
    'averageRating',
    'reviewCount',
  ]).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  includeDeleted: z.boolean().optional().default(false),
});

// Product statistics schema
export const productStatisticsSchema = z.object({
  totalProducts: z.number(),
  activeProducts: z.number(),
  draftProducts: z.number(),
  outOfStockProducts: z.number(),
  featuredProducts: z.number(),
  totalRevenue: z.number(),
  totalSold: z.number(),
  averageRating: z.number(),
  totalReviews: z.number(),
  productsByCategory: z.record(z.number()),
  topSellingProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    soldCount: z.number(),
    revenue: z.number(),
  })),
  lowStockProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    sku: z.string(),
    quantity: z.number(),
  })),
});

// Cart item schema
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  price: z.number().positive(),
  metadata: z.record(z.any()).optional(),
});

// Add to cart schema
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
});

// Update cart item schema
export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

// Type exports
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type ProductType = z.infer<typeof productTypeSchema>;
export type PriceTier = z.infer<typeof priceTierSchema>;
export type ProductDimension = z.infer<typeof productDimensionSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductSeo = z.infer<typeof productSeoSchema>;
export type NutritionFacts = z.infer<typeof nutritionFactsSchema>;
export type ProductReview = z.infer<typeof productReviewSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type Product = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductStatistics = z.infer<typeof productStatisticsSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;