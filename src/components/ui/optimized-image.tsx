"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

/**
 * A standardized image component that works consistently across the site
 * Uses Next.js Image with fallback to standard img tag if needed
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  fill = false,
  width = 800,
  height = 600,
  priority = false,
  quality = 85,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If there's an error, fall back to a regular img tag
  if (hasError) {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        <img
          src={src}
          alt={alt}
          className={cn("w-full h-full object-cover", className)}
          width={width}
          height={height}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Loading placeholder */}
      {!isLoaded && !priority && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      
      {/* Next.js Image component */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={cn(
          className,
          "transition-opacity duration-300",
          isLoaded || priority ? "opacity-100" : "opacity-0"
        )}
        style={{ objectFit: "cover" }}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        unoptimized={false} // Enable optimization for production
      />
    </div>
  );
}
