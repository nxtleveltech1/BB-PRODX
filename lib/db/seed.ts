import { db } from './client-edge';
import {
  users,
  categories,
  subcategories,
  products,
  productBenefits,
  productIngredients,
  productTags,
  productSizes,
  reviews,
} from './schema';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('ℹ️ Database already contains data. Skipping seed.');
      return;
    }

    // Seed users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const [adminUser, testUser] = await db.insert(users).values([
      {
        email: 'admin@betterbeing.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        emailVerified: true,
        marketingConsent: true,
      },
      {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        marketingConsent: false,
      },
    ]).returning();

    console.log(`✅ Created ${2} users`);

    // Seed categories
    console.log('Creating categories...');
    const [supplementsCat, skincarecat, fitnesscat, nutritionCat] = await db.insert(categories).values([
      {
        name: 'Supplements',
        slug: 'supplements',
        description: 'Natural supplements for optimal health',
        icon: '💊',
      },
      {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Premium skincare products',
        icon: '✨',
      },
      {
        name: 'Fitness',
        slug: 'fitness',
        description: 'Equipment and accessories for your fitness journey',
        icon: '💪',
      },
      {
        name: 'Nutrition',
        slug: 'nutrition',
        description: 'Healthy food and beverages',
        icon: '🥗',
      },
    ]).returning();

    console.log(`✅ Created ${4} categories`);

    // Seed subcategories
    console.log('Creating subcategories...');
    const [vitamins, minerals, probiotics] = await db.insert(subcategories).values([
      {
        categoryId: supplementsCat.id,
        name: 'Vitamins',
        slug: 'vitamins',
        description: 'Essential vitamins for daily health',
      },
      {
        categoryId: supplementsCat.id,
        name: 'Minerals',
        slug: 'minerals',
        description: 'Important minerals for body functions',
      },
      {
        categoryId: supplementsCat.id,
        name: 'Probiotics',
        slug: 'probiotics',
        description: 'Support digestive health',
      },
    ]).returning();

    console.log(`✅ Created ${3} subcategories`);

    // Seed products
    console.log('Creating products...');
    const productsData = [
      {
        sku: 'VIT-C-1000',
        name: 'Vitamin C 1000mg',
        slug: 'vitamin-c-1000mg',
        description: 'High-potency vitamin C for immune support',
        longDescription: 'Our Vitamin C 1000mg provides powerful antioxidant protection and immune system support. Made from the finest ingredients, this supplement helps maintain overall health and wellness.',
        price: '19.99',
        originalPrice: '24.99',
        rating: '4.5',
        reviewsCount: 127,
        categoryId: supplementsCat.id,
        subcategoryId: vitamins.id,
        imageUrl: '/images/products/vitamin-c.jpg',
        isPopular: true,
        isFeatured: true,
        inStock: true,
        stockCount: 250,
        usageInstructions: 'Take 1 tablet daily with food',
        warnings: 'Consult your healthcare provider before use if pregnant or nursing',
      },
      {
        sku: 'OMEGA-3-FISH',
        name: 'Omega-3 Fish Oil',
        slug: 'omega-3-fish-oil',
        description: 'Premium fish oil for heart and brain health',
        longDescription: 'Our Omega-3 Fish Oil is sourced from wild-caught fish and provides essential fatty acids EPA and DHA for cardiovascular and cognitive health.',
        price: '29.99',
        originalPrice: '34.99',
        rating: '4.7',
        reviewsCount: 89,
        categoryId: supplementsCat.id,
        subcategoryId: vitamins.id,
        imageUrl: '/images/products/omega-3.jpg',
        isPopular: true,
        isFeatured: false,
        inStock: true,
        stockCount: 180,
        usageInstructions: 'Take 2 softgels daily with meals',
        warnings: 'May contain traces of shellfish',
      },
      {
        sku: 'PROB-BLEND',
        name: 'Probiotic Blend 50 Billion CFU',
        slug: 'probiotic-blend-50-billion',
        description: 'Advanced probiotic for digestive health',
        longDescription: 'Our Probiotic Blend contains 50 billion CFU of beneficial bacteria to support digestive health, immune function, and overall wellness.',
        price: '39.99',
        originalPrice: '49.99',
        rating: '4.8',
        reviewsCount: 156,
        categoryId: supplementsCat.id,
        subcategoryId: probiotics.id,
        imageUrl: '/images/products/probiotic.jpg',
        isPopular: true,
        isFeatured: true,
        inStock: true,
        stockCount: 120,
        usageInstructions: 'Take 1 capsule daily on an empty stomach',
        warnings: 'Keep refrigerated for maximum potency',
      },
      {
        sku: 'MULTI-VIT',
        name: 'Complete Multivitamin',
        slug: 'complete-multivitamin',
        description: 'Comprehensive daily multivitamin',
        longDescription: 'Our Complete Multivitamin provides all essential vitamins and minerals your body needs for optimal health and energy.',
        price: '24.99',
        originalPrice: '29.99',
        rating: '4.6',
        reviewsCount: 203,
        categoryId: supplementsCat.id,
        subcategoryId: vitamins.id,
        imageUrl: '/images/products/multivitamin.jpg',
        isPopular: true,
        isFeatured: false,
        inStock: true,
        stockCount: 300,
        usageInstructions: 'Take 2 tablets daily with food',
        warnings: 'Contains iron. Keep out of reach of children',
      },
      {
        sku: 'MAGNESIUM-400',
        name: 'Magnesium Glycinate 400mg',
        slug: 'magnesium-glycinate-400mg',
        description: 'Highly absorbable magnesium for muscle and nerve function',
        longDescription: 'Our Magnesium Glycinate provides superior absorption for muscle relaxation, nerve function, and better sleep quality.',
        price: '22.99',
        originalPrice: '27.99',
        rating: '4.7',
        reviewsCount: 167,
        categoryId: supplementsCat.id,
        subcategoryId: minerals.id,
        imageUrl: '/images/products/magnesium.jpg',
        isPopular: false,
        isFeatured: false,
        inStock: true,
        stockCount: 200,
        usageInstructions: 'Take 2 capsules at bedtime',
        warnings: 'May cause drowsiness',
      },
    ];

    const insertedProducts = await db.insert(products).values(productsData).returning();
    console.log(`✅ Created ${insertedProducts.length} products`);

    // Seed product benefits
    console.log('Creating product benefits...');
    const benefitsData = [
      { productId: insertedProducts[0].id, benefit: 'Boosts immune system' },
      { productId: insertedProducts[0].id, benefit: 'Powerful antioxidant' },
      { productId: insertedProducts[0].id, benefit: 'Supports collagen production' },
      { productId: insertedProducts[1].id, benefit: 'Supports heart health' },
      { productId: insertedProducts[1].id, benefit: 'Improves brain function' },
      { productId: insertedProducts[1].id, benefit: 'Reduces inflammation' },
      { productId: insertedProducts[2].id, benefit: 'Improves digestion' },
      { productId: insertedProducts[2].id, benefit: 'Boosts immune system' },
      { productId: insertedProducts[2].id, benefit: 'Enhances nutrient absorption' },
    ];

    await db.insert(productBenefits).values(benefitsData);
    console.log(`✅ Created ${benefitsData.length} product benefits`);

    // Seed product ingredients
    console.log('Creating product ingredients...');
    const ingredientsData = [
      { productId: insertedProducts[0].id, ingredient: 'Ascorbic Acid' },
      { productId: insertedProducts[0].id, ingredient: 'Citrus Bioflavonoids' },
      { productId: insertedProducts[1].id, ingredient: 'Fish Oil Concentrate' },
      { productId: insertedProducts[1].id, ingredient: 'EPA (Eicosapentaenoic Acid)' },
      { productId: insertedProducts[1].id, ingredient: 'DHA (Docosahexaenoic Acid)' },
      { productId: insertedProducts[2].id, ingredient: 'Lactobacillus Acidophilus' },
      { productId: insertedProducts[2].id, ingredient: 'Bifidobacterium Lactis' },
      { productId: insertedProducts[2].id, ingredient: 'Prebiotic Fiber' },
    ];

    await db.insert(productIngredients).values(ingredientsData);
    console.log(`✅ Created ${ingredientsData.length} product ingredients`);

    // Seed product tags
    console.log('Creating product tags...');
    const tagsData = [
      { productId: insertedProducts[0].id, tag: 'immune-support' },
      { productId: insertedProducts[0].id, tag: 'antioxidant' },
      { productId: insertedProducts[0].id, tag: 'vitamin' },
      { productId: insertedProducts[1].id, tag: 'heart-health' },
      { productId: insertedProducts[1].id, tag: 'brain-health' },
      { productId: insertedProducts[1].id, tag: 'omega-3' },
      { productId: insertedProducts[2].id, tag: 'digestive-health' },
      { productId: insertedProducts[2].id, tag: 'probiotic' },
      { productId: insertedProducts[2].id, tag: 'gut-health' },
    ];

    await db.insert(productTags).values(tagsData);
    console.log(`✅ Created ${tagsData.length} product tags`);

    // Seed product sizes
    console.log('Creating product sizes...');
    const sizesData = [
      { productId: insertedProducts[0].id, size: '30 tablets', price: '19.99', originalPrice: '24.99' },
      { productId: insertedProducts[0].id, size: '60 tablets', price: '34.99', originalPrice: '44.99' },
      { productId: insertedProducts[0].id, size: '120 tablets', price: '59.99', originalPrice: '79.99' },
      { productId: insertedProducts[1].id, size: '60 softgels', price: '29.99', originalPrice: '34.99' },
      { productId: insertedProducts[1].id, size: '120 softgels', price: '49.99', originalPrice: '64.99' },
      { productId: insertedProducts[2].id, size: '30 capsules', price: '39.99', originalPrice: '49.99' },
      { productId: insertedProducts[2].id, size: '60 capsules', price: '69.99', originalPrice: '89.99' },
    ];

    await db.insert(productSizes).values(sizesData);
    console.log(`✅ Created ${sizesData.length} product sizes`);

    // Seed reviews
    console.log('Creating reviews...');
    const reviewsData = [
      {
        productId: insertedProducts[0].id,
        userId: testUser.id,
        rating: 5,
        title: 'Excellent Vitamin C!',
        comment: 'This vitamin C has really boosted my immune system. I haven\'t gotten sick since I started taking it.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[1].id,
        userId: testUser.id,
        rating: 4,
        title: 'Good quality omega-3',
        comment: 'No fishy aftertaste, which is great. Seems to be helping with my joint pain.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[2].id,
        userId: adminUser.id,
        rating: 5,
        title: 'Best probiotic I\'ve tried',
        comment: 'My digestion has improved significantly. Highly recommend!',
        isVerifiedPurchase: true,
      },
    ];

    await db.insert(reviews).values(reviewsData);
    console.log(`✅ Created ${reviewsData.length} reviews`);

    console.log('✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;