/** @type {import('next').NextConfig} */
const { promises: fs } = require('fs');
const path = require('path');

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

// Add a custom function to copy the _redirects file with the correct content
nextConfig.webpack = (config, { isServer }) => {
  // Only run on the client build once
  if (!isServer) {
    // Add a custom plugin to copy the _redirects file after the build
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tapPromise('CopyRedirectsPlugin', async (compilation) => {
          try {
            // Read the _redirects file from public directory
            const redirectsContent = await fs.readFile(path.join(__dirname, 'public', '_redirects'), 'utf8');

            // Write the _redirects file to the output directory
            await fs.writeFile(path.join(__dirname, 'out', '_redirects'), redirectsContent);

            console.log('Successfully copied _redirects file to output directory');
          } catch (error) {
            console.error('Error copying _redirects file:', error);
          }
        });
      }
    });
  }

  return config;
};

module.exports = nextConfig;
