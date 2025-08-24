/**
 * Bible Reference Search API Route
 * Implements clean architecture with proper validation, error handling, and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { bibleRepository } from '@/lib/bible-repository';
import { BOOKS_BY_ENGLISH_NAME } from '@/constants/bible';
import { logger, ValidationError, AppError, ErrorCategory } from '@/lib/errors';
import { rateLimit } from '@/lib/rate-limit';

// ===== VALIDATION SCHEMAS =====

const VerseRangeSchema = z.object({
  start: z.number().int().positive(),
  end: z.number().int().positive().optional(),
});

const SearchReferenceSchema = z.object({
  book: z.string().min(1).max(50).trim(),
  chapter: z.number().int().positive().max(150),
  verses: z.array(z.union([
    z.number().int().positive().max(200),
    VerseRangeSchema
  ])).min(1).max(10), // Maximum 10 verses/ranges per request
});

// ===== TYPES =====

interface VerseResult {
  book: string;
  bookId: string;
  chapter: string;
  verse: string;
  text: string;
  reference: string;
}

interface SearchReferenceResponse {
  verses: VerseResult[];  // Array of individual verse objects
  text: string;           // Combined text of all verses (for backward compatibility)
  reference: string;      // Single reference with Malagasy book name
  book: string;           // Malagasy book name
  bookId: string;
  chapter: string;
  requestedCount: number;
  foundCount: number;
  executionTime: number;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Normalize book name to find matching book ID
 */
function findBookByName(bookName: string): string | null {
  const normalizedName = bookName.toLowerCase().trim();
  
  // Try exact English name match
  const bookId = BOOKS_BY_ENGLISH_NAME.get(normalizedName);
  if (bookId) {
    return bookId;
  }
  
  // Try partial matches for common abbreviations
  const allBooks = Array.from(BOOKS_BY_ENGLISH_NAME.entries());
  
  // Find by abbreviation or partial match
  for (const [englishName, id] of allBooks) {
    if (englishName.toLowerCase().startsWith(normalizedName) ||
        englishName.toLowerCase().includes(normalizedName)) {
      return id;
    }
  }
  
  return null;
}

/**
 * Expand verse ranges into individual verse numbers
 */
function expandVerseRanges(verses: (number | { start: number; end?: number })[]): number[] {
  const expandedVerses: number[] = [];
  
  for (const verse of verses) {
    if (typeof verse === 'number') {
      expandedVerses.push(verse);
    } else {
      const start = verse.start;
      const end = verse.end || start;
      
      // Validate range
      if (end < start) {
        throw new ValidationError(`Invalid verse range: ${start}-${end}`);
      }
      
      if (end - start > 50) {
        throw new ValidationError(`Verse range too large: ${start}-${end} (max 50 verses)`);
      }
      
      for (let i = start; i <= end; i++) {
        expandedVerses.push(i);
      }
    }
  }
  
  // Remove duplicates and sort
  return [...new Set(expandedVerses)].sort((a, b) => a - b);
}

/**
 * Build reference string for display
 */
function buildReference(bookName: string, chapter: string, verses: string[]): string {
  if (verses.length === 1) {
    return `${bookName} ${chapter}:${verses[0]}`;
  }
  
  // Group consecutive verses
  const groups: string[] = [];
  let start = 0;
  
  while (start < verses.length) {
    let end = start;
    const _currentVerse = parseInt(verses[start]);
    
    // Find consecutive verses
    while (end + 1 < verses.length && 
           parseInt(verses[end + 1]) === parseInt(verses[end]) + 1) {
      end++;
    }
    
    if (start === end) {
      groups.push(verses[start]);
    } else {
      groups.push(`${verses[start]}-${verses[end]}`);
    }
    
    start = end + 1;
  }
  
  return `${bookName} ${chapter}:${groups.join(', ')}`;
}

