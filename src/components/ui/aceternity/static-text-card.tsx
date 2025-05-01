"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const StaticTextCard = ({
  text,
  subText,
  children,
  className,
}: {
  text: string;
  subText: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-background p-8",
        className
      )}
    >
      <div className="relative z-10">
        <div className="text-2xl font-bold text-foreground">{text}</div>
        {children}
      </div>
      <div
        className="absolute inset-0 z-0 flex items-center justify-center text-5xl font-bold text-primary/40"
      >
        {subText}
      </div>
    </div>
  );
};
