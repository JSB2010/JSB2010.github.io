"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CardStack = ({
  items,
  offset = 10,
  scaleFactor = 0.06,
  className,
}: {
  items: React.ReactNode[];
  offset?: number;
  scaleFactor?: number;
  className?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className={cn("relative h-60 w-full md:h-80", className)}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const position = calculatePosition(index, activeIndex, items.length);
        
        return (
          <motion.div
            key={index}
            className="absolute left-0 top-0 h-full w-full rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm shadow-md"
            animate={{
              top: `${position * offset}px`,
              scale: 1 - position * scaleFactor,
              zIndex: items.length - position,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => setActiveIndex(index)}
          >
            <div className={cn("h-full w-full", isActive ? "cursor-default" : "cursor-pointer")}>
              {item}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Helper function to calculate position in the stack
const calculatePosition = (index: number, activeIndex: number, length: number) => {
  // Calculate the position relative to the active index
  let position = index - activeIndex;
  
  // If the position is negative, wrap around to the end
  if (position < 0) {
    position = length + position;
  }
  
  // Ensure position is between 0 and length-1
  return Math.min(position, length - 1);
};
