"use client";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  favoriteProjects?: string[];
  emailNotifications?: boolean;
  lastVisit?: Date;
}

/**
 * Get user preferences from Firestore
 */
export async function getUserPreferences(user: User): Promise<UserPreferences | null> {
  if (!user) return null;
  
  try {
    const userRef = doc(db, "userPreferences", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data() as UserPreferences;
      
      // Convert Firestore timestamp to Date if it exists
      if (data.lastVisit) {
        data.lastVisit = (data.lastVisit as any).toDate();
      }
      
      return data;
    }
    
    // If no preferences exist yet, create default preferences
    const defaultPreferences: UserPreferences = {
      theme: "system",
      favoriteProjects: [],
      emailNotifications: true,
      lastVisit: new Date(),
    };
    
    await setDoc(userRef, defaultPreferences);
    return defaultPreferences;
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return null;
  }
}

/**
 * Update user preferences in Firestore
 */
export async function updateUserPreferences(
  user: User,
  preferences: Partial<UserPreferences>
): Promise<boolean> {
  if (!user) return false;
  
  try {
    const userRef = doc(db, "userPreferences", user.uid);
    
    // Always update lastVisit
    const updatedPreferences = {
      ...preferences,
      lastVisit: new Date(),
    };
    
    await updateDoc(userRef, updatedPreferences);
    return true;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    
    // If the document doesn't exist yet, create it
    try {
      const userRef = doc(db, "userPreferences", user.uid);
      
      const defaultPreferences: UserPreferences = {
        theme: "system",
        favoriteProjects: [],
        emailNotifications: true,
        lastVisit: new Date(),
        ...preferences,
      };
      
      await setDoc(userRef, defaultPreferences);
      return true;
    } catch (setError) {
      console.error("Error creating user preferences:", setError);
      return false;
    }
  }
}

/**
 * Toggle a project as favorite
 */
export async function toggleFavoriteProject(
  user: User,
  projectId: string
): Promise<boolean> {
  if (!user) return false;
  
  try {
    // Get current preferences
    const preferences = await getUserPreferences(user);
    if (!preferences) return false;
    
    // Get current favorites
    const favorites = preferences.favoriteProjects || [];
    
    // Toggle the project
    const updatedFavorites = favorites.includes(projectId)
      ? favorites.filter(id => id !== projectId)
      : [...favorites, projectId];
    
    // Update preferences
    return await updateUserPreferences(user, {
      favoriteProjects: updatedFavorites,
    });
  } catch (error) {
    console.error("Error toggling favorite project:", error);
    return false;
  }
}
