# Performance Optimization Guide

This guide explains how to use and maintain the performance optimizations implemented for the portfolio website.

## 📊 Performance Monitoring

We've set up automated performance monitoring for the site:

```bash
# Run performance monitoring manually
npm run monitor-performance

# The results will be saved in the performance-metrics/ directory
```

Performance is automatically monitored:
- After each deployment to the main branch
- Once per day (via GitHub Actions)
- On-demand via manual trigger of the GitHub Action

## 🚀 Build Optimizations

The Cloudflare Pages build process has been optimized:

### Enhanced Next.js Config

Use the enhanced Next.js configuration for production builds:

```bash
# Build with optimizations
cp next.config.enhanced.mjs next.config.mjs
npm run build
```

### Bundle Analysis

Analyze your JavaScript bundle to identify optimization opportunities:

```bash
# Run bundle analysis
npm run analyze-bundle

# Open the generated report at .next/analyze/client.html
```

## 🔄 Caching Strategy

The website uses a comprehensive caching strategy:

- **Static assets** (images): Cache for 1 year (immutable)
- **JavaScript/CSS**: Cache for 1 week with stale-while-revalidate for 1 day
- **HTML pages**: Cache for 1 hour with must-revalidate

These settings are configured in the `public/_headers` file.

## 📱 Offline Support

The site includes offline capabilities via a service worker:

- Assets are cached on first visit
- Subsequent visits can work offline for cached pages
- Updates are automatically applied when online

## 📦 Dependency Optimization

Optimize dependencies with:

```bash
# Analyze and optimize dependencies
npm run optimize-dependencies
```

Key optimization areas:
1. Import specific icons from react-icons
2. Use dynamic imports for large libraries (framer-motion)
3. Remove unused dependencies

## 📃 Documentation

For detailed information about specific optimizations:

- [Performance Optimizations](./performance-optimizations.md) - Complete list of implemented optimizations
- [Image Optimization Guide](./image-optimization.md) - Best practices for optimizing images
- [Cloudflare Pages Setup](./cloudflare-pages-setup.md) - Configuration details for Cloudflare

## 🧪 Testing Performance

Before deploying changes, test performance locally:

```bash
# Build the production version
npm run build

# Start a local production server
npm run start

# In another terminal, run performance tests
npm run monitor-performance
```

## 📈 Continuous Improvement

Performance optimization is an ongoing process:

1. Regularly check performance metrics
2. Review new dependencies before adding them
3. Optimize images before adding them
4. Update caching strategies as needed
5. Monitor Core Web Vitals in Google Search Console

By following these guidelines, we can maintain excellent performance for the website.
