import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['admin', 'user', 'moderator', 'guest']);

// User status enum
export const userStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending']);

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required').max(200),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
  isDefault: z.boolean().optional().default(false),
  type: z.enum(['shipping', 'billing', 'both']).optional().default('both'),
});

// User preferences schema
export const userPreferencesSchema = z.object({
  newsletter: z.boolean().default(false),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    sms: z.boolean().default(false),
  }).default({
    email: true,
    push: false,
    sms: false,
  }),
  marketing: z.object({
    email: z.boolean().default(false),
    sms: z.boolean().default(false),
  }).default({
    email: false,
    sms: false,
  }),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

// Base user schema (shared fields)
const baseUserSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  firstName: z.string().min(1, 'First name is required').max(100).trim(),
  lastName: z.string().min(1, 'Last name is required').max(100).trim(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  role: userRoleSchema.default('user'),
  status: userStatusSchema.default('pending'),
  avatarUrl: z.string().url('Invalid avatar URL').nullable().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').nullable().optional(),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .nullable()
    .optional(),
  dateOfBirth: z.string().datetime().nullable().optional(),
  emailVerified: z.boolean().default(false),
  emailVerifiedAt: z.string().datetime().nullable().optional(),
  twoFactorEnabled: z.boolean().default(false),
  preferences: userPreferencesSchema.optional(),
  addresses: z.array(addressSchema).optional().default([]),
  metadata: z.record(z.any()).optional().default({}),
});

// Create user schema (for registration/admin creation)
export const createUserSchema = baseUserSchema.extend({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

// User schema (for database/API responses)
export const userSchema = baseUserSchema.extend({
  id: z.string().uuid('Invalid user ID'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().nullable().optional(),
  lastActivityAt: z.string().datetime().nullable().optional(),
  passwordChangedAt: z.string().datetime().nullable().optional(),
  deletedAt: z.string().datetime().nullable().optional(),
});

// Update user schema (for profile updates)
export const updateUserSchema = baseUserSchema.partial().omit({
  email: true, // Email changes require separate verification flow
  role: true, // Role changes require admin privileges
  status: true, // Status changes require admin privileges
  emailVerified: true, // Cannot be directly updated by user
  emailVerifiedAt: true, // Cannot be directly updated by user
});

// Admin update user schema (allows more fields to be updated)
export const adminUpdateUserSchema = baseUserSchema.partial().extend({
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  emailVerified: z.boolean().optional(),
  forcePasswordReset: z.boolean().optional(),
  locked: z.boolean().optional(),
  lockedUntil: z.string().datetime().nullable().optional(),
});

// User list query schema
export const userListQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'email', 'firstName', 'lastName', 'lastLoginAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  includeDeleted: z.boolean().optional().default(false),
});

// User statistics schema
export const userStatisticsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  newUsersToday: z.number(),
  newUsersThisWeek: z.number(),
  newUsersThisMonth: z.number(),
  verifiedUsers: z.number(),
  twoFactorEnabledUsers: z.number(),
  usersByRole: z.record(userRoleSchema, z.number()),
  usersByStatus: z.record(userStatusSchema, z.number()),
  averageSessionDuration: z.number().optional(),
  dailyActiveUsers: z.number().optional(),
  monthlyActiveUsers: z.number().optional(),
});

// User activity schema
export const userActivitySchema = z.object({
  userId: z.string().uuid(),
  action: z.string(),
  timestamp: z.string().datetime(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// User session schema
export const userSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.string(),
  refreshToken: z.string().optional(),
  ipAddress: z.string(),
  userAgent: z.string(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  lastActivityAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});

// Export request schema
export const userDataExportSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  includeActivity: z.boolean().default(true),
  includeSessions: z.boolean().default(true),
  includePreferences: z.boolean().default(true),
  includeAddresses: z.boolean().default(true),
});

// Type exports
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type Address = z.infer<typeof addressSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type UserStatistics = z.infer<typeof userStatisticsSchema>;
export type UserActivity = z.infer<typeof userActivitySchema>;
export type UserSession = z.infer<typeof userSessionSchema>;
export type UserDataExportRequest = z.infer<typeof userDataExportSchema>;