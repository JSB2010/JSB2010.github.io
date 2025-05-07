import { Metadata } from 'next';
import ClientPage from './page';
import { generateStaticParams } from './static-params';

// For pre-rendering dynamic routes in static export mode
export { generateStaticParams };

// Metadata for the page
export const metadata: Metadata = {
  title: 'Submission Details | Admin Dashboard',
  description: 'View and manage contact form submissions'
};

// Server component wrapper for the client component
export default function SubmissionDetailServerWrapper({ params }: { params: { id: string } }) {
  return <ClientPage params={params} />;
}
