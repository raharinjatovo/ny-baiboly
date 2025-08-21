/**
 * Bible book card component for displaying book information
 * Optimized for accessibility and performance
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookMeta, Testament } from '@/types/bible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils';

interface BibleBookCardProps {
  book: BookMeta;
  className?: string;
  showTestament?: boolean;
}

export function BibleBookCard({ 
  book, 
  className,
  showTestament = false 
}: BibleBookCardProps) {
  const isOldTestament = book.testament === Testament.OLD;

  return (
    <Link href={`/books/${book.id}`} className={cn("block", className)}>
      <Card 
        className={cn(
          'group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
          'border-l-4',
          isOldTestament 
            ? 'border-l-blue-500 hover:border-l-blue-600' 
            : 'border-l-green-500 hover:border-l-green-600'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {book.name}
            </CardTitle>
            {showTestament && (
              <span 
                className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  isOldTestament
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                )}
              >
                {isOldTestament ? 'TT' : 'TV'}
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {showTestament && (
              <span>
                {isOldTestament ? 'Testameta Taloha' : 'Testameta Vaovao'}
              </span>
            )}
            {book.chapterCount && (
              <span className="font-medium">
                {book.chapterCount} toko
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Props for the BibleBookGrid component
 */
interface BibleBookGridProps {
  books: BookMeta[];
  title?: string;
  className?: string;
  showTestament?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Grid component for displaying multiple Bible books
 */
export function BibleBookGrid({ 
  books, 
  title,
  className,
  showTestament = false,
  columns = 3
}: BibleBookGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  if (books.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-muted-foreground">Tsy misy boky hita</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          {title}
        </h2>
      )}
      
      <div className={cn(
        'grid gap-4',
        gridCols[columns]
      )} data-testid="bible-book-grid">
        {books.map((book) => (
          <BibleBookCard
            key={book.id}
            book={book}
            showTestament={showTestament}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Testament section component
 */
interface TestamentSectionProps {
  testament: Testament;
  books: BookMeta[];
  className?: string;
}

export function TestamentSection({ 
  testament, 
  books, 
  className 
}: TestamentSectionProps) {
  const isOldTestament = testament === Testament.OLD;
  const title = isOldTestament ? 'Testameta Taloha' : 'Testameta Vaovao';
  const subtitle = isOldTestament 
    ? `${books.length} boky` 
    : `${books.length} boky`;

  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-center space-x-4">
        <div 
          className={cn(
            'w-1 h-8 rounded-full',
            isOldTestament ? 'bg-blue-500' : 'bg-green-500'
          )}
        />
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <BibleBookGrid 
        books={books}
        columns={4}
        showTestament={false}
      />
    </section>
  );
}
