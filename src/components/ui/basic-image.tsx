"use client";

import Image from "next/image";
import { useState } from "react";

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * A simplified version of the Next.js Image component with minimal configuration
 */
export function BasicImage({
  src,
  alt,
  className = "",
  fill = false,
  width = 800,
  height = 600,
  priority = false,
}: BasicImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If there's an error, fall back to a regular img tag
  if (hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={fill ? { width: "100%", height: "100%", objectFit: "cover" } : undefined}
      />
    );
  }

  return (
    <>
      {/* Show loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
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
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
        }}
        unoptimized={true} // Try with optimization disabled
      />
    </>
  );
}
