/**
 * Utility functions for common operations
 * Following functional programming principles where applicable
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with proper conflict resolution
 * Using clsx for conditional classes and tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely parses JSON with error handling
 * @param jsonString - String to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Debounce function for search and other input operations
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Throttle function for scroll events and other high-frequency operations
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

/**
 * Deep clone an object (for immutable operations)
 * @param obj - Object to clone
 * @returns Deep cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Format date for display in Malagasy locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('mg-MG', defaultOptions).format(dateObj);
}

/**
 * Capitalize first letter of each word
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Remove diacritics from text for search normalization
 * @param str - String to normalize
 * @returns Normalized string
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalize text for search (lowercase, remove diacritics, trim)
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeForSearch(text: string): string {
  return removeDiacritics(text.toLowerCase().trim());
}

/**
 * Highlight search terms in text
 * @param text - Original text
 * @param searchTerm - Term to highlight
 * @param className - CSS class for highlighting
 * @returns Text with highlighted terms
 */
export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  className: string = 'bg-yellow-200 dark:bg-yellow-800'
): string {
  if (!searchTerm.trim()) return text;
  
  const normalizedSearch = normalizeForSearch(searchTerm);
  const regex = new RegExp(`(${normalizedSearch})`, 'gi');
  
  return text.replace(regex, `<mark class="${className}">$1</mark>`);
}

/**
 * Calculate reading time estimate
 * @param text - Text to analyze
 * @param wordsPerMinute - Reading speed (default: 200 WPM)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate a unique ID
 * @param prefix - Optional prefix for the ID
 * @returns Unique identifier
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Sleep utility for async operations
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async operation with exponential backoff
 * @param operation - Async operation to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise with operation result
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Clamp a number between min and max values
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param start - Start value
 * @param end - End value
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * clamp(factor, 0, 1);
}

/**
 * Format number with locale-specific formatting
 * @param value - Number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('mg-MG', options).format(value);
}

/**
 * Get contrast color (black or white) for a given background color
 * @param backgroundColor - Background color in hex format
 * @returns Contrast color ('black' or 'white')
 */
export function getContrastColor(backgroundColor: string): 'black' | 'white' {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Convert string to URL-friendly slug
 * @param str - String to convert
 * @returns URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Parse Bible reference (e.g., "Genesis 1:1" or "Genesisy 1:1-5")
 * @param reference - Bible reference string
 * @returns Parsed reference object or null
 */
export function parseBibleReference(reference: string): {
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
} | null {
  const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  
  if (!match) return null;
  
  const [, book, chapter, startVerse, endVerse] = match;
  
  return {
    book: book.trim(),
    chapter: parseInt(chapter, 10),
    startVerse: startVerse ? parseInt(startVerse, 10) : undefined,
    endVerse: endVerse ? parseInt(endVerse, 10) : undefined,
  };
}

/**
 * Format Bible reference for display
 * @param book - Book name
 * @param chapter - Chapter number
 * @param startVerse - Start verse number
 * @param endVerse - End verse number
 * @returns Formatted reference string
 */
export function formatBibleReference(
  book: string,
  chapter: string | number,
  startVerse?: string | number,
  endVerse?: string | number
): string {
  let reference = `${book} ${chapter}`;
  
  if (startVerse) {
    reference += `:${startVerse}`;
    if (endVerse && endVerse !== startVerse) {
      reference += `-${endVerse}`;
    }
  }
  
  return reference;
}

/**
 * Format relative time (e.g., "2 hours ago", "yesterday")
 * @param date - Date string or Date object
 * @returns Relative time string in Malagasy
 */
export function formatRelativeTime(date: string | Date): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'vao haingana';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minitra lasa`;
  } else if (diffHours < 24) {
    return `${diffHours} ora lasa`;
  } else if (diffDays === 1) {
    return 'omaly';
  } else if (diffDays < 7) {
    return `${diffDays} andro lasa`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} herinandro lasa`;
  } else if (diffMonths < 12) {
    return `${diffMonths} volana lasa`;
  } else {
    return `${diffYears} taona lasa`;
  }
}
