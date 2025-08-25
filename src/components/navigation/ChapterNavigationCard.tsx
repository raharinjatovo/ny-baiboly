/**
 * Chapter Navigation Card with Loading
 * Displays chapter numbers with loading feedback on navigation
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { cn } from '@/utils';

interface ChapterNavigationCardProps {
  bookId: string;
  chapterNumber: string;
  bookName?: string;
  className?: string;
}

export function ChapterNavigationCard({ 
  bookId, 
  chapterNumber, 
  bookName,
  className 
}: ChapterNavigationCardProps) {
  const { navigateWithLoading, isTargetLoading } = useNavigationLoading();
  const chapterUrl = `/books/${bookId}/${chapterNumber}`;
  const isLoading = isTargetLoading(chapterUrl);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(chapterUrl, {
      loadingText: `Misokatra toko ${chapterNumber}${bookName ? ` - ${bookName}` : ''}...`
    });
  };

  return (
    <LoadingCard 
      isLoading={isLoading}
      loadingText={`Misokatra toko ${chapterNumber}${bookName ? ` - ${bookName}` : ''}...`}
      variant="sniper"
    >
      <Link href={chapterUrl as `/books/${string}/${string}`} onClick={handleClick}>
        <Card className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
          "text-center h-16 flex items-center justify-center",
          "border-2 hover:border-primary/50",
          isLoading && 'pointer-events-none opacity-75',
          className
        )}>
          <CardContent className="p-0">
            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {chapterNumber}
            </span>
          </CardContent>
        </Card>
      </Link>
    </LoadingCard>
  );
}

/**
 * Chapter Navigation Button with Loading
 * For text-based chapter navigation (like "Start with first chapter")
 */
interface ChapterNavigationButtonProps {
  bookId: string;
  chapterNumber: string;
  children: React.ReactNode;
  bookName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ChapterNavigationButton({
  bookId,
  chapterNumber,
  children,
  bookName,
  variant = 'outline',
  size = 'default',
  className
}: ChapterNavigationButtonProps) {
  const { navigateWithLoading, isTargetLoading } = useNavigationLoading();
  const chapterUrl = `/books/${bookId}/${chapterNumber}`;
  const isLoading = isTargetLoading(chapterUrl);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(chapterUrl, {
      loadingText: `Misokatra toko ${chapterNumber}${bookName ? ` - ${bookName}` : ''}...`
    });
  };

  return (
    <LoadingCard 
      isLoading={isLoading}
      loadingText={`Misokatra toko ${chapterNumber}${bookName ? ` - ${bookName}` : ''}...`}
      variant="sniper"
    >
      <Button 
        asChild 
        variant={variant} 
        size={size} 
        className={cn(
          isLoading && 'pointer-events-none opacity-75',
          className
        )}
      >
        <Link href={chapterUrl as `/books/${string}/${string}`} onClick={handleClick}>
          {children}
        </Link>
      </Button>
    </LoadingCard>
  );
}
