"use client";

import Image from "next/image";
import { useState } from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  quality?: number;
  onLoadingComplete?: () => void; // Deprecated, use onLoad instead
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fill?: boolean;
}

/**
 * A responsive image component using Next.js Image with optimal defaults
 * and loading state handling
 */
export function ResponsiveImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  width = 800,
  height = 600,
  quality = 85,
  onLoadingComplete,
  objectFit = "cover",
  fill = false,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle image load complete
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
  };

  // Show a simple placeholder while loading
  const imageStyles = {
    objectFit,
    opacity: isLoaded || priority ? 1 : 0.5, // Make fully visible if priority or loaded
    transition: "opacity 0.3s ease-in-out",
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={!fill ? { aspectRatio: `${width}/${height}` } : undefined}>
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={!fill ? { aspectRatio: `${width}/${height}` } : undefined}
        />
      )}

      {/* Actual image */}
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          priority={priority}
          sizes={sizes}
          className={className}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyles}
          loading={priority ? "eager" : "lazy"}
          fill={fill}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300">
          <p className="text-xs">Failed to load image</p>
        </div>
      )}
    </div>
  );
}
