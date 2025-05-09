"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OptimizedBackgroundImage } from "@/components/ui/optimized-background-image";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { StaticTextCard } from "@/components/ui/aceternity/static-text-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  cta?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
  };
  secondaryCta?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
  };
  tags?: string[];
  className?: string;
}

export function PageHero({
  title,
  description,
  backgroundImage = "/images/mountains-bg.jpg",
  badge,
  badgeIcon,
  cta,
  secondaryCta,
  tags,
  className,
}: PageHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate parallax and opacity effects
  const parallaxOffset = scrollY * 0.4;
  const contentOpacity = Math.max(1 - scrollY / 500, 0.2);
  const contentTransform = `translateY(${Math.min(scrollY * 0.1, 20)}px)`;

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative py-12 md:py-16 lg:py-20 overflow-hidden",
        className
      )}
    >
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0005})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <OptimizedBackgroundImage
          src={backgroundImage}
          alt="Background"
          priority={true}
          overlayClassName="opacity-30 dark:opacity-20 bg-gradient-to-b from-background/0 via-background/0 to-background"
        />
      </div>

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Content Container */}
      <div className="container relative z-20">
        <div
          ref={contentRef}
          className="max-w-3xl mx-auto text-center px-4 sm:px-6"
          style={{
            opacity: contentOpacity,
            transform: contentTransform,
            transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
          }}
        >
          {/* Badge (if provided) */}
          {badge && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mx-auto mb-4 sm:mb-6 backdrop-blur-md">
              {badgeIcon && (
                <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-primary"></span>
                </span>
              )}
              <span>{badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-0 text-foreground">
            {title}
          </h1>

          {/* Decorative Line */}
          <div className="h-1.5 w-20 sm:w-24 md:w-28 bg-primary rounded-full mx-auto mt-2 sm:mt-3 md:mt-4 mb-3 sm:mb-4 md:mb-5 transition-all duration-500 hover:w-32"></div>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-5 max-w-2xl mx-auto">
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-5">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Call to Action Buttons */}
          {(cta || secondaryCta) && (
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {cta && (
                <Button
                  asChild
                  size="lg"
                  className="group"
                >
                  <Link
                    href={cta.href}
                    target={cta.external ? "_blank" : undefined}
                    rel={cta.external ? "noopener noreferrer" : undefined}
                  >
                    {cta.text}
                    {cta.icon || (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                    {cta.external && (
                      <ExternalLink className="ml-2 h-4 w-4" />
                    )}
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group"
                >
                  <Link
                    href={secondaryCta.href}
                    target={secondaryCta.external ? "_blank" : undefined}
                    rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                  >
                    {secondaryCta.text}
                    {secondaryCta.icon || (
                      secondaryCta.external ? (
                        <ExternalLink className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )
                    )}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
