import {
  pgTable,
  serial,
  integer,
  varchar,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './product';

/**
 * Product Images Table
 *
 * Stores additional product images beyond the main imageUrl.
 * Used for product galleries and multiple views.
 */
export const productImages = pgTable(
  'product_images',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
  },
  (table) => ({
    productIdIdx: index('product_images_product_id_idx').on(table.productId),
    displayOrderIdx: index('product_images_display_order_idx').on(table.displayOrder),
  })
);

// Relations
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// Type exports
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
