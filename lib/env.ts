import { z } from 'zod';

// Define the environment schema
const envSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  SHADOW_DATABASE_URL: z.string().url().optional(),

  // Database Connection Settings
  DB_MAX_CONNECTIONS: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('20'),
  DB_MIN_CONNECTIONS: z.string().transform(Number).pipe(z.number().min(1).max(20)).default('2'),
  DB_IDLE_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).default('10000'),
  DB_CONNECTION_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).default('2000'),
  DB_QUERY_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).default('30000'),
  DB_STATEMENT_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).default('30000'),

  // Database SSL Configuration
  DB_SSL_CA: z.string().optional(),
  DB_SSL_CERT: z.string().optional(),
  DB_SSL_KEY: z.string().optional(),

  // NextAuth Configuration
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // JWT Configuration (for legacy support during migration)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),

  // OAuth Providers (optional during migration)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Payments: Stripe removed — keep keys optional for backward compatibility
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Email/Newsletter Providers (optional)
  BREVO_API_KEY: z.string().optional(),
  BREVO_LIST_ID: z.string().optional(),
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_LIST_ID: z.string().optional(),
  MAILCHIMP_SERVER_PREFIX: z.string().optional(),

  // hCaptcha Configuration (optional)
  NEXT_PUBLIC_HCAPTCHA_SITEKEY: z.string().optional(),
  HCAPTCHA_SECRET: z.string().optional(),

  // Social Links (Public)
  NEXT_PUBLIC_SOCIAL_INSTAGRAM: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_FACEBOOK: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_LINKEDIN: z.string().url().optional(),

  // Stack Auth (to be removed after migration)
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().optional(),

  // API Configuration
  // IMPORTANT: This value is used by Next.js rewrites as a proxy target for `/api/*`,
  // so it should include the `/api` path suffix (e.g. `http://localhost:8000/api`).
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8000/api'),
  VALID_API_KEYS: z.string().optional(),

  // Redis Configuration (optional)
  REDIS_URL: z.string().url().optional(),

  // Payment Providers (optional)
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),

  // Sentry Configuration (optional)
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Server Configuration
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('8000'),
  HOST: z.string().default('localhost'),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_ENV: z.enum(['development', 'production']).optional(),

  // Next.js Configuration
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  ANALYZE: z.string().optional(),

  // Build Configuration
  VERCEL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
});

// Type inference for the environment
export type Env = z.infer<typeof envSchema>;

// Parse and validate environment variables
function validateEnv(): Env {
  try {
    // Parse the environment
    const parsed = envSchema.parse(process.env);

    // Log successful validation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully');
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format error message
      const errorMessage = error.errors
        .map((err) => {
          const path = err.path.join('.');
          const message = err.message;
          return `  ❌ ${path}: ${message}`;
        })
        .join('\n');

      console.error('❌ Environment validation failed:\n' + errorMessage);

      // In production, throw to prevent startup with invalid config
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment validation failed. Check the logs for details.');
      }

      // In development, return partial env with defaults where possible
      console.warn('⚠️  Running in development with invalid environment. Some features may not work.');

      // Create a partial environment with safe defaults
      const partialEnv: Partial<Env> = {
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
        PORT: parseInt(process.env.PORT || '8000'),
        HOST: process.env.HOST || 'localhost',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      };

      // Return partial environment cast to full type (unsafe but allows development)
      return partialEnv as Env;
    }

    // Re-throw unknown errors
    throw error;
  }
}

// Singleton instance of validated environment
let envInstance: Env | null = null;

// Get validated environment variables
export function getEnv(): Env {
  if (!envInstance) {
    envInstance = validateEnv();
  }
  return envInstance;
}

// Export validated environment
export const env = getEnv();

// Helper to check if a feature is enabled based on environment
export const isFeatureEnabled = {
  database: () => !!env.DATABASE_URL,
  redis: () => !!env.REDIS_URL,
  stripe: () => false,
  sentry: () => !!env.SENTRY_DSN,
  stackAuth: () => !!env.NEXT_PUBLIC_STACK_PROJECT_ID && !!env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  nextAuth: () => !!env.NEXTAUTH_SECRET && !!env.NEXTAUTH_URL,
  brevo: () => !!env.BREVO_API_KEY && !!env.BREVO_LIST_ID,
  mailchimp: () => !!env.MAILCHIMP_API_KEY && !!env.MAILCHIMP_LIST_ID,
  hcaptcha: () => !!env.NEXT_PUBLIC_HCAPTCHA_SITEKEY && !!env.HCAPTCHA_SECRET,
  paystack: () => !!env.PAYSTACK_SECRET_KEY,
};

// Helper to get public environment variables (safe for client-side)
export const getPublicEnv = () => ({
  NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_HCAPTCHA_SITEKEY: env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
  NEXT_PUBLIC_SOCIAL_INSTAGRAM: env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
  NEXT_PUBLIC_SOCIAL_FACEBOOK: env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
  NEXT_PUBLIC_SOCIAL_LINKEDIN: env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  NEXT_PUBLIC_STACK_PROJECT_ID: env.NEXT_PUBLIC_STACK_PROJECT_ID,
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  NEXT_PUBLIC_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
  NODE_ENV: env.NODE_ENV,
});

// Type-safe environment variable access
export default env;
