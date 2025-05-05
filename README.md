# Jacob Barkin Portfolio Website

This is a modern redesign of my personal portfolio website using Next.js and shadcn UI. The site showcases my projects, skills, and interests with a focus on accessibility and modern design.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn UI](https://ui.shadcn.com/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Animations**: [Aceternity UI](https://ui.aceternity.com/) components
- **Backend**: [Firebase](https://firebase.google.com/) (Firestore, Functions, Analytics)
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
- Firebase-powered contact form with email notifications
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

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Enable Firestore, Functions, and Analytics
   - Copy the Firebase configuration to `.env.local` (use `.env.local.example` as a template)
   - Set up email configuration for contact form notifications (see Firebase Setup section)

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
  - `src/components/firebase/*` - Firebase integration components
  - `src/components/project-card.tsx` - Project card component
  - `src/components/header.tsx` - Site header
  - `src/components/footer.tsx` - Site footer
  - `src/components/theme-toggle.tsx` - Theme toggle button
- `src/lib/*` - Utility functions and libraries
  - `src/lib/firebase/*` - Firebase configuration and utilities
  - `src/lib/github.ts` - GitHub API integration
  - `src/lib/utils.ts` - General utility functions
- `functions/*` - Firebase Cloud Functions
  - `functions/src/index.ts` - Cloud Functions implementation
- `public/*` - Static assets
  - `public/images/*` - Images used throughout the site
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `firebase.json` - Firebase configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes configuration

## Adding New shadcn UI Components

To add more shadcn UI components, run:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add accordion
```

## Firebase Setup

This project uses Firebase for backend functionality. Follow these steps to set up Firebase:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)

2. Enable the following Firebase services:
   - Firestore Database
   - Firebase Functions
   - Firebase Analytics (optional)

3. Set up Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

   Select the following features:
   - Firestore
   - Functions
   - Hosting (optional)

4. Configure email for contact form:
   ```bash
   firebase functions:config:set email.host="smtp.gmail.com" email.port="587" email.secure="false" email.user="your-email@gmail.com" email.pass="your-app-password"
   ```

   Note: For Gmail, you need to use an App Password instead of your regular password. You can create one at https://myaccount.google.com/apppasswords

5. Deploy Firebase Functions:
   ```bash
   firebase deploy --only functions
   ```

6. Update `.env.local` with your Firebase configuration (use `.env.example` as a template)

7. **Important: Securing Firebase API Keys**
   - Firebase API keys for client-side code are designed to be public, but should still be protected
   - This project uses environment variables to store Firebase configuration
   - The `.env.local` file is included in `.gitignore` to prevent committing API keys to the repository
   - For production, add these environment variables to your hosting platform (Cloudflare Pages)
   - See the Deployment section for instructions on adding environment variables to Cloudflare Pages

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
   - Environment variables: Add your Firebase configuration variables from `.env.local` to Cloudflare Pages environment variables:
     - Go to your Cloudflare Pages project
     - Navigate to Settings > Environment variables
     - Add each variable from `.env.local` as a production environment variable
     - Make sure to add all the following variables:

       **Firebase Client Configuration:**
       - `NEXT_PUBLIC_FIREBASE_API_KEY`
       - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
       - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
       - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
       - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
       - `NEXT_PUBLIC_FIREBASE_APP_ID`
       - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

       **Firebase Admin Configuration:**
       - `FIREBASE_PROJECT_ID`

       **Email Configuration (for reference):**
       - `FIREBASE_EMAIL_HOST`
       - `FIREBASE_EMAIL_PORT`
       - `FIREBASE_EMAIL_SECURE`
       - `FIREBASE_EMAIL_USER`
       - `FIREBASE_EMAIL_PASS`

       **reCAPTCHA Configuration:**
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

- **CI Workflow**: Runs linting, tests, and build on every push and pull request
- **Lighthouse CI**: Checks performance, accessibility, best practices, and SEO

## Branch Information

- `main` - The original static HTML site
- `modern-redesign-shadcn` - The Next.js redesign with shadcn UI and Aceternity UI components

## License

This project is open source and available under the [MIT License](LICENSE).
