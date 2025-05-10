"use client";

import React from "react";
import {
  LineChart,
  Train,
  Code,
  Laptop,
  Monitor,
  Tv,
  Server,
  Layers,
  Cpu,
  Wifi,
  Cloud,
  Database,
  Globe,
  Smartphone,
  Wrench,
  Settings,
  Play,
  Disc,
  Map,
  MapPin,
  Bus,
  Zap
} from "lucide-react";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { cn } from "@/lib/utils";

// Project thumbnail types
export type ProjectThumbnailType =
  | "default"
  | "tech-consulting"
  | "transportation"
  | "portfolio"
  | "homelab"
  | "macbook"
  | "apple-tv"
  | "github";

// Function to generate a unique project thumbnail based on project type
export function ProjectThumbnail({
  type,
  gradient,
  className
}: {
  type: ProjectThumbnailType;
  gradient: string;
  className?: string;
}) {
  const baseClasses = cn(
    "h-full w-full flex items-center justify-center relative overflow-hidden",
    className
  );

  // Default icon size classes
  const iconClasses = "text-white";
  const primaryIconSize = "h-12 w-12 md:h-16 md:w-16";
  const secondaryIconSize = "h-6 w-6 md:h-8 md:w-8";

  switch (type) {
    case "tech-consulting":
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <LineChart className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
          <Laptop className={cn(iconClasses, secondaryIconSize, "absolute top-6 right-6 opacity-30")} />
          <Smartphone className={cn(iconClasses, secondaryIconSize, "absolute bottom-6 left-6 opacity-30")} />
          <Wifi className={cn(iconClasses, secondaryIconSize, "absolute bottom-10 right-10 opacity-30")} />
        </div>
      );

    case "transportation":
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Train className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
          <Bus className={cn(iconClasses, secondaryIconSize, "absolute top-6 right-6 opacity-30")} />
          <Map className={cn(iconClasses, secondaryIconSize, "absolute bottom-6 left-6 opacity-30")} />
          <MapPin className={cn(iconClasses, secondaryIconSize, "absolute bottom-10 right-10 opacity-30")} />
        </div>
      );

    case "portfolio":
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Code className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
          <Globe className={cn(iconClasses, secondaryIconSize, "absolute top-6 right-6 opacity-30")} />
          <Layers className={cn(iconClasses, secondaryIconSize, "absolute bottom-6 left-6 opacity-30")} />
          <Zap className={cn(iconClasses, secondaryIconSize, "absolute bottom-10 right-10 opacity-30")} />
        </div>
      );

    case "homelab":
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Server className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
          <Database className={cn(iconClasses, secondaryIconSize, "absolute top-6 right-6 opacity-30")} />
          <Cloud className={cn(iconClasses, secondaryIconSize, "absolute bottom-6 left-6 opacity-30")} />
          <Server className={cn(iconClasses, secondaryIconSize, "absolute bottom-10 right-10 opacity-30")} />
        </div>
      );

    case "macbook":
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Laptop className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
          <Cpu className={cn(iconClasses, secondaryIconSize, "absolute top-6 right-6 opacity-30")} />
          <Settings className={cn(iconClasses, secondaryIconSize, "absolute bottom-6 left-6 opacity-30")} />
          <Wrench className={cn(iconClasses, secondaryIconSize, "absolute bottom-10 right-10 opacity-30")} />
        </div>
      );

    case "apple-tv":
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Tv className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
          <Monitor className={cn(iconClasses, secondaryIconSize, "absolute top-6 right-6 opacity-30")} />
          <Play className={cn(iconClasses, secondaryIconSize, "absolute bottom-6 left-6 opacity-30")} />
          <Disc className={cn(iconClasses, secondaryIconSize, "absolute bottom-10 right-10 opacity-30")} />
        </div>
      );

    // Default case
    default:
      return (
        <div className={cn(baseClasses, `bg-gradient-to-r ${gradient}`)}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
            <MovingBorder className="p-0.5" containerClassName="rounded-full">
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Code className={cn(iconClasses, primaryIconSize)} />
              </div>
            </MovingBorder>
          </div>
        </div>
      );
  }
}
