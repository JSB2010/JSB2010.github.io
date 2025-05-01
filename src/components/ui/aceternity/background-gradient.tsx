"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface BackgroundGradientProps {
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  children?: React.ReactNode;
}

export const BackgroundGradient = ({
  className = "",
  containerClassName = "",
  animate = true,
  children,
}: BackgroundGradientProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    if (animate) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [animate]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-xl",
        containerClassName
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary-rgb), 0.15), transparent 40%)`,
        }}
      />
      <div
        className={cn(
          "absolute inset-0 z-10 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-100 transition-opacity duration-500",
          className
        )}
      />
      {children}
    </div>
  );
};
