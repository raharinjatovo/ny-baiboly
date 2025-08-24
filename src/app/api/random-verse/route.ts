/**
 * Random Bible Verse API Route
 * Compatible with bible-api.com format but returns Malagasy verses from GitHub repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { bibleRepository } from '@/lib/bible-repository';
import { ALL_BIBLE_BOOKS } from '@/constants/bible';
import { logger, AppError, ErrorCategory } from '@/lib/errors';
import { rateLimit } from '@/lib/rate-limit';

// ===== TYPES =====

interface RandomVerseResponse {
  translation: {
    identifier: string;
    name: string;
    language: string;
    language_code: string;
    license: string;
  };
  random_verse: {
    book_id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get a random book from the Bible
 */
function getRandomBook() {
  const randomIndex = Math.floor(Math.random() * ALL_BIBLE_BOOKS.length);
  return ALL_BIBLE_BOOKS[randomIndex];
}

/**
 * Get a random chapter number for a book (we'll validate it exists when fetching)
 */
function _getRandomChapterNumber(): number {
  // Most books have chapters 1-50, so we'll generate a reasonable range
  return Math.floor(Math.random() * 50) + 1;
}

/**
 * Get a random verse number (we'll validate it exists when fetching)
 */
function _getRandomVerseNumber(): number {
  // Most chapters have verses 1-50, so we'll generate a reasonable range
  return Math.floor(Math.random() * 50) + 1;
}

/**
 * Convert book ID to uppercase format similar to bible-api.com
 */
function getBookApiId(bookId: string): string {
  // Convert book IDs to a format similar to bible-api.com
  const mapping: Record<string, string> = {
    'genesis': 'GEN',
    'exodus': 'EXO',
    'leviticus': 'LEV',
    'numbers': 'NUM',
    'deuteronomy': 'DEU',
    'joshua': 'JOS',
    'judges': 'JDG',
    'ruth': 'RUT',
    '1-samuel': '1SA',
    '2-samuel': '2SA',
    '1-kings': '1KI',
    '2-kings': '2KI',
    '1-chronicles': '1CH',
    '2-chronicles': '2CH',
    'ezra': 'EZR',
    'nehemiah': 'NEH',
    'esther': 'EST',
    'job': 'JOB',
    'psalms': 'PSA',
    'proverbs': 'PRO',
    'ecclesiastes': 'ECC',
    'song-of-songs': 'SNG',
    'isaiah': 'ISA',
    'jeremiah': 'JER',
    'lamentations': 'LAM',
    'ezekiel': 'EZK',
    'daniel': 'DAN',
    'hosea': 'HOS',
    'joel': 'JOL',
    'amos': 'AMO',
    'obadiah': 'OBA',
    'jonah': 'JON',
    'micah': 'MIC',
    'nahum': 'NAM',
    'habakkuk': 'HAB',
    'zephaniah': 'ZEP',
    'haggai': 'HAG',
    'zechariah': 'ZEC',
    'malachi': 'MAL',
    'matthew': 'MAT',
    'mark': 'MRK',
    'luke': 'LUK',
    'john': 'JHN',
    'acts': 'ACT',
    'romans': 'ROM',
    '1-corinthians': '1CO',
    '2-corinthians': '2CO',
    'galatians': 'GAL',
    'ephesians': 'EPH',
    'philippians': 'PHP',
    'colossians': 'COL',
    '1-thessalonians': '1TH',
    '2-thessalonians': '2TH',
    '1-timothy': '1TI',
    '2-timothy': '2TI',
    'titus': 'TIT',
    'philemon': 'PHM',
    'hebrews': 'HEB',
    'james': 'JAS',
    '1-peter': '1PE',
    '2-peter': '2PE',
    '1-john': '1JN',
    '2-john': '2JN',
    '3-john': '3JN',
    'jude': 'JUD',
    'revelation': 'REV',
  };
  
  return mapping[bookId] || bookId.toUpperCase();
}

