// This function gets called at build time to generate static paths
export async function generateStaticParams() {
  // For production builds with dynamic routes, return a placeholder
  return [{ id: 'placeholder' }];
}
