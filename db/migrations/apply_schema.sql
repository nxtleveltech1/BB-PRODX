-- Better Being Database Schema
-- Applied to Neon PostgreSQL

-- Users table (foundation)
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"name" varchar(255),
	"emailVerified" timestamp,
	"image" varchar(500),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"email_verification_token" varchar(255),
	"password_reset_token" varchar(255),
	"password_reset_expires" timestamp,
	"login_attempts" integer DEFAULT 0,
	"locked_until" timestamp,
	"last_login" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" varchar(255),
	"profile_image_url" varchar(500),
	"date_of_birth" timestamp,
	"gender" varchar(20),
	"marketing_consent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Auth tables
CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);

CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"device_info" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp NOT NULL,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token"),
	CONSTRAINT "user_sessions_refresh_token_unique" UNIQUE("refresh_token")
);

-- Categories
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subcategories_slug_unique" UNIQUE("slug")
);

-- Products
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"long_description" text,
	"price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"rating" numeric(2, 1) DEFAULT '0',
	"reviews_count" integer DEFAULT 0,
	"category_id" integer,
	"subcategory_id" integer,
	"image_url" varchar(500),
	"is_popular" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"in_stock" boolean DEFAULT true,
	"stock_count" integer DEFAULT 0,
	"usage_instructions" text,
	"warnings" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku"),
	"products_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "product_benefits" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"benefit" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "product_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"ingredient" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "product_sizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"size" varchar(50) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	CONSTRAINT "unique_product_size" UNIQUE("product_id","size")
);

CREATE TABLE IF NOT EXISTS "product_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"tag" varchar(50) NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0',
	"shipping" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"shipping_address" jsonb,
	"billing_address" jsonb,
	"payment_method" varchar(50),
	"payment_status" varchar(50) DEFAULT 'pending',
	"stripe_payment_id" varchar(255),
	"tracking_number" varchar(100),
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"customer_notes" text,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);

CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"size" varchar(50),
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"discount_code" varchar(50),
	"subtotal" numeric(10, 2) NOT NULL,
	"product_snapshot" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"comment" text,
	"is_verified_purchase" boolean DEFAULT false,
	"is_helpful" integer DEFAULT 0,
	"is_not_helpful" integer DEFAULT 0,
	"is_approved" boolean DEFAULT true,
	"is_hidden" boolean DEFAULT false,
	"moderation_notes" text,
	"business_response" text,
	"business_response_at" timestamp,
	"images" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_unique_user_product" UNIQUE("user_id","product_id"),
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5)
);

CREATE TABLE IF NOT EXISTS "review_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"is_helpful" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_votes_unique_user_review" UNIQUE("user_id","review_id")
);

-- Cart & Wishlist
CREATE TABLE IF NOT EXISTS "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"size" varchar(50),
	"added_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cart_unique_user_product_size" UNIQUE("user_id","product_id","size")
);

CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"priority" integer DEFAULT 0,
	"notes" varchar(500),
	"added_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_unique_user_product" UNIQUE("user_id","product_id")
);

-- Social
CREATE TABLE IF NOT EXISTS "instagram_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"instagram_id" varchar(100) NOT NULL,
	"shortcode" varchar(50) NOT NULL,
	"caption" text,
	"media_url" varchar(1000) NOT NULL,
	"media_type" varchar(20) NOT NULL,
	"permalink" varchar(500) NOT NULL,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"posted_at" timestamp,
	"last_synced_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instagram_posts_instagram_id_unique" UNIQUE("instagram_id")
);
