/**
 * Modern Loading Spinner Components
 * Following UI/UX principles for engaging user feedback
 */

'use client';

import * as React from 'react';
import { cn } from '@/utils';
import { Loader2, BookOpen, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'book' | 'sniper';
  className?: string;
  text?: string;
  color?: 'primary' | 'blue' | 'emerald' | 'violet';
}

/**
 * Versatile loading spinner with multiple variants
 */
export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text,
  color = 'primary'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
    violet: 'text-violet-500'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        <div className={cn('flex space-x-1')}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-full animate-pulse',
                size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-1.5 w-1.5' : 'h-2 w-2',
                colorClasses[color]
              )}
              style={{
                backgroundColor: 'currentColor',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <span className={cn('ml-3 font-medium', colorClasses[color], textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <div className={cn(
          'rounded-full animate-pulse',
          sizeClasses[size],
          colorClasses[color]
        )} style={{ backgroundColor: 'currentColor' }} />
        {text && (
          <span className={cn('font-medium animate-pulse', colorClasses[color], textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'book') {
    return (
      <div className={cn('flex flex-col items-center space-y-3', className)}>
        <div className="relative">
          <BookOpen className={cn(sizeClasses[size], colorClasses[color], 'animate-pulse')} />
          <div className={cn(
            'absolute inset-0 rounded-full animate-ping',
            colorClasses[color]
          )} style={{ backgroundColor: 'currentColor', opacity: 0.2 }} />
        </div>
        {text && (
          <span className={cn('font-medium text-center', colorClasses[color], textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'sniper') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <div className="relative">
          <div className={cn(
            'rounded-full border-2 border-transparent animate-spin',
            sizeClasses[size]
          )}>
            <div className={cn(
              'absolute inset-0 rounded-full border-2 border-t-transparent',
              colorClasses[color]
            )} style={{ borderTopColor: 'currentColor' }} />
          </div>
          <Zap className={cn(
            'absolute inset-0 m-auto animate-pulse',
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-6 w-6',
            colorClasses[color]
          )} />
        </div>
        {text && (
          <span className={cn('font-medium', colorClasses[color], textSizes[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size], colorClasses[color])} />
      {text && (
        <span className={cn('font-medium', colorClasses[color], textSizes[size])}>
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Full-page loading overlay
 */
interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  text = 'Manampy...', 
  variant = 'sniper',
  className 
}: LoadingOverlayProps) {
  if (!isVisible) {return null;}

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-background/80 backdrop-blur-sm',
      'transition-all duration-300',
      className
    )}>
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-card shadow-xl border">
        <LoadingSpinner 
          variant={variant}
          size="lg"
          text={text}
          color="primary"
        />
      </div>
    </div>
  );
}

/**
 * Inline loading state for cards/components
 */
interface LoadingCardProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: LoadingSpinnerProps['variant'];
  className?: string;
}

export function LoadingCard({ 
  isLoading, 
  children, 
  loadingText = 'Manampy...',
  variant = 'sniper',
  className 
}: LoadingCardProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg transition-all duration-200">
          <LoadingSpinner 
            variant={variant}
            size="md"
            text={loadingText}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
