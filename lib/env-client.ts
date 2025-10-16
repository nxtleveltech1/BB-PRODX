// Client-safe environment variables
// This file exports only the environment variables that are safe to use in client components

interface ClientEnv {
  NODE_ENV: "development" | "production" | "test"
  NEXT_PUBLIC_ENV: "development" | "production"
  NEXT_PUBLIC_API_URL: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
  NEXT_PUBLIC_HCAPTCHA_SITEKEY?: string
  NEXT_PUBLIC_SOCIAL_INSTAGRAM?: string
  NEXT_PUBLIC_SOCIAL_FACEBOOK?: string
  NEXT_PUBLIC_SOCIAL_LINKEDIN?: string
  NEXT_PUBLIC_STACK_PROJECT_ID?: string
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY?: string
  NEXT_PUBLIC_BASE_URL?: string
  NEXT_PUBLIC_SENTRY_DSN?: string
}

const getClientEnv = (): ClientEnv => 
  // Only access NEXT_PUBLIC_ variables in client components
   ({
    NODE_ENV: (process.env.NODE_ENV as ClientEnv["NODE_ENV"]) || "development",
    NEXT_PUBLIC_ENV: (process.env.NEXT_PUBLIC_ENV as ClientEnv["NEXT_PUBLIC_ENV"]) ||
                     (process.env.NODE_ENV as ClientEnv["NEXT_PUBLIC_ENV"]) ||
                     "development",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_HCAPTCHA_SITEKEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
    NEXT_PUBLIC_SOCIAL_INSTAGRAM: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    NEXT_PUBLIC_SOCIAL_FACEBOOK: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    NEXT_PUBLIC_SOCIAL_LINKEDIN: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })


// Export for client-side usage
export const clientEnv = getClientEnv()

// Type-safe access to client environment variables
export default clientEnv

// Re-export just the type for use in other files
export type { ClientEnv }