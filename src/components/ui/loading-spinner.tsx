"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A simple loading spinner component
 * 
 * @param size The size of the spinner (sm, md, lg)
 * @param className Additional classes
 */
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
