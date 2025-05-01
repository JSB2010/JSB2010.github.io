"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  glareClassName?: string;
  rotationIntensity?: number;
  glareOpacity?: number;
  glareSize?: number;
  showGlare?: boolean;
}

export const ThreeDCard = ({
  children,
  className,
  containerClassName,
  cardClassName,
  glareClassName,
  rotationIntensity = 20,
  glareOpacity = 0.3,
  glareSize = 0.4,
  showGlare = true,
}: ThreeDCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cardRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    // Calculate rotation based on mouse position
    // Convert to percentage (-0.5 to 0.5) then multiply by rotation intensity
    const rotateY = ((mouseX / containerRect.width) - 0.5) * rotationIntensity;
    const rotateX = ((mouseY / containerRect.height) - 0.5) * -rotationIntensity;
    
    // Update rotation state
    setRotation({ x: rotateX, y: rotateY });
    
    // Update glare position if glare is enabled
    if (showGlare && glareRef.current) {
      const glareX = (mouseX / containerRect.width) * 100;
      const glareY = (mouseY / containerRect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={cn("perspective-1000px w-full h-full", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={cn(
          "w-full h-full relative transition-transform duration-200 ease-out transform-gpu",
          isHovered ? "transition-none" : "transition-transform duration-500",
          cardClassName
        )}
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            : "rotateX(0deg) rotateY(0deg)",
        }}
      >
        {showGlare && (
          <div
            ref={glareRef}
            className={cn(
              "absolute inset-0 pointer-events-none overflow-hidden rounded-xl",
              glareClassName
            )}
          >
            <div
              className="absolute w-full h-full opacity-0 pointer-events-none transition-opacity duration-500"
              style={{
                opacity: isHovered ? glareOpacity : 0,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.8) 0%, transparent ${glareSize * 100}%)`,
              }}
            />
          </div>
        )}
        <div className={cn("h-full w-full", className)}>{children}</div>
      </div>
    </div>
  );
};
