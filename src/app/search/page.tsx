/**
 * Search page - Advanced Bible search functionality
 * Client-side search with debouncing and filtering
 */

'use client';

import * as React from 'react';
import { Search, Filter, BookOpen, Clock } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VerseList } from '@/components/bible/verse-display';
import { Testament } from '@/types/bible';
import { debounce } from '@/utils';

interface SearchResult {
  book: { id: string; name: string; testament: Testament };
  chapter: string;
  verse: string;
  text: string;
  relevance: number;
}

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    testament: '' as '' | Testament,
    caseSensitive: false,
  });
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use API route for search
        const params = new URLSearchParams({
          q: searchQuery,
          caseSensitive: filters.caseSensitive.toString(),
          limit: '50',
        });

        if (filters.testament !== '') {
          params.append('testament', filters.testament === Testament.OLD ? 'old' : 'new');
        }

        const response = await fetch(`/api/search?${params.toString()}`);
        const searchResponse = await response.json();

        if (searchResponse.success && searchResponse.data) {
          setResults(searchResponse.data);
          // Add to recent searches
          setRecentSearches(prev => {
            const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)];
            return updated.slice(0, 5); // Keep only 5 recent searches
          });
        } else {
          setError(searchResponse.error || 'Nisy olana tamin\'ny fikarohana');
        }
      } catch {
        setError('Nisy olana tamin\'ny fikarohana');
      } finally {
        setLoading(false);
      }
    }, 300),
    [filters]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle verse click
  const handleVerseClick = (bookId: string, chapter: string, verse: string) => {
    // Navigate to specific verse
    window.location.href = `/books/${bookId}/${chapter}#verse-${verse}`;
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    debouncedSearch(searchTerm);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Hitady amin'ny Baiboly
          </h1>
          <p className="text-lg text-muted-foreground">
            Hitady andinin-tsoratra, teny, na hevitra amin'ny Baiboly rehetra
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Main search input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Sorato ny teny hitadiavinao..."
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-lg border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sivana:</span>
                </div>

                <select
                  value={filters.testament}
                  onChange={(e) => setFilters(prev => ({ ...prev, testament: e.target.value as '' | Testament }))}
                  className="px-3 py-1 border border-input rounded-md bg-background text-sm"
                >
                  <option value="">Testameta rehetra</option>
                  <option value={Testament.OLD}>Testameta Taloha</option>
                  <option value={Testament.NEW}>Testameta Vaovao</option>
                </select>

                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.caseSensitive}
                    onChange={(e) => setFilters(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                    className="rounded border-input"
                  />
                  <span>Tsy manaiky ny harena</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 h-5 w-5" />
                Fikarohana farany
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Mikaroka...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Vokatra ({results.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VerseList
                verses={results.map(result => ({
                  book: result.book.name,
                  chapter: result.chapter,
                  verse: result.verse,
                  text: result.text,
                }))}
                onVerseClick={(book, chapter, verse) => {
                  // Find the book ID from results
                  const result = results.find(r => r.book.name === book && r.chapter === chapter && r.verse === verse);
                  if (result) {
                    handleVerseClick(result.book.id, chapter, verse);
                  }
                }}
                searchTerm={query}
              />
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Tsy misy vokatra
                </h3>
                <p className="text-muted-foreground">
                  Andramo teny hafa na jereo ny fikarohana farany
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Tips */}
        {!query && (
          <Card>
            <CardHeader>
              <CardTitle>Toro-hevitra momba ny fikarohana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Ampiasao teny fohy sy mazava</p>
              <p>• Andramo teny samihafa raha tsy mahita vokatra</p>
              <p>• Ampiasao ny sivana hahafahana mikendry testameta manokana</p>
              <p>• Ny fikarohana dia tsy manaiky ny harena ka ny "Andriamanitra" sy "andriamanitra" dia mitovy</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
