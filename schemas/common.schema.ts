import { z } from 'zod';

// Common UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Common email validation
export const emailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

// Common URL validation
export const urlSchema = z.string().url('Invalid URL format');

// Common phone number validation
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

// Common date validation
export const dateSchema = z.string().datetime('Invalid date format');

// Common currency code validation
export const currencySchema = z.string()
  .length(3, 'Currency code must be 3 characters')
  .toUpperCase();

// Common country code validation (ISO 3166-1 alpha-2)
export const countryCodeSchema = z.string()
  .length(2, 'Country code must be 2 characters')
  .toUpperCase();

// Common language code validation (ISO 639-1)
export const languageCodeSchema = z.string()
  .length(2, 'Language code must be 2 characters')
  .toLowerCase();

// Common slug validation
export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(200, 'Slug must be less than 200 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only');

// Common pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  total: z.number().int().min(0).optional(),
  totalPages: z.number().int().min(0).optional(),
});

// Common query pagination schema (for URL params)
export const queryPaginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
});

// Common sort schema
export const sortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

// Common query sort schema (for URL params)
export const querySortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Common date range schema
export const dateRangeSchema = z.object({
  from: dateSchema,
  to: dateSchema,
}).refine((data) => new Date(data.from) <= new Date(data.to), {
  message: 'From date must be before or equal to to date',
  path: ['to'],
});

// Common query date range schema (for URL params)
export const queryDateRangeSchema = z.object({
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
}).refine((data) => {
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: 'From date must be before or equal to to date',
  path: ['dateTo'],
});

// Common price range schema
export const priceRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().positive(),
}).refine((data) => data.min <= data.max, {
  message: 'Minimum price must be less than or equal to maximum price',
  path: ['max'],
});

// Common query price range schema (for URL params)
export const queryPriceRangeSchema = z.object({
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().positive()).optional(),
}).refine((data) => {
  if (data.minPrice !== undefined && data.maxPrice !== undefined) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: 'Minimum price must be less than or equal to maximum price',
  path: ['maxPrice'],
});

// Common image upload schema
export const imageUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type),
    'File must be an image (JPEG, PNG, WebP, or AVIF)'
  ),
  alt: z.string().max(200, 'Alt text must be less than 200 characters').optional(),
  caption: z.string().max(500, 'Caption must be less than 500 characters').optional(),
});

// Common file upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'File size must be less than 10MB'
  ),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Common metadata schema
export const metadataSchema = z.record(z.any());

// Common search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200, 'Search query is too long'),
  filters: z.record(z.any()).optional(),
  ...queryPaginationSchema.shape,
  ...querySortSchema.shape,
});

// Common ID list schema
export const idListSchema = z.object({
  ids: z.array(uuidSchema).min(1, 'At least one ID is required'),
});

// Common bulk action schema
export const bulkActionSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  ids: z.array(uuidSchema).min(1, 'At least one ID is required'),
  params: z.record(z.any()).optional(),
});

// Common response wrapper schemas
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: paginationSchema,
    message: z.string().optional(),
  });

// Common health check schema
export const healthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: dateSchema,
  version: z.string().optional(),
  uptime: z.number().optional(),
  services: z.record(z.object({
    status: z.enum(['up', 'down']),
    message: z.string().optional(),
    latency: z.number().optional(),
  })).optional(),
});

// Common webhook payload schema
export const webhookPayloadSchema = z.object({
  id: uuidSchema,
  event: z.string(),
  timestamp: dateSchema,
  data: z.record(z.any()),
  signature: z.string().optional(),
});

// Common notification schema
export const notificationSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  type: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().max(200),
  message: z.string().max(1000),
  read: z.boolean().default(false),
  actionUrl: urlSchema.optional(),
  actionLabel: z.string().max(50).optional(),
  createdAt: dateSchema,
  readAt: dateSchema.optional(),
});

// Common audit log schema
export const auditLogSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema.optional(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  changes: z.record(z.object({
    old: z.any(),
    new: z.any(),
  })).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: dateSchema,
});

// Common feature flag schema
export const featureFlagSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
  rolloutPercentage: z.number().min(0).max(100).optional(),
  userGroups: z.array(z.string()).optional(),
  metadata: metadataSchema.optional(),
});

// Type exports
export type Pagination = z.infer<typeof paginationSchema>;
export type QueryPagination = z.infer<typeof queryPaginationSchema>;
export type Sort = z.infer<typeof sortSchema>;
export type QuerySort = z.infer<typeof querySortSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type QueryDateRange = z.infer<typeof queryDateRangeSchema>;
export type PriceRange = z.infer<typeof priceRangeSchema>;
export type QueryPriceRange = z.infer<typeof queryPriceRangeSchema>;
export type ImageUpload = z.infer<typeof imageUploadSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type Search = z.infer<typeof searchSchema>;
export type IdList = z.infer<typeof idListSchema>;
export type BulkAction = z.infer<typeof bulkActionSchema>;
export type HealthCheck = z.infer<typeof healthCheckSchema>;
export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type FeatureFlag = z.infer<typeof featureFlagSchema>;