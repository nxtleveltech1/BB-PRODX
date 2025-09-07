-- BetterBeingWEB Seed Data
-- Sample data for development and testing

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Adaptogens', 'adaptogens', 'Natural herbs that help the body adapt to stress and promote balance', 1),
('Superfoods', 'superfoods', 'Nutrient-dense foods that provide exceptional health benefits', 2),
('Minerals', 'minerals', 'Essential minerals and trace elements for optimal health', 3),
('Nootropics', 'nootropics', 'Cognitive enhancers and brain health supplements', 4),
('Probiotics', 'probiotics', 'Beneficial bacteria for digestive and immune health', 5),
('Vitamins', 'vitamins', 'Essential vitamins for daily health and wellness', 6),
('Herbal Teas', 'herbal-teas', 'Therapeutic herbal tea blends for wellness', 7),
('Protein & Fitness', 'protein-fitness', 'Natural protein sources and fitness supplements', 8);

-- Shipping zones
INSERT INTO shipping_zones (name, countries, provinces) VALUES
('South Africa - Major Cities', '{"ZA"}', '{"Western Cape", "Gauteng", "KwaZulu-Natal"}'),
('South Africa - Other Provinces', '{"ZA"}', '{"Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"}');

-- Shipping rates
INSERT INTO shipping_rates (zone_id, name, description, rate_type, price, free_shipping_threshold, delivery_days_min, delivery_days_max) VALUES
(1, 'Standard Shipping', 'Standard delivery to major cities', 'flat', 75.00, 500.00, 2, 3),
(1, 'Express Shipping', 'Next day delivery to major cities', 'flat', 150.00, NULL, 1, 1),
(2, 'Standard Shipping', 'Standard delivery to other provinces', 'flat', 95.00, 500.00, 3, 5),
(2, 'Express Shipping', 'Express delivery to other provinces', 'flat', 195.00, NULL, 2, 3);

