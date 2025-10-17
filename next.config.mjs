// Next.js Configuration for ES Modules

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'scontent.cdninstagram.com' },
      { protocol: 'https', hostname: '**.cdninstagram.com' }
    ]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Temporarily ignore ESLint during builds to avoid blocking on config availability in CI
    ignoreDuringBuilds: true,
  },
  // Skip output file tracing to avoid sharp permission issues on Windows
  experimental: {
    outputFileTracingIncludes: {},
    outputFileTracingExcludes: {
      '*': ['**/@img/**', '**/sharp/**'],
    },
  },
  async rewrites() {
    let target = process.env.NEXT_PUBLIC_API_URL;
    // In development, default to local backend if not set
    if (!target && process.env.NODE_ENV !== 'production') {
      target = 'http://localhost:3001/api';
    }
    if (target) {
      return [
        {
          // NextAuth routes should NOT be proxied - they run locally in Next.js
          source: '/api/auth/:path*',
          destination: '/api/auth/:path*',
        },
        {
          // All other /api routes are proxied to the backend
          source: '/api/:path*',
          destination: `${target}/:path*`,
        },
      ];
    }
    // If no target, auth routes still work locally
    return [];
  },
  async headers() {
    // In development, aggressively disable caching to avoid serving stale client chunks
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
            { key: 'Pragma', value: 'no-cache' },
            { key: 'Expires', value: '0' },
          ],
        },
      ];
    }
    return [];
  },
}

export default nextConfig