// ===== API HANDLER =====

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    // Parse request body first to log raw input
    const rawBody = await request.text();
    console.info('=== API SEARCH-REFERENCE DEBUG ===');
    console.info('Raw request body:', rawBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
      console.info('Parsed body:', JSON.stringify(parsedBody, null, 2));
      console.info('Body keys:', Object.keys(parsedBody));
      console.info('Book value:', parsedBody.book, 'Type:', typeof parsedBody.book);
      console.info('Chapter value:', parsedBody.chapter, 'Type:', typeof parsedBody.chapter);
      console.info('Verses value:', parsedBody.verses, 'Type:', typeof parsedBody.verses, 'Array?', Array.isArray(parsedBody.verses));
    } catch (jsonError) {
      console.info('JSON Parse Error:', (jsonError as Error).message);
      throw new ValidationError('Invalid JSON in request body');
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    // Validate request data
    console.info('Starting validation with schema...');
    const validatedData = SearchReferenceSchema.parse(parsedBody);
    console.info('Validation successful! Validated data:', JSON.stringify(validatedData, null, 2));
    
    const { book, chapter, verses } = validatedData;

    // Find book by English name
    console.info('Looking up book by name:', book);
    const bookId = findBookByName(book);
    console.info('Found book ID:', bookId);
    
    if (!bookId) {
      console.info('Book not found in mapping');
      return NextResponse.json(
        { 
          error: `Book not found: "${book}". Please check the spelling or try a different name.`,
          availableBooks: Array.from(BOOKS_BY_ENGLISH_NAME.keys()).slice(0, 10)
        },
        { status: 404 }
      );
    }

    // Get book metadata
    console.info('Getting book metadata for ID:', bookId);
    const bookMeta = bibleRepository.getBookById(bookId);
    console.info('Book metadata:', bookMeta);
    
    if (!bookMeta) {
      throw new AppError('Book metadata not found', {
        code: 'BOOK_META_ERROR',
        category: ErrorCategory.DATA,
      });
    }

    // Get chapter data
    console.info('Getting chapter data for book:', bookId, 'chapter:', chapter.toString());
    const chapterResponse = await bibleRepository.getChapter(bookId, chapter.toString());
    console.info('Chapter response success:', chapterResponse.success);
    console.info('Chapter data keys:', chapterResponse.data ? Object.keys(chapterResponse.data) : 'null');
    
    if (!chapterResponse.success || !chapterResponse.data) {
      console.info('Chapter not found, getting available chapters...');
      const availableChapters = await getAvailableChapters(bookId);
      console.info('Available chapters:', availableChapters);
      
      return NextResponse.json(
        { 
          error: `Chapter ${chapter} not found in ${bookMeta.name}`,
          book: bookMeta.name,
          availableChapters: availableChapters
        },
        { status: 404 }
      );
    }

    // Expand verse ranges and get verses
    console.info('Raw verses input:', verses);
    const expandedVerses = expandVerseRanges(verses);
    console.info('Expanded verses:', expandedVerses);
    
    const chapterData = chapterResponse.data;
    console.info('Chapter data available verses:', Object.keys(chapterData));
    
    const results: VerseResult[] = [];
    const foundVerses: string[] = [];
    const foundTexts: string[] = [];

    for (const verseNum of expandedVerses) {
      console.info('Looking for verse:', verseNum, 'as string:', verseNum.toString());
      const verseText = chapterData[verseNum.toString()];
      console.info('Found verse text:', verseText ? 'YES' : 'NO');
      
      if (verseText) {
        results.push({
          book: bookMeta.name,
          bookId: bookMeta.id,
          chapter: chapter.toString(),
          verse: verseNum.toString(),
          text: verseText,
          reference: `${bookMeta.name} ${chapter}:${verseNum}`,
        });
        foundVerses.push(verseNum.toString());
        foundTexts.push(verseText);
      }
    }

    console.info('Final results count:', results.length);
    
    // Build combined text and reference
    const combinedText = foundTexts.join(' ');
    const combinedReference = buildReference(bookMeta.name, chapter.toString(), foundVerses);
    
    console.info('=== END API DEBUG ===');

    const executionTime = performance.now() - startTime;

    const response: SearchReferenceResponse = {
      verses: results,        // Array of individual verse objects
      text: combinedText,     // Combined text for backward compatibility
      reference: combinedReference,
      book: bookMeta.name,
      bookId: bookMeta.id,
      chapter: chapter.toString(),
      requestedCount: expandedVerses.length,
      foundCount: results.length,
      executionTime: Math.round(executionTime),
    };

    // Log successful search
    logger.info('Bible reference search completed', {
      book: bookMeta.name,
      chapter,
      versesRequested: expandedVerses.length,
      versesFound: results.length,
      combinedReference: combinedReference,
      executionTime: Math.round(executionTime),
    });

    return NextResponse.json(response);

  } catch (error) {
    const executionTime = performance.now() - startTime;
    
    if (error instanceof z.ZodError) {
      logger.warn('Invalid search reference request', {
        errors: error.errors,
        executionTime: Math.round(executionTime),
      });
      
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    if (error instanceof ValidationError) {
      logger.warn('Validation error in search reference', {
        message: error.message,
        executionTime: Math.round(executionTime),
      });
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof AppError) {
      logger.error('Application error in search reference', error);
      
      return NextResponse.json(
        { error: 'An error occurred while searching. Please try again.' },
        { status: 500 }
      );
    }

    // Unexpected error
    const appError = AppError.fromError(error as Error);
    logger.error('Unexpected error in search reference', appError);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Get available chapters for a book (helper function)
 */
async function getAvailableChapters(bookId: string): Promise<number[]> {
  try {
    const bookResponse = await bibleRepository.getBook(bookId);
    if (bookResponse.success && bookResponse.data) {
      return Object.keys(bookResponse.data.chapters)
        .map(ch => parseInt(ch))
        .filter(ch => !isNaN(ch))
        .sort((a, b) => a - b);
    }
  } catch (error) {
    logger.warn('Failed to get available chapters', { bookId, error });
  }
  return [];
}

// Support GET for API documentation
export async function GET() {
  return NextResponse.json({
    message: 'Bible Reference Search API',
    method: 'POST',
    endpoint: '/api/search-reference',
    schema: {
      book: 'string (English book name, e.g., "Genesis", "Matthew")',
      chapter: 'number (chapter number)',
      verses: 'array of numbers or range objects { start: number, end?: number }'
    },
    examples: [
      {
        book: 'John',
        chapter: 3,
        verses: [16]
      },
      {
        book: 'Genesis',
        chapter: 1,
        verses: [1, 2, 3]
      },
      {
        book: 'Psalm',
        chapter: 23,
        verses: [{ start: 1, end: 6 }]
      }
    ]
  });
}
