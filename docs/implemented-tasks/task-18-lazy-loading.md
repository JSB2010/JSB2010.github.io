# Implementation of Task #18: Add lazy loading for components

This document outlines the implementation of lazy loading for components that aren't needed on initial page load, improving performance and reducing the initial bundle size.

## Components Created

### 1. LazyLoad Component

Created a versatile `LazyLoad` component that uses the Intersection Observer API to load components only when they come into view:

```tsx
// src/components/ui/lazy-load.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function LazyLoad({ 
  children, 
  className = "", 
  placeholder, 
  rootMargin = "200px", 
  threshold = 0 
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [rootMargin, threshold]);

  // Default placeholder is just a div with the same height
  const defaultPlaceholder = (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight: ref.current?.offsetHeight || 200 }}
    >
      <div className="animate-pulse bg-muted rounded-md w-full h-full min-h-[200px]"></div>
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder || defaultPlaceholder}
    </div>
  );
}
```

### 2. LazyComponent with Suspense

Created a `LazyComponent` wrapper that uses React's Suspense for component-level code splitting:

```tsx
// src/components/ui/lazy-component.tsx
"use client";

import { Suspense } from 'react';
import { LoadingSpinner } from './loading-spinner';

interface LazyComponentProps {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

export function LazyComponent({ 
  component: Component, 
  props = {}, 
  fallback 
}: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
}
```

### 3. Loading Indicator Components

Created consistent loading indicator components:

#### LoadingSpinner

```tsx
// src/components/ui/loading-spinner.tsx
"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-primary border-r-transparent border-b-primary border-l-transparent`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
```

#### SkeletonCard

```tsx
// src/components/ui/skeleton-card.tsx
"use client";

import { Card, CardContent } from "./card";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  imageHeight?: number;
  hasImage?: boolean;
}

export function SkeletonCard({ 
  className = "", 
  lines = 3, 
  imageHeight = 180,
  hasImage = true,
}: SkeletonCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {hasImage && (
        <div 
          className="bg-muted animate-pulse" 
          style={{ height: `${imageHeight}px` }}
        ></div>
      )}
      <CardContent className="p-4">
        {/* Title */}
        <div className="h-6 bg-muted rounded-md animate-pulse w-3/4 mb-4"></div>
        
        {/* Content lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={`h-4 bg-muted rounded-md animate-pulse ${i === lines - 1 ? 'w-1/2' : 'w-full'} ${i < lines - 1 ? 'mb-2' : ''}`}
            style={{ 
              animationDelay: `${i * 100}ms`,
              opacity: 1 - (i * 0.1) // Gradually reduce opacity for each line
            }}
          ></div>
        ))}
      </CardContent>
    </Card>
  );
}
```

## Usage Examples

### 1. Lazy Loading Below-the-Fold Sections

For sections of the page that aren't initially visible:

```tsx
import { LazyLoad } from "@/components/ui/lazy-load";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function Page() {
  return (
    <div>
      {/* Above-the-fold content */}
      <section className="min-h-screen">
        <h1>Visible immediately</h1>
        {/* ... */}
      </section>
      
      {/* Below-the-fold content */}
      <LazyLoad 
        placeholder={<SkeletonCard lines={5} />}
        rootMargin="100px"
      >
        <section className="min-h-screen">
          <h2>Heavy content loaded when scrolled near</h2>
          {/* ... */}
        </section>
      </LazyLoad>
    </div>
  );
}
```

### 2. Dynamically Importing Heavy Components

For large components that increase bundle size:

```tsx
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Dynamic import with custom loading state
const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  {
    loading: () => <LoadingSpinner size="lg" />,
    ssr: false, // Disable SSR for client-only components
  }
);

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <HeavyChart data={analyticsData} />
    </div>
  );
}
```

### 3. Combining LazyLoad with Dynamic Imports

For optimal performance, combining both techniques:

```tsx
import dynamic from 'next/dynamic';
import { LazyLoad } from '@/components/ui/lazy-load';
import { SkeletonCard } from '@/components/ui/skeleton-card';

const ComplexWidget = dynamic(
  () => import('@/components/complex-widget'),
  { ssr: false }
);

export default function Page() {
  return (
    <div>
      {/* Other content */}
      
      <LazyLoad 
        placeholder={<SkeletonCard />}
        rootMargin="200px"
      >
        <ComplexWidget />
      </LazyLoad>
    </div>
  );
}
```

## Components to Apply Lazy Loading

The following components are good candidates for lazy loading:

1. **Aceternity UI Components**: These are visually rich components that may not be needed immediately:
   - WavyBackground, Meteors, CardHoverEffect, etc.

2. **Content Sections on the Home Page**: Sections below the initial viewport:
   - Featured Projects section
   - Interests section
  
3. **Heavy Components**:
   - Chart components
   - Rich text editors
   - Maps and complex visualizations

4. **Modal Dialogs and Popovers**:
   - Contact forms
   - Authentication forms
   - Detail views

## Next Steps

1. Apply the lazy loading components to the home page sections
2. Convert heavy Aceternity UI components to use lazy loading
3. Implement dynamic imports for specialized components
4. Measure performance improvements
5. Adjust loading thresholds based on user experience data

## Benefits

- **Reduced Initial Bundle Size**: By delaying the loading of non-essential components
- **Faster Time to Interactive**: Critical UI is available more quickly
- **Improved Performance Metrics**: Better Core Web Vitals scores
- **Enhanced User Experience**: Progressive loading with appropriate loading states
