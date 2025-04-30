"use client";

import Image from "next/image";
import { useState } from "react";

// Define the mapping of languages to their image paths and background colors
interface LanguageConfig {
  imagePath: string;
  bgColor: string;
  textColor: string;
}

const languageConfigs: Record<string, LanguageConfig> = {
  // JavaScript and related
  JavaScript: {
    imagePath: "/images/languages/javascript.svg",
    bgColor: "linear-gradient(135deg, #f0db4f10, #f0db4f30)",
    textColor: "#323330"
  },
  TypeScript: {
    imagePath: "/images/languages/typescript.svg",
    bgColor: "linear-gradient(135deg, #007acc10, #007acc30)",
    textColor: "#007acc"
  },
  React: {
    imagePath: "/images/languages/react.svg",
    bgColor: "linear-gradient(135deg, #61dafb10, #61dafb30)",
    textColor: "#61dafb"
  },
  Vue: {
    imagePath: "/images/languages/vue.svg",
    bgColor: "linear-gradient(135deg, #42b88310, #42b88330)",
    textColor: "#42b883"
  },
  Angular: {
    imagePath: "/images/languages/angular.svg",
    bgColor: "linear-gradient(135deg, #dd003110, #dd003130)",
    textColor: "#dd0031"
  },
  Svelte: {
    imagePath: "/images/languages/svelte.svg",
    bgColor: "linear-gradient(135deg, #ff3e0010, #ff3e0030)",
    textColor: "#ff3e00"
  },
  Node: {
    imagePath: "/images/languages/nodejs.svg",
    bgColor: "linear-gradient(135deg, #68a06310, #68a06330)",
    textColor: "#68a063"
  },

  // Backend languages
  Python: {
    imagePath: "/images/languages/python.svg",
    bgColor: "linear-gradient(135deg, #30699810, #30699830)",
    textColor: "#306998"
  },
  Java: {
    imagePath: "/images/languages/java.svg",
    bgColor: "linear-gradient(135deg, #5382a110, #5382a130)",
    textColor: "#5382a1"
  },
  "C#": {
    imagePath: "/images/languages/csharp.svg",
    bgColor: "linear-gradient(135deg, #68217a10, #68217a30)",
    textColor: "#68217a"
  },
  Go: {
    imagePath: "/images/languages/go.svg",
    bgColor: "linear-gradient(135deg, #00add810, #00add830)",
    textColor: "#00add8"
  },
  Ruby: {
    imagePath: "/images/languages/ruby.svg",
    bgColor: "linear-gradient(135deg, #cc342d10, #cc342d30)",
    textColor: "#cc342d"
  },
  PHP: {
    imagePath: "/images/languages/php.svg",
    bgColor: "linear-gradient(135deg, #777bb310, #777bb330)",
    textColor: "#777bb3"
  },

  // Systems languages
  C: {
    imagePath: "/images/languages/c.svg",
    bgColor: "linear-gradient(135deg, #03599c10, #03599c30)",
    textColor: "#03599c"
  },
  "C++": {
    imagePath: "/images/languages/cpp.svg",
    bgColor: "linear-gradient(135deg, #9c033a10, #9c033a30)",
    textColor: "#9c033a"
  },
  Rust: {
    imagePath: "/images/languages/rust.svg",
    bgColor: "linear-gradient(135deg, #00000010, #00000030)",
    textColor: "#000000"
  },

  // Mobile
  Swift: {
    imagePath: "/images/languages/swift.svg",
    bgColor: "linear-gradient(135deg, #f0513810, #f0513830)",
    textColor: "#f05138"
  },
  Kotlin: {
    imagePath: "/images/languages/kotlin.svg",
    bgColor: "linear-gradient(135deg, #7f52ff10, #7f52ff30)",
    textColor: "#7f52ff"
  },
  Dart: {
    imagePath: "/images/languages/dart.svg",
    bgColor: "linear-gradient(135deg, #0175c210, #0175c230)",
    textColor: "#0175c2"
  },
  Flutter: {
    imagePath: "/images/languages/flutter.svg",
    bgColor: "linear-gradient(135deg, #02569b10, #02569b30)",
    textColor: "#02569b"
  },

  // Web
  HTML: {
    imagePath: "/images/languages/html.svg",
    bgColor: "linear-gradient(135deg, #e34c2610, #e34c2630)",
    textColor: "#e34c26"
  },
  CSS: {
    imagePath: "/images/languages/css.svg",
    bgColor: "linear-gradient(135deg, #264de410, #264de430)",
    textColor: "#264de4"
  },
  SCSS: {
    imagePath: "/images/languages/sass.svg",
    bgColor: "linear-gradient(135deg, #cc649910, #cc649930)",
    textColor: "#cc6499"
  },

  // Data
  R: {
    imagePath: "/images/languages/r.svg",
    bgColor: "linear-gradient(135deg, #276dc310, #276dc330)",
    textColor: "#276dc3"
  },
  Julia: {
    imagePath: "/images/languages/julia.svg",
    bgColor: "linear-gradient(135deg, #a270ba10, #a270ba30)",
    textColor: "#a270ba"
  },

  // Shell
  Shell: {
    imagePath: "/images/languages/shell.svg",
    bgColor: "linear-gradient(135deg, #4eaa2510, #4eaa2530)",
    textColor: "#4eaa25"
  },
  PowerShell: {
    imagePath: "/images/languages/powershell.svg",
    bgColor: "linear-gradient(135deg, #5391fe10, #5391fe30)",
    textColor: "#5391fe"
  },
  Bash: {
    imagePath: "/images/languages/bash.svg",
    bgColor: "linear-gradient(135deg, #4eaa2510, #4eaa2530)",
    textColor: "#4eaa25"
  },

  // Other
  Markdown: {
    imagePath: "/images/languages/markdown.svg",
    bgColor: "linear-gradient(135deg, #00000010, #00000030)",
    textColor: "#000000"
  },
  JSON: {
    imagePath: "/images/languages/json.svg",
    bgColor: "linear-gradient(135deg, #00000010, #00000030)",
    textColor: "#000000"
  },
  YAML: {
    imagePath: "/images/languages/yaml.svg",
    bgColor: "linear-gradient(135deg, #00000010, #00000030)",
    textColor: "#000000"
  },
};

