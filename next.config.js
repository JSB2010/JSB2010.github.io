/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.kentdenver.org',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
    // Only unoptimize images in production build
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Only enable static export for production builds
if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'export';
}

module.exports = nextConfig;
