-- Database Functions for Neon PostgreSQL
-- Encapsulate common query patterns for better performance and maintainability

-- =============================================================================
-- PRODUCT FUNCTIONS
-- =============================================================================

-- Calculate average rating for a product
CREATE OR REPLACE FUNCTION calculate_product_rating(product_id_param INTEGER)
RETURNS NUMERIC(2,1) AS $$
DECLARE
  avg_rating NUMERIC(2,1);
BEGIN
  SELECT ROUND(AVG(rating)::NUMERIC, 1)
  INTO avg_rating
  FROM reviews
  WHERE product_id = product_id_param
    AND is_approved = true
    AND is_hidden = false;

  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION calculate_product_rating IS 'Calculate average rating for a product from approved reviews';

-- Get product stock status
CREATE OR REPLACE FUNCTION get_product_stock_status(product_id_param INTEGER)
RETURNS TABLE (
  in_stock BOOLEAN,
  stock_count INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.in_stock,
    p.stock_count,
    CASE
      WHEN NOT p.in_stock THEN 'out_of_stock'
      WHEN p.stock_count = 0 THEN 'out_of_stock'
      WHEN p.stock_count < 5 THEN 'low_stock'
      WHEN p.stock_count < 20 THEN 'medium_stock'
      ELSE 'in_stock'
    END as status
  FROM products p
  WHERE p.id = product_id_param;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_product_stock_status IS 'Get detailed stock status for a product';

-- Search products with ranking
CREATE OR REPLACE FUNCTION search_products(search_query TEXT, limit_param INTEGER DEFAULT 20)
RETURNS TABLE (
  id INTEGER,
  name VARCHAR,
  slug VARCHAR,
  price NUMERIC,
  rating NUMERIC,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.price,
    p.rating,
    ts_rank(
      to_tsvector('english', coalesce(p.name, '') || ' ' || coalesce(p.description, '')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM products p
  WHERE
    to_tsvector('english', coalesce(p.name, '') || ' ' || coalesce(p.description, ''))
    @@ plainto_tsquery('english', search_query)
    AND p.in_stock = true
  ORDER BY rank DESC, p.rating DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_products IS 'Full-text search products with relevance ranking';

-- =============================================================================
-- ORDER FUNCTIONS
-- =============================================================================

-- Calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(
  subtotal_param NUMERIC,
  tax_rate_param NUMERIC DEFAULT 0,
  shipping_param NUMERIC DEFAULT 0
)
RETURNS NUMERIC(10,2) AS $$
BEGIN
  RETURN ROUND((subtotal_param + (subtotal_param * tax_rate_param / 100) + shipping_param)::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_order_total IS 'Calculate order total with tax and shipping';

-- Get user order stats
CREATE OR REPLACE FUNCTION get_user_order_stats(user_id_param INTEGER)
RETURNS TABLE (
  total_orders BIGINT,
  total_spent NUMERIC,
  avg_order_value NUMERIC,
  last_order_date TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent,
    COALESCE(AVG(o.total), 0) as avg_order_value,
    MAX(o.created_at) as last_order_date
  FROM orders o
  WHERE o.user_id = user_id_param
    AND o.status != 'cancelled';
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_order_stats IS 'Get order statistics for a user';

-- =============================================================================
-- REVIEW FUNCTIONS
-- =============================================================================

-- Get review stats for product
CREATE OR REPLACE FUNCTION get_product_review_stats(product_id_param INTEGER)
RETURNS TABLE (
  total_reviews BIGINT,
  avg_rating NUMERIC,
  rating_5 BIGINT,
  rating_4 BIGINT,
  rating_3 BIGINT,
  rating_2 BIGINT,
  rating_1 BIGINT,
  verified_purchases BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_reviews,
    ROUND(AVG(r.rating)::NUMERIC, 1) as avg_rating,
    COUNT(*) FILTER (WHERE r.rating = 5)::BIGINT as rating_5,
    COUNT(*) FILTER (WHERE r.rating = 4)::BIGINT as rating_4,
    COUNT(*) FILTER (WHERE r.rating = 3)::BIGINT as rating_3,
    COUNT(*) FILTER (WHERE r.rating = 2)::BIGINT as rating_2,
    COUNT(*) FILTER (WHERE r.rating = 1)::BIGINT as rating_1,
    COUNT(*) FILTER (WHERE r.is_verified_purchase = true)::BIGINT as verified_purchases
  FROM reviews r
  WHERE r.product_id = product_id_param
    AND r.is_approved = true
    AND r.is_hidden = false;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_product_review_stats IS 'Get comprehensive review statistics for a product';

-- =============================================================================
-- CART FUNCTIONS
-- =============================================================================

-- Get cart total for user
CREATE OR REPLACE FUNCTION get_cart_total(user_id_param INTEGER)
RETURNS NUMERIC(10,2) AS $$
DECLARE
  cart_total NUMERIC(10,2);
BEGIN
  SELECT COALESCE(SUM(p.price * c.quantity), 0)
  INTO cart_total
  FROM cart c
  JOIN products p ON c.product_id = p.id
  WHERE c.user_id = user_id_param;

  RETURN cart_total;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_cart_total IS 'Calculate total value of items in user cart';

-- Get cart item count for user
CREATE OR REPLACE FUNCTION get_cart_item_count(user_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  item_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(quantity), 0)::INTEGER
  INTO item_count
  FROM cart
  WHERE user_id = user_id_param;

  RETURN item_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_cart_item_count IS 'Get total number of items in user cart';

-- =============================================================================
-- ANALYTICS FUNCTIONS
-- =============================================================================

-- Get trending products (based on recent orders)
CREATE OR REPLACE FUNCTION get_trending_products(days_param INTEGER DEFAULT 7, limit_param INTEGER DEFAULT 10)
RETURNS TABLE (
  product_id INTEGER,
  product_name VARCHAR,
  product_slug VARCHAR,
  order_count BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as product_id,
    p.name as product_name,
    p.slug as product_slug,
    COUNT(oi.id)::BIGINT as order_count,
    SUM(oi.subtotal) as revenue
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  JOIN orders o ON oi.order_id = o.id
  WHERE o.created_at >= CURRENT_TIMESTAMP - (days_param || ' days')::INTERVAL
    AND o.status NOT IN ('cancelled', 'refunded')
  GROUP BY p.id, p.name, p.slug
  ORDER BY order_count DESC, revenue DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_trending_products IS 'Get trending products based on recent orders';

-- Get category sales stats
CREATE OR REPLACE FUNCTION get_category_sales_stats(days_param INTEGER DEFAULT 30)
RETURNS TABLE (
  category_id INTEGER,
  category_name VARCHAR,
  total_orders BIGINT,
  total_revenue NUMERIC,
  avg_order_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as category_id,
    c.name as category_name,
    COUNT(DISTINCT o.id)::BIGINT as total_orders,
    COALESCE(SUM(oi.subtotal), 0) as total_revenue,
    COALESCE(AVG(o.total), 0) as avg_order_value
  FROM categories c
  LEFT JOIN products p ON c.id = p.category_id
  LEFT JOIN order_items oi ON p.id = oi.product_id
  LEFT JOIN orders o ON oi.order_id = o.id AND o.created_at >= CURRENT_TIMESTAMP - (days_param || ' days')::INTERVAL
  WHERE o.status NOT IN ('cancelled', 'refunded') OR o.id IS NULL
  GROUP BY c.id, c.name
  ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_category_sales_stats IS 'Get sales statistics by category';

-- =============================================================================
-- MAINTENANCE FUNCTIONS
-- =============================================================================

-- Update product ratings (batch update)
CREATE OR REPLACE FUNCTION update_all_product_ratings()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  WITH rating_updates AS (
    SELECT
      product_id,
      ROUND(AVG(rating)::NUMERIC, 1) as avg_rating,
      COUNT(*)::INTEGER as review_count
    FROM reviews
    WHERE is_approved = true AND is_hidden = false
    GROUP BY product_id
  )
  UPDATE products p
  SET
    rating = COALESCE(ru.avg_rating, 0),
    reviews_count = COALESCE(ru.review_count, 0)
  FROM rating_updates ru
  WHERE p.id = ru.product_id;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_all_product_ratings IS 'Batch update product ratings from reviews (run periodically)';

-- Clean up old cart items
CREATE OR REPLACE FUNCTION cleanup_old_cart_items(days_param INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart
  WHERE updated_at < CURRENT_TIMESTAMP - (days_param || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_cart_items IS 'Remove cart items older than specified days';

-- Clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < CURRENT_TIMESTAMP;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_sessions IS 'Remove expired user sessions';
