import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  check,
  unique,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './user';
import { products } from './product';

// Product reviews table
export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),

    // Review content
    rating: integer('rating').notNull(),
    title: varchar('title', { length: 255 }),
    comment: text('comment'),

    // Review metadata
    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    isHelpful: integer('is_helpful').default(0), // Count of helpful votes
    isNotHelpful: integer('is_not_helpful').default(0), // Count of not helpful votes

    // Moderation
    isApproved: boolean('is_approved').default(true), // Auto-approve by default
    isHidden: boolean('is_hidden').default(false), // Admin can hide inappropriate reviews
    moderationNotes: text('moderation_notes'),

    // Response from business (optional)
    businessResponse: text('business_response'),
    businessResponseAt: timestamp('business_response_at'),

    // Images (URLs stored as array in JSONB)
    images: jsonb('images').$type<string[]>(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Check constraint for rating range
    ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),

    // Unique constraint: one review per user per product
    uniqueUserProduct: unique('reviews_unique_user_product').on(
      table.userId,
      table.productId
    ),

    // Indexes for queries
    productIdIdx: index('reviews_product_id_idx').on(table.productId),
    userIdIdx: index('reviews_user_id_idx').on(table.userId),
    ratingIdx: index('reviews_rating_idx').on(table.rating),
    isApprovedIdx: index('reviews_is_approved_idx').on(table.isApproved),
    createdAtIdx: index('reviews_created_at_idx').on(table.createdAt),
    // Compound indexes for common queries
    productRatingIdx: index('reviews_product_rating_idx').on(
      table.productId,
      table.rating
    ),
    productApprovedIdx: index('reviews_product_approved_idx').on(
      table.productId,
      table.isApproved
    ),
  })
);

// Review helpfulness votes table (tracks who voted on each review)
export const reviewVotes = pgTable(
  'review_votes',
  {
    id: serial('id').primaryKey(),
    reviewId: integer('review_id')
      .references(() => reviews.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    isHelpful: boolean('is_helpful').notNull(), // true = helpful, false = not helpful

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: one vote per user per review
    uniqueUserReview: unique('review_votes_unique_user_review').on(
      table.userId,
      table.reviewId
    ),
    // Indexes
    reviewIdIdx: index('review_votes_review_id_idx').on(table.reviewId),
    userIdIdx: index('review_votes_user_id_idx').on(table.userId),
  })
);

// Define relations
export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  votes: many(reviewVotes),
}));

export const reviewVotesRelations = relations(reviewVotes, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewVotes.reviewId],
    references: [reviews.id],
  }),
  user: one(users, {
    fields: [reviewVotes.userId],
    references: [users.id],
  }),
}));

// Import jsonb type
import { jsonb } from 'drizzle-orm/pg-core';

// Type exports
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type ReviewVote = typeof reviewVotes.$inferSelect;
export type NewReviewVote = typeof reviewVotes.$inferInsert;

// Helper interfaces
export interface ReviewWithUser extends Review {
  user: {
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  isVerifiedPurchase: boolean;
  helpfulCount: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchaseCount: number;
}