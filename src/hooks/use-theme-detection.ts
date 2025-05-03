"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useThemeDetection() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [effectiveTheme, setEffectiveTheme] = useState<string | undefined>(undefined);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the effective theme (what's actually being displayed)
  useEffect(() => {
    if (!mounted) return;
    
    // If theme is system, use the system preference
    if (theme === "system" && systemTheme) {
      setEffectiveTheme(systemTheme);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme, systemTheme, mounted]);

  // Function to toggle between light and dark
  const toggleTheme = () => {
    if (!mounted) return;
    
    if (effectiveTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return {
    theme,
    setTheme,
    systemTheme,
    effectiveTheme,
    toggleTheme,
    mounted,
  };
}