/**
 * Attempt to get a random verse with retry logic
 */
async function getRandomVerseWithRetry(maxAttempts: number = 10): Promise<RandomVerseResponse | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Get random book
      const randomBook = getRandomBook();
      
      // First, get the book data to see available chapters
      const bookResponse = await bibleRepository.getBook(randomBook.id);
      if (!bookResponse.success || !bookResponse.data) {
        continue; // Try another book
      }
      
      const availableChapters = Object.keys(bookResponse.data.chapters)
        .map(ch => parseInt(ch))
        .filter(ch => !isNaN(ch));
      
      if (availableChapters.length === 0) {
        continue; // No chapters available
      }
      
      // Get random chapter from available chapters
      const randomChapterIndex = Math.floor(Math.random() * availableChapters.length);
      const randomChapter = availableChapters[randomChapterIndex];
      
      // Get chapter data
      const chapterResponse = await bibleRepository.getChapter(randomBook.id, randomChapter.toString());
      if (!chapterResponse.success || !chapterResponse.data) {
        continue; // Try another chapter
      }
      
      const availableVerses = Object.keys(chapterResponse.data)
        .map(v => parseInt(v))
        .filter(v => !isNaN(v));
      
      if (availableVerses.length === 0) {
        continue; // No verses available
      }
      
      // Get random verse from available verses
      const randomVerseIndex = Math.floor(Math.random() * availableVerses.length);
      const randomVerse = availableVerses[randomVerseIndex];
      const verseText = chapterResponse.data[randomVerse.toString()];
      
      if (!verseText) {
        continue; // Verse not found
      }
      
      // Build response in bible-api.com format
      return {
        translation: {
          identifier: "malagasy",
          name: "Baiboly Malagasy",
          language: "Malagasy",
          language_code: "mg",
          license: "Public Domain"
        },
        random_verse: {
          book_id: getBookApiId(randomBook.id),
          book: randomBook.name, // Malagasy book name
          chapter: randomChapter,
          verse: randomVerse,
          text: verseText
        }
      };
      
    } catch (error) {
      console.info(`Attempt ${attempt + 1} failed:`, error);
      continue; // Try again
    }
  }
  
  return null; // Failed to get random verse after all attempts
}

// ===== API HANDLER =====

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    console.info('=== RANDOM VERSE API DEBUG ===');
    
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

    // Get random verse
    console.info('Getting random verse...');
    const randomVerseResponse = await getRandomVerseWithRetry();
    
    if (!randomVerseResponse) {
      throw new AppError('Failed to get random verse after multiple attempts', {
        code: 'RANDOM_VERSE_ERROR',
        category: ErrorCategory.DATA,
      });
    }

    console.info('Random verse found:', {
      book: randomVerseResponse.random_verse.book,
      chapter: randomVerseResponse.random_verse.chapter,
      verse: randomVerseResponse.random_verse.verse
    });
    console.info('=== END RANDOM VERSE DEBUG ===');

    const executionTime = performance.now() - startTime;

    // Log successful random verse retrieval
    logger.info('Random verse retrieved', {
      book: randomVerseResponse.random_verse.book,
      chapter: randomVerseResponse.random_verse.chapter,
      verse: randomVerseResponse.random_verse.verse,
      executionTime: Math.round(executionTime),
    });

    return NextResponse.json(randomVerseResponse);

  } catch (error) {
    const _executionTime = performance.now() - startTime;
    
    if (error instanceof AppError) {
      logger.error('Application error in random verse', error);
      
      return NextResponse.json(
        { error: 'An error occurred while getting random verse. Please try again.' },
        { status: 500 }
      );
    }

    // Unexpected error
    const appError = AppError.fromError(error as Error);
    logger.error('Unexpected error in random verse', appError);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Support POST for compatibility
export async function POST(request: NextRequest) {
  return GET(request);
}