-- Products
INSERT INTO products (
    name, slug, description, short_description, sku, price, compare_price, 
    category_id, brand, stock_quantity, is_active, is_featured, 
    weight, ingredients, instructions, tags, meta_title, meta_description
) VALUES
(
    'Organic Ashwagandha Capsules',
    'organic-ashwagandha-capsules',
    'Premium organic ashwagandha root extract in convenient capsule form. Known as the "king of adaptogens," ashwagandha has been used for centuries in Ayurvedic medicine to help the body manage stress, support energy levels, and promote overall wellness. Our organic ashwagandha is sourced from sustainable farms and contains standardized withanolides for consistent potency.',
    'Premium organic ashwagandha for stress relief and energy balance',
    'BB-ASH-001',
    89.99,
    119.99,
    1,
    'Better Being',
    150,
    true,
    true,
    0.120,
    'Organic Ashwagandha Root Extract (Withania somnifera) standardized to 5% withanolides, Vegetable Cellulose Capsule',
    'Take 2 capsules daily with food, preferably with breakfast and dinner. Do not exceed recommended dosage.',
    '{"Organic", "Stress Relief", "Energy", "Adaptogen", "Ayurvedic"}',
    'Organic Ashwagandha Capsules - Natural Stress Relief | Better Being',
    'Premium organic ashwagandha capsules for natural stress relief and energy support. Standardized extract with 5% withanolides. Free shipping over R500.'
),
(
    'Himalayan Shilajit Resin',
    'himalayan-shilajit-resin',
    'Authentic Himalayan shilajit resin sourced directly from high-altitude regions. This ancient substance is rich in fulvic acid, humic acid, and over 85 trace minerals. Traditionally used to support energy, vitality, and overall wellness. Our shilajit undergoes rigorous purification while maintaining its natural potency and bioactive compounds.',
    'Authentic Himalayan shilajit for vitality and mineral supplementation',
    'BB-SHI-001',
    149.99,
    NULL,
    3,
    'Pure Mountain',
    75,
    true,
    true,
    0.050,
    'Pure Himalayan Shilajit Resin (containing fulvic acid, humic acid, and 85+ trace minerals)',
    'Take a rice grain-sized portion (approximately 300-500mg) dissolved in warm water or milk, once daily on an empty stomach.',
    '{"Raw", "Energy", "Minerals", "Himalayan", "Fulvic Acid"}',
    'Himalayan Shilajit Resin - Pure Mountain Source | Better Being',
    'Authentic Himalayan shilajit resin with fulvic acid and 85+ trace minerals. Premium quality for energy and vitality support.'
),
(
    'Lion''s Mane Mushroom Extract',
    'lions-mane-mushroom-extract',
    'Concentrated lion''s mane mushroom extract standardized for optimal cognitive support. This unique mushroom contains natural compounds called hericenones and erinacines that support nerve growth factor production. Perfect for students, professionals, and anyone looking to support cognitive function, memory, and mental clarity naturally.',
    'Concentrated lion''s mane extract for cognitive enhancement',
    'BB-LM-001',
    67.99,
    NULL,
    4,
    'Fungi Focus',
    120,
    true,
    false,
    0.100,
    'Lion''s Mane Mushroom Extract (Hericium erinaceus) standardized to 30% polysaccharides, Vegetable Cellulose Capsule',
    'Take 1-2 capsules daily with food. Best taken consistently for optimal cognitive support.',
    '{"Cognitive", "Brain Health", "Extract", "Nootropic", "Memory"}',
    'Lion''s Mane Mushroom Extract - Cognitive Support | Better Being',
    'Premium lion''s mane mushroom extract for cognitive enhancement and brain health. Standardized for optimal potency.'
),
(
    'Turmeric Golden Milk Blend',
    'turmeric-golden-milk-blend',
    'Traditional golden milk blend featuring organic turmeric, warming spices, and complementary herbs. This aromatic blend combines turmeric with black pepper, ginger, cinnamon, cardamom, and coconut milk powder for enhanced bioavailability and delicious taste. Perfect for evening relaxation or post-workout recovery.',
    'Traditional golden milk blend with turmeric and warming spices',
    'BB-GM-001',
    34.99,
    NULL,
    2,
    'Golden Wellness',
    0,
    true,
    false,
    0.250,
    'Organic Turmeric Root Powder, Organic Ginger Root Powder, Organic Cinnamon Bark Powder, Organic Cardamom Seed Powder, Organic Black Pepper, Coconut Milk Powder, Natural Vanilla Extract',
    'Mix 1 teaspoon with 200ml warm milk or plant-based milk. Stir well and enjoy. Can be sweetened with honey if desired.',
    '{"Anti-inflammatory", "Blend", "Ayurvedic", "Turmeric", "Golden Milk"}',
    'Turmeric Golden Milk Blend - Anti-inflammatory Spice Blend | Better Being',
    'Traditional golden milk blend with organic turmeric and warming spices. Perfect for evening relaxation and natural wellness support.'
),
(
    'Spirulina Powder Premium',
    'spirulina-powder-premium',
    'Premium quality spirulina powder sourced from pristine freshwater environments. This blue-green algae is one of nature''s most complete superfoods, containing all essential amino acids, B-vitamins, iron, and antioxidants. Our spirulina is carefully dried to preserve nutrients and tested for purity.',
    'Premium spirulina powder - complete superfood nutrition',
    'BB-SP-001',
    45.99,
    55.99,
    2,
    'Superfood Source',
    200,
    true,
    true,
    0.200,
    '100% Pure Spirulina Powder (Arthrospira platensis)',
    'Start with 1/2 teaspoon daily and gradually increase to 1-2 teaspoons. Mix into smoothies, juices, or water.',
    '{"Superfood", "Protein", "B-vitamins", "Iron", "Antioxidants"}',
    'Premium Spirulina Powder - Complete Superfood | Better Being',
    'Premium quality spirulina powder with complete amino acids, B-vitamins, and antioxidants. Perfect superfood addition to smoothies.'
),
(
    'Magnesium Glycinate Complex',
    'magnesium-glycinate-complex',
    'Highly bioavailable magnesium glycinate complex for optimal absorption and gentle digestion. Magnesium is essential for over 300 enzymatic reactions in the body, supporting muscle function, nervous system health, and energy production. Our chelated form reduces digestive discomfort while maximizing absorption.',
    'Highly bioavailable magnesium glycinate for muscle and nerve support',
    'BB-MG-001',
    52.99,
    NULL,
    3,
    'Essential Minerals',
    180,
    true,
    false,
    0.150,
    'Magnesium Glycinate (providing 400mg elemental magnesium per serving), Vegetable Cellulose Capsule',
    'Take 2 capsules daily with food, preferably in the evening. Do not exceed recommended dosage.',
    '{"Magnesium", "Glycinate", "Muscle Support", "Sleep", "Bioavailable"}',
    'Magnesium Glycinate Complex - High Absorption | Better Being',
    'Premium magnesium glycinate complex for optimal absorption. Supports muscle function, sleep quality, and nervous system health.'
);

-- Product images
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
(1, '/images/products/ashwagandha-capsules-1.jpg', 'Organic Ashwagandha Capsules - Front View', 0, true),
(1, '/images/products/ashwagandha-capsules-2.jpg', 'Organic Ashwagandha Capsules - Back Label', 1, false),
(2, '/images/products/shilajit-resin-1.jpg', 'Himalayan Shilajit Resin - Glass Jar', 0, true),
(2, '/images/products/shilajit-resin-2.jpg', 'Himalayan Shilajit Resin - Close-up Texture', 1, false),
(3, '/images/products/lions-mane-1.jpg', 'Lion''s Mane Mushroom Extract - Bottle Front', 0, true),
(4, '/images/products/golden-milk-1.jpg', 'Turmeric Golden Milk Blend - Package Front', 0, true),
(5, '/images/products/spirulina-powder-1.jpg', 'Premium Spirulina Powder - Container', 0, true),
(6, '/images/products/magnesium-glycinate-1.jpg', 'Magnesium Glycinate Complex - Bottle', 0, true);

