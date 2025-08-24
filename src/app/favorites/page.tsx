/**
 * Favorites page - User's saved verses and bookmarks
 * Demonstrates local storage usage and state management
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Heart, Trash2, BookOpen, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils';
import { useFavorites, type Favorite } from '@/contexts/FavoritesContext';
import { ALL_BIBLE_BOOKS } from '@/constants/bible';

/**
 * Convert Malagasy book name or fileName to English book ID for URL routing
 */
function getEnglishBookId(malagasyBookIdOrName: string): string {
  // First, try to find by fileName (e.g., "genesisy" -> "genesis")
  const bookByFileName = ALL_BIBLE_BOOKS.find(book => 
    book.fileName.toLowerCase() === malagasyBookIdOrName.toLowerCase()
  );
  
  if (bookByFileName) {
    return bookByFileName.id;
  }
  
  // Then try to find by Malagasy name (e.g., "Genesisy" -> "genesis")
  const bookByName = ALL_BIBLE_BOOKS.find(book => 
    book.name.toLowerCase() === malagasyBookIdOrName.toLowerCase()
  );
  
  if (bookByName) {
    return bookByName.id;
  }
  
  // Fallback: try to clean up the input and match
  const cleanInput = malagasyBookIdOrName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  const bookByCleanName = ALL_BIBLE_BOOKS.find(book => 
    book.fileName === cleanInput || 
    book.id === cleanInput ||
    book.name.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-') === cleanInput
  );
  
  if (bookByCleanName) {
    return bookByCleanName.id;
  }
  
  // If all else fails, return the input (hopefully it's already English)
  console.warn(`Could not find English book ID for: ${malagasyBookIdOrName}`);
  return malagasyBookIdOrName;
}

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearAllFavorites, exportFavorites } = useFavorites();

  const getVerseUrl = (bookId: string, chapter: string, verse: string): Route => {
    const englishBookId = getEnglishBookId(bookId);
    return `/books/${englishBookId}/${chapter}#verse-${verse}` as Route;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Ny ankafiziko
          </h1>
          <p className="text-lg text-muted-foreground">
            Ireo andinin-tsoratra notehirizinao
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="mx-auto h-8 w-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {favorites.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Ankafiziko
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {new Set(favorites.map(f => f.bookId)).size}
              </div>
              <div className="text-sm text-muted-foreground">
                Boky
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="mx-auto h-8 w-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {favorites.filter(f => 
                  new Date(f.dateAdded).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Anio
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Heart className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Mbola tsy misy ankafiziko
                </h3>
                <p className="text-muted-foreground mb-6">
                  Manomboka mamaky ny Baiboly ary tehirizo ireo andinin-tsoratra tiananao
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/books">Jereo ny boky rehetra</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/search">Hitady andinin-tsoratra</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites
              .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
              .map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  onRemove={() => removeFavorite(favorite.id)}
                  verseUrl={getVerseUrl(favorite.bookId, favorite.chapter, favorite.verse)}
                />
              ))}
          </div>
        )}

        {/* Import/Export Actions */}
        {favorites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fikarakarana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    exportFavorites();
                  }}
                >
                  Halaina
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (confirm('Vonona ve ianareo hamafa ny ankafiziko rehetra?')) {
                      clearAllFavorites();
                    }
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Fafao daholo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

/**
 * Individual favorite card component
 */
interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: () => void;
  verseUrl: Route;
}

function FavoriteCard({ favorite, onRemove, verseUrl }: FavoriteCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Reference */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{favorite.book}</span>
              <span>{favorite.chapter}:{favorite.verse}</span>
              <span className="text-xs">
                {formatDate(new Date(favorite.dateAdded))}
              </span>
            </div>

            {/* Verse Text */}
            <Link href={verseUrl}>
              <p className="text-foreground leading-relaxed cursor-pointer hover:text-primary transition-colors">
                {favorite.text}
              </p>
            </Link>

            {/* Note */}
            {favorite.note && (
              <div className="bg-accent rounded-md p-3">
                <p className="text-sm text-muted-foreground italic">
                  "{favorite.note}"
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="outline" asChild>
                <Link href={verseUrl}>Jereo</Link>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onRemove}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
