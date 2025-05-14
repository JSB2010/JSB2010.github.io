// Session management utilities for Appwrite authentication
import { sessionConfig } from './client';

// Session storage keys
const SESSION_ID_KEY = 'appwrite_session_id';
const SESSION_CREATED_KEY = 'appwrite_session_created';
const SESSION_EXPIRY_KEY = 'appwrite_session_expiry';

/**
 * Store session information in localStorage
 * @param sessionId Appwrite session ID
 */
export function storeSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Store the session ID
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    
    // Store the creation time
    const now = new Date();
    localStorage.setItem(SESSION_CREATED_KEY, now.toISOString());
    
    // Calculate and store expiry time if using persistent sessions
    if (sessionConfig.persistentSessions) {
      const expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + sessionConfig.sessionDuration);
      localStorage.setItem(SESSION_EXPIRY_KEY, expiryDate.toISOString());
    }
  } catch (error) {
    console.error('Error storing session:', error);
  }
}

/**
 * Clear session information from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_CREATED_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Get stored session ID from localStorage
 * @returns Session ID or null if not found or expired
 */
export function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Get the session ID
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) return null;
    
    // Check if the session has expired
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (expiryStr) {
      const expiry = new Date(expiryStr);
      const now = new Date();
      
      // If expired, clear the session and return null
      if (now > expiry) {
        clearSession();
        return null;
      }
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error getting stored session:', error);
    return null;
  }
}

/**
 * Get session age in days
 * @returns Session age in days or null if no session
 */
export function getSessionAge(): number | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const createdStr = localStorage.getItem(SESSION_CREATED_KEY);
    if (!createdStr) return null;
    
    const created = new Date(createdStr);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating session age:', error);
    return null;
  }
}

/**
 * Get session expiry information
 * @returns Object with days, hours, and minutes until expiry, or null if no session
 */
export function getSessionExpiry(): { days: number; hours: number; minutes: number } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiryStr) return null;
    
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    // If already expired, return zeros
    if (now > expiry) {
      return { days: 0, hours: 0, minutes: 0 };
    }
    
    const diffMs = expiry.getTime() - now.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  } catch (error) {
    console.error('Error calculating session expiry:', error);
    return null;
  }
}
