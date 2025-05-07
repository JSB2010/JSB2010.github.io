// This file provides parameters for static site generation
// Used when building with "output: export" in next.config.mjs

export async function generateStaticParams() {
  // For the static export, we'll pre-render a placeholder page
  // This ensures Next.js doesn't error during static export
  // In a production environment, these pages would typically be protected
  // and/or fetch real data from a database
  return [{ id: 'placeholder' }];
}
