// Next.js Configuration for ES Modules

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
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
          source: '/api/:path*',
          destination: `${target}/:path*`,
        },
      ];
    }
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
