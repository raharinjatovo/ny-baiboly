/**
 * Bible book card component for displaying book information
 * Optimized for accessibility and performance with loading states
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookMeta, Testament } from '@/types/bible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
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
  const { navigateWithLoading, isTargetLoading } = useNavigationLoading();
  const bookUrl = `/books/${book.id}`;
  const isLoading = isTargetLoading(bookUrl);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(bookUrl, {
      loadingText: `Misokatra ${book.name}...`
    });
  };

  return (
    <div className={cn("block group", className)}>
      <LoadingCard 
        isLoading={isLoading}
        loadingText={`Misokatra ${book.name}...`}
        variant="sniper"
      >
        <Link href={bookUrl as `/books/${string}`} onClick={handleClick}>
          <Card 
            className={cn(
              'relative overflow-hidden cursor-pointer transition-all duration-300 ease-out',
              'hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-[1.02]',
              'border-0 bg-background/80 backdrop-blur-sm',
              'before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity before:duration-300',
              'hover:before:opacity-100',
              isOldTestament 
                ? 'before:from-blue-500/10 before:via-blue-500/5 before:to-transparent shadow-blue-500/20' 
                : 'before:from-emerald-500/10 before:via-emerald-500/5 before:to-transparent shadow-emerald-500/20',
              isLoading && 'pointer-events-none opacity-75'
            )}
          >
        {/* Accent Line */}
        <div 
          className={cn(
            'absolute top-0 left-0 w-full h-1 transition-all duration-300',
            isOldTestament 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
          )}
        />
        
        <CardHeader className="relative pb-3 pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                {book.name}
              </CardTitle>
              {!showTestament && (
                <div className={cn(
                  'text-xs font-medium opacity-70',
                  isOldTestament ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
                )}>
                  {isOldTestament ? 'Testameta Taloha' : 'Testameta Vaovao'}
                </div>
              )}
            </div>
            
            {showTestament && (
              <span 
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full font-bold shadow-sm shrink-0 ml-3',
                  'border transition-all duration-200 group-hover:scale-110',
                  isOldTestament
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
                )}
              >
                {isOldTestament ? 'TT' : 'TV'}
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="relative pt-0 pb-6">
          <div className="flex items-center justify-between">
            {showTestament && (
              <span className="text-sm text-muted-foreground font-medium">
                {isOldTestament ? 'Testameta Taloha' : 'Testameta Vaovao'}
              </span>
            )}
            {book.chapterCount && (
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-foreground">
                  {book.chapterCount}
                </span>
                <span className="text-xs text-muted-foreground">
                  toko
                </span>
              </div>
            )}
          </div>
          
          {/* Hover indicator */}
          <div className={cn(
            'absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full',
            isOldTestament ? 'bg-blue-500' : 'bg-emerald-500'
          )} />
        </CardContent>
      </Card>
    </Link>
      </LoadingCard>
    </div>
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
    ? `${books.length} boky masina` 
    : `${books.length} boky masina`;
  const description = isOldTestament 
    ? 'Tantaran\'ny vahoaka Israelita sy ny fampanantenana ny Mesia'
    : 'Fiainana sy fampianaran\'i Kristy sy ny Apostoly';

  return (
    <section className={cn('relative', className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20',
          isOldTestament ? 'bg-blue-500' : 'bg-emerald-500'
        )} />
      </div>

      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="flex items-start space-x-6">
            {/* Accent decoration */}
            <div className="flex flex-col items-center space-y-2">
              <div 
                className={cn(
                  'w-3 h-3 rounded-full shadow-lg',
                  isOldTestament ? 'bg-blue-500 shadow-blue-500/50' : 'bg-emerald-500 shadow-emerald-500/50'
                )}
              />
              <div 
                className={cn(
                  'w-1 h-16 rounded-full',
                  isOldTestament ? 'bg-gradient-to-b from-blue-500 to-blue-300' : 'bg-gradient-to-b from-emerald-500 to-emerald-300'
                )}
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                  {title}
                </h2>
                <p className={cn(
                  'text-lg font-medium',
                  isOldTestament ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
                )}>
                  {subtitle}
                </p>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <BibleBookGrid 
          books={books}
          columns={4}
          showTestament={false}
          className="pt-4"
        />
      </div>
    </section>
  );
}