// Fallback patterns for languages without images
const fallbackPatterns = [
  "geometric-pattern.svg",
  "wave-pattern.svg",
  "grid-pattern.svg",
  "tech-pattern.svg",
  "diagonal-pattern.svg",
];

// Default background for fallback patterns
const defaultBgColor = "linear-gradient(135deg, #3b82f610, #3b82f630)";

interface LanguageImageProps {
  language: string | null;
  seed?: number;
  className?: string;
}

export function LanguageImage({ language, seed = 0, className = "" }: Readonly<LanguageImageProps>) {
  const [imageError, setImageError] = useState(false);

  // If no language or error loading image, use a fallback pattern
  if (!language || imageError) {
    // Use the seed to select a consistent fallback pattern
    const patternIndex = seed % fallbackPatterns.length;
    const fallbackImage = `/images/languages/patterns/${fallbackPatterns[patternIndex]}`;

    return (
      <div
        className={`relative w-full h-full ${className}`}
        style={{ background: defaultBgColor }}
      >
        <Image
          src={fallbackImage}
          alt="Programming language pattern"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  // Check if we have a configuration for this language
  const languageConfig = languageConfigs[language] ?? null;

  // If we don't have a specific configuration, use a fallback pattern
  if (!languageConfig) {
    // Use the seed to select a consistent fallback pattern
    const patternIndex = seed % fallbackPatterns.length;
    const fallbackImage = `/images/languages/patterns/${fallbackPatterns[patternIndex]}`;

    return (
      <div
        className={`relative w-full h-full ${className}`}
        style={{ background: defaultBgColor }}
      >
        <Image
          src={fallbackImage}
          alt={`${language} pattern`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  // Return the language-specific image with matching background
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{ background: languageConfig.bgColor }}
    >
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <Image
          src={languageConfig.imagePath}
          alt={`${language} logo`}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}