-- Sample discount codes
INSERT INTO discount_codes (
    code, name, type, value, minimum_order_amount, usage_limit, 
    starts_at, ends_at, is_active
) VALUES
('WELCOME10', 'Welcome Discount', 'percentage', 10.00, 100.00, 1000, 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true),
('FREESHIP', 'Free Shipping', 'free_shipping', 0.00, 200.00, NULL, 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', true),
('SAVE50', 'Save R50', 'fixed_amount', 50.00, 300.00, 500, 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '14 days', true);

-- Sample users (for testing - passwords are 'password123')
INSERT INTO users (
    email, password_hash, first_name, last_name, email_verified, phone
) VALUES
('admin@betterbeing.co.za', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1vdXa6eS6W', 'Admin', 'User', true, '+27 11 123 4567'),
('john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1vdXa6eS6W', 'John', 'Doe', true, '+27 82 123 4567'),
('sarah.johnson@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1vdXa6eS6W', 'Sarah', 'Johnson', true, '+27 71 234 5678');

-- Update admin user
UPDATE users SET is_admin = true WHERE email = 'admin@betterbeing.co.za';

-- Sample user addresses
INSERT INTO user_addresses (
    user_id, type, first_name, last_name, address_line_1, city, province, postal_code, country, is_default
) VALUES
(2, 'shipping', 'John', 'Doe', '123 Main Street', 'Cape Town', 'Western Cape', '8001', 'ZA', true),
(2, 'billing', 'John', 'Doe', '123 Main Street', 'Cape Town', 'Western Cape', '8001', 'ZA', true),
(3, 'shipping', 'Sarah', 'Johnson', '456 Oak Avenue', 'Johannesburg', 'Gauteng', '2000', 'ZA', true);

-- Sample newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, user_id) VALUES
('admin@betterbeing.co.za', 1),
('john.doe@example.com', 2),
('sarah.johnson@example.com', 3),
('newsletter@example.com', NULL);

-- Sample product reviews
INSERT INTO product_reviews (
    product_id, user_id, rating, title, comment, is_verified_purchase
) VALUES
(1, 2, 5, 'Excellent Quality!', 'I''ve been using these ashwagandha capsules for 2 months now and I can really feel the difference in my stress levels. Highly recommended!', true),
(1, 3, 4, 'Good product', 'Quality seems good and packaging is professional. Noticed some improvement in sleep quality.', true),
(2, 2, 5, 'Amazing energy boost', 'This shilajit is the real deal. The energy increase is noticeable within days of taking it.', false),
(3, 3, 4, 'Great for focus', 'Lion''s mane definitely helps with mental clarity during work. Will order again.', true),
(5, 2, 5, 'Perfect superfood', 'Great quality spirulina, mixes well in smoothies and doesn''t have a strong taste.', true);

-- Update product ratings based on reviews
UPDATE products SET 
    average_rating = (
        SELECT AVG(rating)::DECIMAL(3,2) 
        FROM product_reviews 
        WHERE product_id = products.id
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM product_reviews 
        WHERE product_id = products.id
    )
WHERE id IN (SELECT DISTINCT product_id FROM product_reviews);

-- Sample analytics events
INSERT INTO analytics_events (event_type, user_id, product_id, event_data) VALUES
('product_view', 2, 1, '{"source": "category_page", "category": "adaptogens"}'),
('product_view', 3, 2, '{"source": "search", "search_term": "shilajit"}'),
('add_to_cart', 2, 1, '{"quantity": 1, "price": 89.99}'),
('add_to_cart', 3, 5, '{"quantity": 1, "price": 45.99}'),
('purchase', 2, 1, '{"order_id": 1, "quantity": 1, "total": 89.99}');

-- Sample SEO metadata
INSERT INTO seo_metadata (entity_type, entity_id, meta_title, meta_description, og_title, og_description) VALUES
('category', 1, 'Adaptogen Supplements - Natural Stress Relief | Better Being', 'Discover premium adaptogen supplements including ashwagandha, rhodiola, and more. Natural stress relief and energy support from Better Being.', 'Premium Adaptogen Supplements', 'Natural stress relief supplements from premium adaptogenic herbs.'),
('category', 2, 'Superfood Supplements - Nutrient Dense Nutrition | Better Being', 'Premium superfood supplements including spirulina, chlorella, and superfood blends. Boost your nutrition with Better Being superfoods.', 'Premium Superfood Supplements', 'Nutrient-dense superfood supplements for optimal health and vitality.'),
('product', 1, 'Organic Ashwagandha Capsules - Premium Stress Relief | Better Being', 'Premium organic ashwagandha capsules for natural stress relief. Standardized extract with 5% withanolides. Free shipping over R500 in South Africa.', 'Organic Ashwagandha Capsules', 'Premium ashwagandha for natural stress relief and energy balance.');