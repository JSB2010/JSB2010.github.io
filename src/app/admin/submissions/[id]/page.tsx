export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function SubmissionPage({ params }) {
  return <div>Placeholder for ID: {params.id}</div>;
}
