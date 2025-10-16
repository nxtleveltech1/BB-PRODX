#!/usr/bin/env node

/**
 * Environment validation script
 * Run this before build or start to ensure all required environment variables are set
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

// Load environment variables
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Define required environment variables for different environments
const requiredEnvVars = {
  development: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ],
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
  ],
  test: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ],
};

// Get current environment
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`\n🔍 Validating environment variables for ${NODE_ENV}...\n`);

// Check required environment variables
const missing = [];
const invalid = [];
const warnings = [];
const required = requiredEnvVars[NODE_ENV] || requiredEnvVars.development;

for (const varName of required) {
  const value = process.env[varName];

  if (!value) {
    missing.push(varName);
    continue;
  }

  // Validate specific formats
  switch (varName) {
    case 'DATABASE_URL':
    case 'REDIS_URL':
    case 'NEXTAUTH_URL':
      try {
        new URL(value);
      } catch {
        invalid.push(`${varName}: Must be a valid URL`);
      }
      break;

    case 'JWT_SECRET':
    case 'NEXTAUTH_SECRET':
    case 'JWT_REFRESH_SECRET':
      if (value.length < 32) {
        invalid.push(`${varName}: Must be at least 32 characters long`);
      }
      break;

    case 'STRIPE_PUBLISHABLE_KEY':
    case 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY':
      if (!value.startsWith('pk_')) {
        invalid.push(`${varName}: Must start with 'pk_'`);
      }
      break;

    case 'STRIPE_SECRET_KEY':
      if (!value.startsWith('sk_')) {
        invalid.push(`${varName}: Must start with 'sk_'`);
      }
      break;

    case 'STRIPE_WEBHOOK_SECRET':
      if (value && !value.startsWith('whsec_')) {
        invalid.push(`${varName}: Must start with 'whsec_'`);
      }
      break;
  }
}

// Check for deprecated environment variables
const deprecated = {
  'STACK_PROJECT_ID': 'Use NEXT_PUBLIC_STACK_PROJECT_ID instead',
  'STACK_PUBLISHABLE_CLIENT_KEY': 'Use NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY instead',
};

for (const [varName, message] of Object.entries(deprecated)) {
  if (process.env[varName]) {
    warnings.push(`${varName}: ${message}`);
  }
}

// Check optional but recommended variables
const recommended = {
  'SENTRY_DSN': 'Recommended for error tracking in production',
  'REDIS_URL': 'Recommended for caching and session storage',
  'STRIPE_WEBHOOK_SECRET': 'Required for Stripe webhook handling',
};

if (NODE_ENV === 'production') {
  for (const [varName, message] of Object.entries(recommended)) {
    if (!process.env[varName]) {
      warnings.push(`${varName}: ${message}`);
    }
  }
}

// Output results
let hasErrors = false;

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('');
  hasErrors = true;
}

if (invalid.length > 0) {
  console.error('❌ Invalid environment variables:');
  invalid.forEach(message => {
    console.error(`   - ${message}`);
  });
  console.error('');
  hasErrors = true;
}

if (warnings.length > 0) {
  console.warn('⚠️  Warnings:');
  warnings.forEach(message => {
    console.warn(`   - ${message}`);
  });
  console.warn('');
}

if (hasErrors) {
  console.error('❌ Environment validation failed!\n');
  console.error('Please set the missing/invalid environment variables in your .env.local file.');
  console.error('Copy .env.local.example to .env.local and fill in the values.\n');
  process.exit(1);
} else {
  console.log('✅ Environment validation passed!\n');

  // Show summary
  console.log('📊 Environment Summary:');
  console.log(`   - Node Environment: ${NODE_ENV}`);
  console.log(`   - Database: ${process.env.DATABASE_URL ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`   - NextAuth: ${process.env.NEXTAUTH_SECRET ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`   - Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`   - Redis: ${process.env.REDIS_URL ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`   - Sentry: ${process.env.SENTRY_DSN ? '✓ Configured' : '✗ Not configured'}`);
  console.log('');
}