/**
 * Favorites utility functions
 * Manages user's favorite verses and bookmarks using localStorage
 */

import { BibleVerse } from '@/types/bible';

export interface FavoriteVerse extends BibleVerse {
  id: string;
  dateAdded: string;
  note?: string;
}

export interface ReadingBookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: string;
  verse?: string;
  title: string;
  dateCreated: string;
  lastRead?: string;
}

const FAVORITES_KEY = 'ny-baiboly-favorites';
const BOOKMARKS_KEY = 'ny-baiboly-bookmarks';

/**
 * Get all favorite verses from localStorage
 */
export function getFavoriteVerses(): FavoriteVerse[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

/**
 * Add a verse to favorites
 */
export function addToFavorites(verse: BibleVerse, note?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteVerses();
    const id = `${verse.book}-${verse.chapter}-${verse.verse}`;
    
    // Check if already exists
    if (favorites.some(fav => fav.id === id)) {
      return;
    }

    const newFavorite: FavoriteVerse = {
      ...verse,
      id,
      dateAdded: new Date().toISOString(),
      note,
    };

    const updated = [newFavorite, ...favorites];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

/**
 * Remove a verse from favorites
 */
export function removeFromFavorites(verseId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteVerses();
    const updated = favorites.filter(fav => fav.id !== verseId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

/**
 * Check if a verse is in favorites
 */
export function isInFavorites(book: string, chapter: string, verse: string): boolean {
  if (typeof window === 'undefined') return false;

  const favorites = getFavoriteVerses();
  const id = `${book}-${chapter}-${verse}`;
  return favorites.some(fav => fav.id === id);
}

/**
 * Update favorite verse note
 */
export function updateFavoriteNote(verseId: string, note: string): void {
  if (typeof window === 'undefined') return;

  try {
    const favorites = getFavoriteVerses();
    const updated = favorites.map(fav => 
      fav.id === verseId ? { ...fav, note } : fav
    );
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating favorite note:', error);
  }
}

/**
 * Get all reading bookmarks from localStorage
 */
export function getReadingBookmarks(): ReadingBookmark[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
}

/**
 * Add a reading bookmark
 */
export function addReadingBookmark(
  bookId: string,
  bookName: string,
  chapter: string,
  verse?: string,
  title?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const bookmarks = getReadingBookmarks();
    const id = `${bookId}-${chapter}${verse ? '-' + verse : ''}`;
    
    // Check if already exists
    if (bookmarks.some(bookmark => bookmark.id === id)) {
      return;
    }

    const defaultTitle = verse 
      ? `${bookName} ${chapter}:${verse}`
      : `${bookName} ${chapter}`;

    const newBookmark: ReadingBookmark = {
      id,
      bookId,
      bookName,
      chapter,
      verse,
      title: title || defaultTitle,
      dateCreated: new Date().toISOString(),
    };

    const updated = [newBookmark, ...bookmarks];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
}

/**
 * Remove a reading bookmark
 */
export function removeReadingBookmark(bookmarkId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const bookmarks = getReadingBookmarks();
    const updated = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
}

/**
 * Update bookmark last read time
 */
export function updateBookmarkLastRead(bookmarkId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const bookmarks = getReadingBookmarks();
    const updated = bookmarks.map(bookmark => 
      bookmark.id === bookmarkId 
        ? { ...bookmark, lastRead: new Date().toISOString() }
        : bookmark
    );
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating bookmark:', error);
  }
}

/**
 * Check if a location is bookmarked
 */
export function isBookmarked(bookId: string, chapter: string, verse?: string): boolean {
  if (typeof window === 'undefined') return false;

  const bookmarks = getReadingBookmarks();
  const id = `${bookId}-${chapter}${verse ? '-' + verse : ''}`;
  return bookmarks.some(bookmark => bookmark.id === id);
}

/**
 * Get reading progress for the current session
 */
export function getReadingProgress(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('ny-baiboly-progress');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading reading progress:', error);
    return {};
  }
}

/**
 * Update reading progress
 */
export function updateReadingProgress(bookId: string, chapter: string, verse?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getReadingProgress();
    const timestamp = new Date().toISOString();
    
    progress[bookId] = {
      lastChapter: chapter,
      lastVerse: verse,
      lastRead: timestamp,
    };

    // Keep global last read position
    progress.lastPosition = {
      bookId,
      chapter,
      verse,
      timestamp,
    };

    localStorage.setItem('ny-baiboly-progress', JSON.stringify(progress));
  } catch (error) {
    console.error('Error updating reading progress:', error);
  }
}

/**
 * Get last reading position
 */
export function getLastReadingPosition(): { bookId: string; chapter: string; verse?: string } | null {
  if (typeof window === 'undefined') return null;

  try {
    const progress = getReadingProgress();
    const lastPosition = progress.lastPosition as { bookId: string; chapter: string; verse?: string } | undefined;
    return lastPosition || null;
  } catch (error) {
    console.error('Error getting last reading position:', error);
    return null;
  }
}
