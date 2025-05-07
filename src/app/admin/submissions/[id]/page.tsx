// This is a server component file that exports generateStaticParams
// Used for Next.js static site generation

// Define the generateStaticParams function directly in this file
export async function generateStaticParams() {
  // For the static export, we'll pre-render a placeholder page
  return [{ id: 'placeholder' }];
}

// This acts as a wrapper around the client component
export default function SubmissionPage({ params }: { params: { id: string } }) {
  // This function will be run at build time to generate the static page
  return <ClientPage params={params} />;
}

// Import the client component
import ClientPage from './client-page';