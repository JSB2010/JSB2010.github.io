"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { 
  UserPreferences, 
  getUserPreferences, 
  updateUserPreferences,
  toggleFavoriteProject
} from "@/lib/firebase/user-preferences";

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Load preferences when user changes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setPreferences(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const prefs = await getUserPreferences(user);
        setPreferences(prefs);
      } catch (error) {
        console.error("Error loading user preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return false;

    try {
      const success = await updateUserPreferences(user, newPreferences);
      
      if (success) {
        // Update local state
        setPreferences(prev => prev ? { ...prev, ...newPreferences } : null);
      }
      
      return success;
    } catch (error) {
      console.error("Error updating preferences:", error);
      return false;
    }
  };

  // Toggle favorite project
  const toggleFavorite = async (projectId: string) => {
    if (!user) return false;

    try {
      const success = await toggleFavoriteProject(user, projectId);
      
      if (success) {
        // Update local state
        setPreferences(prev => {
          if (!prev) return null;
          
          const favorites = prev.favoriteProjects || [];
          const updatedFavorites = favorites.includes(projectId)
            ? favorites.filter(id => id !== projectId)
            : [...favorites, projectId];
          
          return {
            ...prev,
            favoriteProjects: updatedFavorites,
          };
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    }
  };

  // Check if a project is favorited
  const isFavorite = (projectId: string) => {
    if (!preferences || !preferences.favoriteProjects) return false;
    return preferences.favoriteProjects.includes(projectId);
  };

  return {
    preferences,
    loading,
    updatePreferences,
    toggleFavorite,
    isFavorite,
  };
}
