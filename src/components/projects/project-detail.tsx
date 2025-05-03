"use client";

import { useEffect, useState } from "react";
import { ProjectViewTracker } from "@/components/projects/project-view-tracker";
import { ProjectFeedback } from "@/components/projects/project-feedback";
import { FavoriteButton } from "@/components/projects/favorite-button";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "@/lib/firebase/config";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectDetailProps {
  projectId: string;
  projectName: string;
  children: React.ReactNode;
  showFeedback?: boolean;
}

interface ProjectViewData {
  views: number;
  lastViewed: {
    seconds: number;
    nanoseconds: number;
  };
}

export function ProjectDetail({
  projectId,
  projectName,
  children,
  showFeedback = true
}: Readonly<ProjectDetailProps>) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        // Get Firebase Functions instance
        const functions = getFunctions(firebaseApp);

        // Call the getProjectViews function (we'll create this next)
        const getProjectViews = httpsCallable<{projectId: string}, {data: ProjectViewData | null}>(
          functions,
          'getProjectViews'
        );

        const result = await getProjectViews({ projectId });

        if (result.data.data) {
          setViewCount(result.data.data.views);
        } else {
          setViewCount(0);
        }
      } catch (error) {
        console.error("Error fetching project views:", error);
        setViewCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewCount();
  }, [projectId]);

  return (
    <div className="space-y-8">
      {/* Track the project view */}
      <ProjectViewTracker projectId={projectId} projectName={projectName} />

      {/* Main content */}
      <div className="relative">
        {/* Favorite button */}
        <div className="absolute top-0 right-0 z-10">
          <FavoriteButton projectId={projectId} projectName={projectName} />
        </div>

        {children}
      </div>

      {/* View counter */}
      <Card className="p-4 flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-6 w-32" />
        ) : (
          <p className="text-sm text-muted-foreground">
            This project has been viewed <span className="font-semibold">{viewCount}</span> times
          </p>
        )}
      </Card>

      {/* Feedback section */}
      {showFeedback && (
        <ProjectFeedback projectId={projectId} projectName={projectName} />
      )}
    </div>
  );
}
