# Lazy Loading Usage Examples

This document provides examples of how to implement lazy loading in different scenarios.

## Using the LazyLoad Component

The `LazyLoad` component is perfect for delaying the loading of below-the-fold content until it's about to enter the viewport:

```tsx
import { LazyLoad } from "@/components/ui/lazy-load";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function Page() {
  return (
    <div>
      {/* Above-the-fold content loads immediately */}
      <section className="h-screen">
        <h1>Welcome to My Page</h1>
        {/* ... other important content ... */}
      </section>
      
      {/* Below-the-fold content loads when user scrolls near it */}
      <LazyLoad 
        placeholder={<SkeletonCard lines={4} />}
        rootMargin="200px" // Start loading when 200px away from viewport
      >
        <section>
          <h2>Lazily Loaded Section</h2>
          <p>This content is loaded only when the user scrolls near it.</p>
          {/* ... complex content ... */}
        </section>
      </LazyLoad>
    </div>
  );
}
```

## Using Dynamic Imports

For code-splitting components at the module level:

```tsx
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Default loading state
const HeavyComponent = dynamic(
  () => import('@/components/heavy-component'),
  {
    loading: () => <LoadingSpinner size="lg" />,
    ssr: false, // Set to false for client-only components
  }
);

export default function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}
```

## Using the Aceternity UI Components Index

The Aceternity UI components can now be imported from the central index file, which handles lazy loading automatically:

```tsx
import { 
  WavyBackground, 
  TextRevealCard,
  Meteors,
  // These are dynamically imported
  
  // These are directly imported (lighter components)
  BackgroundGradient,
  MovingBorder,
  StaticTextCard 
} from '@/components/ui/aceternity';

export default function Page() {
  return (
    <div>
      {/* These components will be dynamically imported */}
      <WavyBackground>...</WavyBackground>
      <TextRevealCard text="Hello" revealText="Hello World">...</TextRevealCard>
      <Meteors>...</Meteors>
      
      {/* These components will be included in the main bundle */}
      <BackgroundGradient>...</BackgroundGradient>
      <MovingBorder>...</MovingBorder>
      <StaticTextCard>...</StaticTextCard>
    </div>
  );
}
```

## Lazy Loading with Suspense

For more control over loading states:

```tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

## Conditional Lazy Loading

For components that only load based on user interaction:

```tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const DetailView = dynamic(() => import('@/components/detail-view'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export default function Page() {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowDetails(true)}>
        Show Details
      </Button>
      
      {showDetails && <DetailView />}
    </div>
  );
}
```

## Lazy Loading for Rich Text Editor

Complex components like rich text editors benefit greatly from lazy loading:

```tsx
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Rich text editors often have large dependencies and should be lazy loaded
const RichTextEditor = dynamic(
  () => import('@/components/rich-text-editor'),
  {
    loading: () => (
      <div className="border rounded-md p-4">
        <LoadingSpinner />
        <p className="text-center text-muted-foreground">Loading editor...</p>
      </div>
    ),
    ssr: false, // Rich text editors often depend on browser APIs
  }
);

export default function CommentForm() {
  return (
    <form>
      <h2>Add Your Comment</h2>
      <RichTextEditor />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Lazy Loading for Charts

Data visualization components are excellent candidates for lazy loading:

```tsx
import dynamic from 'next/dynamic';
import { SkeletonCard } from '@/components/ui/skeleton-card';

const Chart = dynamic(
  () => import('@/components/chart').then(mod => mod.Chart),
  {
    loading: () => <SkeletonCard hasImage={true} imageHeight={300} lines={0} />,
    ssr: false, // Many chart libraries require browser APIs
  }
);

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <Chart data={analyticsData} height={300} />
    </div>
  );
}
```
