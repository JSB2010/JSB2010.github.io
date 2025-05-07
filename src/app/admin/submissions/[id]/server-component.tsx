// This is a server component file that exports generateStaticParams
// Used for Next.js static site generation

export async function generateStaticParams() {
  // For the static export, we'll pre-render a placeholder page
  return [{ id: 'placeholder' }];
}

// This acts as a wrapper around the client component
export default function SubmissionServerWrapper({ params }: { params: { id: string } }) {
  // This function will be run at build time to generate the static page
  return <SubmissionClientPage id={params.id} />;
}

// Import the client component
import SubmissionClientPage from './client-page';
