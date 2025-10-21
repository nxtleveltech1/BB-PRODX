import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  index,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Instagram Posts table - cached social media content
export const instagramPosts = pgTable(
  'instagram_posts',
  {
    id: serial('id').primaryKey(),
    instagramId: varchar('instagram_id', { length: 100 }).unique().notNull(),
    shortcode: varchar('shortcode', { length: 50 }).notNull(),
    caption: text('caption'),
    mediaUrl: varchar('media_url', { length: 1000 }).notNull(),
    mediaType: varchar('media_type', { length: 20 }).notNull(), // IMAGE, VIDEO, CAROUSEL_ALBUM
    permalink: varchar('permalink', { length: 500 }).notNull(),

    // Engagement metrics
    likes: integer('likes').default(0),
    comments: integer('comments').default(0),

    // Instagram metadata
    postedAt: timestamp('posted_at'),

    // Cache management
    lastSyncedAt: timestamp('last_synced_at').defaultNow().notNull(),
    isActive: boolean('is_active').default(true),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    instagramIdIdx: index('instagram_posts_instagram_id_idx').on(table.instagramId),
    shortcodeIdx: index('instagram_posts_shortcode_idx').on(table.shortcode),
    postedAtIdx: index('instagram_posts_posted_at_idx').on(table.postedAt),
    isActiveIdx: index('instagram_posts_is_active_idx').on(table.isActive),
    lastSyncedAtIdx: index('instagram_posts_last_synced_at_idx').on(table.lastSyncedAt),
  })
);

// Type exports
export type InstagramPost = typeof instagramPosts.$inferSelect;
export type NewInstagramPost = typeof instagramPosts.$inferInsert;
