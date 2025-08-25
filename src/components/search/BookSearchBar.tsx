/**
 * Advanced Book Search Bar Component
 * Features: instant search, keyboard navigation, testament filtering, mobile-optimized
 */

'use client';

import * as React from 'react';
import { Search, X, BookOpen, Zap } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Testament } from '@/types/bible';

interface BookSearchBarProps {
  searchQuery: string;
  testamentFilter: Testament | 'all';
  totalResults: number;
  hasActiveSearch: boolean;
  isEmpty: boolean;
  onSearchChange: (query: string) => void;
  onTestamentFilterChange: (testament: Testament | 'all') => void;
  onClearFilters: () => void;
  className?: string;
  placeholder?: string;
}

export function BookSearchBar({
  searchQuery,
  testamentFilter,
  totalResults,
  hasActiveSearch,
  isEmpty,
  onSearchChange,
  onTestamentFilterChange,
  onClearFilters,
  className,
  placeholder = "Hitady boky... (oh: Genesisy, Salamo, Matio)"
}: BookSearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Focus management
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Escape to clear search when focused
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (searchQuery) {
          onSearchChange('');
        } else {
          inputRef.current?.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, onSearchChange]);

  // Clear search input
  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  // Testament filter options
  const testamentOptions = [
    { value: 'all' as const, label: 'Testameta rehetra' },
    { value: Testament.OLD, label: 'Testameta Taloha' },
    { value: Testament.NEW, label: 'Testameta Vaovao' },
  ];

  const currentTestamentOption = testamentOptions.find(opt => opt.value === testamentFilter);
  const hasActiveFilters = testamentFilter !== 'all' || hasActiveSearch;

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Main Search Bar */}
      <div className="relative group">
        <div 
          className={cn(
            'relative flex items-center rounded-2xl transition-all duration-300',
            'bg-background/80 backdrop-blur-xl border shadow-lg',
            'hover:shadow-xl hover:shadow-primary/10',
            isFocused 
              ? 'border-primary ring-4 ring-primary/20 shadow-xl shadow-primary/20' 
              : 'border-border/50 hover:border-primary/50',
            hasActiveSearch && 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/20'
          )}
        >
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Search className={cn(
              'h-5 w-5 transition-all duration-300',
              isFocused || hasActiveSearch 
                ? 'text-primary scale-110' 
                : 'text-muted-foreground group-hover:text-primary'
            )} />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-32 py-4 border-0 bg-transparent',
              'text-lg md:text-base placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-0',
              'font-medium'
            )}
            autoComplete="off"
            spellCheck="false"
          />

          {/* Action Buttons */}
          <div className="absolute right-3 flex items-center space-x-2">
            {/* Clear Button */}
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                title="Fafao ny fitadiavana"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Testament Filter */}
            <select
              value={testamentFilter}
              onChange={(e) => onTestamentFilterChange(e.target.value as Testament | 'all')}
              className={cn(
                'h-8 px-3 text-sm font-medium rounded-full border-0 bg-transparent cursor-pointer',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20',
                testamentFilter !== 'all' 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              )}
              title="Sivana araka ny testameta"
            >
              <option value="all">Rehetra</option>
              <option value={Testament.OLD}>TT</option>
              <option value={Testament.NEW}>TV</option>
            </select>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        {!isFocused && !hasActiveSearch && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex items-center space-x-2 text-xs text-muted-foreground/60 pointer-events-none">
            <span>Tsindry</span>
            <kbd className="px-2 py-1 text-xs border rounded-md bg-muted/50 shadow-sm font-mono">⌘K</kbd>
          </div>
        )}
      </div>

      {/* Search Status & Quick Actions */}
      <div className="flex items-center justify-between">
        {/* Search Results Status */}
        <div className="flex items-center space-x-4">
          {hasActiveSearch && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  {isEmpty ? (
                    <span className="text-amber-600 dark:text-amber-400">Tsy nahita boky</span>
                  ) : (
                    <>
                      <span className="text-foreground font-bold">{totalResults}</span>
                      <span> boky hita</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {testamentFilter !== 'all' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Sivana:</span>
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {currentTestamentOption?.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Enhanced Quick Actions */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-md"
            >
              <X className="h-3 w-3 mr-1" />
              Fafao daholo
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Empty State Message */}
      {isEmpty && (
        <div className="text-center py-12 px-4">
          <div className="mx-auto max-w-md">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tsy nahita boky
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tsy nahita boky mitovy amin'ny "
              <span className="font-medium text-foreground">{searchQuery}</span>"
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>✨ Andramo teny hafa na teny fohy kokoa</p>
              <p>🔍 Jereo ny sivana Testamenta koa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Search suggestions component
 */
interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export function SearchSuggestions({ 
  suggestions, 
  onSuggestionClick, 
  className 
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) {return null;}

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs text-muted-foreground font-medium">Soso-kevitra:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs h-7 px-3 hover:bg-primary/10"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
