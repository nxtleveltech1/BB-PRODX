-- Materialized Views for Analytics
-- Pre-computed aggregations for fast dashboard queries
-- These views should be refreshed periodically (hourly or daily depending on needs)

-- =============================================================================
-- PRODUCT ANALYTICS
-- =============================================================================

-- Popular products view (refreshed hourly)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_popular_products AS
SELECT
  p.id,
  p.sku,
  p.name,
  p.slug,
  p.price,
  p.original_price,
  p.rating,
  p.reviews_count,
  p.image_url,
  p.in_stock,
  p.stock_count,
  c.name as category_name,
  c.slug as category_slug,
  -- Order metrics (last 30 days)
  COUNT(DISTINCT oi.order_id) as order_count_30d,
  SUM(oi.quantity) as units_sold_30d,
  SUM(oi.subtotal) as revenue_30d,
  -- Engagement metrics
  COUNT(DISTINCT r.id) as review_count,
  COUNT(DISTINCT w.id) as wishlist_count,
  -- Popularity score (weighted combination of factors)
  (
    (COUNT(DISTINCT oi.order_id) * 5) +  -- Orders weight
    (SUM(oi.quantity) * 3) +              -- Units sold weight
    (COUNT(DISTINCT r.id) * 2) +          -- Reviews weight
    (COUNT(DISTINCT w.id) * 1) +          -- Wishlist weight
    (COALESCE(p.rating, 0) * 10)          -- Rating weight
  )::NUMERIC as popularity_score
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
  AND o.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
  AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN reviews r ON p.id = r.product_id
  AND r.is_approved = true
  AND r.is_hidden = false
LEFT JOIN wishlist w ON p.id = w.product_id
GROUP BY p.id, c.id
HAVING p.in_stock = true;

CREATE UNIQUE INDEX ON mv_popular_products (id);
CREATE INDEX ON mv_popular_products (popularity_score DESC);
CREATE INDEX ON mv_popular_products (category_slug, popularity_score DESC);

COMMENT ON MATERIALIZED VIEW mv_popular_products IS 'Pre-computed popular products with engagement metrics (refresh hourly)';

-- =============================================================================
-- CATEGORY ANALYTICS
-- =============================================================================

-- Category performance view
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_category_performance AS
SELECT
  c.id as category_id,
  c.name as category_name,
  c.slug as category_slug,
  -- Product counts
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT p.id) FILTER (WHERE p.in_stock = true) as available_products,
  COUNT(DISTINCT p.id) FILTER (WHERE p.is_featured = true) as featured_products,
  -- Pricing
  AVG(p.price) as avg_price,
  MIN(p.price) as min_price,
  MAX(p.price) as max_price,
  -- Ratings
  AVG(p.rating) as avg_rating,
  SUM(p.reviews_count) as total_reviews,
  -- Sales (last 30 days)
  COUNT(DISTINCT oi.order_id) as orders_30d,
  COALESCE(SUM(oi.quantity), 0) as units_sold_30d,
  COALESCE(SUM(oi.subtotal), 0) as revenue_30d,
  -- Growth (comparing last 30 days to previous 30 days)
  (
    SELECT COALESCE(SUM(oi2.subtotal), 0)
    FROM order_items oi2
    JOIN orders o2 ON oi2.order_id = o2.id
    JOIN products p2 ON oi2.product_id = p2.id
    WHERE p2.category_id = c.id
      AND o2.created_at >= CURRENT_TIMESTAMP - INTERVAL '60 days'
      AND o2.created_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
      AND o2.status NOT IN ('cancelled', 'refunded')
  ) as revenue_previous_30d
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
  AND o.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
  AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY c.id;

CREATE UNIQUE INDEX ON mv_category_performance (category_id);
CREATE INDEX ON mv_category_performance (revenue_30d DESC);

COMMENT ON MATERIALIZED VIEW mv_category_performance IS 'Category performance metrics and trends (refresh daily)';

-- =============================================================================
-- CUSTOMER ANALYTICS
-- =============================================================================

