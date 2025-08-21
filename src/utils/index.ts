/**
 * Utility functions for common operations
 * Following functional programming principles where applicable
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {return true;}
  if (typeof value === 'string') {return value.trim().length === 0;}
  if (Array.isArray(value)) {return value.length === 0;}
  if (typeof value === 'object') {return Object.keys(value).length === 0;}
  return false;
}

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
export function debounce<T extends (...args: never[]) => void | Promise<void>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
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
 * Format date for display in Malagasy context
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('mg-MG', defaultOptions).format(date);
}

/**
 * Format relative time (e.g., "2 hours ago") in Malagasy
 * @param date - Date to compare
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'Vao haingana';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minitra lasa`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ora lasa`;
  } else if (diffInDays < 7) {
    return `${diffInDays} andro lasa`;
  } else {
    return formatDate(date);
  }
}
