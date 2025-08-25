/**
 * Bible verse display component
 * Handles verse formatting, highlighting, and interaction with favorites
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Bookmark } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  addReadingBookmark,
  isBookmarked,
  removeReadingBookmark
} from '@/lib/favorites';
import { useFavorites } from '@/contexts/FavoritesContext';

interface VerseProps {
  number: string;
  text: string;
  book?: string;
  bookId?: string;
  chapter?: string;
  highlighted?: boolean;
  searchTerm?: string;
  showNumber?: boolean;
  showActions?: boolean;
  onVerseClick?: (verseNumber: string) => void;
  className?: string;
}

/**
 * Individual verse component with favorites functionality
 */
export function Verse({
  number,
  text,
  book = '',
  bookId = '',
  chapter = '',
  highlighted = false,
  searchTerm,
  showNumber = true,
  showActions = false,
  onVerseClick,
  className,
}: VerseProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isBookmarkActive, setIsBookmarkActive] = React.useState(false);

  // Check if verse is in favorites on mount and when props change
  const isFavorited = React.useMemo(() => {
    if (book && chapter && number) {
      return isFavorite(bookId || book, chapter, number);
    }
    return false;
  }, [book, bookId, chapter, number, isFavorite]);

  React.useEffect(() => {
    if (book && chapter && number) {
      setIsBookmarkActive(isBookmarked(bookId || book, chapter, number));
    }
  }, [book, bookId, chapter, number]);

  const handleClick = () => {
    onVerseClick?.(number);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!book || !chapter || !number) {return;}
    
    const verseData = {
      book,
      bookId: bookId || book,
      chapter,
      verse: number,
      text,
      reference: `${book} ${chapter}:${number}`,
    };
    
    toggleFavorite(verseData);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!book || !chapter || !number) {return;}
    
    if (isBookmarkActive) {
      const bookmarkId = `${bookId || book}-${chapter}-${number}`;
      removeReadingBookmark(bookmarkId);
      setIsBookmarkActive(false);
    } else {
      addReadingBookmark(bookId || book, book, chapter, number);
      setIsBookmarkActive(true);
    }
  };

  // Highlight search terms in text
  const highlightedText = React.useMemo(() => {
    if (!searchTerm) {return text;}
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }, [text, searchTerm]);

  return (
    <span
      className={cn(
        'group relative inline-block cursor-pointer transition-colors p-2 rounded-lg',
        highlighted && 'bg-blue-100 dark:bg-blue-900/30',
        'hover:bg-accent',
        className
      )}
      onClick={handleClick}
      id={`verse-${number}`}
    >
      {/* Verse number */}
      {showNumber && (
        <sup className="text-xs text-muted-foreground mr-1 select-none">
          {number}
        </sup>
      )}
      
      {/* Verse text */}
      <span
        className="leading-relaxed"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
      
      {/* Actions (only show when showActions is true and on hover) */}
      {showActions && (book && chapter && number) && (
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0",
              isFavorited && "text-red-500 hover:text-red-600"
            )}
            onClick={handleFavoriteToggle}
            title={isFavorited ? "Esorina amin'ny ankafiziko" : "Ampidiro amin'ny ankafiziko"}
          >
            <Heart className={cn("h-3 w-3", isFavorited && "fill-current")} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0",
              isBookmarkActive && "text-blue-500 hover:text-blue-600"
            )}
            onClick={handleBookmarkToggle}
            title={isBookmarkActive ? "Esorina amin'ny bookmark" : "Atao bookmark"}
          >
            <Bookmark className={cn("h-3 w-3", isBookmarkActive && "fill-current")} />
          </Button>
        </span>
      )}
    </span>
  );
}

interface ChapterProps {
  bookName: string;
  chapterNumber: string;
  verses: Record<string, string>;
  highlightedVerse?: string;
  searchTerm?: string;
  showVerseNumbers?: boolean;
  showActions?: boolean;
  book?: string;
  bookId?: string;
  onVerseClick?: (verseNumber: string) => void;
  className?: string;
}

/**
 * Chapter component displaying multiple verses
 */
export function Chapter({
  bookName,
  chapterNumber,
  verses,
  highlightedVerse,
  searchTerm,
  showVerseNumbers = true,
  showActions = false,
  book,
  bookId,
  onVerseClick,
  className,
}: ChapterProps) {
  const verseEntries = Object.entries(verses).sort(([a], [b]) => 
    parseInt(a) - parseInt(b)
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Chapter header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          {bookName}
        </h1>
        <p className="text-lg text-muted-foreground">
          Toko {chapterNumber}
        </p>
      </div>

      {/* Verses */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="leading-relaxed text-foreground">
          {verseEntries.map(([verseNumber, verseText], index) => (
            <React.Fragment key={verseNumber}>
              <Verse
                number={verseNumber}
                text={verseText}
                book={book || bookName}
                bookId={bookId}
                chapter={chapterNumber}
                highlighted={highlightedVerse === verseNumber}
                searchTerm={searchTerm}
                showNumber={showVerseNumbers}
                showActions={showActions}
                onVerseClick={onVerseClick}
              />
              {index < verseEntries.length - 1 && ' '}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}

interface VerseListProps {
  verses: Array<{
    book: string;
    chapter: string;
    verse: string;
    text: string;
  }>;
  onVerseClick?: (book: string, chapter: string, verse: string) => void;
  searchTerm?: string;
  className?: string;
}

/**
 * List component for displaying verses from different books/chapters
 */
export function VerseList({
  verses,
  onVerseClick,
  searchTerm,
  className,
}: VerseListProps) {
  if (verses.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-muted-foreground">Tsy misy andinin-tsoratra hita</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {verses.map((verse) => (
        <div
          key={`${verse.book}-${verse.chapter}-${verse.verse}`}
          className="border-l-4 border-primary/20 pl-4 py-2 hover:border-primary/60 transition-colors cursor-pointer"
          onClick={() => onVerseClick?.(verse.book, verse.chapter, verse.verse)}
        >
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <span className="font-medium">{verse.book}</span>
            <span>{verse.chapter}:{verse.verse}</span>
          </div>
          
          <p className="text-foreground">
            {searchTerm ? (
              <span 
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ 
                  __html: verse.text.replace(
                    new RegExp(`(${searchTerm})`, 'gi'),
                    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
                  )
                }} 
              />
            ) : (
              verse.text
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

interface BreadcrumbProps {
  book?: string;
  chapter?: string;
  verse?: string;
  onBookClick?: () => void;
  onChapterClick?: () => void;
  className?: string;
}

/**
 * Breadcrumb navigation for Bible references
 */
export function BibleBreadcrumb({
  book,
  chapter,
  verse,
  onBookClick,
  onChapterClick,
  className,
}: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      {onBookClick ? (
        <button
          onClick={onBookClick}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Boky rehetra
        </button>
      ) : (
        <Link
          href="/books"
          className="text-primary hover:text-primary/80 font-medium"
        >
          Boky rehetra
        </Link>
      )}
      
      {book && (
        <>
          <span className="text-muted-foreground">/</span>
          {onChapterClick ? (
            <button
              onClick={onChapterClick}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {book}
            </button>
          ) : (
            <span className="text-foreground font-medium">
              {book}
            </span>
          )}
        </>
      )}
      
      {chapter && (
        <>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">
            Toko {chapter}
          </span>
        </>
      )}
      
      {verse && (
        <>
          <span className="text-muted-foreground">:</span>
          <span className="text-foreground font-medium">
            {verse}
          </span>
        </>
      )}
    </nav>
  );
}
