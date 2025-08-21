/**
 * Favorites page - User's saved verses and bookmarks
 * Demonstrates local storage usage and state management
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Trash2, BookOpen, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils';

interface Favorite {
  id: string;
  book: string;
  bookId: string;
  chapter: string;
  verse: string;
  text: string;
  note?: string;
  dateAdded: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load favorites from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('bible-favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  React.useEffect(() => {
    if (!loading) {
      localStorage.setItem('bible-favorites', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const navigateToVerse = (bookId: string, chapter: string, verse: string) => {
    window.location.href = `/books/${bookId}/${chapter}#verse-${verse}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Mamaky...</span>
          </div>
        </div>
      </Layout>
    );
  }

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
                  onNavigate={() => navigateToVerse(favorite.bookId, favorite.chapter, favorite.verse)}
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
                    const data = JSON.stringify(favorites, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ny-baiboly-ankafiziko.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Halaina
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (confirm('Vonona ve ianareo hamafa ny ankafiziko rehetra?')) {
                      setFavorites([]);
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
  onNavigate: () => void;
}

function FavoriteCard({ favorite, onRemove, onNavigate }: FavoriteCardProps) {
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
            <p 
              className="text-foreground leading-relaxed cursor-pointer hover:text-primary transition-colors"
              onClick={onNavigate}
            >
              {favorite.text}
            </p>

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
              <Button size="sm" variant="outline" onClick={onNavigate}>
                Jereo
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
