/**
 * Global Loading Context
 * Manages app-wide loading states for navigation and operations
 */

'use client';

import * as React from 'react';
import { LoadingOverlay } from '@/components/ui/loading-spinner';

interface LoadingContextValue {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
}

const LoadingContext = React.createContext<LoadingContextValue | null>(null);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('Manampy...');

  const setLoading = React.useCallback((loading: boolean, text?: string) => {
    setIsLoading(loading);
    if (text) {
      setLoadingText(text);
    }
  }, []);

  const value: LoadingContextValue = {
    isLoading,
    loadingText,
    setLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay 
        isVisible={isLoading}
        text={loadingText}
        variant="sniper"
      />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
