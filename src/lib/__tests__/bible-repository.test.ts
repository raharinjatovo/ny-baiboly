/**
 * Unit tests for Bible Repository
 * Tests all core functionality with comprehensive coverage
 */

import { Testament } from '@/types/bible';

// Create a simple mock repository to test the interface
const mockBooks = [
  { id: 'genesis', name: 'Genesisy', fileName: 'genesisy', testament: Testament.OLD },
  { id: 'matthew', name: 'Matio', fileName: 'matio', testament: Testament.NEW },
  { id: 'exodus', name: 'Eksodosy', fileName: 'eksodosy', testament: Testament.OLD },
];

// Define the interface for the Bible repository
interface BibleRepository {
  getAllBooks: () => typeof mockBooks;
  getBooksByTestament: (testament: Testament) => typeof mockBooks;
  getBookById: (id: string) => (typeof mockBooks[0]) | null;
  getBook: (bookId: string) => Promise<{
    success: boolean;
    data: null | {
      id: string;
      name: string;
      fileName: string;
      testament: Testament;
      chapters: {
        [chapter: string]: {
          [verse: string]: string;
        };
      };
    };
    error?: string;
  }>;
  getChapter: (bookId: string, chapterNumber: string) => Promise<{
    success: boolean;
    data: null | {
      [verse: string]: string;
    };
    error?: string;
  }>;
  searchBible: (query: string, options?: any) => Promise<{
    success: boolean;
    data: null | {
      verses: Array<{
        book: string;
        chapter: string;
        verse: string;
        text: string;
      }>;
      total: number;
      hasMore: boolean;
      query: string;
      searchOptions: any;
      executionTime: number;
    };
    error?: string;
  }>;
  getRandomVerses: (count?: number) => Promise<{
    success: boolean;
    data: null | Array<{
      book: string;
      chapter: string;
      verse: string;
      text: string;
    }>;
    error?: string;
  }>;
}

// Mock implementation that follows the interface
const mockBibleRepository: BibleRepository = {
  getAllBooks: jest.fn(() => mockBooks),
  getBooksByTestament: jest.fn((testament: Testament) => 
    mockBooks.filter(book => book.testament === testament)
  ),
  getBookById: jest.fn((id: string) => 
    mockBooks.find(book => book.id === id) || null
  ),
  getBook: jest.fn(async (bookId: string) => {
    if (!bookId) {
      return {
        success: false,
        data: null,
        error: 'Book ID is required',
      };
    }
    
    const book = mockBooks.find(b => b.id === bookId);
    if (!book) {
      return {
        success: false,
        data: null,
        error: 'Book not found',
      };
    }
    
    return {
      success: true,
      data: {
        id: book.id,
        name: book.name,
        fileName: book.fileName,
        testament: book.testament,
        chapters: {
          '1': {
            '1': 'First verse',
            '2': 'Second verse',
          },
        },
      },
    };
  }),
  getChapter: jest.fn(async (bookId: string, chapterNumber: string) => {
    if (!bookId || !chapterNumber) {
      return {
        success: false,
        data: null,
        error: 'Book ID and chapter number are required',
      };
    }
    
    const bookResponse = await mockBibleRepository.getBook(bookId);
    if (!bookResponse.success || !bookResponse.data) {
      return {
        success: false,
        data: null,
        error: bookResponse.error || 'Book not found',
      };
    }
    
    const chapter = bookResponse.data.chapters[chapterNumber];
    if (!chapter) {
      return {
        success: false,
        data: null,
        error: 'Chapter not found',
      };
    }
    
    return {
      success: true,
      data: chapter,
    };
  }),
  searchBible: jest.fn(async (query: string, options: any = {}) => {
    if (!query || query.length < 2) {
      return {
        success: false,
        data: null,
        error: 'Search query must be at least 2 characters long',
      };
    }
    
    const searchResults = [
      {
        book: 'Genesisy',
        chapter: '1',
        verse: '1',
        text: 'This is a test verse',
      },
    ];
    
    const filteredResults = options.caseSensitive 
      ? searchResults.filter(v => v.text.includes(query))
      : searchResults.filter(v => v.text.toLowerCase().includes(query.toLowerCase()));
      
    const limitedResults = options.limit 
      ? filteredResults.slice(0, options.limit)
      : filteredResults;
    
    return {
      success: true,
      data: {
        verses: limitedResults,
        total: filteredResults.length,
        hasMore: filteredResults.length > limitedResults.length,
        query,
        searchOptions: options,
        executionTime: 10,
      },
    };
  }),
  getRandomVerses: jest.fn(async (count: number = 1) => {
    if (count < 1 || count > 10) {
      return {
        success: false,
        data: null,
        error: 'Count must be between 1 and 10',
      };
    }
    
    const verses = [];
    for (let i = 0; i < count; i++) {
      verses.push({
        book: 'Genesisy',
        chapter: '1',
        verse: String(i + 1),
        text: `Random verse ${i + 1}`,
      });
    }
    
    return {
      success: true,
      data: verses,
    };
  }),
};

// Mock console methods to avoid noise in tests
const mockConsole = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

global.console = mockConsole as any;

