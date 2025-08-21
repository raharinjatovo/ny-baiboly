/**
 * Enhanced Bible data access layer implementing Repository pattern
 * Features: Caching, validation, error handling, performance monitoring
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { z } from 'zod';

import { BibleBook, BookMeta, ApiResponse, Testament, Verse, SearchOptions, SearchResult } from '@/types/bible';
import { ALL_BIBLE_BOOKS, BOOKS_BY_ID } from '@/constants/bible';
import { retryWithBackoff } from '@/utils';
import { cacheManager, withCache } from '@/lib/cache';
import { logger, performanceMonitor, AppError, ErrorCategory, ValidationError, DataNotFoundError } from '@/lib/errors';

// ===== VALIDATION SCHEMAS =====

const ChapterDataSchema = z.record(z.string(), z.record(z.string(), z.string()));
const BookDataSchema = z.record(z.string(), z.record(z.string(), z.string()));

const SearchOptionsValidationSchema = z.object({
  testament: z.enum(['old', 'new']).optional(),
  caseSensitive: z.boolean().default(false),
  limit: z.number().int().positive().max(500).default(50),
  offset: z.number().int().min(0).default(0),
});

// ===== INTERFACES =====

interface BibleRepository {
  getBook(bookId: string): Promise<ApiResponse<BibleBook>>;
  getChapter(bookId: string, chapterNumber: string): Promise<ApiResponse<Record<string, string>>>;
  getAllBooks(): BookMeta[];
  getBooksByTestament(testament: Testament): BookMeta[];
  getBookById(bookId: string): BookMeta | null;
  searchBible(query: string, options?: SearchOptions): Promise<ApiResponse<SearchResult>>;
  getRandomVerses(count?: number): Promise<ApiResponse<Verse[]>>;
  getStats(): Promise<BibleStats>;
}

interface BibleStats {
  totalBooks: number;
  totalChapters: number;
  totalVerses: number;
  oldTestamentBooks: number;
  newTestamentBooks: number;
  averageVersesPerChapter: number;
  lastUpdated: string;
}

// ===== CACHE CONFIGURATION =====

const CACHE_CONFIG = {
  book: { ttl: 1000 * 60 * 30, maxSize: 66, compress: true }, // 30 minutes
  chapter: { ttl: 1000 * 60 * 15, maxSize: 200, compress: true }, // 15 minutes
  search: { ttl: 1000 * 60 * 5, maxSize: 100, compress: true }, // 5 minutes
  stats: { ttl: 1000 * 60 * 60, maxSize: 1, compress: false }, // 1 hour
};

// ===== REPOSITORY IMPLEMENTATION =====

class BibleDataRepository implements BibleRepository {
  private static instance: BibleDataRepository;
  private bookCache = cacheManager.getCache<BibleBook>('books', CACHE_CONFIG.book);
  private chapterCache = cacheManager.getCache<Record<string, string>>('chapters', CACHE_CONFIG.chapter);
  private searchCache = cacheManager.getCache<SearchResult>('search', CACHE_CONFIG.search);
  private statsCache = cacheManager.getCache<BibleStats>('stats', CACHE_CONFIG.stats);

  public static getInstance(): BibleDataRepository {
    if (!BibleDataRepository.instance) {
      BibleDataRepository.instance = new BibleDataRepository();
    }
    return BibleDataRepository.instance;
  }

  /**
   * Safely read and parse JSON file with validation
   */
  private async readJsonFile(filePath: string): Promise<Record<string, Record<string, string>>> {
    const timerId = performanceMonitor.startTimer('file_read');
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // Validate the data structure
      const validatedData = BookDataSchema.parse(data);
      
      performanceMonitor.endTimer(timerId, { 
        metadata: { filePath }, 
        success: true,
        size: content.length 
      });
      
      return validatedData;
    } catch (error) {
      performanceMonitor.endTimer(timerId, { 
        metadata: { filePath }, 
        success: false,
        error: (error as Error).message 
      });
      
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          `Invalid Bible data format in ${filePath}: ${error.errors.map(e => e.message).join(', ')}`,
          { metadata: { filePath } }
        );
      }
      
      throw new AppError(`Failed to read Bible data from ${filePath}`, {
        code: 'FILE_READ_ERROR',
        category: ErrorCategory.SYSTEM,
        context: { metadata: { filePath } },
        cause: error as Error,
      });
    }
  }

  /**
   * Get the full file path for a book
   */
  private getBookFilePath(bookMeta: BookMeta): string {
    // Use environment variable for data path, fallback to public/data
    const dataPath = process.env.BIBLE_DATA_PATH || 'public/data';
    const dataDir = join(process.cwd(), dataPath, 'baiboly-json');
    const testamentDir = bookMeta.testament === Testament.OLD ? 'Testameta taloha' : 'Testameta vaovao';
    return join(dataDir, testamentDir, `${bookMeta.fileName}.json`);
  }

  /**
   * Get all available Bible books
   */
  public getAllBooks(): BookMeta[] {
    return ALL_BIBLE_BOOKS;
  }

  /**
   * Get books by testament
   */
  public getBooksByTestament(testament: Testament): BookMeta[] {
    return ALL_BIBLE_BOOKS.filter(book => book.testament === testament);
  }

  /**
   * Get book metadata by ID
   */
  public getBookById(bookId: string): BookMeta | null {
    return BOOKS_BY_ID.get(bookId) || null;
  }

  /**
   * Load complete Bible book data with enhanced caching and error handling
   */
  public async getBook(bookId: string): Promise<ApiResponse<BibleBook>> {
    const timerId = performanceMonitor.startTimer('get_book');
    
    try {
      // Validate input
      if (!bookId || typeof bookId !== 'string') {
        throw new ValidationError('Book ID is required and must be a string');
      }

      // Check cache first
      const cachedBook = this.bookCache.get(bookId);
      if (cachedBook) {
        performanceMonitor.endTimer(timerId, { bookId, cached: true });
        logger.debug('Book cache hit', { bookId });
        return { data: cachedBook, success: true };
      }

      // Get book metadata
      const bookMeta = this.getBookById(bookId);
      if (!bookMeta) {
        throw new DataNotFoundError('Book', bookId);
      }

      // Read book data with retry logic
      const filePath = this.getBookFilePath(bookMeta);
      const bookData = await retryWithBackoff(
        () => this.readJsonFile(filePath),
        3, // maxRetries
        100 // baseDelay
      );

      // Construct complete book object
      const bibleBook: BibleBook = {
        id: bookMeta.id,
        name: bookMeta.name,
        fileName: bookMeta.fileName,
        testament: bookMeta.testament,
        chapters: bookData,
      };

      // Cache the result
      this.bookCache.set(bookId, bibleBook);

      performanceMonitor.endTimer(timerId, { bookId, cached: false });
      logger.info('Book loaded successfully', { bookId, chapters: Object.keys(bookData).length });

      return { data: bibleBook, success: true };
    } catch (error) {
      performanceMonitor.endTimer(timerId, { bookId, success: false });
      
      if (error instanceof AppError) {
        logger.error('Failed to load book', error, { bookId });
        return {
          data: null,
          success: false,
          error: error.userMessage,
        };
      }

      const appError = AppError.fromError(error as Error);
      logger.error('Unexpected error loading book', appError, { bookId });
      
      return {
        data: null,
        success: false,
        error: 'Tsy afaka naka ny boky. Azafady andramo indray.',
      };
    }
  }

  /**
   * Get specific chapter from a book with enhanced caching
   */
  public async getChapter(
    bookId: string, 
    chapterNumber: string
  ): Promise<ApiResponse<Record<string, string>>> {
    const timerId = performanceMonitor.startTimer('get_chapter');
    
    try {
      // Validate input
      if (!bookId || !chapterNumber) {
        throw new ValidationError('Book ID and chapter number are required');
      }

      const cacheKey = `${bookId}:${chapterNumber}`;
      
      // Check cache first
      const cachedChapter = this.chapterCache.get(cacheKey);
      if (cachedChapter) {
        performanceMonitor.endTimer(timerId, { bookId, chapterNumber, cached: true });
        return { data: cachedChapter, success: true };
      }

      // Get book data
      const bookResponse = await this.getBook(bookId);
      if (!bookResponse.success || !bookResponse.data) {
        return {
          data: null,
          success: false,
          error: bookResponse.error || 'Book not found',
        };
      }

      // Extract chapter
      const chapter = bookResponse.data.chapters[chapterNumber];
      if (!chapter) {
        throw new DataNotFoundError('Chapter', `${bookId}:${chapterNumber}`);
      }

      // Validate chapter data
      const validatedChapter = ChapterDataSchema.parse({ [chapterNumber]: chapter })[chapterNumber];

      // Cache the chapter
      this.chapterCache.set(cacheKey, validatedChapter);

      performanceMonitor.endTimer(timerId, { bookId, chapterNumber, cached: false });
      logger.debug('Chapter loaded', { bookId, chapterNumber, verses: Object.keys(validatedChapter).length });

      return { data: validatedChapter, success: true };
    } catch (error) {
      performanceMonitor.endTimer(timerId, { bookId, chapterNumber, success: false });
      
      if (error instanceof AppError) {
        logger.error('Failed to load chapter', error, { bookId, chapterNumber });
        return {
          data: null,
          success: false,
          error: error.userMessage,
        };
      }

      const appError = AppError.fromError(error as Error);
      logger.error('Unexpected error loading chapter', appError, { bookId, chapterNumber });
      
      return {
        data: null,
        success: false,
        error: 'Tsy afaka naka ny toko. Azafady andramo indray.',
      };
    }
  }

  /**
   * Search Bible verses with enhanced features
   */
  public async searchBible(
    query: string, 
    options: SearchOptions = {}
  ): Promise<ApiResponse<SearchResult>> {
    const timerId = performanceMonitor.startTimer('search_bible');
    
    try {
      // Validate and sanitize input
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        throw new ValidationError('Search query is required');
      }

      const sanitizedQuery = query.trim();
      if (sanitizedQuery.length < 2) {
        throw new ValidationError('Search query must be at least 2 characters long');
      }

      // Validate search options
      const validatedOptions = SearchOptionsValidationSchema.parse(options);
      const cacheKey = `${sanitizedQuery}:${JSON.stringify(validatedOptions)}`;

      // Check cache
      const cachedResult = this.searchCache.get(cacheKey);
      if (cachedResult) {
        performanceMonitor.endTimer(timerId, { query: sanitizedQuery, cached: true });
        return { data: cachedResult, success: true };
      }

      // Determine books to search
      const booksToSearch = validatedOptions.testament 
        ? this.getBooksByTestament(validatedOptions.testament === 'old' ? Testament.OLD : Testament.NEW)
        : this.getAllBooks();

      const searchResults: Verse[] = [];
      const searchStartTime = performance.now();

      // Search through books
      for (const bookMeta of booksToSearch) {
        try {
          const bookResponse = await this.getBook(bookMeta.id);
          if (!bookResponse.success || !bookResponse.data) {
            logger.warn('Skipping book due to load error', { bookId: bookMeta.id });
            continue;
          }

          const book = bookResponse.data;
          
          // Search through chapters
          for (const [chapterNum, chapter] of Object.entries(book.chapters)) {
            for (const [verseNum, verseText] of Object.entries(chapter)) {
              const matches = validatedOptions.caseSensitive
                ? verseText.includes(sanitizedQuery)
                : verseText.toLowerCase().includes(sanitizedQuery.toLowerCase());

              if (matches) {
                searchResults.push({
                  book: bookMeta.name,
                  chapter: chapterNum,
                  verse: verseNum,
                  text: verseText,
                });

                // Stop if we've reached the limit
                if (searchResults.length >= validatedOptions.limit) {
                  break;
                }
              }
            }
            if (searchResults.length >= validatedOptions.limit) {break;}
          }
          if (searchResults.length >= validatedOptions.limit) {break;}
        } catch (error) {
          logger.warn('Error searching book', { bookId: bookMeta.id, error: (error as Error).message });
          continue;
        }
      }

      const executionTime = performance.now() - searchStartTime;
      const hasMore = searchResults.length === validatedOptions.limit;

      const result: SearchResult = {
        verses: searchResults.slice(validatedOptions.offset, validatedOptions.offset + validatedOptions.limit),
        total: searchResults.length,
        hasMore,
        query: sanitizedQuery,
        searchOptions: validatedOptions,
        executionTime,
      };

      // Cache the result
      this.searchCache.set(cacheKey, result);

      performanceMonitor.endTimer(timerId, { 
        query: sanitizedQuery, 
        cached: false,
        results: result.verses.length,
        executionTime 
      });

      logger.info('Bible search completed', {
        query: sanitizedQuery,
        results: result.verses.length,
        executionTime: Math.round(executionTime),
        cached: false,
      });

      return { data: result, success: true };
    } catch (error) {
      performanceMonitor.endTimer(timerId, { query, success: false });
      
      if (error instanceof AppError) {
        logger.error('Bible search failed', error, { query, options });
        return {
          data: null,
          success: false,
          error: error.userMessage,
        };
      }

      const appError = AppError.fromError(error as Error);
      logger.error('Unexpected error during search', appError, { query, options });
      
      return {
        data: null,
        success: false,
        error: 'Nisy olana nandritra ny fikarohana. Azafady andramo indray.',
      };
    }
  }

  /**
   * Get random Bible verses
   */
  public async getRandomVerses(count: number = 1): Promise<ApiResponse<Verse[]>> {
    const timerId = performanceMonitor.startTimer('get_random_verses');
    
    try {
      if (count < 1 || count > 10) {
        throw new ValidationError('Count must be between 1 and 10');
      }

      const cacheKey = `random_${count}`;
      
      const randomVerses = await withCache(
        cacheKey,
        async () => {
          const resultVerses: Verse[] = [];
          const allBooks = this.getAllBooks();
          
          for (let i = 0; i < count; i++) {
            // Select random book
            const randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];
            
            const bookResponse = await this.getBook(randomBook.id);
            if (!bookResponse.success || !bookResponse.data) {
              continue;
            }

            const book = bookResponse.data;
            const chapters = Object.keys(book.chapters);
            
            // Select random chapter
            const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
            const chapterVerses = Object.keys(book.chapters[randomChapter]);
            
            // Select random verse
            const randomVerse = chapterVerses[Math.floor(Math.random() * chapterVerses.length)];
            const verseText = book.chapters[randomChapter][randomVerse];

            resultVerses.push({
              book: randomBook.name,
              chapter: randomChapter,
              verse: randomVerse,
              text: verseText,
            });
          }

          return resultVerses;
        },
        { ttl: 60000 } // Cache for 1 minute
      );
      
      return { data: randomVerses, success: true };
    } catch (error) {
      performanceMonitor.endTimer(timerId, { count, success: false });
      
      const appError = AppError.fromError(error as Error);
      logger.error('Failed to get random verses', appError, { count });
      
      return {
        data: null,
        success: false,
        error: 'Tsy afaka naka ireo andininy. Azafady andramo indray.',
      };
    } finally {
      performanceMonitor.endTimer(timerId, { count });
    }
  }

  /**
   * Get Bible statistics
   */
  public async getStats(): Promise<BibleStats> {
    return await withCache(
      'bible_stats',
      async () => {
        const timerId = performanceMonitor.startTimer('get_bible_stats');
        
        try {
          let totalChapters = 0;
          let totalVerses = 0;
          
          const allBooks = this.getAllBooks();
          const oldTestamentBooks = this.getBooksByTestament(Testament.OLD).length;
          const newTestamentBooks = this.getBooksByTestament(Testament.NEW).length;

          // Calculate totals by examining actual data
          for (const bookMeta of allBooks) {
            try {
              const bookResponse = await this.getBook(bookMeta.id);
              if (bookResponse.success && bookResponse.data) {
                const chapters = Object.keys(bookResponse.data.chapters);
                totalChapters += chapters.length;
                
                for (const chapterNum of chapters) {
                  const verses = Object.keys(bookResponse.data.chapters[chapterNum]);
                  totalVerses += verses.length;
                }
              }
            } catch (_error) {
              logger.warn('Error getting stats for book', { bookId: bookMeta.id });
            }
          }

          const stats: BibleStats = {
            totalBooks: allBooks.length,
            totalChapters,
            totalVerses,
            oldTestamentBooks,
            newTestamentBooks,
            averageVersesPerChapter: totalChapters > 0 ? Math.round(totalVerses / totalChapters) : 0,
            lastUpdated: new Date().toISOString(),
          };

          performanceMonitor.endTimer(timerId, { success: true });
          return stats;
        } catch (error) {
          performanceMonitor.endTimer(timerId, { success: false });
          throw error;
        }
      },
      CACHE_CONFIG.stats
    );
  }
}

// ===== SINGLETON EXPORT =====

export const bibleRepository = BibleDataRepository.getInstance();

// ===== LEGACY FUNCTION EXPORTS (for backward compatibility) =====

export const getAllBooks = () => bibleRepository.getAllBooks();
export const getBooksByTestament = (testament: Testament) => bibleRepository.getBooksByTestament(testament);
export const getBookById = (bookId: string) => bibleRepository.getBookById(bookId);
export const getBibleBook = (bookId: string) => bibleRepository.getBook(bookId);
export const getChapter = (bookId: string, chapterNumber: string) => bibleRepository.getChapter(bookId, chapterNumber);
export const searchBible = (query: string, options?: SearchOptions) => bibleRepository.searchBible(query, options);
export const getRandomVerses = (count?: number) => bibleRepository.getRandomVerses(count);
