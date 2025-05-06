"use client";

import Image from "next/image";

interface OptimizedBackgroundImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  overlayClassName?: string;
  children?: React.ReactNode;
  quality?: number;
}

/**
 * An optimized component for background images using Next.js Image
 * Provides better performance than CSS background-image
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  className = "",
  priority = false,
  overlayClassName = "",
  children,
  quality = 85,
}: OptimizedBackgroundImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        quality={quality}
      />
      {overlayClassName && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}
