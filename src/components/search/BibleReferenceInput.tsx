'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { BOOKS_BY_ENGLISH_NAME } from '@/constants/bible';

interface BibleReferenceInputProps {
  onSearch: (reference: {
    book: string;
    chapter: number;
    verses: (number | { start: number; end?: number })[];
  }) => void;
  isLoading?: boolean;
  className?: string;
}

const BibleReferenceInput: React.FC<BibleReferenceInputProps> = ({
  onSearch,
  isLoading = false,
  className = '',
}) => {
  const [referenceInput, setReferenceInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Parse verse input into array of numbers and ranges
   */
  const parseVerses = (input: string): (number | { start: number; end?: number })[] => {
    const verses: (number | { start: number; end?: number })[] = [];
    const parts = input.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      
      if (trimmed.includes('-')) {
        // Range (e.g., "1-5")
        const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
        if (isNaN(start) || isNaN(end)) {
          throw new Error(`Invalid verse range: ${trimmed}`);
        }
        if (end < start) {
          throw new Error(`Invalid range: ${start}-${end}`);
        }
        verses.push({ start, end });
      } else {
        // Single verse
        const verseNum = parseInt(trimmed);
        if (isNaN(verseNum)) {
          throw new Error(`Invalid verse number: ${trimmed}`);
        }
        verses.push(verseNum);
      }
    }

    return verses;
  };

  /**
   * Parse reference string (e.g., "John 3:16" or "Genesis 1:1-3")
   */
  const parseReferenceString = (referenceStr: string) => {
    const trimmed = referenceStr.trim();
    
    // Try to match pattern: "Book Chapter:Verses"
    const match = trimmed.match(/^(.+?)\s+(\d+):(.+)$/);
    if (!match) {
      throw new Error('Invalid format. Use: "Book Chapter:Verses" (e.g., "John 3:16" or "Genesis 1:1-3")');
    }

    const [, bookPart, chapterPart, versesPart] = match;
    
    // Validate book
    const bookName = bookPart.trim().toLowerCase();
    if (!BOOKS_BY_ENGLISH_NAME.has(bookName)) {
      throw new Error(`Book "${bookPart.trim()}" not found. Please check spelling or use a different name.`);
    }

    // Validate chapter
    const chapterNum = parseInt(chapterPart);
    if (isNaN(chapterNum) || chapterNum < 1) {
      throw new Error('Chapter must be a positive number');
    }

    // Parse and validate verses
    const verses = parseVerses(versesPart.trim());
    if (verses.length === 0) {
      throw new Error('Please enter at least one verse');
    }

    if (verses.length > 10) {
      throw new Error('Maximum 10 verses or ranges allowed per search');
    }

    return {
      book: bookName,
      chapter: chapterNum,
      verses,
    };
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!referenceInput.trim()) {
        throw new Error('Please enter a Bible reference');
      }

      const parsedReference = parseReferenceString(referenceInput);
      onSearch(parsedReference);

    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Single Reference Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bible Reference
          </label>
          <input
            type="text"
            value={referenceInput}
            onChange={(e) => {
              setReferenceInput(e.target.value);
              setError(null);
            }}
            placeholder="e.g., John 3:16 or Genesis 1:1-3 or Psalm 23:1,4,6"
            className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500"
            autoComplete="off"
            autoFocus
          />
        </div>

        {/* Format Examples */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 
                      rounded-lg p-4 text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-200 mb-2">Supported formats:</p>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1">
            <li><strong>Single verse:</strong> John 3:16</li>
            <li><strong>Multiple verses:</strong> Psalm 23:1,4,6</li>
            <li><strong>Verse range:</strong> Genesis 1:1-5</li>
            <li><strong>Mixed format:</strong> Romans 8:1-3,28,35</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 
                        border border-red-200 dark:border-red-800 rounded-md px-4 py-3">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                   disabled:bg-blue-400 text-white font-medium text-lg rounded-lg shadow-md transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-3" />
              Search Bible Reference
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BibleReferenceInput;
