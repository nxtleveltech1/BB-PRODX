-- Additional Performance Indexes for Neon PostgreSQL
-- These indexes complement the ones created by Drizzle migrations
-- Optimized for common query patterns in the Better Being application

-- =============================================================================
-- FULL-TEXT SEARCH INDEXES
-- =============================================================================

-- Products full-text search
-- Combines name, description, and long_description for comprehensive search
CREATE INDEX IF NOT EXISTS products_search_idx ON products
USING GIN (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(long_description, ''))
);

-- Categories full-text search
CREATE INDEX IF NOT EXISTS categories_search_idx ON categories
USING GIN (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- =============================================================================
-- COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =============================================================================

-- Products: Popular + In Stock (for homepage featured products)
CREATE INDEX IF NOT EXISTS products_featured_available_idx ON products (is_featured, in_stock, rating DESC)
WHERE is_featured = true AND in_stock = true;

-- Products: Category + Price Range (for category browsing with filters)
CREATE INDEX IF NOT EXISTS products_category_price_idx ON products (category_id, price, rating DESC)
WHERE in_stock = true;

-- Products: Search + Stock (for filtered product searches)
CREATE INDEX IF NOT EXISTS products_stock_created_idx ON products (in_stock, created_at DESC);

-- Orders: User + Status + Date (for order history)
CREATE INDEX IF NOT EXISTS orders_user_history_idx ON orders (user_id, created_at DESC, status);

-- Reviews: Product + Approved + Rating (for product review display)
CREATE INDEX IF NOT EXISTS reviews_product_display_idx ON reviews (product_id, is_approved, rating DESC, created_at DESC)
WHERE is_approved = true AND is_hidden = false;

-- Cart: User + Updated (for cart retrieval and abandonment tracking)
CREATE INDEX IF NOT EXISTS cart_user_updated_idx ON cart (user_id, updated_at DESC);

-- =============================================================================
-- PARTIAL INDEXES FOR EFFICIENCY
-- =============================================================================

-- Active user sessions only (reduces index size significantly)
CREATE INDEX IF NOT EXISTS user_sessions_active_idx ON user_sessions (user_id, expires_at)
WHERE is_active = true;

-- Pending orders only (for admin dashboard)
CREATE INDEX IF NOT EXISTS orders_pending_idx ON orders (created_at DESC)
WHERE status = 'pending' OR status = 'processing';

-- Low stock products (for inventory alerts)
CREATE INDEX IF NOT EXISTS products_low_stock_idx ON products (stock_count, sku)
WHERE in_stock = true AND stock_count < 10;

-- Unapproved reviews (for moderation queue)
CREATE INDEX IF NOT EXISTS reviews_moderation_idx ON reviews (created_at DESC)
WHERE is_approved = false OR is_hidden = true;

-- =============================================================================
-- COVERING INDEXES FOR COMMON READ PATTERNS
-- =============================================================================

-- Product listing with essential data (reduces table lookups)
CREATE INDEX IF NOT EXISTS products_listing_idx ON products (category_id, subcategory_id, is_featured, rating DESC)
INCLUDE (name, slug, price, original_price, image_url, in_stock);

-- Order summary data (for order lists without JOIN)
CREATE INDEX IF NOT EXISTS orders_summary_idx ON orders (user_id, created_at DESC)
INCLUDE (order_number, status, total, payment_status);

-- =============================================================================
-- EXPRESSION INDEXES FOR COMPUTED VALUES
-- =============================================================================

-- Discount percentage (for promotions and sorting)
CREATE INDEX IF NOT EXISTS products_discount_pct_idx ON products (
  CASE
    WHEN original_price IS NOT NULL AND original_price > 0
    THEN ((original_price - price) / original_price * 100)::integer
    ELSE 0
  END DESC
)
WHERE original_price IS NOT NULL AND original_price > price;

-- =============================================================================
-- BTREE INDEXES FOR SORTING AND RANGE QUERIES
-- =============================================================================

-- Product price range queries
CREATE INDEX IF NOT EXISTS products_price_range_idx ON products (price)
WHERE in_stock = true;

-- Recent products (for "new arrivals")
CREATE INDEX IF NOT EXISTS products_recent_idx ON products (created_at DESC)
WHERE in_stock = true;

-- Order date range queries
CREATE INDEX IF NOT EXISTS orders_date_range_idx ON orders (created_at)
WHERE status != 'cancelled';

-- =============================================================================
-- ANALYSIS AND MAINTENANCE
-- =============================================================================

-- Update table statistics for query planner
ANALYZE products;
ANALYZE orders;
ANALYZE reviews;
ANALYZE cart;
ANALYZE categories;
ANALYZE users;

-- Vacuum analyze to clean up and update stats
VACUUM ANALYZE products;
VACUUM ANALYZE orders;

COMMENT ON INDEX products_search_idx IS 'Full-text search on products (name + description)';
COMMENT ON INDEX products_featured_available_idx IS 'Optimized for homepage featured product queries';
COMMENT ON INDEX products_category_price_idx IS 'Category browsing with price filtering';
COMMENT ON INDEX reviews_product_display_idx IS 'Product review display with filtering';
COMMENT ON INDEX products_listing_idx IS 'Covering index for product listing pages';
