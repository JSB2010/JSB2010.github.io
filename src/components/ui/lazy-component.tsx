"use client";

import { Suspense } from 'react';
import { LoadingSpinner } from './loading-spinner';

interface LazyComponentProps {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

/**
 * Lazily renders a component with Suspense
 * 
 * @param component The component to lazy load
 * @param props Props to pass to the component
 * @param fallback Optional custom fallback while loading
 */
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
