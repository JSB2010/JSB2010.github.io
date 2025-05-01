"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number).fill(null).map((_, i) => {
    const size = Math.floor(Math.random() * 30) + 1;
    const top = Math.floor(Math.random() * 100);
    const left = Math.floor(Math.random() * 100);
    const animationDuration = Math.floor(Math.random() * 10) + 5;
    const delay = Math.random() * 5;

    return (
      <span
        key={i}
        className={cn(
          "absolute top-0 left-0 w-0.5 h-10 bg-gradient-to-b from-primary to-transparent rounded-full transform rotate-[25deg]",
          "animate-meteor"
        )}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size / 10}rem`,
          height: `${size}rem`,
          animationDelay: `${delay}s`,
          animationDuration: `${animationDuration}s`,
        }}
      />
    );
  });

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {meteors}
    </div>
  );
};
