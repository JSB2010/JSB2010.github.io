// next.config.enhanced.mjs
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup for bundle analyzer if ANALYZE env variable is set
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? (await import('@next/bundle-analyzer')).default({ enabled: true })
  : (config) => config;

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

    // Copy any other required files
    const filesToCopy = ['404.html', '_headers', 'robots.txt', 'manifest.webmanifest', 'service-worker.js', 'sw-register.js'];
    
    for (const file of filesToCopy) {
      try {
        const fileContent = await fs.readFile(path.join(process.cwd(), 'public', file), 'utf8');
        await fs.writeFile(path.join(process.cwd(), 'out', file), fileContent);
        console.log(`Successfully copied ${file} to output directory`);
      } catch (error) {
        console.error(`Error copying ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error copying SPA files:', error);
  }
}

// Next.js configuration
const nextConfig = withBundleAnalyzer({
  output: 'export',
  distDir: '.next',
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizeCss: true,  // Enables CSS optimization
    serverActions: true,
    serverComponentsExternalPackages: [],
    optimisticClientCache: true,
    nextScriptWorkers: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Performance optimizations for the webpack build
    if (!dev && !isServer) {
      // Use deterministic names for better caching
      config.optimization.moduleIds = 'deterministic';
      
      // Enable tree shaking to remove unused code
      config.optimization.usedExports = true;
      
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name. E.g. node_modules/packageName/sub/path
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              
              // Create a clean package name for better readability in bundles
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }
    
    return config;
  },
  // Handle post-build operations
  onBuildComplete: async () => {
    await copySPAFiles();
    console.log('Build completed with optimizations!');
  },
});

export default nextConfig;
