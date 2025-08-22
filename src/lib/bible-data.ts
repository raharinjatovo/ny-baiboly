/**
 * Data access layer for Bible content
 * Implements clean architecture principles with proper error handling and caching
 */

import { cache } from 'react';
import { BibleBook, BookMeta, ApiResponse, Testament } from '@/types/bible';
import { ALL_BIBLE_BOOKS, BOOKS_BY_ID, BOOKS_BY_FILENAME } from '@/constants/bible';
import { retryWithBackoff } from '@/utils';

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  ttl: 1000 * 60 * 15, // 15 minutes
  maxSize: 100, // Maximum number of cached items
};

/**
 * In-memory cache for frequently accessed data
 */
class DataCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();

  set(key: string, data: T): void {
    // Simple LRU implementation - remove oldest if at max size
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {return null;}
    
    // Check if cache is expired
    if (Date.now() - item.timestamp > CACHE_CONFIG.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

// Global cache instances
const bookCache = new DataCache<BibleBook>();
const chapterCache = new DataCache<Record<string, string>>();

/**
 * Safely read and parse JSON file from HTTP URL
 * @param url - URL to JSON file
 * @returns Parsed JSON data or throws error
 */
async function readJsonFile(url: string): Promise<Record<string, Record<string, string>>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const fileContent = await response.text();
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading file ${url}:`, error);
    throw new Error(`Failed to read file: ${url}`);
  }
}

/**
 * Get the HTTP URL for a book's JSON file
 * @param bookMeta - Book metadata
 * @returns HTTP URL to the JSON file
 */
function getBookFileUrl(bookMeta: BookMeta): string {
  // Use localhost for development/production - files are served from public folder
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const testamentDir = bookMeta.testament === Testament.OLD ? 'Testameta taloha' : 'Testameta vaovao';
  
  // URL encode the testament directory to handle spaces properly
  const encodedTestamentDir = encodeURIComponent(testamentDir);
  
  const url = `${baseUrl}/baiboly-json/${encodedTestamentDir}/${bookMeta.fileName}.json`;
  
  return url;
}

/**
 * Get all available Bible books
 * @returns List of all Bible books metadata
 */
export function getAllBooks(): BookMeta[] {
  return ALL_BIBLE_BOOKS;
}

/**
 * Get books by testament
 * @param testament - Testament to filter by
 * @returns List of books in the specified testament
 */
export function getBooksByTestament(testament: Testament): BookMeta[] {
  return ALL_BIBLE_BOOKS.filter(book => book.testament === testament);
}

/**
 * Get book metadata by ID
 * @param bookId - Book identifier
 * @returns Book metadata or null if not found
 */
export function getBookById(bookId: string): BookMeta | null {
  return BOOKS_BY_ID.get(bookId) || null;
}

/**
 * Get book metadata by filename
 * @param fileName - Book filename
 * @returns Book metadata or null if not found
 */
export function getBookByFileName(fileName: string): BookMeta | null {
  return BOOKS_BY_FILENAME.get(fileName) || null;
}

/**
 * Load complete Bible book data with caching
 * Server Component compatible with React cache
 */
export const getBibleBook = cache(async (bookId: string): Promise<ApiResponse<BibleBook>> => {
  try {
    // Check cache first
    const cachedBook = bookCache.get(bookId);
    if (cachedBook) {
      return { data: cachedBook, success: true };
    }

    // Get book metadata
    const bookMeta = getBookById(bookId);
    if (!bookMeta) {
      return {
        data: null,
        success: false,
        error: `Book not found: ${bookId}`,
      };
    }

    // Read book data with retry logic
    const fileUrl = getBookFileUrl(bookMeta);
    const bookData = await retryWithBackoff(() => readJsonFile(fileUrl));

    // Construct complete book object
    const bibleBook: BibleBook = {
      id: bookMeta.id,
      name: bookMeta.name,
      fileName: bookMeta.fileName,
      testament: bookMeta.testament,
      chapters: bookData,
    };

    // Cache the result
    bookCache.set(bookId, bibleBook);

    return { data: bibleBook, success: true };
  } catch (error) {
    console.error(`Error loading book ${bookId}:`, error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
});

/**
 * Get specific chapter from a book with caching
 */
export const getChapter = cache(async (
  bookId: string, 
  chapterNumber: string
): Promise<ApiResponse<Record<string, string>>> => {
  try {
    const cacheKey = `${bookId}:${chapterNumber}`;
    
    // Check cache first
    const cachedChapter = chapterCache.get(cacheKey);
    if (cachedChapter) {
      return { data: cachedChapter, success: true };
    }

    // Get the full book first
    const bookResponse = await getBibleBook(bookId);
    if (!bookResponse.success || !bookResponse.data) {
      return {
        data: null,
        success: false,
        error: bookResponse.error || 'Failed to load book',
      };
    }

    const chapter = bookResponse.data.chapters[chapterNumber];
    if (!chapter) {
      return {
        data: null,
        success: false,
        error: `Chapter ${chapterNumber} not found in ${bookResponse.data.name}`,
      };
    }

    // Cache the chapter
    chapterCache.set(cacheKey, chapter);

    return { data: chapter, success: true };
  } catch (error) {
    console.error(`Error loading chapter ${bookId}:${chapterNumber}:`, error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
});

/**
 * Get specific verse from a chapter
 */
export const getVerse = cache(async (
  bookId: string,
  chapterNumber: string,
  verseNumber: string
): Promise<ApiResponse<string>> => {
  try {
    const chapterResponse = await getChapter(bookId, chapterNumber);
    if (!chapterResponse.success || !chapterResponse.data) {
      return {
        data: null,
        success: false,
        error: chapterResponse.error || 'Failed to load chapter',
      };
    }

    const verse = chapterResponse.data[verseNumber];
    if (!verse) {
      return {
        data: null,
        success: false,
        error: `Verse ${verseNumber} not found in chapter ${chapterNumber}`,
      };
    }

    return { data: verse, success: true };
  } catch (error) {
    console.error(`Error loading verse ${bookId}:${chapterNumber}:${verseNumber}:`, error);
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
});

/**
 * Get chapter count for a book
 */
export const getChapterCount = cache(async (bookId: string): Promise<number> => {
  try {
    const bookResponse = await getBibleBook(bookId);
    if (!bookResponse.success || !bookResponse.data) {
      return 0;
    }

    return Object.keys(bookResponse.data.chapters).length;
  } catch (error) {
    console.error(`Error getting chapter count for ${bookId}:`, error);
    return 0;
  }
});

/**
 * Get verse count for a specific chapter
 */
export const getVerseCount = cache(async (
  bookId: string, 
  chapterNumber: string
): Promise<number> => {
  try {
    const chapterResponse = await getChapter(bookId, chapterNumber);
    if (!chapterResponse.success || !chapterResponse.data) {
      return 0;
    }

    return Object.keys(chapterResponse.data).length;
  } catch (error) {
    console.error(`Error getting verse count for ${bookId}:${chapterNumber}:`, error);
    return 0;
  }
});

/**
 * Search across all Bible books
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 */
export async function searchBible(
  query: string,
  options: {
    books?: string[];
    testament?: Testament;
    limit?: number;
    caseSensitive?: boolean;
  } = {}
): Promise<ApiResponse<Array<{
  book: BookMeta;
  chapter: string;
  verse: string;
  text: string;
  relevance: number;
}>>> {
  try {
    if (!query.trim()) {
      return { data: [], success: true };
    }

    const {
      books: targetBooks,
      testament,
      limit = 50,
      caseSensitive = false,
    } = options;

    // Determine which books to search
    let booksToSearch = ALL_BIBLE_BOOKS;
    if (targetBooks?.length) {
      booksToSearch = booksToSearch.filter(book => targetBooks.includes(book.id));
    } else if (testament) {
      booksToSearch = getBooksByTestament(testament);
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const results: Array<{
      book: BookMeta;
      chapter: string;
      verse: string;
      text: string;
      relevance: number;
    }> = [];

    // Search through each book
    for (const bookMeta of booksToSearch) {
      try {
        const bookResponse = await getBibleBook(bookMeta.id);
        if (!bookResponse.success || !bookResponse.data) {continue;}

        const book = bookResponse.data;

        // Search through chapters
        for (const [chapterNum, chapter] of Object.entries(book.chapters)) {
          // Search through verses
          for (const [verseNum, verseText] of Object.entries(chapter)) {
            // Ensure verseText is a string and not undefined/null
            if (typeof verseText !== 'string' || !verseText) {
              continue;
            }
            
            const searchText = caseSensitive ? verseText : verseText.toLowerCase();
            
            if (searchText.includes(searchQuery)) {
              // Calculate relevance score (simple implementation)
              const exactMatches = (searchText.match(new RegExp(searchQuery, 'g')) || []).length;
              const wordMatches = searchQuery.split(' ').filter(word => 
                searchText.includes(word)
              ).length;
              
              const relevance = exactMatches * 10 + wordMatches;

              results.push({
                book: bookMeta,
                chapter: chapterNum,
                verse: verseNum,
                text: verseText,
                relevance,
              });

              // Stop if we've reached the limit
              if (results.length >= limit) {
                break;
              }
            }
          }
          if (results.length >= limit) {break;}
        }
        if (results.length >= limit) {break;}
      } catch (error) {
        console.error(`Error searching book ${bookMeta.id}:`, error);
        // Continue with other books
      }
    }

    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance);

    return { data: results.slice(0, limit), success: true };
  } catch (error) {
    console.error('Error performing Bible search:', error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    };
  }
}

/**
 * Get random Bible verses
 * @param count - Number of random verses to return
 * @param options - Random verse options
 * @returns Random verses
 */
export async function getRandomVerses(
  count: number = 1,
  options: {
    testament?: Testament;
    books?: string[];
  } = {}
): Promise<ApiResponse<Array<{
  book: BookMeta;
  chapter: string;
  verse: string;
  text: string;
}>>> {
  try {
    const {
      testament,
      books: targetBooks,
    } = options;

    // Determine which books to use
    let booksToUse = ALL_BIBLE_BOOKS;
    if (targetBooks?.length) {
      booksToUse = booksToUse.filter(book => targetBooks.includes(book.id));
    } else if (testament) {
      booksToUse = getBooksByTestament(testament);
    }

    if (booksToUse.length === 0) {
      return { data: [], success: true };
    }

    const randomVerses: Array<{
      book: BookMeta;
      chapter: string;
      verse: string;
      text: string;
    }> = [];

    const maxAttempts = count * 10; // Prevent infinite loops
    let attempts = 0;

    while (randomVerses.length < count && attempts < maxAttempts) {
      attempts++;

      // Pick a random book
      const randomBook = booksToUse[Math.floor(Math.random() * booksToUse.length)];
      
      // Load the book data
      const bookResponse = await getBibleBook(randomBook.id);
      if (!bookResponse.success || !bookResponse.data) {continue;}

      const bookData = bookResponse.data;

      // Get all chapters
      const chapterNumbers = Object.keys(bookData.chapters);
      if (chapterNumbers.length === 0) {continue;}

      // Pick a random chapter
      const randomChapterNum = chapterNumbers[Math.floor(Math.random() * chapterNumbers.length)];
      const chapter = bookData.chapters[randomChapterNum];
      if (!chapter) {continue;}

      // Get all verses in the chapter
      const verseNumbers = Object.keys(chapter);
      if (verseNumbers.length === 0) {continue;}

      // Pick a random verse
      const randomVerseNum = verseNumbers[Math.floor(Math.random() * verseNumbers.length)];
      const verseText = chapter[randomVerseNum];
      
      if (!verseText || typeof verseText !== 'string') {continue;}

      // Check if we already have this verse (avoid duplicates)
      const verseKey = `${randomBook.id}-${randomChapterNum}-${randomVerseNum}`;
      const isDuplicate = randomVerses.some(v => 
        `${v.book.id}-${v.chapter}-${v.verse}` === verseKey
      );

      if (!isDuplicate) {
        randomVerses.push({
          book: randomBook,
          chapter: randomChapterNum,
          verse: randomVerseNum,
          text: verseText,
        });
      }
    }

    return { data: randomVerses, success: true };
  } catch (error) {
    console.error('Error getting random verses:', error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get random verses',
    };
  }
}

/**
 * Clear all caches (useful for development or memory management)
 */
export function clearCache(): void {
  bookCache.clear();
  chapterCache.clear();
}

/**
 * Get cache statistics (for debugging/monitoring)
 */
export function getCacheStats(): {
  books: number;
  chapters: number;
} {
  return {
    books: bookCache['cache'].size,
    chapters: chapterCache['cache'].size,
  };
}
