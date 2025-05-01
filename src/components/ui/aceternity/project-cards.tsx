"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BackgroundGradient } from "./background-gradient";
import { MovingBorder } from "./moving-border";
import { ExternalLink, Star, GitFork, Clock } from "lucide-react";

export interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  gradient?: string;
  tags?: string[];
  link: string;
  isExternal?: boolean;
  stats?: {
    stars?: number;
    forks?: number;
    updatedAt?: string;
  };
}

export const ProjectCards = ({
  projects,
  className,
}: {
  projects: ProjectCardProps[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {projects.map((project, idx) => (
        <Link
          key={`project-card-${project.title}-${idx}`}
          href={project.link}
          target={project.isExternal ? "_blank" : undefined}
          rel={project.isExternal ? "noopener noreferrer" : undefined}
          className="block h-full group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.div
                className="absolute inset-0 h-full w-full bg-primary/5 dark:bg-primary/10 block rounded-xl z-0"
                layoutId="projectHoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>

          <BackgroundGradient className="rounded-xl h-full">
            <div className="rounded-xl h-full overflow-hidden border border-border/40 bg-background/80 backdrop-blur-sm relative z-10">
              <div className="relative h-48 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient ?? 'from-primary to-secondary'} flex items-center justify-center`}>
                    <MovingBorder className="p-0.5" containerClassName="rounded-full">
                      <div className="p-4 rounded-full bg-background text-primary">
                        {project.icon}
                      </div>
                    </MovingBorder>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> View Project
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {project.isExternal && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={`${project.title}-tag-${tag}`}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                {project.stats && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-3">
                      {project.stats.stars !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{project.stats.stars}</span>
                        </div>
                      )}

                      {project.stats.forks !== undefined && (
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <span>{project.stats.forks}</span>
                        </div>
                      )}
                    </div>

                    {project.stats.updatedAt && (
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Updated {project.stats.updatedAt}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </BackgroundGradient>
        </Link>
      ))}
    </div>
  );
};
