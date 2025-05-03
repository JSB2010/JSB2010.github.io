"use client";

import { useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { trackEvent } from "@/lib/firebase/analytics";
import { firebaseApp } from "@/lib/firebase/config";

interface ProjectViewTrackerProps {
  projectId: string;
  projectName: string;
}

export function ProjectViewTracker({ projectId, projectName }: ProjectViewTrackerProps) {
  useEffect(() => {
    const trackProjectView = async () => {
      try {
        // Track view in Firebase Analytics
        await trackEvent("project_view", {
          project_id: projectId,
          project_name: projectName,
        });

        // Track view in Firestore via Cloud Function
        const functions = getFunctions(firebaseApp);
        const trackProjectViewFn = httpsCallable(functions, 'trackProjectView');
        
        await trackProjectViewFn({ projectId });
      } catch (error) {
        // Silently handle errors
        console.error("Error tracking project view:", error);
      }
    };

    // Small delay to ensure the page has loaded
    const timeoutId = setTimeout(() => {
      trackProjectView();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [projectId, projectName]);

  // This component doesn't render anything
  return null;
}
