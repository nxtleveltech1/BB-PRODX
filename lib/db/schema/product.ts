import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  boolean,
  integer,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories table
export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    description: text('description'),
    icon: varchar('icon', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index('categories_slug_idx').on(table.slug),
    nameIdx: index('categories_name_idx').on(table.name),
  })
);

// Subcategories table
export const subcategories = pgTable(
  'subcategories',
  {
    id: serial('id').primaryKey(),
    categoryId: integer('category_id')
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index('subcategories_slug_idx').on(table.slug),
    categoryIdIdx: index('subcategories_category_id_idx').on(table.categoryId),
  })
);

// Products table
export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    sku: varchar('sku', { length: 50 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    longDescription: text('long_description'),

    // Pricing
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }),

    // Ratings and reviews
    rating: decimal('rating', { precision: 2, scale: 1 }).default('0'),
    reviewsCount: integer('reviews_count').default(0),

    // Categories
    categoryId: integer('category_id').references(() => categories.id),
    subcategoryId: integer('subcategory_id').references(() => subcategories.id),

    // Media
    imageUrl: varchar('image_url', { length: 500 }),

    // Flags
    isPopular: boolean('is_popular').default(false),
    isFeatured: boolean('is_featured').default(false),

    // Inventory
    inStock: boolean('in_stock').default(true),
    stockCount: integer('stock_count').default(0),

    // Additional info
    usageInstructions: text('usage_instructions'),
    warnings: text('warnings'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for search and filtering
    skuIdx: index('products_sku_idx').on(table.sku),
    slugIdx: index('products_slug_idx').on(table.slug),
    categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
    subcategoryIdIdx: index('products_subcategory_id_idx').on(table.subcategoryId),
    isPopularIdx: index('products_is_popular_idx').on(table.isPopular),
    isFeaturedIdx: index('products_is_featured_idx').on(table.isFeatured),
    inStockIdx: index('products_in_stock_idx').on(table.inStock),
    priceIdx: index('products_price_idx').on(table.price),
    ratingIdx: index('products_rating_idx').on(table.rating),
    createdAtIdx: index('products_created_at_idx').on(table.createdAt),
  })
);

// Product benefits table
export const productBenefits = pgTable(
  'product_benefits',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    benefit: varchar('benefit', { length: 255 }).notNull(),
  },
  (table) => ({
    productIdIdx: index('product_benefits_product_id_idx').on(table.productId),
  })
);

// Product ingredients table
export const productIngredients = pgTable(
  'product_ingredients',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    ingredient: varchar('ingredient', { length: 255 }).notNull(),
  },
  (table) => ({
    productIdIdx: index('product_ingredients_product_id_idx').on(table.productId),
  })
);

// Product tags table
export const productTags = pgTable(
  'product_tags',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    tag: varchar('tag', { length: 50 }).notNull(),
  },
  (table) => ({
    productIdIdx: index('product_tags_product_id_idx').on(table.productId),
    tagIdx: index('product_tags_tag_idx').on(table.tag),
  })
);

// Product sizes/variants table
export const productSizes = pgTable(
  'product_sizes',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    size: varchar('size', { length: 50 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  },
  (table) => ({
    productIdIdx: index('product_sizes_product_id_idx').on(table.productId),
    uniqueProductSize: unique('unique_product_size').on(table.productId, table.size),
  })
);

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  benefits: many(productBenefits),
  ingredients: many(productIngredients),
  tags: many(productTags),
  sizes: many(productSizes),
}));

export const productBenefitsRelations = relations(productBenefits, ({ one }) => ({
  product: one(products, {
    fields: [productBenefits.productId],
    references: [products.id],
  }),
}));

export const productIngredientsRelations = relations(productIngredients, ({ one }) => ({
  product: one(products, {
    fields: [productIngredients.productId],
    references: [products.id],
  }),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
}));

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products, {
    fields: [productSizes.productId],
    references: [products.id],
  }),
}));

// Type exports
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductBenefit = typeof productBenefits.$inferSelect;
export type NewProductBenefit = typeof productBenefits.$inferInsert;
export type ProductIngredient = typeof productIngredients.$inferSelect;
export type NewProductIngredient = typeof productIngredients.$inferInsert;
export type ProductTag = typeof productTags.$inferSelect;
export type NewProductTag = typeof productTags.$inferInsert;
export type ProductSize = typeof productSizes.$inferSelect;
export type NewProductSize = typeof productSizes.$inferInsert;