/**
 * Enhanced Bible book card with search highlighting, animations, and loading states
 * Optimized for se        <Link href={bookUrl as `/books/${string}`} onClick={handleClick}>rch results display
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookMeta, Testament } from '@/types/bible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { cn } from '@/utils';
import { Zap, Star, BookOpen } from 'lucide-react';

interface SearchBookCardProps {
  book: BookMeta;
  searchQuery?: string;
  matchScore?: number;
  matchType?: 'exact' | 'starts_with' | 'contains' | 'fuzzy';
  showMatchInfo?: boolean;
  animationDelay?: number;
  className?: string;
}

export function SearchBookCard({ 
  book, 
  searchQuery = '',
  matchScore = 0,
  matchType = 'exact',
  showMatchInfo = false,
  animationDelay = 0,
  className
}: SearchBookCardProps) {
  const isOldTestament = book.testament === Testament.OLD;
  const [isVisible, setIsVisible] = React.useState(false);
  const { navigateWithLoading, isTargetLoading } = useNavigationLoading();
  const bookUrl = `/books/${book.id}`;
  const isLoading = isTargetLoading(bookUrl);

  // Stagger animation entrance
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(bookUrl, {
      loadingText: `Misokatra ${book.name}...`
    });
  };

  /**
   * Highlight matching text in book name
   */
  const highlightedName = React.useMemo(() => {
    if (!searchQuery || !book.name) {return book.name;}

    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = book.name.split(regex);
    
    return parts.map((part, index) => {
      const isMatch = regex.test(part);
      return isMatch ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800/50 text-foreground rounded px-1">
          {part}
        </mark>
      ) : part;
    });
  }, [book.name, searchQuery]);

  /**
   * Get match type styling
   */
  const getMatchBadge = () => {
    if (!showMatchInfo || matchScore === 0) {return null;}

    const variants = {
      exact: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Star, label: 'Mitovy tanteraka' },
      starts_with: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Zap, label: 'Manomboka' },
      contains: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: BookOpen, label: 'Misy' },
      fuzzy: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: BookOpen, label: 'Mitovy' }
    };

    const variant = variants[matchType];
    const Icon = variant.icon;

    return (
      <Badge className={cn('text-xs px-2 py-1 font-medium', variant.color)}>
        <Icon className="h-3 w-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        'transform transition-all duration-300 ease-out',
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-4 opacity-0',
        className
      )}
    >
      <LoadingCard 
        isLoading={isLoading}
        loadingText={`Misokatra ${book.name}...`}
        variant="sniper"
      >
        <Link href={bookUrl as `/books/${string}`} onClick={handleClick}>
          <Card 
            className={cn(
              'group cursor-pointer transition-all duration-200',
              'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]',
              'border-l-4 relative overflow-hidden',
              isOldTestament 
                ? 'border-l-blue-500 hover:border-l-blue-600' 
                : 'border-l-green-500 hover:border-l-green-600',
              // Enhanced styling for high match scores
              showMatchInfo && matchScore >= 90 && 'ring-2 ring-primary/20 shadow-md',
              isLoading && 'pointer-events-none opacity-75'
            )}
          >
          {/* Background gradient for high matches */}
          {showMatchInfo && matchScore >= 90 && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          )}

          <CardHeader className="pb-3 relative">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {highlightedName}
              </CardTitle>
              
              {/* Testament badge */}
              <span 
                className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium shrink-0 ml-2',
                  isOldTestament
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                )}
              >
                {isOldTestament ? 'TT' : 'TV'}
              </span>
            </div>

            {/* Match information */}
            {showMatchInfo && (
              <div className="flex items-center space-x-2 mt-2">
                {getMatchBadge()}
                {matchScore > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Dikan'isa: {matchScore}%
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="pt-0 relative">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {isOldTestament ? 'Testameta Taloha' : 'Testameta Vaovao'}
              </span>
              {book.chapterCount && (
                <span className="font-medium">
                  {book.chapterCount} toko
                </span>
              )}
            </div>

            {/* Search match indicator */}
            {showMatchInfo && matchScore >= 70 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 mr-1 text-green-500" />
                  Tsara kokoa ho an'ny fitadiavanao
                </div>
              </div>
            )}
          </CardContent>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </Card>
      </Link>
      </LoadingCard>
    </div>
  );
}

/**
 * Grid wrapper for search results with staggered animations
 */
interface SearchResultsGridProps {
  results: Array<{
    book: BookMeta;
    matchScore: number;
    matchType: 'exact' | 'starts_with' | 'contains' | 'fuzzy';
  }>;
  searchQuery: string;
  showMatchInfo?: boolean;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function SearchResultsGrid({ 
  results, 
  searchQuery,
  showMatchInfo = true,
  className,
  columns = 3
}: SearchResultsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      'grid gap-4',
      gridCols[columns],
      className
    )}>
      {results.map((result, index) => (
        <SearchBookCard
          key={result.book.id}
          book={result.book}
          searchQuery={searchQuery}
          matchScore={result.matchScore}
          matchType={result.matchType}
          showMatchInfo={showMatchInfo}
          animationDelay={index * 50} // Stagger by 50ms
        />
      ))}
    </div>
  );
}
