import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table with comprehensive auth and profile fields
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }), // Optional for OAuth users

    // NextAuth required fields
    name: varchar('name', { length: 255 }), // Full name for NextAuth
    emailVerified: timestamp('emailVerified', { mode: 'date' }), // NextAuth naming
    image: varchar('image', { length: 500 }), // Profile image URL for NextAuth

    // Additional profile fields
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    phone: varchar('phone', { length: 20 }),

    // User role for authorization
    role: varchar('role', { length: 50 }).default('user').notNull(),

    // Email verification (legacy support)
    emailVerificationToken: varchar('email_verification_token', { length: 255 }),

    // Password reset
    passwordResetToken: varchar('password_reset_token', { length: 255 }),
    passwordResetExpires: timestamp('password_reset_expires'),

    // Account security
    loginAttempts: integer('login_attempts').default(0),
    lockedUntil: timestamp('locked_until'),
    lastLogin: timestamp('last_login'),

    // Two-factor authentication
    twoFactorEnabled: boolean('two_factor_enabled').default(false),
    twoFactorSecret: varchar('two_factor_secret', { length: 255 }),

    // Profile information (legacy)
    profileImageUrl: varchar('profile_image_url', { length: 500 }), // Duplicate of image for backward compatibility
    dateOfBirth: timestamp('date_of_birth'),
    gender: varchar('gender', { length: 20 }),

    // Preferences
    marketingConsent: boolean('marketing_consent').default(false),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for query performance
    emailIdx: index('users_email_idx').on(table.email),
    phoneIdx: index('users_phone_idx').on(table.phone),
    emailVerifiedIdx: index('users_email_verified_idx').on(table.emailVerified),
    createdAtIdx: index('users_created_at_idx').on(table.createdAt),
  })
);

// User sessions for JWT refresh tokens and device tracking
export const userSessions = pgTable(
  'user_sessions',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    sessionToken: varchar('session_token', { length: 255 }).unique().notNull(),
    refreshToken: varchar('refresh_token', { length: 255 }).unique().notNull(),

    // Device and connection info
    deviceInfo: jsonb('device_info'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),

    // Session management
    isActive: boolean('is_active').default(true),
    expiresAt: timestamp('expires_at').notNull(),
    lastActivity: timestamp('last_activity').defaultNow(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // Indexes for session management
    userIdIdx: index('user_sessions_user_id_idx').on(table.userId),
    sessionTokenIdx: index('user_sessions_session_token_idx').on(table.sessionToken),
    refreshTokenIdx: index('user_sessions_refresh_token_idx').on(table.refreshToken),
    expiresAtIdx: index('user_sessions_expires_at_idx').on(table.expiresAt),
    isActiveIdx: index('user_sessions_is_active_idx').on(table.isActive),
  })
);

// Define relations
// Note: Related tables are imported lazily to avoid circular dependencies
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(userSessions),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;