"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const StaticTextCard = ({
  text,
  children,
  className,
  gradientText = false,
  textSize = "text-2xl",
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
  gradientText?: boolean;
  textSize?: string;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-background p-8",
        className
      )}
    >
      <div className="relative z-10">
        <div className={cn(
          textSize, "font-bold",
          gradientText
            ? "gradient-text"
            : "text-foreground"
        )}>
          {text}
        </div>
        {children}
      </div>
    </div>
  );
};