-- Customer lifetime value
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_customer_ltv AS
SELECT
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  u.created_at as customer_since,
  -- Order metrics
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total), 0) as lifetime_value,
  COALESCE(AVG(o.total), 0) as avg_order_value,
  MAX(o.created_at) as last_order_date,
  MIN(o.created_at) as first_order_date,
  -- Engagement metrics
  COUNT(DISTINCT r.id) as reviews_count,
  COUNT(DISTINCT w.id) as wishlist_count,
  COUNT(DISTINCT c.id) as cart_items_count,
  -- Customer status
  CASE
    WHEN MAX(o.created_at) >= CURRENT_TIMESTAMP - INTERVAL '90 days' THEN 'active'
    WHEN MAX(o.created_at) >= CURRENT_TIMESTAMP - INTERVAL '180 days' THEN 'at_risk'
    WHEN MAX(o.created_at) < CURRENT_TIMESTAMP - INTERVAL '180 days' THEN 'dormant'
    ELSE 'new'
  END as customer_status,
  -- RFM Segmentation
  EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - MAX(o.created_at))) / 86400 as recency_days,
  COUNT(DISTINCT o.id) as frequency,
  COALESCE(SUM(o.total), 0) as monetary
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.status NOT IN ('cancelled', 'refunded')
LEFT JOIN reviews r ON u.id = r.user_id
LEFT JOIN wishlist w ON u.id = w.user_id
LEFT JOIN cart c ON u.id = c.user_id
GROUP BY u.id;

CREATE UNIQUE INDEX ON mv_customer_ltv (user_id);
CREATE INDEX ON mv_customer_ltv (lifetime_value DESC);
CREATE INDEX ON mv_customer_ltv (customer_status);
CREATE INDEX ON mv_customer_ltv (last_order_date DESC);

COMMENT ON MATERIALIZED VIEW mv_customer_ltv IS 'Customer lifetime value and segmentation (refresh daily)';

-- =============================================================================
-- SALES ANALYTICS
-- =============================================================================

