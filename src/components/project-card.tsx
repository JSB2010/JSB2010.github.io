"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectCard as ProjectCardType } from "@/lib/github";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Star, GitFork, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { MovingBorder } from "@/components/ui/aceternity/moving-border";
import { ThreeDCard } from "@/components/ui/aceternity/3d-card";
import { GitHubProjectTracker } from "@/components/projects/github-project-tracker";
import { GitHubProjectThumbnail } from "@/components/github-project-thumbnails";

interface ProjectCardProps {
  project: ProjectCardType;
}

export function ProjectCard({ project }: Readonly<ProjectCardProps>) {
  const {
    title,
    description,
    image,
    language,
    url,
    // githubUrl is not used directly in this component
    stars,
    forks,
    updatedAt,
    topics,
    isArchived,
  } = project;

  // State to track if we're on a small screen
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  // Effect to check screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Format the updated date
  const updatedTimeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });

  // No need for a separate function anymore, we'll use the GitHubProjectThumbnail component directly

  return (
    <>
      {/* Track GitHub project view */}
      <GitHubProjectTracker projectName={title} projectUrl={url} />

      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full group"
      >
      <ThreeDCard
        className="h-full w-full"
        rotationIntensity={5} /* Reduced for better mobile experience */
        glareOpacity={0.2}
        glareSize={0.6}
        disabled={isSmallScreen} /* Disable 3D effect on mobile */
      >
        <BackgroundGradient className="rounded-xl h-full">
          <Card className="h-full border-0 bg-background/80 backdrop-blur-sm overflow-hidden group project-card">
            <div className="h-40 sm:h-48 flex items-center justify-center relative overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <GitHubProjectThumbnail
                  language={language}
                  title={title}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> View Project
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="pt-4 sm:pt-6 flex flex-col p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' ')}
                </h3>

                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>

              <div className="min-h-[2.5rem] sm:min-h-[3rem] mb-3 sm:mb-4">
                {description ? (
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground/50 italic">No description available</p>
                )}
              </div>

              {/* Topics as tags */}
              {topics && topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {topics.slice(0, isSmallScreen ? 2 : 3).map((topic) => (
                    <MovingBorder key={topic} className="p-px" containerClassName="rounded-md" duration={5000}>
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-background text-primary rounded-md text-xs">
                        {topic}
                      </span>
                    </MovingBorder>
                  ))}
                  {topics.length > (isSmallScreen ? 2 : 3) && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground rounded-md text-xs">
                      +{topics.length - (isSmallScreen ? 2 : 3)} more
                    </span>
                  )}
                </div>
              )}

              {/* Repository stats */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mt-auto flex-wrap">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {language && (
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary/20 dark:bg-primary/30"
                      />
                      <span className="truncate max-w-[70px] sm:max-w-[80px]">{language}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{stars}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{forks}</span>
                  </div>
                </div>

                {isArchived && (
                  <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 text-xs">
                    Archived
                  </Badge>
                )}
              </div>

              {/* Updated time */}
              <div className="flex items-center gap-1 mt-2 sm:mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Updated {updatedTimeAgo}</span>
              </div>
            </CardContent>
          </Card>
        </BackgroundGradient>
      </ThreeDCard>
    </Link>
    </>
  );
}
