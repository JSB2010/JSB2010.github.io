# Jacob Barkin Portfolio Website

This is a modern redesign of my personal portfolio website using Next.js and shadcn UI. The site showcases my projects, skills, and interests with a focus on accessibility and modern design.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn UI](https://ui.shadcn.com/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Animations**: [Aceternity UI](https://ui.aceternity.com/) components
- **Backend**: [Appwrite](https://appwrite.io/) (Database, Functions, Storage)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Static Export**: Configured for Cloudflare Pages deployment

## Features

- Modern, responsive design
- Light and dark mode support
- Accessible UI components
- Fast page loads with Next.js
- Type-safe with TypeScript
- Turbopack for faster development
- Blue-to-green gradient theme
- GitHub project integration
- Appwrite-powered contact form with email notifications
- Project view tracking and analytics
- User feedback system for projects
- SEO optimized with proper metadata
- Progressive Web App (PWA) support

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up Appwrite:
   - Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io/)
   - Set up the database, collection, and functions
   - Copy the Appwrite configuration to `.env.local` (use `.env.local.example` as a template)
   - Set up email configuration for contact form notifications (see Appwrite Setup Guide)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the site for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run optimize-images` - Optimize images in the public/images directory
- `npm run check-a11y` - Check for accessibility issues (requires the site to be running)
- `npm run test-site` - Run basic tests to verify the site is working correctly
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run test:coverage` - Run Jest with coverage reporting

## Using React Developer Tools

This project is configured to work with [React Developer Tools](https://react.dev/learn/react-developer-tools), a browser extension that helps you inspect and debug your React components.

### Setup

1. Install the React Developer Tools extension for your browser:
   - [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
   - [Edge Extension](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser's developer tools (F12 or Ctrl+Shift+I / Cmd+Option+I)

4. Look for the "Components" and "Profiler" tabs in the developer tools panel

### Features

- **Components tab**: Inspect and edit the React component tree
- **Profiler tab**: Record and analyze component render performance
- **Component state**: View and modify component state and props
- **Component search**: Find components by name or props

### Troubleshooting

If React Developer Tools isn't connecting to your application:

1. Make sure you're running the app in development mode (`npm run dev`)
2. Verify that the React Developer Tools extension is installed and enabled
3. Try restarting your browser and the development server
4. If using production build, note that React DevTools has been configured to work but with limited functionality

## Project Structure

- `src/app/*` - Next.js app router pages and layouts
  - `src/app/page.tsx` - Home page
  - `src/app/about/page.tsx` - About page
  - `src/app/projects/page.tsx` - Projects page
  - `src/app/contact/page.tsx` - Contact page
  - `src/app/public-transportation/page.tsx` - Public Transportation Research page
  - `src/app/macbook-pro-opencore/page.tsx` - MacBook Pro OpenCore page
  - `src/app/layout.tsx` - Root layout with metadata
  - `src/app/globals.css` - Global styles
- `src/components/*` - React components
  - `src/components/ui/*` - shadcn UI components
  - `src/components/ui/aceternity/*` - Aceternity UI components
  - `src/components/contact/*` - Contact form components
  - `src/components/projects/*` - Project-related components
  - `src/components/appwrite/*` - Appwrite integration components
  - `src/components/project-card.tsx` - Project card component
  - `src/components/header.tsx` - Site header
  - `src/components/footer.tsx` - Site footer
  - `src/components/theme-toggle.tsx` - Theme toggle button
- `src/lib/*` - Utility functions and libraries
  - `src/lib/appwrite/*` - Appwrite configuration and utilities
  - `src/lib/github.ts` - GitHub API integration
  - `src/lib/utils.ts` - General utility functions
- `functions/*` - Appwrite Functions
  - `functions/email-notification-updated/*` - Email notification function
- `public/*` - Static assets
  - `public/images/*` - Images used throughout the site
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `wrangler.toml` - Cloudflare Pages configuration

## Adding New shadcn UI Components

To add more shadcn UI components, run:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add accordion
```

## Appwrite Setup

This project uses Appwrite for backend functionality. Follow these steps to set up Appwrite:

1. Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io/)

2. Set up the following Appwrite services:
   - Database (for contact form submissions)
   - Functions (for email notifications)
   - Storage (optional, for future use)

3. Set up Appwrite CLI (optional):
   ```bash
   npm install -g appwrite-cli
   appwrite login
   ```

4. Configure the contact form database and collection:
   - Create a database (e.g., "contact-form-db")
   - Create a collection named "contact-submissions"
   - Add attributes for name, email, subject, message, etc.
   - Set appropriate permissions (allow create for guests)

5. Set up the email notification function:
   - Create a function in the Appwrite Console
   - Deploy the code from `functions/email-notification-updated`
   - Configure environment variables for email (EMAIL_USER, EMAIL_PASSWORD)
   - Set up a database event trigger for new submissions

6. Update `.env.local` with your Appwrite configuration (use `.env.example` as a template)

7. **Important: Securing Appwrite API Keys**
   - Appwrite API keys should be kept secure and never exposed in client-side code
   - This project uses environment variables to store Appwrite configuration
   - The `.env.local` file is included in `.gitignore` to prevent committing API keys
   - For production, add these environment variables to your hosting platform (Cloudflare Pages)
   - See the Deployment section for instructions on adding environment variables to Cloudflare Pages

For detailed setup instructions, see the [Appwrite Setup Guide](APPWRITE_SETUP_GUIDE.md).

## Deployment

This site is configured for static export and must be deployed to Cloudflare Pages:

> **Important Note**: Firebase Hosting has been disabled for this project. Do not attempt to deploy to Firebase Hosting.

1. Build the site locally:
```bash
npm run build
```

2. The static files will be generated in the `out` directory.

3. Deploy to Cloudflare Pages by connecting your GitHub repository and configuring:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: 20.x or later
   - Environment variables: Add your Appwrite configuration variables from `.env.local` to Cloudflare Pages environment variables:
     - Go to your Cloudflare Pages project
     - Navigate to Settings > Environment variables
     - Add each variable from `.env.local` as a production environment variable
     - Make sure to add all the following variables:

       **Appwrite Client Configuration:**
       - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
       - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
       - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
       - `NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID`
       - `NEXT_PUBLIC_APPWRITE_BUCKET_ID` (if using Storage)

       **Appwrite Server Configuration:**
       - `APPWRITE_API_KEY` (for server-side operations)
       - `APPWRITE_ENDPOINT`
       - `APPWRITE_PROJECT_ID`

       **reCAPTCHA Configuration (if using):**
       - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

Alternatively, you can deploy to any platform that supports static sites, such as GitHub Pages or Netlify, but Cloudflare Pages is the recommended platform.

## Testing and CI/CD

This project includes automated testing and continuous integration:

### Unit Testing

Unit tests are written using Jest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Functional Testing

A basic functional test script is included to verify the site is working correctly:

```bash
# Build the site first
npm run build

# Run the functional tests
npm run test-site
```

### Accessibility Testing

Check for accessibility issues:

```bash
# Start the development server
npm run dev

# In another terminal, run the accessibility check
npm run check-a11y
```

### Continuous Integration

This project uses GitHub Actions for CI/CD:

- **Cloudflare Pages Workflow**: Builds and deploys the site to Cloudflare Pages
- **Appwrite Deploy Workflow**: Deploys Appwrite functions when changes are made

## Branch Information

- `main` - The original static HTML site
- `modern-redesign-shadcn` - The Next.js redesign with shadcn UI and Aceternity UI components

## License

This project is open source and available under the [MIT License](LICENSE).
