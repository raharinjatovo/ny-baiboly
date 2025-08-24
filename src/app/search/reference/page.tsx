'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, History, Sparkles } from 'lucide-react';
import BibleReferenceInput from '@/components/search/BibleReferenceInput';
import VerseDisplay from '@/components/search/VerseDisplay';
import PageLayout from '@/components/layout/page-layout';

interface SearchReferenceResponse {
  verses: Array<{
    book: string;
    bookId: string;
    chapter: string;
    verse: string;
    text: string;
    reference: string;
  }>;
  requestedCount: number;
  foundCount: number;
  book: string;
  chapter: string;
  executionTime: number;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}

const SearchReferencePage: React.FC = () => {
  const [searchResult, setSearchResult] = useState<SearchReferenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('bible-search-history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSearchHistory(history.map((item: {
          book: string;
          chapter: number;
          verses: number[];
          timestamp: string;
        }) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (query: string, resultCount: number) => {
    const newEntry: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      resultCount,
    };

    const updatedHistory = [newEntry, ...searchHistory.slice(0, 9)]; // Keep last 10
    setSearchHistory(updatedHistory);
    
    try {
      localStorage.setItem('bible-search-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  /**
   * Handle search request
   */
  const handleSearch = async (reference: {
    book: string;
    chapter: number;
    verses: (number | { start: number; end?: number })[];
  }) => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch('/api/search-reference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reference),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      setSearchResult(data);
      
      // Save to search history
      const queryString = `${reference.book} ${reference.chapter}:${
        reference.verses.map(v => 
          typeof v === 'number' ? v.toString() : `${v.start}${v.end ? `-${v.end}` : ''}`
        ).join(',')
      }`;
      saveSearchHistory(queryString, data.foundCount);

    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle search from history
   */
  const searchFromHistory = (historyItem: SearchHistory) => {
    // Parse the history query and trigger search
    const match = historyItem.query.match(/^(.+?)\s+(\d+):(.+)$/);
    if (match) {
      const [, book, chapter, versesStr] = match;
      
      // Parse verses from string
      const verses: (number | { start: number; end?: number })[] = [];
      const parts = versesStr.split(',');
      
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
          verses.push({ start, end });
        } else {
          verses.push(parseInt(trimmed));
        }
      }
      
      handleSearch({
        book: book.toLowerCase(),
        chapter: parseInt(chapter),
        verses,
      });
    }
  };

  /**
   * Clear search history
   */
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('bible-search-history');
  };

  const breadcrumbItems = [
    { label: 'Search', href: '/search' },
    { label: 'Reference Search', current: true },
  ];

  return (
    <PageLayout
      title="Bible Reference Search"
      description="Search for specific Bible verses by book, chapter, and verse numbers"
      breadcrumbs={breadcrumbItems}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bible Reference Search
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find specific Bible verses by entering the book name, chapter, and verse numbers. 
            You can search for single verses, multiple verses, or verse ranges.
          </p>
        </div>

        {/* Search Examples */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 
                      dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 
                      rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Search Examples
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Single verse:</strong>
              <ul className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                <li>• Book: "John", Chapter: 3, Verses: "16"</li>
                <li>• Book: "Genesis", Chapter: 1, Verses: "1"</li>
              </ul>
            </div>
            <div>
              <strong>Multiple verses:</strong>
              <ul className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                <li>• Book: "Psalm", Chapter: 23, Verses: "1,4,6"</li>
                <li>• Book: "Romans", Chapter: 8, Verses: "1-5,28"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <BibleReferenceInput 
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && !searchResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <History className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Searches
                </h3>
              </div>
              <button
                onClick={clearHistory}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 
                         dark:hover:text-gray-200 transition-colors"
              >
                Clear history
              </button>
            </div>
            
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => searchFromHistory(item)}
                  className="w-full text-left p-3 rounded-md border border-gray-200 
                           dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 
                           transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {item.query}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.resultCount} verses
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                        rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" 
                     viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Search Error
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <VerseDisplay searchResult={searchResult} />
          </div>
        )}

        {/* Empty State */}
        {!searchResult && !error && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Ready to search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a book name, chapter, and verse numbers above to find specific Bible verses.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchReferencePage;
