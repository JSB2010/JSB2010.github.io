import type { NextConfig } from "next";
import { promises as fs } from 'fs';
import path from 'path';
import { Configuration as WebpackConfig } from 'webpack';

// Define a more specific type for the webpack function
interface CustomNextConfig extends NextConfig {
  webpack?: (
    config: WebpackConfig,
    options: { isServer: boolean }
  ) => WebpackConfig;
}

const nextConfig: CustomNextConfig = {
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

  // Add trailing slash for better SPA routing
  nextConfig.trailingSlash = true;
}

// Add a custom function to copy the _redirects file and other SPA routing files
nextConfig.webpack = (config, { isServer }) => {
  // Only run on the client build once
  if (!isServer) {
    // Add a custom plugin to copy the necessary files after the build
    config.plugins?.push({
      apply: (compiler: any) => {
        compiler.hooks.afterEmit.tapPromise('CopySPAFilesPlugin', async (compilation: any) => {
          try {
            // Read the _redirects file from public directory
            const redirectsContent = await fs.readFile(path.join(process.cwd(), 'public', '_redirects'), 'utf8');

            // Write the _redirects file to the output directory
            await fs.writeFile(path.join(process.cwd(), 'out', '_redirects'), redirectsContent);
            console.log('Successfully copied _redirects file to output directory');

            // Copy the 404.html file if it exists
            try {
              const notFoundContent = await fs.readFile(path.join(process.cwd(), 'public', '404.html'), 'utf8');
              await fs.writeFile(path.join(process.cwd(), 'out', '404.html'), notFoundContent);
              console.log('Successfully copied 404.html file to output directory');
            } catch (error) {
              console.error('Error copying 404.html file:', error);
            }

            // Copy the spa-redirect.js file if it exists
            try {
              const redirectScriptContent = await fs.readFile(path.join(process.cwd(), 'public', 'spa-redirect.js'), 'utf8');
              await fs.writeFile(path.join(process.cwd(), 'out', 'spa-redirect.js'), redirectScriptContent);
              console.log('Successfully copied spa-redirect.js file to output directory');
            } catch (error) {
              console.error('Error copying spa-redirect.js file:', error);
            }

            // Modify the index.html to include the SPA redirect script if not already included
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
            console.error('Error in CopySPAFilesPlugin:', error);
          }
        });
      }
    });
  }

  return config;
};

export default nextConfig;
