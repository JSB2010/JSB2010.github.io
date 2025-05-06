// src/components/ui/motion-wrapper.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import framer-motion to reduce initial bundle size
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.motion.div })),
  { ssr: false, loading: () => <div className="motion-loading"></div> }
);

export type MotionProps = {
  children: React.ReactNode;
  className?: string;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  whileInView?: Record<string, any>;
  viewport?: Record<string, any>;
  variants?: Record<string, any>;
  layoutId?: string;
  layout?: boolean | string;
};

/**
 * A wrapper component that uses dynamically loaded framer-motion for animations.
 * This component helps reduce initial bundle size by loading framer-motion only when needed.
 */
export function MotionWrapper({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
  whileInView,
  viewport,
  variants,
  layoutId,
  layout,
}: MotionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show nothing during SSR to prevent hydration mismatch
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionDiv
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      whileInView={whileInView}
      viewport={viewport}
      variants={variants}
      layoutId={layoutId}
      layout={layout}
    >
      {children}
    </MotionDiv>
  );
}

// Example basic variants that can be used with this component
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default MotionWrapper;
