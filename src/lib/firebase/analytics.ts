"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { firebaseApp } from './config';

/**
 * Custom hook to initialize Firebase Analytics and track page views
 */
export function useFirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const initAnalytics = async () => {
      try {
        // Check if analytics is supported in this environment
        const analyticsSupported = await isSupported();

        if (analyticsSupported) {
          const analytics = getAnalytics(firebaseApp);

          // Log page view
          logEvent(analytics, 'page_view', {
            page_path: pathname,
            page_location: window.location.href,
            page_title: document.title,
          });

          console.log('Firebase Analytics page view logged:', pathname);
        }
      } catch (error) {
        // Silently handle errors in analytics
        console.error('Firebase Analytics error:', error);
      }
    };

    initAnalytics();
  }, [pathname]);
}

/**
 * Track a custom event with Firebase Analytics
 */
export async function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  try {
    // Check if analytics is supported in this environment
    const analyticsSupported = await isSupported();

    if (analyticsSupported && typeof window !== 'undefined') {
      const analytics = getAnalytics(firebaseApp);
      logEvent(analytics, eventName, eventParams);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error tracking event:', error);
    return false;
  }
}
