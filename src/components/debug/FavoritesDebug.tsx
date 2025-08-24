/**
 * Debug component to test favorites functionality
 * Add this temporarily to any page to test the favorites system
 */

'use client';

import React from 'react';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { useFavorites } from '@/contexts/FavoritesContext';

export function FavoritesDebug() {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const testVerse = {
    book: 'Test Book',
    bookId: 'test-book',
    chapter: '1',
    verse: '1',
    text: 'This is a test verse for debugging favorites functionality.',
    reference: 'Test Book 1:1',
  };

  const handleDirectAdd = () => {
    addFavorite(testVerse);
  };

  const handleDirectRemove = () => {
    const id = `${testVerse.bookId}-${testVerse.chapter}-${testVerse.verse}`;
    removeFavorite(id);
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
        Favorites Debug Panel
      </h3>
      
      <div className="space-y-3">
        <div>
          <strong>Total Favorites:</strong> {favorites.length}
        </div>
        
        <div>
          <strong>Test verse is favorited:</strong> {isFavorite(testVerse.bookId, testVerse.chapter, testVerse.verse) ? 'YES' : 'NO'}
        </div>
        
        <div className="flex gap-2 items-center">
          <FavoriteButton
            bookId={testVerse.bookId}
            chapter={testVerse.chapter}
            verse={testVerse.verse}
            verseData={testVerse}
            showText={true}
          />
          
          <button 
            onClick={handleDirectAdd}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Direct Add
          </button>
          
          <button 
            onClick={handleDirectRemove}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Direct Remove
          </button>
        </div>
        
        <div>
          <strong>LocalStorage Content:</strong>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(favorites, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
