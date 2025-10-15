import { z } from 'zod';
import { addressSchema } from './user.schema';
import { cartItemSchema } from './product.schema';

// Order status enum
export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'failed',
]);

// Payment status enum
export const paymentStatusSchema = z.enum([
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded',
]);

// Payment method enum
export const paymentMethodSchema = z.enum([
  'credit_card',
  'debit_card',
  'paypal',
  'stripe',
  'bank_transfer',
  'cash_on_delivery',
  'crypto',
  'other',
]);

// Shipping method enum
export const shippingMethodSchema = z.enum([
  'standard',
  'express',
  'overnight',
  'pickup',
  'digital',
]);

// Order item schema
export const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  name: z.string(),
  sku: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  metadata: z.record(z.any()).optional(),
});

// Discount schema
export const discountSchema = z.object({
  code: z.string().optional(),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.number().positive(),
  description: z.string().optional(),
});

// Shipping info schema
export const shippingInfoSchema = z.object({
  method: shippingMethodSchema,
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  actualDelivery: z.string().datetime().optional(),
  cost: z.number().min(0),
  address: addressSchema,
});

// Payment info schema
export const paymentInfoSchema = z.object({
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  transactionId: z.string().optional(),
  gatewayResponse: z.record(z.any()).optional(),
  paidAt: z.string().datetime().optional(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
});

// Base order schema
const baseOrderSchema = z.object({
  userId: z.string().uuid(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  customerPhone: z.string().optional(),
  status: orderStatusSchema.default('pending'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
  subtotal: z.number().positive(),
  tax: z.number().min(0).default(0),
  shipping: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  currency: z.string().default('USD'),
  billingAddress: addressSchema,
  shippingInfo: shippingInfoSchema,
  paymentInfo: paymentInfoSchema.optional(),
  discounts: z.array(discountSchema).optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
});

// Create order schema
export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Order must contain at least one item'),
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional(),
  shippingMethod: shippingMethodSchema,
  paymentMethod: paymentMethodSchema,
  discountCode: z.string().optional(),
  notes: z.string().max(1000).optional(),
  saveAddress: z.boolean().optional().default(false),
  newsletterOptIn: z.boolean().optional().default(false),
});

// Order schema (for database/API responses)
export const orderSchema = baseOrderSchema.extend({
  id: z.string().uuid(),
  orderNumber: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  confirmedAt: z.string().datetime().optional(),
  shippedAt: z.string().datetime().optional(),
  deliveredAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
  refundedAt: z.string().datetime().optional(),
});

// Update order schema (for admin updates)
export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  shippingInfo: shippingInfoSchema.partial().optional(),
  paymentInfo: paymentInfoSchema.partial().optional(),
  notes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
});

// Cancel order schema
export const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required').max(500),
  refund: z.boolean().default(true),
  notifyCustomer: z.boolean().default(true),
});

// Refund order schema
export const refundOrderSchema = z.object({
  amount: z.number().positive('Refund amount must be positive'),
  reason: z.string().min(1, 'Refund reason is required').max(500),
  items: z.array(z.object({
    orderItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).optional(),
  notifyCustomer: z.boolean().default(true),
});

// Order list query schema
export const orderListQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
  userId: z.string().uuid().optional(),
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minTotal: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxTotal: z.string().transform(Number).pipe(z.number().positive()).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'total', 'status', 'orderNumber']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Order statistics schema
export const orderStatisticsSchema = z.object({
  totalOrders: z.number(),
  totalRevenue: z.number(),
  averageOrderValue: z.number(),
  ordersByStatus: z.record(orderStatusSchema, z.number()),
  ordersByPaymentMethod: z.record(paymentMethodSchema, z.number()),
  revenueByPeriod: z.array(z.object({
    period: z.string(),
    revenue: z.number(),
    orderCount: z.number(),
  })),
  topCustomers: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    email: z.string(),
    orderCount: z.number(),
    totalSpent: z.number(),
  })),
  recentOrders: z.array(orderSchema),
});

// Invoice schema
export const invoiceSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  invoiceNumber: z.string(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  currency: z.string(),
  billingAddress: addressSchema,
  notes: z.string().optional(),
  pdfUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Checkout session schema
export const checkoutSessionSchema = z.object({
  id: z.string(),
  userId: z.string().uuid().optional(),
  items: z.array(cartItemSchema),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().default('USD'),
  expiresAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

// Type exports
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Discount = z.infer<typeof discountSchema>;
export type ShippingInfo = z.infer<typeof shippingInfoSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type Order = z.infer<typeof orderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type RefundOrderInput = z.infer<typeof refundOrderSchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
export type OrderStatistics = z.infer<typeof orderStatisticsSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;