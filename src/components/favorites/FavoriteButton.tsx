/**
 * Favorite Button Component
 * Reusable component for adding/removing verses from favorites
 */

'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavoriteVerse } from '@/contexts/FavoritesContext';
import { cn } from '@/utils';

interface FavoriteButtonProps {
  bookId: string;
  chapter: string;
  verse: string;
  verseData: {
    book: string;
    text: string;
    reference: string;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showText?: boolean;
  className?: string;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  bookId,
  chapter,
  verse,
  verseData,
  size = 'md',
  variant = 'ghost',
  showText = false,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useFavoriteVerse(bookId, chapter, verse, verseData);
  const [isAnimating, setIsAnimating] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  const handleToggle = () => {
    try {
      setIsAnimating(true);
      setJustToggled(true);
      
      const newState = toggleFavorite();
      console.info('Button toggle result:', newState, 'for verse:', verseData.reference);
      
      onToggle?.(newState);
      
      // Reset animation after a short delay
      setTimeout(() => {
        setIsAnimating(false);
        setJustToggled(false);
      }, 500);
    } catch (error) {
      console.error('Error in favorite button toggle:', error);
      setIsAnimating(false);
      setJustToggled(false);
    }
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const buttonSizes = {
    sm: 'h-8 px-2',
    md: 'h-9 px-3',
    lg: 'h-10 px-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        // Base button styles
        'group inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'rounded-md text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'cursor-pointer relative',
        
        // Size variants
        buttonSizes[size],
        
        // Variant-specific base styles
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        variant === 'outline' && 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        variant === 'default' && 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        
        // Favorited state styles (higher specificity)
        isFavorited && variant === 'ghost' && '!text-red-600 dark:!text-red-400 !bg-red-50 dark:!bg-red-900/20 hover:!bg-red-100 dark:hover:!bg-red-900/30',
        isFavorited && variant === 'outline' && '!border-red-300 !text-red-600 dark:!border-red-700 dark:!text-red-400 !bg-red-50 dark:!bg-red-900/20 hover:!bg-red-100 dark:hover:!bg-red-900/30',
        
        // Not favorited state styles
        !isFavorited && 'hover:!text-red-500 dark:hover:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/10',
        
        // Animation state
        justToggled && 'ring-2 ring-red-300 dark:ring-red-600',
        className
      )}
      title={isFavorited ? 'Esory amin\'ny ankafiziko' : 'Atao ankafiziko'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-300 pointer-events-none',
          isFavorited 
            ? 'fill-red-600 text-red-600 dark:fill-red-400 dark:text-red-400' 
            : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400',
          isAnimating && 'scale-125 rotate-12',
          showText && 'mr-2'
        )}
      />
      {showText && (
        <span className={cn(textSizes[size], 'font-medium pointer-events-none')}>
          {isFavorited ? 'Tiako' : 'Atao ankafiziko'}
        </span>
      )}
      
      {/* Pulse animation for new favorites */}
      {isAnimating && isFavorited && (
        <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20 pointer-events-none" />
      )}
    </button>
  );
}

/**
 * Compact favorite button for use in verse lists
 */
interface CompactFavoriteButtonProps {
  bookId: string;
  chapter: string;
  verse: string;
  verseData: {
    book: string;
    text: string;
    reference: string;
  };
  className?: string;
  onToggle?: (isFavorited: boolean) => void;
}

export function CompactFavoriteButton({
  bookId,
  chapter,
  verse,
  verseData,
  className,
  onToggle,
}: CompactFavoriteButtonProps) {
  return (
    <FavoriteButton
      bookId={bookId}
      chapter={chapter}
      verse={verse}
      verseData={verseData}
      size="sm"
      variant="ghost"
      className={cn('h-6 w-6 p-0', className)}
      onToggle={onToggle}
    />
  );
}

/**
 * Favorite button with text for use in detailed views
 */
interface DetailedFavoriteButtonProps {
  bookId: string;
  chapter: string;
  verse: string;
  verseData: {
    book: string;
    text: string;
    reference: string;
  };
  className?: string;
  onToggle?: (isFavorited: boolean) => void;
}

export function DetailedFavoriteButton({
  bookId,
  chapter,
  verse,
  verseData,
  className,
  onToggle,
}: DetailedFavoriteButtonProps) {
  return (
    <FavoriteButton
      bookId={bookId}
      chapter={chapter}
      verse={verse}
      verseData={verseData}
      size="md"
      variant="outline"
      showText={true}
      className={className}
      onToggle={onToggle}
    />
  );
}
