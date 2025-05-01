"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/firebase/analytics";

interface GitHubProjectTrackerProps {
  projectName: string;
  projectUrl: string;
}

export function GitHubProjectTracker({ projectName, projectUrl }: Readonly<GitHubProjectTrackerProps>) {
  useEffect(() => {
    const trackGitHubProjectView = async () => {
      try {
        // Track view in Firebase Analytics
        await trackEvent("github_project_view", {
          project_name: projectName,
          project_url: projectUrl,
        });
      } catch (error) {
        // Silently handle errors
        console.error("Error tracking GitHub project view:", error);
      }
    };

    // Small delay to ensure the page has loaded
    const timeoutId = setTimeout(() => {
      trackGitHubProjectView();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [projectName, projectUrl]);

  // This component doesn't render anything
  return null;
}
