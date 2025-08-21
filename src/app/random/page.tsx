/**
 * Random Verses Page
 * Displays random Bible verses with options to filter and refresh
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Book, Heart, Share2 } from 'lucide-react';
import { BookMeta } from '@/types/bible';

interface RandomVerse {
  book: BookMeta;
  chapter: string;
  verse: string;
  text: string;
}

interface RandomVersesResponse {
  success: boolean;
  data: RandomVerse[];
  error?: string;
}

const RandomVersesPage = () => {
  const [verses, setVerses] = useState<RandomVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [testament, setTestament] = useState<'all' | 'old' | 'new'>('all');

  const fetchRandomVerses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        count: count.toString(),
        ...(testament !== 'all' && { testament }),
      });

      const response = await fetch(`/api/random?${params}`);
      const result: RandomVersesResponse = await response.json();
      
      if (result.success && result.data) {
        setVerses(result.data);
      } else {
        setError(result.error || 'Failed to fetch random verses');
        setVerses([]);
      }
    } catch (error) {
      setError('Network error occurred');
      setVerses([]);
      console.error('Error fetching random verses:', error);
    } finally {
      setLoading(false);
    }
  }, [count, testament]);

  // Fetch initial random verse on component mount
  useEffect(() => {
    fetchRandomVerses();
  }, [fetchRandomVerses]);

  const handleRefresh = () => {
    fetchRandomVerses();
  };

  const handleShare = async (verse: RandomVerse) => {
    const shareText = `"${verse.text}" - ${verse.book.name} ${verse.chapter}:${verse.verse}`;
    
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

  const addToFavorites = (verse: RandomVerse) => {
    // This would integrate with your favorites system
    console.info('Adding to favorites:', verse);
    // You could add a toast notification here
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Book className="h-8 w-8" />
          Verset tsy ampoizina
        </h1>
        <p className="text-lg text-muted-foreground">
          Mahazoa verset tsy ampoizina avy amin&apos;ny Baiboly Malagasy
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Safidy</CardTitle>
          <CardDescription>
            Safidio ny isan&apos;ny verset sy ny Testameta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Isan&apos;ny verset
              </label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Testameta
              </label>
              <select
                value={testament}
                onChange={(e) => setTestament(e.target.value as 'all' | 'old' | 'new')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">Izy rehetra</option>
                <option value="old">Testameta taloha</option>
                <option value="new">Testameta vaovao</option>
              </select>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Havaozina
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Verses Display */}
      {!loading && verses.length > 0 && (
        <div className="space-y-6">
          {verses.map((verse, index) => (
            <Card key={`${verse.book.id}-${verse.chapter}-${verse.verse}-${index}`} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Verse Text */}
                  <blockquote className="text-lg leading-relaxed border-l-4 border-primary pl-4 italic">
                    &ldquo;{verse.text}&rdquo;
                  </blockquote>
                  
                  {/* Verse Reference */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{verse.book.name}</span>
                      <span className="mx-1">•</span>
                      <span>Toko {verse.chapter}:{verse.verse}</span>
                      <span className="mx-1">•</span>
                      <span>{verse.book.testament}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToFavorites(verse)}
                        className="h-8 w-8 p-0"
                        title="Atao ankafiziko"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(verse)}
                        className="h-8 w-8 p-0"
                        title="Zarao"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && verses.length === 0 && (
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
