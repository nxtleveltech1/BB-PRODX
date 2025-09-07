-- Phase 3 Enterprise Features Migration
-- Adds subscription billing, advanced analytics, and wishlist enhancements

-- Subscription Billing Tables
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_interval VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  trial_period_days INTEGER DEFAULT 0,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'paused'
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

CREATE TABLE IF NOT EXISTS subscription_invoices (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  due_date TIMESTAMP,
  paid_at TIMESTAMP,
  stripe_invoice_id VARCHAR(255),
  invoice_pdf_url TEXT,
  hosted_invoice_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Advanced Analytics Tables
CREATE TABLE IF NOT EXISTS user_behavior_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL, -- 'page_view', 'product_view', 'add_to_cart', 'purchase', 'search'
  event_data JSONB DEFAULT '{}',
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  url_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_analytics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  add_to_carts INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE TABLE IF NOT EXISTS category_analytics (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  product_views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, date)
);

-- Wishlist Enhancements
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS desired_quantity INTEGER DEFAULT 1;
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS wishlist_shared (
  id SERIAL PRIMARY KEY,
  wishlist_id INTEGER REFERENCES wishlist(id) ON DELETE CASCADE,
  shared_by_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  shared_with_email VARCHAR(255) NOT NULL,
  share_token VARCHAR(255) UNIQUE NOT NULL,
  can_edit BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wishlist_id, shared_with_email)
);

-- Advanced Search Optimization
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_products_weight ON products(weight);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status ON user_subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period ON user_subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_behavior_events_user_event ON user_behavior_events(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_behavior_events_product_event ON user_behavior_events(product_id, event_type);
CREATE INDEX IF NOT EXISTS idx_behavior_events_date ON user_behavior_events(created_at);

-- Data Integrity Constraints
ALTER TABLE subscription_plans ADD CONSTRAINT chk_subscription_price_positive CHECK (price >= 0);
ALTER TABLE user_subscriptions ADD CONSTRAINT chk_subscription_status_valid CHECK (status IN ('active', 'canceled', 'past_due', 'paused', 'trialing'));
ALTER TABLE subscription_invoices ADD CONSTRAINT chk_invoice_amount_positive CHECK (amount_due >= 0 AND amount_paid >= 0);
ALTER TABLE subscription_invoices ADD CONSTRAINT chk_invoice_status_valid CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible'));
ALTER TABLE wishlist ADD CONSTRAINT chk_wishlist_priority_range CHECK (priority >= 0 AND priority <= 10);
ALTER TABLE wishlist ADD CONSTRAINT chk_wishlist_quantity_positive CHECK (desired_quantity > 0);

-- Insert Sample Subscription Plans
INSERT INTO subscription_plans (name, slug, description, price, billing_interval, trial_period_days, features) VALUES
  ('Basic Wellness', 'basic-wellness', 'Essential wellness products monthly delivery', 299.00, 'monthly', 7, '{"free_shipping": true, "discount_percentage": 10, "early_access": false}'),
  ('Premium Wellness', 'premium-wellness', 'Complete wellness experience with premium products', 599.00, 'monthly', 14, '{"free_shipping": true, "discount_percentage": 20, "early_access": true, "personal_coach": false}'),
  ('Elite Wellness', 'elite-wellness', 'Ultimate wellness journey with personalized coaching', 999.00, 'monthly', 30, '{"free_shipping": true, "discount_percentage": 25, "early_access": true, "personal_coach": true, "priority_support": true}')
ON CONFLICT (slug) DO NOTHING;

-- Update statistics for better query planning
ANALYZE subscription_plans;
ANALYZE user_subscriptions;
ANALYZE user_behavior_events;
ANALYZE product_analytics;
ANALYZE category_analytics;