"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

interface SpotlightProps {
  className?: string;
  children?: React.ReactNode;
}

export const Spotlight = ({ children, className = "" }: SpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const containerSize = useRef({ w: 0, h: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updateMousePosition = (ev: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { w, h } = containerSize.current;
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    mousePosition.current = { x, y };
  };

  const updateAnimation = () => {
    if (!isHovered) {
      mouse.current.x = 0;
      mouse.current.y = 0;
      if (containerRef.current) {
        containerRef.current.style.setProperty("--x", `${0}px`);
        containerRef.current.style.setProperty("--y", `${0}px`);
      }
      return;
    }

    const { x, y } = mousePosition.current;
    const speed = 0.1;

    // Add smooth animation
    mouse.current.x += (x - mouse.current.x) * speed;
    mouse.current.y += (y - mouse.current.y) * speed;

    if (containerRef.current) {
      containerRef.current.style.setProperty("--x", `${mouse.current.x}px`);
      containerRef.current.style.setProperty("--y", `${mouse.current.y}px`);
    }

    requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerSize.current = { w: rect.width, h: rect.height };
    }
    window.addEventListener("resize", () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        containerSize.current = { w: rect.width, h: rect.height };
      }
    });

    window.addEventListener("mousemove", updateMousePosition);
    requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-md",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(var(--primary-rgb), 0.15), transparent 40%)",
        }}
      />
      {children}
    </div>
  );
};
