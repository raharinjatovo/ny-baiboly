/**
 * Book Navigation Button with Loading
 * Reusable component for navigating to books with loading feedback
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { cn } from '@/utils';

interface BookNavigationButtonProps {
  bookId: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  loadingText?: string;
}

export function BookNavigationButton({
  bookId,
  children,
  variant = 'default',
  size = 'default',
  className,
  loadingText
}: BookNavigationButtonProps) {
  const { navigateWithLoading, isTargetLoading } = useNavigationLoading();
  const bookUrl = `/books/${bookId}`;
  const isLoading = isTargetLoading(bookUrl);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(bookUrl, {
      loadingText: loadingText || `Misokatra ${bookId}...`
    });
  };

  return (
    <LoadingCard 
      isLoading={isLoading}
      loadingText={loadingText || `Misokatra ${bookId}...`}
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
        <Link href={bookUrl as `/books/${string}`} onClick={handleClick}>
          {children}
        </Link>
      </Button>
    </LoadingCard>
  );
}

/**
 * Simple Book Link with Loading
 * For text-based book navigation links
 */
interface BookNavigationLinkProps {
  bookId: string;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
}

export function BookNavigationLink({
  bookId,
  children,
  className,
  loadingText
}: BookNavigationLinkProps) {
  const { navigateWithLoading, isTargetLoading } = useNavigationLoading();
  const bookUrl = `/books/${bookId}`;
  const isLoading = isTargetLoading(bookUrl);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithLoading(bookUrl, {
      loadingText: loadingText || `Misokatra ${bookId}...`
    });
  };

  return (
    <LoadingCard 
      isLoading={isLoading}
      loadingText={loadingText || `Misokatra ${bookId}...`}
      variant="sniper"
    >
      <Link 
        href={bookUrl as `/books/${string}`} 
        onClick={handleClick}
        className={cn(
          'inline-block transition-colors hover:text-primary',
          isLoading && 'pointer-events-none opacity-75',
          className
        )}
      >
        {children}
      </Link>
    </LoadingCard>
  );
}
