/**
 * Random Verses Page
 * Displays random Bible verses with options to filter and refresh
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Book, Share2 } from 'lucide-react';
import { DetailedFavoriteButton } from '@/components/favorites/FavoriteButton';
import { ALL_BIBLE_BOOKS } from '@/constants/bible';

/**
 * Convert Malagasy book name to English book ID for consistency
 */
function getCorrectBookId(malagasyBookName: string): string {
  // Find by Malagasy name
  const book = ALL_BIBLE_BOOKS.find(book => 
    book.name.toLowerCase() === malagasyBookName.toLowerCase()
  );
  
  if (book) {
    return book.id;
  }
  
  // Fallback to sanitized name if not found
  return malagasyBookName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

interface RandomVerseApiResponse {
  translation: {
    identifier: string;
    name: string;
    language: string;
    language_code: string;
    license: string;
  };
  random_verse: {
    book_id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
}

const RandomVersesPage = () => {
  const [verse, setVerse] = useState<RandomVerseApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomVerse = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/random-verse');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: RandomVerseApiResponse = await response.json();
      setVerse(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Network error occurred');
      setVerse(null);
      console.error('Error fetching random verse:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial random verse on component mount
  useEffect(() => {
    fetchRandomVerse();
  }, [fetchRandomVerse]);

  const handleRefresh = () => {
    fetchRandomVerse();
  };

  const handleShare = async () => {
    if (!verse) {return;}
    
    const shareText = `"${verse.random_verse.text}" - ${verse.random_verse.book} ${verse.random_verse.chapter}:${verse.random_verse.verse}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bible Verse',
          text: shareText,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareText);
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.info('Verse copied to clipboard');
    } catch {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Book className="h-8 w-8" />
          Verset tsy ampoizina
        </h1>
        <p className="text-lg text-muted-foreground">
          Mahazoa verset tsy ampoizina avy amin&apos;ny Baiboly Malagasy
        </p>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-medium">Nisy olana:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Mitady verset...</span>
          </div>
        </div>
      )}

      {/* Verse Display */}
      {!loading && verse && (
        <Card className="overflow-hidden mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Verse Text */}
              <blockquote className="text-lg leading-relaxed border-l-4 border-primary pl-4 italic">
                &ldquo;{verse.random_verse.text}&rdquo;
              </blockquote>
              
              {/* Verse Reference */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{verse.random_verse.book}</span>
                  <span className="mx-1">•</span>
                  <span>Toko {verse.random_verse.chapter}:{verse.random_verse.verse}</span>
                  <span className="mx-1">•</span>
                  <span>{verse.translation.name}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <DetailedFavoriteButton
                    bookId={getCorrectBookId(verse.random_verse.book)}
                    chapter={verse.random_verse.chapter.toString()}
                    verse={verse.random_verse.verse.toString()}
                    verseData={{
                      book: verse.random_verse.book,
                      text: verse.random_verse.text,
                      reference: `${verse.random_verse.book} ${verse.random_verse.chapter}:${verse.random_verse.verse}`,
                    }}
                    onToggle={(isFavorited) => {
                      console.info(`Random verse ${isFavorited ? 'added to' : 'removed from'} favorites`);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-8 w-8 p-0"
                    title="Zarao"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 ml-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Havaozina
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && !verse && (
        <Card className="text-center py-12">
          <CardContent>
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tsy misy verset hita</h3>
            <p className="text-muted-foreground mb-4">
              Mitsindria ny bokotra &quot;Havaozina&quot; mba hahazoana verset vaovao
            </p>
            <Button onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Havaozina
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Daily Verse Feature Info */}
      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-blue-900">
              Verset isan&apos;andro
            </h3>
            <p className="text-blue-700 text-sm">
              Avereno eto isan&apos;andro mba hahazoana verset vaovao ho fanohanana sy fampahatakarana
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RandomVersesPage;
