"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { trackEvent } from "@/lib/firebase/analytics";

interface FavoriteButtonProps {
  projectId: string;
  projectName: string;
}

export function FavoriteButton({ projectId, projectName }: Readonly<FavoriteButtonProps>) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useUserPreferences();
  const [isLoading, setIsLoading] = useState(false);
  
  const favorite = isFavorite(projectId);
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Show sign-in prompt or tooltip
      return;
    }
    
    setIsLoading(true);
    
    try {
      await toggleFavorite(projectId);
      
      // Track event
      await trackEvent(favorite ? "project_unfavorited" : "project_favorited", {
        project_id: projectId,
        project_name: projectName,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart
          className={`h-4 w-4 ${favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
        />
      )}
    </Button>
  );
}
