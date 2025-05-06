"use client";

import { Card, CardContent } from "./card";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  imageHeight?: number;
  hasImage?: boolean;
}

/**
 * A skeleton loading card component
 * 
 * @param className Additional classes
 * @param lines Number of text lines to show (default: 3)
 * @param imageHeight Height of the image placeholder in pixels (default: 180)
 * @param hasImage Whether to show an image placeholder (default: true)
 */
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
