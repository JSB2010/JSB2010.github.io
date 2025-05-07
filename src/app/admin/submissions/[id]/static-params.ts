// For pre-rendering dynamic routes in static export mode
export async function generateStaticParams() {
  // For the static export, we'll pre-render a placeholder page
  return [{ id: 'placeholder' }];
}
