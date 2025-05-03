import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function to copy SPA files
async function copySPAFiles() {
  try {
    // Copy the _redirects file
    try {
      const redirectsContent = await fs.readFile(path.join(process.cwd(), 'public', '_redirects'), 'utf8');
      await fs.writeFile(path.join(process.cwd(), 'out', '_redirects'), redirectsContent);
      console.log('Successfully copied _redirects file to output directory');
    } catch (error) {
      console.error('Error copying _redirects file:', error);
    }

    // Copy the 404.html file
    try {
      const notFoundContent = await fs.readFile(path.join(process.cwd(), 'public', '404.html'), 'utf8');
      await fs.writeFile(path.join(process.cwd(), 'out', '404.html'), notFoundContent);
      console.log('Successfully copied 404.html file to output directory');
    } catch (error) {
      console.error('Error copying 404.html file:', error);
    }

    // Copy the spa-redirect.js file
    try {
      const redirectScriptContent = await fs.readFile(path.join(process.cwd(), 'public', 'spa-redirect.js'), 'utf8');
      await fs.writeFile(path.join(process.cwd(), 'out', 'spa-redirect.js'), redirectScriptContent);
      console.log('Successfully copied spa-redirect.js file to output directory');
    } catch (error) {
      console.error('Error copying spa-redirect.js file:', error);
    }

    // Modify the index.html to include the SPA redirect script
    try {
      const indexHtmlPath = path.join(process.cwd(), 'out', 'index.html');
      let indexHtmlContent = await fs.readFile(indexHtmlPath, 'utf8');

      // Check if the script is already included
      if (!indexHtmlContent.includes('spa-redirect.js')) {
        // Add the script right after the <head> tag
        indexHtmlContent = indexHtmlContent.replace(
          '<head>',
          '<head>\n    <script src="/spa-redirect.js"></script>'
        );
        await fs.writeFile(indexHtmlPath, indexHtmlContent);
        console.log('Successfully added SPA redirect script to index.html');
      }
    } catch (error) {
      console.error('Error modifying index.html:', error);
    }
  } catch (error) {
    console.error('Error in copySPAFiles:', error);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image configuration
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
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    // Unoptimize images in production for Cloudflare Pages
    unoptimized: process.env.NODE_ENV === 'production',
  },

  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configure for production builds
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export', // Static site generation
    distDir: '.next', // Output directory
    trailingSlash: true, // Add trailing slashes for better SPA routing
  } : {}),

  // Custom webpack configuration for production builds
  webpack: (config, { isServer }) => {
    // Only run on the client build once
    if (!isServer && process.env.NODE_ENV === 'production') {
      // Add a custom plugin to copy the necessary files after the build
      config.plugins?.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tapPromise('CopySPAFilesPlugin', async () => {
            await copySPAFiles();
          });
        }
      });
    }

    return config;
  },

  // Enable Turbopack
  experimental: {
    // Empty experimental section to avoid warnings
  },

  // Post-build hooks are handled in the webpack configuration
  // for production builds
};

export default nextConfig;
