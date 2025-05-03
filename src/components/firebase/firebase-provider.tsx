"use client";

import { ReactNode, useEffect, useState } from "react";
import { useFirebaseAnalytics } from "@/lib/firebase/analytics";

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize Firebase Analytics
  useFirebaseAnalytics();
  
  useEffect(() => {
    // Mark as initialized after a short delay to ensure Firebase has time to initialize
    const timeoutId = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <>
      {children}
    </>
  );
}
