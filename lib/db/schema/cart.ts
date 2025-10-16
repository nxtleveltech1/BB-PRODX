import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user';
import { products } from './product';

// Shopping cart items table
export const cart = pgTable(
  'cart',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    quantity: integer('quantity').default(1).notNull(),
    size: varchar('size', { length: 50 }),

    // Timestamps for cart analytics
    addedAt: timestamp('added_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: one product/size combo per user
    uniqueUserProductSize: unique('cart_unique_user_product_size').on(
      table.userId,
      table.productId,
      table.size
    ),
    // Indexes for performance
    userIdIdx: index('cart_user_id_idx').on(table.userId),
    productIdIdx: index('cart_product_id_idx').on(table.productId),
    addedAtIdx: index('cart_added_at_idx').on(table.addedAt),
  })
);

// Wishlist/saved items table
export const wishlist = pgTable(
  'wishlist',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),

    // Additional wishlist metadata
    priority: integer('priority').default(0), // Higher number = higher priority
    notes: varchar('notes', { length: 500 }),

    // Timestamps
    addedAt: timestamp('added_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: one product per user in wishlist
    uniqueUserProduct: unique('wishlist_unique_user_product').on(
      table.userId,
      table.productId
    ),
    // Indexes
    userIdIdx: index('wishlist_user_id_idx').on(table.userId),
    productIdIdx: index('wishlist_product_id_idx').on(table.productId),
    priorityIdx: index('wishlist_priority_idx').on(table.priority),
    addedAtIdx: index('wishlist_added_at_idx').on(table.addedAt),
  })
);

// Define relations
export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id],
  }),
}));

// Type exports
export type CartItem = typeof cart.$inferSelect;
export type NewCartItem = typeof cart.$inferInsert;
export type WishlistItem = typeof wishlist.$inferSelect;
export type NewWishlistItem = typeof wishlist.$inferInsert;

// Helper functions for cart operations
export interface CartWithProduct extends CartItem {
  product: {
    name: string;
    price: string;
    imageUrl: string | null;
    inStock: boolean;
  };
}

export interface WishlistWithProduct extends WishlistItem {
  product: {
    name: string;
    price: string;
    imageUrl: string | null;
    inStock: boolean;
    rating: string | null;
  };
}