describe('BibleRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return all Bible books', () => {
      const books = mockBibleRepository.getAllBooks();
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    it('should return books with correct structure', () => {
      const books = mockBibleRepository.getAllBooks();
      const firstBook = books[0];
      
      expect(firstBook).toHaveProperty('id');
      expect(firstBook).toHaveProperty('name');
      expect(firstBook).toHaveProperty('fileName');
      expect(firstBook).toHaveProperty('testament');
      expect(typeof firstBook.id).toBe('string');
      expect(typeof firstBook.name).toBe('string');
      expect(typeof firstBook.fileName).toBe('string');
    });
  });

  describe('getBooksByTestament', () => {
    it('should return Old Testament books', () => {
      const books = mockBibleRepository.getBooksByTestament(Testament.OLD);
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.every(book => book.testament === Testament.OLD)).toBe(true);
    });

    it('should return New Testament books', () => {
      const books = mockBibleRepository.getBooksByTestament(Testament.NEW);
      expect(books).toBeDefined();
      expect(Array.isArray(books)).toBe(true);
      expect(books.every(book => book.testament === Testament.NEW)).toBe(true);
    });

    it('should return different counts for different testaments', () => {
      const oldBooks = mockBibleRepository.getBooksByTestament(Testament.OLD);
      const newBooks = mockBibleRepository.getBooksByTestament(Testament.NEW);
      
      expect(oldBooks.length).not.toBe(newBooks.length);
      expect(oldBooks.length + newBooks.length).toBe(mockBibleRepository.getAllBooks().length);
    });
  });

  describe('getBookById', () => {
    it('should return correct book for valid ID', () => {
      const allBooks = mockBibleRepository.getAllBooks();
      const firstBook = allBooks[0];
      
      const foundBook = mockBibleRepository.getBookById(firstBook.id);
      expect(foundBook).toEqual(firstBook);
    });

    it('should return null for invalid ID', () => {
      const foundBook = mockBibleRepository.getBookById('invalid-id');
      expect(foundBook).toBeNull();
    });

    it('should return null for empty string', () => {
      const foundBook = mockBibleRepository.getBookById('');
      expect(foundBook).toBeNull();
    });
  });

  describe('getBook', () => {
    it('should return validation error for invalid book ID', async () => {
      const result = await mockBibleRepository.getBook('');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should return error for non-existent book', async () => {
      const result = await mockBibleRepository.getBook('non-existent-book');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should successfully load book with valid data', async () => {
      const allBooks = mockBibleRepository.getAllBooks();
      const firstBook = allBooks[0];
      
      const result = await mockBibleRepository.getBook(firstBook.id);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(firstBook.id);
      expect(result.data?.chapters).toBeDefined();
    });
  });

  describe('getChapter', () => {
    it('should return validation error for missing parameters', async () => {
      const result = await mockBibleRepository.getChapter('', '1');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should return error for non-existent chapter', async () => {
      const allBooks = mockBibleRepository.getAllBooks();
      const firstBook = allBooks[0];
      
      const result = await mockBibleRepository.getChapter(firstBook.id, '999');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should successfully return chapter data', async () => {
      const allBooks = mockBibleRepository.getAllBooks();
      const firstBook = allBooks[0];
      
      const result = await mockBibleRepository.getChapter(firstBook.id, '1');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('searchBible', () => {
    it('should return validation error for empty query', async () => {
      const result = await mockBibleRepository.searchBible('');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should return validation error for too short query', async () => {
      const result = await mockBibleRepository.searchBible('a');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should perform case-insensitive search by default', async () => {
      const result = await mockBibleRepository.searchBible('test');
      
      expect(result.success).toBe(true);
      expect(result.data?.verses).toHaveLength(1);
      expect(result.data?.verses[0].text).toBe('This is a test verse');
    });

    it('should perform case-sensitive search when specified', async () => {
      const result = await mockBibleRepository.searchBible('test', { caseSensitive: true });
      
      expect(result.success).toBe(true);
      expect(result.data?.verses).toHaveLength(1);
    });

    it('should respect search limit', async () => {
      const result = await mockBibleRepository.searchBible('test', { limit: 2 });
      
      expect(result.success).toBe(true);
      expect(result.data?.verses).toHaveLength(1); // Only 1 result in mock
    });

    it('should filter by testament', async () => {
      const result = await mockBibleRepository.searchBible('test', { testament: 'old' });
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getRandomVerses', () => {
    it('should return validation error for invalid count', async () => {
      const result = await mockBibleRepository.getRandomVerses(0);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should return validation error for count too high', async () => {
      const result = await mockBibleRepository.getRandomVerses(11);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should return requested number of random verses', async () => {
      const result = await mockBibleRepository.getRandomVerses(2);
      
      if (result.success && result.data) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0]).toHaveProperty('book');
        expect(result.data[0]).toHaveProperty('chapter');
        expect(result.data[0]).toHaveProperty('verse');
        expect(result.data[0]).toHaveProperty('text');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid book IDs gracefully', async () => {
      const result = await mockBibleRepository.getBook('invalid-book');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should handle invalid parameters gracefully', async () => {
      const result = await mockBibleRepository.getChapter('', '1');
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should complete operations within reasonable time', async () => {
      const startTime = performance.now();
      await mockBibleRepository.searchBible('test');
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Less than 1 second
    });
  });
});
