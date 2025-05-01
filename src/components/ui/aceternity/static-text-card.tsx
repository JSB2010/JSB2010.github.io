"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const StaticTextCard = ({
  text,
  children,
  className,
}: {
  text: string;
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
    </div>
  );
};
