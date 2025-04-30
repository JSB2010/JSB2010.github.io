# Jacob Barkin Portfolio Website

This is a modern redesign of my personal portfolio website using Next.js and shadcn UI.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn UI](https://ui.shadcn.com/)
- **Theme Switching**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Features

- Modern, responsive design
- Light and dark mode support
- Accessible UI components
- Fast page loads with Next.js
- Type-safe with TypeScript

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

## Project Structure

- `src/app/*` - Next.js app router pages
- `src/components/*` - React components
  - `src/components/ui/*` - shadcn UI components
- `public/*` - Static assets

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

This site can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or GitHub Pages.

## License

This project is open source and available under the [MIT License](LICENSE).
