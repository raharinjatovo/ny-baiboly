/**
 * Navigation loading hook
 * Manages loading states during page transitions with UX feedback
 */

'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseNavigationLoadingOptions {
  loadingDelay?: number;
}

export function useNavigationLoading({
  loadingDelay = 100
}: UseNavigationLoadingOptions = {}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingTarget, setLoadingTarget] = React.useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const previousPathnameRef = React.useRef<string>(pathname);

  // Listen for pathname changes to clear loading
  React.useEffect(() => {
    if (pathname !== previousPathnameRef.current && isLoading) {
      // Route has changed, clear loading
      setIsLoading(false);
      setLoadingTarget(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
    previousPathnameRef.current = pathname;
  }, [pathname, isLoading]);

  /**
   * Navigate to a page with loading feedback
   * Loading persists until route actually changes
   */
  const navigateWithLoading = React.useCallback((
    href: string, 
    options: { 
      replace?: boolean;
      loadingText?: string;
    } = {}
  ) => {
    const { replace = false } = options;
    
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set loading target immediately for instant feedback
    setLoadingTarget(href);

    // Start loading after delay to avoid flicker for fast navigation
    timeoutRef.current = setTimeout(() => {
      setIsLoading(true);
      
      // Navigate immediately - loading will be cleared by pathname change effect
       
      const routerNavigate = replace ? router.replace : router.push;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (routerNavigate as any)(href);
      
    }, loadingDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsLoading(false);
      setLoadingTarget(null);
    };
  }, [router, loadingDelay]);

  /**
   * Check if a specific target is loading
   */
  const isTargetLoading = React.useCallback((href: string) => {
    return isLoading && loadingTarget === href;
  }, [isLoading, loadingTarget]);

  /**
   * Clear loading state manually
   */
  const clearLoading = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
    setLoadingTarget(null);
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    loadingTarget,
    navigateWithLoading,
    isTargetLoading,
    clearLoading
  };
}
