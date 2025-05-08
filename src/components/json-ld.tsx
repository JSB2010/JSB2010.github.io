'use client';

export default function JsonLd() {
  const baseUrl = 'https://jacobbarkin.com';

  // Base person schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jacob Barkin',
    url: baseUrl,
    sameAs: [
      'https://github.com/JSB2010',
      'https://www.linkedin.com/in/jacob-barkin/',
    ],
    jobTitle: 'Developer & Financial Education Advocate',
    knowsAbout: [
      'Web Development',
      'Financial Education',
      'Accessibility',
      'Public Transportation',
    ],
    image: `${baseUrl}/images/Updated logo.png`,
  };

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jacob Barkin Portfolio',
    url: baseUrl,
    description: 'Jacob Barkin - Developer, financial education advocate, and technology enthusiast.',
    author: {
      '@type': 'Person',
      name: 'Jacob Barkin',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
