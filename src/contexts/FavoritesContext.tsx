/**
 * Favorites Context for managing liked verses throughout the application
 * Provides centralized state management for user's favorite verses
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Favorite {
  id: string;
  book: string;
  bookId: string;
  chapter: string;
  verse: string;
  text: string;
  reference: string;
  note?: string;
  dateAdded: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (verse: Omit<Favorite, 'id' | 'dateAdded'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (bookId: string, chapter: string, verse: string) => boolean;
  getFavoriteId: (bookId: string, chapter: string, verse: string) => string | null;
  toggleFavorite: (verse: Omit<Favorite, 'id' | 'dateAdded'>) => boolean;
  clearAllFavorites: () => void;
  exportFavorites: () => void;
  importFavorites: (data: Favorite[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bible-favorites');
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        // Validate the data structure
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
          console.info('Loaded favorites from localStorage:', parsedFavorites.length);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('bible-favorites');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('bible-favorites', JSON.stringify(favorites));
        console.info('Saved favorites to localStorage:', favorites.length);
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  /**
   * Generate unique ID for a verse
   */
  const generateVerseId = (bookId: string, chapter: string, verse: string): string => {
    return `${bookId}-${chapter}-${verse}`;
  };

  /**
   * Add a verse to favorites
   */
  const addFavorite = (verse: Omit<Favorite, 'id' | 'dateAdded'>) => {
    const id = generateVerseId(verse.bookId, verse.chapter, verse.verse);
    
    // Check if already exists
    if (favorites.some(fav => fav.id === id)) {
      console.info('Verse already in favorites:', id);
      return;
    }

    const newFavorite: Favorite = {
      ...verse,
      id,
      dateAdded: new Date().toISOString(),
    };

    setFavorites(prev => {
      const updated = [newFavorite, ...prev];
      console.info('Added favorite:', newFavorite);
      return updated;
    });
  };

  /**
   * Remove a verse from favorites
   */
  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(fav => fav.id !== id);
      console.info('Removed favorite:', id);
      return updated;
    });
  };

  /**
   * Check if a verse is favorited
   */
  const isFavorite = (bookId: string, chapter: string, verse: string): boolean => {
    const id = generateVerseId(bookId, chapter, verse);
    return favorites.some(fav => fav.id === id);
  };

  /**
   * Get favorite ID if verse is favorited
   */
  const getFavoriteId = (bookId: string, chapter: string, verse: string): string | null => {
    const id = generateVerseId(bookId, chapter, verse);
    const favorite = favorites.find(fav => fav.id === id);
    return favorite ? favorite.id : null;
  };

  /**
   * Toggle favorite status (add if not favorited, remove if favorited)
   * Returns true if added, false if removed
   */
  const toggleFavorite = (verse: Omit<Favorite, 'id' | 'dateAdded'>): boolean => {
    const id = generateVerseId(verse.bookId, verse.chapter, verse.verse);
    const existingFavorite = favorites.find(fav => fav.id === id);

    if (existingFavorite) {
      removeFavorite(id);
      console.info('Toggled favorite OFF:', verse.reference);
      return false;
    } else {
      addFavorite(verse);
      console.info('Toggled favorite ON:', verse.reference);
      return true;
    }
  };

  /**
   * Clear all favorites
   */
  const clearAllFavorites = () => {
    setFavorites([]);
  };

  /**
   * Export favorites as JSON file
   */
  const exportFavorites = () => {
    const data = JSON.stringify(favorites, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ny-baiboly-ankafiziko-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Import favorites from data
   */
  const importFavorites = (data: Favorite[]) => {
    // Validate data structure
    const validFavorites = data.filter(item => 
      item.id && item.book && item.bookId && item.chapter && item.verse && item.text
    );
    
    // Merge with existing favorites, avoiding duplicates
    const existingIds = new Set(favorites.map(fav => fav.id));
    const newFavorites = validFavorites.filter(fav => !existingIds.has(fav.id));
    
    setFavorites(prev => [...newFavorites, ...prev]);
  };

  const contextValue: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    toggleFavorite,
    clearAllFavorites,
    exportFavorites,
    importFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to use favorites context
 */
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

/**
 * Hook to get favorite status and toggle function for a specific verse
 */
export function useFavoriteVerse(bookId: string, chapter: string, verse: string, verseData?: {
  book: string;
  text: string;
  reference: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const isVerseFavorited = isFavorite(bookId, chapter, verse);
  
  const toggleVerseFavorite = () => {
    if (!verseData) {
      console.warn('Cannot toggle favorite: verse data not provided', { bookId, chapter, verse });
      return false;
    }
    
    try {
      const result = toggleFavorite({
        book: verseData.book,
        bookId,
        chapter,
        verse,
        text: verseData.text,
        reference: verseData.reference,
      });
      
      console.info(`Favorite ${result ? 'added' : 'removed'}:`, verseData.reference);
      return result;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  };

  return {
    isFavorited: isVerseFavorited,
    toggleFavorite: toggleVerseFavorite,
  };
}
