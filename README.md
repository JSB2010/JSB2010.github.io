# Jacob Barkin Portfolio Website

This is a modern redesign of my personal portfolio website using Next.js and shadcn UI. The site showcases my projects, skills, and interests with a focus on accessibility and modern design.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn UI](https://ui.shadcn.com/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Animations**: [Aceternity UI](https://ui.aceternity.com/) components
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
- SEO optimized with proper metadata
- Progressive Web App (PWA) support

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
  - `src/components/project-card.tsx` - Project card component
  - `src/components/header.tsx` - Site header
  - `src/components/footer.tsx` - Site footer
  - `src/components/theme-toggle.tsx` - Theme toggle button
- `public/*` - Static assets
  - `public/images/*` - Images used throughout the site
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Adding New shadcn UI Components

To add more shadcn UI components, run:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add accordion
```

## Deployment

This site is configured for static export and can be deployed to Cloudflare Pages:

1. Build the site locally:
```bash
npm run build
```

2. The static files will be generated in the `out` directory.

3. Deploy to Cloudflare Pages by connecting your GitHub repository and configuring:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: 20.x or later

Alternatively, you can deploy to any platform that supports static sites, such as GitHub Pages, Netlify, or Vercel.

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
