/**
 * Advanced book search hook with debouncing and fuzzy matching
 * Optimized for fast, fluid search experience
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { BookMeta, Testament } from '@/types/bible';
import { useDebounce } from '@/hooks/useDebounce';

interface UseBookSearchOptions {
  books: BookMeta[];
  debounceMs?: number;
  minSearchLength?: number;
}

interface SearchFilters {
  testament: Testament | 'all';
  searchQuery: string;
}

interface SearchResult {
  book: BookMeta;
  matchScore: number;
  matchType: 'exact' | 'starts_with' | 'contains' | 'fuzzy';
}

export function useBookSearch({ 
  books, 
  debounceMs = 150,
  minSearchLength = 1 
}: UseBookSearchOptions) {
  const [filters, setFilters] = useState<SearchFilters>({
    testament: 'all',
    searchQuery: ''
  });

  // Debounce search query for performance
  const debouncedQuery = useDebounce(filters.searchQuery, debounceMs);

  /**
   * Calculate match score for fuzzy search
   */
  const calculateMatchScore = useCallback((text: string, query: string): number => {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    // Exact match
    if (normalizedText === normalizedQuery) {return 100;}

    // Starts with match
    if (normalizedText.startsWith(normalizedQuery)) {return 90;}

    // Contains match
    if (normalizedText.includes(normalizedQuery)) {return 70;}

    // Fuzzy match - calculate character similarity
    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
      if (normalizedText[i] === normalizedQuery[queryIndex]) {
        score += 10;
        queryIndex++;
      }
    }

    // Bonus for consecutive matches
    if (queryIndex === normalizedQuery.length) {
      score += 20;
    }

    return Math.min(score, 60); // Cap fuzzy score at 60
  }, []);

  /**
   * Get match type based on score
   */
  const getMatchType = useCallback((score: number): SearchResult['matchType'] => {
    if (score === 100) {return 'exact';}
    if (score >= 90) {return 'starts_with';}
    if (score >= 70) {return 'contains';}
    return 'fuzzy';
  }, []);

  /**
   * Search and filter books
   */
  const searchResults = useMemo(() => {
    let filteredBooks = books;

    // Filter by testament
    if (filters.testament !== 'all') {
      filteredBooks = books.filter(book => book.testament === filters.testament);
    }

    // If no search query, return all filtered books
    if (!debouncedQuery || debouncedQuery.length < minSearchLength) {
      return {
        results: filteredBooks.map(book => ({
          book,
          matchScore: 0,
          matchType: 'exact' as const
        })),
        query: debouncedQuery,
        totalCount: filteredBooks.length,
        hasActiveSearch: false
      };
    }

    // Search in book names
    const searchResults: SearchResult[] = [];
    
    for (const book of filteredBooks) {
      const nameScore = calculateMatchScore(book.name, debouncedQuery);
      
      // Also search in ID for alternative spellings
      const idScore = calculateMatchScore(book.id, debouncedQuery);
      
      const maxScore = Math.max(nameScore, idScore);
      
      // Only include if there's a reasonable match
      if (maxScore >= 30) {
        searchResults.push({
          book,
          matchScore: maxScore,
          matchType: getMatchType(maxScore)
        });
      }
    }

    // Sort by match score (best matches first)
    searchResults.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      // Secondary sort by name for consistent ordering
      return a.book.name.localeCompare(b.book.name);
    });

    return {
      results: searchResults,
      query: debouncedQuery,
      totalCount: searchResults.length,
      hasActiveSearch: true
    };
  }, [books, filters, debouncedQuery, minSearchLength, calculateMatchScore, getMatchType]);

  /**
   * Update search query
   */
  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  /**
   * Update testament filter
   */
  const setTestamentFilter = useCallback((testament: Testament | 'all') => {
    setFilters(prev => ({ ...prev, testament }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      testament: 'all',
      searchQuery: ''
    });
  }, []);

  /**
   * Get grouped results by testament
   */
  const groupedResults = useMemo(() => {
    const groups: {
      oldTestament: SearchResult[];
      newTestament: SearchResult[];
    } = {
      oldTestament: [],
      newTestament: []
    };

    searchResults.results.forEach(result => {
      if (result.book.testament === Testament.OLD) {
        groups.oldTestament.push(result);
      } else {
        groups.newTestament.push(result);
      }
    });

    return groups;
  }, [searchResults.results]);

  return {
    // State
    searchQuery: filters.searchQuery,
    testamentFilter: filters.testament,
    debouncedQuery,
    
    // Results
    results: searchResults.results,
    groupedResults,
    totalCount: searchResults.totalCount,
    hasActiveSearch: searchResults.hasActiveSearch,
    isEmpty: searchResults.totalCount === 0 && searchResults.hasActiveSearch,
    
    // Actions
    setSearchQuery,
    setTestamentFilter,
    clearFilters,
  };
}
