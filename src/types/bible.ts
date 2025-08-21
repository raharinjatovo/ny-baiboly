/**
 * Type definitions for Bible data structures
 * Following clean architecture principles with well-defined interfaces
 */

/**
 * Represents a single verse in a chapter
 */
export interface VerseData {
  /** Verse number as string */
  number: string;
  /** The verse text content */
  text: string;
}

/**
 * Represents a Bible verse with its location (for search results)
 */
export interface Verse {
  /** Book name */
  book: string;
  /** Chapter number as string */
  chapter: string;
  /** Verse number as string */
  verse: string;
  /** The verse text content */
  text: string;
}

/**
 * Represents a Bible verse with its location
 */
export interface BibleVerse {
  /** Book name */
  book: string;
  /** Chapter number as string */
  chapter: string;
  /** Verse number as string */
  verse: string;
  /** The verse text content */
  text: string;
}

/**
 * Represents a chapter containing verses
 */
export interface Chapter {
  /** Chapter number as string */
  number: string;
  /** Object where keys are verse numbers and values are verse text */
  verses: Record<string, string>;
}

/**
 * Represents a complete Bible book
 */
export interface BibleBook {
  /** Unique identifier for the book */
  id: string;
  /** Display name of the book */
  name: string;
  /** Full file name including extension */
  fileName: string;
  /** Testament this book belongs to */
  testament: Testament;
  /** All chapters in this book */
  chapters: Record<string, Record<string, string>>;
}

/**
 * Testament enumeration
 */
export enum Testament {
  OLD = 'Testameta taloha',
  NEW = 'Testameta vaovao'
}

/**
 * Bible book metadata for navigation and display
 */
export interface BookMeta {
  /** Unique identifier */
  id: string;
  /** Display name in Malagasy */
  name: string;
  /** File name without extension */
  fileName: string;
  /** Testament classification */
  testament: Testament;
  /** Total number of chapters */
  chapterCount?: number;
}

/**
 * Search result for Bible verses
 */
export interface SearchResult {
  /** Array of found verses */
  verses: Verse[];
  /** Total number of results */
  total: number;
  /** Whether there are more results */
  hasMore: boolean;
  /** Original search query */
  query: string;
  /** Search options used */
  searchOptions: SearchOptions;
  /** Search execution time in milliseconds */
  executionTime: number;
}

/**
 * Search options for Bible search functionality
 */
export interface SearchOptions {
  /** Filter by testament */
  testament?: 'old' | 'new';
  /** Case sensitive search */
  caseSensitive?: boolean;
  /** Maximum number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Reading plan interface
 */
export interface ReadingPlan {
  /** Unique identifier */
  id: string;
  /** Plan name */
  name: string;
  /** Plan description */
  description: string;
  /** Duration in days */
  duration: number;
  /** Daily readings */
  readings: DailyReading[];
}

/**
 * Daily reading structure
 */
export interface DailyReading {
  /** Day number */
  day: number;
  /** Date of reading */
  date: string;
  /** List of passages to read */
  passages: BiblePassage[];
}

/**
 * Bible passage reference
 */
export interface BiblePassage {
  /** Book ID */
  bookId: string;
  /** Book name for display */
  bookName: string;
  /** Starting chapter */
  startChapter: number;
  /** Ending chapter (same as start if single chapter) */
  endChapter: number;
  /** Starting verse (optional) */
  startVerse?: number;
  /** Ending verse (optional) */
  endVerse?: number;
}

/**
 * User bookmark
 */
export interface Bookmark {
  /** Unique identifier */
  id: string;
  /** Book ID */
  bookId: string;
  /** Book name */
  bookName: string;
  /** Chapter number */
  chapter: string;
  /** Verse number */
  verse: string;
  /** Optional note */
  note?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
}

/**
 * User reading progress
 */
export interface ReadingProgress {
  /** Book ID */
  bookId: string;
  /** Last read chapter */
  lastChapter: string;
  /** Last read verse */
  lastVerse: string;
  /** Reading percentage (0-100) */
  progress: number;
  /** Last reading timestamp */
  lastRead: Date;
}

/**
 * Application theme settings
 */
export interface ThemeSettings {
  /** Color scheme */
  colorScheme: 'light' | 'dark' | 'system';
  /** Font size multiplier */
  fontSize: number;
  /** Font family */
  fontFamily: string;
  /** Reading mode preferences */
  readingMode: 'normal' | 'focus' | 'night';
}

/**
 * User preferences and settings
 */
export interface UserSettings {
  /** Theme configuration */
  theme: ThemeSettings;
  /** Default translation/version */
  defaultVersion: string;
  /** Auto-save reading progress */
  autoSaveProgress: boolean;
  /** Show verse numbers */
  showVerseNumbers: boolean;
  /** Enable notifications */
  enableNotifications: boolean;
  /** Daily reading reminders */
  dailyReminder: boolean;
  /** Reminder time */
  reminderTime: string;
}

/**
 * API response wrapper for better error handling
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T | null;
  /** Success status */
  success: boolean;
  /** Error message if any */
  error?: string;
  /** Additional metadata */
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

/**
 * Navigation state for breadcrumbs and routing
 */
export interface NavigationState {
  /** Current book */
  currentBook?: BookMeta;
  /** Current chapter */
  currentChapter?: string;
  /** Current verse */
  currentVerse?: string;
  /** Navigation history */
  history: string[];
}