-- Daily sales summary (last 90 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_sales AS
SELECT
  DATE(o.created_at) as sale_date,
  COUNT(DISTINCT o.id) as order_count,
  COUNT(DISTINCT o.user_id) as customer_count,
  SUM(oi.quantity) as units_sold,
  SUM(o.subtotal) as subtotal,
  SUM(o.tax) as tax,
  SUM(o.shipping) as shipping,
  SUM(o.total) as total_revenue,
  AVG(o.total) as avg_order_value,
  -- Payment status breakdown
  COUNT(*) FILTER (WHERE o.payment_status = 'paid') as paid_orders,
  COUNT(*) FILTER (WHERE o.payment_status = 'pending') as pending_orders,
  COUNT(*) FILTER (WHERE o.payment_status = 'failed') as failed_orders,
  -- Order status breakdown
  COUNT(*) FILTER (WHERE o.status = 'pending') as pending_status,
  COUNT(*) FILTER (WHERE o.status = 'processing') as processing_status,
  COUNT(*) FILTER (WHERE o.status = 'shipped') as shipped_status,
  COUNT(*) FILTER (WHERE o.status = 'delivered') as delivered_status,
  COUNT(*) FILTER (WHERE o.status = 'cancelled') as cancelled_status
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= CURRENT_TIMESTAMP - INTERVAL '90 days'
GROUP BY DATE(o.created_at);

CREATE UNIQUE INDEX ON mv_daily_sales (sale_date DESC);

COMMENT ON MATERIALIZED VIEW mv_daily_sales IS 'Daily sales summary for last 90 days (refresh daily)';

-- =============================================================================
-- INVENTORY ANALYTICS
-- =============================================================================

-- Low stock products alert
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_low_stock_products AS
SELECT
  p.id,
  p.sku,
  p.name,
  p.slug,
  p.stock_count,
  p.price,
  c.name as category_name,
  -- Demand metrics (last 30 days)
  COALESCE(SUM(oi.quantity), 0) as units_sold_30d,
  COALESCE(AVG(oi.quantity), 0) as avg_order_quantity,
  -- Stock status
  CASE
    WHEN p.stock_count = 0 THEN 'out_of_stock'
    WHEN p.stock_count < 5 THEN 'critical'
    WHEN p.stock_count < 10 THEN 'low'
    WHEN p.stock_count < 20 THEN 'warning'
    ELSE 'normal'
  END as stock_status,
  -- Days of inventory remaining (based on 30-day average)
  CASE
    WHEN COALESCE(SUM(oi.quantity), 0) > 0
    THEN (p.stock_count::NUMERIC / (COALESCE(SUM(oi.quantity), 0) / 30.0))::INTEGER
    ELSE NULL
  END as days_inventory_remaining
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
  AND o.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
  AND o.status NOT IN ('cancelled', 'refunded')
WHERE p.in_stock = true AND p.stock_count < 20
GROUP BY p.id, c.id;

CREATE UNIQUE INDEX ON mv_low_stock_products (id);
CREATE INDEX ON mv_low_stock_products (stock_status, units_sold_30d DESC);

COMMENT ON MATERIALIZED VIEW mv_low_stock_products IS 'Low stock products with demand metrics (refresh hourly)';

-- =============================================================================
-- REVIEW ANALYTICS
-- =============================================================================

-- Product review summary
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_product_reviews AS
SELECT
  p.id as product_id,
  p.name as product_name,
  p.slug as product_slug,
  COUNT(r.id) as total_reviews,
  ROUND(AVG(r.rating)::NUMERIC, 2) as avg_rating,
  COUNT(*) FILTER (WHERE r.rating = 5) as rating_5_count,
  COUNT(*) FILTER (WHERE r.rating = 4) as rating_4_count,
  COUNT(*) FILTER (WHERE r.rating = 3) as rating_3_count,
  COUNT(*) FILTER (WHERE r.rating = 2) as rating_2_count,
  COUNT(*) FILTER (WHERE r.rating = 1) as rating_1_count,
  COUNT(*) FILTER (WHERE r.is_verified_purchase = true) as verified_purchase_count,
  COUNT(*) FILTER (WHERE r.business_response IS NOT NULL) as responded_count,
  -- Engagement
  SUM(r.is_helpful) as total_helpful_votes,
  SUM(r.is_not_helpful) as total_not_helpful_votes,
  -- Timing
  MAX(r.created_at) as latest_review_date,
  MIN(r.created_at) as first_review_date
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
  AND r.is_approved = true
  AND r.is_hidden = false
GROUP BY p.id
HAVING COUNT(r.id) > 0;

CREATE UNIQUE INDEX ON mv_product_reviews (product_id);
CREATE INDEX ON mv_product_reviews (avg_rating DESC);
CREATE INDEX ON mv_product_reviews (total_reviews DESC);

COMMENT ON MATERIALIZED VIEW mv_product_reviews IS 'Aggregated product review statistics (refresh hourly)';

-- =============================================================================
-- REFRESH FUNCTIONS
-- =============================================================================

-- Refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS TABLE (view_name TEXT, refreshed_at TIMESTAMP, duration_ms INTEGER) AS $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
BEGIN
  -- Popular products (high frequency)
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_products;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'mv_popular_products'::TEXT, end_time, EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;

  -- Low stock products (high frequency)
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_low_stock_products;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'mv_low_stock_products'::TEXT, end_time, EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;

  -- Product reviews (medium frequency)
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_product_reviews;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'mv_product_reviews'::TEXT, end_time, EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;

  -- Category performance (low frequency)
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_performance;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'mv_category_performance'::TEXT, end_time, EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;

  -- Customer LTV (low frequency)
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_ltv;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'mv_customer_ltv'::TEXT, end_time, EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;

  -- Daily sales (low frequency)
  start_time := clock_timestamp();
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;
  end_time := clock_timestamp();
  RETURN QUERY SELECT 'mv_daily_sales'::TEXT, end_time, EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresh all materialized views with timing information';

-- Quick refresh for high-frequency views (run hourly)
CREATE OR REPLACE FUNCTION refresh_high_frequency_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_products;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_low_stock_products;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_product_reviews;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_high_frequency_views IS 'Refresh high-frequency materialized views (run hourly)';

-- Daily refresh for low-frequency views
CREATE OR REPLACE FUNCTION refresh_daily_views()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_performance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_ltv;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_daily_views IS 'Refresh daily materialized views (run once per day)';
