/**
 * Unit tests for BibleBookCard component
 * Tests rendering, accessibility, and user interactions
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BibleBookCard, BibleBookGrid } from '@/components/bible/book-card';
import { BookMeta, Testament } from '@/types/bible';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  };
});

const mockOldTestamentBook: BookMeta = {
  id: 'genesis',
  name: 'Genesisy',
  fileName: 'genesisy',
  testament: Testament.OLD,
  chapterCount: 50,
};

const mockNewTestamentBook: BookMeta = {
  id: 'matthew',
  name: 'Matio',
  fileName: 'matio',
  testament: Testament.NEW,
  chapterCount: 28,
};

describe('BibleBookCard', () => {
  it('should render book name', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    expect(screen.getByText('Genesisy')).toBeInTheDocument();
  });

  it('should render as a link to book page', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/genesis');
  });

  it('should apply Old Testament styling', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    const card = screen.getByRole('link').firstChild as HTMLElement;
    expect(card).toHaveClass('border-l-blue-500');
  });

  it('should apply New Testament styling', () => {
    render(<BibleBookCard book={mockNewTestamentBook} />);
    
    const card = screen.getByRole('link').firstChild as HTMLElement;
    expect(card).toHaveClass('border-l-green-500');
  });

  it('should show testament when showTestament is true', () => {
    render(<BibleBookCard book={mockOldTestamentBook} showTestament={true} />);
    
    expect(screen.getByText('Testameta Taloha')).toBeInTheDocument();
  });

  it('should not show testament by default', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    expect(screen.queryByText('Testameta Taloha')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<BibleBookCard book={mockOldTestamentBook} className="custom-class" />);
    
    const card = screen.getByRole('link');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('block'); // Also check that it includes the base classes
  });

  it('should show chapter count when available', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    expect(screen.getByText('50 toko')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAccessibleName();
  });

  it('should handle hover states', () => {
    render(<BibleBookCard book={mockOldTestamentBook} />);
    
    const card = screen.getByRole('link');
    fireEvent.mouseEnter(card);
    
    // The hover styles are applied via CSS classes, so we just verify the element is present
    expect(card).toBeInTheDocument();
  });
});

describe('BibleBookGrid', () => {
  const mockBooks: BookMeta[] = [
    mockOldTestamentBook,
    mockNewTestamentBook,
    {
      id: 'exodus',
      name: 'Eksodosy',
      fileName: 'eksodosy',
      testament: Testament.OLD,
      chapterCount: 40,
    },
  ];

  it('should render all books', () => {
    render(<BibleBookGrid books={mockBooks} />);
    
    expect(screen.getByText('Genesisy')).toBeInTheDocument();
    expect(screen.getByText('Matio')).toBeInTheDocument();
    expect(screen.getByText('Eksodosy')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(<BibleBookGrid books={mockBooks} title="Test Books" />);
    
    expect(screen.getByText('Test Books')).toBeInTheDocument();
  });

  it('should apply grid layout with correct columns', () => {
    render(<BibleBookGrid books={mockBooks} columns={2} />);
    
    const grid = screen.getByTestId('bible-book-grid');
    expect(grid).toHaveClass('sm:grid-cols-2');
  });

  it('should use default 3 columns when not specified', () => {
    render(<BibleBookGrid books={mockBooks} />);
    
    const grid = screen.getByTestId('bible-book-grid');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });

  it('should pass showTestament prop to cards', () => {
    render(<BibleBookGrid books={mockBooks} showTestament={true} />);
    
    expect(screen.getAllByText('Testameta Taloha')).toHaveLength(2); // Two Old Testament books
    expect(screen.getByText('Testameta Vaovao')).toBeInTheDocument(); // One New Testament book
  });

  it('should apply custom className', () => {
    render(<BibleBookGrid books={mockBooks} className="custom-grid" />);
    
    const container = screen.getByTestId('bible-book-grid').parentElement;
    expect(container).toHaveClass('custom-grid');
  });

  it('should handle empty books array', () => {
    render(<BibleBookGrid books={[]} />);
    
    expect(screen.getByText('Tsy misy boky hita')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<BibleBookGrid books={mockBooks} title="Bible Books" />);
    
    expect(screen.getByText('Bible Books')).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockBooks.length);
    
    links.forEach((link) => {
      expect(link).toHaveAccessibleName();
    });
  });

  it('should handle responsive grid layout', () => {
    render(<BibleBookGrid books={mockBooks} />);
    
    const grid = screen.getByTestId('bible-book-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });
});

describe('BibleBookCard Integration', () => {
  it('should work correctly with actual Bible book data structure', () => {
    const realBook: BookMeta = {
      id: 'psalms',
      name: 'Salamo',
      fileName: 'salamo',
      testament: Testament.OLD,
      chapterCount: 150,
    };

    render(<BibleBookCard book={realBook} showTestament={true} />);
    
    expect(screen.getByText('Salamo')).toBeInTheDocument();
    expect(screen.getByText('150 toko')).toBeInTheDocument();
    expect(screen.getByText('Testameta Taloha')).toBeInTheDocument();
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/psalms');
  });

  it('should handle books without chapter count', () => {
    const bookWithoutChapters: BookMeta = {
      id: 'test-book',
      name: 'Test Book',
      fileName: 'test-book',
      testament: Testament.NEW,
    };

    render(<BibleBookCard book={bookWithoutChapters} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.queryByText('toko')).not.toBeInTheDocument();
  });
});
