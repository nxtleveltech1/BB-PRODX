-- Add Foreign Key Constraints
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'accounts_userId_users_id_fk') THEN
    ALTER TABLE accounts ADD CONSTRAINT accounts_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_userId_users_id_fk') THEN
    ALTER TABLE sessions ADD CONSTRAINT sessions_userId_users_id_fk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_sessions_user_id_users_id_fk') THEN
    ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_user_id_users_id_fk') THEN
    ALTER TABLE cart ADD CONSTRAINT cart_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_product_id_products_id_fk') THEN
    ALTER TABLE cart ADD CONSTRAINT cart_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wishlist_user_id_users_id_fk') THEN
    ALTER TABLE wishlist ADD CONSTRAINT wishlist_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wishlist_product_id_products_id_fk') THEN
    ALTER TABLE wishlist ADD CONSTRAINT wishlist_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subcategories_category_id_categories_id_fk') THEN
    ALTER TABLE subcategories ADD CONSTRAINT subcategories_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_categories_id_fk') THEN
    ALTER TABLE products ADD CONSTRAINT products_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES categories(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_subcategory_id_subcategories_id_fk') THEN
    ALTER TABLE products ADD CONSTRAINT products_subcategory_id_subcategories_id_fk FOREIGN KEY (subcategory_id) REFERENCES subcategories(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_benefits_product_id_products_id_fk') THEN
    ALTER TABLE product_benefits ADD CONSTRAINT product_benefits_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_ingredients_product_id_products_id_fk') THEN
    ALTER TABLE product_ingredients ADD CONSTRAINT product_ingredients_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_sizes_product_id_products_id_fk') THEN
    ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_tags_product_id_products_id_fk') THEN
    ALTER TABLE product_tags ADD CONSTRAINT product_tags_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_user_id_users_id_fk') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_orders_id_fk') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_product_id_products_id_fk') THEN
    ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_product_id_products_id_fk') THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_user_id_users_id_fk') THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_votes_review_id_reviews_id_fk') THEN
    ALTER TABLE review_votes ADD CONSTRAINT review_votes_review_id_reviews_id_fk FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'review_votes_user_id_users_id_fk') THEN
    ALTER TABLE review_votes ADD CONSTRAINT review_votes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create Indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_phone_idx ON users(phone);
CREATE INDEX IF NOT EXISTS users_email_verified_idx ON users(emailVerified);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_session_token_idx ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS user_sessions_refresh_token_idx ON user_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS user_sessions_is_active_idx ON user_sessions(is_active);

CREATE INDEX IF NOT EXISTS cart_user_id_idx ON cart(user_id);
CREATE INDEX IF NOT EXISTS cart_product_id_idx ON cart(product_id);
CREATE INDEX IF NOT EXISTS cart_added_at_idx ON cart(added_at);

CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS wishlist_product_id_idx ON wishlist(product_id);
CREATE INDEX IF NOT EXISTS wishlist_priority_idx ON wishlist(priority);
CREATE INDEX IF NOT EXISTS wishlist_added_at_idx ON wishlist(added_at);

CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS categories_name_idx ON categories(name);

CREATE INDEX IF NOT EXISTS subcategories_slug_idx ON subcategories(slug);
CREATE INDEX IF NOT EXISTS subcategories_category_id_idx ON subcategories(category_id);

CREATE INDEX IF NOT EXISTS products_sku_idx ON products(sku);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_subcategory_id_idx ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS products_is_popular_idx ON products(is_popular);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured);
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON products(in_stock);
CREATE INDEX IF NOT EXISTS products_price_idx ON products(price);
CREATE INDEX IF NOT EXISTS products_rating_idx ON products(rating);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at);

CREATE INDEX IF NOT EXISTS product_benefits_product_id_idx ON product_benefits(product_id);
CREATE INDEX IF NOT EXISTS product_ingredients_product_id_idx ON product_ingredients(product_id);
CREATE INDEX IF NOT EXISTS product_sizes_product_id_idx ON product_sizes(product_id);
CREATE INDEX IF NOT EXISTS product_tags_product_id_idx ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS product_tags_tag_idx ON product_tags(tag);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
CREATE INDEX IF NOT EXISTS orders_user_status_idx ON orders(user_id, status);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items(product_id);
CREATE INDEX IF NOT EXISTS order_items_order_product_idx ON order_items(order_id, product_id);

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews(rating);
CREATE INDEX IF NOT EXISTS reviews_is_approved_idx ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at);
CREATE INDEX IF NOT EXISTS reviews_product_rating_idx ON reviews(product_id, rating);
CREATE INDEX IF NOT EXISTS reviews_product_approved_idx ON reviews(product_id, is_approved);

CREATE INDEX IF NOT EXISTS review_votes_review_id_idx ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS review_votes_user_id_idx ON review_votes(user_id);

CREATE INDEX IF NOT EXISTS instagram_posts_instagram_id_idx ON instagram_posts(instagram_id);
CREATE INDEX IF NOT EXISTS instagram_posts_shortcode_idx ON instagram_posts(shortcode);
CREATE INDEX IF NOT EXISTS instagram_posts_posted_at_idx ON instagram_posts(posted_at);
CREATE INDEX IF NOT EXISTS instagram_posts_is_active_idx ON instagram_posts(is_active);
CREATE INDEX IF NOT EXISTS instagram_posts_last_synced_at_idx ON instagram_posts(last_synced_at);
