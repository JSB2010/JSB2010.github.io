/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true, // Required for Cloudflare Pages
  },
  // Configure for Cloudflare Pages
  output: 'export', // Static site generation
  distDir: '.next', // Output directory
  trailingSlash: false, // Don't add trailing slashes

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
