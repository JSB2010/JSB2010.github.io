# Jacob Barkin Portfolio Website

A modern, responsive portfolio website built with Next.js, Tailwind CSS, and shadcn UI, featuring accessibility and dark mode support.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn UI](https://ui.shadcn.com/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Animations**: [Aceternity UI](https://ui.aceternity.com/) components
- **Backend**: [Appwrite](https://appwrite.io/) (Database, Functions, Storage)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Static Export**: Configured for Cloudflare Pages deployment

## ✨ Features

- Modern, responsive design
- Light and dark mode support
- Accessible UI components
- Fast page loads with Next.js
- Type-safe with TypeScript
- Turbopack for faster development
- Blue-to-green gradient theme
- GitHub project integration
- Appwrite-powered contact form with email notifications
- Form persistence with auto-save and recovery
- Real-time form validation with visual feedback
- Admin dashboard for contact form submissions
- Project view tracking and analytics
- User feedback system for projects
- SEO optimized with proper metadata
- Progressive Web App (PWA) support

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Appwrite account (for backend functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JSB2010/jacobbarkin.com.git
   cd jacobbarkin.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values with your Appwrite credentials

4. Set up Appwrite:
   ```bash
   npm run setup-appwrite-complete
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the site for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run optimize-images` - Optimize images in the public/images directory
- `npm run check-a11y` - Check for accessibility issues
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run test:coverage` - Run Jest with coverage reporting
- `npm run setup-appwrite-complete` - Set up Appwrite database, collections, and functions

## 🏗️ Project Structure

- `src/app/*` - Next.js app router pages and layouts
- `src/components/*` - React components
  - `src/components/ui/*` - shadcn UI components
  - `src/components/ui/aceternity/*` - Aceternity UI components
- `src/lib/*` - Utility functions and libraries
  - `src/lib/appwrite/*` - Appwrite configuration and utilities
- `src/hooks/*` - Custom React hooks
- `functions/*` - Appwrite Functions
- `public/*` - Static assets

## 🧪 Testing

This project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npm test -- path/to/test-file.js
```

### Test Structure

- Unit tests for utility functions and hooks
- Component tests for UI components
- Integration tests for critical user flows

### Custom Hooks Testing

The project includes tests for custom hooks like `useFormPersistence` which provides form data persistence with features like:

- Auto-save and recovery
- Expiry management
- Confirmation on page navigation with unsaved changes
- Time remaining indicators

## 🚢 Deployment

### Cloudflare Pages

This project is configured for deployment to Cloudflare Pages:

1. Push your changes to GitHub
2. Connect your repository to Cloudflare Pages
3. Configure the build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variables: Add your Appwrite credentials

### Appwrite Functions

To deploy Appwrite functions:

```bash
npm run setup-appwrite-function
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

Jacob Barkin - [Contact Form](https://jacobbarkin.com/contact)

Project Link: [https://github.com/JSB2010/jacobbarkin.com](https://github.com/JSB2010/jacobbarkin.com)
