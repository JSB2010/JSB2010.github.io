"use client";

import { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

/**
 * A component that lazy loads its children when they come into view
 * 
 * @param children The content to lazy load
 * @param className Optional className for the container
 * @param placeholder Optional placeholder to show while loading
 * @param rootMargin Distance from viewport to start loading (default: "200px")
 * @param threshold Visibility threshold to trigger loading (0-1, default: 0)
 */
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
