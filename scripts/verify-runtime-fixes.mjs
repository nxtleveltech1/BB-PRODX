#!/usr/bin/env node
/**
 * Verification script for runtime fixes
 * Tests all modified API routes and components
 *
 * Usage:
 *   node scripts/verify-runtime-fixes.mjs
 *   node scripts/verify-runtime-fixes.mjs --production
 */

const PRODUCTION_URL = process.env.VERCEL_URL || 'https://bb-prodx.vercel.app';
const DEV_URL = 'http://localhost:3000';

const isProduction = process.argv.includes('--production');
const BASE_URL = isProduction ? PRODUCTION_URL : DEV_URL;

console.log(`\n🔍 Verifying Runtime Fixes`);
console.log(`📍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`🌐 Base URL: ${BASE_URL}\n`);

const tests = [];
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * Test helper function
 */
async function testEndpoint(name, url, validator) {
  process.stdout.write(`Testing ${name}... `);

  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;

    const data = await response.json();

    const result = await validator(response, data);

    if (result.pass) {
      console.log(`✅ PASS (${responseTime}ms)`);
      if (result.message) console.log(`   ℹ️  ${result.message}`);
      results.passed++;
    } else if (result.warning) {
      console.log(`⚠️  WARNING (${responseTime}ms)`);
      console.log(`   ⚠️  ${result.message}`);
      results.warnings++;
    } else {
      console.log(`❌ FAIL (${responseTime}ms)`);
      console.log(`   ❌ ${result.message}`);
      results.failed++;
    }
  } catch (error) {
    console.log(`❌ ERROR`);
    console.log(`   ❌ ${error.message}`);
    results.failed++;
  }
}

/**
 * Test 1: Instagram API - Should handle failures gracefully
 */
tests.push(() =>
  testEndpoint(
    'Instagram API',
    `${BASE_URL}/api/instagram?count=12`,
    async (response, data) => {
      if (response.status !== 200) {
        return { pass: false, message: `Expected 200, got ${response.status}` };
      }

      if (!Array.isArray(data.posts)) {
        return { pass: false, message: 'Response should have posts array' };
      }

      if (data.posts.length === 0) {
        return {
          pass: true,
          warning: true,
          message: 'No posts returned - Instagram may be unavailable or parsing failed',
        };
      }

      return { pass: true, message: `${data.posts.length} posts fetched successfully` };
    }
  )
);

/**
 * Test 2: Products API - Should return empty array on error
 */
tests.push(() =>
  testEndpoint('Products API', `${BASE_URL}/api/products`, async (response, data) => {
    if (response.status !== 200) {
      return { pass: false, message: `Expected 200, got ${response.status}` };
    }

    if (!data.success) {
      return { pass: false, message: 'Response should have success: true' };
    }

    if (!Array.isArray(data.data) && !Array.isArray(data.products)) {
      return { pass: false, message: 'Response should have data or products array' };
    }

    const products = data.data || data.products || [];
    if (products.length === 0) {
      return {
        pass: true,
        warning: true,
        message: 'No products in database - may need data migration',
      };
    }

    return { pass: true, message: `${products.length} products loaded successfully` };
  })
);

/**
 * Test 3: Database Health Check
 */
tests.push(() =>
  testEndpoint('Database Health', `${BASE_URL}/api/health/db`, async (response, data) => {
    if (response.status === 503) {
      return { pass: false, message: `Database unavailable: ${data.message}` };
    }

    if (response.status !== 200) {
      return { pass: false, message: `Expected 200, got ${response.status}` };
    }

    if (data.status !== 'healthy') {
      return { pass: false, message: `Database not healthy: ${data.message}` };
    }

    return { pass: true, message: `Database connected (${data.responseTime})` };
  })
);

/**
 * Test 4: Search Page - Should load without error
 */
tests.push(() =>
  testEndpoint(
    'Search Page',
    `${BASE_URL}/search`,
    async (response, data) => {
      if (response.status !== 200) {
        return { pass: false, message: `Expected 200, got ${response.status}` };
      }

      const html = typeof data === 'string' ? data : await response.text();
      if (!html.includes('Search Products')) {
        return { pass: false, message: 'Search page content not found' };
      }

      return { pass: true, message: 'Search page renders correctly' };
    },
    true // HTML response
  )
);

/**
 * Run all tests
 */
async function runTests() {
  console.log(`Running ${tests.length} tests...\n`);

  for (const test of tests) {
    await test();
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   ⚠️  Warnings: ${results.warnings}`);
  console.log(`   📝 Total: ${tests.length}\n`);

  if (results.failed === 0) {
    console.log('✨ All critical tests passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

// Handle HTML responses differently
async function testEndpoint(name, url, validator, isHtml = false) {
  process.stdout.write(`Testing ${name}... `);

  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const responseTime = Date.now() - startTime;

    let data;
    if (isHtml) {
      data = await response.text();
    } else {
      data = await response.json();
    }

    const result = await validator(response, data);

    if (result.pass) {
      console.log(`✅ PASS (${responseTime}ms)`);
      if (result.message) console.log(`   ℹ️  ${result.message}`);
      results.passed++;
    } else if (result.warning) {
      console.log(`⚠️  WARNING (${responseTime}ms)`);
      console.log(`   ⚠️  ${result.message}`);
      results.warnings++;
    } else {
      console.log(`❌ FAIL (${responseTime}ms)`);
      console.log(`   ❌ ${result.message}`);
      results.failed++;
    }
  } catch (error) {
    console.log(`❌ ERROR`);
    console.log(`   ❌ ${error.message}`);
    results.failed++;
  }
}

// Run tests
runTests();
