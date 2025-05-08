'use client';

import React, { useEffect, useRef } from 'react';

interface EqualHeightGridProps {
  children: React.ReactNode;
  className?: string;
}

export function EqualHeightGrid({ children, className = '' }: EqualHeightGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const equalizeCardHeights = () => {
      if (!gridRef.current) return;
      
      // Reset heights first
      const cards = gridRef.current.querySelectorAll('.card-content');
      cards.forEach(card => {
        (card as HTMLElement).style.height = 'auto';
      });
      
      // Get the maximum height
      let maxHeight = 0;
      cards.forEach(card => {
        const height = (card as HTMLElement).offsetHeight;
        maxHeight = Math.max(maxHeight, height);
      });
      
      // Apply the maximum height to all cards
      if (maxHeight > 0) {
        cards.forEach(card => {
          (card as HTMLElement).style.height = `${maxHeight}px`;
        });
      }
    };

    // Initial equalization
    equalizeCardHeights();
    
    // Re-equalize on window resize
    window.addEventListener('resize', equalizeCardHeights);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', equalizeCardHeights);
    };
  }, [children]);

  return (
    <div 
      ref={gridRef} 
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 ${className}`}
    >
      {children}
    </div>
  );
}
