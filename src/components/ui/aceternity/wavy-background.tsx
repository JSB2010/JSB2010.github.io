"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  animate?: boolean;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors = ["#0ea5e9", "#38bdf8", "#0284c7", "#0369a1"],
  waveWidth = 50,
  backgroundFill = "transparent",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  animate = true,
}: WavyBackgroundProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement[]>([]);
  const waveSpeed = speed === "fast" ? 0.5 : 0.15;

  useEffect(() => {
    if (!animate) return;

    let animationFrameId: number;
    let phase = 0;

    const animateWaves = () => {
      phase += waveSpeed;
      const paths = pathRef.current;
      
      if (paths.length > 0) {
        paths.forEach((path, i) => {
          const baseFrequency = 0.001 + i * 0.0005;
          const amplitude = 20 - i * 5;
          
          let d = `M 0 ${100 + amplitude * Math.sin(phase * 0.5)}`;
          
          for (let x = waveWidth; x <= 1000; x += waveWidth) {
            const y = 100 + amplitude * Math.sin(phase + x * baseFrequency);
            d += ` L ${x} ${y}`;
          }
          
          d += ` L 1000 400 L 0 400 Z`;
          path.setAttribute("d", d);
        });
      }
      
      animationFrameId = requestAnimationFrame(animateWaves);
    };
    
    animateWaves();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animate, waveSpeed, waveWidth]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <svg
        ref={svgRef}
        className="absolute w-full h-full inset-0"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        style={{
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      >
        <rect width="1000" height="400" fill={backgroundFill} />
        {colors.map((color, i) => (
          <path
            key={i}
            ref={(el) => {
              if (el) pathRef.current[i] = el;
            }}
            fill={color}
            fillOpacity={waveOpacity}
          />
        ))}
      </svg>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
