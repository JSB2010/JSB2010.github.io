# Tech Stack

This document provides detailed information about the technologies used in the Jacob Barkin Portfolio website.

## Frontend Technologies

### Next.js 15

[Next.js](https://nextjs.org/) is a React framework that enables server-side rendering, static site generation, and more.

**Key Features Used**:
- **App Router**: Modern routing system with nested layouts
- **Server Components**: Components that render on the server for improved performance
- **Static Site Generation**: Pre-rendering pages at build time for optimal performance
- **Image Optimization**: Automatic image optimization with the Next.js Image component
- **Font Optimization**: Automatic font optimization and loading
- **Metadata API**: SEO optimization with structured metadata
- **Turbopack**: Faster development server (in development mode)

**Version**: 15.3.2

### React 19

[React](https://react.dev/) is a JavaScript library for building user interfaces.

**Key Features Used**:
- **Hooks**: Functional components with state and lifecycle features
- **Context API**: Global state management
- **Suspense**: Loading states and code splitting
- **Server Components**: Components that render on the server

**Version**: 19.1.0

### Tailwind CSS 4

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework.

**Key Features Used**:
- **JIT (Just-In-Time) Mode**: On-demand CSS generation
- **Custom Theme**: Customized color palette and design tokens
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Built-in dark mode support
- **Animation Classes**: Tailwind animation utilities

**Version**: 4.1.5

### shadcn UI

[shadcn UI](https://ui.shadcn.com/) is a collection of reusable components built with Radix UI and Tailwind CSS.

**Key Components Used**:
- **Button**: Customizable button component
- **Card**: Card component for projects and skills
- **Dialog**: Modal dialog component
- **Dropdown Menu**: Menu component
- **Tabs**: Tab component for the admin dashboard
- **Toast**: Notification component
- **Form Components**: Input, textarea, select, etc.

**Version**: 0.9.5

### Aceternity UI

[Aceternity UI](https://ui.aceternity.com/) provides modern UI components with advanced animations.

**Key Components Used**:
- **WavyBackground**: Animated background component
- **TextRevealCard**: Text reveal animation component
- **Meteors**: Meteor animation component
- **BackgroundGradient**: Gradient background component
- **MovingBorder**: Animated border component

## Backend Technologies

### Appwrite

[Appwrite](https://appwrite.io/) is an open-source backend server that helps you build web and mobile applications.

**Key Features Used**:
- **Database**: NoSQL database for storing contact form submissions
- **Functions**: Serverless functions for email notifications
- **Authentication**: User authentication for the admin dashboard
- **SDK**: Client and server SDKs for interacting with Appwrite

**Version**: 17.0.2 (client), 16.0.0 (server)

### Node.js

[Node.js](https://nodejs.org/) is a JavaScript runtime built on Chrome's V8 JavaScript engine.

**Key Features Used**:
- **npm**: Package manager for installing dependencies
- **Scripts**: Custom scripts for development, building, and deployment
- **Environment Variables**: Configuration through environment variables

**Version**: 18.17 or later

## Form Handling

### React Hook Form

[React Hook Form](https://react-hook-form.com/) is a performant, flexible and extensible forms library.

**Key Features Used**:
- **Validation**: Form validation with error messages
- **Form State**: Form state management
- **Form Submission**: Handling form submission
- **Field Arrays**: Dynamic form fields

**Version**: 7.56.3

### Zod

[Zod](https://zod.dev/) is a TypeScript-first schema validation library.

**Key Features Used**:
- **Schema Validation**: Validating form inputs
- **Type Inference**: Generating TypeScript types from schemas
- **Error Messages**: Custom error messages for validation errors

**Version**: 3.24.4

## State Management

### Zustand

[Zustand](https://github.com/pmndrs/zustand) is a small, fast and scalable state management solution.

**Key Features Used**:
- **Global State**: Managing global application state
- **Persisted State**: Persisting state to localStorage
- **Derived State**: Computing derived state

**Version**: 5.0.4

## Styling and Design

### next-themes

[next-themes](https://github.com/pacocoursey/next-themes) provides theme support for Next.js applications.

**Key Features Used**:
- **Theme Switching**: Light and dark mode support
- **System Preference**: Detecting system color scheme preference
- **Persistence**: Persisting theme preference

**Version**: 0.4.6

### Lucide React

[Lucide React](https://lucide.dev/) is a set of beautiful, consistent icons.

**Key Features Used**:
- **Icon Components**: React components for icons
- **Customization**: Customizing icon size, color, etc.

**Version**: 0.510.0

## Testing

### Jest

[Jest](https://jestjs.io/) is a JavaScript testing framework.

**Key Features Used**:
- **Unit Tests**: Testing individual functions and components
- **Snapshot Testing**: Testing UI components
- **Mocking**: Mocking dependencies
- **Coverage Reports**: Generating test coverage reports

**Version**: 29.7.0

### React Testing Library

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) is a testing utility for React.

**Key Features Used**:
- **DOM Testing**: Testing components in a simulated DOM
- **User Events**: Simulating user interactions
- **Accessibility Testing**: Testing accessibility

**Version**: 16.3.0

## Deployment and Infrastructure

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) is a JAMstack platform for frontend developers.

**Key Features Used**:
- **Static Site Hosting**: Hosting the static site
- **Custom Domains**: Custom domain configuration
- **HTTPS**: Automatic HTTPS with Cloudflare's SSL
- **Caching**: Edge caching for improved performance
- **Headers**: Custom headers for security and caching

### GitHub Actions

[GitHub Actions](https://github.com/features/actions) is a CI/CD platform integrated with GitHub.

**Key Features Used**:
- **Workflows**: Automated workflows for building and deploying
- **Testing**: Running tests on pull requests
- **Linting**: Checking code quality
- **Deployment**: Deploying to Cloudflare Pages

## Development Tools

### TypeScript

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript.

**Key Features Used**:
- **Static Typing**: Type checking at compile time
- **Interfaces**: Defining data structures
- **Type Inference**: Automatic type inference
- **Generics**: Reusable components with different types

**Version**: 5.8.3

### ESLint

[ESLint](https://eslint.org/) is a static code analysis tool for identifying problematic patterns.

**Key Features Used**:
- **Code Quality**: Enforcing code quality standards
- **TypeScript Support**: TypeScript-specific rules
- **React Hooks Rules**: Rules for React hooks
- **Accessibility Rules**: Rules for accessibility

**Version**: 9.26.0
