"use client";

import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Moon, Sun, Laptop } from "lucide-react";

export function ThemeIndicator() {
  const { effectiveTheme, theme } = useThemeDetection();
  
  if (!effectiveTheme) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 text-xs font-medium shadow-sm">
      {theme === "system" ? (
        <>
          <Laptop className="h-3.5 w-3.5" />
          <span>System ({effectiveTheme})</span>
        </>
      ) : effectiveTheme === "dark" ? (
        <>
          <Moon className="h-3.5 w-3.5" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-3.5 w-3.5" />
          <span>Light</span>
        </>
      )}
    </div>
  );
}
