-- Data Integrity Constraints Migration
-- Adds comprehensive business logic constraints and validation rules

-- Users Table Constraints
ALTER TABLE users ADD CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT chk_users_phone_format CHECK (phone IS NULL OR phone ~ '^[\d\s\-\(\)\+]+$');
ALTER TABLE users ADD CONSTRAINT chk_users_login_attempts CHECK (login_attempts >= 0);

-- Products Table Constraints
ALTER TABLE products ADD CONSTRAINT chk_products_price_positive CHECK (price >= 0);
ALTER TABLE products ADD CONSTRAINT chk_products_original_price_positive CHECK (original_price IS NULL OR original_price >= 0);
ALTER TABLE products ADD CONSTRAINT chk_products_rating_range CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE products ADD CONSTRAINT chk_products_reviews_count CHECK (reviews_count >= 0);
ALTER TABLE products ADD CONSTRAINT chk_products_stock_count CHECK (stock_count >= 0);
ALTER TABLE products ADD CONSTRAINT chk_products_sku_format CHECK (sku ~ '^[A-Z0-9\-]+$');

-- Categories and Subcategories Constraints
ALTER TABLE categories ADD CONSTRAINT chk_categories_slug_format CHECK (slug ~ '^[a-z0-9\-]+$');
ALTER TABLE subcategories ADD CONSTRAINT chk_subcategories_slug_format CHECK (slug ~ '^[a-z0-9\-]+$');

-- Orders Table Constraints
ALTER TABLE orders ADD CONSTRAINT chk_orders_subtotal_positive CHECK (subtotal >= 0);
ALTER TABLE orders ADD CONSTRAINT chk_orders_tax_positive CHECK (tax >= 0);
ALTER TABLE orders ADD CONSTRAINT chk_orders_shipping_positive CHECK (shipping >= 0);
ALTER TABLE orders ADD CONSTRAINT chk_orders_total_positive CHECK (total >= 0);
ALTER TABLE orders ADD CONSTRAINT chk_orders_status_valid CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));
ALTER TABLE orders ADD CONSTRAINT chk_orders_order_number_format CHECK (order_number ~ '^ORD-[0-9]{8}-[0-9]{6}$');

-- Order Items Table Constraints
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_price_positive CHECK (price >= 0);
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_total_price_positive CHECK (total_price >= 0);

-- Cart Table Constraints
ALTER TABLE cart ADD CONSTRAINT chk_cart_quantity_positive CHECK (quantity > 0);
ALTER TABLE cart ADD CONSTRAINT chk_cart_unique_user_product_size CHECK (
  (user_id IS NOT NULL AND session_id IS NULL) OR 
  (user_id IS NULL AND session_id IS NOT NULL)
);

-- Wishlist Table Constraints
ALTER TABLE wishlist ADD CONSTRAINT chk_wishlist_unique_user_product CHECK (user_id IS NOT NULL);

-- Reviews Table Constraints
ALTER TABLE reviews ADD CONSTRAINT chk_reviews_rating_range CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE reviews ADD CONSTRAINT chk_reviews_helpful_count CHECK (helpful_count >= 0);
ALTER TABLE reviews ADD CONSTRAINT chk_reviews_unhelpful_count CHECK (unhelpful_count >= 0);

-- Loyalty Program Constraints
ALTER TABLE loyalty_points ADD CONSTRAINT chk_loyalty_points_positive CHECK (points > 0);
ALTER TABLE loyalty_points ADD CONSTRAINT chk_loyalty_points_type_valid CHECK (type IN ('earned', 'redeemed', 'expired', 'transferred'));
ALTER TABLE loyalty_rewards ADD CONSTRAINT chk_loyalty_rewards_points_positive CHECK (points_required > 0);
ALTER TABLE loyalty_redemptions ADD CONSTRAINT chk_loyalty_redemptions_points_positive CHECK (points_spent > 0);
ALTER TABLE loyalty_redemptions ADD CONSTRAINT chk_loyalty_redemptions_status_valid CHECK (status IN ('pending', 'fulfilled', 'cancelled'));

-- Promo Codes Constraints
ALTER TABLE promo_codes ADD CONSTRAINT chk_promo_codes_discount_positive CHECK (discount_value > 0);
ALTER TABLE promo_codes ADD CONSTRAINT chk_promo_codes_minimum_purchase_positive CHECK (minimum_purchase IS NULL OR minimum_purchase >= 0);
ALTER TABLE promo_codes ADD CONSTRAINT chk_promo_codes_usage_limit_positive CHECK (usage_limit IS NULL OR usage_limit > 0);
ALTER TABLE promo_codes ADD CONSTRAINT chk_promo_codes_usage_count_positive CHECK (usage_count >= 0);
ALTER TABLE promo_codes ADD CONSTRAINT chk_promo_codes_code_format CHECK (code ~ '^[A-Z0-9]+$');

-- Stock Reservations Constraints
ALTER TABLE stock_reservations ADD CONSTRAINT chk_stock_reservations_quantity_positive CHECK (quantity > 0);

-- User Sessions Constraints
ALTER TABLE user_sessions ADD CONSTRAINT chk_user_sessions_expires_future CHECK (expires_at > created_at);

-- Subscription Constraints (from Phase 3)
ALTER TABLE subscription_plans ADD CONSTRAINT chk_subscription_plans_price_positive CHECK (price >= 0);
ALTER TABLE subscription_plans ADD CONSTRAINT chk_subscription_plans_interval_valid CHECK (billing_interval IN ('monthly', 'quarterly', 'yearly'));
ALTER TABLE user_subscriptions ADD CONSTRAINT chk_user_subscriptions_period_valid CHECK (current_period_end > current_period_start);

-- Advanced Validation Functions
CREATE OR REPLACE FUNCTION validate_email_domain(email TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|protonmail\.com|betterbeing\.com)$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION validate_phone_international(phone TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~ '^\+[1-9][0-9]{0,3}[0-9]{4,14}$' OR phone IS NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add validation comments for documentation
COMMENT ON CONSTRAINT chk_users_email_format ON users IS 'Ensures email addresses follow standard format';
COMMENT ON CONSTRAINT chk_products_price_positive ON products IS 'Ensures product prices are non-negative';
COMMENT ON CONSTRAINT chk_orders_status_valid ON orders IS 'Validates order status against allowed values';
COMMENT ON CONSTRAINT chk_reviews_rating_range ON reviews IS 'Ensures review ratings are between 1 and 5';

-- Create validation report view
CREATE OR REPLACE VIEW data_validation_report AS
SELECT 
  'users' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN 1 END) as invalid_emails,
  COUNT(CASE WHEN phone IS NOT NULL AND phone !~ '^[\d\s\-\(\)\+]+$' THEN 1 END) as invalid_phones
FROM users
UNION ALL
SELECT 
  'products',
  COUNT(*),
  COUNT(CASE WHEN price < 0 THEN 1 END),
  COUNT(CASE WHEN rating < 0 OR rating > 5 THEN 1 END)
FROM products
UNION ALL
SELECT 
  'orders', 
  COUNT(*),
  COUNT(CASE WHEN status NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') THEN 1 END),
  COUNT(CASE WHEN total < 0 THEN 1 END)
FROM orders;

-- Update statistics after constraint additions
ANALYZE users;
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE cart;
ANALYZE reviews;
ANALYZE loyalty_points;
ANALYZE promo_codes;