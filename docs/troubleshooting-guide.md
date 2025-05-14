# Troubleshooting Guide

This document provides solutions for common issues you might encounter when working with the Jacob Barkin Portfolio website.

## Table of Contents

- [Development Issues](#development-issues)
  - [Next.js Development Server](#nextjs-development-server)
  - [Build Errors](#build-errors)
  - [TypeScript Errors](#typescript-errors)
  - [Styling Issues](#styling-issues)
- [Appwrite Integration Issues](#appwrite-integration-issues)
  - [Connection Issues](#connection-issues)
  - [Authentication Issues](#authentication-issues)
  - [Database Issues](#database-issues)
  - [Function Issues](#function-issues)
- [Deployment Issues](#deployment-issues)
  - [Cloudflare Pages Issues](#cloudflare-pages-issues)
  - [Environment Variable Issues](#environment-variable-issues)
  - [Static Export Issues](#static-export-issues)
- [Performance Issues](#performance-issues)
  - [Image Optimization Issues](#image-optimization-issues)
  - [Bundle Size Issues](#bundle-size-issues)
- [Common Error Messages](#common-error-messages)

## Development Issues

### Next.js Development Server

#### Issue: Development server won't start

**Symptoms**:
- Error when running `npm run dev`
- Server starts but crashes immediately
- "Port 3000 is already in use" error

**Solutions**:

1. **Port already in use**:
   ```bash
   # Find the process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   
   # Or start on a different port
   npm run dev -- -p 3001
   ```

2. **Node modules issues**:
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

3. **Next.js cache issues**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

#### Issue: Hot reloading not working

**Symptoms**:
- Changes to files don't trigger a reload
- Need to manually restart the server to see changes

**Solutions**:

1. **Check file watching limits** (Linux):
   ```bash
   # Increase file watching limits
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Disable Turbopack**:
   ```bash
   # Start without Turbopack
   npm run dev:no-turbo
   ```

3. **Check for syntax errors**:
   - Look for syntax errors in your code that might prevent hot reloading
   - Check the terminal for error messages

### Build Errors

#### Issue: Build fails with module resolution errors

**Symptoms**:
- "Cannot find module" errors during build
- "Module not found" errors

**Solutions**:

1. **Check import paths**:
   - Ensure import paths are correct
   - Use absolute imports with `@/` prefix for src directory

2. **Check tsconfig.json**:
   - Ensure paths are correctly configured in tsconfig.json
   - Make sure baseUrl is set correctly

3. **Clear cache and rebuild**:
   ```bash
   rm -rf .next
   npm run build
   ```

#### Issue: Build fails with memory issues

**Symptoms**:
- "JavaScript heap out of memory" error
- Build process crashes

**Solutions**:

1. **Increase Node.js memory limit**:
   ```bash
   # For macOS/Linux
   export NODE_OPTIONS="--max-old-space-size=4096"
   
   # For Windows
   set NODE_OPTIONS=--max-old-space-size=4096
   ```

2. **Optimize imports**:
   - Check for large dependencies that can be code-split
   - Use dynamic imports for large components

### TypeScript Errors

#### Issue: TypeScript type errors

**Symptoms**:
- Type errors during development or build
- "Property does not exist on type" errors

**Solutions**:

1. **Check type definitions**:
   - Ensure types are correctly defined
   - Use proper type annotations for variables and functions

2. **Update TypeScript**:
   ```bash
   npm update typescript
   ```

3. **Check tsconfig.json**:
   - Ensure strict mode settings match your needs
   - Check for conflicting type definitions

### Styling Issues

#### Issue: Tailwind styles not applying

**Symptoms**:
- Tailwind classes not working
- Unexpected styling behavior

**Solutions**:

1. **Check Tailwind configuration**:
   - Ensure tailwind.config.js includes all necessary files
   - Check for conflicting CSS that might override Tailwind

2. **Rebuild Tailwind**:
   ```bash
   # Force Tailwind to rebuild
   npx tailwindcss -i ./src/styles/globals.css -o ./src/styles/output.css --watch
   ```

3. **Check for CSS specificity issues**:
   - Use the browser inspector to check which styles are being applied
   - Use `!important` sparingly to override conflicting styles

## Appwrite Integration Issues

### Connection Issues

#### Issue: Cannot connect to Appwrite

**Symptoms**:
- "Failed to connect to Appwrite" errors
- API requests failing with network errors

**Solutions**:

1. **Check Appwrite endpoint**:
   - Ensure `NEXT_PUBLIC_APPWRITE_ENDPOINT` is correct
   - Verify the Appwrite server is running

2. **Check project ID**:
   - Ensure `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
   - Verify the project exists in Appwrite

3. **Check CORS settings**:
   - Add your domain to the Appwrite project's platforms list
   - For local development, add `http://localhost:3000`

### Authentication Issues

#### Issue: Cannot log in to admin dashboard

**Symptoms**:
- Login fails with authentication errors
- "Invalid credentials" errors

**Solutions**:

1. **Check credentials**:
   - Verify username and password
   - Reset password if necessary

2. **Check authentication configuration**:
   - Ensure email/password authentication is enabled in Appwrite
   - Check for IP restrictions or security rules

3. **Check session configuration**:
   - Verify session duration settings
   - Clear browser cookies and try again

### Database Issues

#### Issue: Cannot create or read documents

**Symptoms**:
- "Permission denied" errors
- "Collection not found" errors

**Solutions**:

1. **Check database and collection IDs**:
   - Ensure `NEXT_PUBLIC_APPWRITE_DATABASE_ID` is correct
   - Ensure `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` is correct

2. **Check permissions**:
   - Verify collection permissions in Appwrite
   - Ensure the API key has sufficient permissions

3. **Check document structure**:
   - Ensure document structure matches collection schema
   - Check for required fields

### Function Issues

#### Issue: Email notification function not working

**Symptoms**:
- Contact form submissions don't send emails
- Function execution fails

**Solutions**:

1. **Check function configuration**:
   - Ensure `NEXT_PUBLIC_APPWRITE_FUNCTION_ID` is correct
   - Verify the function is deployed and active

2. **Check function logs**:
   - Check execution logs in Appwrite console
   - Look for error messages

3. **Check environment variables**:
   - Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set correctly
   - Verify Gmail app password is valid

## Deployment Issues

### Cloudflare Pages Issues

#### Issue: Deployment fails

**Symptoms**:
- Build fails in Cloudflare Pages
- Deployment completes but site doesn't work

**Solutions**:

1. **Check build settings**:
   - Ensure build command is `npm run build`
   - Ensure output directory is `out`

2. **Check build logs**:
   - Review build logs for errors
   - Look for missing dependencies or configuration issues

3. **Check environment variables**:
   - Ensure all required environment variables are set in Cloudflare Pages
   - Check for typos in variable names

### Environment Variable Issues

#### Issue: Environment variables not available in production

**Symptoms**:
- "Cannot read property of undefined" errors
- Features depending on environment variables don't work

**Solutions**:

1. **Check variable prefixes**:
   - Ensure client-side variables start with `NEXT_PUBLIC_`
   - Server-side variables should not be accessed in client code

2. **Check Cloudflare Pages settings**:
   - Add environment variables in Cloudflare Pages dashboard
   - Set variables for both Production and Preview environments

3. **Use fallback values**:
   - Implement fallback values for critical environment variables
   - Use optional chaining when accessing potentially undefined values

### Static Export Issues

#### Issue: Static export missing pages or assets

**Symptoms**:
- Some pages return 404 in production
- Images or other assets are missing

**Solutions**:

1. **Check next.config.mjs**:
   - Ensure `output: 'export'` is set
   - Check image configuration for static exports

2. **Check for dynamic routes**:
   - Implement `generateStaticParams()` for dynamic routes
   - Ensure all dynamic routes are properly exported

3. **Check for client-side only code**:
   - Ensure code that depends on browser APIs is wrapped in useEffect
   - Use dynamic imports with ssr: false for browser-only components

## Performance Issues

### Image Optimization Issues

#### Issue: Images are slow to load or not optimized

**Symptoms**:
- Large image file sizes
- Slow page load times
- Layout shifts when images load

**Solutions**:

1. **Use OptimizedImage component**:
   - Replace standard img tags with OptimizedImage component
   - Set appropriate width, height, and sizes

2. **Run image optimization script**:
   ```bash
   npm run optimize-images
   ```

3. **Check image formats**:
   - Use WebP format for better compression
   - Ensure images are appropriately sized for their display size

### Bundle Size Issues

#### Issue: Large JavaScript bundle size

**Symptoms**:
- Slow initial page load
- High Lighthouse score for JavaScript size

**Solutions**:

1. **Analyze bundle**:
   ```bash
   npm run analyze-bundle
   ```

2. **Use dynamic imports**:
   - Import heavy components dynamically
   - Use React.lazy for code splitting

3. **Optimize dependencies**:
   - Remove unused dependencies
   - Use smaller alternatives where possible
   - Implement tree shaking

## Common Error Messages

### "Error: ENOENT: no such file or directory"

**Cause**: File or directory not found

**Solutions**:
- Check file paths and ensure they are correct
- Ensure the file exists in the specified location
- Check for case sensitivity issues in file names

### "TypeError: Cannot read property 'X' of undefined"

**Cause**: Trying to access a property of an undefined value

**Solutions**:
- Use optional chaining: `object?.property`
- Add null checks before accessing properties
- Provide default values: `object?.property || defaultValue`

### "Error: API key not found"

**Cause**: Missing or invalid Appwrite API key

**Solutions**:
- Check that the API key is set in environment variables
- Verify the API key has the necessary permissions
- Generate a new API key if necessary

### "CORS error: No 'Access-Control-Allow-Origin' header"

**Cause**: Cross-Origin Resource Sharing (CORS) issue with Appwrite

**Solutions**:
- Add your domain to the Appwrite project's platforms list
- For local development, add `http://localhost:3000`
- Check that the Appwrite endpoint is correct
