import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user';
import { products } from './product';

// Orders table
export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),

    // Order status: pending, processing, shipped, delivered, cancelled
    status: varchar('status', { length: 50 }).default('pending').notNull(),

    // Financial details
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
    shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0'),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),

    // Addresses stored as JSONB for flexibility
    shippingAddress: jsonb('shipping_address'),
    billingAddress: jsonb('billing_address'),

    // Payment info (store minimal info, actual payment handled by Stripe)
    paymentMethod: varchar('payment_method', { length: 50 }),
    paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
    stripePaymentId: varchar('stripe_payment_id', { length: 255 }),

    // Shipping info
    trackingNumber: varchar('tracking_number', { length: 100 }),
    shippedAt: timestamp('shipped_at'),
    deliveredAt: timestamp('delivered_at'),

    // Notes
    customerNotes: text('customer_notes'),
    internalNotes: text('internal_notes'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for common queries
    userIdIdx: index('orders_user_id_idx').on(table.userId),
    orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
    statusIdx: index('orders_status_idx').on(table.status),
    paymentStatusIdx: index('orders_payment_status_idx').on(table.paymentStatus),
    createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
    // Compound indexes for analytics
    userStatusIdx: index('orders_user_status_idx').on(table.userId, table.status),
  })
);

// Order items table (line items in an order)
export const orderItems = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .references(() => orders.id, { onDelete: 'cascade' })
      .notNull(),
    productId: integer('product_id')
      .references(() => products.id)
      .notNull(),

    // Item details at time of purchase
    quantity: integer('quantity').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    size: varchar('size', { length: 50 }),

    // Discount tracking
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
    discountCode: varchar('discount_code', { length: 50 }),

    // Line item total
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),

    // Snapshot of product info at purchase time
    productSnapshot: jsonb('product_snapshot'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
    productIdIdx: index('order_items_product_id_idx').on(table.productId),
    // Compound index for order details queries
    orderProductIdx: index('order_items_order_product_idx').on(table.orderId, table.productId),
  })
);

// Define relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Helper function to generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BB-${timestamp}-${random}`;
}

// Import for text type
import { text } from 'drizzle-orm/pg-core';

// Type exports
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

// Address type for JSONB fields
export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Product snapshot type for order items
export interface ProductSnapshot {
  name: string;
  sku: string;
  imageUrl?: string;
  description?: string;
}