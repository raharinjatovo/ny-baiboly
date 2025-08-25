/**
 * Books listing page with advanced search functionality
 * Beautiful, accessible UI following modern design principles
 */

'use client';

import * as React from 'react';
import { TestamentSection } from "@/components/bible/book-card";
import { BookSearchBar } from "@/components/search/BookSearchBar";
import { SearchResultsGrid } from "@/components/search/SearchBookCard";
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, ALL_BIBLE_BOOKS } from "@/constants/bible";
import { Testament } from "@/types/bible";
import { useBookSearch } from "@/hooks/useBookSearch";
import PageLayout from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BookOpen, Sparkles, TrendingUp } from "lucide-react";

/**
 * Popular search suggestions
 */
const SEARCH_SUGGESTIONS = [
  'Genesis', 'Genesisy', 'Salamo', 'Matio', 'Jaona', 'Romanina',
  'Ohabolana', 'Apokalypsy', 'Tantara', 'Mpanjaka'
];

export default function BooksPage() {
  const breadcrumbs = [
    { label: 'Boky', current: true }
  ];

  // Initialize search functionality
  const {
    searchQuery,
    testamentFilter,
    results,
    groupedResults,
    totalCount,
    hasActiveSearch,
    isEmpty,
    setSearchQuery,
    setTestamentFilter,
    clearFilters,
  } = useBookSearch({
    books: ALL_BIBLE_BOOKS,
    debounceMs: 150,
    minSearchLength: 1,
  });

  /**
   * Handle search suggestions
   */
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  /**
   * Get filtered suggestions based on current query
   */
  const filteredSuggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) {
      return SEARCH_SUGGESTIONS.slice(0, 6);
    }
    
    return SEARCH_SUGGESTIONS.filter(suggestion =>
      !suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4);
  }, [searchQuery]);

  return (
    <PageLayout
      title="Boky rehetra"
      description="Hitady sy hamaky ny boky rehetra ao amin'ny Baiboly"
      breadcrumbs={breadcrumbs}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Hero Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-4 w-4" />
                Fitadiavana haingana sy mora ampiasaina
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Ny Boky rehetra
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    amin'ny Baiboly
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Safidio ny boky tianao ho vakina amin'ny boky 66 ao amin'ny Baiboly. 
                  Ampiasao ny fitadiavana haingana mba hahitana mora foana ny boky.
                </p>
              </div>
            </div>

            {/* Enhanced Search Section */}
            <div className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <BookSearchBar
                  searchQuery={searchQuery}
                  testamentFilter={testamentFilter}
                  totalResults={totalCount}
                  hasActiveSearch={hasActiveSearch}
                  isEmpty={isEmpty}
                  onSearchChange={setSearchQuery}
                  onTestamentFilterChange={setTestamentFilter}
                  onClearFilters={clearFilters}
                />
              </div>

              {/* Search Suggestions */}
              {!hasActiveSearch && (
                <div className="max-w-lg mx-auto">
                  <div className="text-sm text-muted-foreground mb-3 font-medium">
                    Soso-kevitra malaza:
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-all duration-200 hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats - Enhanced Design */}
            {!hasActiveSearch && (
              <div className="pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent" />
                    <CardContent className="relative p-6 text-center">
                      <div className="mb-3">
                        <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">66</div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Boky rehetra</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent" />
                    <CardContent className="relative p-6 text-center">
                      <div className="mb-3">
                        <div className="w-12 h-12 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                          <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">39</div>
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Testameta Taloha</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent" />
                    <CardContent className="relative p-6 text-center">
                      <div className="mb-3">
                        <div className="w-12 h-12 mx-auto bg-violet-500/10 rounded-full flex items-center justify-center mb-3">
                          <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="text-3xl font-bold text-violet-700 dark:text-violet-300 mb-1">27</div>
                        <div className="text-sm font-medium text-violet-600 dark:text-violet-400">Testameta Vaovao</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="space-y-8">
          {hasActiveSearch ? (
            /* Search Results */
            <div className="space-y-6">
              {!isEmpty && (
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Valin'ny fitadiavana
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>{totalCount} boky hita</span>
                  </div>
                </div>
              )}

              {/* Grouped Results */}
              {testamentFilter === 'all' && !isEmpty ? (
                <div className="space-y-8">
                  {groupedResults.oldTestament.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full" />
                        <h3 className="text-lg font-semibold text-foreground">
                          Testameta Taloha ({groupedResults.oldTestament.length})
                        </h3>
                      </div>
                      <SearchResultsGrid
                        results={groupedResults.oldTestament}
                        searchQuery={searchQuery}
                        columns={4}
                      />
                    </div>
                  )}

                  {groupedResults.newTestament.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-1 h-6 bg-green-500 rounded-full" />
                        <h3 className="text-lg font-semibold text-foreground">
                          Testameta Vaovao ({groupedResults.newTestament.length})
                        </h3>
                      </div>
                      <SearchResultsGrid
                        results={groupedResults.newTestament}
                        searchQuery={searchQuery}
                        columns={4}
                      />
                    </div>
                  )}
                </div>
              ) : !isEmpty ? (
                <SearchResultsGrid
                  results={results}
                  searchQuery={searchQuery}
                  columns={4}
                />
              ) : null}
            </div>
          ) : (
            /* Enhanced Browse View */
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
              <div className="max-w-7xl mx-auto space-y-16">
                {/* Quick Search Tip */}
                <div className="max-w-3xl mx-auto">
                  <Card className="relative overflow-hidden border-0 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10" />
                    <CardContent className="relative p-8 text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">Fanamarihana malaza</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Ampiasao ny <kbd className="px-3 py-1.5 bg-muted rounded-lg text-sm font-mono shadow-sm">⌘K</kbd> mba 
                        hampiasana haingana ny fitadiavana, na manorato fotsiny ny anaran'ny boky etsy ambony.
                        Azonao atao koa ny misafidy araka ny testameta.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Testament Sections with Enhanced Design */}
                <div className="space-y-20">
                  <TestamentSection 
                    testament={Testament.OLD}
                    books={OLD_TESTAMENT_BOOKS}
                  />

                  <TestamentSection 
                    testament={Testament.NEW}
                    books={NEW_TESTAMENT_BOOKS}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
    </PageLayout>
  );
}
