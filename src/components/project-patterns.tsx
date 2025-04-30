"use client";

import React from "react";

// Pattern 1: Geometric pattern
export const GeometricPattern = ({ seed = 0, color = '#3B82F6' }: { seed?: number, color?: string }) => {
  // Use seed to create variations
  const offset1 = (seed % 5) * 10;
  const offset2 = ((seed + 2) % 5) * 10;

  // Create a semi-transparent version of the color
  const bgColor = `${color}1A`; // 10% opacity

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute w-40 h-40 rounded-full"
        style={{
          top: `-${10 + offset1}px`,
          left: `-${10 + offset2}px`,
          backgroundColor: bgColor
        }}
      />
      <div
        className="absolute w-32 h-32 rounded-full"
        style={{
          bottom: `${5 + offset2}px`,
          right: `${5 + offset1}px`,
          backgroundColor: bgColor
        }}
      />
      <div
        className="absolute w-24 h-24 rounded-full"
        style={{
          top: `${20 + offset1}px`,
          right: `${10 + offset2}px`,
          backgroundColor: bgColor
        }}
      />
    </div>
  );
};

// Pattern 2: Wave pattern
export const WavePattern = ({ seed = 0, color = '#3B82F6' }: { seed?: number, color?: string }) => {
  // Use seed to create variations
  const offset = (seed % 3) * 5;

  // Create a semi-transparent version of the color
  const bgColor = `${color}1A`; // 10% opacity

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute w-full h-32 rounded-full transform scale-150"
        style={{
          bottom: `-${10 + offset}px`,
          left: `${offset}px`,
          backgroundColor: bgColor
        }}
      />
      <div
        className="absolute w-full h-24 rounded-full transform scale-125"
        style={{
          bottom: `-${5 + offset}px`,
          left: `${10 + offset}px`,
          backgroundColor: bgColor
        }}
      />
      <div
        className="absolute w-full h-16 rounded-full"
        style={{
          bottom: `${offset}px`,
          left: `${20 + offset}px`,
          backgroundColor: bgColor
        }}
      />
    </div>
  );
};

// Pattern 3: Diagonal pattern
export const DiagonalPattern = ({ seed = 0, color = '#3B82F6' }: { seed?: number, color?: string }) => {
  // Use seed to create variations
  const size = 66 + (seed % 4) * 5;

  // Create a semi-transparent version of the color
  const bgColor = `${color}1A`; // 10% opacity

  return (
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-full h-full"
        style={{
          background: `linear-gradient(to bottom right, ${bgColor}, transparent)`
        }}
      />
      <div
        className="absolute bottom-0 right-0 rounded-tl-3xl"
        style={{
          width: `${size}%`,
          height: `${size}%`,
          backgroundColor: bgColor
        }}
      />
    </div>
  );
};

// Pattern 4: Grid pattern
export const GridPattern = ({ seed = 0, color = '#3B82F6' }: { seed?: number, color?: string }) => {
  // Use seed to create variations
  const cols = 3 + (seed % 3);
  const rows = 3 + ((seed + 1) % 3);

  // Create semi-transparent versions of the color
  const bgColorLight = `${color}1A`; // 10% opacity
  const bgColorDark = `${color}33`;  // 20% opacity

  return (
    <div className="absolute inset-0 p-4" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '8px'
    }}>
      {Array(rows).fill(0).map((_, rowIndex) =>
        Array(cols).fill(0).map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="rounded-md"
            style={{
              backgroundColor: ((rowIndex + colIndex + seed) % 3 === 0) ? bgColorDark : bgColorLight
            }}
          />
        ))
      )}
    </div>
  );
};

// Pattern 5: Tech pattern
export const TechPattern = ({ seed = 0, color = '#3B82F6' }: { seed?: number, color?: string }) => {
  // Use seed to create variations
  const offset = (seed % 4) * 5;

  // Create a semi-transparent version of the color
  const borderColor = `${color}33`; // 20% opacity

  return (
    <div className="absolute inset-0">
      <div
        className="absolute border-2 rounded-lg"
        style={{
          top: `${5 + offset}px`,
          left: `${5 + offset}px`,
          width: `${20 + offset}px`,
          height: `${20 + offset}px`,
          borderColor: borderColor
        }}
      />
      <div
        className="absolute border-2 rounded-full"
        style={{
          bottom: `${5 + offset}px`,
          right: `${5 + offset}px`,
          width: `${16 + offset}px`,
          height: `${16 + offset}px`,
          borderColor: borderColor
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 rotate-45"
        style={{
          width: `${24 + offset}px`,
          backgroundColor: borderColor
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 -rotate-45"
        style={{
          width: `${24 + offset}px`,
          backgroundColor: borderColor
        }}
      />
    </div>
  );
};

// Language icon component
export const LanguageIcon = ({
  language,
  color,
  showLetter = true
}: {
  language: string | null,
  color: string,
  showLetter?: boolean
}) => {
  if (!language || !showLetter) return null;

  return (
    <div className="relative z-10 h-16 w-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
        style={{ backgroundColor: color }}
      >
        {language.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

// Get pattern component based on index, seed, and language
export const getPatternComponent = (patternIndex: number, seed: number, language?: string | null, color?: string) => {
  // Default color if none provided
  const patternColor = color ?? '#3B82F6';

  // Create props with color
  const props = {
    seed,
    color: patternColor
  };

  switch(patternIndex) {
    case 0:
      return <GeometricPattern {...props} />;
    case 1:
      return <WavePattern {...props} />;
    case 2:
      return <DiagonalPattern {...props} />;
    case 3:
      return <GridPattern {...props} />;
    case 4:
      return <TechPattern {...props} />;
    default:
      return <GeometricPattern {...props} />;
  }
};
