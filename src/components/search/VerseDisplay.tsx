'use client';

import React, { useState } from 'react';
import { Copy, Share2, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { CompactFavoriteButton } from '@/components/favorites/FavoriteButton';

interface VerseResult {
  book: string;
  bookId: string;
  chapter: string;
  verse: string;
  text: string;
  reference: string;
}

interface SearchReferenceResponse {
  verses: VerseResult[];
  requestedCount: number;
  foundCount: number;
  book: string;
  chapter: string;
  executionTime: number;
}

interface VerseDisplayProps {
  searchResult: SearchReferenceResponse;
  className?: string;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ searchResult, className = '' }) => {
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
  const { verses, requestedCount, foundCount, executionTime } = searchResult;

  /**
   * Copy verse text to clipboard
   */
  const copyToClipboard = async (verse: VerseResult) => {
    try {
      const textToCopy = `${verse.reference}\n"${verse.text}"`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedVerse(verse.reference);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedVerse(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  /**
   * Share verse (Web Share API or fallback to clipboard)
   */
  const shareVerse = async (verse: VerseResult) => {
    const shareData = {
      title: `Baiboly - ${verse.reference}`,
      text: `"${verse.text}" - ${verse.reference}`,
      url: `${window.location.origin}/books/${verse.bookId}/${verse.chapter}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying share text
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        setCopiedVerse(verse.reference);
        setTimeout(() => setCopiedVerse(null), 2000);
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  /**
   * Copy all verses as formatted text
   */
  const copyAllVerses = async () => {
    const allText = verses.map(verse => 
      `${verse.reference}\n"${verse.text}"`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedVerse('all');
      setTimeout(() => setCopiedVerse(null), 2000);
    } catch (error) {
      console.error('Failed to copy all verses:', error);
    }
  };

  if (verses.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No verses found for the requested reference.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Result Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
                    rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-blue-700 dark:text-blue-300">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {foundCount} of {requestedCount} verses found
              </span>
            </div>
            {executionTime && (
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {executionTime}ms
              </div>
            )}
          </div>
          
          {verses.length > 1 && (
            <button
              onClick={copyAllVerses}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 
                       text-white rounded-md transition-colors"
            >
              {copiedVerse === 'all' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy All
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-4">
        {verses.map((verse, _index) => (
          <div
            key={`${verse.bookId}-${verse.chapter}-${verse.verse}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                     rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Verse Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 
                          dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {verse.reference}
              </h3>
              
              <div className="flex items-center space-x-2">
                <CompactFavoriteButton
                  bookId={verse.bookId}
                  chapter={verse.chapter}
                  verse={verse.verse}
                  verseData={{
                    book: verse.book,
                    text: verse.text,
                    reference: verse.reference,
                  }}
                />
                
                <button
                  onClick={() => copyToClipboard(verse)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                           dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                           rounded-md transition-colors"
                  title="Copy verse"
                >
                  {copiedVerse === verse.reference ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                
                <button
                  onClick={() => shareVerse(verse)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                           dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                           rounded-md transition-colors"
                  title="Share verse"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Verse Content */}
            <div className="p-4">
              <blockquote className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                "{verse.text}"
              </blockquote>
              
              {/* Verse Number Badge */}
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                               font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  Verse {verse.verse}
                </span>
                
                {/* Link to full chapter */}
                <a
                  href={`/books/${verse.bookId}/${verse.chapter}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 
                           dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  Read full chapter →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Missing Verses Warning */}
      {foundCount < requestedCount && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 
                      dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Some verses not found
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {requestedCount - foundCount} of the requested verses were not found. 
                This might be because the chapter doesn't contain those verse numbers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerseDisplay;
